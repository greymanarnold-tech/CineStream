import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const METHODS = [
  { id: 'mpesa', name: 'M-Pesa', icon: 'fas fa-mobile-alt', color: '#00a650', desc: 'Pay instantly with your M-Pesa mobile money account' },
  { id: 'airtel', name: 'Airtel Money', icon: 'fas fa-mobile-alt', color: '#ff0000', desc: 'Pay with your Airtel Money mobile wallet' },
  { id: 'paypal', name: 'PayPal', icon: 'fab fa-paypal', color: '#009cde', desc: 'Pay with your PayPal account or credit card' },
  { id: 'crypto', name: 'Cryptocurrency', icon: 'fab fa-bitcoin', color: '#f7931a', desc: 'Pay with Bitcoin, Ethereum, or other cryptocurrencies' },
  { id: 'card', name: 'Credit/Debit Card', icon: 'far fa-credit-card', color: '#1a1f71', desc: 'Pay with Visa, Mastercard, or American Express' },
  { id: 'bank', name: 'Bank Transfer', icon: 'fas fa-university', color: '#3498db', desc: 'Direct bank transfer from your account' },
];

export default function Payment() {
  const { user } = useAuth();
  const [selected, setSelected] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);
  const [card, setCard] = useState({ number: '', expiry: '', cvv: '', name: '' });

  const formatCard = (v) => v.replace(/\D/g, '').substring(0, 16).replace(/(.{4})/g, '$1 ').trim();
  const formatExpiry = (v) => {
    const d = v.replace(/\D/g, '').substring(0, 4);
    return d.length > 2 ? `${d.substring(0, 2)}/${d.substring(2)}` : d;
  };

  const pay = async (e) => {
    e.preventDefault();
    setProcessing(true);
    await supabase.from('payments').insert({
      user_id: user?.id || null,
      method: selected,
      amount: 17.19,
      currency: 'USD',
      status: 'completed',
      reference: `CSP-${Date.now()}`,
    });
    setTimeout(() => {
      setProcessing(false);
      setDone(true);
    }, 1500);
  };

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="page-header">
          <h1 className="page-title"><i className="fas fa-credit-card"></i> Payment Methods</h1>
          <p className="page-subtitle">Choose your preferred payment method to complete your subscription</p>
        </div>

        {done ? (
          <div className="alert alert-success" style={{ fontSize: 18 }}>
            <i className="fas fa-check-circle" style={{ fontSize: 24 }}></i>
            <div><h3>Payment successful!</h3><p>Thank you for your subscription.</p></div>
          </div>
        ) : null}

        <div className="card mb-3">
          <h2 style={{ fontSize: 20, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}><i className="fas fa-receipt"></i> Order Summary</h2>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, paddingBottom: 15, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div>Premium Plan (Monthly)</div><div>$15.99</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 15, paddingBottom: 15, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
            <div>Tax</div><div>$1.20</div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 20, fontWeight: 'bold', marginTop: 20, paddingTop: 20, borderTop: '2px solid rgba(255,255,255,0.2)' }}>
            <div>Total</div><div>$17.19</div>
          </div>
        </div>

        <h2 className="section-title" style={{ fontSize: 24, marginBottom: 25 }}><i className="fas fa-wallet"></i> Select Payment Method</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 20, marginBottom: 40 }}>
          {METHODS.map((m) => (
            <div key={m.id} onClick={() => setSelected(m.id)} className="card" style={{
              cursor: 'pointer', border: selected === m.id ? '2px solid var(--accent)' : '2px solid transparent',
              background: selected === m.id ? 'rgba(229,9,20,0.05)' : 'var(--card-bg)',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 15, marginBottom: 15 }}>
                <div style={{ width: 50, height: 50, borderRadius: 10, background: m.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: 'white' }}>
                  <i className={m.icon}></i>
                </div>
                <div style={{ fontSize: 18, fontWeight: 500 }}>{m.name}</div>
              </div>
              <p className="text-secondary" style={{ fontSize: 14, marginBottom: 15 }}>{m.desc}</p>
            </div>
          ))}
        </div>

        {selected && (
          <div className="card" style={{ padding: 30, marginBottom: 30 }}>
            {selected === 'card' && (
              <form onSubmit={pay}>
                <h2 style={{ fontSize: 20, marginBottom: 20 }}><i className="far fa-credit-card"></i> Card Payment</h2>
                <div className="form-group">
                  <label className="form-label">Card Number *</label>
                  <input type="text" className="form-input" placeholder="1234 5678 9012 3456" value={card.number} onChange={(e) => setCard({ ...card, number: formatCard(e.target.value) })} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label">Expiry Date *</label>
                    <input type="text" className="form-input" placeholder="MM/YY" value={card.expiry} onChange={(e) => setCard({ ...card, expiry: formatExpiry(e.target.value) })} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">CVV *</label>
                    <input type="text" className="form-input" placeholder="123" value={card.cvv} onChange={(e) => setCard({ ...card, cvv: e.target.value.replace(/\D/g, '').substring(0, 4) })} required />
                  </div>
                </div>
                <div className="form-group">
                  <label className="form-label">Cardholder Name *</label>
                  <input type="text" className="form-input" placeholder="John Doe" value={card.name} onChange={(e) => setCard({ ...card, name: e.target.value })} required />
                </div>
                <button type="submit" className="btn btn-block btn-large" disabled={processing}>
                  {processing ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <><i className="fas fa-lock"></i> Pay $17.19</>}
                </button>
              </form>
            )}
            {selected === 'mpesa' && (
              <form onSubmit={pay}>
                <h2 style={{ fontSize: 20, marginBottom: 20 }}><i className="fas fa-mobile-alt"></i> M-Pesa Payment</h2>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <div style={{ display: 'flex', background: 'var(--secondary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ padding: '0 15px', display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>+254</div>
                    <input type="tel" className="form-input" placeholder="7XX XXX XXX" required style={{ border: 'none', background: 'transparent' }} />
                  </div>
                  <p className="form-hint">You will receive a prompt on your phone to confirm payment</p>
                </div>
                <button type="submit" className="btn btn-block btn-large" disabled={processing}>
                  {processing ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <><i className="fas fa-lock"></i> Pay with M-Pesa</>}
                </button>
              </form>
            )}
            {selected === 'airtel' && (
              <form onSubmit={pay}>
                <h2 style={{ fontSize: 20, marginBottom: 20 }}><i className="fas fa-mobile-alt"></i> Airtel Money Payment</h2>
                <div className="form-group">
                  <label className="form-label">Phone Number *</label>
                  <div style={{ display: 'flex', background: 'var(--secondary)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, overflow: 'hidden' }}>
                    <div style={{ padding: '0 15px', display: 'flex', alignItems: 'center', borderRight: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)' }}>+256</div>
                    <input type="tel" className="form-input" placeholder="7XX XXX XXX" required style={{ border: 'none', background: 'transparent' }} />
                  </div>
                </div>
                <button type="submit" className="btn btn-block btn-large" disabled={processing}>
                  {processing ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <><i className="fas fa-lock"></i> Pay with Airtel Money</>}
                </button>
              </form>
            )}
            {selected === 'paypal' && (
              <form onSubmit={pay}>
                <h2 style={{ fontSize: 20, marginBottom: 20 }}><i className="fab fa-paypal"></i> PayPal Payment</h2>
                <div className="form-group">
                  <label className="form-label">PayPal Email *</label>
                  <input type="email" className="form-input" placeholder="your@email.com" required />
                </div>
                <button type="submit" className="btn btn-block btn-large" style={{ background: '#009cde' }} disabled={processing}>
                  {processing ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <><i className="fab fa-paypal"></i> Continue to PayPal</>}
                </button>
              </form>
            )}
            {selected === 'crypto' && (
              <form onSubmit={pay}>
                <h2 style={{ fontSize: 20, marginBottom: 20 }}><i className="fab fa-bitcoin"></i> Cryptocurrency Payment</h2>
                <div className="form-group">
                  <label className="form-label">Wallet Address</label>
                  <input type="text" className="form-input" value="1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa" readOnly />
                </div>
                <button type="submit" className="btn btn-block btn-large" style={{ background: '#f7931a' }} disabled={processing}>
                  {processing ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <><i className="fas fa-qrcode"></i> Confirm Payment</>}
                </button>
              </form>
            )}
            {selected === 'bank' && (
              <div className="card" style={{ background: 'var(--secondary)' }}>
                <h2 style={{ fontSize: 20, marginBottom: 20 }}><i className="fas fa-university"></i> Bank Transfer</h2>
                <div className="form-group"><label className="form-label">Account Name</label><input type="text" className="form-input" value="CineStream+ Inc." readOnly /></div>
                <div className="form-group"><label className="form-label">Account Number</label><input type="text" className="form-input" value="1234567890" readOnly /></div>
                <div className="form-group"><label className="form-label">SWIFT/BIC Code</label><input type="text" className="form-input" value="GBIUS33" readOnly /></div>
                <button onClick={pay} className="btn btn-block btn-large" style={{ background: 'var(--info)' }} disabled={processing}>
                  {processing ? <span className="spinner" style={{ width: 18, height: 18 }} /> : <><i className="fas fa-download"></i> Download Invoice</>}
                </button>
              </div>
            )}
            <div style={{ textAlign: 'center', marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-secondary" style={{ fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
                <i className="fas fa-shield-alt"></i> Your payment is secure and encrypted
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
