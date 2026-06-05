import React, { useEffect, useState } from 'react';
import { FiBriefcase, FiCalendar, FiHome, FiMapPin, FiAward, FiBookOpen, FiArrowLeft, FiExternalLink } from 'react-icons/fi';
import Header from '../HomePages/Header.jsx';
import { Link } from 'react-router-dom';

// --- Image Placeholders ---
// Replace with your actual image URLs
const mlaImageUrl = '/assets/mlaImage.jpeg';
const bjpLogoUrl = '/assets/bjpLogo.jpeg';
const cmImageUrl = '/assets/CmImage.jpeg';
const upGovLogoUrl = '/assets/upGovt.png';
const indiaGovLogoUrl = '/assets/india.png';

const AboutUs = () => {
    const [isMounted, setIsMounted] = useState(false);
    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className="bg-gradient-to-b from-gray-500 to-amber-50">
            <Header/>
            <div className={`p-4 md:p-8 min-h-full transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
                <div className="max-w-7xl mx-auto">

                    {/* --- Back to Home Button --- */}
                    <Link to="/" className="mb-6 inline-flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors duration-300 font-semibold group">
                        <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </Link>

                    {/* --- State Leadership & Party Section (MOVED UP) --- */}
                    <section className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white shadow-xl rounded-xl p-6 flex flex-col items-center justify-center transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl">
                             <img src={cmImageUrl} alt="Yogi Adityanath, Chief Minister of UP" className="w-28 h-28 rounded-full object-cover mb-4 border-4 border-amber-300"/>
                             <h3 className="text-xl font-bold text-gray-800">State Leadership</h3>
                             <p className="text-md text-gray-600">Yogi Adityanath, Chief Minister</p>
                        </div>
                        <div className="bg-white shadow-xl rounded-xl p-6 flex flex-col items-center justify-center transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl">
                             <img src={bjpLogoUrl} alt="Bharatiya Janata Party Logo" className="w-28 h-28 object-contain mb-4"/>
                             <h3 className="text-xl font-bold text-gray-800">Political Party</h3>
                             <p className="text-md text-gray-600">Bharatiya Janata Party (BJP)</p>
                        </div>
                    </section>

                    {/* --- MLA Hero Section --- */}
                    <header className="bg-white shadow-xl rounded-xl p-6 md:p-8 mb-8 flex flex-col md:flex-row items-center gap-6 md:gap-10 transform transition-all duration-500 delay-200">
                        <img
                            src={mlaImageUrl}
                            alt="Dr. Dharampal Singh"
                            className="w-32 h-32 md:w-48 md:h-48 rounded-full object-cover shadow-2xl border-4 border-orange-500"
                        />
                        <div className="text-center md:text-left">
                            <h1 className="text-3xl md:text-5xl font-bold text-gray-800">Dr. Dharampal Singh</h1>
                            <p className="text-lg md:text-xl text-orange-600 font-semibold mt-2">
                                Member of Legislative Assembly (MLA)
                            </p>
                            <p className="text-md text-gray-500 mt-1">Etmadpur Constituency, Agra, Uttar Pradesh</p>
                        </div>
                    </header>

                    {/* --- Biography & Vision Section --- */}
                    <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                        <div className="lg:col-span-2 bg-white shadow-xl rounded-xl p-6 md:p-8 transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl">
                            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-3 mb-4 flex items-center gap-3">
                                <FiBookOpen className="text-orange-500" /> About Dr. Singh
                            </h2>
                            <p className="text-gray-700 leading-relaxed mb-4">
                                Dr. Dharampal Singh is a distinguished Indian politician and a dedicated member of the 16th and 18th Legislative Assembly of India. A former teacher, he holds a Doctor of Philosophy degree from Dr. Bhimrao Ambedkar University, Agra. His career in public service is driven by a profound commitment to the progress of Uttar Pradesh and the welfare of the people in his constituency of Etmadpur.
                            </p>
                            <p className="text-gray-700 leading-relaxed">
                                He is an active member of the Bharatiya Janata Party (BJP), having previously been associated with the Bahujan Samaj Party. His work focuses on grassroots development, education, and ensuring that the voice of every citizen is heard in the legislative assembly.
                            </p>
                        </div>
                        <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl">
                            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-3 mb-4 flex items-center gap-3">
                                <FiAward className="text-orange-500" /> Our Vision
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                                To build a progressive, secure, and prosperous Etmadpur through inclusive development and transparent governance. We are committed to empowering our community by improving infrastructure, education, and public services for all residents.
                            </p>
                        </div>
                    </section>
                    
                    {/* --- Political Career & Personal Details (Combined for better flow) --- */}
                    <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                        <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl">
                            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-3 mb-6 flex items-center gap-3">
                                <FiBriefcase className="text-orange-500" /> Political Career
                            </h2>
                            <div className="relative border-l-4 border-orange-200 ml-4 pl-8 py-4">
                                <div className="mb-8 relative">
                                    <div className="absolute -left-11 top-1 w-6 h-6 bg-orange-500 rounded-full border-4 border-white shadow-md"></div>
                                    <p className="text-sm text-gray-500">March 2022 - Present</p>
                                    <h3 className="text-lg font-semibold text-gray-700">Member, 18th Legislative Assembly</h3>
                                    <p className="text-md text-gray-600">Bharatiya Janata Party (BJP)</p>
                                </div>
                                <div className="relative">
                                    <div className="absolute -left-11 top-1 w-6 h-6 bg-orange-500 rounded-full border-4 border-white shadow-md"></div>
                                    <p className="text-sm text-gray-500">March 2012 - March 2017</p>
                                    <h3 className="text-lg font-semibold text-gray-700">Member, 16th Legislative Assembly</h3>
                                    <p className="text-md text-gray-600">Bahujan Samaj Party (BSP)</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white shadow-xl rounded-xl p-6 md:p-8 transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl">
                            <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-3 mb-6 flex items-center gap-3">
                                <FiHome className="text-orange-500" /> Personal Details
                            </h2>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <FiCalendar className="text-orange-500 text-2xl flex-shrink-0" />
                                    <div>
                                        <span className="text-sm text-gray-500">Born</span>
                                        <p className="font-semibold text-gray-700">1 June 1963, Mainpuri district</p>
                                    </div>
                                </li>
                                <li className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <FiMapPin className="text-orange-500 text-2xl flex-shrink-0" />
                                    <div>
                                        <span className="text-sm text-gray-500">Residence</span>
                                        <p className="font-semibold text-gray-700">Agra district, Uttar Pradesh</p>
                                    </div>
                                </li>
                                <li className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <FiBookOpen className="text-orange-500 text-2xl flex-shrink-0" />
                                    <div>
                                        <span className="text-sm text-gray-500">Education</span>
                                        <p className="font-semibold text-gray-700">Doctor of Philosophy (Ph.D.)</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* --- NEW: Important Government Links Section --- */}
                    <section className="bg-white shadow-xl rounded-xl p-6 md:p-8 transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl">
                        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-gray-200 pb-3 mb-6 text-center">
                            Important Government Links
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            <a href="https://up.gov.in/" target="_blank" rel="noopener noreferrer" className="group block p-4 bg-amber-50 rounded-lg hover:bg-blue-100 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <img src={upGovLogoUrl} alt="UP Government" className="h-12 w-12 object-contain"/>
                                    <div>
                                        <h4 className="font-bold text-gray-800">UP Government</h4>
                                        <p className="text-sm text-blue-600 group-hover:underline flex items-center gap-1">Visit Site <FiExternalLink size={12}/></p>
                                    </div>
                                </div>
                            </a>
                             <a href="https://india.gov.in/" target="_blank" rel="noopener noreferrer" className="group block p-4 bg-amber-50 rounded-lg hover:bg-blue-100 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <img src={indiaGovLogoUrl} alt="National Portal of India" className="h-12 w-12 object-contain"/>
                                    <div>
                                        <h4 className="font-bold text-gray-800">National Portal</h4>
                                        <p className="text-sm text-blue-600 group-hover:underline flex items-center gap-1">Visit Site <FiExternalLink size={12}/></p>
                                    </div>
                                </div>
                            </a>
                             <a href="https://cm.up.gov.in/" target="_blank" rel="noopener noreferrer" className="group block p-4 bg-amber-50 rounded-lg hover:bg-blue-100 hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center gap-4">
                                    <img src={upGovLogoUrl} alt="UP CM Office" className="h-12 w-12 object-contain"/>
                                    <div>
                                        <h4 className="font-bold text-gray-800">CM Office</h4>
                                        <p className="text-sm text-blue-600 group-hover:underline flex items-center gap-1">Visit Site <FiExternalLink size={12}/></p>
                                    </div>
                                </div>
                            </a>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default AboutUs;