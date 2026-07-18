import { useState } from 'react';

export default function ShareModal({ open, onClose, url, title }) {
  const [copied, setCopied] = useState(false);

  if (!open) return null;

  const shareUrl = url || (typeof window !== 'undefined' ? window.location.href : '');

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = shareUrl;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const shareNative = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: title || 'CineStream+', url: shareUrl });
      } catch {
        // user cancelled
      }
    } else {
      copyLink();
    }
  };

  const socials = [
    { name: 'Twitter', icon: 'fab fa-twitter', color: '#1DA1F2', url: `https://twitter.com/intent/tweet?text=${encodeURIComponent(title || 'Check this out!')}&url=${encodeURIComponent(shareUrl)}` },
    { name: 'Facebook', icon: 'fab fa-facebook', color: '#1877F2', url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
    { name: 'WhatsApp', icon: 'fab fa-whatsapp', color: '#25D366', url: `https://wa.me/?text=${encodeURIComponent((title || '') + ' ' + shareUrl)}` },
    { name: 'Telegram', icon: 'fab fa-telegram', color: '#0088cc', url: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(title || '')}` },
    { name: 'LinkedIn', icon: 'fab fa-linkedin', color: '#0A66C2', url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}` },
    { name: 'Reddit', icon: 'fab fa-reddit', color: '#FF4500', url: `https://reddit.com/submit?url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(title || '')}` },
  ];

  return (
    <div onClick={onClose} style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      zIndex: 1000, padding: 20, animation: 'fadeIn 0.2s',
    }}>
      <div onClick={(e) => e.stopPropagation()} className="card" style={{
        width: '100%', maxWidth: 480, padding: 30,
        animation: 'fadeIn 0.3s',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, display: 'flex', alignItems: 'center', gap: 10 }}>
            <i className="fas fa-share-alt" style={{ color: 'var(--accent)' }}></i> Share
          </h2>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', fontSize: 22, cursor: 'pointer' }}><i className="fas fa-times"></i></button>
        </div>

        {title && <p className="text-secondary mb-2">Share "{title}" with friends</p>}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 15, marginBottom: 25 }}>
          {socials.map((s) => (
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
              padding: 15, background: 'var(--secondary)', borderRadius: 8,
              transition: 'transform 0.2s, background 0.2s', cursor: 'pointer',
            }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }} onMouseLeave={(e) => { e.currentTarget.style.transform = ''; e.currentTarget.style.background = 'var(--secondary)'; }}>
              <div style={{ width: 40, height: 40, borderRadius: '50%', background: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: 18 }}>
                <i className={s.icon}></i>
              </div>
              <span style={{ fontSize: 13 }}>{s.name}</span>
            </a>
          ))}
        </div>

        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: 20 }}>
          <label className="form-label">Page Link</label>
          <div style={{ display: 'flex', gap: 10 }}>
            <input type="text" value={shareUrl} readOnly style={{
              flex: 1, background: 'var(--secondary)', border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: 6, padding: '12px 15px', color: 'var(--text)', fontSize: 14,
            }} />
            <button onClick={copyLink} className="btn" style={{ whiteSpace: 'nowrap' }}>
              {copied ? <><i className="fas fa-check"></i> Copied</> : <><i className="fas fa-copy"></i> Copy</>}
            </button>
          </div>
          {typeof navigator !== 'undefined' && navigator.share && (
            <button onClick={shareNative} className="btn btn-outline btn-block mt-2">
              <i className="fas fa-share"></i> Share via device
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
