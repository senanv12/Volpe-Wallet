import React, { useState } from 'react';
import { useData } from '../Context/DataContext';
import { useSettings } from '../Context/SettingsContext';
import { LeoCard, KapitalCard, AbbCard, DefaultCard } from './CreditCards';
import TiltedCard from './TiltedCard';
import './CardsPage.css';

const CardsPage = () => {
  const { cards, user } = useData();
  const { currentSymbol, convertAmount } = useSettings();
  
  const [flippedCards, setFlippedCards] = useState({});
  const [visibleCvv, setVisibleCvv] = useState({});

  const handleCardClick = (id) => {
    // Karta klikləyəndə flip vəziyyətini dəyişirik
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
    
    // Əgər kartı bağlayırıqsa, CVV-ni də gizlədək
    if (flippedCards[id]) {
        setVisibleCvv(prev => ({ ...prev, [id]: false }));
    }
  };

  const handleCvvClick = (e, cardId) => {
    e.stopPropagation();
    if (visibleCvv[cardId]) return;

    const password = prompt("Təhlükəsizlik: Şifrənizi daxil edin (Demo: 12345):");
    if (password === '12345') {
        setVisibleCvv(prev => ({ ...prev, [cardId]: true }));
    } else if (password !== null) {
        alert("Yanlış şifrə!");
    }
  };

  const renderCard = (card) => {
    const isFlipped = flippedCards[card._id];
    const showCvv = visibleCvv[card._id];
    
    const props = { 
        cardData: card, 
        isFlipped, 
        onClick: () => handleCardClick(card._id), 
        showCvv: showCvv,
        onCvvClick: (e) => handleCvvClick(e, card._id)
    };

    let CardComponent;
    const type = (card.cardType || 'default').toLowerCase();

    switch (type) {
      case 'leobank': CardComponent = <LeoCard {...props} />; break;
      case 'kapital': CardComponent = <KapitalCard {...props} />; break;
      case 'abb': CardComponent = <AbbCard {...props} />; break;
      default: CardComponent = <DefaultCard {...props} />; break;
    }

    return (
        <div className="card-wrapper-item">
            {/* card-3d-container sinfi CSS-də ölçüləri təyin edir */}
            <TiltedCard rotateAmplitude={8} scaleOnHover={1.1} className="card-3d-container">
                {CardComponent}
            </TiltedCard>
            
            <p className="card-balance-text">
                Balans: {currentSymbol}{convertAmount(card.balance).toFixed(2)}
            </p>
        </div>
    );
  };

  if (!user || cards.length === 0) return null;

  return (
    <section className="cards-page" id="cards-section">
      <div className="cards-container">
        <div className="cards-header">
            <h2 className="cards-title">Kartlarım</h2>
        </div>
        
        <div className="real-cards-grid">
           {cards.map(card => (
               // Key kimi unikal ID istifadə olunur
               <div key={card._id}>
                   {renderCard(card)}
               </div>
           ))}
        </div>
      </div>
    </section>
  );
};

export default CardsPage;