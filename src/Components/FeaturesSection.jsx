import React, { useState, useEffect } from 'react';
import './css/FeaturesSection.css';

const featuresData = [
  { id: 1, title: 'Təhlükəsizlik', desc: 'Bank səviyyəsində qoruma', icon: '🛡️', color: '#00C48C' },
  { id: 2, title: 'Sürətli', desc: 'Ani köçürmələr', icon: '⚡', color: '#FF9F43' },
  { id: 3, title: 'Analitika', desc: 'Xərclərə nəzarət', icon: '📊', color: '#54A0FF' },
  { id: 4, title: 'Rahatlıq', desc: 'Hər yerdə ödəniş', icon: '💳', color: '#D980FA' },
  { id: 5, title: 'Dəstək', desc: '24/7 Xidmət', icon: '🎧', color: '#1dd1a1' },
];

const FeaturesSection = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  // Autoplay məntiqi
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % featuresData.length);
    }, 2500); // 2.5 saniyədən bir dəyişir
    return () => clearInterval(interval);
  }, []);

  const getCardStyle = (index) => {
    // Karta görə mövqe hesablamaq (Circular Carousel)
    const diff = (index - activeIndex + featuresData.length) % featuresData.length;
    
    let transform = '';
    let opacity = 0;
    let zIndex = 0;

    if (diff === 0) { // Aktiv kart
      transform = 'translateX(0) scale(1.1)';
      opacity = 1;
      zIndex = 10;
    } else if (diff === 1 || diff === -4) { // Sağdakı
      transform = 'translateX(120%) scale(0.9) rotateY(-15deg)';
      opacity = 0.6;
      zIndex = 5;
    } else if (diff === featuresData.length - 1) { // Soldakı
      transform = 'translateX(-120%) scale(0.9) rotateY(15deg)';
      opacity = 0.6;
      zIndex = 5;
    } else { // Arxadakılar
      transform = 'translateX(0) scale(0.8) translateZ(-100px)';
      opacity = 0;
      zIndex = 0;
    }

    return { transform, opacity, zIndex };
  };

  return (
    <section className="features-carousel-section">
      <div className="carousel-header">
        <h2>Niyə Bizi Seçməlisiniz?</h2>
        <p>Maliyyənizi idarə etməyin ən müasir yolu</p>
      </div>

      <div className="carousel-container">
        <div className="carousel-track">
          {featuresData.map((feature, index) => {
            const style = getCardStyle(index);
            return (
              <div 
                key={feature.id} 
                className={`carousel-card ${index === activeIndex ? 'active' : ''}`}
                style={style}
                onClick={() => setActiveIndex(index)}
              >
                <div className="f-icon" style={{background: feature.color}}>{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.desc}</p>
                <div className="card-shine"></div>
              </div>
            );
          })}
        </div>
        
        {/* Dots */}
        <div className="carousel-dots">
            {featuresData.map((_, idx) => (
                <span 
                    key={idx} 
                    className={idx === activeIndex ? 'active' : ''}
                    onClick={() => setActiveIndex(idx)}
                ></span>
            ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;