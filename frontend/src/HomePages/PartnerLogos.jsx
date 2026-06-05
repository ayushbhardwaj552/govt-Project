
// --- Partner Logos Section ---
const PartnerLogos = () => {
    const logos = [
        { name: "India.gov.in", href: "https://www.india.gov.in/", imgSrc: "https://placehold.co/200x80/ffffff/333333?text=india.gov.in" },
        { name: "UP Information Commission", href: "http://upsic.gov.in/", imgSrc: "https://placehold.co/200x80/ffffff/333333?text=UP+Info+Commission" },
        { name: "Government of UP", href: "https://up.gov.in/", imgSrc: "https://placehold.co/200x80/ffffff/333333?text=Govt+of+UP" },
        { name: "UP Police", href: "https://uppolice.gov.in/", imgSrc: "https://placehold.co/200x80/ffffff/333333?text=UP+Police" },
        { name: "Chief Electoral Officer, UP", href: "https://ceouttarpradesh.nic.in/", imgSrc: "https://placehold.co/200x80/ffffff/333333?text=UP+CEO" },
        { name: "Election Commission of India", href: "https://www.eci.gov.in/", imgSrc: "https://placehold.co/200x80/ffffff/333333?text=ECI" },
    ];
    
    const duplicatedLogos = [...logos, ...logos];

    return (
        <section className="bg-gray-400 py-8 overflow-hidden">
             <style>
                {`
                    @keyframes scroll-partners {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .scrolling-partners {
                        animation: scroll-partners 30s linear infinite;
                    }
                    .scrolling-partners:hover {
                        animation-play-state: paused;
                    }
                `}
            </style>
            <div className="scrolling-partners flex items-center gap-16">
                 {duplicatedLogos.map((logo, index) => (
                    <a href={logo.href} key={index} target="_blank" rel="noopener noreferrer" className="bg-green-500 hover:bg-orange-700 text-black hover:text-black flex-shrink-0">
                        <img src={logo.imgSrc} alt={logo.name} className="h-12 bg-grey-800 hover:bg-sky-700 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300 transform hover:scale-110" />
                    </a>
                ))}
            </div>
        </section>
    );
};

export default PartnerLogos;