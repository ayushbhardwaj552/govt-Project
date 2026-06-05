import React, { useEffect, useState } from 'react';
import { FiMessageSquare, FiCalendar, FiEdit, FiAward, FiCompass, FiHelpCircle, FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import Header from '../HomePages/Header.jsx'; // Adjust the path to your Header component if needed
import { Link } from 'react-router-dom';

// You can easily add, remove, or edit facilities by changing this array
const facilitiesList = [
    {
        icon: <FiMessageSquare size={32} />,
        title: 'Submit a Complaint',
        description: 'Voice your concerns directly. Our office is dedicated to addressing and resolving public grievances efficiently.',
        link: '/login', // Link to the citizen portal's complaint section
    },
    {
        icon: <FiCalendar size={32} />,
        title: 'Request an Appointment',
        description: 'Schedule a meeting with the MLA to discuss important issues, proposals, or personal matters.',
        link: '/login', // Link to the meeting request section
    },
    {
        icon: <FiEdit size={32} />,
        title: 'Document Attestation',
        description: 'Get your important official and personal documents attested and verified at our constituency office.',
        link: '/contact',
    },
    {
        icon: <FiAward size={32} />,
        title: 'Government Schemes',
        description: 'Get information and assistance for enrolling in various central and state government welfare schemes.',
        link: '#',
    },
    {
        icon: <FiCompass size={32} />,
        title: 'Local Area Development',
        description: 'Provide suggestions and track the progress of development projects happening in your local area.',
        link: '#',
    },
    {
        icon: <FiHelpCircle size={32} />,
        title: 'General Assistance',
        description: 'For any other inquiries or assistance, our office staff is always available to help and guide you.',
        link: '/contact',
    },
];

const Facilities = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="bg-gradient-to-b from-gray-500 to-amber-50 min-h-screen">
            <Header />
            <div className={`p-4 md:p-8 transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
                <div className="max-w-7xl mx-auto">

                    {/* --- Page Header & Back Button --- */}
                    <div className="mb-8 md:mb-12">
                        <Link to="/" className="mb-4 inline-flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors duration-300 font-semibold group">
                            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center">Services & Facilities</h1>
                        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto text-center">
                            Our office provides a range of services to support the residents of the Etmadpur constituency. We are committed to ensuring accessible and responsive governance.
                        </p>
                    </div>

                    {/* --- Facilities Grid --- */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {facilitiesList.map((facility, index) => (
                            <div 
                                key={index} 
                                className="bg-white shadow-xl rounded-xl p-6 flex flex-col text-center items-center transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl"
                                style={{ transitionDelay: `${index * 100}ms` }}
                            >
                                <div className="p-4 bg-orange-100 text-orange-600 rounded-full mb-4">
                                    {facility.icon}
                                </div>
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">{facility.title}</h3>
                                <p className="text-gray-600 mb-6 flex-grow">{facility.description}</p>
                                <Link
                                    to={facility.link}
                                    className="mt-auto w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center gap-2"
                                >
                                    Learn More <FiArrowRight size={18} />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Facilities;