import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchEditorial } from '../services/editorials';

const EditorialDetail = () => {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetchEditorial(slug);
        setArticle(res);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug]);

  if (loading) return <div className="pt-8 sm:pt-12 md:pt-16 pb-12 container-custom"><p>Loading...</p></div>;
  if (!article) return <div className="pt-8 sm:pt-12 md:pt-16 pb-12 container-custom"><p>Not found.</p></div>;

  return (
    <article className="pt-8 sm:pt-12 md:pt-16">
      {article.heroUrl && article.heroType !== 'video' && (
        <div className="relative min-h-[320px] sm:min-h-[360px] md:min-h-0 h-[40vh] md:h-[55vh] overflow-hidden">
          <img src={article.heroUrl} alt={article.title} className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 sm:px-6">
            <h1 className="text-white text-2xl sm:text-3xl md:text-5xl font-display font-bold drop-shadow">{article.title}</h1>
            <p className="text-white/80 mt-2 text-xs sm:text-sm">{article.author} · {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}</p>
          </div>
        </div>
      )}
      {article.heroUrl && article.heroType === 'video' && (
        <div className="relative min-h-[320px] sm:min-h-[360px] md:min-h-0 h-[40vh] md:h-[55vh] overflow-hidden">
          <video src={article.heroUrl} className="w-full h-full object-cover" autoPlay muted loop playsInline />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-5xl px-4 sm:px-6">
            <h1 className="text-white text-2xl sm:text-3xl md:text-5xl font-display font-bold drop-shadow">{article.title}</h1>
            <p className="text-white/80 mt-2 text-xs sm:text-sm">{article.author} · {article.publishedAt ? new Date(article.publishedAt).toLocaleDateString() : ''}</p>
          </div>
        </div>
      )}

      <div className="container-custom prose prose-base sm:prose-lg max-w-5xl mt-8 sm:mt-10 pb-14 sm:pb-20">
        {/* Render trusted HTML pasted by editors */}
        <div dangerouslySetInnerHTML={{ __html: article.content }} />
      </div>
    </article>
  );
};

export default EditorialDetail;


