import { Link } from 'react-router-dom';
import { Plane, Users, Globe, Calendar, Award, Heart } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section with Video Background */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/11490-230853032_small.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-6">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 tracking-tight">
            Travel<span className="text-purple-300"> Discover</span> Belong
          </h1>
          <p className="text-xl md:text-2xl mb-10 max-w-3xl mx-auto font-light">
            A community for luxury travellers
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/register" className="btn-outline px-10 py-4 text-lg">
              Create free account
            </Link>
          </div>
        </div>
      </section>

      {/* Tagline Section */}
      <section className="section-padding bg-gradient-to-br from-purple-50 to-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed">
              LuxeTravel is the trusted community for modern luxury travellers. Find inspiration, 
              book unique journeys, and connect with like-minded members.
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Feature 1 */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div className="order-2 md:order-1">
              <div className="h-96 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center">
                <Plane className="w-32 h-32 text-purple-600" />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">
                Travel in style, with exclusive VIP benefits
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Indulge in luxury with our curated collection of the world's best hotels and 
                enjoy exclusive VIP benefits.
              </p>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
            <div>
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">
                Discover new inspiration for your next journey
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Whether it's beautiful destinations or thrilling experiences, ignite your wanderlust 
                and discover new reasons to travel and explore.
              </p>
            </div>
            <div>
              <div className="h-96 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center">
                <Globe className="w-32 h-32 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <div className="h-96 bg-gradient-to-br from-purple-100 to-purple-50 rounded-2xl flex items-center justify-center">
                <Users className="w-32 h-32 text-purple-600" />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl font-display font-bold text-gray-900 mb-6">
                Belong to a community with a shared passion
              </h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                Connect with other members online or at our events and forge lasting friendships 
                that transcend borders.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Member Benefits Section */}
      <section className="section-padding bg-purple-50">
        <div className="container-custom">
          <h2 className="text-4xl font-display font-bold text-center text-gray-900 mb-16">
            Member benefits
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="card p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
                <Award className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                VIP hotel benefits
              </h3>
              <p className="text-gray-600">
                Get room upgrades, hotel credit and other VIP benefits with the LuxeTravel Collection
              </p>
            </div>

            {/* Benefit 2 */}
            <div className="card p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
                <Users className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Global community
              </h3>
              <p className="text-gray-600">
                More than 75,000 members in over 100 countries
              </p>
            </div>

            {/* Benefit 3 */}
            <div className="card p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                More than 800 events
              </h3>
              <p className="text-gray-600">
                Meet fellow members at our exclusive events
              </p>
            </div>

            {/* Benefit 4 */}
            <div className="card p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
                <Globe className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Daily travel inspiration
              </h3>
              <p className="text-gray-600">
                New editorials each day to inspire your next trip
              </p>
            </div>

            {/* Benefit 5 */}
            <div className="card p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
                <Plane className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Travel privileges
              </h3>
              <p className="text-gray-600">
                Enjoy exclusive savings and tier upgrades from trusted travel brands
              </p>
            </div>

            {/* Benefit 6 */}
            <div className="card p-8 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 text-purple-600 rounded-full mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Hotel Deals
              </h3>
              <p className="text-gray-600">
                Get free nights at the world's best hotels with our special offers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-padding bg-gradient-to-br from-purple-600 to-purple-800 text-white">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-4xl font-display font-bold mb-6">
              Ready to Start Your Journey?
            </h2>
            <p className="text-xl mb-10 text-purple-100">
              Join thousands of luxury travellers who have discovered amazing places with us
            </p>
            <Link
              to="/register"
              className="inline-block px-10 py-4 bg-white text-purple-600 rounded-full font-semibold text-lg hover:bg-gray-100 transition-all duration-300 shadow-lg"
            >
              Create free account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

