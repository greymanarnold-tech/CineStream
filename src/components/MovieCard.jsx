import { Link } from 'react-router-dom';

export default function MovieCard({ movie }) {
  return (
    <Link to={`/watch/${movie.id}`} className="content-card" style={{
      background: 'var(--card-bg)',
      borderRadius: '8px',
      overflow: 'hidden',
      transition: 'transform 0.3s, background 0.3s',
      display: 'block',
    }}>
      <div style={{ position: 'relative', overflow: 'hidden' }}>
        <img
          src={movie.poster_url}
          alt={movie.title}
          loading="lazy"
          style={{ width: '100%', height: '160px', objectFit: 'cover', display: 'block', transition: 'transform 0.4s' }}
          onMouseEnter={(e) => e.target.style.transform = 'scale(1.08)'}
          onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
        />
        {movie.is_premium && (
          <span className="badge badge-premium" style={{ position: 'absolute', top: '10px', right: '10px' }}>PREMIUM</span>
        )}
      </div>
      <div style={{ padding: '15px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '8px' }}>{movie.title}</h3>
        <div style={{ color: 'var(--text-secondary)', fontSize: '14px', display: 'flex', justifyContent: 'space-between' }}>
          <span>{movie.type === 'tv' ? 'TV Show' : 'Movie'}</span>
          <span>{movie.year}</span>
        </div>
        <div style={{ color: 'var(--text-secondary)', fontSize: '13px', marginTop: '6px' }}>
          <i className="fas fa-star" style={{ color: 'gold' }}></i> {movie.rating} • {movie.duration}
        </div>
      </div>
    </Link>
  );
}
