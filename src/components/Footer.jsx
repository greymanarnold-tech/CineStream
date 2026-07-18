import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ background: 'var(--secondary)', padding: '50px 50px 30px', marginTop: '50px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '30px' }}>
        <div>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Navigation</h3>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ marginBottom: '10px' }}><Link to="/" style={{ color: 'var(--text-secondary)' }}>Home</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/my-list" style={{ color: 'var(--text-secondary)' }}>My List</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/about" style={{ color: 'var(--text-secondary)' }}>About Us</Link></li>
          </ul>
        </div>
        <div>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Account</h3>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ marginBottom: '10px' }}><Link to="/account" style={{ color: 'var(--text-secondary)' }}>My Account</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/manage" style={{ color: 'var(--text-secondary)' }}>Subscription</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/bonus" style={{ color: 'var(--text-secondary)' }}>Redeem Gift Card</Link></li>
          </ul>
        </div>
        <div>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Company</h3>
          <ul style={{ listStyle: 'none' }}>
            <li style={{ marginBottom: '10px' }}><Link to="/about" style={{ color: 'var(--text-secondary)' }}>About Us</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/contact" style={{ color: 'var(--text-secondary)' }}>Contact</Link></li>
            <li style={{ marginBottom: '10px' }}><Link to="/privacy" style={{ color: 'var(--text-secondary)' }}>Privacy Policy</Link></li>
          </ul>
        </div>
        <div>
          <h3 style={{ marginBottom: '20px', fontSize: '18px' }}>Connect With Us</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '15px' }}>Follow us on social media for updates and more.</p>
          <div style={{ display: 'flex', gap: '15px' }}>
            <a href="#" style={{ color: 'var(--text)', fontSize: '20px' }}><i className="fab fa-facebook"></i></a>
            <a href="#" style={{ color: 'var(--text)', fontSize: '20px' }}><i className="fab fa-twitter"></i></a>
            <a href="#" style={{ color: 'var(--text)', fontSize: '20px' }}><i className="fab fa-instagram"></i></a>
            <a href="#" style={{ color: 'var(--text)', fontSize: '20px' }}><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </div>
      <div style={{ textAlign: 'center', marginTop: '50px', color: 'var(--text-secondary)', fontSize: '14px' }}>
        <p>&copy; {new Date().getFullYear()} CineStream+. All rights reserved.</p>
      </div>
    </footer>
  );
}
