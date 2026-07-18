import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';

const PLANS = [
  { id: 'Basic', price: 9.99, features: ['SD streaming (480p)', '1 screen at a time', 'Watch on phone or tablet', 'Basic sound quality', 'Limited content access'] },
  { id: 'Premium', price: 15.99, popular: true, features: ['4K Ultra HD + HDR', '4 screens at a time', 'Watch on any device', 'Dolby Atmos sound', 'Access to all content', 'Download to watch offline'] },
  { id: 'Family', price: 19.99, features: ['4K Ultra HD + HDR', '6 screens at a time', 'Watch on any device', 'Dolby Atmos sound', 'Access to all content', 'Download to watch offline', '5 separate profiles', 'Kids safety features'] },
];

export default function Manage() {
  const { session, profile, refreshProfile } = useAuth();
  const [switching, setSwitching] = useState(null);

  if (!session) {
    return <div className="page"><div className="container text-center"><h1>Please sign in</h1><Link to="/auth" className="btn mt-2">Sign In</Link></div></div>;
  }

  const switchPlan = async (planId) => {
    setSwitching(planId);
    await supabase.from('profiles').update({ membership_tier: planId }).eq('id', profile.id);
    await refreshProfile();
    setSwitching(null);
  };

  return (
    <div className="page">
      <div className="container">
        <h1 style={{ fontSize: 28, marginBottom: 30, display: 'flex', alignItems: 'center', gap: 15 }}>
          <i className="fas fa-crown" style={{ color: 'var(--accent)' }}></i> Manage Your Subscription
        </h1>

        <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 20, marginBottom: 30 }}>
          <div>
            <h2 style={{ fontSize: 22, marginBottom: 10, display: 'flex', alignItems: 'center', gap: 10 }}>
              <i className="fas fa-star" style={{ color: 'var(--accent)' }}></i> {profile?.membership_tier || 'Basic'} Plan
            </h2>
            <p className="text-secondary">Your current subscription tier</p>
          </div>
          <div style={{ background: 'rgba(46,204,113,0.2)', color: 'var(--success)', padding: '8px 15px', borderRadius: 20, fontSize: 14, fontWeight: 500 }}>
            Active
          </div>
        </div>

        <h2 className="section-title" style={{ fontSize: 22, marginBottom: 20 }}><i className="fas fa-box-open"></i> Available Plans</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 40 }}>
          {PLANS.map((plan) => {
            const isCurrent = (profile?.membership_tier || 'Basic') === plan.id;
            return (
              <div key={plan.id} className="card" style={{
                padding: 30, position: 'relative', overflow: 'hidden',
                border: plan.popular ? '2px solid var(--accent)' : '2px solid transparent',
                transform: plan.popular ? 'scale(1.03)' : 'none',
              }}>
                {plan.popular && <div style={{ position: 'absolute', top: 15, right: -30, background: 'var(--accent)', color: 'white', padding: '5px 30px', fontSize: 12, fontWeight: 'bold', transform: 'rotate(45deg)', width: 120, textAlign: 'center' }}>POPULAR</div>}
                <h3 style={{ fontSize: 20, marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10 }}>
                  <i className={plan.id === 'Family' ? 'fas fa-users' : plan.id === 'Premium' ? 'fas fa-star' : 'fas fa-mobile-alt'}></i> {plan.id}
                </h3>
                <div style={{ fontSize: 32, fontWeight: 'bold' }}>${plan.price}</div>
                <div className="text-secondary" style={{ marginBottom: 20 }}>per month</div>
                <ul style={{ margin: '20px 0', paddingLeft: 20 }}>
                  {plan.features.map((f) => <li key={f} style={{ marginBottom: 10, listStyle: 'none', position: 'relative', paddingLeft: 20 }}>
                    <span style={{ color: 'var(--success)', fontWeight: 'bold', position: 'absolute', left: 0 }}>✓</span> {f}
                  </li>)}
                </ul>
                <button
                  onClick={() => switchPlan(plan.id)}
                  disabled={isCurrent || switching === plan.id}
                  className="btn btn-block"
                  style={isCurrent ? { background: 'var(--secondary)', cursor: 'not-allowed' } : {}}
                >
                  {switching === plan.id ? <span className="spinner" style={{ width: 18, height: 18 }} /> : isCurrent ? 'Current Plan' : `Select ${plan.id} Plan`}
                </button>
              </div>
            );
          })}
        </div>

        <h2 className="section-title" style={{ fontSize: 22, marginBottom: 20 }}><i className="fas fa-credit-card"></i> Payment Methods</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 20, marginBottom: 30 }}>
          <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 15 }}>
              <i className="fab fa-cc-visa" style={{ fontSize: 24 }}></i>
              <div><h4>Visa ending in 7654</h4><p className="text-secondary" style={{ fontSize: 14 }}>Expires 08/2025</p></div>
            </div>
          </div>
          <Link to="/payment" className="card" style={{ border: '2px dashed var(--text-secondary)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: 15, color: 'var(--text-secondary)' }}>
            <i className="fas fa-plus-circle" style={{ fontSize: 32 }}></i>
            <p>Add Payment Method</p>
          </Link>
        </div>
      </div>
    </div>
  );
}
