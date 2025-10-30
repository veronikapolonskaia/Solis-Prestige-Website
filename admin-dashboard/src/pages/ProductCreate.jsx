import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ProductForm } from '../components';
import { productsAPI, categoriesAPI } from '../services/api';
import toast from 'react-hot-toast';

const ProductCreate = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.scroll(0, 0);
    const loadCategories = async () => {
      try {
        const res = await categoriesAPI.getAll();
        const data = res?.data?.data || res?.data || [];
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        toast.error('Failed to load categories');
      }
    };
    loadCategories();
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    navigate('/products');
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      await productsAPI.create(formData);
      toast.success('Product created successfully');
      navigate('/products');
    } catch (err) {
      const message = err?.response?.data?.error || 'Failed to create product';
      toast.error(message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-0">
      <ProductForm
        isOpen={isOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
        categories={categories}
        product={null}
      />
    </div>
  );
};

export default ProductCreate;


