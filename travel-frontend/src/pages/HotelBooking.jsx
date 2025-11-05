import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Users, CreditCard, Check, Lock } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

const HotelBooking = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user, loading: authLoading } = useAuth();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);
  const [bookingData, setBookingData] = useState({
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    guestName: '',
    guestEmail: '',
    guestPhone: '',
    specialRequests: ''
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchHotel();
  }, [slug]);

  useEffect(() => {
    // Check authentication when component loads or auth state changes
    if (!authLoading) {
      if (!isAuthenticated) {
        // Store the current URL to redirect back after login
        localStorage.setItem('redirectAfterLogin', `/collection/hotels/${slug}`);
        setShowLoginPrompt(true);
      } else if (user) {
        // Auto-fill guest information from logged-in user
        setBookingData(prev => ({
          ...prev,
          guestName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
          guestEmail: user.email || '',
          guestPhone: user.phone || ''
        }));
      }
    }
  }, [isAuthenticated, authLoading, user, slug]);

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookingData(prev => ({
      ...prev,
      [name]: name === 'adults' || name === 'children' ? parseInt(value) || 0 : value
    }));
  };

  const calculateNights = () => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkIn = new Date(bookingData.checkIn);
      const checkOut = new Date(bookingData.checkOut);
      const diffTime = Math.abs(checkOut - checkIn);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays > 0 ? diffDays : 0;
    }
    return 0;
  };

  const calculateTotal = () => {
    if (!hotel || !hotel.price) return 0;
    const nights = calculateNights();
    return parseFloat(hotel.price) * nights;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check authentication before submitting
    if (!isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', `/collection/hotels/${slug}`);
      navigate('/register');
      return;
    }

    if (!bookingData.checkIn || !bookingData.checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    setSubmitting(true);

    try {
      const response = await api.post('/bookings', {
        hotelId: hotel.id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        adults: bookingData.adults,
        children: bookingData.children,
        guestName: bookingData.guestName,
        guestEmail: bookingData.guestEmail,
        guestPhone: bookingData.guestPhone,
        specialRequests: bookingData.specialRequests
      });

      if (response.data?.success) {
        alert(`Booking confirmed! Order #${response.data.data.orderNumber}`);
        navigate('/collection');
      } else {
        throw new Error(response.data?.error || 'Booking failed');
      }
    } catch (error) {
      console.error('Error submitting booking:', error);
      const errorMessage = error?.response?.data?.error || error?.response?.data?.message || 'Failed to submit booking. Please try again.';
      alert(errorMessage);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-16 bg-white">
        <div className="container-custom">
          <div className="animate-pulse space-y-6">
            <div className="h-96 bg-gray-200 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="pt-24 pb-16 bg-white">
        <div className="container-custom">
          <div className="text-center py-12">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Hotel not found</h1>
            <Link to="/collection" className="text-purple-600 hover:text-purple-700">
              Back to Collection
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const nights = calculateNights();
  const total = calculateTotal();

  return (
    <div className="bg-white">
      {/* Login Required Banner */}
      {showLoginPrompt && !isAuthenticated && (
        <section className="pt-24 pb-4 bg-yellow-50 border-b-2 border-yellow-200">
          <div className="container-custom">
            <div className="flex items-center justify-between p-4 bg-yellow-100 rounded-lg">
              <div className="flex items-center gap-3">
                <Lock className="w-5 h-5 text-yellow-700" />
                <div>
                  <p className="font-semibold text-yellow-900">Login Required</p>
                  <p className="text-sm text-yellow-700">Please log in or create an account to complete your booking.</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  to="/register"
                  className="px-4 py-2 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm"
                >
                  Create Account
                </Link>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Hero Section */}
      <section className={`${showLoginPrompt && !isAuthenticated ? 'pt-8' : 'pt-24'} pb-8 bg-gradient-to-br from-purple-50 to-orange-50`}>
        <div className="container-custom">
          <Link to={`/collection/special_offers/${slug}`} className="text-purple-600 hover:text-purple-700 mb-4 inline-block">
            ← Back to hotel details
          </Link>
          <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
            {hotel.mainImage && (
              <img
                src={hotel.mainImage}
                alt={hotel.name}
                className="w-full md:w-48 h-48 object-cover rounded-2xl"
              />
            )}
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-2">
                {hotel.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{hotel.location}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column - Booking Form */}
            <div className="lg:col-span-2">
              <div className="bg-white border border-gray-200 rounded-2xl p-6 md:p-8">
                <h2 className="text-2xl font-display font-bold text-gray-900 mb-6">
                  Booking Details
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Check In *
                      </label>
                      <input
                        type="date"
                        name="checkIn"
                        value={bookingData.checkIn}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Calendar className="w-4 h-4 inline mr-2" />
                        Check Out *
                      </label>
                      <input
                        type="date"
                        name="checkOut"
                        value={bookingData.checkOut}
                        onChange={handleChange}
                        required
                        min={bookingData.checkIn || new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Guests */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users className="w-4 h-4 inline mr-2" />
                        Adults *
                      </label>
                      <input
                        type="number"
                        name="adults"
                        value={bookingData.adults}
                        onChange={handleChange}
                        required
                        min="1"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        <Users className="w-4 h-4 inline mr-2" />
                        Children
                      </label>
                      <input
                        type="number"
                        name="children"
                        value={bookingData.children}
                        onChange={handleChange}
                        min="0"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Guest Information */}
                  <div className="pt-6 border-t">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          name="guestName"
                          value={bookingData.guestName}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email *
                        </label>
                        <input
                          type="email"
                          name="guestEmail"
                          value={bookingData.guestEmail}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Phone *
                        </label>
                        <input
                          type="tel"
                          name="guestPhone"
                          value={bookingData.guestPhone}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Special Requests
                        </label>
                        <textarea
                          name="specialRequests"
                          value={bookingData.specialRequests}
                          onChange={handleChange}
                          rows="4"
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder="Any special requests or preferences..."
                        />
                      </div>
                    </div>
                  </div>

                  {!isAuthenticated ? (
                    <div className="space-y-3">
                      <Link
                        to="/register"
                        className="block w-full text-center px-6 py-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                      >
                        Login to Book
                      </Link>
                      <p className="text-xs text-center text-gray-500">
                        You need to be logged in to complete your booking
                      </p>
                    </div>
                  ) : (
                    <button
                      type="submit"
                      disabled={submitting || !bookingData.checkIn || !bookingData.checkOut}
                      className="w-full px-6 py-4 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {submitting ? 'Processing...' : 'Complete Booking'}
                    </button>
                  )}
                </form>
              </div>
            </div>

            {/* Right Column - Booking Summary */}
            <div className="lg:col-span-1">
              <div className="bg-gray-50 border border-gray-200 rounded-2xl p-6 sticky top-24">
                <h3 className="text-xl font-display font-bold text-gray-900 mb-6">
                  Booking Summary
                </h3>

                <div className="space-y-4 mb-6">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Hotel</p>
                    <p className="font-semibold text-gray-900">{hotel.name}</p>
                    <p className="text-sm text-gray-600">{hotel.location}</p>
                  </div>

                  {bookingData.checkIn && bookingData.checkOut && (
                    <>
                      <div className="pt-4 border-t">
                        <p className="text-sm text-gray-600 mb-1">Check-in</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(bookingData.checkIn).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Check-out</p>
                        <p className="font-semibold text-gray-900">
                          {new Date(bookingData.checkOut).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Duration</p>
                        <p className="font-semibold text-gray-900">
                          {nights} {nights === 1 ? 'Night' : 'Nights'}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600 mb-1">Guests</p>
                        <p className="font-semibold text-gray-900">
                          {bookingData.adults} {bookingData.adults === 1 ? 'Adult' : 'Adults'}
                          {bookingData.children > 0 && `, ${bookingData.children} ${bookingData.children === 1 ? 'Child' : 'Children'}`}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {hotel.specialOffer && hotel.offerTitle && (
                  <div className="mb-6 p-4 bg-green-100 rounded-lg">
                    <div className="flex items-center gap-2 text-green-800 mb-2">
                      <Check className="w-5 h-5" />
                      <span className="font-semibold">Special Offer</span>
                    </div>
                    <p className="text-sm text-green-700">{hotel.offerTitle}</p>
                  </div>
                )}

                {hotel.vipBenefits && hotel.vipBenefits.length > 0 && (
                  <div className="mb-6 p-4 bg-purple-100 rounded-lg">
                    <p className="font-semibold text-purple-900 mb-2">VIP Benefits Included:</p>
                    <ul className="space-y-1">
                      {hotel.vipBenefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="text-sm text-purple-700 flex items-start gap-2">
                          <Check className="w-4 h-4 flex-shrink-0 mt-0.5" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {total > 0 && (
                  <div className="pt-4 border-t">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-600">
                        {nights} {nights === 1 ? 'Night' : 'Nights'} × {hotel.currency} {parseFloat(hotel.price).toLocaleString()}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {hotel.currency} {total.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex justify-between items-center text-xl font-bold text-gray-900 pt-2 border-t">
                      <span>Total</span>
                      <span>{hotel.currency} {total.toLocaleString()}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HotelBooking;

