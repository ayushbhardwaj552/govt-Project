import React from "react";

const AgraHighlightsSlider = () => {
    const highlights = [
        { name: "Taj Mahal", location: "https://goo.gl/maps/j5fJ3j3j3J3j3j3J6", imgSrc: '/assets/agra1.jpg' },
        { name: "Agra Fort", location: "https://goo.gl/maps/fJ3j3j3j3J3j3j3J7", imgSrc: '/assets/red.jpeg' },
        { name: "R.B.S. College", location: "https://goo.gl/maps/j3j3j3j3j3j3j3J38", imgSrc: "/assets/rbs.jpeg" },
        { name: "Agra College", location: "https://goo.gl/maps/3j3j3J3j3j3j3j3J9", imgSrc: "/assets/agra.jpeg" },
        { name: "Dr. Bhimrao Ambedkar University", location: "https://goo.gl/maps/j3j3j3j3j3j3j3j3A", imgSrc: "/assets/dbru.jpeg" },
        { name: "Mehtab Bagh", location: "https://goo.gl/maps/3j3j3j3j3j3j3j3jB", imgSrc: "/assets/mehtab.jpg" },
        { name: "Itimad-ud-Daulah", location: "https://goo.gl/maps/j3j3j3j3j3j3j3j3C", imgSrc: "/assets/itmad.jpg" },
        { name: "Jama Masjid", location: "https://goo.gl/maps/j3j3j3j3j3j3j3j3C", imgSrc: "/assets/jama.jpg" },
    ];

    const duplicatedHighlights = [...highlights, ...highlights];

    return (
        <section className="bg-gradient-to-b from-gray-400 to-amber-50 py-16 sm:py-24 overflow-hidden">
            <style>
                {`
                    @keyframes scroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                    .scrolling-wrapper {
                        animation: scroll 20s linear infinite; /* Faster speed */
                    }
                    .scrolling-wrapper:hover {
                        animation-play-state: paused;
                    }
                `}
            </style>
            <div className="container mx-auto">
                <div className="text-center mb-12 px-6">
                    <h2 className="text-4xl font-bold text-gray-800 inline-block relative pb-2">
                        Highlights of Agra
                        <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2/3 h-1 bg-amber-400 rounded-full"></span>
                    </h2>
                    <p className="mt-4 text-lg text-gray-600">Explore the iconic landmarks and institutions of our historic city.</p>
                </div>
            </div>
            <div className="relative">
                <div className="scrolling-wrapper flex gap-8">
                    {duplicatedHighlights.map((item, index) => (
                        <a
                            href={item.location}
                            key={index}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="relative flex-shrink-0 w-64 h-80 sm:w-64 sm:h-80 md:w-72 md:h-96 lg:w-80 lg:h-[28rem] rounded-xl overflow-hidden group shadow-lg transition-transform duration-500 ease-in-out hover:-translate-y-4 hover:shadow-2xl"
                        >
                            <img
                                src={item.imgSrc}
                                alt={item.name}
                                className="absolute inset-0 w-full h-full object-contain bg-black"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                            <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                                <h3 className="font-bold text-xl">{item.name}</h3>
                            </div>
                        </a>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AgraHighlightsSlider;
