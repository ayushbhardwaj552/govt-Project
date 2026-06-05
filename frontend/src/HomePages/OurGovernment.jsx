import React from "react";
import { IconExternalLink } from "./HomeIcons.jsx";

const OurGovernment = () => {
    const govLinks = [
        { name: "Chief Minister, UP", href: "https://upcmo.up.nic.in/", imgSrc: "/assets/upcmo.jpg" },
        { name: "Rajya Sabha", href: "https://sansad.in/rs", imgSrc: "/assets/rs.jpeg" },
        { name: "Lok Sabha", href: "https://sansad.in/ls", imgSrc: "/assets/ls.jpg" },
        { name: "President of India", href: "https://presidentofindia.nic.in/", imgSrc: "/assets/ps.jpg" },
        { name: "MyGov", href: "https://www.mygov.in/", imgSrc: "/assets/mygov.jpeg" },
        { name: "UP Government", href: "https://up.gov.in/", imgSrc: "/assets/upGovt.png" },
        { name: "Press Information Bureau", href: "https://pib.gov.in/", imgSrc: "/assets/pib.jpg" },
        { name: "National Portal of INDIA", href: "https://www.india.gov.in/", imgSrc: "/assets/india.png" },
    ];

    return (
        <section className="bg-gray-800 text-white">
            <div className="container mx-auto px-6 py-16" style={{ minHeight: "70vh" }}>
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-bold">Our Government</h2>
                </div>

                {/* ✅ Grid layout */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
                    {govLinks.map((link) => (
                        <a
                            href={link.href}
                            key={link.name}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative rounded-lg overflow-hidden group shadow-lg"
                        >
                            {/* ✅ Use <img> for visibility */}
<img
  src={link.imgSrc}
  alt={link.name}
  className="w-full h-40 md:h-48 object-cover transform transition-transform duration-500 ease-in-out group-hover:scale-110"
/>


                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 transition-colors duration-300"></div>

                            {/* External Link Icon */}
                            <div className="absolute top-2 right-2 text-white opacity-70 group-hover:opacity-100 transition-opacity">
                                <IconExternalLink className="w-5 h-5" />
                            </div>

                            {/* Title */}
                            <div className="absolute bottom-0 left-0 p-3 md:p-4">
                                <h3 className="font-bold text-sm md:text-base">{link.name}</h3>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default OurGovernment;
