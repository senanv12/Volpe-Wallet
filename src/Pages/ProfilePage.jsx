import React, { useState, useMemo } from 'react';
import { useData } from '../Context/DataContext';
import { useSettings } from '../Context/SettingsContext'; 
import { Camera, Save, CreditCard, Wallet, Calendar, Mail, User, Shield } from 'lucide-react';
import api from '../api';
import './css/ProfilePage.css';

const ProfilePage = () => {
  const { user, cards, setUser } = useData();
  const { t, convertAmount, currentSymbol } = useSettings(); 
  
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState('');

  if (!user) return null;


  const totalBalanceAZN = useMemo(() => {
    return Array.isArray(cards) 
      ? cards.reduce((sum, card) => sum + (Number(card.balance) || 0), 0) 
      : 0;
  }, [cards]);


  const displayBalance = convertAmount(totalBalanceAZN).toFixed(2);
  const cardCount = Array.isArray(cards) ? cards.length : 0;

  const safeName = user.name || 'İstifadəçi';
  const safeUsername = user.username ? `@${user.username}` : '@username';
  const safeEmail = user.email || 'email@example.com';
  const safeAvatar = user.avatar;
  const safeInitial = safeName.charAt(0).toUpperCase();
  const joinDate = new Date(user.createdAt || Date.now()).toLocaleDateString('az-AZ', { year: 'numeric', month: 'long' });

  const handleUpdateAvatar = async () => {
    if (!newAvatarUrl) return;
    try {
        const { data } = await api.put('/update-profile', { avatar: newAvatarUrl });
        localStorage.setItem('user', JSON.stringify(data));
        setUser(data);
        setIsEditingAvatar(false);
        setNewAvatarUrl('');
    } catch (error) {
        console.error("Avatar xətası", error);
        alert("Şəkil yenilənmədi. URL-i yoxlayın.");
    }
  };

  return (
    <div className="profile-page-wrapper">
      <div className="profile-glow"></div>
      <div className="profile-glow-2"></div>

      <div className="profile-content">
        
        <div className="profile-card animate-fade-in">
            <div className="avatar-wrapper">
                {safeAvatar ? (
                    <img src={safeAvatar} alt="Profile" className="avatar-img" />
                ) : (
                    <div className="avatar-initial">{safeInitial}</div>
                )}
                <button 
                    className="edit-avatar-btn" 
                    onClick={() => setIsEditingAvatar(!isEditingAvatar)}
                    title={t('change_photo') || "Şəkli dəyiş"}
                >
                    <Camera size={18} />
                </button>
            </div>

            {isEditingAvatar && (
                <div className="avatar-input-container">
                    <input 
                        type="text" 
                        placeholder="URL..." 
                        value={newAvatarUrl}
                        onChange={(e) => setNewAvatarUrl(e.target.value)}
                    />
                    <button className="save-avatar-btn" onClick={handleUpdateAvatar}>
                        <Save size={16} />
                    </button>
                </div>
            )}

            <h2 className="profile-fullname">{safeName}</h2>
            <p className="profile-username">{safeUsername}</p>
            <div className="profile-status-badge">Pro {t('account') || "Hesab"}</div>
        </div>

        <div className="details-section">
            
            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon"><CreditCard size={24} /></div>
                    <div className="stat-info">
                        <h4>{cardCount}</h4>
                        <p>{t('nav_cards')}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><Wallet size={24} /></div>
                    <div className="stat-info">
                        <h4>{displayBalance} {currentSymbol}</h4>
                        <p>{t('stat_balance')}</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon"><Shield size={24} /></div>
                    <div className="stat-info">
                        <h4>{t('active')}</h4>
                        <p>{t('status')}</p>
                    </div>
                </div>
            </div>


            <div className="info-group">
                <div className="group-header">
                    <h3>{t('profile_personal') || "Şəxsi Məlumatlar"}</h3>
                </div>

                <div className="info-grid">
                    <div className="info-item">
                        <label><User size={14} style={{verticalAlign:'middle'}}/> {t('name_surname') || "Ad Soyad"}</label>
                        <div className="info-value-box">{safeName}</div>
                    </div>
                    <div className="info-item">
                        <label><Mail size={14} style={{verticalAlign:'middle'}}/> {t('email') || "E-poçt"}</label>
                        <div className="info-value-box">{safeEmail}</div>
                    </div>
                    <div className="info-item">
                        <label>Username</label>
                        <div className="info-value-box highlight-text">{safeUsername}</div>
                    </div>
                    <div className="info-item">
                        <label><Calendar size={14} style={{verticalAlign:'middle'}}/> {t('joined') || "Qoşuldu"}</label>
                        <div className="info-value-box">{joinDate}</div>
                    </div>
                </div>
            </div>

        </div>

      </div>
    </div>
  );
};

export default ProfilePage;