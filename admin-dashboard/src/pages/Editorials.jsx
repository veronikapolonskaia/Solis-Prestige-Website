import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { editorialsAPI } from '../services/api';

const Editorials = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await editorialsAPI.list({ page: 1, limit: 20 });
        setItems(res.data.items || res.data?.data?.items || []);
      } catch {}
    })();
  }, []);

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
            <div key={it.id} className="rounded-xl border bg-white overflow-hidden shadow">
              {it.heroImage && <img src={it.heroImage} alt={it.title} className="w-full h-40 object-cover" />}
              <div className="p-4">
                <h3 className="font-semibold">{it.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mt-1">{it.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Editorials;


