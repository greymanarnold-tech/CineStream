import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';

export default function MovieCard({ movie, onAddToPlaylist }) {
  const [hovered, setHovered] = useState(false);
  const [showActions, setShowActions] = useState(false);
  const videoRef = useRef(null);
  const hoverTimer = useRef(null);

  const handleEnter = () => {
    setHovered(true);
    hoverTimer.current = setTimeout(() => setShowActions(true), 400);
  };

  const handleLeave = () => {
    setHovered(false);
    setShowActions(false);
    clearTimeout(hoverTimer.current);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <div
      className="content-card"
      style={{
        background: 'var(--card-bg)',
        borderRadius: '8px',
        overflow: 'hidden',
        transition: 'transform 0.3s, box-shadow 0.3s',
        position: 'relative',
        cursor: 'pointer',
      }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={(e) => {
        if (showActions) e.currentTarget.style.transform = 'scale(1.05)';
      }}
    >
      <Link to={`/watch/${movie.id}`} style={{ display: 'block', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src={movie.poster_url}
            alt={movie.title}
            loading="lazy"
            style={{
              width: '100%',
              height: '160px',
              objectFit: 'cover',
              display: 'block',
              transition: 'opacity 0.3s',
              opacity: hovered ? 0 : 1,
            }}
          />
          {hovered && movie.video_url && (
            <video
              ref={videoRef}
              src={movie.video_url}
              muted
              loop
              autoPlay
              playsInline
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '160px',
                objectFit: 'cover',
              }}
            />
          )}
          {movie.is_premium && (
            <span className="badge badge-premium" style={{ position: 'absolute', top: '10px', right: '10px', zIndex: 2 }}>PREMIUM</span>
          )}
          {hovered && (
            <div style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 50%, rgba(0,0,0,0) 100%)',
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'center',
              padding: '15px',
              opacity: 0,
              animation: 'fadeIn 0.3s forwards',
              pointerEvents: 'none',
            }}>
              <div style={{
                width: 50, height: 50, borderRadius: '50%',
                background: 'var(--accent)', display: 'flex',
                alignItems: 'center', justifyContent: 'center',
                marginBottom: 10,
              }}>
                <i className="fas fa-play" style={{ color: 'white', fontSize: 18 }}></i>
              </div>
            </div>
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

      {showActions && onAddToPlaylist && (
        <button
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onAddToPlaylist(movie); }}
          style={{
            position: 'absolute', top: 10, left: 10, zIndex: 3,
            background: 'rgba(0,0,0,0.7)', border: 'none', borderRadius: '50%',
            width: 34, height: 34, cursor: 'pointer', color: 'white',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'var(--accent)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(0,0,0,0.7)'}
          title="Add to playlist"
        >
          <i className="fas fa-plus"></i>
        </button>
      )}
    </div>
  );
}
