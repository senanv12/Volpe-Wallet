import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, LogOut, X, ArrowRight, Globe, DollarSign } from 'lucide-react';
import { useData } from '../Context/DataContext'; 
import { useSettings } from '../Context/SettingsContext'; 
import api from '../api';
import './css/Header.css';

function Header() {
  const navigate = useNavigate();
  const { user, setUser } = useData();
  const { language, setLanguage, currency, setCurrency } = useSettings(); 

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  
  const searchRef = useRef(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.length >= 2) {
        try {
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
    }, 300);
    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  const handleLogout = (e) => {
    e.stopPropagation();
    localStorage.removeItem('user');
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="header">
      <div className="header-wrapper">
        

        <div className={`header-logo ${isMobileSearchOpen ? 'hide-on-mobile' : ''}`} onClick={() => navigate('/dashboard')}>
           <div className="volpe-logo-box">
              <img src="/assets/icon.png" alt="Volpe Icon" className="volpe-brand-img" />
           </div>
           <span className="volpe-logo-text">VOLPE</span>
        </div>


        {!isMobileSearchOpen && (
          <button className="mobile-search-trigger" onClick={() => setIsMobileSearchOpen(true)}>
            <Search size={22} />
          </button>
        )}


        <div className={`header-search ${isMobileSearchOpen ? 'mobile-active' : ''}`} ref={searchRef}>
           <div className="search-input-wrapper">
             <Search className="search-icon" size={18} />
             <input 
               type="text" 
               placeholder="İstifadəçi axtar..." 
               value={searchQuery}
               onChange={(e) => setSearchQuery(e.target.value)}
               autoFocus={isMobileSearchOpen}
             />
             {(searchQuery || isMobileSearchOpen) && (
               <X className="clear-search" size={16} onClick={() => { setSearchQuery(''); setIsMobileSearchOpen(false); }} />
             )}
           </div>

           {showResults && searchResults.length > 0 && (
             <div className="search-dropdown">
               {searchResults.map((u) => (
                 <div key={u._id} className="search-result-item" onClick={() => { navigate(`/profile/${u.username}`); setShowResults(false); }}>
                    <div className="s-avatar">
                        {u.avatar ? <img src={u.avatar} alt="av" /> : (u.name ? u.name[0] : 'U')}
                    </div>
                    <div className="s-info">
                      <span className="s-name">{u.name}</span>
                      <span className="s-username">@{u.username}</span>
                    </div>
                    <ArrowRight size={16} color="#2dd4bf" />
                 </div>
               ))}
             </div>
           )}
        </div>


        <div className={`header-actions ${isMobileSearchOpen ? 'hide-on-mobile' : ''}`}>
           <button className="btn-glass" onClick={() => setLanguage(language === 'AZ' ? 'EN' : 'AZ')}>
              <Globe size={18} /> <span>{language}</span>
           </button>
           
           <button className="btn-glass" onClick={() => setCurrency(currency === 'AZN' ? 'USD' : 'AZN')}>
              <DollarSign size={18} /> <span>{currency}</span>
           </button>

           <div className="divider-vertical"></div>
           
           {user ? (
             <div className="header-user-area">
                <div className="user-profile-btn" onClick={() => navigate('/profile')}>
                    <div className="user-avatar-small">
                        {user.avatar ? <img src={user.avatar} alt="me" /> : (user.name ? user.name[0] : 'U')}
                    </div>
                    <span className="user-name-text">{user.name.split(' ')[0]}</span>
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
    </header>
  );
}

export default Header;