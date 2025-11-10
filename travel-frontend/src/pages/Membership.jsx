import { Check, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';

const Membership = () => {
  const membershipTiers = [
    {
      name: 'Premium',
      subtitle: 'Enjoy an enhanced ASMALLWORLD experience',
      price: '€79',
      period: '/YEAR',
      features: [
        'GHA DISCOVERY Gold Status',
        'Access to ASMALLWORLD Collection VIP rates and benefits',
        'Free nights at luxury hotels with our special offers',
        'Exclusive travel privileges',
        'Access to premium-only events',
        'Preferential pricing for events',
        'Create marketplace listings'
      ]
    },
    {
      name: 'Advantage',
      subtitle: 'Perfect for weekend escapes',
      price: '€890',
      period: '/YEAR',
      priceLabel: 'PRICES FROM',
      features: [
        'Up to 35,000 award miles for Business & First Class upgrades',
        '250 DISCOVERY Dollars (D$ = USD 1)',
        'Access to 1,700+ airport lounges and experiences',
        'GHA DISCOVERY Platinum Status',
        'SIXT Platinum Status',
        'All benefits included in Premium Membership'
      ]
    },
    {
      name: 'Prestige',
      subtitle: 'Travel the world in style',
      price: '€5,590',
      period: '/YEAR',
      priceLabel: 'PRICES FROM',
      features: [
        'Up to 250,000 award miles for Business and First Class upgrades',
        'Access to 1,700+ airport lounges',
        'GHA DISCOVERY Titanium Status',
        'Jumeirah One Gold Status',
        'SIXT Platinum Status',
        'World\'s Finest Clubs Membership',
        'All benefits included in Premium Membership'
      ]
    },
    {
      name: 'Signature',
      subtitle: 'The ultimate travel membership',
      price: '€9,790',
      period: '/YEAR',
      priceLabel: 'PRICES FROM',
      features: [
        'Up to 500,000 award miles for Business and First Class upgrades',
        'Access to 1,700+ airport lounges',
        'GHA DISCOVERY Titanium Status',
        'Jumeirah One Gold status',
        'SIXT Diamond status',
        'World\'s Finest Clubs Membership',
        'All benefits included in Premium Membership'
      ]
    }
  ];

  const faqItems = [
    {
      q: "How do the memberships differ?",
      a: "With the Free Membership, you can access the community and read all content. If you verify yourself and become a verified free user, you can also actively participate in online activities and events. The 'Premium' membership gives you additional community features and VIP hotel benefits, while the 'Advantage' membership includes those benefits plus up to 35,000 air miles with our airline partners and further travel benefits. The 'Prestige' and 'Signature' memberships provide extensive travel-related privileges, including up to 500,000 air miles."
    },
    {
      q: "What is 'verification' in the Free tier?",
      a: "Verification in the Free tier involves confirming your identity to ASMALLWORLD, either by having an existing community member vouch for you or by submitting a request with relevant details to our support team. Once verified, free members can actively participate in online activities and events. These verification measures help maintain a safe and trustworthy environment for all ASMALLWORLD members."
    },
    {
      q: "Can I attend all events with all memberships?",
      a: "As a verified free member, you will have access to most of our events. 'Premium', 'Advantage', 'Prestige' and 'Signature' members also enjoy access to Premium-only events and receive preferential pricing on all events."
    },
    {
      q: "For the paid memberships, how long are my privileges valid for?",
      a: "'Premium', 'Advantage', 'Prestige' and 'Signature' status privileges are valid for 12 months from the start of your membership, while the validity and usage of air miles are subject to our airline partners’ terms and conditions. After one year, you can choose to renew your membership, which will extend your privileges for another year and grant additional air miles. If you choose not to renew your ASMALLWORLD membership, your status privileges will lapse."
    },
    {
      q: "Are the air miles 'status miles' or 'award miles' and how can I use them?",
      a: "The miles included in your 'Advantage', 'Prestige' or 'Signature' membership are award miles that can be used to purchase flights, but they will not count towards your status."
    },
    {
      q: "Are you an official partner for the air miles you are offering?",
      a: "Yes, we are official partners with all our air miles partners, and the miles will be transferred directly to your account. You can use them exactly like your other award miles."
    },
    {
      q: "How long are air miles and status levels valid?",
      a: "Status levels are valid for at least 12 months. Those received via promotions or special offers are subject to the specific terms and conditions of the offer. The validity and usage of air miles are subject to the terms and conditions of our airline partners."
    },
    {
      q: "If I renew my ‘Advantage’, 'Prestige' or 'Signature' membership, will I get the amount of miles again?",
      a: "Yes, the miles will be credited each year at payment of the membership fee."
    },
    {
      q: "Is there an automatic renewal of my membership?",
      a: "For the 'Premium' Membership, we have an automatic renewal functionality for your convenience. However, you can switch it off at any time from your account settings. 'Advantage', 'Prestige' and 'Signature' Memberships do not automatically renew."
    },
    {
      q: "What are my payment options?",
      a: "We accept Visa, MasterCard, American Express, PayPal and bank transfers. For bank transfers, please contact us at support@asw.com."
    },
    {
      q: "Whom should I contact to find out more?",
      a: "Our dedicated Member Services team will be happy to assist you with any of your queries. Contact them at support@asw.com."
    },
    {
      q: "How often can I purchase ‘Advantage’, ‘Prestige’ or ‘Signature’ memberships?",
      a: "In most cases, you can purchase one ‘Advantage’, one ‘Prestige’ and one ‘Signature’ membership per airline account each year. There are two exceptions: for Miles & More, the Prestige membership may be purchased once outside of a promotion and once during each promotion, which usually takes place 2-3 times per year. For Emirates, you may purchase only one membership per year in total."
    },
    {
      q: "Are there any geographic restrictions on purchasing memberships?",
      a: "From September 30, 2025, ‘Prestige’ memberships with Emirates Skywards award miles will not be available to Skywards Members whose account residency is registered in the United Arab Emirates (UAE). All other memberships have no geographic restrictions."
    }
  ];

  return (
    <div className="bg-gray-50">
      {/* Hero Section with Background Image */}
      <section className="relative flex items-center justify-center overflow-hidden pt-24 sm:pt-28 md:pt-32 min-h-[60vh]">
        <div 
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url(https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1600&auto=format&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-transparent"></div>
        </div>
        <div className="relative z-10 text-center text-white px-4 sm:px-6">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold tracking-tight">
            Membership Options
          </h1>
        </div>
      </section>

      {/* Membership Cards Section - Overlapping Hero */}
      <section className="relative -mt-32 sm:-mt-40 md:-mt-48 pb-16 sm:pb-20">
        <div className="container-custom">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {membershipTiers.map((tier, index) => (
              <div 
                key={tier.name}
                className="group bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 flex flex-col hover:-translate-y-2 hover:bg-gradient-to-br hover:from-[#1a3a52] hover:to-[#2a5570]"
              >
                {/* Card Header */}
                <div className="p-6 sm:p-7 text-center border-b border-gray-100 group-hover:border-white/20 transition-colors duration-500">
                  <h3 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-2 group-hover:text-white transition-colors duration-500">
                    {tier.name}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed group-hover:text-gray-200 transition-colors duration-500">
                    {tier.subtitle}
                  </p>
                </div>

                {/* Features List */}
                <div className="p-6 sm:p-7 flex-grow">
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-[#1a3a52] group-hover:text-white flex-shrink-0 mt-0.5 transition-colors duration-500" />
                        <span className="text-xs sm:text-sm text-gray-700 leading-relaxed group-hover:text-gray-100 transition-colors duration-500">
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Pricing & CTA */}
                <div className="p-6 sm:p-7 pt-0 sm:pt-0 mt-auto">
                  {tier.priceLabel && (
                    <p className="text-xs sm:text-sm text-gray-500 uppercase tracking-wider mb-2 group-hover:text-gray-300 transition-colors duration-500">
                      {tier.priceLabel}
                    </p>
                  )}
                  <div className="flex items-end gap-1 mb-4">
                    <span className="text-2xl sm:text-3xl font-bold text-gray-900 group-hover:text-white transition-colors duration-500">
                      {tier.price}
                    </span>
                    <span className="text-xs sm:text-sm text-gray-500 pb-1 group-hover:text-gray-300 transition-colors duration-500">
                      {tier.period}
                    </span>
                  </div>
                  <Link
                    to="/register"
                    className="block w-full text-center px-5 sm:px-6 py-3 bg-[#1a3a52] text-white rounded-full font-semibold text-xs uppercase tracking-wider hover:bg-white hover:text-[#1a3a52] transition-all duration-300 group-hover:bg-white group-hover:text-[#1a3a52]"
                  >
                    SELECT MEMBERSHIP
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Privilege Partners Carousel */}
      <section className="bg-white py-14 sm:py-16 shadow-lg">
        <div className="container-custom text-center">
          <p className="text-base sm:text-lg text-gray-600 mb-2 sm:mb-3">
            Selection of our
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900 mb-8 sm:mb-12">
            Privilege partners
          </h2>

          {/* Scrolling Carousel */}
          <div className="relative overflow-hidden">
            {/* Gradient Overlays */}
            <div className="hidden sm:block absolute left-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="hidden sm:block absolute right-0 top-0 bottom-0 w-24 md:w-32 bg-gradient-to-l from-white to-transparent z-10"></div>
            
            {/* Scrolling Container */}
            <div className="flex animate-scroll">
              {/* First Set of Logos */}
              <div className="flex items-center gap-10 sm:gap-16 px-6 sm:px-8">
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-16 sm:h-20">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/membership/logos/partner_of_miles_and_more-571d77ee988aab85dcce3cd3f58bfcfbf63103d75d9e0639dd220129e800b697.svg" 
                    alt="Miles & More Partner" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-16 sm:h-20">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/membership/logos/emirates_skywards-b16353fd2836b6c7254d8ff5fa8d9ea716ca83c483906a7aad1bb95f99f799f3.svg" 
                    alt="Emirates Skywards" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-16 sm:h-20">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/membership/logos/gha_discovery-4e227406199961d6887f0b0273cc173c7f786a7c761c70c02c7dcc3563874586.svg" 
                    alt="GHA Discovery" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-16 sm:h-20">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/membership/logos/priority_pass-b3ea9d433f202d42ecaea9f79c4a410d2eb7c69fa369752bf15c9d6ec87aa434.svg" 
                    alt="Priority Pass" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-16 sm:h-20">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/membership/logos/sixt-27998ecd046dac8e1c95236e3d5d37274d2c6c27b351142631ab3446ba8e0853.svg" 
                    alt="SIXT" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-16 sm:h-20">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/membership/logos/jumeirah-48e9fc7e2c2a94fb929876b6e122041f394d03197c94e7f7c2b0461a86bc2d7b.svg" 
                    alt="Jumeirah" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-16 sm:h-20">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/membership/logos/tsa_precheck-5a6fcd30c8529821fd0201f9671d4c56448c0cf7e1b2df4272a7a82284444b47.svg" 
                    alt="TSA PreCheck" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-16 sm:h-20">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/membership/logos/wfc-e975f6c5b18313787447f52a5e9a4f1c00ce2901a0bd0ab21c84cb85ac958de8.svg" 
                    alt="World's Finest Clubs" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
              
              {/* Duplicate Set for Seamless Loop */}
              <div className="flex items-center gap-10 sm:gap-16 px-6 sm:px-8" aria-hidden="true">
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-16 sm:h-20">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/membership/logos/partner_of_miles_and_more-571d77ee988aab85dcce3cd3f58bfcfbf63103d75d9e0639dd220129e800b697.svg" 
                    alt="Miles & More Partner" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-16 sm:h-20">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/membership/logos/emirates_skywards-b16353fd2836b6c7254d8ff5fa8d9ea716ca83c483906a7aad1bb95f99f799f3.svg" 
                    alt="Emirates Skywards" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-16 sm:h-20">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/membership/logos/gha_discovery-4e227406199961d6887f0b0273cc173c7f786a7c761c70c02c7dcc3563874586.svg" 
                    alt="GHA Discovery" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-16 sm:h-20">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/membership/logos/priority_pass-b3ea9d433f202d42ecaea9f79c4a410d2eb7c69fa369752bf15c9d6ec87aa434.svg" 
                    alt="Priority Pass" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-16 sm:h-20">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/membership/logos/sixt-27998ecd046dac8e1c95236e3d5d37274d2c6c27b351142631ab3446ba8e0853.svg" 
                    alt="SIXT" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-16 sm:h-20">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/membership/logos/jumeirah-48e9fc7e2c2a94fb929876b6e122041f394d03197c94e7f7c2b0461a86bc2d7b.svg" 
                    alt="Jumeirah" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-16 sm:h-20">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/membership/logos/tsa_precheck-5a6fcd30c8529821fd0201f9671d4c56448c0cf7e1b2df4272a7a82284444b47.svg" 
                    alt="TSA PreCheck" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
                <div className="flex items-center justify-center min-w-[140px] sm:min-w-[180px] h-16 sm:h-20">
                  <img 
                    src="https://dv4xo43u9eo19.cloudfront.net/assets/membership/logos/wfc-e975f6c5b18313787447f52a5e9a4f1c00ce2901a0bd0ab21c84cb85ac958de8.svg" 
                    alt="World's Finest Clubs" 
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-16 bg-white">
        <div className="container-custom max-w-4xl mx-auto">
          <p className="text-base sm:text-lg text-center text-gray-600 pt-2 sm:pt-4 mb-2 sm:mb-3">Find out more</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-center text-gray-900 mb-5 sm:mb-6">
            Frequently asked questions
          </h2>

          <div className="divide-y divide-gray-200">
            {faqItems.map((item, idx) => (
              <details key={idx} className="group py-3 sm:py-4 my-1">
                <summary className="list-none cursor-pointer select-none flex items-start justify-between gap-4 sm:gap-6 pb-2 pt-1">
                  <span className="text-base sm:text-lg font-semibold text-[#1a3a52]">
                    {item.q}
                  </span>
                  <span className="mt-1 shrink-0 text-[#1a3a52] group-open:hidden">
                    <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                  <span className="mt-1 shrink-0 text-[#1a3a52] hidden group-open:block">
                    <Minus className="w-4 h-4 sm:w-5 sm:h-5" />
                  </span>
                </summary>
                <div className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {item.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Us Hero */}
      <section id="contact-us" className="relative w-full overflow-hidden">
        {/* Responsive ratio container */}
        <div className="relative w-full min-h-[260px] md:min-h-0" style={{ paddingTop: '45%', maxHeight: '420px' }}>
          <img
            loading="lazy"
            alt="Contact Us"
            src="https://dv4xo43u9eo19.cloudfront.net/assets/membership/contact_us-9539653b149b15f427bb689a6d8060c061692354e12e43b9c73bd269503403e3.jpg"
            className="absolute inset-0 h-full w-full object-cover"
          />
          {/* Overlay */}
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center text-center text-white bg-black/30">
            <p className="text-2xl sm:text-3xl md:text-5xl font-bold mb-3 sm:mb-4 drop-shadow">
              Have a question?
            </p>
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-display font-bold mb-6 sm:mb-8 drop-shadow-lg">
              Contact Us
            </h2>
            <a
              href="mailto:support@asw.com"
              className="inline-flex items-center px-6 sm:px-8 py-3 rounded-full bg-white/90 text-[#1a3a52] font-semibold tracking-wide hover:bg-white transition-colors"
            >
              <span className="mr-3 inline-block">
                {/* simple mail icon using emoji fallback to avoid asset dependency */}
                ✉️
              </span>
              Contact Us
            </a>
          </div>
        </div>
      </section>

      {/** Removed bottom CTA/info section per request **/}
    </div>
  );
};

export default Membership;

