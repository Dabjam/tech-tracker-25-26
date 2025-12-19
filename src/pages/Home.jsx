import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  const isMobile = window.innerWidth < 768;

  const containerStyle = {
    textAlign: 'center',
    padding: isMobile ? '60px 15px' : '100px 20px',
    minHeight: '80vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  };

  const titleStyle = {
    fontSize: isMobile ? '2.5rem' : '4rem',
    fontWeight: '800',
    marginBottom: '20px',
    letterSpacing: '-1px'
  };

  const descriptionStyle = {
    fontSize: isMobile ? '1rem' : '1.25rem',
    color: '#64748b',
    maxWidth: '600px',
    margin: '0 auto 40px',
    lineHeight: '1.6'
  };

  const buttonStyle = {
    padding: isMobile ? '14px 30px' : '18px 45px',
    fontSize: isMobile ? '1rem' : '1.2rem',
    borderRadius: '50px',
    textDecoration: 'none',
    display: 'inline-block'
  };

  return (
    <div style={containerStyle}>
      <h1 style={titleStyle}>
        Tech<span style={{ color: '#2563eb' }}>Tracker</span>
      </h1>
      <p style={descriptionStyle}>
        Ваш личный навигатор в мире IT. Структурируйте обучение, 
        отслеживайте прогресс и храните важные заметки в одном месте.
      </p>
      
      <Link 
        to="/technologies" 
        className="btn btn-primary touch-btn"
        style={buttonStyle}
      >
        Начать обучение
      </Link>
    </div>
  );
}

export default Home;