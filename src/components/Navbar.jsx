import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { session, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/?search=${encodeURIComponent(searchValue.trim())}`);
      setSearchOpen(false);
    }
  };

  const isMoviesActive = location.pathname === '/' && (location.search === '?type=movie' || location.search.includes('type=movie'));
  const isTvActive = location.pathname === '/' && (location.search === '?type=tv' || location.search.includes('type=tv'));

  const linkStyle = (active) => ({
    color: active ? 'var(--accent)' : 'var(--text)',
    fontWeight: active ? 600 : 400,
    paddingBottom: '4px',
    borderBottom: active ? '2px solid var(--accent)' : '2px solid transparent',
    transition: 'all 0.25s',
  });

  return (
    <header style={{
      background: scrolled ? 'rgba(20, 20, 20, 0.95)' : 'linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
      padding: '20px 50px',
      position: 'fixed',
      width: '100%',
      zIndex: 100,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      transition: 'background 0.3s',
    }}>
      <Link to="/" className="logo" style={{ fontSize: '28px', fontWeight: 'bold', color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <i className="fas fa-play-circle"></i>
        CineStream+
      </Link>

      <nav>
        <ul style={{ display: 'flex', listStyle: 'none', gap: '25px' }}>
          <li><NavLink to="/" end style={({ isActive }) => linkStyle(isActive && !location.search)}>Home</NavLink></li>
          <li><Link to="/?type=movie" style={linkStyle(isMoviesActive)}>Movies</Link></li>
          <li><Link to="/?type=tv" style={linkStyle(isTvActive)}>TV Shows</Link></li>
          <li><NavLink to="/my-list" style={({ isActive }) => linkStyle(isActive)}>My List</NavLink></li>
          <li><NavLink to="/playlists" style={({ isActive }) => linkStyle(isActive)}>Playlists</NavLink></li>
          {profile?.is_admin && <li><NavLink to="/admin" style={({ isActive }) => linkStyle(isActive)}>Admin</NavLink></li>}
        </ul>
      </nav>

      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', alignItems: 'center' }}>
          <input
            type="text"
            className="search-box"
            placeholder="Search..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            style={{
              background: searchOpen ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.1)',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 15px',
              color: 'var(--text)',
              width: searchOpen ? '240px' : '180px',
              transition: 'all 0.3s',
            }}
            onFocus={() => setSearchOpen(true)}
          />
        </form>
        {session ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link to="/account" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: '34px', height: '34px', borderRadius: '50%',
                background: 'var(--accent)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontWeight: 'bold', fontSize: '14px',
              }}>
                {(profile?.full_name || session.user.email || 'U').charAt(0).toUpperCase()}
              </div>
            </Link>
            <button className="btn btn-outline" onClick={() => signOut()}>Sign Out</button>
          </div>
        ) : (
          <Link to="/auth" className="btn btn-outline">Sign In</Link>
        )}
      </div>
    </header>
  );
}
