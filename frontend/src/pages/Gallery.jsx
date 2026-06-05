import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '../HomePages/Header.jsx'; // Adjust path if needed
import { FiArrowLeft, FiX, FiChevronLeft, FiChevronRight, FiCamera } from 'react-icons/fi';

// --- Gallery Images Data ---
// TODO: Replace these placeholders with your actual image paths and captions
const galleryImages = [
    { src: '/assets/img11.jpg', caption: 'After winning the Election ' },
    { src: '/assets/img12.jpg', caption: 'यमुना पार जल समस्या समाधान हेतु जलाशय निरीक्षण, हर घर तक शीघ्र साफ पानी सुनिश्चित।' },
    { src: '/assets/img13.jpg', caption: 'मा० मुख्यमंत्री योगी आदित्यनाथ जी संग 24 घंटे चले ऐतिहासिक यूपी विधानसभा मानसून सत्र में सहभागिता।' },
    { src: '/assets/img14.jpg', caption: 'आज धौराऊ गौशाला निर्माण स्थल का निरीक्षण कर अधिकारियों को समय पर गुणवत्तापूर्ण कार्य पूर्ण करने के निर्देश दिए।' },
    { src: '/assets/img15.jpg', caption: 'आज 11वें अंतरराष्ट्रीय योग दिवस पर चीनी का रोजा परिसर में योग कर लोगों को जागरूक किया।' },
    { src: '/assets/img16.jpg', caption: 'आज पर्यावरण दिवस पर बिहारीपुर में वृक्षारोपण कर लोगों को हरियाली व संरक्षण का संदेश दिया। 🌱' },
    { src: '/assets/img17.jpg', caption: 'आज एत्मादपुर विधानसभा क्षेत्र के गाँव गढ़ी रामी में क्रिकेट टूर्नामेंट का शुभारंभ कर उपस्थित सभी खिलाड़ियों को अनुशासन में अच्छा प्रदर्शन कर विजेता घोषित होने की शुभकामनाएं दी इस अवसर आयोजक सूर्या जी सहित बड़ी संख्या में खिलाड़ी एवं खेलप्रेमी उपस्थित रहेl' },
    { src: '/assets/img18.jpg', caption: 'Attending  Rally .' },
];

const Gallery = () => {
    const [isMounted, setIsMounted] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = useState(null);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    // --- Modal Controls ---
    const openModal = (index) => {
        setSelectedImageIndex(index);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImageIndex(null);
        document.body.style.overflow = 'unset';
    };

    const showNextImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex + 1) % galleryImages.length);
    };

    const showPrevImage = () => {
        setSelectedImageIndex((prevIndex) => (prevIndex - 1 + galleryImages.length) % galleryImages.length);
    };
    
    // Keyboard navigation for modal
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (!isModalOpen) return;
            if (e.key === 'ArrowRight') showNextImage();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'Escape') closeModal();
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isModalOpen]);


    return (
        <div className="bg-gradient-to-b from-gray-500 to-amber-50 min-h-screen">
            <Header />
            <div className={`p-4 md:p-8 transition-opacity duration-1000 ${isMounted ? 'opacity-100' : 'opacity-0'}`}>
                <div className="max-w-7xl mx-auto">

                    {/* --- Page Header --- */}
                    <div className="mb-8 md:mb-12">
                        <Link to="/" className="mb-4 inline-flex items-center gap-2 text-gray-600 hover:text-blue-700 transition-colors duration-300 font-semibold group">
                            <FiArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                            Back to Home
                        </Link>
                        <h1 className="text-4xl md:text-5xl font-bold text-gray-800 text-center">Photo Gallery</h1>
                        <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto text-center">
                            A glimpse into the various events, public meetings, and development work across the Etmadpur constituency.
                        </p>
                    </div>

                    {/* --- Image Grid --- */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {galleryImages.map((image, index) => (
                            <div
                                key={index}
                                className="group relative cursor-pointer overflow-hidden rounded-xl shadow-lg transform hover:-translate-y-2 transition-all duration-300 ease-in-out hover:shadow-2xl"
                                onClick={() => openModal(index)}
                            >
                                <img src={image.src} alt={image.caption} className="w-full h-60 object-cover group-hover:scale-110 transition-transform duration-300" />
                                <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <FiCamera size={40} className="text-white" />
                                </div>
                                <div className="absolute bottom-0 left-0 w-full p-3 bg-gradient-to-t from-black to-transparent">
                                    <p className="text-white font-semibold text-sm truncate">{image.caption}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* --- Image Modal (Lightbox) --- */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4 animate-fade-in">
                    <div className="relative max-w-4xl max-h-[90vh] w-full h-full flex flex-col items-center justify-center">
                        {/* Close Button */}
                        <button onClick={closeModal} className="absolute -top-2 -right-2 md:top-0 md:-right-12 text-white bg-gray-800 p-2 rounded-full hover:bg-red-600 transition-colors z-10">
                            <FiX size={24} />
                        </button>
                        
                        {/* Image Container */}
                        <div className="relative w-full h-full flex items-center justify-center">
                             <img 
                                src={galleryImages[selectedImageIndex].src} 
                                alt={galleryImages[selectedImageIndex].caption}
                                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                            />
                        </div>
                       
                        {/* Caption */}
                        <p className="text-white text-center mt-4 text-lg">{galleryImages[selectedImageIndex].caption}</p>

                        {/* Prev/Next Controls */}
                        <button onClick={showPrevImage} className="absolute left-0 md:-left-12 top-1/2 -translate-y-1/2 text-white bg-gray-800 p-3 rounded-full hover:bg-blue-600 transition-colors">
                            <FiChevronLeft size={28} />
                        </button>
                        <button onClick={showNextImage} className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 text-white bg-gray-800 p-3 rounded-full hover:bg-blue-600 transition-colors">
                            <FiChevronRight size={28} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Gallery;
