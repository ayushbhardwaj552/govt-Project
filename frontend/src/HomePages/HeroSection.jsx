import { Link } from "react-router-dom";

const HeroSection = () => (
    <section className="relative bg-blue-600 text-white py-20 md:py-32">
        <div 
            className="absolute inset-0 bg-cover bg-center opacity-20" 
            style={{ backgroundImage: "url('https://placehold.co/1920x1080/000000/FFFFFF?text=Government+Building')" }}
        ></div>
        <div className="container mx-auto px-6 text-center relative z-10">
            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">Connecting Citizens with Governance</h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
                A dedicated portal to directly communicate with your MLA, submit requests, file complaints, and stay informed about public services.
            </p>
            <div className="mt-8 flex justify-center gap-4 flex-wrap">
                <Link to="/login" className="bg-white text-blue-600 font-bold py-3 px-8 rounded-md hover:bg-gray-100 text-lg">
                    Login
                </Link>
                <Link to="/signUp" className="border-2 border-white font-bold py-3 px-8 rounded-md hover:bg-white hover:text-blue-600 text-lg">
                    Register
                </Link>
            </div>
        </div>
    </section>
);
export default HeroSection;