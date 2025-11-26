import { Link } from 'react-router-dom';

const Bespoke = () => {
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
          <h1 className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-display font-bold tracking-tight flex flex-wrap items-center justify-center gap-3 sm:gap-5 md:gap-6">
            <span>Travel</span>
            <span className="text-purple-300 text-2xl sm:text-3xl md:text-4xl">✦</span>
            <span>Discover</span>
            <span className="text-purple-300 text-2xl sm:text-3xl md:text-4xl">✦</span>
            <span>Belong</span>
          </h1>
        </div>
      </section>

      {/* Begin Your Adventure Section */}
      <section className="section-padding bg-[#f5f2ed]">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6 sm:mb-8">
              Begin your next great adventure
            </h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed mb-8 sm:mb-10 px-2 sm:px-0">
              Every memorable travel story starts at the beginning. At ASMALLWORLD Bespoke Travel, 
              we design extraordinary experiences just for you. Whether it's an impromptu luxury escape 
              or an epic global adventure, our expertise and meticulous attention to detail ensures your 
              journey begins perfectly.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 bg-[#1a3a52] text-white rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#2a4a62] transition-all duration-300 shadow-lg"
            >
              BOOK WITH US
              <span className="text-base sm:text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Feature 1 - Unforgettable Destinations */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center mb-16 md:mb-24 lg:mb-32">
            <div className="order-1 md:order-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-4 sm:mb-6 relative inline-block">
                Unforgettable destinations, tailored to you
                <span className="block w-24 h-1 bg-orange-400 mt-4"></span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mt-6 sm:mt-8">
                Discover the serenity of Greece's golden beaches, journey through 
                the expansive Serengeti on an African safari or marvel at the icy 
                landscapes of Antarctica, we'll design a trip to match your dream 
                destination.
              </p>
            </div>
            <div className="order-2 md:order-2">
              <div className="relative h-[280px] sm:h-[360px] md:h-[440px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800&auto=format&fit=crop"
                  alt="Luxury bathtub overlooking scenic landscape"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Feature 2 - Your Journey, Our Expertise */}
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center">
            <div className="order-2 md:order-1">
              <div className="relative h-[280px] sm:h-[360px] md:h-[440px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800&auto=format&fit=crop"
                  alt="Ornate architectural details"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-4 sm:mb-6 relative inline-block">
                Your journey, our expertise
                <span className="block w-24 h-1 bg-orange-400 mt-4"></span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mt-6 sm:mt-8">
                Our team of luxury travel experts comprises of highly experienced 
                and knowledgeable professionals, renowned for their extensive 
                global travels and industry expertise.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Exclusive Perks Section */}
      <section className="section-padding bg-[#f5f2ed]">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-10 md:gap-12 lg:gap-20 items-center">
            <div className="order-1 md:order-1">
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-4 sm:mb-6 relative inline-block">
                Exclusive perks when you travel with us
                <span className="block w-24 h-1 bg-orange-400 mt-4"></span>
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-gray-600 leading-relaxed mt-6 sm:mt-8">
                Enjoy upgrades and VIP perks at thousands of top luxury hotels 
                worldwide, thanks to our valued relationships.
              </p>
            </div>
            <div className="order-2 md:order-2">
              <div className="relative h-[280px] sm:h-[360px] md:h-[440px] lg:h-[500px] rounded-xl overflow-hidden shadow-2xl">
                <img 
                  src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29?w=800&auto=format&fit=crop"
                  alt="Colorful coastal Italian village with boats"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Let us create your perfect journey */}
      <section className="section-padding bg-[#1a3a52]">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white mb-4 sm:mb-6">
              Let us create your perfect journey
            </h2>
            <div className="w-24 h-1 bg-orange-400 mx-auto mb-6 sm:mb-8"></div>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed mb-8 sm:mb-10 px-2 sm:px-0">
              We're excited to plan your next luxury travel experience. Share your vision with us, and we'll design a 
              trip tailored just for you.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 sm:gap-3 px-6 sm:px-10 py-3 sm:py-4 bg-[#c07855] text-white rounded-full font-semibold text-xs sm:text-sm uppercase tracking-wider hover:bg-[#a86747] transition-all duration-300 shadow-lg"
            >
              BOOK WITH US
            </Link>
          </div>
        </div>
      </section>

      {/* Our Partners Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          {/* Main Heading */}
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-4 sm:mb-6">
              Our partners
            </h2>
            <div className="w-24 h-1 bg-orange-400 mx-auto mb-8"></div>
            <p className="text-base sm:text-lg text-gray-700 leading-relaxed max-w-4xl mx-auto px-2 sm:px-0">
              Our extensive network includes renowned brands and global hotel properties, including being a part of a 
              continually growing list of elite Preferred Partner programmes, allowing us to offer exclusive VIP perks for 
              your stays.
            </p>
          </div>

          {/* Virtuoso Logo */}
          <div className="flex justify-center mb-12 sm:mb-16">
            <img 
              src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/virtuoso_member-d61cb9a6e9194addbaafccd13e3309cf0beee2defac7af0630afd790af689e10.png" 
              alt="Virtuoso Member" 
              className="h-16 sm:h-20 object-contain grayscale hover:grayscale-0 transition-all duration-300"
            />
          </div>

          {/* Preferred Hotel Partners */}
          <div className="pt-12">
            <h4 className="text-xl sm:text-2xl font-display font-bold text-gray-900 text-center mb-3 sm:mb-4">
              Preferred hotel partners
            </h4>
            <div className="w-24 h-1 bg-orange-400 mx-auto mb-6 sm:mb-8"></div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 sm:gap-8 mb-10 sm:mb-12">
              <div className="flex items-center justify-center p-2 sm:p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/mandarin_oriental-825265f0b0c97b4cf459cbe78dd13e594592ef22ab738f2880320018355cbced.png" alt="Mandarin Oriental The Hotel Group" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/vita_lhw-a7954d1c4632b4d9a03f3f448199116c914d45d1e1804e4d70dccad14e537337.png" alt="Vita" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/belmond_bellini_club-042c1e9637edbdee1407a6e5833011f14f10317b98de2704c81772773266f5f1.png" alt="Belmond Bellini Club" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/hyatt_prive-5c29bcd6081e9a70c142a8be2f46b7dab5891661a0f5e2f293ee2a4da89cc0cf.png" alt="Hyatt Prive" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/rocco_forte_knights-e05e4e0b7daebf6e09cc2aa30cf1cca5d3aaa1aa3594ea8caa0fc973e7470fc0.png" alt="Rocco Forte Knights" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/fan_club_mandarin_oriental-38bbb167bdcb17fb1784e1f0b7d2ba1cc7e506f3d2282b5ae23b43d7c320654f.png" alt="Fan Club Mandarin Oriental" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/stars_luminous-aaf0bfd90c1eefe961d395a6fb19cbffa8e38bd18249df60f73fa616b8ce8abf.png" alt="Stars Luminous" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/impresario_group-d529d147cd8f0986175cf0ccb73f9329b318286516c72ca9f6145c54bae953e7.png" alt="Impresario" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/the_peninsula-d85bd178b9ed17ffad224e8ce67edc0c174e9c646c065f58e1736c7efad8c50b.png" alt="The Peninsula" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/jumeirah_luxury-5eafb1128fca6fc21f281c6969cf00dca845c1a73d056366c7a9eca296553b40.png" alt="Jumeirah Passport to Luxury" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/club_1897-56745f3dd87205d53634d30d5818a3669f276ae0022ed1b99970f0d1762ce5f1.png" alt="Club 1897" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/melia_pro-f5a6ec2dec1e67e6917068404cf753dde58cfce36b32daf0bc6e0bfb07515409.png" alt="Melia Pro" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/rosewood_hotels_and_resorts-32aa497f275ee07e50dc69d109026f1c01aacdc728fdb97713a282f687758cdd.png" alt="Rosewood Hotels & Resorts" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/four_seasons-28192b4c53511a68ed384281472d55040e0f469d87d9dd0ded9d6caae69fa0d7.png" alt="Four Seasons" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/corinthia_hotels-a7ce3f4d6591caf624e514a9884e158e03094efea48d5a96fb4c6d475818ac76.png" alt="Corinthia Hotels" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/oetker_collection-f4f2b1be3e6f19213a30b49c1f696f66372550180ef6b4770b59ecfc6a75730d.png" alt="Oetker Collection Masterpiece Hotels" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/preferred-e7054f1164c6051b856fe8f4fcd93957a46129e4d37ca3a748fc13943abc4f02.png" alt="Preferred Hotels & Resorts" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/slh-e5bc5dc5924569d419b0aea364039360786a6e5e9557bce1ea75bd2205b0bb81.png" alt="Small Luxury Hotels" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/relais_chateaux-7b08582097caf4b63aebf75fa1b61ac20c6c00dcf39af5c6744c29ac724b0c7f.png" alt="Relais & Châteaux" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
              <div className="flex items-center justify-center p-4">
                <img src="https://dv4xo43u9eo19.cloudfront.net/assets/partners/anantara_hotels_and_resorts-19c0a8a902ad01e34933034e1bac4f31d27039a2b59e47894a9bff9757a85544.png" alt="Anantara Hotels & Resorts" className="max-w-[120px] max-h-[80px] object-contain grayscale hover:grayscale-0 transition-all duration-300" />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Bespoke;

