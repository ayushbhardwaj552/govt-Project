import React, { useState, useEffect, useRef } from 'react';

const ImageSlider = () => {
    const slides = [
        { url: '/assets/img6.jpg', caption: "पोइया गाँव में 413 करोड़ रुपये लागत के वाटरवर्क्स पर प्रेस वार्ता कर जानकारी साझा की।" },
        { url: '/assets/img5.jpg', caption: 'आगरा के एकलव्य स्टेडियम में राष्ट्रीय खेल दिवस पर शपथ ग्रहण एवं खिलाड़ियों को प्रेरित किया।' },
        { url: '/assets/img3.jpg', caption: 'आज़ादी की 79वीं वर्षगांठ पर हर घर तिरंगा अभियान के अंतर्गत अपने आवास पर तिरंगा लगा कर गर्व की अनुभूति हुई।' },
        { url: '/assets/img7.jpg', caption: 'मुख्यमंत्री योगी आदित्यनाथ से मुलाकात कर बधाई, शुभकामनाएं एवं मार्गदर्शन प्राप्त किया।' },
        { url: '/assets/img8.jpg', caption: 'अहा रन में दक्ष प्रजापति जयंती पर दीप प्रज्वलन, माल्यार्पण एवं विचार व्यक्त किए।' },
        { url: '/assets/img9.jpg', caption: 'संजय प्लेस आगरा में भाजपा कारगिल विजय दिवस पर शहीदों को नमन एवं पुष्पांजलि।' }
    ];

    const [currentIndex, setCurrentIndex] = useState(0);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const timeoutRef = useRef(null);

    useEffect(() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(goToNext, 4000); // autoplay every 4s
        return () => clearTimeout(timeoutRef.current);
    }, [currentIndex]);

    const goToPrevious = () => {
        setCurrentIndex((prev) => (prev === 0 ? slides.length - 1 : prev - 1));
    };

    const goToNext = () => {
        setCurrentIndex((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    };

    const openModal = (index) => {
        setCurrentIndex(index);
        setIsModalOpen(true);
    };

    const closeModal = () => setIsModalOpen(false);

    const currentSlide = slides[currentIndex];

    return (
        <div className="relative w-full">
            {/* Slider */}
            <div className="relative w-full h-[300px] md:h-[400px] lg:h-[calc(100vh-5rem)] overflow-hidden bg-black">
                <div
                    key={currentIndex}
                    className="w-full h-full cursor-pointer flex items-center justify-center"
                    onClick={() => openModal(currentIndex)}
                >
                    <img
                        src={currentSlide.url}
                        alt={currentSlide.caption}
                        className="w-full h-full object-contain lg:object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30"></div>
                </div>

                {/* Caption */}
                <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
                    <div className="container mx-auto">
                        <p className="text-white text-xl font-bold  p-4 rounded-md inline-block">
                            {currentSlide.caption}
                        </p>
                    </div>
                </div>

                {/* Arrows */}
                <button
                    onClick={goToPrevious}
                    className="absolute top-1/2 left-4 -translate-y-1/2 bg-white/50 hover:bg-white/90 p-2 rounded-full z-20"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M15 19l-7-7 7-7"></path>
                    </svg>
                </button>
                <button
                    onClick={goToNext}
                    className="absolute top-1/2 right-4 -translate-y-1/2 bg-white/50 hover:bg-white/90 p-2 rounded-full z-20"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path d="M9 5l7 7-7 7"></path>
                    </svg>
                </button>

                {/* Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
                    {slides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => setCurrentIndex(index)}
                            className={`w-3 h-3 rounded-full transition-colors ${currentIndex === index ? 'bg-white' : 'bg-white/50'}`}
                        ></button>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 overflow-y-auto" onClick={closeModal}>
                    <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
                        <img
                            src={currentSlide.url}
                            alt={currentSlide.caption}
                            className="w-full h-auto max-h-[90vh] object-contain mx-auto"
                        />
                        <button
                            onClick={closeModal}
                            className="absolute top-0 right-0 m-2 text-white bg-black/60 p-2 rounded-full"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ImageSlider;