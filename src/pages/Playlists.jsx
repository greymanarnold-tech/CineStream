import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { uploadMovieAsset } from '../lib/storage';

export default function Playlists() {
  const { session, user } = useAuth();
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', description: '', is_series: false, cover_image_url: '' });
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    load();
  }, []);

  async function load() {
    setLoading(true);
    const { data } = await supabase
      .from('playlists')
      .select('*, playlist_movies(count)')
      .order('created_at', { ascending: false });
    setPlaylists(data || []);
    setLoading(false);
  }

  const handleCover = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) return;
    setUploading(true);
    try {
      const url = await uploadMovieAsset(file, 'playlist-covers');
      setForm((f) => ({ ...f, cover_image_url: url }));
    } catch {
      // ignore
    } finally {
      setUploading(false);
    }
  };

  const create = async (e) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    await supabase.from('playlists').insert({
      name: form.name,
      description: form.description,
      is_series: form.is_series,
      cover_image_url: form.cover_image_url,
      user_id: user.id,
    });
    setForm({ name: '', description: '', is_series: false, cover_image_url: '' });
    setShowCreate(false);
    setSaving(false);
    await load();
  };

  return (
    <div className="page">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30, flexWrap: 'wrap', gap: 15 }}>
          <h1 style={{ fontSize: 32, display: 'flex', alignItems: 'center', gap: 15 }}>
            <i className="fas fa-list" style={{ color: 'var(--accent)' }}></i> Playlists & Series
          </h1>
          {session && (
            <button onClick={() => setShowCreate(!showCreate)} className="btn">
              <i className="fas fa-plus"></i> {showCreate ? 'Cancel' : 'Create Playlist'}
            </button>
          )}
        </div>

        {showCreate && (
          <form onSubmit={create} className="card mb-3" style={{ padding: 30 }}>
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>Create New Playlist</h2>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Name *</label>
                <input className="form-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required placeholder="My Awesome Playlist" />
              </div>
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-input" value={form.is_series ? 'series' : 'playlist'} onChange={(e) => setForm({ ...form, is_series: e.target.value === 'series' })}>
                  <option value="playlist">Playlist</option>
                  <option value="series">Series</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Description</label>
              <textarea className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What's this collection about?" style={{ minHeight: 80 }} />
            </div>
            <div className="form-group">
              <label className="form-label">Cover Image</label>
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                <button type="button" onClick={() => document.getElementById('cover-upload').click()} className="btn btn-outline" disabled={uploading}>
                  {uploading ? <span className="spinner" style={{ width: 16, height: 16 }} /> : <><i className="fas fa-upload"></i> Upload Cover</>}
                </button>
                <input id="cover-upload" type="file" accept="image/*" onChange={handleCover} style={{ display: 'none' }} />
                {form.cover_image_url && <img src={form.cover_image_url} alt="Cover" style={{ width: 60, height: 80, objectFit: 'cover', borderRadius: 4 }} />}
              </div>
            </div>
            <button type="submit" className="btn" disabled={saving}>{saving ? <span className="spinner" style={{ width: 18, height: 18 }} /> : 'Create'}</button>
          </form>
        )}

        {!session && (
          <div className="card text-center mb-3" style={{ padding: 40 }}>
            <i className="fas fa-sign-in-alt" style={{ fontSize: 40, color: 'var(--text-secondary)', marginBottom: 15 }}></i>
            <h2 style={{ fontSize: 22, marginBottom: 10 }}>Sign in to create playlists</h2>
            <p className="text-secondary mb-2">You can browse existing playlists below, but need an account to create your own.</p>
            <Link to="/auth" className="btn mt-1">Sign In</Link>
          </div>
        )}

        <div style={{ display: 'flex', gap: 20, marginBottom: 30, flexWrap: 'wrap' }}>
          <StatCard value={playlists.length} label="Total" />
          <StatCard value={playlists.filter((p) => p.is_series).length} label="Series" />
          <StatCard value={playlists.filter((p) => !p.is_series).length} label="Playlists" />
        </div>

        {loading ? <div className="loading-center"><div className="spinner" /></div> : playlists.length === 0 ? (
          <div className="card text-center" style={{ padding: 60 }}>
            <i className="fas fa-list-ul" style={{ fontSize: 60, color: 'var(--text-secondary)', marginBottom: 20 }}></i>
            <h2 style={{ fontSize: 24, marginBottom: 15 }}>No playlists yet</h2>
            <p className="text-secondary">Be the first to create a playlist or series!</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
            {playlists.map((p) => (
              <Link key={p.id} to={`/playlist/${p.id}`} className="card" style={{ padding: 0, overflow: 'hidden', transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
                <div style={{ position: 'relative', height: 160, background: p.cover_image_url ? `url(${p.cover_image_url}) center/cover` : 'linear-gradient(135deg, var(--accent), var(--accent-light))' }}>
                  <span className="badge" style={{ position: 'absolute', top: 10, right: 10, background: p.is_series ? 'var(--info)' : 'var(--accent)', padding: '4px 10px' }}>
                    {p.is_series ? 'SERIES' : 'PLAYLIST'}
                  </span>
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)', padding: '15px' }}>
                    <h3 style={{ fontSize: 18, marginBottom: 4 }}>{p.name}</h3>
                    <p className="text-secondary" style={{ fontSize: 13 }}>{(p.playlist_movies?.[0]?.count) || 0} items</p>
                  </div>
                </div>
                {p.description && <div style={{ padding: 15 }}><p className="text-secondary" style={{ fontSize: 14, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.description}</p></div>}
              </Link>
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
