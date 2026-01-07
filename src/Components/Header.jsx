import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, Globe, Banknote, DollarSign, TurkishLira, 
  Euro, PoundSterling, Send, MessageSquare 
} from 'lucide-react';
import { useData } from '../Context/DataContext'; 
import { useSettings } from '../Context/SettingsContext'; 
import TransferModal from './TransferModal'; 
import ChatModal from './ChatModal';
import './css/Header.css';

function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useData();
  const { language, setLanguage, currency, setCurrency } = useSettings(); 

  // Modallar üçün state-lər
  const [isTransferModalOpen, setIsTransferModalOpen] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);

  // Valyuta və İkon konfiqurasiyası
  const currencyConfigs = {
    'AZN': { icon: <Banknote size={18} /> },
    'TRY': { icon: <TurkishLira size={18} /> },
    'USD': { icon: <DollarSign size={18} /> },
    'GBP': { icon: <PoundSterling size={18} /> },
    'EUR': { icon: <Euro size={18} /> },
    'RUB': { icon: <Banknote size={18} /> }
  };

  const currencyList = Object.keys(currencyConfigs);

  const handleCurrencyChange = () => {
    const currentIndex = currencyList.indexOf(currency);
    const nextIndex = (currentIndex + 1) % currencyList.length;
    setCurrency(currencyList[nextIndex]);
  };

  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-wrapper">
        
        {/* Logo Bölməsi */}
        <div className="header-logo" onClick={() => navigate('/dashboard')}>
            <div className="volpe-logo-box">
               <img src="/assets/icon.png" alt="Volpe Icon" className="volpe-brand-img" />
            </div>
            <span className="volpe-logo-text">VOLPE</span>
        </div>

        {/* Sağ Tərəf: Aksiyalar (Axtarış bölməsi silindi) */}
        <div className="header-actions">
            
            {/* PUL GÖNDƏR DÜYMƏSİ */}
            <button className="btn-send-money" onClick={() => setIsTransferModalOpen(true)}>
               <Send size={18} /> 
               <span className="hide-on-tablet">Pul Göndər</span>
            </button>

            {/* ÇAT DÜYMƏSİ */}
            <button className="btn-glass" onClick={() => setIsChatOpen(true)} title="Mesajlar">
               <MessageSquare size={18} />
            </button>

            {/* DİL SEÇİMİ */}
            <button className="btn-glass" onClick={() => setLanguage(language === 'AZ' ? 'EN' : 'AZ')}>
               <Globe size={18} /> <span>{language}</span>
            </button>
            
            {/* VALYUTA SEÇİMİ */}
            <button className="btn-glass" onClick={handleCurrencyChange}>
               {currencyConfigs[currency]?.icon || <DollarSign size={18} />} 
               <span>{currency}</span>
            </button>

            <div className="divider-vertical"></div>
            
            {/* İSTİFADƏÇİ PANELİ */}
            {user ? (
              <div className="header-user-area">
                 <div className="user-profile-btn" onClick={() => navigate('/profile')}>
                     <div className="user-avatar-small">
                         {user.avatar ? <img src={user.avatar} alt="me" /> : (user.name ? user.name[0] : 'U')}
                     </div>
                     <span className="user-name-text hide-on-mobile">{user.name.split(' ')[0]}</span>
                 </div>
                 
                 <button className="logout-icon-btn" onClick={handleLogout} title="Çıxış">
                    <LogOut size={20} />
                 </button>
              </div>
            ) : (
              <button className="login-btn" onClick={() => navigate('/login')}>Daxil Ol</button>
            )}
        </div>
      </div>

      {/* MODALLAR */}
      <TransferModal 
        isOpen={isTransferModalOpen} 
        onClose={() => setIsTransferModalOpen(false)} 
      />

      <ChatModal 
        isOpen={isChatOpen} 
        onClose={() => setIsChatOpen(false)} 
      />

    </header>
  );
}

export default Header;