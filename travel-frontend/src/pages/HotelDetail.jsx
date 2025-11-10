import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Award, Check } from 'lucide-react';
import api from '../services/api';

const HotelDetail = () => {
  const { slug } = useParams();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHotel();
  }, [slug]);

  const fetchHotel = async () => {
    setLoading(true);
    try {
      const response = await api.get(`/hotels/${slug}`);
      if (response.data?.success) {
        setHotel(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching hotel:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-8 sm:pt-12 md:pt-16 pb-12 bg-white">
        <div className="container-custom">
          <div className="animate-pulse space-y-6">
            <div className="h-64 sm:h-80 md:h-96 bg-gray-200 rounded-2xl" />
            <div className="h-6 sm:h-8 bg-gray-200 rounded w-2/3 sm:w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="pt-8 sm:pt-12 md:pt-16 pb-12 bg-white">
        <div className="container-custom">
          <div className="text-center py-12">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Hotel not found</h1>
            <Link to="/collection" className="text-purple-600 hover:text-purple-700">
              Back to Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const isSpecialOffer = hotel.specialOffer;
  const offerValid = hotel.offerValidUntil && new Date(hotel.offerValidUntil) > new Date();

  return (
    <div className="bg-white">
      {/* Hero Image */}
      <section className="relative h-[50vh] md:h-[60vh] min-h-[320px] sm:min-h-[380px] overflow-hidden">
        {hotel.mainImage && (
          <img
            src={hotel.mainImage}
            alt={hotel.name}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black bg-opacity-40" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white px-4 sm:px-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-display font-bold mb-3 sm:mb-4">
              {hotel.name}
            </h1>
            <div className="flex flex-wrap items-center justify-center gap-2 text-base sm:text-lg">
              <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{hotel.location}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Special Offer Banner */}
      {isSpecialOffer && offerValid && (
        <section className="bg-green-600 text-white py-5 sm:py-6">
          <div className="container-custom">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 text-center">
              <Award className="w-6 h-6 sm:w-8 sm:h-8" />
              <div>
                <h2 className="text-xl sm:text-2xl md:text-3xl font-display font-bold mb-2">
                  {hotel.offerTitle || 'Special Offer'}
                </h2>
                {hotel.offerValidUntil && (
                  <p className="text-xs sm:text-sm opacity-90">
                    Valid until {new Date(hotel.offerValidUntil).toLocaleDateString()}
                  </p>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Left Column - Main Content */}
            <div className="lg:col-span-2 space-y-6 sm:space-y-8">
              {/* Special Offer Details */}
              {isSpecialOffer && offerValid && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 sm:p-6 rounded-2xl border border-green-200">
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-3 sm:mb-4">
                    {hotel.offerTitle || 'Special Offer'}
                  </h2>
                  {hotel.offerDetails && (
                    <div className="prose prose-sm sm:prose-base max-w-none text-gray-700 mb-3 sm:mb-4">
                      <p className="whitespace-pre-line">{hotel.offerDetails}</p>
                    </div>
                  )}
                  {hotel.offerBookingDeadline && (
                    <div className="flex flex-wrap items-center gap-2 text-green-700 font-semibold text-sm">
                      <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="leading-snug">
                        Book before {new Date(hotel.offerBookingDeadline).toLocaleDateString()} for stays until{' '}
                        {hotel.offerValidUntil && new Date(hotel.offerValidUntil).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                  {hotel.offerBlackoutDates && hotel.offerBlackoutDates.length > 0 && (
                    <div className="mt-4 text-sm text-gray-600">
                      <p className="font-semibold mb-2">Blackout dates may apply.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Hotel Description */}
              <div>
                <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-3 sm:mb-4">
                  About this hotel
                </h2>
                {hotel.description && (
                  <div className="prose prose-sm sm:prose-base max-w-none text-gray-700">
                    <p className="whitespace-pre-line">{hotel.description}</p>
                  </div>
                )}
                {hotel.shortDescription && !hotel.description && (
                  <p className="text-sm sm:text-base text-gray-700">{hotel.shortDescription}</p>
                )}
              </div>

              {/* Gallery */}
              {hotel.images && hotel.images.length > 1 && (
                <div>
                  <h2 className="text-xl sm:text-2xl font-display font-bold text-gray-900 mb-3 sm:mb-4">Gallery</h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                    {hotel.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`${hotel.name} - Image ${index + 1}`}
                        className="w-full h-32 sm:h-40 md:h-48 object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right Column - Booking & Benefits */}
            <div className="space-y-5 sm:space-y-6">
              {/* Booking Card */}
              <div className="bg-gray-50 p-5 sm:p-6 rounded-2xl border border-gray-200">
                {isSpecialOffer && offerValid && (
                  <div className="mb-4 p-3 bg-green-100 rounded-lg">
                    <p className="text-sm font-semibold text-green-800 mb-1">
                      Special Offer Available
                    </p>
                    <p className="text-xs text-green-700">
                      {hotel.offerTitle}
                    </p>
                  </div>
                )}
                
                {hotel.price && (
                  <div className="mb-4">
                    <p className="text-sm text-gray-600 mb-1">Starting from</p>
                    <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                      {hotel.currency} {parseFloat(hotel.price).toLocaleString()}
                      <span className="text-sm sm:text-lg font-normal text-gray-600">/night</span>
                    </p>
                  </div>
                )}

                <Link
                  to={`/collection/hotels/${hotel.slug}`}
                  className="block w-full text-center px-5 sm:px-6 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                >
                  Book now
                </Link>

                <p className="text-xs text-gray-500 mt-3 sm:mt-4 text-center">
                  Prices may vary based on dates and availability
                </p>
              </div>

              {/* VIP Benefits */}
              {hotel.vipBenefits && hotel.vipBenefits.length > 0 && (
                <div className="bg-purple-50 p-5 sm:p-6 rounded-2xl border border-purple-200">
                  <h3 className="text-base sm:text-lg font-display font-bold text-gray-900 mb-3 sm:mb-4">
                    VIP Benefits Included
                  </h3>
                  <ul className="space-y-2.5">
                    {hotel.vipBenefits.map((benefit, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HotelDetail;

