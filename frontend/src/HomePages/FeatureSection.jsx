import FeatureCard from "../components/FeatureCard.jsx";
import { IconSend, } from "./HomeIcons.jsx";
import { IconMessageSquare ,IconFileText,IconCalendar} from "./HomeIcons.jsx";
import { Link } from "react-router-dom";
// Features Section Component


const FeaturesSection = () => (
    <section className="py-20 bg-gradient-to-b from-gray-400 to-amber-50">
        <div className="container mx-auto px-6">
            <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-800">Our Core Services</h2>
                <p className="mt-2 text-gray-600">Directly engage with your representative through these services.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <FeatureCard 
                    icon={<IconFileText />} 
                    title="Request a Meeting" 
                    description="Schedule an appointment to discuss important matters directly with your MLA." 
                />
                <FeatureCard 
                    icon={<IconMessageSquare />} 
                    title="File a Complaint" 
                    description="Report local issues or grievances for official review and prompt action." 
                />
                <FeatureCard 
                    icon={<IconSend />} 
                    title="Send an Invitation" 
                    description="Invite your MLA to a community event, inauguration, or other public function." 
                />
                <FeatureCard 
                    icon={<IconCalendar />} 
                    title="View MLA's Calendar" 
                    description="Check the public schedule of your MLA for available dates and public meetings." 
                />
            </div>
        </div>
    </section>
);

export default FeaturesSection;