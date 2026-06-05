
// --- How It Works Section Component ---
const HowItWorksSection = () => {
    return (
        <section className="bg-gray-900 py-16 sm:py-20 text-white overflow-hidden">
            <div className="container mx-auto px-6">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold">Simple & Transparent Process</h2>
                    <p className="mt-2 text-gray-400">Follow these three easy steps to get started.</p>
                </div>
                <div className="flex flex-col lg:flex-row justify-center items-center gap-8 lg:gap-6" style={{ perspective: '2000px' }}>
                    {/* Step 1 Card */}
                    <div className="w-full max-w-sm lg:max-w-xs group" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(-15deg)' }}>
                        <div className="relative p-8 bg-gray-800 rounded-xl shadow-2xl transition-all duration-500 ease-in-out group-hover:transform group-hover:rotateY(0) group-hover:scale-105 group-hover:shadow-blue-500/50 border-2 border-transparent group-hover:border-blue-500">
                            <div className="relative flex flex-col items-center text-center">
                                <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gray-700 mb-4 transition-all duration-500 group-hover:bg-blue-500 group-hover:scale-110">
                                    <span className="text-4xl font-bold transition-colors duration-500 group-hover:text-white">1</span>
                                    <div className="absolute inset-0 rounded-full ring-4 ring-blue-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 transition-transform duration-500 group-hover:-translate-y-1">Register Your Account</h3>
                                <p className="text-gray-400 transition-opacity duration-500 group-hover:text-gray-300">Create a secure account with your basic details in just a few minutes.</p>
                            </div>
                        </div>
                    </div>

                    {/* Step 2 Card */}
                    <div className="w-full max-w-sm lg:max-w-xs group" style={{ transformStyle: 'preserve-3d' }}>
                        <div className="relative p-8 bg-gray-800 rounded-xl shadow-2xl transition-all duration-500 ease-in-out group-hover:transform group-hover:rotateY(0) group-hover:scale-105 group-hover:shadow-green-500/50 border-2 border-transparent group-hover:border-green-500">
                             <div className="relative flex flex-col items-center text-center">
                                <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gray-700 mb-4 transition-all duration-500 group-hover:bg-green-500 group-hover:scale-110">
                                    <span className="text-4xl font-bold transition-colors duration-500 group-hover:text-white">2</span>
                                     <div className="absolute inset-0 rounded-full ring-4 ring-green-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 transition-transform duration-500 group-hover:-translate-y-1">Submit Your Request</h3>
                                <p className="text-gray-400 transition-opacity duration-500 group-hover:text-gray-300">Choose a service and fill out the required form with all the necessary information.</p>
                            </div>
                        </div>
                    </div>

                    {/* Step 3 Card */}
                    <div className="w-full max-w-sm lg:max-w-xs group" style={{ transformStyle: 'preserve-3d', transform: 'rotateY(15deg)' }}>
                        <div className="relative p-8 bg-gray-800 rounded-xl shadow-2xl transition-all duration-500 ease-in-out group-hover:transform group-hover:rotateY(0) group-hover:scale-105 group-hover:shadow-purple-500/50 border-2 border-transparent group-hover:border-purple-500">
                             <div className="relative flex flex-col items-center text-center">
                                <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-gray-700 mb-4 transition-all duration-500 group-hover:bg-purple-500 group-hover:scale-110">
                                    <span className="text-4xl font-bold transition-colors duration-500 group-hover:text-white">3</span>
                                    <div className="absolute inset-0 rounded-full ring-4 ring-purple-500/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                                </div>
                                <h3 className="text-xl font-bold mb-2 transition-transform duration-500 group-hover:-translate-y-1">Track & Get Response</h3>
                                <p className="text-gray-400 transition-opacity duration-500 group-hover:text-gray-300">Track the status of your submission and receive official responses in your dashboard.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};



export default HowItWorksSection;