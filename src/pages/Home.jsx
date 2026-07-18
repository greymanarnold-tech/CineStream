import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import MovieCard from '../components/MovieCard';

export default function Home() {
  const [searchParams] = useSearchParams();
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const search = searchParams.get('search');
  const typeFilter = searchParams.get('type');

  useEffect(() => {
    async function load() {
      setLoading(true);
      let query = supabase.from('movies').select('*').eq('is_published', true);
      if (search) {
        query = query.or(`title.ilike.%${search}%,description.ilike.%${search}%,category.ilike.%${search}%`);
      }
      if (typeFilter) {
        query = query.eq('type', typeFilter);
      }
      query = query.order('sort_order').order('created_at', { ascending: false });
      const { data } = await query;
      setMovies(data || []);
      setLoading(false);
    }
    load();
  }, [search, typeFilter]);

  const featured = movies.find((m) => m.featured) || movies[0];
  const continueWatching = movies.slice(0, 4);
  const popular = movies.filter((m) => !m.is_premium).slice(0, 8);
  const premium = movies.filter((m) => m.is_premium).slice(0, 8);

  if (loading) {
    return <div className="loading-center"><div className="spinner" /></div>;
  }

  return (
    <div>
      {featured && !search && !typeFilter ? (
        <section className="hero" style={{
          height: '80vh',
          background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.7)), url(${featured.poster_url}) no-repeat center center/cover`,
          display: 'flex',
          alignItems: 'center',
          padding: '0 50px',
        }}>
          <div style={{ maxWidth: '600px' }}>
            <span className="badge badge-new" style={{ marginBottom: '20px' }}>NEW</span>
            <h1 style={{ fontSize: '48px', marginBottom: '20px' }}>{featured.title}</h1>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px', fontSize: '18px' }}>{featured.description}</p>
            <div style={{ display: 'flex', gap: '15px' }}>
              <Link to={`/watch/${featured.id}`} className="btn btn-large"><i className="fas fa-play"></i> Play</Link>
              <Link to="/my-list" className="btn btn-outline btn-large"><i className="fas fa-plus"></i> My List</Link>
            </div>
          </div>
        </section>
      ) : null}

      {search || typeFilter ? (
        <div className="page">
          <div className="container">
            <h1 className="page-title" style={{ justifyContent: 'flex-start' }}>
              {search ? `Results for "${search}"` : typeFilter === 'tv' ? 'TV Shows' : 'Movies'}
            </h1>
            {movies.length === 0 ? (
              <p className="text-secondary">No content found.</p>
            ) : (
              <div className="content-grid">
                {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          <section className="section" style={{ padding: '40px 50px' }}>
            <h2 className="section-title">Continue Watching</h2>
            <ContentGrid movies={continueWatching} />
          </section>
          <section className="section" style={{ padding: '40px 50px' }}>
            <h2 className="section-title">Popular Now</h2>
            <ContentGrid movies={popular} />
          </section>
          <section className="section" style={{ padding: '40px 50px' }}>
            <h2 className="section-title">Exclusive Premium Content</h2>
            <ContentGrid movies={premium} />
          </section>
        </>
      )}
    </div>
  );
}

function ContentGrid({ movies }) {
  if (!movies || movies.length === 0) return <p className="text-secondary">No content available.</p>;
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
      gap: '20px',
    }}>
      {movies.map((m) => <MovieCard key={m.id} movie={m} />)}
    </div>
  );
}
