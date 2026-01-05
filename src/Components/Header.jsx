import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  MessageCircle, 
  ArrowRightLeft, // Transfer ikonu
  LogOut, 
  X, 
  Bell, 
  Globe, 
  DollarSign, 
  Menu 
} from 'lucide-react';

// Context və API importları
import { useChat } from '../Context/ChatContext'; 
import { useData } from '../Context/DataContext'; 
import { useSettings } from '../Context/SettingsContext'; 
import api from '../api';

// Modal
import TransferModal from './TransferModal'; 

// Assets & CSS
import mainLogo from '../Assets/mainLogo.svg';
import './css/Header.css';

function Header() {
  const navigate = useNavigate();
  const { startChat } = useChat(); 
  const { user } = useData();
  const { language, setLanguage, currency, setCurrency } = useSettings();

  // --- STATE-LƏR ---
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  
  // Transfer Modalı üçün State-lər
  const [isTransferOpen, setIsTransferOpen] = useState(false);
  const [transferTarget, setTransferTarget] = useState(null); // Seçilmiş istifadəçi

  // Mobil Menyu State-i
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const searchRef = useRef(null);

  // --- AXTARIŞ MƏNTİQİ (Debounce ilə) ---
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length > 1) {
        try {
          // Backend-dən istifadəçi axtarışı
          const { data } = await api.get(`/users/search?query=${searchQuery}`);
          setSearchResults(data);
          setShowResults(true);
        } catch (error) {
          console.error("Axtarış xətası:", error);
        }
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 500); // 0.5 saniyə gözləyir

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  // Kənara klikləyəndə axtarışı bağla
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // --- ACTIONS ---
  
  const handleLogout = () => {
    localStorage.removeItem('user');
    window.location.href = '/login';
  };

  const toggleLanguage = () => {
    const langs = ['AZ', 'EN', 'RU'];
    const next = langs[(langs.indexOf(language) + 1) % langs.length];
    setLanguage(next);
  };

  const toggleCurrency = () => {
    const currs = ['AZN', 'USD', 'EUR', 'TRY'];
    const next = currs[(currs.indexOf(currency) + 1) % currs.length];
    setCurrency(next);
  };

  return (
    <>
      <header className="header">
        <div className="header-wrapper">
          
          {/* 1. LOGO */}
          <div className="header-logo" onClick={() => navigate('/')}>
            <img src={mainLogo} alt="Volpe Logo" width="40" />
            <span className="logo-text">Volpe</span>
          </div>

          {/* 2. AXTARIŞ PANELİ */}
          <div className="header-search-container" ref={searchRef}>
            <div className="search-input-wrapper">
              <Search className="search-icon" size={20} />
              <input 
                type="text" 
                placeholder="İstifadəçi axtar..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => searchQuery.length > 1 && setShowResults(true)}
              />
              {searchQuery && (
                <X 
                  className="clear-icon" 
                  size={16} 
                  onClick={() => { setSearchQuery(''); setSearchResults([]); }} 
                />
              )}
            </div>

            {/* AXTARIŞ NƏTİCƏLƏRİ (Dropdown) */}
            {showResults && searchResults.length > 0 && (
              <div className="search-dropdown">
                {searchResults.map(resUser => (
                  <div key={resUser._id} className="search-result-item">
                    
                    {/* Sol tərəf: Profil və Chat üçün kliklənə bilər */}
                    <div className="s-user-info" onClick={() => {
                        startChat(resUser);
                        setShowResults(false);
                    }}>
                        <div className="s-avatar">
                          {resUser.avatar ? <img src={resUser.avatar} alt="avatar" /> : resUser.name[0]}
                        </div>
                        <div className="s-details">
                          <span className="s-name">{resUser.name}</span>
                          <span className="s-username">@{resUser.username}</span>
                        </div>
                    </div>

                    {/* Sağ tərəf: TRANSFER DÜYMƏSİ */}
                    {/* Bu düyməyə basanda Modalı açırıq və useri ötürürük */}
                    <button 
                        className="action-icon-btn transfer-btn"
                        title="Pul köçür"
                        onClick={(e) => {
                            e.stopPropagation(); // Chat açılmasın
                            setTransferTarget(resUser); // <--- Useri seçirik
                            setIsTransferOpen(true);    // <--- Modalı açırıq
                            setShowResults(false);      // <--- Axtarışı bağlayırıq
                        }}
                    >
                        <ArrowRightLeft size={16} />
                    </button>

                  </div>
                ))}
              </div>
            )}
            
            {showResults && searchResults.length === 0 && searchQuery.length > 1 && (
                 <div className="search-dropdown empty">
                    İstifadəçi tapılmadı
                 </div>
            )}
          </div>

          {/* 3. SAĞ MENYU (Düymələr) */}
          <div className="header-actions">
             {/* Dil və Valyuta */}
             <div className="settings-group desktop-only">
                <button className="setting-btn" onClick={toggleLanguage}>
                    <Globe size={18} />
                    <span>{language}</span>
                </button>
                <button className="setting-btn" onClick={toggleCurrency}>
                    <DollarSign size={18} />
                    <span>{currency}</span>
                </button>
             </div>

             <div className="divider-vertical desktop-only"></div>

             {user ? (
               <>
                 {/* Profil */}
                 <div className="user-profile" onClick={() => navigate('/profile')}>
                    <div className="user-avatar-small">
                      {user.avatar ? <img src={user.avatar} alt="me" /> : user.name?.[0]}
                    </div>
                    <span className="user-name-text desktop-only">
                        {user.name.split(' ')[0]}
                    </span>
                 </div>
                 
                 {/* Çıxış */}
                 <button className="icon-btn logout-btn" onClick={handleLogout} title="Çıxış">
                    <LogOut size={20} />
                 </button>
               </>
             ) : (
               <button className="login-btn" onClick={() => navigate('/login')}>Daxil Ol</button>
             )}

             {/* Mobil Menyu İkonu */}
             <button className="icon-btn mobile-menu-btn" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                <Menu size={24} />
             </button>
          </div>
        </div>
      </header>

      {/* --- TRANSFER MODALI --- */}
      {/* Burada recipient prop-una seçilmiş useri göndəririk */}
      <TransferModal 
        isOpen={isTransferOpen} 
        onClose={() => setIsTransferOpen(false)} 
        recipient={transferTarget}
      />
    </>
  );
}

export default Header;