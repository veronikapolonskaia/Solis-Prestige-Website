import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Star, Award, Calendar } from 'lucide-react';
import api from '../services/api';

const HotelCard = ({ hotel }) => (
  <Link 
    to={hotel.specialOffer ? `/collection/special_offers/${hotel.slug}` : `/collection/hotels/${hotel.slug}`}
    className="group block rounded-2xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300"
  >
    <div className="relative">
      {hotel.mainImage && (
        <div className="aspect-[16/10] overflow-hidden">
          <img 
            src={hotel.mainImage} 
            alt={hotel.name} 
            className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500" 
          />
        </div>
      )}
      {hotel.specialOffer && (
        <div className="absolute top-4 left-4">
          <span className="inline-flex items-center rounded-full bg-green-600 text-white text-xs font-semibold px-3 py-1 shadow-lg">
            Special Offer
          </span>
        </div>
      )}
      {hotel.featured && (
        <div className="absolute top-4 right-4">
          <span className="inline-flex items-center rounded-full bg-purple-600 text-white text-xs font-semibold px-3 py-1 shadow-lg">
            Featured
          </span>
        </div>
      )}
    </div>
    <div className="p-6">
      <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900 group-hover:text-purple-700 transition-colors">
        {hotel.name}
      </h3>
      <div className="mt-2 flex items-center gap-2 text-gray-600">
        <MapPin className="w-4 h-4" />
        <span className="text-sm">{hotel.location}</span>
      </div>
      {hotel.shortDescription && (
        <p className="mt-3 text-gray-600 line-clamp-2 text-sm">{hotel.shortDescription}</p>
      )}
      {hotel.specialOffer && hotel.offerTitle && (
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2 text-green-700">
            <Award className="w-4 h-4" />
            <span className="text-sm font-semibold">{hotel.offerTitle}</span>
          </div>
        </div>
      )}
      {hotel.price && (
        <div className="mt-4 text-lg font-semibold text-gray-900">
          From {hotel.currency} {parseFloat(hotel.price).toLocaleString()}/night
        </div>
      )}
    </div>
  </Link>
);

const Collection = () => {
  const [specialOffers, setSpecialOffers] = useState([]);
  const [popularHotels, setPopularHotels] = useState([]);
  const [allHotels, setAllHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [offersRes, popularRes, allRes] = await Promise.all([
        api.get('/hotels/special-offers'),
        api.get('/hotels/popular'),
        api.get('/hotels', { params: { limit: 50 } })
      ]);

      if (offersRes.data?.success) {
        setSpecialOffers(offersRes.data.data || []);
      }
      if (popularRes.data?.success) {
        setPopularHotels(popularRes.data.data || []);
      }
      if (allRes.data?.success && allRes.data?.data) {
        setAllHotels(allRes.data.data.hotels || allRes.data.data || []);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="pt-24 md:pt-28 pb-16 bg-gradient-to-br from-purple-50 to-orange-50">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-gray-900 mb-6">
              ASW Collection
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 mb-8">
              Hotels we love with extraordinary benefits
            </p>
            <div className="h-1 w-24 bg-orange-400 rounded-full mx-auto" />
          </div>
        </div>
      </section>

      {/* VIP Benefits Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              VIP benefits for Premium Members*
            </h2>
            <p className="text-gray-600 mb-8">
              Our exclusive ASMALLWORLD VIP rate offers you extraordinary benefits at no extra cost
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: '🏨', title: 'Room upgrade', desc: 'to a better category' },
              { icon: '💰', title: '$100 hotel credit', desc: 'for your stay' },
              { icon: '🍳', title: 'Complimentary breakfast', desc: 'for two every day' },
              { icon: '⭐', title: 'Earn Loyalty Points', desc: 'Hyatt, Bonvoy, Hilton, Shangri-La' },
              { icon: '⏰', title: 'Early Check-In', desc: 'to start your stay early' },
              { icon: '🕐', title: 'Late Check-Out', desc: 'to extend your stay' },
            ].map((benefit, idx) => (
              <div key={idx} className="bg-gradient-to-br from-[#f2dfcb] to-[#e8d4bf] p-6 rounded-2xl text-center border border-[#e8d4bf]/50">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="font-semibold text-gray-900 mb-1">{benefit.title}</h3>
                <p className="text-sm text-gray-700">{benefit.desc}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-sm text-gray-500 mt-8">
            *VIP benefits are available to ASMALLWORLD Premium Members. Benefits vary by hotel and may be subject to availability.
          </p>
        </div>
      </section>

      {/* Special Offers Section */}
      <section className="section-padding bg-gray-50">
        <div className="container-custom">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Special offers</h2>
            <div className="h-1 w-24 bg-orange-400 rounded-full" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-gray-100 animate-pulse h-80" />
              ))}
            </div>
          ) : specialOffers.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {specialOffers.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No special offers available at the moment.</p>
            </div>
          )}

          {specialOffers.length > 6 && (
            <div className="text-center mt-10">
              <Link
                to="/collection?filter=special-offers"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
              >
                See all special offers
                <span className="text-xl">→</span>
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* Popular Hotels Section */}
      <section className="section-padding bg-white">
        <div className="container-custom">
          <div className="mb-10">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">Popular hotels</h2>
            <div className="h-1 w-24 bg-orange-400 rounded-full" />
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-2xl overflow-hidden bg-gray-100 animate-pulse h-80" />
              ))}
            </div>
          ) : popularHotels.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {popularHotels.map((hotel) => (
                <HotelCard key={hotel.id} hotel={hotel} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600">No popular hotels available at the moment.</p>
            </div>
          )}
        </div>
      </section>

      {/* All Hotels Section */}
      {allHotels.length > 0 && (
        <section className="section-padding bg-gray-50">
          <div className="container-custom">
            <div className="mb-10">
              <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">All Hotels</h2>
              <div className="h-1 w-24 bg-orange-400 rounded-full" />
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="rounded-2xl overflow-hidden bg-gray-100 animate-pulse h-80" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {allHotels
                  .filter(hotel => 
                    !specialOffers.some(offer => offer.id === hotel.id) &&
                    !popularHotels.some(pop => pop.id === hotel.id)
                  )
                  .map((hotel) => (
                    <HotelCard key={hotel.id} hotel={hotel} />
                  ))}
              </div>
            )}

            {allHotels.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-600">No hotels available at the moment.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Sign Up Section */}
      <section className="section-padding bg-champagne">
        <div className="container-custom">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-4">
              Sign up for extraordinary benefits
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Enjoy the world's best hotels with our extraordinary benefits
            </p>
            <Link
              to="/register"
              className="inline-flex items-center gap-3 px-10 py-4 bg-gray-900 text-white rounded-full font-semibold text-lg hover:bg-gray-800 transition-all duration-300 shadow-lg"
            >
              Create Your Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Collection;

