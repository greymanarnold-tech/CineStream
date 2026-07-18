import { useEffect, useRef, useState } from 'react';

export default function About() {
  const statsRef = useRef(null);
  const [animated, setAnimated] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting && !animated) {
          setAnimated(true);
          animateValue('stat1', 0, 10, 2000);
          animateValue('stat2', 0, 25, 2000);
          animateValue('stat3', 0, 190, 2000);
          animateValue('stat4', 0, 98, 2000);
        }
      });
    }, { threshold: 0.5 });
    if (statsRef.current) obs.observe(statsRef.current);
    return () => obs.disconnect();
  }, [animated]);

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title"><i className="fas fa-play-circle"></i> About CineStream+</h1>
          <p className="page-subtitle">We're revolutionizing the way you watch movies and TV shows, bringing the theater experience to your home</p>
        </div>

        <section style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, marginBottom: 60, alignItems: 'center' }}>
          <div>
            <h2 style={{ fontSize: 28, marginBottom: 20, color: 'var(--accent)' }}>Our Story</h2>
            <p className="text-secondary" style={{ marginBottom: 15, fontSize: 17, lineHeight: 1.8 }}>Founded in 2018, CineStream+ began with a simple mission: to make premium entertainment accessible to everyone, everywhere. What started as a small startup with big dreams has now grown into a leading streaming platform serving millions of users worldwide.</p>
            <p className="text-secondary" style={{ marginBottom: 15, fontSize: 17, lineHeight: 1.8 }}>Our team of film enthusiasts and technology experts work tirelessly to bring you the best viewing experience possible. We believe that everyone deserves access to high-quality entertainment.</p>
            <p className="text-secondary" style={{ fontSize: 17, lineHeight: 1.8 }}>Today, we offer one of the largest libraries of 4K HDR content, with exclusive originals, classic films, and the latest blockbusters.</p>
          </div>
          <div style={{ borderRadius: 10, overflow: 'hidden', boxShadow: '0 15px 35px rgba(0,0,0,0.5)' }}>
            <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?auto=format&fit=crop&w=500&q=80" alt="CineStream+ Team" style={{ width: '100%', display: 'block' }} />
          </div>
        </section>

        <section ref={statsRef} className="card" style={{ padding: 40, marginBottom: 60, textAlign: 'center' }}>
          <h2 style={{ fontSize: 28, marginBottom: 40, textAlign: 'center' }}>By The Numbers</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 30 }}>
            <div><span id="stat1" style={{ fontSize: 48, fontWeight: 'bold', color: 'var(--accent)', display: 'block' }}>0</span><span className="text-secondary">Happy Subscribers (M)</span></div>
            <div><span id="stat2" style={{ fontSize: 48, fontWeight: 'bold', color: 'var(--accent)', display: 'block' }}>0</span><span className="text-secondary">Movies & Shows (K)</span></div>
            <div><span id="stat3" style={{ fontSize: 48, fontWeight: 'bold', color: 'var(--accent)', display: 'block' }}>0</span><span className="text-secondary">Countries</span></div>
            <div><span id="stat4" style={{ fontSize: 48, fontWeight: 'bold', color: 'var(--accent)', display: 'block' }}>0</span><span className="text-secondary">% Satisfaction</span></div>
          </div>
        </section>

        <section style={{ marginBottom: 60 }}>
          <h2 style={{ fontSize: 28, marginBottom: 40, textAlign: 'center' }}><i className="fas fa-users"></i> Meet Our Leadership</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 30 }}>
            {TEAM.map((m) => (
              <div key={m.name} className="card" style={{ padding: 0, overflow: 'hidden', transition: 'transform 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-10px)'} onMouseLeave={(e) => e.currentTarget.style.transform = ''}>
                <img src={m.img} alt={m.name} style={{ width: '100%', height: 280, objectFit: 'cover' }} />
                <div style={{ padding: 20, textAlign: 'center' }}>
                  <h3 style={{ fontSize: 20, marginBottom: 5 }}>{m.name}</h3>
                  <p style={{ color: 'var(--accent)', marginBottom: 15, fontWeight: 500 }}>{m.role}</p>
                  <p className="text-secondary" style={{ fontSize: 14, marginBottom: 15 }}>{m.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-light))', borderRadius: 10, padding: 50, textAlign: 'center', marginBottom: 40 }}>
          <h2 style={{ fontSize: 32, marginBottom: 20 }}>Join Our Story</h2>
          <p style={{ fontSize: 18, marginBottom: 30, maxWidth: 600, margin: '0 auto 30px' }}>Become part of our growing community and experience the future of streaming today.</p>
          <a href="/" className="btn" style={{ background: 'var(--primary)' }}>Start Free Trial</a>
        </section>
      </div>
    </div>
  );
}

const TEAM = [
  { name: 'Sarah Johnson', role: 'CEO & Founder', desc: 'Former film producer with a vision for the future of streaming.', img: 'https://images.unsplash.com/photo-1560250097-0b93528c511a?auto=format&fit=crop&w=500&q=80' },
  { name: 'Michael Chen', role: 'CTO', desc: 'Tech innovator with 15+ years experience in streaming technology.', img: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=500&q=80' },
  { name: 'Alexis Rodriguez', role: 'Content Director', desc: 'Curator of exceptional content with a passion for global cinema.', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=500&q=80' },
  { name: 'David Kim', role: 'Head of Design', desc: 'Creating beautiful, intuitive experiences for users worldwide.', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=500&q=80' },
];

function animateValue(id, start, end, duration) {
  const el = document.getElementById(id);
  if (!el) return;
  let startTime = null;
  const step = (ts) => {
    if (!startTime) startTime = ts;
    const progress = Math.min((ts - startTime) / duration, 1);
    el.textContent = Math.floor(progress * (end - start) + start);
    if (progress < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}
