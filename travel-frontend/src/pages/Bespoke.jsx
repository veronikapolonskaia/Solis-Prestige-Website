import { Link } from 'react-router-dom';

const Bespoke = () => {
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

      {/* Content sections will be added here */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Bespoke Travel
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              This is the Bespoke page. More sections coming soon...
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Bespoke;

