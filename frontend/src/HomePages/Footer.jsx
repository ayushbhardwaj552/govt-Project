import { Link } from "react-router-dom";
import { IconFacebook,IconTwitter,IconLinkedin,
    IconExternalLink,IconInstagram,IconArrowUp
 } from "./HomeIcons.jsx";
import upLogo from '../assets/UP_logo.png';
import WebsiteLogo from '../assets/UP_logo.png'

// --- Footer Component ---
const Footer = () => {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {/* About Section */}
                    <div className="col-span-1 md:col-span-3 lg:col-span-1">
                        <img src={WebsiteLogo} alt="e-Services Portal" className="h-10 mb-4" />
                        <p className="text-sm">Committed to fostering transparent and accessible communication between citizens and their elected representatives.</p>
                        <div className="flex space-x-4 mt-6">
                            <a href="https://www.facebook.com/MLADharampalSinghChauhan" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors"><IconFacebook /></a>
                            <a href="https://x.com/narendramodi?" target="_blank" rel="noopener noreferrer" className="hover:text-blue-400 transition-colors"><IconTwitter /></a>
                            <a href="https://www.linkedin.com/in/narendramodi/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-600 transition-colors"><IconLinkedin /></a>
                            <a href="https://www.instagram.com/myogi_adityanath/" target="_blank" rel="noopener noreferrer" className="hover:text-pink-500 transition-colors"><IconInstagram /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Quick Links</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/holidays" className="hover:text-white hover:underline">Holidays</Link></li>
                            <li><Link to="/recruitment" className="hover:text-white hover:underline">Recruitment</Link></li>
                            <li><Link to="/tenders" className="hover:text-white hover:underline">Tender Invitations</Link></li>
                            <li><Link to="/anti-ragging" className="hover:text-white hover:underline">Anti-Ragging</Link></li>
                        </ul>
                    </div>

                    {/* Resources */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Resources</h4>
                        <ul className="space-y-2 text-sm">
                            <li><Link to="/webmasters" className="hover:text-white hover:underline">Webmasters</Link></li>
                            <li><Link to="/rti" className="hover:text-white hover:underline">RTI</Link></li>
                            <li><Link to="/sitemap" className="hover:text-white hover:underline">Sitemap</Link></li>
                            <li><Link to="/rules" className="hover:text-white hover:underline">Rules and Discipline</Link></li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="font-semibold text-white mb-4">Contact Us</h4>
                        <div className="text-sm space-y-2">
                            <p>MLA Office, [City], [State]</p>
                            <p>Email: office@example.com</p>
                            <p>Phone: (123) 456-7890</p>
                        </div>
                    </div>
                </div>

                <div className="mt-12 border-t border-gray-700 pt-8 flex flex-col sm:flex-row justify-between items-center relative">
                    <div className="w-full absolute">
                        <p className="text-sm text-center text-gray-500">&copy; 2025 Government of Uttar Pradesh. All Rights Reserved.</p>
                    </div>
                    <div className="w-full flex justify-end">
                        <button onClick={scrollToTop} className="mt-4 sm:mt-0 p-2 rounded-full bg-gray-700 hover:bg-blue-600 transition-colors z-10">
                            <IconArrowUp className="w-5 h-5 text-white" />
                        </button>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;