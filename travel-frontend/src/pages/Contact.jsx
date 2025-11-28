import { Mail } from 'lucide-react';

const Contact = () => {
  return (
    <div className="bg-white min-h-screen pt-24 sm:pt-28 md:pt-32">
      <div className="container-custom py-16 md:py-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Title */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold text-brandPurple mb-8 md:mb-12">
            Contact us
          </h1>

          {/* Email Section */}
          <div className="mb-12 md:mb-16">
            <div className="flex items-center justify-center gap-4 mb-6">
              <Mail className="w-6 h-6 md:w-8 md:h-8 text-brandPurple" />
              <a 
                href="mailto:vip@solisprestige.com"
                className="text-xl sm:text-2xl md:text-3xl font-display text-brandPurple hover:text-brandPurple/80 transition-colors"
              >
                vip@solisprestige.com
              </a>
            </div>
          </div>

          {/* Message */}
          <p className="text-lg sm:text-xl md:text-2xl text-brandPurple leading-relaxed max-w-2xl mx-auto font-serif">
            We are always pleased to hear from you, to listen, to understand, and to shape a journey that feels uniquely yours.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Contact;

