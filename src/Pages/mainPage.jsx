import React, { useState, useEffect, useMemo } from 'react';
import './MainPage.css';
import FeaturesSection from '../Components/FeaturesSection';
import CardsPage from '../Components/CardsPage';
import TransactionsPage from '../Components/TransactionsPage';
import CalculatorPage from '../Components/CalculatorPage';
import { useNavigate } from 'react-router-dom';
import InputCard from '../Components/InputCard';
import { useSettings } from '../Context/SettingsContext';
import { useData } from '../Context/DataContext';
import VolpeCard from '../Components/VolpeCard';
// Yeni İkonlar əlavə etdik
import { 
  Activity, Zap, Wifi, CreditCard, Smartphone, 
  ArrowRightLeft, RefreshCw 
} from 'lucide-react';

const MainPage = () => {
  const navigate = useNavigate();
  const [isHovering, setIsHovering] = useState(false);
  
  const { currentSymbol, convertAmount, t } = useSettings();
  const { user, cards: userCards, transactions } = useData();

  const [displayCards, setDisplayCards] = useState([]);

  // --- VALYUTA KONVERTER STATE-LƏRİ ---
  const [convAmount, setConvAmount] = useState(1);
  const [convFrom, setConvFrom] = useState('USD');
  const [convTo, setConvTo] = useState('AZN');
  const [convResult, setConvResult] = useState(0);

  // Sadə Məzənnələr (Real API yoxdursa)
  const rates = {
    USD: 1,
    AZN: 1.70,
    EUR: 0.92,
    TRY: 32.5
  };

  // Konvertasiya Hesablaması
  useEffect(() => {
    const baseAmount = convAmount / rates[convFrom];
    const finalAmount = baseAmount * rates[convTo];
    setConvResult(finalAmount.toFixed(2));
  }, [convAmount, convFrom, convTo]);


  // --- ŞABLON KARTLAR (Qonaq üçün) ---
  const guestCards = [
    { id: 'm1', type: 'Platinum', number: '3782 8224 6310 005#', holder: 'VOLPE USER', expiry: '03/28', cls: 'gold-card' },
    { id: 'm2', type: 'Titanium', number: '**** **** **** 4291', holder: 'VOLPE USER', expiry: '12/26', cls: 'teal-card' },
    { id: 'm3', type: 'Infinite', number: '**** **** **** 8821', holder: 'VOLPE USER', expiry: '09/27', cls: 'purple-card' }
  ];

  // --- YENİ ŞABLON ƏMƏLİYYATLAR (Komunal, Kart və s.) ---
  const dummyTransactions = [
    { _id: 'd1', type: 'utility', description: 'Azərişıq ASC', category: 'Komunal', amount: 15.40, createdAt: new Date().toISOString() },
    { _id: 'd2', type: 'transfer', description: 'Card to Card', category: 'Köçürmə', amount: 50.00, createdAt: new Date(Date.now() - 3600000).toISOString() },
    { _id: 'd3', type: 'internet', description: 'KATV1 Fiber', category: 'İnternet', amount: 18.00, createdAt: new Date(Date.now() - 86400000).toISOString() },
    { _id: 'd4', type: 'mobile', description: 'Azercell', category: 'Mobil', amount: 10.00, createdAt: new Date(Date.now() - 172800000).toISOString() },
  ];

  // --- İKON SEÇİMİ ---
  const getIconByType = (type) => {
    switch(type) {
      case 'utility': return <Zap size={18} color="#f59e0b" />; // Sarı İşıq
      case 'internet': return <Wifi size={18} color="#3b82f6" />; // Göy Wifi
      case 'mobile': return <Smartphone size={18} color="#a855f7" />; // Bənövşəyi Tel
      case 'transfer': return <CreditCard size={18} color="#2dd4bf" />; // Yaşıl Kart
      default: return <Activity size={18} color="#94a3b8" />;
    }
  };

  const totalBalance = useMemo(() => {
    if (!user) return 0;
    const cardsTotal = Array.isArray(userCards) 
        ? userCards.reduce((acc, card) => acc + (Number(card.balance) || 0), 0) 
        : 0;
    return (user.walletBalance || 0) + cardsTotal;
  }, [userCards, user]);

  // Əgər real transaction yoxdursa, şablonları göstər
  const recentActivity = (transactions && transactions.length > 0) 
                         ? transactions.slice(0, 4) 
                         : dummyTransactions;

  useEffect(() => {
    if (!user) {
        setDisplayCards(guestCards);
    }
  }, [user]);

  const swapCards = () => {
    setDisplayCards((prevCards) => {
      if (prevCards.length === 0) return [];
      const newCards = [...prevCards];
      const firstCard = newCards.shift();
      newCards.push(firstCard);
      return newCards;
    });
  };

  useEffect(() => {
    let interval;
    if (!user && !isHovering && displayCards.length > 0) {
      interval = setInterval(() => {
        swapCards();
      }, 3500);
    }
    return () => clearInterval(interval);
  }, [isHovering, displayCards, user]);

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) element.scrollIntoView({ behavior: 'smooth' });
  };

  const firstName = user?.name ? user.name.split(' ')[0] : 'İstifadəçi';

  return (
    <>
      <main className="main-container">
        
        {/* --- SOL TƏRƏF --- */}
        <div className="main-content">
          {user ? (
            <div className="dashboard-hero fade-in-up">
              <div className="badge success-badge">
                <span className="badge-icon">●</span> Online
              </div>
              <h1 className="hero-title">
                Xoş Gəldin, <br />
                <span className="highlight-text">{firstName}!</span> 👋
              </h1>

              <div className="hero-balance-wrapper">
                 <p className="balance-label-top">Sizin Volpe Hesabınız</p>
                 <div style={{ transform: 'scale(0.95)', transformOrigin: 'top left' }}>
                    <VolpeCard 
                        user={user} 
                        color="orange" 
                        balance={`${currentSymbol}${convertAmount(totalBalance).toFixed(2)}`} 
                    />
                 </div>
                 <div className="balance-actions" style={{marginTop:'20px'}}>
                   <button className="action-btn" onClick={() => scrollToSection('input-card-section')}>+ Kart Əlavə Et</button>
                   <button className="action-btn outline" onClick={() => scrollToSection('transactions-section')}>📊 Hesabat</button>
                </div>
              </div>
            </div>
          ) : (
            <div className="guest-hero fade-in-up">
              <div className="badge"><span className="badge-icon">✨</span>{t('hero_badge')}</div>
              <h1 className="hero-title">{t('hero_title_1')} <br /><span className="highlight-text">{t('hero_title_2')}</span></h1>
              <p className="hero-subtitle">{t('hero_subtitle')}</p>
              <div className="button-group">
                <button className="btn-primary" onClick={() => navigate('/signup')}>{t('btn_start')} →</button>
                <button className="btn-secondary" onClick={() => scrollToSection('features-section')}>{t('btn_more')}</button>
              </div>
              <div className="stats-container">
                <div className="stat-item"><h3>{currentSymbol}{convertAmount(24500).toFixed(0)}</h3><p>{t('stat_balance')}</p></div>
                <div className="stat-item"><h3>10k+</h3><p>İstifadəçi</p></div>
              </div>
            </div>
          )}
        </div>

        {/* --- SAĞ TƏRƏF (YENİ PANELLƏR) --- */}
        <div className="right-panel-content">
            {user ? (
                <div className="right-panels-wrapper">
                    
                   
                    {/* 2. SON ƏMƏLİYYATLAR (KART/KOMUNAL) */}
                    <div className="recent-activity-card fade-in-up" style={{animationDelay: '0.1s'}}>
                        <div className="recent-header">
                            <div style={{display:'flex', alignItems:'center', gap:'10px'}}>
                                <div className="icon-box"><Activity size={18} color="#2dd4bf"/></div>
                                <h3>Son Əməliyyatlar</h3>
                            </div>
                            <button className="view-all" onClick={() => scrollToSection('transactions-section')}>Hamsı</button>
                        </div>

                        <div className="recent-list">
                            {recentActivity.map((trx, index) => (
                                <div key={trx._id || index} className="recent-item">
                                    <div className="recent-icon-bg">
                                        {getIconByType(trx.type || 'transfer')}
                                    </div>
                                    <div className="recent-info">
                                        <h4>{trx.description || trx.category}</h4>
                                        <span>{trx.category}</span>
                                    </div>
                                    <div className="recent-amount exp-text">
                                        -{currentSymbol}{convertAmount(trx.amount).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            ) : (
                /* QONAQ ANİMASİYASI */
                <div 
                  className="cards-visual" 
                  onClick={swapCards}
                  onMouseEnter={() => setIsHovering(true)} 
                  onMouseLeave={() => setIsHovering(false)} 
                >
                  {displayCards.map((card, index) => (
                    <div key={card.id} className={`card ${card.cls} card-pos-${index}`}>
                      <div className="card-shine"></div>
                      <div className="card-top"><span className="chip-icon"></span><span className="nfc-icon"></span></div>
                      <div className="card-mid"><div className="card-type">{card.type}</div></div>
                      <div className="card-number">{card.number}</div>
                      <div className="card-footer">
                        <div><span>{t('card_holder')}</span><p>{card.holder}</p></div>
                        <div><span>{t('card_expires')}</span><p>{card.expiry}</p></div>
                        <div className="visa-logo">VISA</div>
                      </div>
                    </div>
                  ))}
                </div>
            )}
        </div>
        
        <div className="scroll-indicator">
          <div className="mouse"><div className="wheel"></div></div>
        </div>
      </main>
      
      {!user && <div id="features-section"><FeaturesSection /></div>}

      <CardsPage />
      <TransactionsPage />
      <CalculatorPage />
      <InputCard />
    </>
  );
};

export default MainPage;