import Invitation from '../models/invitationSchema.js';
import User from '../models/userSchema.js'; // This is your unified collection for both citizens and MLAs
import sendEmail from '../utils/sendEmail.js';
import sendSms from '../utils/sendSms.js';

export const createInvitation = async (req, res) => {
    try {
        const {
            mlaId,
            inviterName,
            inviterPhone,
            inviterEmail,
            subject, 
            jobProfile, 
            eventType,
            eventDate,
            eventTime,
            eventLocation,
            message
        } = req.body;

        const citizenId = req.user._id;

        // --- Validation ---
        if (!mlaId || !inviterName || !inviterPhone || !inviterEmail || !subject || !jobProfile || !eventType || !eventDate || !eventTime || !eventLocation || !message) {
            return res.status(400).json({ success: false, message: "Please fill all required fields." });
        }

        // Check inside the unified User collection for the MLA record
        const mla = await User.findById(mlaId);
        if (!mla || mla.role !== 'mla') {
            return res.status(404).json({ success: false, message: "MLA profile not found in our records." });
        }

        // --- File Handling ---
        const uploadedFiles = [];
        if (req.files && req.files.length > 0) {
            req.files.forEach(file => {
                let type;
                if (file.mimetype.startsWith('image/')) type = 'image';
                else if (file.mimetype.startsWith('video/')) type = 'video';
                else if (file.mimetype === 'application/pdf') type = 'pdf';
                
                if (type) {
                    uploadedFiles.push({ url: file.path, fileType: type });
                }
            });
        }

        // --- Create the new invitation ---
        const newInvitation = await Invitation.create({
            submittedBy: citizenId,
            mlaId,
            inviterName,
            inviterPhone,
            inviterEmail,
            subject,
            jobProfile,
            eventType,
            eventDate,
            eventTime,
            eventLocation,
            message,
            mediaFiles: uploadedFiles
        });

        // --- Send Confirmation Email ---
        try {
            const emailSubject = `Invitation for ${newInvitation.eventType}`;
            const emailMessage = `Dear ${newInvitation.inviterName},\n\nThis email confirms that your invitation for the ${newInvitation.eventType} on ${new Date(newInvitation.eventDate).toLocaleDateString()} at ${newInvitation.eventTime} has been sent to the MLA's office.\n\nThank you.\n\nSincerely,\nMLA Office`;
            
            await sendEmail({
                email: newInvitation.inviterEmail,
                subject: emailSubject,
                message: emailMessage,
            });
        } catch (notificationError) {
            console.error("Invitation created, but failed to send confirmation email.", notificationError);
        }

        res.status(201).json({
            success: true,
            message: "Your invitation has been sent successfully. A confirmation email has been sent to you.",
            invitation: newInvitation,
        });

    } catch (error) {
        console.error("Error creating invitation:", error);
        res.status(500).json({ success: false, message: "Server error while sending your invitation." });
    }
};

export const getInvitationHistory = async (req, res) => {
    try {
        const citizenId = req.user._id;

        // Explicitly passing 'User' model configuration inside populate to fix the missing schema error
        const invitations = await Invitation.find({ submittedBy: citizenId })
            .populate({ path: 'mlaId', model: User, select: 'fullName' })
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: invitations.length,
            invitations,
        });

    } catch (error) {
        console.error("Error fetching invitation history:", error);
        res.status(500).json({ success: false, message: "Server error while fetching invitation history." });
    }
};

export const getMlaInvitations = async (req, res) => {
    try {
        const mlaId = req.user._id;

        // Explicitly matching against the User model registration instance
        const allInvitations = await Invitation.find({ mlaId: mlaId })
            .populate({ path: 'submittedBy', model: User, select: 'fullName email phone' })
            .sort({ eventDate: 1 });

        await Invitation.updateMany(
            { mlaId: mlaId, status: 'Sent' },
            { $set: { status: 'Seen' } }
        );

        const newInvitations = allInvitations.filter(i => i.status === 'Sent' || i.status === 'Seen');
        const respondedInvitations = allInvitations.filter(i => i.status === 'Accepted' || i.status === 'Declined');

        res.status(200).json({
            success: true,
            data: {
                newInvitations,
                respondedInvitations,
            },
            summary: {
                total: allInvitations.length,
                new: newInvitations.length,
                responded: respondedInvitations.length,
            }
        });

    } catch (error) {
        console.error("Error fetching MLA invitations:", error);
        res.status(500).json({ success: false, message: "Server error while fetching invitations." });
    }
};

