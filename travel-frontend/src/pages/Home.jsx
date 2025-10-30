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
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight flex flex-wrap items-center justify-center gap-4 md:gap-6">
            <span>Travel</span>
            <span className="text-purple-300 text-3xl md:text-4xl">✦</span>
            <span>Discover</span>
            <span className="text-purple-300 text-3xl md:text-4xl">✦</span>
            <span>Belong</span>
          </h1>
        </div>
      </section>

      {/* Community Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-8">
              A community for luxury travellers
            </h2>
            <p className="text-lg md:text-xl text-gray-700 leading-relaxed mb-10">
              SOLIS is the trusted community for modern luxury travellers. Find inspiration,
              book unique journeys, and connect with like-minded members.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-all duration-300 shadow-lg"
            >
              CREATE FREE ACCOUNT
              <span className="text-xl">→</span>
            </Link>
          </div>
        </div>

        {/* As Seen In - Infinite Scrolling Carousel */}
        <div className="mt-20 -mx-6 sm:-mx-8 lg:-mx-12 px-6 sm:px-8 lg:px-12 py-16 bg-champagne">
          <p className="text-center text-sm text-gray-500 uppercase tracking-wider mb-8">
            As seen in
          </p>
          
          <div className="relative overflow-hidden">
            {/* Gradient Overlays */}
            <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-champagne to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-champagne to-transparent z-10"></div>
            
            {/* Scrolling Container */}
            <div className="flex animate-scroll">
              {/* First Set of Logos */}
              <div className="flex items-center gap-12 px-8">
                <div className="flex items-center justify-center min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/the_economist-c9544c1900bfab04a8d16c9e2cef730e82b13ef782734deb717d4932ac956eeb.svg" 
                    alt="The Economist" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/the_guardian-d9555e7c4654b0e50f7e5d461c3fd0b1c16b909f454d1bf989ca09dad66fefca.svg" 
                    alt="The Guardian" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/monde-36500a0edc87c8f1288eb7d471fbea4710dba6e0c4b904dd5652e10c3a9289e9.svg" 
                    alt="Le Monde" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/forbes-662d2ec035661bc9cf75ecabd31a4a85c01fb0dbb8d9c0702fb7b7942b3cfce9.svg" 
                    alt="Forbes" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/vogue-100f6560f7c4524cfeab4a03fb99a54fac77893da9633722a02bacd4e1190be7.svg" 
                    alt="Vogue" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/nytimes-ee4a8ee7b0805b66ff6e800dac1f752154636690aa55bb812706b5c2243cf47e.svg" 
                    alt="The New York Times" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/cnn-4dbea7809ec81b6fd6baddf06898c9678f738e467c0ee4922530cfea1a8ba404.svg" 
                    alt="CNN" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/business_insider-f0b99217af1c8b7a1a143197b363f42b09baca5d32fab4c6eb2d91777391dd0b.svg" 
                    alt="Business Insider" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
              </div>
              
              {/* Duplicate Set for Seamless Loop */}
              <div className="flex items-center gap-12 px-8" aria-hidden="true">
                <div className="flex items-center justify-center min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/the_economist-c9544c1900bfab04a8d16c9e2cef730e82b13ef782734deb717d4932ac956eeb.svg" 
                    alt="The Economist" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/the_guardian-d9555e7c4654b0e50f7e5d461c3fd0b1c16b909f454d1bf989ca09dad66fefca.svg" 
                    alt="The Guardian" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/monde-36500a0edc87c8f1288eb7d471fbea4710dba6e0c4b904dd5652e10c3a9289e9.svg" 
                    alt="Le Monde" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/forbes-662d2ec035661bc9cf75ecabd31a4a85c01fb0dbb8d9c0702fb7b7942b3cfce9.svg" 
                    alt="Forbes" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/vogue-100f6560f7c4524cfeab4a03fb99a54fac77893da9633722a02bacd4e1190be7.svg" 
                    alt="Vogue" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/nytimes-ee4a8ee7b0805b66ff6e800dac1f752154636690aa55bb812706b5c2243cf47e.svg" 
                    alt="The New York Times" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/cnn-4dbea7809ec81b6fd6baddf06898c9678f738e467c0ee4922530cfea1a8ba404.svg" 
                    alt="CNN" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/business_insider-f0b99217af1c8b7a1a143197b363f42b09baca5d32fab4c6eb2d91777391dd0b.svg" 
                    alt="Business Insider" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          {/* Feature 1 - VIP Benefits */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
            <div className="order-1 md:order-1">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6 relative inline-block">
                Travel in style, with exclusive VIP benefits
                <span className="block w-24 h-1 bg-purple-600 mt-4"></span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mt-8">
                Indulge in luxury with our curated collection of the world's best hotels and 
                enjoy exclusive VIP benefits.
              </p>
            </div>
            <div className="order-2 md:order-2">
              <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop"
                  alt="Luxury infinity pool at sunset"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Feature 2 - Discover Inspiration */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
            <div className="order-2 md:order-1">
              <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1558979158-65a1eaa08691?w=800&auto=format&fit=crop"
                  alt="Coastal village with turquoise water"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6 relative inline-block">
                Discover new inspiration for your next journey
                <span className="block w-24 h-1 bg-orange-400 mt-4"></span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mt-8">
                Whether it's beautiful destinations or thrilling experiences, ignite your wanderlust 
                and discover new reasons to travel and explore.
              </p>
            </div>
          </div>

          {/* Feature 3 - Community */}
          <div className="grid md:grid-cols-2 gap-12 lg:gap-20 items-center">
            <div className="order-1 md:order-1">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6 relative inline-block">
                Belong to a community with a shared passion
                <span className="block w-24 h-1 bg-rose-400 mt-4"></span>
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed mt-8">
                Connect with other members online or at our events and forge lasting friendships 
                that transcend borders.
              </p>
            </div>
            <div className="order-2 md:order-2">
              <div className="relative h-[400px] md:h-[500px] rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop"
                  alt="Friends dining together at sunset"
                  className="w-full h-full object-cover"
                />
              </div>
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

