import twilio from 'twilio';

const sendSms = async (to, body) => {
  // 1. Get Twilio credentials from environment variables
  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken = process.env.TWILIO_AUTH_TOKEN;
  const twilioNumber = process.env.TWILIO_PHONE_NUMBER;

  // 2. Check if all required credentials are provided
  if (!accountSid || !authToken || !twilioNumber) {
    console.error("Twilio credentials are missing in .env file. SMS not sent.");
    return;
  }

  // 3. Initialize the Twilio client
  const client = twilio(accountSid, authToken);

  try {
    // 4. Send the SMS
    const message = await client.messages.create({
      body: body,
      from: twilioNumber,
      to: `+91${to}` // Assuming Indian numbers, adds the country code. Adjust if needed.
    });

    console.log("✅ SMS sent successfully via Twilio. SID:", message.sid);
  } catch (error) {
    console.error('🚨 Error sending SMS with Twilio:', error);
  }
};

export default sendSms;