import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeftIcon, PhotoIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { PageHeader, Card } from '../components';
import api from '../services/api';
import toast from 'react-hot-toast';

const GalleryForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'other',
    featured: false,
    display_order: 0,
    alt_text: '',
    tags: [],
    status: 'active'
  });

  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [existingImage, setExistingImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [tagInput, setTagInput] = useState('');

const fetchCategories = useCallback(async () => {
  try {
    const response = await api.get('/gallery/categories');
    setCategories(response.data.data);
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
}, []);

const fetchGalleryItem = useCallback(async () => {
  if (!isEdit) return;
  try {
    setLoading(true);
    const response = await api.get(`/gallery/${id}`);
    const item = response.data.data;
    setFormData({
      title: item.title,
      description: item.description || '',
      category: item.category,
      featured: item.featured,
      display_order: item.display_order,
      alt_text: item.alt_text || '',
      tags: item.tags || [],
      status: item.status
    });
    setExistingImage(item.image_url);
  } catch (error) {
    console.error('Error fetching gallery item:', error);
    toast.error('Failed to fetch gallery item');
    navigate('/gallery');
  } finally {
    setLoading(false);
  }
}, [id, isEdit, navigate]);

useEffect(() => {
  fetchCategories();
}, [fetchCategories]);

useEffect(() => {
  fetchGalleryItem();
}, [fetchGalleryItem]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    if (!isEdit && !imageFile) {
      toast.error('Image is required');
      return;
    }

    try {
      setLoading(true);

      if (isEdit) {
        // Update existing gallery item
        await api.put(`/gallery/${id}`, formData);
        
        // Update image if new one is provided
        if (imageFile) {
          const formDataWithImage = new FormData();
          formDataWithImage.append('image', imageFile);
          await api.put(`/gallery/${id}/image`, formDataWithImage);
        }
        
        toast.success('Gallery item updated successfully');
      } else {
        // Create new gallery item
        const formDataWithImage = new FormData();
        formDataWithImage.append('image', imageFile);
        Object.keys(formData).forEach(key => {
          if (key === 'tags') {
            formDataWithImage.append(key, JSON.stringify(formData[key]));
          } else {
            formDataWithImage.append(key, formData[key]);
          }
        });

        await api.post('/gallery', formDataWithImage);
        
        toast.success('Gallery item created successfully');
      }

      navigate('/gallery');
    } catch (error) {
      console.error('Error saving gallery item:', error);
      toast.error('Failed to save gallery item');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEdit) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-rose-200 border-t-rose-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={isEdit ? 'Edit Gallery Item' : 'Add Gallery Item'}
        subtitle={isEdit ? 'Update gallery item details' : 'Create a new gallery item to showcase your events'}
        action={
          <button
            onClick={() => navigate('/gallery')}
            className="btn-outline flex items-center space-x-2"
          >
            <ArrowLeftIcon className="h-5 w-5" />
            <span>Back to Gallery</span>
          </button>
        }
      />

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Enter gallery item title"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Enter description (optional)"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Category
                      </label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      >
                        {categories.map((category) => (
                          <option key={category.id} value={category.id}>
                            {category.icon} {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        name="display_order"
                        value={formData.display_order}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="0"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Alt Text
                    </label>
                    <input
                      type="text"
                      name="alt_text"
                      value={formData.alt_text}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                      placeholder="Enter alt text for accessibility"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Tags
                    </label>
                    <div className="flex space-x-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                        placeholder="Enter tag and press Enter"
                      />
                      <button
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors duration-200"
                      >
                        Add
                      </button>
                    </div>
                    {formData.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-rose-100 text-rose-800"
                          >
                            {tag}
                            <button
                              type="button"
                              onClick={() => handleRemoveTag(tag)}
                              className="ml-2 hover:text-rose-600"
                            >
                              <XMarkIcon className="h-4 w-4" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Settings</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      name="featured"
                      checked={formData.featured}
                      onChange={handleInputChange}
                      className="h-4 w-4 text-rose-600 focus:ring-rose-500 border-gray-300 rounded"
                    />
                    <label className="ml-2 text-sm text-gray-700">
                      Featured item (will be highlighted in gallery)
                    </label>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:border-transparent"
                    >
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="draft">Draft</option>
                    </select>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Image Upload */}
          <div className="space-y-6">
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold mb-4">Image</h3>
                
                <div className="space-y-4">
                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {isEdit ? 'Update Image' : 'Upload Image'} *
                    </label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors duration-200">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        id="image-upload"
                        required={!isEdit}
                      />
                      <label
                        htmlFor="image-upload"
                        className="cursor-pointer flex flex-col items-center"
                      >
                        <PhotoIcon className="h-12 w-12 text-gray-400 mb-2" />
                        <span className="text-sm text-gray-600">
                          Click to upload image
                        </span>
                        <span className="text-xs text-gray-500 mt-1">
                          PNG, JPG, WEBP up to 10MB
                        </span>
                      </label>
                    </div>
                  </div>

                  {/* Image Preview */}
                  {(imagePreview || existingImage) && (
                    <div className="relative">
                      <img
                        src={imagePreview || existingImage}
                        alt="Preview"
                        className="w-full h-48 object-cover rounded-lg"
                      />
                      {imagePreview && (
                        <button
                          type="button"
                          onClick={removeImage}
                          className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors duration-200"
                        >
                          <XMarkIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  )}

                  {isEdit && existingImage && !imagePreview && (
                    <div className="text-sm text-gray-500">
                      Current image will be kept if no new image is uploaded
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/gallery')}
            className="btn-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="btn-primary flex items-center space-x-2"
          >
            {loading && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
            )}
            <span>{isEdit ? 'Update Gallery Item' : 'Create Gallery Item'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default GalleryForm;
