import React, { useState } from 'react';
import { useData } from '../Context/DataContext';
import Header from '../Components/Header';
import { Camera, Edit2, Save } from 'lucide-react'; // İkonlar
import api from '../api';
import './ProfilePage.css';

const ProfilePage = () => {
  const { user, cards } = useData();
  const [isEditing, setIsEditing] = useState(false);
  const [newAvatarUrl, setNewAvatarUrl] = useState('');

  if (!user) return <div className="profile-container"><h1>Giriş edilməyib</h1></div>;

  // Təhlükəsiz məlumatlar
  const safeName = user?.name || 'İstifadəçi';
  const safeUsername = user?.username ? '@' + user.username.replace('@', '') : ''; // Username formatı
  const safeEmail = user?.email || 'email@example.com';
  const safeAvatar = user?.avatar; 
  const safeInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';
  const cardCount = Array.isArray(cards) ? cards.length : 0;

  // Profil şəklini yeniləmək
  const handleUpdateAvatar = async () => {
    if (!newAvatarUrl) return;
    try {
        const { data } = await api.put('/update-profile', { avatar: newAvatarUrl });
        localStorage.setItem('user', JSON.stringify(data)); // LocalStorage yenilə
        window.location.reload(); // Səhifəni yenilə ki, dəyişiklik görünsün
    } catch (error) {
        alert("Xəta baş verdi");
    }
  };

  return (
    <>
      <Header />
      <div className="profile-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>

        <div className="profile-dashboard">
           {/* SOL TƏRƏF */}
           <div className="profile-sidebar glass-panel">
              <div className="avatar-section">
                  <div className="avatar-ring large">
                      {safeAvatar ? (
                          <img src={safeAvatar} alt="Profile" className="profile-img-real" />
                      ) : (
                          <div className="profile-avatar">{safeInitial}</div>
                      )}
                      
                      {/* Şəkil Dəyişmə Düyməsi */}
                      <button className="edit-avatar-btn" onClick={() => setIsEditing(!isEditing)}>
                          <Camera size={18} />
                      </button>
                  </div>
                  
                  {/* Şəkil URL Inputu (Edit rejimi) */}
                  {isEditing && (
                      <div className="avatar-edit-box fade-in-up">
                          <input 
                            type="text" 
                            placeholder="Şəkil URL-i yapışdırın..." 
                            value={newAvatarUrl}
                            onChange={(e) => setNewAvatarUrl(e.target.value)}
                          />
                          <button onClick={handleUpdateAvatar}><Save size={16}/></button>
                      </div>
                  )}
              </div>

              <h2 className="profile-name">{safeName}</h2>
              <p className="profile-username">{safeUsername}</p> {/* USERNAME GÖRÜNÜR */}
              <p className="profile-role">Premium İstifadəçi</p>
              
              <div className="profile-menu">
                 <button className="menu-item active">👤 Şəxsi Məlumatlar</button>
                 <button className="menu-item">🛡️ Təhlükəsizlik</button>
                 {/* Bildirişlər silindi */}
              </div>
           </div>

           {/* SAĞ TƏRƏF */}
           <div className="profile-content glass-panel">
              <h3 className="section-title">Hesab Məlumatları</h3>
              <div className="info-grid">
                  <div className="info-card">
                      <label>Ad Soyad</label>
                      <div className="info-value">{safeName}</div>
                  </div>
                  <div className="info-card">
                      <label>İstifadəçi adı</label>
                      <div className="info-value highlight">{safeUsername}</div>
                  </div>
                  <div className="info-card">
                      <label>E-poçt</label>
                      <div className="info-value">{safeEmail}</div>
                  </div>
                  <div className="info-card">
                      <label>Qeydiyyat</label>
                      <div className="info-value">2024</div>
                  </div>
              </div>

              <h3 className="section-title" style={{marginTop:'30px'}}>Statistika</h3>
              <div className="stats-row">
                  <div className="stat-box">
                      <span className="stat-num">{cardCount}</span>
                      <span className="stat-label">Aktiv Kart</span>
                  </div>
                  <div className="stat-box highlight">
                      <span className="stat-num">4.8</span>
                      <span className="stat-label">Reytinq</span>
                  </div>
              </div>
           </div>
        </div>
      </div>
    </>
  );
};
export default ProfilePage;