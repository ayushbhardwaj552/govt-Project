const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-white p-8 rounded-lg shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-300">
        <div className="text-4xl text-blue-600 mb-4">{icon}</div>
        <h4 className="text-2xl font-bold text-gray-800 mb-2">{title}</h4>
        <p className="text-gray-600">{description}</p>
    </div>
);
export default FeatureCard;
