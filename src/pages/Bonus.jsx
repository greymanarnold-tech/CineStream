import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const FAQS = [
  { q: 'Where can I find my gift card code?', a: 'The gift card code is typically located on the back of the physical card. Scratch gently to reveal the code. For digital gift cards, check your email.' },
  { q: 'How long does it take for the credit to appear?', a: 'The credit is applied to your account immediately after successful redemption.' },
  { q: 'Can I use multiple gift cards?', a: 'Yes, you can redeem multiple gift cards. The credit from all cards will be combined in your account balance.' },
  { q: 'What if my gift card doesn\'t work?', a: 'Please double-check that you\'ve entered the code correctly. If it still doesn\'t work, contact our support team.' },
];

export default function Bonus() {
  const { user } = useAuth();
  const [code, setCode] = useState('');
  const [pin, setPin] = useState('');
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(null);

  const formatCode = (v) => {
    const clean = v.replace(/-/g, '').substring(0, 16);
    let out = '';
    for (let i = 0; i < clean.length; i++) {
      if (i > 0 && i % 4 === 0) out += '-';
      out += clean[i];
    }
    return out;
  };

  const redeem = async (e) => {
    e.preventDefault();
    if (code.replace(/-/g, '').length < 16) return;
    setProcessing(true);
    const amount = Math.floor(Math.random() * 4) * 25 + 25;
    await supabase.from('gift_redemptions').insert({
      user_id: user?.id || null,
      code,
      amount,
      status: 'completed',
    });
    setTimeout(() => {
      setProcessing(false);
      setSuccess(amount);
      setCode('');
      setPin('');
    }, 1500);
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 900 }}>
        <div className="page-header">
          <h1 className="page-title"><i className="fas fa-gift"></i> Redeem Gift Card</h1>
          <p className="page-subtitle">Enter your gift card code below to add credit to your CineStream+ account</p>
        </div>

        {success && (
          <div className="alert alert-success mb-3">
            <i className="fas fa-check-circle" style={{ fontSize: 24 }}></i>
            <div><h3>Gift Card Redeemed Successfully!</h3><p>${success.toFixed(2)} has been added to your account balance.</p></div>
          </div>
        )}

        <div className="card mb-3" style={{ padding: 40 }}>
          <h2 style={{ fontSize: 22, marginBottom: 25, display: 'flex', alignItems: 'center', gap: 10 }}><i className="fas fa-keyboard"></i> Enter Gift Card Details</h2>
          <form onSubmit={redeem}>
            <div className="form-group">
              <label className="form-label">Gift Card Code</label>
              <input type="text" className="form-input" placeholder="XXXX-XXXX-XXXX-XXXX" value={code} onChange={(e) => setCode(formatCode(e.target.value))} maxLength={19} required />
            </div>
            <div className="form-group">
              <label className="form-label">PIN (if applicable)</label>
              <input type="password" className="form-input" placeholder="4-digit PIN" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, '').substring(0, 4))} maxLength={4} />
            </div>
            <button type="submit" className="btn btn-block btn-large" disabled={processing}>
              {processing ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <><i className="fas fa-gift"></i> Redeem Gift Card</>}
            </button>
          </form>
        </div>

        <div className="card mb-3">
          <h2 style={{ fontSize: 22, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}><i className="fas fa-info-circle"></i> How It Works</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
            {['Enter Code', 'Redeem', 'Enjoy Content'].map((step, i) => (
              <div key={step} className="card" style={{ background: 'var(--secondary)', textAlign: 'center', padding: 20 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center', fontWeight: 'bold', margin: '0 auto 15px' }}>{i + 1}</div>
                <h3 style={{ fontWeight: 500, marginBottom: 10 }}>{step}</h3>
                <p className="text-secondary" style={{ fontSize: 14 }}>{['Type your gift card code or scan it', 'Click the redeem button to validate', 'Credit is applied immediately'][i]}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <h2 style={{ fontSize: 22, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}><i className="fas fa-question-circle"></i> Frequently Asked Questions</h2>
          {FAQS.map((f) => <FaqItem key={f.q} {...f} />)}
        </div>
      </div>
    </div>
  );
}

function FaqItem({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ marginBottom: 20, borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 20 }}>
      <div onClick={() => setOpen(!open)} style={{ fontWeight: 500, fontSize: 18, cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        {q}
        <span style={{ transition: 'transform 0.3s', transform: open ? 'rotate(180deg)' : 'none' }}><i className="fas fa-chevron-down"></i></span>
      </div>
      {open && <p className="text-secondary mt-1">{a}</p>}
    </div>
  );
}
