import React, { useEffect, useState } from 'react';
import { FiMail, FiPhone, FiMapPin, FiClock, FiSend, FiArrowLeft,FiHome } from 'react-icons/fi';
import Header from '../HomePages/Header.jsx'; // Adjust path to your Header component if needed
import { Link } from 'react-router-dom';

const ContactUs = () => {
    // State for animations
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    // State for the contact form
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Here you would typically handle the form submission, e.g., send data to an API
        alert(`Thank you for your message, ${formData.name}!`);
        // Reset form after submission
        setFormData({ name: '', email: '', subject: '', message: '' });
    };

    return (
        <div className="bg-gradient-to-b from-gray-400 to-amber-50">
            <Header />
            <div className={`p-4 md:p-8 min-h-full transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
                <div className="max-w-7xl mx-auto">

                    {/* --- Page Header & Back Button --- */}
                    <div className="mb-8">
                        <Link to="/" className="mb-4 inline-flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors duration-300 font-semibold group">
                            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center">Get In Touch</h1>
                        <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto text-center">
                            We're here to help. Whether you have a question, a suggestion, or need assistance, please don't hesitate to reach out.
                        </p>
                    </div>

                    {/* --- Main Content Grid --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        
                        {/* Left Column: Contact Info & Hours */}
                        <div className="space-y-8">
                            {/* Contact Details Card */}
                            <div className="bg-white shadow-xl rounded-xl p-6 transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3"><FiHome className="text-orange-500" /> Office Information</h3>
                                <ul className="space-y-4">
                                    <li className="flex items-start gap-4">
                                        <FiMapPin className="text-orange-500 text-2xl flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-gray-700">Address</h4>
                                            {/* TODO: Replace with your actual office address */}
                                            <p className="text-gray-600">MLA Camp Office, Etmadpur, Agra, Uttar Pradesh, 283202</p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <FiPhone className="text-orange-500 text-2xl flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-gray-700">Phone</h4>
                                            {/* TODO: Replace with your actual phone number */}
                                            <p className="text-gray-600 hover:text-blue-600 transition-colors"><a href="tel:+910000000000">+91 (000) 000-0000</a></p>
                                        </div>
                                    </li>
                                    <li className="flex items-start gap-4">
                                        <FiMail className="text-orange-500 text-2xl flex-shrink-0 mt-1" />
                                        <div>
                                            <h4 className="font-semibold text-gray-700">Email</h4>
                                            {/* TODO: Replace with your actual email address */}
                                            <p className="text-gray-600 hover:text-blue-600 transition-colors"><a href="mailto:contact@mlaoffice.com">contact@mlaoffice.com</a></p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                            
                            {/* Office Hours Card */}
                            <div className="bg-white shadow-xl rounded-xl p-6 transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl">
                                <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-3"><FiClock className="text-orange-500" /> Office Hours</h3>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex justify-between"><span>Monday - Friday</span> <span className="font-semibold">10:00 AM - 05:00 PM</span></li>
                                    <li className="flex justify-between"><span>Saturday</span> <span className="font-semibold">10:00 AM - 01:00 PM</span></li>
                                    <li className="flex justify-between border-t pt-2 mt-2"><span>Sunday & Public Holidays</span> <span className="font-semibold text-red-500">Closed</span></li>
                                </ul>
                            </div>
                        </div>

                        {/* Right Column: Contact Form */}
                        <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl">
                             <h3 className="text-2xl font-bold text-gray-800 mb-6">Send a Message</h3>
                             <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input type="text" name="name" id="name" required value={formData.name} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                                </div>
                                <div>
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                                    <input type="email" name="email" id="email" required value={formData.email} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                                </div>
                                <div>
                                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                                    <input type="text" name="subject" id="subject" required value={formData.subject} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"/>
                                </div>
                                <div>
                                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                                    <textarea name="message" id="message" rows="5" required value={formData.message} onChange={handleInputChange} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"></textarea>
                                </div>
                                <div>
                                    <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-blue-700 hover:scale-105 transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center gap-2">
                                        <FiSend /> Send Message
                                    </button>
                                </div>
                             </form>
                        </div>
                    </div>

                    {/* --- Map Section --- */}
                    <div className="mt-12 bg-white shadow-xl rounded-xl p-4 transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl overflow-hidden">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Our Constituency Location</h3>
                        <div className="aspect-w-16 aspect-h-9">
                           {/* TODO: Replace with the actual Google Maps embed iframe */}
                           <iframe 
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56789.70777218698!2d78.1402283513672!3d27.189568900000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39746571146886e9%3A0x794d509375103c83!2sEtmadpur%2C%20Uttar%20Pradesh%20283202!5e0!3m2!1sen!2sin!4v1724440858102!5m2!1sen!2sin" 
                                width="100%" 
                                height="450" 
                                style={{ border: 0 }} 
                                allowFullScreen="" 
                                loading="lazy" 
                                referrerPolicy="no-referrer-when-downgrade"
                                className="rounded-lg"
                            ></iframe>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default ContactUs;