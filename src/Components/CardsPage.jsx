import React, { useState } from 'react';
import { useData } from '../Context/DataContext';
import { useSettings } from '../Context/SettingsContext';
import { LeoCard, KapitalCard, AbbCard, DefaultCard } from './CreditCards';
import TiltedCard from './TiltedCard';
import './css/CardsPage.css';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const CardsPage = () => {
  const { cards, user } = useData();
  const { currentSymbol, convertAmount } = useSettings();
  const navigate = useNavigate();
  
  const [flippedCards, setFlippedCards] = useState({});
  const [visibleCvv, setVisibleCvv] = useState({});

  const handleCardClick = (id) => {
    setFlippedCards(prev => ({ ...prev, [id]: !prev[id] }));
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
    } else {
        alert("Yanlış şifrə");
    }
  };

  const renderCard = (card) => {
    const props = {
        cardData: card,
        isFlipped: flippedCards[card._id],
        onClick: () => handleCardClick(card._id),
        showCvv: visibleCvv[card._id],
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
        // SPATIAL SHOWCASE ITEM
        <div className="spatial-card-frame">
            {/* Arxa fondakı Spotlight effekti */}
            <div className="spatial-spotlight"></div>
            
            <div className="spatial-content">
                {/* 3D KART KOMPONENTİ */}
                <TiltedCard rotateAmplitude={8} scaleOnHover={1.05} className="card-3d-container">
                    {CardComponent}
                </TiltedCard>
                
                {/* Məlumat Hissəsi */}
                <div className="spatial-info">
                    <div className="spatial-balance-box">
                        <span className="spatial-label">Balans</span>
                        <span className="spatial-amount">
                            {currentSymbol}{convertAmount(card.balance).toFixed(2)}
                        </span>
                    </div>
                    <div className="spatial-meta">
                        <span className="spatial-type">{card.cardType.toUpperCase()}</span>
                        <span className="spatial-status">Aktiv</span>
                    </div>
                </div>
            </div>
        </div>
    );
  };

  if (!user) return null;

  return (
    <section className="cards-page" id="cards-section">
      <div className="cards-container">
        
        {/* Header */}
        <div className="spatial-header">
            <div>
                <h2 className="spatial-title">Kartlarım</h2>
                <p className="spatial-subtitle">Bütün aktiv kartlarınız və balanslarınız.</p>
            </div>
            {/* Yeni Kart Əlavə Et Düyməsi (Opsional) */}
            {/* <button className="spatial-add-btn" onClick={() => document.getElementById('input-card-section').scrollIntoView({behavior:'smooth'})}>
                <Plus size={20} />
                <span>Yeni Kart</span>
            </button> */}
        </div>
        
        {/* Grid */}
        <div className="spatial-grid">
           {cards.length > 0 ? (
               cards.map(card => (
                 <React.Fragment key={card._id}>
                   {renderCard(card)}
                 </React.Fragment>
               ))
           ) : (
               <div className="empty-spatial">
                   <p>Hələ heç bir kartınız yoxdur.</p>
               </div>
           )}
        </div>

      </div>
    </section>
  );
};

export default CardsPage;