import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="page">
      <div className="container text-center" style={{ padding: 60 }}>
        <h1 style={{ fontSize: 72, color: 'var(--accent)' }}>404</h1>
        <h2 style={{ fontSize: 28, marginBottom: 15 }}>Page Not Found</h2>
        <p className="text-secondary mb-3">The page you're looking for doesn't exist.</p>
        <Link to="/" className="btn"><i className="fas fa-home"></i> Back Home</Link>
      </div>
    </div>
  );
}
