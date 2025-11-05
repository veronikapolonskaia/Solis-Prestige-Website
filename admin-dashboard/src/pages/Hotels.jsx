import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  PlusIcon,
  MagnifyingGlassIcon,
  PencilIcon,
  TrashIcon,
  EyeIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { formatDate, formatCurrency } from '../utils/helpers';
import api from '../services/api';
import toast from 'react-hot-toast';
import { PageHeader, Card, EmptyState, ConfirmDialog, Badge } from '../components';
import { useDebounce } from '../hooks/useDebounce';

const Hotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [showSpecialOffers, setShowSpecialOffers] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [selectedHotels, setSelectedHotels] = useState([]);
  const [showFilters, setShowFilters] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmContext, setConfirmContext] = useState({ type: null, id: null });

  const debouncedSearch = useDebounce(searchTerm, 500);

  useEffect(() => {
    fetchHotels();
  }, [debouncedSearch, selectedCity, selectedCountry, selectedStatus, showSpecialOffers, currentPage]);

  const fetchHotels = async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(selectedCity && { city: selectedCity }),
        ...(selectedCountry && { country: selectedCountry }),
        ...(showSpecialOffers === 'true' && { specialOffer: true }),
        ...(showSpecialOffers === 'false' && { specialOffer: false }),
      };

      const response = await api.get('/hotels', { params });
      
      if (response.data?.success && response.data?.data) {
        const data = response.data.data;
        setHotels(data.hotels || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalItems(data.pagination?.totalItems || 0);
      } else {
        setHotels(response.data?.data || []);
      }
    } catch (error) {
      console.error('Error fetching hotels:', error);
      toast.error('Failed to fetch hotels');
      setHotels([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (hotelId) => {
    setConfirmContext({ type: 'single', id: hotelId });
    setConfirmOpen(true);
  };

  const confirmDeletion = async () => {
    try {
      if (confirmContext.type === 'single' && confirmContext.id) {
        await api.delete(`/hotels/${confirmContext.id}`);
        toast.success('Hotel deleted successfully');
      }
      fetchHotels();
    } catch (error) {
      console.error('Error deleting hotel:', error);
      toast.error('Failed to delete hotel');
    } finally {
      setConfirmOpen(false);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedHotels(hotels.map(h => h.id));
    } else {
      setSelectedHotels([]);
    }
  };

  const handleSelectHotel = (hotelId, checked) => {
    if (checked) {
      setSelectedHotels([...selectedHotels, hotelId]);
    } else {
      setSelectedHotels(selectedHotels.filter(id => id !== hotelId));
    }
  };

  const getUniqueCities = () => {
    const cities = [...new Set(hotels.map(h => h.city).filter(Boolean))];
    return cities.sort();
  };

  const getUniqueCountries = () => {
    const countries = [...new Set(hotels.map(h => h.country).filter(Boolean))];
    return countries.sort();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Hotels Collection"
        description="Manage your hotel collection and special offers"
        action={
          <Link
            to="/hotels/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors"
          >
            <PlusIcon className="w-5 h-5" />
            Add Hotel
          </Link>
        }
      />

      <Card>
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search hotels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="w-5 h-5" />
              Filters
            </button>
          </div>

          {showFilters && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                <select
                  value={selectedCity}
                  onChange={(e) => {
                    setSelectedCity(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">All Cities</option>
                  {getUniqueCities().map(city => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <select
                  value={selectedCountry}
                  onChange={(e) => {
                    setSelectedCountry(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">All Countries</option>
                  {getUniqueCountries().map(country => (
                    <option key={country} value={country}>{country}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Special Offers</label>
                <select
                  value={showSpecialOffers}
                  onChange={(e) => {
                    setShowSpecialOffers(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">All Hotels</option>
                  <option value="true">Special Offers Only</option>
                  <option value="false">No Special Offers</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={selectedStatus}
                  onChange={(e) => {
                    setSelectedStatus(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500"
                >
                  <option value="">All Status</option>
                  <option value="true">Active</option>
                  <option value="false">Inactive</option>
                </select>
              </div>
            </div>
          )}
        </div>

        {/* Hotels Table */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-200 border-t-rose-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading hotels...</p>
          </div>
        ) : hotels.length === 0 ? (
          <EmptyState
            title="No hotels found"
            description="Get started by adding your first hotel to the collection"
            action={
              <Link
                to="/hotels/new"
                className="inline-flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700"
              >
                <PlusIcon className="w-5 h-5" />
                Add Hotel
              </Link>
            }
          />
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={selectedHotels.length === hotels.length && hotels.length > 0}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                        className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                      />
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hotel
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Offer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {hotels.map((hotel) => (
                    <tr key={hotel.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <input
                          type="checkbox"
                          checked={selectedHotels.includes(hotel.id)}
                          onChange={(e) => handleSelectHotel(hotel.id, e.target.checked)}
                          className="rounded border-gray-300 text-rose-600 focus:ring-rose-500"
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {hotel.mainImage && (
                            <img
                              src={hotel.mainImage}
                              alt={hotel.name}
                              className="h-12 w-12 rounded-lg object-cover mr-3"
                            />
                          )}
                          <div>
                            <div className="text-sm font-medium text-gray-900">{hotel.name}</div>
                            {hotel.featured && (
                              <Badge color="purple" className="mt-1">Featured</Badge>
                            )}
                            {hotel.popular && (
                              <Badge color="blue" className="mt-1 ml-1">Popular</Badge>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{hotel.city}</div>
                        <div className="text-sm text-gray-500">{hotel.country}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {hotel.specialOffer ? (
                          <Badge color="green">{hotel.offerTitle || 'Special Offer'}</Badge>
                        ) : (
                          <span className="text-sm text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <Badge color={hotel.isActive ? 'green' : 'gray'}>
                          {hotel.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(hotel.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/hotels/${hotel.id}/edit`}
                            className="text-blue-600 hover:text-blue-900"
                            title="Edit"
                          >
                            <PencilIcon className="w-5 h-5" />
                          </Link>
                          <button
                            onClick={() => handleDelete(hotel.id)}
                            className="text-red-600 hover:text-red-900"
                            title="Delete"
                          >
                            <TrashIcon className="w-5 h-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <div className="text-sm text-gray-700">
                  Showing {((currentPage - 1) * 12) + 1} to {Math.min(currentPage * 12, totalItems)} of {totalItems} hotels
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                    disabled={currentPage === totalPages}
                    className="px-4 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Card>

      <ConfirmDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={confirmDeletion}
        title="Delete Hotel"
        message="Are you sure you want to delete this hotel? This action cannot be undone."
      />
    </div>
  );
};

export default Hotels;

