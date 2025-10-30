import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { PageHeader, Card } from '../components';
import CategoryForm from '../components/forms/CategoryForm';
import api from '../services/api';
import toast from 'react-hot-toast';

const CategoryDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const [catRes, listRes] = await Promise.all([
          api.get(`/categories/${id}`),
          api.get('/categories'),
        ]);
        setCategory(catRes?.data?.data || null);
        setCategories(Array.isArray(listRes?.data?.data) ? listRes.data.data : []);
      } catch (e) {
        toast.error('Failed to load category');
      }
    })();
  }, [id]);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      const payload = {
        name: data.name,
        description: data.description,
        parentId: data.parentId ? data.parentId : null,
        sortOrder: Number.isFinite(Number(data.sortOrder)) ? Number(data.sortOrder) : 0,
        isActive: !!data.isActive,
        metaTitle: data.metaTitle || undefined,
        metaDescription: data.metaDescription || undefined,
      };
      await api.put(`/categories/${id}`, payload);
      toast.success('Category updated');
      navigate('/categories');
    } catch (e) {
      const msg = e?.response?.data?.error || 'Failed to update category';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  if (!category) return null;

  return (
    <div className="space-y-6">
      <PageHeader title="Edit Category" subtitle={category?.name} />
      <Card>
        <CategoryForm category={category} categories={categories} onSubmit={onSubmit} onCancel={() => navigate('/categories')} loading={saving} />
      </Card>
    </div>
  );
};

export default CategoryDetail;


