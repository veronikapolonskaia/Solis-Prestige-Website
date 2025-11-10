import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchEditorials } from '../services/editorials';

const EditorialCard = ({ item }) => (
  <Link to={`/editorials/${item.slug}`} className="group block rounded-3xl overflow-hidden bg-white shadow-lg hover:shadow-2xl transition-all duration-300">
    <div className="relative">
      {item.heroUrl && item.heroType !== 'video' && (
        <div className="aspect-[16/9] overflow-hidden">
          <img src={item.heroUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-[1.05] transition-transform duration-500" />
        </div>
      )}
      {item.heroUrl && item.heroType === 'video' && (
        <div className="aspect-[16/9] overflow-hidden">
          <video src={item.heroUrl} className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500" autoPlay muted loop playsInline />
        </div>
      )}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
      <div className="absolute bottom-4 left-4 flex items-center gap-2">
        <span className="inline-flex items-center rounded-full bg-white/90 text-gray-900 text-[10px] sm:text-xs font-semibold px-2.5 py-1 shadow">Editorial</span>
      </div>
    </div>
    <div className="p-5 sm:p-6">
      <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold text-gray-900 group-hover:text-purple-700 transition-colors leading-snug">{item.title}</h3>
      {item.excerpt && <p className="mt-2 text-sm text-gray-600 line-clamp-3">{item.excerpt}</p>}
      <div className="mt-4 sm:mt-5 flex items-center justify-between text-xs sm:text-sm text-gray-500">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="h-7 w-7 sm:h-8 sm:w-8 rounded-full bg-[#1a3a52] text-white flex items-center justify-center text-[11px] sm:text-xs font-semibold">
            {(item.author || 'A').split(' ').map(s => s[0]).join('').slice(0,2)}
          </div>
          <span>{item.author || 'Editorial Team'}</span>
        </div>
        {item.publishedAt && <span>{new Date(item.publishedAt).toLocaleDateString()}</span>}
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
    <div className="pt-8 sm:pt-12 md:pt-16 pb-12 sm:pb-16 bg-white">
      <div className="container-custom">
        <div className="max-w-4xl">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-gray-900">Editorials</h1>
          <p className="mt-3 text-sm sm:text-base text-gray-600">Handpicked stories, guides, and inspiration from our editors.</p>
          <div className="h-0.5 w-16 bg-orange-400 rounded-full mt-4 sm:mt-5" />
        </div>

        {loading ? (
          <div className="mt-10 sm:mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-3xl overflow-hidden bg-gray-100 animate-pulse h-72" />
            ))}
          </div>
        ) : (
          <div className="mt-8 sm:mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
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


