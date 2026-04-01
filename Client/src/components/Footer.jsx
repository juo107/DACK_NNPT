import React from 'react';

const Footer = () => {
  return (
    <footer className="footer" style={{ padding: '4rem 0', backgroundColor: 'var(--surface)', marginTop: '5rem' }}>
      <div className="container" style={{ textAlign: 'center' }}>
        <p style={{ color: 'var(--text-muted)' }}>&copy; 2026 NNPTUD - Built with React & Vite.</p>
      </div>
    </footer>
  );
};

export default Footer;
