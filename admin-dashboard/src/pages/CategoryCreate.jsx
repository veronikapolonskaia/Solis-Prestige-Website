import React, { useEffect, useState } from 'react';
import { PageHeader, Card } from '../components';
import CategoryForm from '../components/forms/CategoryForm';
import api from '../services/api';
import toast from 'react-hot-toast';

const CategoryCreate = () => {
  const [categories, setCategories] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await api.get('/categories');
        const data = res?.data?.data || [];
        setCategories(Array.isArray(data) ? data : []);
      } catch (e) {
        setCategories([]);
      }
    })();
  }, []);

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      // Ensure slug is present (server requires it)
      const slug = (data.slug && String(data.slug).trim())
        ? String(data.slug).trim()
        : String(data.name || '')
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

      const payload = {
        name: data.name,
        description: data.description,
        slug,
        parentId: data.parentId ? data.parentId : undefined,
        sortOrder: Number.isFinite(Number(data.sortOrder)) ? Number(data.sortOrder) : 0,
        metaTitle: data.metaTitle || undefined,
        metaDescription: data.metaDescription || undefined,
      };
      await api.post('/categories', payload);
      toast.success('Category created');
      // Optionally navigate back
      window.history.back();
    } catch (e) {
      const msg = e?.response?.data?.error || 'Failed to create category';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Add Category" subtitle="Create a new category" />
      <Card>
        <CategoryForm categories={categories} onSubmit={onSubmit} onCancel={() => window.history.back()} loading={saving} />
      </Card>
    </div>
  );
};

export default CategoryCreate;


