import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { editorialsAPI } from '../services/api';
import toast from 'react-hot-toast';

const Editorials = () => {
  const [items, setItems] = useState([]);

  const loadItems = async () => {
    try {
      const res = await editorialsAPI.list({ page: 1, limit: 20 });
      setItems(res.data.items || res.data?.data?.items || []);
    } catch (e) {
      toast.error('Failed to load editorials');
    }
  };

  useEffect(() => { loadItems(); }, []);

  const EmptyState = () => (
    <div className="mt-24 text-center">
      <h3 className="text-lg font-semibold text-gray-800">No articles yet</h3>
      <p className="mt-1 text-gray-500">Create your first editorial by pasting your content.</p>
      <div className="mt-6">
        <Link to="/editorials/new" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-[#1a3a52] text-white hover:bg-[#2a4a62] shadow-lg ring-1 ring-black/5">
          <span>+ Add Article</span>
        </Link>
      </div>
    </div>
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Editorials</h1>
        <Link to="/editorials/new" className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-[#1a3a52] text-white hover:bg-[#2a4a62] shadow-lg ring-1 ring-black/5">
          <span>+ Add Article</span>
        </Link>
      </div>

      {items.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((it) => (
            <div key={it.id} className="rounded-xl border bg-white overflow-hidden shadow group">
              {it.heroUrl && (
                it.heroType === 'video' ? (
                  <video src={it.heroUrl} className="w-full h-40 object-cover" muted autoPlay loop />
                ) : (
                  <img src={it.heroUrl} alt={it.title} className="w-full h-40 object-cover" />
                )
              )}
              <div className="p-4">
                <h3 className="font-semibold line-clamp-1">{it.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{it.excerpt}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs text-gray-400">{new Date(it.publishedAt || Date.now()).toLocaleDateString()}</span>
                  <button
                    onClick={async () => {
                      const ok = window.confirm('Delete this article?');
                      if (!ok) return;
                      try {
                        await editorialsAPI.delete(it.id);
                        toast.success('Deleted');
                        loadItems();
                      } catch (e) {
                        const msg = e?.response?.data?.error || 'Failed to delete';
                        toast.error(msg);
                      }
                    }}
                    className="px-3 py-1 rounded-md border text-red-600 border-red-200 hover:bg-red-50"
                    title="Delete article"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Editorials;


