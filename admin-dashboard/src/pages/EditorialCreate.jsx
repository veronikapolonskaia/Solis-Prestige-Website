import React, { useState } from 'react';
import { editorialsAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditorialCreate = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    heroUrl: '',
    heroType: 'image',
    author: '',
    status: 'published',
    content: '' // allow paste of HTML
  });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await editorialsAPI.create(form);
      toast.success('Article created');
      navigate('/editorials');
    } catch (err) {
      const msg = err?.response?.data?.error || 'Failed to create article';
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Add Article</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Title</label>
            <input name="title" value={form.title} onChange={handleChange} className="mt-1 w-full rounded-md border px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Slug</label>
            <input name="slug" value={form.slug} onChange={handleChange} className="mt-1 w-full rounded-md border px-3 py-2" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Author</label>
            <input name="author" value={form.author} onChange={handleChange} className="mt-1 w-full rounded-md border px-3 py-2" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Hero media</label>
            <div className="mt-1 flex items-center gap-3">
              <select name="heroType" value={form.heroType} onChange={handleChange} className="rounded-md border px-3 py-2">
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
              <input name="heroUrl" placeholder="URL (optional if uploading)" value={form.heroUrl} onChange={handleChange} className="flex-1 rounded-md border px-3 py-2" />
            </div>
            <div className="mt-2 flex items-center gap-3">
              <input type="file" accept={form.heroType === 'image' ? 'image/*' : 'video/*'} onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                setUploading(true);
                try {
                  const { uploadAPI } = await import('../services/api');
                  const res = await (form.heroType === 'image' ? uploadAPI.uploadImage(file) : uploadAPI.uploadVideo(file));
                  const url = res.data?.data?.url;
                  if (url) setForm((prev) => ({ ...prev, heroUrl: url }));
                } catch (err) {
                  // eslint-disable-next-line no-undef
                  console.error(err);
                } finally {
                  setUploading(false);
                }
              }} className="text-sm" />
            </div>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700">Excerpt</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} className="mt-1 w-full rounded-md border px-3 py-2" rows={3} />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Content (paste HTML)</label>
          <textarea name="content" value={form.content} onChange={handleChange} className="mt-1 w-full rounded-md border px-3 py-2 font-mono" rows={16} required />
          <div className="mt-3 flex items-center gap-3">
            <input type="file" accept=".docx" onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setUploading(true);
              try {
                const { uploadAPI } = await import('../services/api');
                const res = await uploadAPI.docxToHtml(file);
                const html = res.data?.data?.html || '';
                setForm((prev) => ({ ...prev, content: html }));
              } catch (err) {
                // eslint-disable-next-line no-undef
                console.error(err);
              } finally {
                setUploading(false);
              }
            }} className="text-sm" />
            {uploading && <span className="text-xs text-gray-500">Uploading...</span>}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-gray-700">Status</label>
          <select name="status" value={form.status} onChange={handleChange} className="rounded-md border px-3 py-2">
            <option value="draft">Draft</option>
            <option value="published">Published</option>
          </select>
        </div>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-5 py-2 rounded-md bg-white text-black border border-gray-300 hover:bg-gray-50 disabled:opacity-60">
            {saving ? 'Saving...' : 'Create Article'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditorialCreate;