export const respondToInvitation = async (req, res) => {
    try {
        const { invitationId } = req.params;
        const { responseStatus, responseMessage, subject } = req.body;
        const mlaId = req.user._id;

        if (!responseStatus || !['Accepted', 'Declined'].includes(responseStatus)) {
            return res.status(400).json({ success: false, message: "A valid response status ('Accepted' or 'Declined') is required." });
        }

        const invitation = await Invitation.findById(invitationId);
        if (!invitation) {
            return res.status(404).json({ success: false, message: "Invitation not found." });
        }

        if (invitation.mlaId.toString() !== mlaId.toString()) {
            return res.status(403).json({ success: false, message: "Forbidden: You cannot respond to this invitation." });
        }

        invitation.status = responseStatus;
        invitation.mlaResponse = responseMessage || (responseStatus === 'Accepted' ? 'Thank you for the invitation. I will be there.' : 'Thank you for the invitation, but I am unable to attend.');
        await invitation.save();

        try {
            const emailSubject = `Response to your invitation: ${subject || invitation.eventType}`;
            const emailMessage = `Dear ${invitation.inviterName},\n\n`
                               + `The MLA's office has responded to your invitation.\n\n`
                               + `Invitation Subject: "${invitation.subject}"\n`
                               + `Your Role: ${invitation.jobProfile}\n\n`
                               + `Response: "${invitation.mlaResponse}"\n\n`
                               + `Thank you.`;

            const smsMessage = `You have a new response from the MLA's office regarding your invitation for ${invitation.subject}. Please check your email for details.`;

            await sendEmail({ email: invitation.inviterEmail, subject: emailSubject, message: emailMessage });
            await sendSms(invitation.inviterPhone, smsMessage);
        } catch (notificationError) {
            console.error("Invitation response saved, but failed to send notifications.", notificationError);
        }

        res.status(200).json({
            success: true,
            message: `Your response ('${responseStatus}') has been saved and sent to the citizen.`,
            invitation,
        });

    } catch (error) {
        console.error("Error responding to invitation:", error);
        res.status(500).json({ success: false, message: "Server error while responding to invitation." });
    }
};

export const getMlaInvitationDashboard = async (req, res) => {
    try {
        const mlaId = req.user._id;
        const now = new Date();

        await Invitation.updateMany(
            { mlaId: mlaId, status: { $in: ['Sent', 'Seen'] }, eventDate: { $lt: now } },
            { $set: { status: 'Expired' } }
        );

        const allInvitations = await Invitation.find({ mlaId: mlaId })
            .sort({ eventDate: 1 });

        const upcomingInvitations = allInvitations.filter(i =>
            i.status === 'Sent' || i.status === 'Seen'
        );

        const invitationHistory = allInvitations.filter(i =>
            i.status === 'Accepted' || i.status === 'Declined' || i.status === 'Expired'
        );

        res.status(200).json({
            success: true,
            data: {
                upcomingInvitations,
                invitationHistory,
            },
            summary: {
                total: allInvitations.length,
                upcoming: upcomingInvitations.length,
                history: invitationHistory.length,
            }
        });

    } catch (error) {
        console.error("Error fetching MLA invitation dashboard:", error);
        res.status(500).json({ success: false, message: "Server error while fetching invitation data." });
    }
};

export const getInvitationDetails = async (req, res) => {
    try {
        const { invitationId } = req.params;
        const mlaId = req.user._id;
          
        const invitation = await Invitation.findById(invitationId)
            .populate({ path: 'submittedBy', model: User, select: 'fullName email phone jobProfile' });
        
        if (!invitation) {
            return res.status(404).json({ success: false, message: "Invitation not found." });
        }

        if (invitation.mlaId.toString() !== mlaId.toString()) {
            return res.status(403).json({ success: false, message: "Forbidden: You are not authorized to view this invitation." });
        }

        res.status(200).json({ 
            success: true, 
            data: invitation 
        });

    } catch (error) {
        console.error("Error fetching invitation details:", error);
        res.status(500).json({ success: false, message: "Server error while fetching invitation details." });
    }
};