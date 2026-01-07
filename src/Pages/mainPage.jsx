import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSettings } from '../Context/SettingsContext';
import { useData } from '../Context/DataContext';

// CSS
import './css/MainPage.css';

// Komponentlər
import FeaturesSection from '../Components/FeaturesSection';
import CardsPage from '../Components/CardsPage';
import TransactionsPage from '../Components/TransactionsPage';
import CalculatorPage from '../Components/CalculatorPage';
import VolpeCard from '../Components/VolpeCard';
import InputCard from '../Components/InputCard';
import Footer from '../Components/Footer';
const MainPage = () => {
  const { t, convertAmount, currentSymbol } = useSettings();
  const { user, cards } = useData();
  const navigate = useNavigate();


  const totalCardsBalanceDisplay = useMemo(() => {

    const totalAZN = Array.isArray(cards) 
      ? cards.reduce((sum, card) => sum + (parseFloat(card.balance) || 0), 0)
      : 0;
    
    
    return convertAmount(totalAZN).toFixed(2);
  }, [cards, convertAmount]);

  return (
    <>
  
      <main className="main-container">
        
     
        <div className="main-content">
           {!user ? (
            
             <>
               <div className="badge">✨ {t('hero_badge')}</div>
               <h1 className="hero-title">
                 {t('hero_title_1')} <br />
                 <span className="highlight-text">{t('hero_title_2')}</span>
               </h1>
               <p className="hero-subtitle">{t('hero_subtitle')}</p>
               <div className="hero-actions">
                 <button className="btn-primary" onClick={() => navigate('/signup')}>
                    {t('btn_start')}
                 </button>
                 <button className="btn-secondary" onClick={() => {
                    document.getElementById('features-section').scrollIntoView({ behavior: 'smooth' });
                 }}>
                    {t('btn_more')}
                 </button>
               </div>
             </>
           ) : (
            
             <>
               <div className="badge user-badge">👋 {t('welcome')}</div>
               <h1 className="hero-title">

  {t('greeting_hello') === 'greeting_hello' ? 'Salam' : t('greeting_hello')}, {user.name.split(' ')[0]}! <br />
  
  <span className="highlight-text">
    {t('balance_increasing') === 'balance_increasing' ? 'Balansın artır.' : t('balance_increasing')}
  </span>
</h1>
               <p className="hero-subtitle">{t('balance_desc')}</p>
               
        
               <div className="hero-stats">
                  <div className="stat-item">
                      <h3 style={{fontSize:'24px'}}>
                        {totalCardsBalanceDisplay} {currentSymbol}
                      </h3>
                      <p>{t('current_balance')}</p>
                  </div>
                  <div className="divider"></div>
                  <div className="stat-item">
                      <h3 style={{color:'#2dd4bf'}}>{t('active')}</h3>
                      <p>{t('status')}</p>
                  </div>
               </div>
             </>
           )}
        </div>


        <div className="hero-visual-section">
            <div className="hero-card-container">
                <VolpeCard 
                    color={user ? "orange" : "blue"} 
                />
            </div>
    
            <div className="hero-glow"></div>
        </div>
        
      </main>
      

      

      {!user && (
        <div id="features-section">
            <FeaturesSection />
        </div>
      )}


      {user && (
        <div className="user-dashboard-sections">
          <div id="input-card-section" style={{padding: '40px 0'}}></div>
            <CardsPage />
            <TransactionsPage />
            <CalculatorPage />
            <InputCard />
            <Footer />
            
        </div>
      )}
    </>
  );
};

export default MainPage;