import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const FAQS = [
  { q: 'How do I reset my password?', a: 'Go to the login page and click "Forgot Password." Enter your email address and we\'ll send you a reset link.' },
  { q: 'Why is my video buffering?', a: 'Buffering can be caused by slow internet. Try lowering video quality in settings or check your connection.' },
  { q: 'How do I cancel my subscription?', a: 'Go to Account Settings > Subscription > Cancel. Your access continues until the end of your billing period.' },
  { q: 'Why was my payment declined?', a: 'This could be due to insufficient funds, expired card, or bank restrictions. Update your payment method in Account Settings.' },
];

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '', preference: '' });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const set = (k, v) => setForm({ ...form, [k]: v });

  const formatPhone = (v) => {
    const d = v.replace(/\D/g, '').substring(0, 10);
    if (d.length > 6) return `${d.substring(0, 3)}-${d.substring(3, 6)}-${d.substring(6)}`;
    if (d.length > 3) return `${d.substring(0, 3)}-${d.substring(3)}`;
    return d;
  };

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    await supabase.from('contact_messages').insert({
      name: form.name, email: form.email, phone: form.phone,
      subject: form.subject, message: form.message, preference: form.preference,
    });
    setSubmitting(false);
    setSuccess(true);
    setForm({ name: '', email: '', phone: '', subject: '', message: '', preference: '' });
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <div className="page">
      <div className="container">
        <div className="page-header">
          <h1 className="page-title"><i className="fas fa-headset"></i> Contact Us</h1>
          <p className="page-subtitle">We're here to help you with any questions or concerns about your CineStream+ experience</p>
        </div>

        {success && (
          <div className="alert alert-success mb-3">
            <i className="fas fa-check-circle" style={{ fontSize: 24 }}></i>
            <div><h3>Message Sent Successfully!</h3><p>We'll get back to you within 24 hours.</p></div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 40 }}>
          <div className="card text-center"><div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(229,9,20,0.1)', color: 'var(--accent)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 28, margin: '0 auto 20px' }}><i className="fas fa-phone-alt"></i></div><h3>Call Us</h3><p className="text-secondary" style={{ marginBottom: 10 }}>Speak directly with our support team</p><p style={{ color: 'var(--accent)', fontWeight: 500 }}>+1 (555) 123-STREAM</p></div>
          <div className="card text-center"><div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(229,9,20,0.1)', color: 'var(--accent)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 28, margin: '0 auto 20px' }}><i className="fas fa-comments"></i></div><h3>Live Chat</h3><p className="text-secondary" style={{ marginBottom: 10 }}>Instant help from our agents</p><p style={{ color: 'var(--accent)', fontWeight: 500 }}>Available 24/7</p></div>
          <div className="card text-center"><div style={{ width: 70, height: 70, borderRadius: '50%', background: 'rgba(229,9,20,0.1)', color: 'var(--accent)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 28, margin: '0 auto 20px' }}><i className="fas fa-envelope"></i></div><h3>Email Us</h3><p className="text-secondary" style={{ marginBottom: 10 }}>Send us a message</p><p style={{ color: 'var(--accent)', fontWeight: 500 }}>support@cinestream.com</p></div>
        </div>

        <div className="card mb-3" style={{ padding: 40 }}>
          <h2 style={{ fontSize: 24, marginBottom: 25, display: 'flex', alignItems: 'center', gap: 10 }}><i className="fas fa-envelope-open-text"></i> Send us a Message</h2>
          <form onSubmit={submit}>
            <div className="form-group"><label className="form-label">Full Name *</label><input type="text" className="form-input" value={form.name} onChange={(e) => set('name', e.target.value)} required placeholder="Enter your full name" /></div>
            <div className="form-group"><label className="form-label">Email Address *</label><input type="email" className="form-input" value={form.email} onChange={(e) => set('email', e.target.value)} required placeholder="Enter your email" /></div>
            <div className="form-group">
              <label className="form-label">Phone Number *</label>
              <div style={{ display: 'flex', background: 'var(--secondary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden' }}>
                <div style={{ padding: '0 15px', display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>+1</div>
                <input type="tel" className="form-input" value={form.phone} onChange={(e) => set('phone', formatPhone(e.target.value))} required placeholder="123-456-7890" pattern="\d{3}-\d{3}-\d{4}" style={{ border: 'none', background: 'transparent' }} />
              </div>
              <p className="form-hint">Format: 123-456-7890</p>
            </div>
            <div className="form-group">
              <label className="form-label">Regarding *</label>
              <select className="form-input" value={form.subject} onChange={(e) => set('subject', e.target.value)} required>
                <option value="" disabled>Select an option</option>
                <option value="billing">Billing & Payments</option>
                <option value="technical">Technical Support</option>
                <option value="content">Content Questions</option>
                <option value="account">Account Management</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="form-group"><label className="form-label">Message *</label><textarea className="form-input" value={form.message} onChange={(e) => set('message', e.target.value)} required placeholder="Describe your issue" style={{ minHeight: 150 }} /></div>
            <div className="form-group">
              <label className="form-label">Preferred contact method *</label>
              <select className="form-input" value={form.preference} onChange={(e) => set('preference', e.target.value)} required>
                <option value="" disabled>Select method</option>
                <option value="email">Email</option>
                <option value="phone">Phone Call</option>
                <option value="text">Text Message</option>
              </select>
            </div>
            <button type="submit" className="btn btn-large" disabled={submitting}>{submitting ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <><i className="fas fa-paper-plane"></i> Send Message</>}</button>
          </form>
        </div>

        <div className="mb-3">
          <h2 className="section-title" style={{ fontSize: 24, marginBottom: 25 }}><i className="fas fa-question-circle"></i> Frequently Asked Questions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20 }}>
            {FAQS.map((f) => (
              <div key={f.q} className="card"><h3 style={{ fontWeight: 500, marginBottom: 10, color: 'var(--accent)' }}>{f.q}</h3><p className="text-secondary">{f.a}</p></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
