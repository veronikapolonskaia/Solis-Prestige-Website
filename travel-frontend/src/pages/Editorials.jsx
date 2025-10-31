import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEditorials } from '../services/editorials';

const EditorialCard = ({ item }) => (
  <Link to={`/editorials/${item.slug}`} className="group block rounded-2xl overflow-hidden bg-white shadow hover:shadow-xl transition-shadow">
    {item.heroUrl && item.heroType !== 'video' && (
      <div className="aspect-[16/9] overflow-hidden">
        <img src={item.heroUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300" />
      </div>
    )}
    <div className="p-5">
      <h3 className="text-xl md:text-2xl font-display font-bold text-gray-900 group-hover:text-purple-700 transition-colors">{item.title}</h3>
      {item.excerpt && <p className="mt-2 text-gray-600 line-clamp-3">{item.excerpt}</p>}
      <div className="mt-4 text-sm text-gray-500 flex items-center gap-3">
        {item.author && <span>{item.author}</span>}
        {item.publishedAt && <span>· {new Date(item.publishedAt).toLocaleDateString()}</span>}
      </div>
    </div>
  </Link>
);

const Editorials = () => {
  const [data, setData] = useState({ items: [], total: 0, page: 1, limit: 12 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchEditorials({ page: 1, limit: 12 });
        setData(res);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="pt-28 pb-16 bg-white">
      <div className="container-custom">
        <h1 className="text-3xl md:text-5xl font-display font-bold text-gray-900">Editorials</h1>
        <div className="h-0.5 w-16 bg-orange-400 rounded-full mt-5" />

        {loading ? (
          <p className="mt-10 text-gray-500">Loading articles...</p>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {data.items.map((item) => (
              <EditorialCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Editorials;


