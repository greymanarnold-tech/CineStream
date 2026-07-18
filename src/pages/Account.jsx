import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Link } from 'react-router-dom';

export default function Account() {
  const { session, user, profile, signOut, refreshProfile } = useAuth();
  const [form, setForm] = useState({ full_name: '', email: '', phone: '', date_of_birth: '' });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [bookmarkCount, setBookmarkCount] = useState(0);

  useEffect(() => {
    if (profile) {
      setForm({
        full_name: profile.full_name || '',
        email: profile.email || user?.email || '',
        phone: profile.phone || '',
        date_of_birth: profile.date_of_birth || '',
      });
    }
    if (user) {
      supabase.from('bookmarks').select('*', { count: 'exact', head: true }).eq('user_id', user.id).then(({ count }) => setBookmarkCount(count || 0));
    }
  }, [profile, user]);

  if (!session) {
    return (
      <div className="page">
        <div className="container text-center">
          <h1>Please sign in</h1>
          <p className="text-secondary mt-1">You need to be signed in to view your account.</p>
          <Link to="/auth" className="btn mt-2">Sign In</Link>
        </div>
      </div>
    );
  }

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    await supabase.from('profiles').update({
      full_name: form.full_name,
      phone: form.phone,
      date_of_birth: form.date_of_birth || null,
    }).eq('id', user.id);
    await refreshProfile();
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="page">
      <div className="container" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: 30 }}>
        <div className="card" style={{ textAlign: 'center' }}>
          <div style={{
            width: 120, height: 120, borderRadius: '50%', margin: '0 auto 20px',
            border: '3px solid var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 48, fontWeight: 'bold', background: 'var(--secondary)',
          }}>
            {(form.full_name || user.email || 'U').charAt(0).toUpperCase()}
          </div>
          <h2 style={{ fontSize: 24, marginBottom: 5 }}>{form.full_name || 'User'}</h2>
          <p className="text-secondary" style={{ marginBottom: 20 }}>{form.email}</p>
          <div className="badge" style={{ background: 'linear-gradient(45deg, #f39c12, #e74c3c)', padding: '8px 15px' }}>
            <i className="fas fa-crown"></i> {profile?.membership_tier || 'Basic'} Member
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-around', margin: '25px 0' }}>
            <Stat value="247" label="Hours" />
            <Stat value={bookmarkCount} label="Watchlist" />
            <Stat value="42" label="Favorites" />
          </div>
        </div>

        <div className="card">
          <h2 className="section-title" style={{ fontSize: 22, marginBottom: 25, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Account Settings</h2>
          {saved && <div className="alert alert-success mb-2"><i className="fas fa-check-circle"></i> Changes saved</div>}
          <form onSubmit={handleSave}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input type="text" className="form-input" value={form.full_name} onChange={(e) => setForm({ ...form, full_name: e.target.value })} />
            </div>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" value={form.email} disabled />
              <p className="form-hint">Email cannot be changed</p>
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input type="tel" className="form-input" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+1 (555) 123-4567" />
            </div>
            <div className="form-group">
              <label className="form-label">Date of Birth</label>
              <input type="date" className="form-input" value={form.date_of_birth} onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })} />
            </div>
            <button type="submit" className="btn" disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </form>

          <h2 className="section-title" style={{ fontSize: 22, margin: '40px 0 25px', paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Subscription</h2>
          <div className="card" style={{ background: 'linear-gradient(45deg, var(--secondary), #2a2a2a)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25 }}>
            <div>
              <h3 style={{ marginBottom: 5 }}>{profile?.membership_tier || 'Basic'} Plan</h3>
              <p style={{ color: 'var(--success)', fontWeight: 500 }}>Active</p>
            </div>
            <Link to="/manage" className="btn btn-outline">Manage Plan</Link>
          </div>

          <div style={{ border: '1px solid rgba(231,76,60,0.3)', borderRadius: 8, padding: 20, marginTop: 30, background: 'rgba(231,76,60,0.05)' }}>
            <h3 style={{ color: '#e74c3c', marginBottom: 15 }}>Danger Zone</h3>
            <p className="text-secondary mb-2">Once you take these actions, they cannot be undone.</p>
            <div style={{ display: 'flex', gap: 15 }}>
              <button onClick={() => signOut()} className="btn" style={{ background: '#e74c3c' }}><i className="fas fa-sign-out-alt"></i> Sign Out</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Stat({ value, label }) {
  return (
    <div style={{ textAlign: 'center' }}>
      <span style={{ fontSize: 20, fontWeight: 'bold', display: 'block' }}>{value}</span>
      <span style={{ fontSize: 14, color: 'var(--text-secondary)' }}>{label}</span>
    </div>
  );
}
