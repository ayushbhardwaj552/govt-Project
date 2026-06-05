import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    IconLogIn,
    IconUserPlus,
    IconMlaLogin,
    IconLocation,
    IconMoreVertical,
    IconInfo,
    IconChevronDown,
     // Assuming you'll add this to HomeIcons.jsx
} from './HomeIcons.jsx';

const NavIcon = ({ to, icon, label, isExternal = false }) => {
    const Component = isExternal ? 'a' : Link;
    const props = isExternal ? { href: to, target: "_blank", rel: "noopener noreferrer" } : { to };

    return (
        <div className="relative flex items-center group">
            <Component
                {...props}
                className="p-2 text-gray-600 rounded-full transition-all duration-300 ease-in-out hover:bg-blue-100 hover:text-blue-700 hover:scale-110"
            >
                {icon}
            </Component>
            <div className="absolute top-full mt-2 w-max px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md shadow-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50">
                {label}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-blue-600"></div>
            </div>
        </div>
    );
};


const Header = () => {
    const [isDesktopMenuOpen, setIsDesktopMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAccordionOpen, setIsAccordionOpen] = useState(false);
    const desktopMenuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (desktopMenuRef.current && !desktopMenuRef.current.contains(event.target)) {
                setIsDesktopMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        document.body.style.overflow = isMobileMenuOpen ? 'hidden' : 'unset';
    }, [isMobileMenuOpen]);

    return (
        <header className="bg-amber-500 shadow-md sticky top-0 z-40">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <div className="flex-shrink-1">
                        <Link to="/">
                            <img
                                className="h-10 sm:h-12 w-auto"
                                src="assets/10001.png"
                                alt="eServices for Citizen Logo"
                                onError={(e) => { e.target.src = 'https://placehold.co/300x60/333333/FFFFFF?text=e-Services'; }}
                            />
                        </Link>
                    </div>

                    {/* Right Side: Desktop Icons */}
                    <nav className="hidden lg:flex items-center space-x-2">
                        <NavIcon to="/login" icon={<IconLogIn />} label="Citizen Login"/>
                        <NavIcon to="/signUp" icon={<IconUserPlus />} label="Register" />
                        <NavIcon to="/mla-login" icon={<IconMlaLogin />} label="MLA Login" />
                        <NavIcon to="https://www.google.com/maps/place/Ranpur,+Rajasthan" icon={<IconLocation />} label="Location" isExternal={true} />
                        
                        {/* Desktop Dropdown Menu */}
                        <div className="relative" ref={desktopMenuRef}>
                            <button
                                onClick={() => setIsDesktopMenuOpen(!isDesktopMenuOpen)}
                                className={`p-2 rounded-full transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
                                    ${isDesktopMenuOpen ? 'bg-blue-100 text-blue-700 scale-110' : 'text-gray-600 hover:bg-blue-100 hover:scale-110'}`}
                            >
                                <IconMoreVertical />
                            </button>
                            
                            {isDesktopMenuOpen && (
                                <div 
                                    className="origin-top-right absolute right-0 mt-2 w-56 rounded-xl shadow-2xl bg-amber-100 ring-1 ring-black ring-opacity-5 p-2
                                               transition-all duration-300 ease-in-out transform
                                               opacity-100 scale-100"
                                >
                                    <Link to="/about-us" className="flex items-center hover:scale-110 gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-200 hover:text-blue-800 transition-all duration-200">
                                        About Us
                                    </Link>
                                    {/* --- NEW GALLERY LINK ADDED --- */}
                                    <Link to="/gallery" className="flex items-center hover:scale-110 gap-3 px-4 py-3 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-200 hover:text-blue-800 transition-all duration-200">
                                        Gallery
                                    </Link>
                                    <Link to="/contact" className="flex items-center gap-3 px-4 py-3 hover:scale-110 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-200 hover:text-blue-800 transition-all duration-200">
                                        Contact Us
                                    </Link>
                                    <Link to="/facilities" className="flex items-center gap-3 px-4 py-3 hover:scale-110 text-sm font-medium text-gray-700 rounded-lg hover:bg-blue-200 hover:text-blue-800 transition-all duration-200">
                                        Facilities
                                    </Link>
                                </div>
                            )}
                        </div>
                    </nav>

                    {/* Mobile Menu Button */}
                    <div className="lg:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="p-2 text-gray-600 rounded-md hover:bg-blue-100 hover:scale-105 transition-all"
                            aria-label="Open menu"
                        >
                            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            <div className={`absolute top-full left-0 w-full bg-white shadow-lg z-30 transform transition-all duration-300 ease-in-out lg:hidden ${isMobileMenuOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4 pointer-events-none'}`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <nav className="flex-grow space-y-2">
                        <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-3 text-gray-700 rounded-md hover:bg-blue-100 hover:scale-105 transition-all"><IconLogIn className="mr-3" />Login</Link>
                        <Link to="/signUp" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-3 text-gray-700 rounded-md hover:bg-blue-100 hover:scale-105 transition-all"><IconUserPlus className="mr-3" />Register</Link>
                        <Link to="/mla-login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center p-3 text-gray-700 rounded-md hover:bg-blue-100 hover:scale-105 transition-all"><IconMlaLogin className="mr-3" />Admin</Link>
                        <a href="https://www.google.com/maps/place/Ranpur,+Rajasthan" target="_blank" rel="noopener noreferrer" className="flex items-center p-3 text-gray-700 rounded-md hover:bg-blue-100 hover:scale-105 transition-all"><IconLocation className="mr-3" />Location</a>
                        
                        {/* Accordion Menu Item */}
                        <div>
                            <button onClick={() => setIsAccordionOpen(!isAccordionOpen)} className="w-full flex items-center justify-between p-3 text-gray-700 rounded-md hover:bg-blue-100 hover:scale-105 transition-all">
                                <span className="flex items-center"><IconInfo className="mr-3" />More Information</span>
                                <IconChevronDown className={`transform transition-transform duration-200 ${isAccordionOpen ? 'rotate-180' : ''}`} />
                            </button>
                            <div className={`overflow-hidden transition-all duration-300 ease-in-out ${isAccordionOpen ? 'max-h-60' : 'max-h-0'}`}>
                                <div className="pl-8 pt-2 space-y-1">
                                    <Link to="/about-us" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 text-gray-600 rounded-md hover:bg-blue-100">About Us</Link>
                                    {/* --- NEW GALLERY LINK ADDED --- */}
                                    <Link to="/gallery" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 text-gray-600 rounded-md hover:bg-blue-100">Gallery</Link>
                                    <Link to="/contact" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 text-gray-600 rounded-md hover:bg-blue-100">Contact Us</Link>
                                    <Link to="/facilities" onClick={() => setIsMobileMenuOpen(false)} className="block p-2 text-gray-600 rounded-md hover:bg-blue-100">Facilities</Link>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
            
            {isMobileMenuOpen && <div onClick={() => setIsMobileMenuOpen(false)} className="fixed inset-0 z-20 lg:hidden"></div>}
        </header>
    );
};

export default Header;
