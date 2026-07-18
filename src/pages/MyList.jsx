import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

export default function MyList() {
  const { session, user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [sort, setSort] = useState('custom');
  const [draggedId, setDraggedId] = useState(null);

  useEffect(() => {
    if (!user) { setLoading(false); return; }
    load();
  }, [user]);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('bookmarks')
      .select('id, movie_id, custom_order, movies(*)')
      .eq('user_id', user.id)
      .order('custom_order');
    setItems((data || []).map((b) => ({ bookmarkId: b.id, ...b.movies, custom_order: b.custom_order })));
    setLoading(false);
  }

  if (!session) {
    return <div className="page"><div className="container text-center"><h1>Please sign in</h1><p className="text-secondary mt-1">Sign in to view your list.</p><Link to="/auth" className="btn mt-2">Sign In</Link></div></div>;
  }

  const filtered = items.filter((i) => filter === 'all' || i.type === filter);
  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'title') return a.title.localeCompare(b.title);
    if (sort === 'year') return b.year - a.year;
    return a.custom_order - b.custom_order;
  });

  const handleDragStart = (id) => setDraggedId(id);
  const handleDragOver = (e) => e.preventDefault();
  const handleDrop = async (targetId) => {
    if (!draggedId || draggedId === targetId) return;
    const newItems = [...items];
    const fromIdx = newItems.findIndex((i) => i.id === draggedId);
    const toIdx = newItems.findIndex((i) => i.id === targetId);
    const [moved] = newItems.splice(fromIdx, 1);
    newItems.splice(toIdx, 0, moved);
    setItems(newItems);
    setDraggedId(null);
    await Promise.all(newItems.map((item, idx) =>
      supabase.from('bookmarks').update({ custom_order: idx + 1 }).eq('movie_id', item.id).eq('user_id', user.id)
    ));
  };

  const remove = async (movieId) => {
    await supabase.from('bookmarks').delete().eq('movie_id', movieId).eq('user_id', user.id);
    setItems(items.filter((i) => i.id !== movieId));
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 30 }}>
          <h1 style={{ fontSize: 32, display: 'flex', alignItems: 'center', gap: 15 }}><i className="fas fa-bookmark"></i> My List</h1>
          <div style={{ display: 'flex', gap: 15 }}>
            {['all', 'movie', 'tv'].map((f) => (
              <button key={f} onClick={() => setFilter(f)} className="btn" style={filter === f ? {} : { background: 'var(--secondary)' }}>
                {f === 'all' ? 'All' : f === 'movie' ? 'Movies' : 'TV Shows'}
              </button>
            ))}
          </div>
        </div>

        <div className="card" style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: 15 }}>
          <span className="text-secondary">Sort by:</span>
          <select value={sort} onChange={(e) => setSort(e.target.value)} className="form-select" style={{ width: 'auto' }}>
            <option value="custom">Custom Order</option>
            <option value="title">Title</option>
            <option value="year">Release Year</option>
          </select>
        </div>

        <div style={{ display: 'flex', gap: 20, marginBottom: 30, flexWrap: 'wrap' }}>
          <StatCard value={items.length} label="Total Items" />
          <StatCard value={items.filter((i) => i.type === 'movie').length} label="Movies" />
          <StatCard value={items.filter((i) => i.type === 'tv').length} label="TV Shows" />
        </div>

        {loading ? <div className="loading-center"><div className="spinner" /></div> : sorted.length === 0 ? (
          <div className="card text-center" style={{ padding: 60 }}>
            <i className="fas fa-book-open" style={{ fontSize: 60, color: 'var(--text-secondary)', marginBottom: 20 }}></i>
            <h2 style={{ fontSize: 24, marginBottom: 15 }}>Your list is empty</h2>
            <p className="text-secondary" style={{ maxWidth: 500, margin: '0 auto 30px' }}>Start building your watchlist by browsing our catalog.</p>
            <Link to="/" className="btn"><i className="fas fa-compass"></i> Browse Content</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 20 }}>
            {sorted.map((item) => (
              <div
                key={item.id}
                draggable
                onDragStart={() => handleDragStart(item.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(item.id)}
                className="card"
                style={{
                  padding: 0, cursor: 'grab', position: 'relative',
                  opacity: draggedId === item.id ? 0.5 : 1,
                  transform: draggedId === item.id ? 'scale(0.95)' : 'none',
                }}
              >
                <Link to={`/watch/${item.id}`}>
                  <img src={item.poster_url} alt={item.title} style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: '8px 8px 0 0' }} />
                </Link>
                <span style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(0,0,0,0.7)', padding: '4px 8px', borderRadius: 4, fontSize: 12, color: item.type === 'movie' ? 'var(--info)' : 'var(--success)' }}>
                  {item.type === 'movie' ? 'Movie' : 'TV Show'}
                </span>
                <div style={{ padding: 15 }}>
                  <h3 style={{ fontSize: 16, marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</h3>
                  <div className="text-secondary" style={{ fontSize: 14, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{item.year}</span><span>{item.duration}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 15, paddingTop: 15, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <Link to={`/watch/${item.id}`} className="btn" style={{ padding: '5px 10px', fontSize: 14 }}><i className="fas fa-play"></i> Play</Link>
                    <button onClick={() => remove(item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 14 }} onMouseEnter={(e) => e.target.style.color = 'var(--accent)'} onMouseLeave={(e) => e.target.style.color = 'var(--text-secondary)'}>
                      <i className="fas fa-trash"></i> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({ value, label }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minWidth: 120, padding: '15px 20px' }}>
      <span style={{ fontSize: 24, fontWeight: 'bold', color: 'var(--accent)' }}>{value}</span>
      <span className="text-secondary" style={{ fontSize: 14 }}>{label}</span>
    </div>
  );
}
