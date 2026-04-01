import React from 'react';

const Home = () => {
  return (
    <section className="hero" style={{ padding: '8rem 0', textAlign: 'center' }}>
      <div className="container">
        <h1 style={{ fontSize: '4rem', marginBottom: '1.5rem', background: 'linear-gradient(to right, var(--primary), var(--secondary))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          Welcome to Your New Project
        </h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto 3rem auto' }}>
          Đây là cấu trúc thư mục React cơ bản dành cho người mới bắt đầu. 
          Mọi thứ đã được thiết lập sẵn sàng để bạn phát triển ý tưởng của mình.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button className="btn-primary" style={{ padding: '1rem 2rem' }}>Get Started</button>
          <button style={{ padding: '1rem 2rem', color: 'var(--text-main)', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', fontWeight: '600' }}>
            Learn More
          </button>
        </div>
      </div>
    </section>
  );
};

export default Home;
