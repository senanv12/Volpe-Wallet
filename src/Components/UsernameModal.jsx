import React, { useState } from 'react';
import api from '../api';
import './InputCard.css'; // Stil üçün InputCard.css istifadə edə bilərik

const UsernameModal = ({ user, onClose, onUpdateUser }) => {
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.startsWith('@')) {
        setError("Username @ işarəsi ilə başlamalıdır");
        return;
    }

    try {
      // Backend-ə username göndəririk (Real API lazımdır)
      // const res = await api.post('/set-username', { userId: user._id, username });
      
      // Simulyasiya edirik:
      const updatedUser = { ...user, username: username };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      onUpdateUser(updatedUser); // App.js-də user state-i yeniləyir
      onClose();
      alert("Username uğurla yaradıldı: " + username);
    } catch (err) {
      setError("Bu username artıq istifadə olunur.");
    }
  };

  return (
    <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', 
        justifyContent: 'center', alignItems: 'center'
    }}>
      <div className="input-form" style={{maxWidth: '400px', textAlign: 'center'}}>
        <h2>Xoş Gəldiniz, {user.name}!</h2>
        <p style={{color:'#8b949e', marginBottom:'20px'}}>Volpe hesabınız üçün unikal bir ad seçin.</p>
        
        <form onSubmit={handleSubmit}>
            <div className="form-group">
                <input 
                    type="text" 
                    placeholder="@bysenan" 
                    value={username}
                    onChange={(e) => {
                        setUsername(e.target.value);
                        setError('');
                    }}
                    style={{fontSize: '20px', textAlign: 'center', fontWeight: 'bold'}}
                />
            </div>
            {error && <p style={{color:'red', fontSize:'12px'}}>{error}</p>}
            <button className="add-btn" type="submit">Təsdiqlə</button>
        </form>
      </div>
    </div>
  );
};

export default UsernameModal;