import React from "react";
import { Link } from "react-router-dom";
import { useState,useEffect } from "react";
// --- MLA Profile Section ---


// --- MLA Profile Section ---
const MlaProfile = () => {
    const [isTextExpanded, setIsTextExpanded] = useState(false);
    const fullText = "An esteemed leader with a profound commitment to public service, [MLA Name] has been representing the [Constituency Name] since [Year]. With a background in [Education/Profession], they entered politics with a vision to foster sustainable development and empower local communities. Their political journey began with the Bharatiya Janata Party (BJP), where they quickly rose through the ranks due to their dedication to grassroots activism and ability to connect with the people. Key focus areas include improving educational infrastructure, enhancing healthcare facilities, and creating employment opportunities for the youth.";
    const shortText = fullText.substring(0, 100) + "..."; // Create a shortened version

    return (
        <section className="bg-gray-50 py-16    sm:py-24">
            <div className="container mx-auto px-6">
                <div className="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-16">
                    <div className="w-full lg:w-2/5">
                        <div className="relative group rounded-xl overflow-hidden shadow-2xl">
                            <img 
                                src="/assets/mlaImage.jpeg" 
                                alt="Portrait of the MLA" 
                                className="w-full h-auto object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 group-hover:opacity-100 transition-opacity duration-300"></div>
                            <div className="absolute bottom-0 left-0 p-6">
                                <h3 className="text-white text-3xl font-bold">
DR. DHARMPAL SINGH</h3>
                                <p className="text-gray-200 text-lg">Etmadpur,Agra</p>
                            </div>
                        </div>
                    </div>
                    <div className="w-full lg:w-3/5">
                        <div className="bg-white p-8 rounded-xl shadow-2xl">
                            <h3 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">About Your Representative</h3>
                            <div className="space-y-4 text-gray-600 text-base md:text-lg">
                                {/* Conditional text for mobile */}
                                <p className="lg:hidden">
                                    {isTextExpanded ? fullText : shortText}
                                </p>
                                {/* Full text for desktop */}
                                <p className="hidden lg:block">
                                    {fullText}
                                </p>
                                <button 
                                    onClick={() => setIsTextExpanded(!isTextExpanded)} 
                                    className="lg:hidden text-blue-600 font-semibold hover:underline"
                                >
                                    {isTextExpanded ? "Show Less" : "Load More..."}
                                </button>
                                <Link to="/about-mla" className="inline-block bg-blue-600 text-white font-bold py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-300 shadow-md hover:shadow-lg mt-4">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default MlaProfile;