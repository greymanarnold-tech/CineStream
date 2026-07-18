import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Auth() {
  const { signIn, signUp } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState('login');
  const [form, setForm] = useState({ email: '', password: '', fullName: '', confirm: '' });
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k, v) => setForm({ ...form, [k]: v });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (tab === 'register') {
      if (form.password !== form.confirm) { setError('Passwords do not match'); return; }
      if (form.password.length < 6) { setError('Password must be at least 6 characters'); return; }
    }
    setLoading(true);
    try {
      if (tab === 'login') {
        const { error } = await signIn(form.email, form.password);
        if (error) throw error;
      } else {
        const { error } = await signUp(form.email, form.password, form.fullName);
        if (error) throw error;
      }
      navigate('/');
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: 450 }}>
        <div className="card" style={{ padding: 40 }}>
          <div style={{ textAlign: 'center', marginBottom: 30 }}>
            <div style={{ fontSize: 42, color: 'var(--accent)', marginBottom: 15 }}><i className="fas fa-play-circle"></i></div>
            <h1 style={{ fontSize: 28, marginBottom: 10 }}>Welcome to CineStream+</h1>
            <p className="text-secondary">Sign in or create an account to continue</p>
          </div>

          <div style={{ display: 'flex', marginBottom: 25, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div onClick={() => setTab('login')} style={tabStyle(tab === 'login')}>Sign In</div>
            <div onClick={() => setTab('register')} style={tabStyle(tab === 'register')}>Create Account</div>
          </div>

          {error && <div className="alert alert-error" style={{ marginBottom: 20 }}><i className="fas fa-exclamation-circle"></i> {error}</div>}

          <form onSubmit={handleSubmit}>
            {tab === 'register' && (
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" className="form-input" placeholder="Enter your full name" value={form.fullName} onChange={(e) => set('fullName', e.target.value)} required />
              </div>
            )}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input type="email" className="form-input" placeholder="Enter your email" value={form.email} onChange={(e) => set('email', e.target.value)} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <input type={showPwd ? 'text' : 'password'} className="form-input" placeholder="Enter your password" value={form.password} onChange={(e) => set('password', e.target.value)} required style={{ paddingRight: 45 }} />
                <span onClick={() => setShowPwd(!showPwd)} style={{ position: 'absolute', right: 15, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                  <i className={showPwd ? 'fas fa-eye-slash' : 'fas fa-eye'}></i>
                </span>
              </div>
            </div>
            {tab === 'register' && (
              <div className="form-group">
                <label className="form-label">Confirm Password</label>
                <input type={showPwd ? 'text' : 'password'} className="form-input" placeholder="Confirm your password" value={form.confirm} onChange={(e) => set('confirm', e.target.value)} required />
              </div>
            )}
            <button type="submit" className="btn btn-block btn-large" disabled={loading}>
              {loading ? <span className="spinner" style={{ width: 18, height: 18 }} /> : (tab === 'login' ? 'Sign In' : 'Create Account')}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, color: 'var(--text-secondary)', fontSize: 14 }}>
            {tab === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <a onClick={() => setTab(tab === 'login' ? 'register' : 'login')} style={{ color: 'var(--accent)', cursor: 'pointer', fontWeight: 500 }}>
              {tab === 'login' ? 'Sign up' : 'Sign in'}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function tabStyle(active) {
  return {
    flex: 1, textAlign: 'center', padding: 15, cursor: 'pointer', fontWeight: 500, transition: 'all 0.3s',
    borderBottom: active ? '3px solid var(--accent)' : '3px solid transparent',
    color: active ? 'var(--accent)' : 'var(--text)',
  };
}
