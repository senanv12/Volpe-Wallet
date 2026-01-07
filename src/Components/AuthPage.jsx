import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ArrowLeft, X, Loader, AtSign } from 'lucide-react';
import api from '../api';
import { useData } from '../Context/DataContext';
import './css/AuthPage.css';
import DarkVeil from '../Components/Backgrounds/DarkVeil'; 

const AuthPage = ({ mode }) => {
  const navigate = useNavigate();
  const { setUser, fetchInitialData } = useData(); 
  
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [currentStep, setCurrentStep] = useState(1);

  const [formData, setFormData] = useState({
    fullName: '', email: '', password: '', username: ''
  });

  useEffect(() => {
    setIsLogin(mode === 'login');
    setCurrentStep(1); 
    setError('');
  }, [mode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleToggle = () => {
    navigate(isLogin ? '/signup' : '/login');
    setIsLogin(!isLogin);
  };

  const handleUsernameChange = (e) => {
      const val = e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '');
      setFormData({ ...formData, username: val });
  };

  const handlePrevStep = () => { setCurrentStep(1); setError(''); };

  const handleNextStep = () => {
     if(!formData.fullName || !formData.email || !formData.password) {
         setError("Zəhmət olmasa bütün sahələri doldurun.");
         return;
     }
     setCurrentStep(2);
     setError('');
  };

  // Çıxış
  const handleClose = () => {
    window.location.href = '/'; 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // --- CİDDİ VALIDASİYA (BURASI VACİBDİR) ---
    if (isLogin) {
        // Login üçün sadəcə email və şifrə lazımdır
        if (!formData.email || !formData.password) {
            setError("E-poçt və şifrəni daxil edin.");
            setLoading(false);
            return;
        }
    } else {
        // Signup üçün HAMISI lazımdır (xüsusilə username)
        if (!formData.fullName || !formData.email || !formData.password || !formData.username) {
            setError("Bütün sahələri, o cümlədən istifadəçi adını doldurun.");
            setLoading(false);
            return;
        }
    }

    try {
      const endpoint = isLogin ? '/users/login' : '/users/signup';
      
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : { 
            fullName: formData.fullName, 
            username: formData.username, 
            email: formData.email, 
            password: formData.password 
          };
        
      const { data } = await api.post(endpoint, payload);
      
      localStorage.setItem('user', JSON.stringify(data));
      if (setUser) setUser(data);
      if (fetchInitialData) await fetchInitialData();
      
      navigate('/dashboard');

    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.response?.data?.message || 'Xəta baş verdi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-background">
        <DarkVeil />
      </div>

      <div className="auth-card-container">
        <button className="close-auth" onClick={handleClose}><X size={24} /></button>

        <div className="auth-card">
          <div className="auth-header">
            <h2>{isLogin ? 'Xoş Gəldiniz' : 'Hesab Yarat'}</h2>
            <p>{isLogin ? 'Davam etmək üçün giriş edin' : 'Volpe dünyasına qoşulun'}</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {(isLogin || currentStep === 1) && (
              <>
                {!isLogin && (
                   <div className="form-group">
                      <label>Ad Soyad</label>
                      <div className="input-wrapper">
                          <div className="icon-wrapper"><User size={20} /></div>
                          <input name="fullName" placeholder="Adınız" value={formData.fullName} onChange={handleChange} autoFocus={!isLogin} />
                      </div>
                   </div>
                )}
                <div className="form-group">
                  <label>E-poçt</label>
                  <div className="input-wrapper">
                      <div className="icon-wrapper"><Mail size={20} /></div>
                      <input name="email" type="email" placeholder="mail@example.com" value={formData.email} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Şifrə</label>
                  <div className="input-wrapper">
                      <div className="icon-wrapper"><Lock size={20} /></div>
                      <input name="password" type="password" placeholder="••••••••" value={formData.password} onChange={handleChange} />
                  </div>
                </div>
              </>
            )}

            {!isLogin && currentStep === 2 && (
               <div className="form-group slide-in">
                  <label className="center-label">İstifadəçi adı seçin</label>
                  <div className="input-wrapper username-box">
                      <div className="icon-wrapper"><AtSign size={20} color="#2dd4bf" /></div>
                      <input name="username" type="text" placeholder="username" className="username-input" value={formData.username} onChange={handleUsernameChange} autoFocus />
                  </div>
                  <p className="hint-text">Kiçik hərflər, rəqəmlər və alt xətt.</p>
               </div>
            )}

            <div className="form-actions">
              {!isLogin && currentStep === 2 && (
                  <button type="button" className="prev-btn" onClick={handlePrevStep}><ArrowLeft size={20} /></button>
              )}
              {!isLogin && currentStep === 1 ? (
                  <button type="button" className="submit-btn" onClick={handleNextStep}>Növbəti <ArrowRight size={20} /></button>
              ) : (
                  <button type="submit" className="submit-btn" disabled={loading}>
                      {loading ? <Loader className="spin" size={20} /> : (isLogin ? 'Daxil Ol' : 'Tamamla')}
                  </button>
              )}
            </div>
          </form>

          <div className="auth-footer">
            <button className="toggle-btn" type="button" onClick={handleToggle}>
              {isLogin ? "Hesabınız yoxdur? Qeydiyyat" : "Artıq hesabınız var? Giriş"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;