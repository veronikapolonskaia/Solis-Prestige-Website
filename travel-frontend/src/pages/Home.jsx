import { Link } from 'react-router-dom';
import { Plane, Users, Globe, Calendar, Award, Heart, Hotel, MapPin, Umbrella } from 'lucide-react';

const Home = () => {
  return (
    <div className="bg-white">
      {/* Hero Section with Video Background */}
      <section className="relative flex items-center justify-center overflow-hidden pt-24 sm:pt-28 md:pt-32 min-h-[75vh] md:min-h-screen">
        {/* Video Background */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/Intro_video.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        
        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-40"></div>
        
        {/* Content */}
        <div className="relative z-10 text-center text-white px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight flex flex-wrap items-center justify-center gap-3 sm:gap-4 md:gap-6">
            <span>Travel</span>
            <span className="text-purple-300 text-2xl sm:text-3xl md:text-4xl">✦</span>
            <span>Discover</span>
            <span className="text-purple-300 text-2xl sm:text-3xl md:text-4xl">✦</span>
            <span>Belong</span>
          </h1>
        </div>
      </section>

      {/* Community Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6 sm:mb-8">
              A community for luxury travellers
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mb-8 sm:mb-10 px-2 sm:px-0">
              SOLIS is the trusted community for modern luxury travellers. Find inspiration,
              book unique journeys, and connect with like-minded members.
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 bg-gray-900 text-white rounded-full font-semibold text-base sm:text-lg hover:bg-gray-800 transition-all duration-300 shadow-lg"
            >
              CREATE FREE ACCOUNT
              <span className="text-lg sm:text-xl">→</span>
            </Link>
          </div>
        </div>

        {/* As Seen In - Infinite Scrolling Carousel */}
        <div className="mt-16 sm:mt-20 -mx-4 sm:-mx-8 lg:-mx-12 px-4 sm:px-8 lg:px-12 py-12 sm:py-16 bg-champagne">
          <p className="text-center text-sm text-gray-500 uppercase tracking-wider mb-8">
            As seen in
          </p>
          
          <div className="relative overflow-hidden">
            {/* Gradient Overlays */}
            <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-champagne to-transparent z-10"></div>
            <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-champagne to-transparent z-10"></div>
            
            {/* Scrolling Container */}
            <div className="flex animate-scroll">
              {/* First Set of Logos */}
              <div className="flex items-center gap-8 sm:gap-12 px-6 sm:px-8">
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/the_economist-c9544c1900bfab04a8d16c9e2cef730e82b13ef782734deb717d4932ac956eeb.svg" 
                    alt="The Economist" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/the_guardian-d9555e7c4654b0e50f7e5d461c3fd0b1c16b909f454d1bf989ca09dad66fefca.svg" 
                    alt="The Guardian" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/monde-36500a0edc87c8f1288eb7d471fbea4710dba6e0c4b904dd5652e10c3a9289e9.svg" 
                    alt="Le Monde" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/forbes-662d2ec035661bc9cf75ecabd31a4a85c01fb0dbb8d9c0702fb7b7942b3cfce9.svg" 
                    alt="Forbes" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/vogue-100f6560f7c4524cfeab4a03fb99a54fac77893da9633722a02bacd4e1190be7.svg" 
                    alt="Vogue" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/nytimes-ee4a8ee7b0805b66ff6e800dac1f752154636690aa55bb812706b5c2243cf47e.svg" 
                    alt="The New York Times" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/cnn-4dbea7809ec81b6fd6baddf06898c9678f738e467c0ee4922530cfea1a8ba404.svg" 
                    alt="CNN" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/business_insider-f0b99217af1c8b7a1a143197b363f42b09baca5d32fab4c6eb2d91777391dd0b.svg" 
                    alt="Business Insider" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
              </div>
              
              {/* Duplicate Set for Seamless Loop */}
              <div className="flex items-center gap-8 sm:gap-12 px-6 sm:px-8" aria-hidden="true">
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/the_economist-c9544c1900bfab04a8d16c9e2cef730e82b13ef782734deb717d4932ac956eeb.svg" 
                    alt="The Economist" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/the_guardian-d9555e7c4654b0e50f7e5d461c3fd0b1c16b909f454d1bf989ca09dad66fefca.svg" 
                    alt="The Guardian" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/monde-36500a0edc87c8f1288eb7d471fbea4710dba6e0c4b904dd5652e10c3a9289e9.svg" 
                    alt="Le Monde" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/forbes-662d2ec035661bc9cf75ecabd31a4a85c01fb0dbb8d9c0702fb7b7942b3cfce9.svg" 
                    alt="Forbes" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/vogue-100f6560f7c4524cfeab4a03fb99a54fac77893da9633722a02bacd4e1190be7.svg" 
                    alt="Vogue" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/nytimes-ee4a8ee7b0805b66ff6e800dac1f752154636690aa55bb812706b5c2243cf47e.svg" 
                    alt="The New York Times" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px]">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/welcome/network/cnn-4dbea7809ec81b6fd6baddf06898c9678f738e467c0ee4922530cfea1a8ba404.svg" 
                    alt="CNN" 
                    className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
                  />
                </div>
                
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px]">
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
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center mb-16 md:mb-24">
            <div className="order-1 md:order-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-4 sm:mb-6 relative inline-block">
                Travel in style, with exclusive VIP benefits
                <span className="block w-24 h-1 bg-purple-600 mt-4"></span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mt-6 sm:mt-8">
                Indulge in luxury with our curated collection of the world's best hotels and 
                enjoy exclusive VIP benefits.
              </p>
            </div>
            <div className="order-2 md:order-2">
              <div className="relative h-[280px] sm:h-[360px] md:h-[440px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&auto=format&fit=crop"
                  alt="Luxury infinity pool at sunset"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Feature 2 - Discover Inspiration */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center mb-16 md:mb-24">
            <div className="order-2 md:order-1">
              <div className="relative h-[280px] sm:h-[360px] md:h-[440px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1558979158-65a1eaa08691?w=800&auto=format&fit=crop"
                  alt="Coastal village with turquoise water"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-4 sm:mb-6 relative inline-block">
                Discover new inspiration for your next journey
                <span className="block w-24 h-1 bg-orange-400 mt-4"></span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mt-6 sm:mt-8">
                Whether it's beautiful destinations or thrilling experiences, ignite your wanderlust 
                and discover new reasons to travel and explore.
              </p>
            </div>
          </div>

          {/* Feature 3 - Community */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center">
            <div className="order-1 md:order-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-4 sm:mb-6 relative inline-block">
                Belong to a community with a shared passion
                <span className="block w-24 h-1 bg-rose-400 mt-4"></span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mt-6 sm:mt-8">
                Connect with other members online or at our events and forge lasting friendships 
                that transcend borders.
              </p>
            </div>
            <div className="order-2 md:order-2">
              <div className="relative h-[280px] sm:h-[360px] md:h-[440px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
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
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 inline-block relative">
              Member benefits
              <span className="block w-24 h-1 bg-orange-400 mt-4 mx-auto"></span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Benefit 1 - VIP Hotel Benefits */}
            <div className="group bg-gradient-to-br from-[#f2dfcb] to-[#e8d4bf] p-8 sm:p-10 text-center rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[#e8d4bf]/50">
              <div className="inline-flex items-center justify-center mb-5 sm:mb-6 w-16 sm:w-20 h-16 sm:h-20 bg-white/80 rounded-full shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 mx-auto">
                <Award className="w-8 h-8 sm:w-10 sm:h-10 text-purple-600 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                VIP HOTEL BENEFITS
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Get room upgrades, hotel credit and other VIP benefits with the ASMALLWORLD Collection
              </p>
            </div>

            {/* Benefit 2 - Global Community */}
            <div className="group bg-gradient-to-br from-[#f2dfcb] to-[#e8d4bf] p-8 sm:p-10 text-center rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[#e8d4bf]/50">
              <div className="inline-flex items-center justify-center mb-5 sm:mb-6 w-16 sm:w-20 h-16 sm:h-20 bg-white/80 rounded-full shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 mx-auto">
                <Globe className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                GLOBAL COMMUNITY
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                More than 75,000 members in over 100 countries
              </p>
            </div>

            {/* Benefit 3 - Events */}
            <div className="group bg-gradient-to-br from-[#f2dfcb] to-[#e8d4bf] p-8 sm:p-10 text-center rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[#e8d4bf]/50">
              <div className="inline-flex items-center justify-center mb-5 sm:mb-6 w-16 sm:w-20 h-16 sm:h-20 bg-white/80 rounded-full shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 mx-auto">
                <MapPin className="w-8 h-8 sm:w-10 sm:h-10 text-rose-600 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                MORE THAN 800 EVENTS
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Meet fellow members at our exclusive events
              </p>
            </div>

            {/* Benefit 4 - Travel Inspiration */}
            <div className="group bg-gradient-to-br from-[#f2dfcb] to-[#e8d4bf] p-8 sm:p-10 text-center rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[#e8d4bf]/50">
              <div className="inline-flex items-center justify-center mb-5 sm:mb-6 w-16 sm:w-20 h-16 sm:h-20 bg-white/80 rounded-full shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 mx-auto">
                <Umbrella className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                DAILY TRAVEL INSPIRATION
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                New editorials each day to inspire your next trip
              </p>
            </div>

            {/* Benefit 5 - Travel Privileges */}
            <div className="group bg-gradient-to-br from-[#f2dfcb] to-[#e8d4bf] p-8 sm:p-10 text-center rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[#e8d4bf]/50">
              <div className="inline-flex items-center justify-center mb-5 sm:mb-6 w-16 sm:w-20 h-16 sm:h-20 bg-white/80 rounded-full shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 mx-auto">
                <Plane className="w-8 h-8 sm:w-10 sm:h-10 text-indigo-600 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                TRAVEL PRIVILEGES
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Enjoy exclusive savings and tier upgrades from trusted travel brands
              </p>
            </div>

            {/* Benefit 6 - Hotel Deals */}
            <div className="group bg-gradient-to-br from-[#f2dfcb] to-[#e8d4bf] p-8 sm:p-10 text-center rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-[#e8d4bf]/50">
              <div className="inline-flex items-center justify-center mb-5 sm:mb-6 w-16 sm:w-20 h-16 sm:h-20 bg-white/80 rounded-full shadow-md group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 mx-auto">
                <Hotel className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 stroke-[1.5]" />
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-4 uppercase tracking-wider">
                HOTEL DEALS
              </h3>
              <p className="text-gray-700 text-sm leading-relaxed">
                Get free nights at the world's best hotels with our special offers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Partners Section */}
      <section className="section-padding bg-champagne">
        <div className="container-custom">
          {/* Main Heading */}
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 sm:mb-6">
              Our partners
            </h2>
            <div className="w-24 h-1 bg-orange-400 mx-auto mb-8"></div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto px-2 sm:px-0">
              Our extensive partner network includes the most trusted names in travel, allowing us to offer you exclusive VIP benefits and other bespoke perks to enhance your travel experience.
            </p>
          </div>

          {/* Travel Partners */}
          <div className="pt-12">
            <h4 className="text-xl sm:text-2xl font-display font-bold text-gray-900 text-center mb-3 sm:mb-4">
              Travel partners
            </h4>
            <div className="w-24 h-1 bg-orange-400 mx-auto mb-6 sm:mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 sm:gap-8 mb-10 sm:mb-12">
              <div className="flex items-center justify-center p-2 sm:p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/miles_and_more-43b332ab91f2a77527b9253918bbee091c8cddc3d168011c370bc75072b823b8.png" alt="Miles & More" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-2 sm:p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/emirates-3d592a600afe2695dfd78f0e32123c9706a8fec12325c576af3b7f7243f7814a.png" alt="Emirates" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-2 sm:p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/sixt-dcf1cb84fe8c74f778cb1caac31f9d535ec41fc47ecdc8788a778454079dcc1e.png" alt="SIXT" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-2 sm:p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/priority_pass-9264436ea516d5121fc82973d4c3bc94938603e4a02e17b782d8fb69d6c63a9a.png" alt="Priority Pass" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-2 sm:p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/wfc-1cdcb4bcaffd995664623dfdcb01d6a5568bd3dafe7b2b483abca19ed1598ce7.png" alt="The World's Finest Clubs" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-2 sm:p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/award_wallet-7ab095533ed8b6377f392a6432623a887dac402c8f35c7ce3335fcba576e6ba6.png" alt="AwardWallet" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-2 sm:p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/tsa_precheck-b5fbbc3b0b0e6119d4a545ae16497e916ec8d2298b8a270cbed411406da1e733.png" alt="TSA PreCheck" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
            </div>
          </div>

          {/* Preferred Hotel Programmes */}
          <div className="pt-12">
            <h4 className="text-xl sm:text-2xl font-display font-bold text-gray-900 text-center mb-3 sm:mb-4">
              Preferred hotel programmes
            </h4>
            <div className="w-24 h-1 bg-orange-400 mx-auto mb-6 sm:mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 mb-10 sm:mb-12">
              <div className="flex items-center justify-center p-2 sm:p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/virtuoso_member-d61cb9a6e9194addbaafccd13e3309cf0beee2defac7af0630afd790af689e10.png" alt="Virtuoso Member" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-2 sm:p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/stars_luminous-aaf0bfd90c1eefe961d395a6fb19cbffa8e38bd18249df60f73fa616b8ce8abf.png" alt="Marriott Stars & Luminous" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/hyatt_prive-5c29bcd6081e9a70c142a8be2f46b7dab5891661a0f5e2f293ee2a4da89cc0cf.png" alt="Hyatt Privé" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/lhw-189edc10510631e0c13ba4e66e5054889e74e52c3898c533be3c8a0b853af5a1.png" alt="Leading Hotels of the World" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/the_peninsula-d85bd178b9ed17ffad224e8ce67edc0c174e9c646c065f58e1736c7efad8c50b.png" alt="The Peninsula Pen Club" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/gha_discovery-e4565addc6d2ef05b3635e11fd8ed74c9f717f61d934bb7e65c3e4bf80d4c13e.png" alt="GHA DISCOVERY" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/the_luxury_circle-ed43248cd95a6bbb295c8f16de617d10b675b144ba7b1ab12e8d80230990b5c3.png" alt="Shangri-La Luxury Circle" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/hilton-3b0d5729b21663b5b9ac88ac8c67b8c8c91f413deff7fbc16ee99aa86d301ad2.png" alt="Hilton" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
            </div>
          </div>

          {/* Hotel Partners */}
          <div className="pt-12">
            <h4 className="text-2xl font-display font-bold text-gray-900 text-center mb-4">
              Hotel partners
            </h4>
            <div className="w-24 h-1 bg-orange-400 mx-auto mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-6 mb-10 sm:mb-12">
              <div className="flex items-center justify-center p-2 sm:p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/four_seasons-28192b4c53511a68ed384281472d55040e0f469d87d9dd0ded9d6caae69fa0d7.png" alt="Four Seasons" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-2 sm:p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/oetker_collection-f4f2b1be3e6f19213a30b49c1f696f66372550180ef6b4770b59ecfc6a75730d.png" alt="Oetker Collection" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/corinthia_hotels-a7ce3f4d6591caf624e514a9884e158e03094efea48d5a96fb4c6d475818ac76.png" alt="Corinthia Hotels" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/rocco_forte_hotels-1bbdf710c0cbbf43db8b59cf611cdbfc96f4f48e2393c164cf6df62308d17fef.png" alt="Rocco Forte Hotels" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/relais_chateaux-7b08582097caf4b63aebf75fa1b61ac20c6c00dcf39af5c6744c29ac724b0c7f.png" alt="Relais & Châteaux" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/belmond-1d5432d69acf31dbf7e6f08d5e1d49cd8a4bc571a490564fc313a847a4dd7cfd.png" alt="Belmond" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/firmdale_hotels-c1c377f195b68a962901ecf439bb7263dfb33b53b5185375854592259282f571.png" alt="Firmdale Hotels" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/rosewood_hotels_and_resorts-32aa497f275ee07e50dc69d109026f1c01aacdc728fdb97713a282f687758cdd.png" alt="Rosewood Hotels & Resorts" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/the_ritz_carlton-ef2a3af7f1bf74c132186f15e3048e44e6e2207c4b45549768a2f65abbe6e74d.png" alt="The Ritz-Carlton" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/kempinski_hotels-6361c8ee6264aa03d9f087f401c4bf0d5a9307b7c46b1e75b1857ff55ca36056.png" alt="Kempinski Hotels" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/jumeirah-e33198a8a5bcc61a168a55ec663bf4589d8cc49ad63bae65588b097b629b006a.png" alt="Jumeirah" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/anantara_hotels_and_resorts-19c0a8a902ad01e34933034e1bac4f31d27039a2b59e47894a9bff9757a85544.png" alt="Anantara Hotels & Resorts" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/lungarno_collection-37b23a4ced6e6b2dc5e9fd09843cb0392eb29b69844b021ea7fe3eb2d7831c39.png" alt="Lungarno Collection" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/st_regis_hotels_and_resorts-cb4c73b96150c79208b509211f8b9295236379fe6fdfa158724c0a085437eea3.png" alt="St. Regis Hotels & Resorts" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/waldorf_astoria-98820cc6d886304bddc6b84801df3d77e5cbede37810dbea5299adb54c21b230.png" alt="Waldorf Astoria Hotels and Resorts" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/the_set_collection-3e0a580040d56aa2d487c391533afd28f3942fa7787c7d021c36724fdbac7352.png" alt="The Set Collection" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/the_standard_hotels-93df57864131816c9f418d4f4d4b39b4fa031e3b93a515ce803c1d179e9c73ca.png" alt="The Standard Hotels" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/slh-e5bc5dc5924569d419b0aea364039360786a6e5e9557bce1ea75bd2205b0bb81.png" alt="Small Luxury Hotels" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/melia-d3217d46242cf0c8a3d748056b63d0bb8ee94ca2edfa2557217c0b9d989152ba.png" alt="Meliá Hotels & Resorts" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
            </div>
          </div>

          {/* Cruise Partners */}
          <div className="pt-12">
            <h4 className="text-2xl font-display font-bold text-gray-900 text-center mb-4">
              Cruise partners
            </h4>
            <div className="w-24 h-1 bg-orange-400 mx-auto mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 sm:gap-8 mb-10 sm:mb-12">
              <div className="flex items-center justify-center p-2 sm:p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/regent_seven_seas_cruises-4529c94d408e3a5b314a1a32643e78ccd42e84cc06205f9caf86d346387ebc72.png" alt="Regent Seven Seas Cruises" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-2 sm:p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/silversea-d36b34c80fd17b4f7b5405f2ae5eefd7aa20508d76e747136de55ac3c8f161de.png" alt="Silversea" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/explora_journeys-d698efcd0df06a3e7e60b67e0ffc691b018722e3f03dd4742c45c53ece94692b.png" alt="Explora Journeys" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/ama_waterways-ec5bcab7fc3d44184da45b2462c061e01dc140294ad48c1edf7703a62ff24517.png" alt="AmaWaterways" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/crystal_cruises-b6f83c2125df312a0ac0248b727777caa070afb1b2ef04e6b617b894a88cf61a.png" alt="Crystal Cruises" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/ponant-56a6ccb04555695f3bd2f01ba1cf389ef09b21f2704dc24afc93344db255d694.png" alt="Ponant" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/scenic-73073c2f647821611602611131fd8237508135c13195f0166defd309a5a7da77.png" alt="Scenic" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/aqua_expeditions-128f415f8be4f950f18860254ca3b573e2da9cda1cb67ac3ad61e9af19caacf5.png" alt="Aqua Expeditions" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/oceania_cruises-8c2146daf5806f58b4f8b8135d6ddaa3ff777a460429802c9bc9759ca9d91437.png" alt="Oceania Cruises" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/atlas_ocean_voyages-34ba40eecf23456e0b507221d0fec93843d8f22ded3af25cb67f66256a7ea49d.png" alt="Atlas Ocean Voyages" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;

