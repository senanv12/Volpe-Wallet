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
const MainPage = () => {
  const { t, convertAmount, currentSymbol } = useSettings();
  const { user, cards } = useData();
  const navigate = useNavigate();

  // --- BALANS HESABLAMASI (Cari Balans və VolpeKart üçün eyni məntiq) ---
  const totalCardsBalanceDisplay = useMemo(() => {
    // Yalnız daxil edilmiş kartların balansını toplayırıq
    const totalAZN = Array.isArray(cards) 
      ? cards.reduce((sum, card) => sum + (parseFloat(card.balance) || 0), 0)
      : 0;
    
    // Seçilmiş valyutaya çevirib formatlayırıq
    return convertAmount(totalAZN).toFixed(2);
  }, [cards, convertAmount]);

  return (
    <>
      {/* --- ƏSAS HERO BÖLMƏSİ --- */}
      <main className="main-container">
        
        {/* SOL TƏRƏF (Mətn və Statistika) */}
        <div className="main-content">
           {!user ? (
             /* QONAQ (GUEST) GÖRÜNÜŞÜ */
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
             /* İSTİFADƏÇİ (USER) GÖRÜNÜŞÜ */
             <>
               <div className="badge user-badge">👋 {t('welcome')}</div>
               <h1 className="hero-title">
  {/* Əgər t('greeting_hello') hələ yüklənməyibsə, birbaşa 'Salam' yazsın */}
  {t('greeting_hello') === 'greeting_hello' ? 'Salam' : t('greeting_hello')}, {user.name.split(' ')[0]}! <br />
  
  <span className="highlight-text">
    {t('balance_increasing') === 'balance_increasing' ? 'Balansın artır.' : t('balance_increasing')}
  </span>
</h1>
               <p className="hero-subtitle">{t('balance_desc')}</p>
               
               {/* Statistika Qutusu (VolpeKart ilə Sinxron) */}
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

        {/* SAĞ TƏRƏF (VolpeCard Vizualı) */}
        <div className="hero-visual-section">
            <div className="hero-card-container">
                <VolpeCard 
                    color={user ? "orange" : "blue"} 
                />
            </div>
            {/* Dekorativ Arxa Fon İşığı */}
            <div className="hero-glow"></div>
        </div>
        
      </main>
      
      {/* --- AŞAĞI BÖLMƏLƏR --- */}
      
      {/* Əgər Qonaqdırsa -> Reklam Karuseli */}
      {!user && (
        <div id="features-section">
            <FeaturesSection />
        </div>
      )}

      {/* Əgər İstifadəçidirsə -> Funksional Panellər */}
      {user && (
        <div className="user-dashboard-sections">
          <div id="input-card-section" style={{padding: '40px 0'}}></div>
            <CardsPage />
            <TransactionsPage />
            <CalculatorPage />
            <InputCard />
            
        </div>
      )}
    </>
  );
};

export default MainPage;