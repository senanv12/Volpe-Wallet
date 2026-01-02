import React from 'react';
import { useSettings } from '../Context/SettingsContext';
import { useData } from '../Context/DataContext'; 
import './css/VolpeCard.css';

const FoxIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="40" height="40">
    <path d="M4.22 10.78C5.66 11.23 6.94 11.05 7.96 10.45C9.33 9.64 10.05 8.1 10.39 6.64C10.63 5.6 10.46 4.49 10.46 4.49C10.46 4.49 11.66 5.86 11.83 6.91C12 8.08 11.53 9.47 12.87 10.5C14.07 11.41 15.65 11.23 16.89 10.78C18.42 10.23 19.46 9.07 19.46 9.07C19.46 9.07 19.26 13.06 17.06 15.86C14.86 18.66 11.36 19.06 7.86 18.66 5.66 15.86C3.46 13.06 3.26 9.07 3.26 9.07C3.26 9.07 4.3 10.23 4.22 10.78Z" />
  </svg>
);

const VolpeCard = ({ color = 'orange' }) => {
  const { convertAmount, currentSymbol, t } = useSettings();
  const { cards, user } = useData(); 

  // --- DƏYİŞİKLİK BURADADIR ---
  // Artıq user.walletBalance-i (sistem tərəfindən verilən 100 AZN) nəzərə almırıq.
  // Yalnız "cards" massivindəki real bank kartlarının balansını toplayırıq.
  const totalCardsBalanceInAZN = Array.isArray(cards) 
    ? cards.reduce((sum, card) => sum + (parseFloat(card.balance) || 0), 0)
    : 0;

  // Çevrilmiş balans
  const displayBalance = convertAmount(totalCardsBalanceInAZN).toFixed(2);

  const themes = {
    orange: 'linear-gradient(135deg, #e65c00, #F9D423)',
    blue: 'linear-gradient(135deg, #00c6ff, #0072ff)',
    black: 'linear-gradient(135deg, #434343, #000000)',
    green: 'linear-gradient(135deg, #11998e, #38ef7d)',
    purple: 'linear-gradient(135deg, #8E2DE2, #4A00E0)'
  };

  return (
    <div className="volpe-card" style={{ background: themes[color] || themes.orange }}>
      <div className="volpe-watermark"><FoxIcon /></div>

      <div className="volpe-header">
         <div className="volpe-logo">
           <FoxIcon />
           <span>Volpe</span>
         </div>
         <span style={{ opacity: 0.8, fontSize: '14px' }}>Bank Aggregator</span>
      </div>

      <div className="volpe-body">
         <div className="volpe-balance">
            <span className="label">{t('stat_balance') || 'Kartların Cəmi'}</span>
            <h2>{displayBalance} {currentSymbol}</h2>
         </div>
      </div>

      <div className="volpe-footer">
         <div className="volpe-holder">
            {user ? user.name.toUpperCase() : "GUEST"}
         </div>
         <div className="volpe-expiry">
             <span style={{ fontSize: '10px', display: 'block', opacity: 0.7 }}>
               {t('card_expires') || 'BİTMƏ TARİXİ'}
             </span>
             12/30
         </div>
      </div>
    </div>
  );
};

export default VolpeCard;