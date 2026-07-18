import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import MovieCard from '../components/MovieCard';

export default function PlaylistDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { session, user } = useAuth();
  const [playlist, setPlaylist] = useState(null);
  const [items, setItems] = useState([]);
  const [allMovies, setAllMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    load();
  }, [id]);

  async function load() {
    setLoading(true);
    const { data: pl } = await supabase.from('playlists').select('*').eq('id', id).maybeSingle();
    setPlaylist(pl);
    const { data: pm } = await supabase
      .from('playlist_movies')
      .select('id, episode_number, sort_order, movie_id, movies(*)')
      .eq('playlist_id', id)
      .order('sort_order');
    setItems((pm || []).map((r) => ({ pmId: r.id, episode: r.episode_number, ...r.movies })));
    setLoading(false);
  }

  async function loadAllMovies() {
    const { data } = await supabase.from('movies').select('*').eq('is_published', true).order('title');
    setAllMovies(data || []);
  }

  const isOwner = playlist && user && playlist.user_id === user.id;

  const addMovie = async (movieId) => {
    const { count } = await supabase.from('playlist_movies').select('*', { count: 'exact', head: true }).eq('playlist_id', id);
    const nextOrder = (count || 0) + 1;
    await supabase.from('playlist_movies').insert({
      playlist_id: id,
      movie_id: movieId,
      sort_order: nextOrder,
      episode_number: playlist?.is_series ? nextOrder : null,
    });
    await load();
  };

  const removeMovie = async (pmId, movieId) => {
    await supabase.from('playlist_movies').delete().eq('id', pmId);
    setItems(items.filter((i) => i.pmId !== pmId));
  };

  const deletePlaylist = async () => {
    if (!confirm('Delete this playlist? This cannot be undone.')) return;
    await supabase.from('playlists').delete().eq('id', id);
    navigate('/playlists');
  };

  const filteredMovies = allMovies.filter((m) =>
    !items.some((i) => i.id === m.id) &&
    (!search || m.title.toLowerCase().includes(search.toLowerCase()))
  );

  if (loading) return <div className="loading-center" style={{ paddingTop: 120 }}><div className="spinner" /></div>;
  if (!playlist) return <div className="page"><div className="container"><p>Playlist not found.</p><Link to="/playlists" className="btn mt-2">Back</Link></div></div>;

  return (
    <div className="page">
      <div className="container">
        <div className="card mb-3" style={{
          padding: 30,
          background: playlist.cover_image_url
            ? `linear-gradient(rgba(20,20,20,0.85), rgba(20,20,20,0.95)), url(${playlist.cover_image_url}) center/cover`
            : 'var(--card-bg)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 20 }}>
            <div>
              <span className="badge mb-2" style={{ background: playlist.is_series ? 'var(--info)' : 'var(--accent)' }}>
                {playlist.is_series ? 'SERIES' : 'PLAYLIST'}
              </span>
              <h1 style={{ fontSize: 32, marginBottom: 10 }}>{playlist.name}</h1>
              {playlist.description && <p className="text-secondary" style={{ maxWidth: 600, fontSize: 17 }}>{playlist.description}</p>}
              <p className="text-secondary mt-1">{items.length} {playlist.is_series ? 'episodes' : 'items'}</p>
            </div>
            {isOwner && (
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                <button onClick={() => { setShowAdd(!showAdd); if (!showAdd) loadAllMovies(); }} className="btn">
                  <i className="fas fa-plus"></i> {showAdd ? 'Close' : 'Add Movies'}
                </button>
                <button onClick={deletePlaylist} className="btn btn-outline" style={{ borderColor: 'var(--error)', color: 'var(--error)' }}>
                  <i className="fas fa-trash"></i> Delete
                </button>
              </div>
            )}
          </div>
        </div>

        {showAdd && isOwner && (
          <div className="card mb-3" style={{ padding: 25 }}>
            <h2 style={{ fontSize: 20, marginBottom: 15 }}><i className="fas fa-search"></i> Add Movies to {playlist.name}</h2>
            <input type="text" className="form-input mb-2" placeholder="Search movies to add..." value={search} onChange={(e) => setSearch(e.target.value)} />
            {filteredMovies.length === 0 ? (
              <p className="text-secondary">No movies available to add.</p>
            ) : (
              <div style={{ maxHeight: 400, overflowY: 'auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 15 }}>
                {filteredMovies.slice(0, 12).map((m) => (
                  <div key={m.id} className="card" style={{ padding: 10, display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <img src={m.poster_url} alt={m.title} style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 4 }} />
                    <div style={{ fontSize: 14, fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{m.title}</div>
                    <button onClick={() => addMovie(m.id)} className="btn" style={{ padding: '6px 10px', fontSize: 13 }}><i className="fas fa-plus"></i> Add</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        <h2 className="section-title" style={{ fontSize: 22, marginBottom: 20 }}>
          {playlist.is_series ? 'Episodes' : 'Items'} ({items.length})
        </h2>

        {items.length === 0 ? (
          <div className="card text-center" style={{ padding: 50 }}>
            <i className="fas fa-film" style={{ fontSize: 50, color: 'var(--text-secondary)', marginBottom: 15 }}></i>
            <p className="text-secondary">{isOwner ? 'Add movies to get started.' : 'This playlist is empty.'}</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 15 }}>
            {items.map((item, idx) => (
              <div key={item.pmId} className="card" style={{ display: 'flex', gap: 15, alignItems: 'center', padding: 15 }}>
                {playlist.is_series && (
                  <div style={{
                    width: 50, height: 50, borderRadius: '50%', background: 'var(--accent)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: 18, flexShrink: 0,
                  }}>
                    {item.episode || idx + 1}
                  </div>
                )}
                <Link to={`/watch/${item.id}`} style={{ display: 'flex', gap: 15, alignItems: 'center', flex: 1, minWidth: 0 }}>
                  <img src={item.poster_url} alt={item.title} style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 4, flexShrink: 0 }} />
                  <div style={{ minWidth: 0 }}>
                    <h3 style={{ fontSize: 17, marginBottom: 5 }}>{item.title}</h3>
                    <p className="text-secondary" style={{ fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.description}</p>
                    <div className="text-secondary" style={{ fontSize: 13, marginTop: 4 }}>{item.year} • {item.duration} • {item.category}</div>
                  </div>
                </Link>
                {isOwner && (
                  <button onClick={() => removeMovie(item.pmId, item.id)} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: 18, padding: 10 }} onMouseEnter={(e) => e.currentTarget.style.color = 'var(--error)'} onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'} title="Remove">
                    <i className="fas fa-times"></i>
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
