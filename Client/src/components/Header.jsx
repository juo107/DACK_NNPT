import React from 'react';

const Header = () => {
  return (
    <header className="header" style={{ padding: '2rem 0', borderBottom: '1px solid var(--border)' }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="logo" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--primary)' }}>
          NNPTUD <span style={{ color: 'var(--text-main)' }}>Client</span>
        </div>
        <nav>
          <ul style={{ display: 'flex', gap: '2rem' }}>
            <li><a href="/" style={{ fontWeight: '500' }}>Home</a></li>
            <li><a href="/products" style={{ color: 'var(--text-muted)' }}>Products</a></li>
            <li><a href="/about" style={{ color: 'var(--text-muted)' }}>About</a></li>
          </ul>
        </nav>
        <button className="btn-primary">Sign In</button>
      </div>
    </header>
  );
};

export default Header;
