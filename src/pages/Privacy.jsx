import { useEffect, useState } from 'react';

const SECTIONS = [
  { id: 'info-we-collect', icon: 'fas fa-database', title: 'Information We Collect' },
  { id: 'how-we-use', icon: 'fas fa-cogs', title: 'How We Use Your Information' },
  { id: 'info-sharing', icon: 'fas fa-exchange-alt', title: 'Information Sharing' },
  { id: 'data-security', icon: 'fas fa-lock', title: 'Data Security' },
  { id: 'your-rights', icon: 'fas fa-user-check', title: 'Your Rights' },
  { id: 'cookies', icon: 'fas fa-cookie-bite', title: 'Cookies & Tracking' },
  { id: 'children-privacy', icon: 'fas fa-child', title: "Children's Privacy" },
  { id: 'changes', icon: 'fas fa-exclamation-circle', title: 'Policy Changes' },
];

export default function Privacy() {
  const [active, setActive] = useState('');

  useEffect(() => {
    const onScroll = () => {
      let current = '';
      SECTIONS.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el && window.pageYOffset >= el.offsetTop - 120) current = s.id;
      });
      setActive(current);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="page">
      <div className="container" style={{ maxWidth: 1000 }}>
        <div className="page-header">
          <h1 className="page-title"><i className="fas fa-shield-alt"></i> Privacy Policy</h1>
          <p className="text-secondary">Last updated: October 15, 2023</p>
        </div>

        <div className="card" style={{ marginBottom: 30 }}>
          <h2 style={{ fontSize: 20, marginBottom: 15, display: 'flex', alignItems: 'center', gap: 10 }}><i className="fas fa-list"></i> Table of Contents</h2>
          <ul style={{ listStyle: 'none', columns: 2, columnGap: 20 }}>
            {SECTIONS.map((s) => (
              <li key={s.id} style={{ marginBottom: 10, breakInside: 'avoid' }}>
                <a href={`#${s.id}`} style={{ color: active === s.id ? 'var(--accent)' : 'var(--text)', display: 'flex', alignItems: 'center', gap: 8, padding: '5px 0' }}>
                  <i className="fas fa-chevron-right" style={{ fontSize: 12 }}></i> {s.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div className="card" style={{ marginBottom: 30 }}>
          <Section id="info-we-collect" icon="fas fa-database" title="Information We Collect">
            <p className="text-secondary mb-2">We collect information to provide better services to all our users. The types of information we collect include:</p>
            <h3 style={{ marginTop: 15, marginBottom: 10 }}>Information you provide</h3>
            <ul className="text-secondary" style={{ marginLeft: 20, marginBottom: 15 }}>
              <li style={{ marginBottom: 8 }}><strong>Account Information:</strong> Name, email address, and password.</li>
              <li style={{ marginBottom: 8 }}><strong>Profile Information:</strong> Birthday, gender, and preferences.</li>
              <li style={{ marginBottom: 8 }}><strong>Payment Information:</strong> Payment details and billing address.</li>
            </ul>
            <h3 style={{ marginBottom: 10 }}>Information we collect automatically</h3>
            <ul className="text-secondary" style={{ marginLeft: 20 }}>
              <li style={{ marginBottom: 8 }}><strong>Usage Information:</strong> Titles watched, search queries, interactions.</li>
              <li style={{ marginBottom: 8 }}><strong>Device Information:</strong> Hardware model, OS, unique identifiers.</li>
              <li style={{ marginBottom: 8 }}><strong>Location Information:</strong> General location data.</li>
            </ul>
          </Section>

          <Section id="how-we-use" icon="fas fa-cogs" title="How We Use Your Information">
            <p className="text-secondary mb-2">We use the information we collect to:</p>
            <ul className="text-secondary" style={{ marginLeft: 20 }}>
              <li style={{ marginBottom: 8 }}>Providing and delivering the products and services you request</li>
              <li style={{ marginBottom: 8 }}>Processing transactions and sending related information</li>
              <li style={{ marginBottom: 8 }}>Personalizing your experience with recommendations</li>
              <li style={{ marginBottom: 8 }}>Maintaining and improving our services</li>
              <li style={{ marginBottom: 8 }}>Communicating with you about products and offers</li>
            </ul>
          </Section>

          <Section id="info-sharing" icon="fas fa-exchange-alt" title="Information Sharing">
            <p className="text-secondary mb-2">We do not sell your personal information to third parties. We share information only in the following circumstances:</p>
            <ul className="text-secondary" style={{ marginLeft: 20 }}>
              <li style={{ marginBottom: 8 }}><strong>With your consent:</strong> When we have your consent to do so.</li>
              <li style={{ marginBottom: 8 }}><strong>For external processing:</strong> With trusted businesses to process it for us.</li>
              <li style={{ marginBottom: 8 }}><strong>For legal reasons:</strong> To meet applicable law or protect rights.</li>
            </ul>
          </Section>

          <Section id="data-security" icon="fas fa-lock" title="Data Security">
            <p className="text-secondary mb-2">We work hard to protect our users from unauthorized access:</p>
            <ul className="text-secondary" style={{ marginLeft: 20 }}>
              <li style={{ marginBottom: 8 }}>We encrypt many of our services using SSL.</li>
              <li style={{ marginBottom: 8 }}>We review our information collection and storage practices.</li>
              <li style={{ marginBottom: 8 }}>We restrict access to personal information to authorized personnel.</li>
            </ul>
          </Section>

          <Section id="your-rights" icon="fas fa-user-check" title="Your Rights">
            <p className="text-secondary mb-2">You have rights regarding your personal information:</p>
            <ul className="text-secondary" style={{ marginLeft: 20 }}>
              <li style={{ marginBottom: 8 }}><strong>Access:</strong> Request a copy of your information.</li>
              <li style={{ marginBottom: 8 }}><strong>Correction:</strong> Correct inaccurate information.</li>
              <li style={{ marginBottom: 8 }}><strong>Deletion:</strong> Request deletion in certain circumstances.</li>
              <li style={{ marginBottom: 8 }}><strong>Portability:</strong> Receive your data in a machine-readable format.</li>
            </ul>
          </Section>

          <Section id="cookies" icon="fas fa-cookie-bite" title="Cookies & Tracking Technologies">
            <p className="text-secondary mb-2">We use cookies and similar technologies:</p>
            <ul className="text-secondary" style={{ marginLeft: 20 }}>
              <li style={{ marginBottom: 8 }}><strong>Essential cookies:</strong> Required for operation</li>
              <li style={{ marginBottom: 8 }}><strong>Analytical cookies:</strong> Count visitors</li>
              <li style={{ marginBottom: 8 }}><strong>Functionality cookies:</strong> Personalize content</li>
            </ul>
          </Section>

          <Section id="children-privacy" icon="fas fa-child" title="Children's Privacy">
            <p className="text-secondary mb-2">Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13.</p>
          </Section>

          <Section id="changes" icon="fas fa-exclamation-circle" title="Changes to This Policy">
            <p className="text-secondary mb-2">We may change this Privacy Policy from time to time. We will post any changes on this page.</p>
          </Section>
        </div>

        <div className="card text-center">
          <h2 style={{ fontSize: 24, marginBottom: 15 }}>Contact Us</h2>
          <p className="text-secondary" style={{ maxWidth: 600, margin: '0 auto 25px' }}>If you have any questions about this Privacy Policy, please contact us:</p>
          <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: 30 }}>
            <div><div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 20, color: 'var(--accent)', margin: '0 auto 10px' }}><i className="fas fa-envelope"></i></div><h3>Email</h3><p className="text-secondary">privacy@cinestream.com</p></div>
            <div><div style={{ width: 50, height: 50, borderRadius: '50%', background: 'var(--secondary)', display: 'flex', justifyContent: 'center', alignItems: 'center', fontSize: 20, color: 'var(--accent)', margin: '0 auto 10px' }}><i className="fas fa-phone"></i></div><h3>Phone</h3><p className="text-secondary">+1 (555) 123-PRIVACY</p></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ id, icon, title, children }) {
  return (
    <section id={id} className="policy-section" style={{ marginBottom: 40, scrollMarginTop: 100 }}>
      <h2 style={{ fontSize: 24, marginBottom: 15, color: 'var(--accent)', display: 'flex', alignItems: 'center', gap: 10, paddingBottom: 10, borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <i className={icon}></i> {title}
      </h2>
      <div style={{ color: 'var(--text-secondary)', lineHeight: 1.8 }}>{children}</div>
    </section>
  );
}
