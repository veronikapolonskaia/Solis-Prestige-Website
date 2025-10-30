import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import FormField from '../forms/FormField';
import ImageUpload from '../ui/ImageUpload';
import RichTextEditor from '../ui/RichTextEditor';
import Modal from '../ui/Modal';
import toast from 'react-hot-toast';

const ProductForm = ({ 
  product = null, 
  isOpen, 
  onClose, 
  onSubmit,
  categories = []
}) => {
  const [uploadedImages, setUploadedImages] = useState(product?.images || []);
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm({
    defaultValues: {
      name: product?.name || '',
      sku: product?.sku || '',
      description: product?.description || '',
      shortDescription: product?.shortDescription || '',
      price: product?.price || '',
      comparePrice: product?.comparePrice || '',
      costPrice: product?.costPrice || '',
      quantity: product?.quantity || '',
      weight: product?.weight || '',
      categoryId: product?.categoryId || '',
      isActive: product?.isActive ?? true,
      trackQuantity: product?.trackQuantity ?? true,
      taxable: product?.taxable ?? true
    }
  });

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);
      
      // Add images to form data
      const formData = {
        ...data,
        images: uploadedImages
      };
      
      await onSubmit(formData);
      toast.success(product ? 'Product updated successfully' : 'Product created successfully');
      onClose();
    } catch (error) {
      toast.error('Failed to save product');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = (images) => {
    setUploadedImages(images);
  };

  const categoryOptions = categories.map(cat => ({
    value: cat.id,
    label: cat.name
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={product ? 'Edit Product' : 'Add New Product'}
      size="xl"
    >
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            label="Product Name"
            name="name"
            register={register}
            error={errors.name}
            required
            placeholder="Enter product name"
          />
          
          <FormField
            label="SKU"
            name="sku"
            register={register}
            error={errors.sku}
            placeholder="Enter SKU"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Price"
            name="price"
            type="number"
            register={register}
            error={errors.price}
            required
            placeholder="0.00"
            step="0.01"
          />
          
          <FormField
            label="Compare Price"
            name="comparePrice"
            type="number"
            register={register}
            error={errors.comparePrice}
            placeholder="0.00"
            step="0.01"
          />
          
          <FormField
            label="Cost Price"
            name="costPrice"
            type="number"
            register={register}
            error={errors.costPrice}
            placeholder="0.00"
            step="0.01"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Quantity"
            name="quantity"
            type="number"
            register={register}
            error={errors.quantity}
            placeholder="0"
          />
          
          <FormField
            label="Weight (lbs)"
            name="weight"
            type="number"
            register={register}
            error={errors.weight}
            placeholder="0.00"
            step="0.01"
          />
          
          <FormField
            label="Category"
            name="categoryId"
            type="select"
            register={register}
            error={errors.categoryId}
            options={categoryOptions}
            required
          />
        </div>

        {/* Descriptions */}
        <div className="space-y-4">
          <FormField
            label="Short Description"
            name="shortDescription"
            type="textarea"
            register={register}
            error={errors.shortDescription}
            placeholder="Brief product description"
            rows={3}
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Description
            </label>
            <RichTextEditor
              value={watch('description')}
              onChange={(value) => setValue('description', value)}
              placeholder="Enter detailed product description..."
            />
          </div>
        </div>

        {/* Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Product Images
          </label>
          <ImageUpload
            onImageUpload={handleImageUpload}
            multiple={true}
            maxFiles={5}
            className="mt-2"
          />
        </div>

        {/* Settings */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <FormField
            label="Active"
            name="isActive"
            type="checkbox"
            register={register}
          />
          
          <FormField
            label="Track Quantity"
            name="trackQuantity"
            type="checkbox"
            register={register}
          />
          
          <FormField
            label="Taxable"
            name="taxable"
            type="checkbox"
            register={register}
          />
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Saving...' : (product ? 'Update Product' : 'Create Product')}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default ProductForm; 