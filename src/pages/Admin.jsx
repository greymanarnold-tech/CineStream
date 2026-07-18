import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const EMPTY = {
  title: '', description: '', poster_url: '', video_url: '',
  category: '', type: 'movie', year: '', duration: '', rating: '',
  is_premium: false, is_published: true, featured: false, sort_order: 0,
};

export default function Admin() {
  const { session, profile, loading } = useAuth();
  const [movies, setMovies] = useState([]);
  const [tab, setTab] = useState('movies');
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const [messages, setMessages] = useState([]);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    if (profile?.is_admin) loadAll();
  }, [profile]);

  async function loadAll() {
    const { data: m } = await supabase.from('movies').select('*').order('created_at', { ascending: false });
    setMovies(m || []);
    const { data: msg } = await supabase.from('contact_messages').select('*').order('created_at', { ascending: false });
    setMessages(msg || []);
    const { data: pay } = await supabase.from('payments').select('*').order('created_at', { ascending: false });
    setPayments(pay || []);
  }

  if (loading) return <div className="loading-center" style={{ paddingTop: 120 }}><div className="spinner" /></div>;
  if (!session) return <div className="page"><div className="container text-center"><h1>Sign in required</h1><Link to="/auth" className="btn mt-2">Sign In</Link></div></div>;
  if (!profile?.is_admin) return <div className="page"><div className="container text-center"><h1>Admin access only</h1><p className="text-secondary mt-1">You don't have permission to view this page.</p><Link to="/" className="btn mt-2">Back home</Link></div></div>;

  const startEdit = (m) => { setEditing(m.id); setForm(m); };
  const cancelEdit = () => { setEditing(null); setForm(EMPTY); };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const payload = { ...form, year: form.year ? parseInt(form.year) : null, sort_order: parseInt(form.sort_order) || 0 };
    if (editing) {
      await supabase.from('movies').update(payload).eq('id', editing);
    } else {
      await supabase.from('movies').insert(payload);
    }
    await loadAll();
    cancelEdit();
    setSaving(false);
  };

  const remove = async (id) => {
    if (!confirm('Delete this movie?')) return;
    await supabase.from('movies').delete().eq('id', id);
    setMovies(movies.filter((m) => m.id !== id));
  };

  const togglePublish = async (m) => {
    await supabase.from('movies').update({ is_published: !m.is_published }).eq('id', m.id);
    setMovies(movies.map((x) => x.id === m.id ? { ...x, is_published: !x.is_published } : x));
  };

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ fontSize: 28, marginBottom: 30, display: 'flex', alignItems: 'center', gap: 15 }}>
          <i className="fas fa-shield-alt" style={{ color: 'var(--accent)' }}></i> Admin Dashboard
        </h1>

        <div style={{ display: 'flex', gap: 10, marginBottom: 30, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          {['movies', 'add', 'messages', 'payments'].map((t) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '12px 20px', background: 'none', border: 'none', color: tab === t ? 'var(--accent)' : 'var(--text)',
              borderBottom: tab === t ? '3px solid var(--accent)' : '3px solid transparent', cursor: 'pointer', fontWeight: 500,
            }}>
              {t === 'movies' ? 'Manage Movies' : t === 'add' ? 'Add New' : t === 'messages' ? 'Messages' : 'Payments'}
            </button>
          ))}
        </div>

        {(tab === 'add' || (tab === 'movies' && editing)) && (
          <form onSubmit={save} className="card mb-3" style={{ padding: 30 }}>
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>{editing ? 'Edit Movie' : 'Publish New Movie'}</h2>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Title *</label><input className="form-input" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required /></div>
              <div className="form-group"><label className="form-label">Category</label><input className="form-input" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="Sci-Fi, Action..." /></div>
            </div>
            <div className="form-group"><label className="form-label">Description</label><textarea className="form-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} style={{ minHeight: 100 }} /></div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Poster URL</label><input className="form-input" value={form.poster_url} onChange={(e) => setForm({ ...form, poster_url: e.target.value })} placeholder="https://..." /></div>
              <div className="form-group"><label className="form-label">Video URL</label><input className="form-input" value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} placeholder="https://...mp4" /></div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">Type</label>
                <select className="form-input" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
                  <option value="movie">Movie</option>
                  <option value="tv">TV Show</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Year</label><input type="number" className="form-input" value={form.year} onChange={(e) => setForm({ ...form, year: e.target.value })} /></div>
              <div className="form-group"><label className="form-label">Duration</label><input className="form-input" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="2h 15m" /></div>
              <div className="form-group"><label className="form-label">Rating</label><input className="form-input" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} placeholder="PG-13" /></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Sort Order</label><input type="number" className="form-input" value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: e.target.value })} /></div>
              <div className="form-group" style={{ display: 'flex', alignItems: 'flex-end', gap: 20 }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="checkbox" checked={form.is_premium} onChange={(e) => setForm({ ...form, is_premium: e.target.checked })} /> Premium</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="checkbox" checked={form.is_published} onChange={(e) => setForm({ ...form, is_published: e.target.checked })} /> Published</label>
                <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}><input type="checkbox" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} /> Featured</label>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 15 }}>
              <button type="submit" className="btn" disabled={saving}>{saving ? <span className="spinner" style={{ width: 18, height: 18 }} /> : (editing ? 'Update' : 'Publish Movie')}</button>
              {editing && <button type="button" onClick={cancelEdit} className="btn btn-outline">Cancel</button>}
            </div>
          </form>
        )}

        {tab === 'movies' && !editing && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 22 }}>All Movies ({movies.length})</h2>
              <button onClick={() => setTab('add')} className="btn"><i className="fas fa-plus"></i> Add New</button>
            </div>
            <div style={{ overflowX: 'auto' }}>
              <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 800 }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: 15, textAlign: 'left' }}>Title</th>
                    <th style={{ padding: 15, textAlign: 'left' }}>Type</th>
                    <th style={{ padding: 15, textAlign: 'left' }}>Category</th>
                    <th style={{ padding: 15, textAlign: 'left' }}>Status</th>
                    <th style={{ padding: 15, textAlign: 'left' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {movies.map((m) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <td style={{ padding: 15 }}>{m.title} {m.is_premium && <span className="badge badge-premium" style={{ marginLeft: 8 }}>PREMIUM</span>}</td>
                      <td style={{ padding: 15 }}>{m.type === 'tv' ? 'TV Show' : 'Movie'}</td>
                      <td style={{ padding: 15 }} className="text-secondary">{m.category}</td>
                      <td style={{ padding: 15 }}>
                        <span style={{ color: m.is_published ? 'var(--success)' : 'var(--text-secondary)' }}>{m.is_published ? 'Published' : 'Hidden'}</span>
                      </td>
                      <td style={{ padding: 15 }}>
                        <div style={{ display: 'flex', gap: 10 }}>
                          <button onClick={() => startEdit(m)} className="btn" style={{ padding: '5px 10px', fontSize: 13 }}><i className="fas fa-edit"></i></button>
                          <button onClick={() => togglePublish(m)} className="btn btn-outline" style={{ padding: '5px 10px', fontSize: 13 }}><i className="fas fa-eye"></i></button>
                          <button onClick={() => remove(m.id)} style={{ background: 'none', border: 'none', color: 'var(--error)', cursor: 'pointer', fontSize: 13 }}><i className="fas fa-trash"></i></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {tab === 'messages' && (
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>Contact Messages ({messages.length})</h2>
            {messages.length === 0 ? <p className="text-secondary">No messages yet.</p> : messages.map((m) => (
              <div key={m.id} className="card mb-2">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <strong>{m.name}</strong>
                  <span className="text-secondary" style={{ fontSize: 13 }}>{new Date(m.created_at).toLocaleString()}</span>
                </div>
                <div className="text-secondary" style={{ fontSize: 14, marginBottom: 8 }}>{m.email} • {m.phone} • {m.subject}</div>
                <p>{m.message}</p>
                <p className="text-secondary" style={{ fontSize: 13, marginTop: 8 }}>Preferred: {m.preference}</p>
              </div>
            ))}
          </div>
        )}

        {tab === 'payments' && (
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 20 }}>Payment History ({payments.length})</h2>
            {payments.length === 0 ? <p className="text-secondary">No payments yet.</p> : (
              <div style={{ overflowX: 'auto' }}>
                <table className="w-full" style={{ borderCollapse: 'collapse', minWidth: 700 }}>
                  <thead><tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <th style={{ padding: 15, textAlign: 'left' }}>Date</th>
                    <th style={{ padding: 15, textAlign: 'left' }}>Method</th>
                    <th style={{ padding: 15, textAlign: 'left' }}>Amount</th>
                    <th style={{ padding: 15, textAlign: 'left' }}>Status</th>
                    <th style={{ padding: 15, textAlign: 'left' }}>Reference</th>
                  </tr></thead>
                  <tbody>
                    {payments.map((p) => (
                      <tr key={p.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                        <td style={{ padding: 15 }}>{new Date(p.created_at).toLocaleString()}</td>
                        <td style={{ padding: 15 }}>{p.method}</td>
                        <td style={{ padding: 15 }}>${p.amount} {p.currency}</td>
                        <td style={{ padding: 15, color: 'var(--success)' }}>{p.status}</td>
                        <td style={{ padding: 15 }} className="text-secondary">{p.reference}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
