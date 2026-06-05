import { IconTrendingUp,IconRefreshCw,IconBriefcase } from "./HomeIcons.jsx";
import { useState } from "react";



// --- News and Updates Section ---
const NewsAndUpdates = () => {
    const [activeTab, setActiveTab] = useState('projects');

    const newsData = {
        projects: [
            { title: "New Metro Line Inaugurated", date: "Aug 18, 2025", description: "The new metro line connecting the city center to the industrial hub was inaugurated today, easing daily commute for thousands." },
            { title: "Smart City Project Phase 2 Begins", date: "Aug 15, 2025", description: "Phase 2 of the Smart City project has commenced, focusing on digital infrastructure and sustainable urban development." },
             { title: "Rural Electrification Drive Completed", date: "Aug 10, 2025", description: "Successfully provided electricity to over 100 remote villages, enhancing quality of life and enabling new opportunities." },
        ],
        updates: [
            { title: "MLA Conducts Public Rally in Agra", date: "Aug 20, 2025", description: "A massive public rally was held today to address local grievances and discuss upcoming development plans for the constituency." },
            { title: "Portal Maintenance Scheduled", date: "Aug 19, 2025", description: "The e-Services portal will be down for scheduled maintenance this weekend to improve performance and security." },
        ],
        future: [
            { title: "Upcoming International Airport", date: "Coming Soon", description: "Plans for a new international airport have been approved, with construction expected to begin in the next fiscal year." },
            { title: "AI-Powered Governance Initiative", date: "In Pipeline", description: "A new initiative to integrate AI into governance for more efficient public service delivery is currently under review." },
        ]
    };

    const TabButton = ({ id, title, icon }) => (
        <button
            onClick={() => setActiveTab(id)}
            className={`relative flex-auto sm:flex-1 flex items-center justify-center gap-2 px-2 py-3 text-xs sm:text-sm font-semibold transition-colors duration-300 focus:outline-none ${activeTab === id ? 'text-orange-400' : 'text-gray-400 hover:text-white'}`}
        >
            {icon}
            <span className="truncate">{title}</span>
            {activeTab === id && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-orange-400"></div>}
        </button>
    );

    return (
        <section className="bg-gradient-to-br from-orange-600 via-white-400 to-green-500 text-white py-12 sm:py-16">
            <div className="container mx-auto px-6">
                <div className="text-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold">Recent News & Updates</h2>
                    <p className="mt-2 text-gray-300">Stay informed about the latest developments and initiatives.</p>
                </div>
                <div className="max-w-4xl mx-auto bg-gray-800/50 rounded-xl shadow-2xl backdrop-blur-sm border border-gray-700" style={{ perspective: '1500px' }}>
                    <div className="flex flex-wrap sm:flex-nowrap bg-gray-900/70 rounded-t-xl">
                        <TabButton id="projects" title="Latest Projects" icon={<IconBriefcase className="w-5 h-5"/>} />
                        <TabButton id="updates" title="Recent Updates" icon={<IconRefreshCw className="w-5 h-5"/>} />
                        <TabButton id="future" title="Future Plans" icon={<IconTrendingUp className="w-5 h-5"/>} />
                    </div>
                    <div className="p-6 transition-all duration-500" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-3deg)' }}>
                        <div className="space-y-4 max-h-64 overflow-y-auto pr-2">
                            {newsData[activeTab].map((item, index) => (
                                <div key={index} className="p-4 rounded-lg transition-all duration-300 ease-in-out bg-gray-800/50 hover:bg-gray-700/50 hover:shadow-lg hover:-translate-y-1 transform-gpu">
                                    <h3 className="font-bold text-lg text-orange-400">{item.title}</h3>
                                    <p className="text-xs text-gray-500 mb-2">{item.date}</p>
                                    <p className="text-gray-300 text-sm">{item.description}</p>
                                    <a href="#" className="text-orange-400 hover:underline text-sm mt-2 inline-block">Read More &rarr;</a>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};


export default NewsAndUpdates;