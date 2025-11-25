import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { 
  FolderIcon, PhotoIcon, EyeIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';
import FormField from '../forms/FormField';
import ImageUpload from '../ui/ImageUpload';
import toast from 'react-hot-toast';

const CategoryForm = ({ 
  category = null, 
  categories = [], 
  onSubmit, 
  onCancel,
  loading = false 
}) => {
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(category?.image || null);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue
  } = useForm({
    defaultValues: {
      name: category?.name || '',
      slug: category?.slug || '',
      description: category?.description || '',
      shortDescription: category?.shortDescription || '',
      parentId: category?.parentId || '',
      sortOrder: category?.sortOrder || 0,
      isActive: category?.isActive ?? true,
      metaTitle: category?.metaTitle || '',
      metaDescription: category?.metaDescription || '',
      image: category?.image || ''
    }
  });

  const watchedName = watch('name');

  // Auto-generate slug from name
  useEffect(() => {
    if (watchedName && !category?.id) {
      const slug = watchedName
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, '');
      setValue('slug', slug);
    }
  }, [watchedName, setValue, category?.id]);

  const handleImageUpload = (files) => {
    if (files && files.length > 0) {
      const file = files[0];
      setSelectedImage(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      // Prepare form data with image
      const formData = {
        ...data,
        image: selectedImage || imagePreview
      };

      await onSubmit(formData);
      toast.success(category ? 'Category updated successfully' : 'Category created successfully');
    } catch (error) {
      toast.error('Failed to save category');
    }
  };

  const getParentOptions = () => {
    const options = [
      { value: '', label: 'No Parent (Root Category)' }
    ];

    // Filter out current category from parent options to prevent circular references
    const availableCategories = categories.filter(cat => cat.id !== category?.id);
    
    availableCategories.forEach(cat => {
      options.push({
        value: cat.id.toString(),
        label: cat.name
      });
    });

    return options;
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* Basic Information */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <FolderIcon className="h-6 w-6 text-blue-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Category Name"
            name="name"
            type="text"
            register={register}
            error={errors.name}
            required
            placeholder="Enter category name"
          />

          <FormField
            label="Slug"
            name="slug"
            type="text"
            register={register}
            error={errors.slug}
            required
            placeholder="category-slug"
            helpText="URL-friendly version of the category name"
          />

          <FormField
            label="Parent Category"
            name="parentId"
            type="select"
            register={register}
            error={errors.parentId}
            options={getParentOptions()}
            helpText="Select a parent category to create a hierarchy"
          />

          <FormField
            label="Sort Order"
            name="sortOrder"
            type="number"
            register={register}
            error={errors.sortOrder}
            placeholder="0"
            helpText="Lower numbers appear first"
          />
        </div>

        <div className="mt-6">
          <FormField
            label="Short Description"
            name="shortDescription"
            type="textarea"
            register={register}
            error={errors.shortDescription}
            placeholder="Brief description for category listings"
            rows={3}
          />
        </div>

        <div className="mt-6">
          <FormField
            label="Full Description"
            name="description"
            type="textarea"
            register={register}
            error={errors.description}
            placeholder="Detailed description of the category"
            rows={5}
          />
        </div>

        <div className="mt-6">
          <FormField
            label="Active Status"
            name="isActive"
            type="checkbox"
            register={register}
            error={errors.isActive}
            helpText="Inactive categories won't be visible to customers"
          />
        </div>
      </div>

      {/* Category Image */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center mb-6">
          <PhotoIcon className="h-6 w-6 text-green-600 mr-2" />
          <h3 className="text-lg font-medium text-gray-900">Category Image</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <ImageUpload
              onUpload={handleImageUpload}
              accept="image/*"
              maxSize={5 * 1024 * 1024} // 5MB
              multiple={false}
              className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center"
            />
            <p className="text-xs text-gray-500 mt-2">
              Recommended size: 800x600px, Max size: 5MB
            </p>
          </div>

          {imagePreview && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Category preview"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <button
                  type="button"
                  onClick={() => {
                    setImagePreview(null);
                    setSelectedImage(null);
                  }}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* SEO Settings */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <EyeIcon className="h-6 w-6 text-purple-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">SEO Settings</h3>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            {showAdvanced ? 'Hide' : 'Show'} Advanced
          </button>
        </div>

        {showAdvanced && (
          <div className="space-y-4">
            <FormField
              label="Meta Title"
              name="metaTitle"
              type="text"
              register={register}
              error={errors.metaTitle}
              placeholder="SEO title for search engines"
              helpText="Leave empty to use category name"
            />

            <FormField
              label="Meta Description"
              name="metaDescription"
              type="textarea"
              register={register}
              error={errors.metaDescription}
              placeholder="SEO description for search engines"
              rows={3}
              helpText="Recommended length: 150-160 characters"
            />
          </div>
        )}

        {!showAdvanced && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <InformationCircleIcon className="h-5 w-5 text-gray-400 mr-2" />
              <p className="text-sm text-gray-600">
                Click "Show Advanced" to configure SEO settings for better search engine visibility.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Form Actions */}
      <div className="flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? 'Saving...' : (category ? 'Update Category' : 'Create Category')}
        </button>
      </div>
    </form>
  );
};

export default CategoryForm; 