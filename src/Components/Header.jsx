import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MessageCircle, ArrowRightLeft, LogOut, X, Bell, Globe, DollarSign, Menu } from 'lucide-react';
import { useChat } from '../Context/ChatContext'; 
import { useData } from '../Context/DataContext'; 
import { useSettings } from '../Context/SettingsContext'; 
import api from '../api';
import TransferModal from './TransferModal'; 

import mainLogo from '../Assets/mainLogo.svg';
import './css/Header.css';

function Header() {
  const navigate = useNavigate();
  const { startChat } = useChat(); 
  const { user } = useData();
  const { language, setLanguage, currency, setCurrency, currencyOptions } = useSettings();

  // --- STATE-LƏR ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferTarget, setTransferTarget] = useState(null);
  
  // MOBİL AXTARIŞ STATE-İ
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const searchRef = useRef(null);

  // Dil Dəyişmək
  const toggleLanguage = () => {
    const langs = ['AZ', 'EN', 'RU'];
    const nextIndex = (langs.indexOf(language) + 1) % langs.length;
    setLanguage(langs[nextIndex]);
  };

  // Valyuta Dəyişmək
  const toggleCurrency = () => {
    const currCodes = currencyOptions.map(c => c.code);
    const nextIndex = (currCodes.indexOf(currency) + 1) % currCodes.length;
    setCurrency(currCodes[nextIndex]);
  };

  // Axtarış Funksiyası
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (searchQuery.length > 1) {
        try {
          const { data } = await api.get(`/users/search?query=${searchQuery}`);
          setSearchResults(data);
          setShowResults(true);
        } catch (error) { console.error("Axtarış xətası:", error); }
      } else {
        setSearchResults([]); setShowResults(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const handleMessageClick = (targetUser) => {
    startChat(targetUser);
    setShowResults(false);
    setSearchQuery('');
    setIsMobileSearchOpen(false);
  };

  const openTransferModal = (targetUser) => {
      setTransferTarget(targetUser);
      setIsTransferOpen(true);
      setShowResults(false);
      setSearchQuery('');
      setIsMobileSearchOpen(false);
  };

  return (
    <>
      <header className="header">
        <div className="header-wrapper">
          
          {/* 1. LOGO */}
          <div className="header-logo" onClick={() => navigate('/')}>
            <img src={mainLogo} alt="Volpe" width={40} />
            <span className="logo-text">Volpe</span>
          </div>

          {/* 2. AXTARIŞ (DESKTOP & TABLET > 768px) */}
          <div className={`header-search-container ${isMobileSearchOpen ? 'mobile-visible' : ''}`} ref={searchRef}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="İstifadəçi axtar..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setShowResults(true)}
              />
              {/* Mobil üçün bağlama düyməsi */}
              {isMobileSearchOpen && (
                 <X size={20} className="close-mobile-search" onClick={() => setIsMobileSearchOpen(false)} />
              )}
              {/* Desktop üçün təmizləmə düyməsi */}
              {!isMobileSearchOpen && searchQuery && (
                 <X size={16} className="clear-search" onClick={() => { setSearchQuery(''); setShowResults(false); }} />
              )}
            </div>

            {showResults && (
              <div className="search-results-dropdown">
                {searchResults.length === 0 ? (
                  <div className="no-results">Nəticə tapılmadı</div>
                ) : (
                  searchResults.map(u => (
                    <div key={u._id} className="search-result-item">
                      <div className="result-user-info">
                        <div className="result-avatar">
                          {u.avatar ? <img src={u.avatar} alt="av" /> : (u.name?.[0] || 'U')}
                        </div>
                        <div className="result-details">
                          <span className="result-name">{u.name}</span>
                          <span className="result-username">@{u.username}</span>
                        </div>
                      </div>
                      <div className="result-actions">
                          <button className="result-action-btn" onClick={() => handleMessageClick(u)}>
                              <MessageCircle size={18} />
                          </button>
                          <button className="result-action-btn transfer" onClick={() => openTransferModal(u)}>
                              <ArrowRightLeft size={18} />
                          </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* 3. SAĞ TƏRƏF */}
          <div className="header-actions">
              {/* MOBİL AXTARIŞ İKONU (Yalnız < 769px görünür) */}
              <button className="icon-btn mobile-search-trigger" onClick={() => setIsMobileSearchOpen(!isMobileSearchOpen)}>
                <Search size={22} />
              </button>

              <div className="settings-group">
                <button className="setting-btn" onClick={toggleLanguage}>
                    <Globe size={20} />
                    <span>{language}</span>
                </button>
                <button className="setting-btn" onClick={toggleCurrency}>
                    <DollarSign size={20} />
                    <span>{currency}</span>
                </button>
             </div>

             <div className="divider-vertical"></div>

             {user ? (
               <>
                 <div className="user-profile" onClick={() => navigate('/profile')}>
                    <div className="user-avatar-small">
                      {user.avatar ? <img src={user.avatar} alt="me" /> : user.name?.[0]}
                    </div>
                    {/* Mobildə adı gizlədirik */}
                    <span className="user-name-text">{user.name.split(' ')[0]}</span>
                 </div>
                 
                 <button className="icon-btn logout-btn" onClick={handleLogout} title="Çıxış">
                    <LogOut size={22} />
                 </button>
               </>
             ) : (
               <button className="login-btn" onClick={() => navigate('/login')}>Daxil Ol</button>
             )}
          </div>
        </div>
      </header>

      <TransferModal 
        isOpen={isTransferOpen} 
        onClose={() => setIsTransferOpen(false)} 
        recipient={transferTarget}
      />
    </>
  );
}

export default Header;