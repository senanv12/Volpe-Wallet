import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, ArrowLeft, X, Loader, AtSign, Check } from 'lucide-react';
import DarkVeil from '../Components/Backgrounds/DarkVeil';
import api from '../api';
import './css/AuthPage.css';

const AuthPage = ({ mode }) => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Stepper State (Yalnız Qeydiyyat üçün)
  const [currentStep, setCurrentStep] = useState(1);

  // Form Data
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    username: ''
  });

  useEffect(() => {
    setIsLogin(mode === 'login');
    setCurrentStep(1); // Mode dəyişəndə step-i sıfırla
    setError('');
  }, [mode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  // Login/Signup keçidi
  const handleToggle = () => {
    const targetPath = isLogin ? '/signup' : '/login';
    navigate(targetPath);
  };

  // Username formatlama (@ işarəsini avtomatik idarə etmək)
  const handleUsernameChange = (e) => {
    let val = e.target.value.replace(/\s/g, ''); // Boşluqları sil
    if (val.startsWith('@')) val = val.substring(1);
    setFormData({ ...formData, username: val });
  };

  // STEPPER NAVİQASİYASI
  const handleNextStep = (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      setError("Zəhmət olmasa E-poçt və Şifrəni daxil edin.");
      return;
    }
    setError('');
    setCurrentStep(2);
  };

  const handlePrevStep = () => {
    setError('');
    setCurrentStep(1);
  };

  // API SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const endpoint = isLogin ? '/login' : '/signup';
    
    // Username-i payload-a @ ilə əlavə edirik (əgər signup-dırsa)
    const payload = isLogin ? formData : {
        ...formData,
        username: `@${formData.username}`
    };

    try {
      const response = await api.post(endpoint, payload);
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data));
        navigate('/dashboard');
        window.location.reload();
      }
    } catch (err) {
      console.error("Auth Error:", err);
      setError(err.response?.data?.message || "Xəta baş verdi. Məlumatları yoxlayın.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      {/* Background - DarkVeil Saxlanılıb */}
      <div className="background-layer">
        <DarkVeil 
            active={true} 
            opacity={0.5} 
            depth={8} 
            color="#2dd4bf" 
            scanlineIntensity={0.1} 
        />
      </div>

      <button className="close-auth" onClick={() => window.location.href = '/'}>
        <X size={24} />
      </button>

      <div className="auth-card stepper-card">
        {/* HEADER */}
        <div className="auth-header">
          <h1>{isLogin ? 'Xoş Gəldiniz' : 'Hesab Yaradın'}</h1>
          <p>{isLogin ? 'Davam etmək üçün daxil olun' : 'Rəqəmsal pulqabınıza addım atın'}</p>
        </div>

        {/* STEPPER INDICATOR (Yalnız Sign Up rejimində görünür) */}
        {!isLogin && (
          <div className="stepper-indicator">
             <div className={`step-dot ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
                {currentStep > 1 ? <Check size={14}/> : '1'}
             </div>
             <div className={`step-line ${currentStep === 2 ? 'filled' : ''}`}></div>
             <div className={`step-dot ${currentStep === 2 ? 'active' : ''}`}>2</div>
          </div>
        )}

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={isLogin ? handleSubmit : (currentStep === 2 ? handleSubmit : handleNextStep)} className="auth-form">
          
          {/* --- LOGIN FORMASI --- */}
          {isLogin && (
            <div className="form-step active-step">
                <div className="input-group">
                    <div className="icon-wrapper"><Mail size={20} /></div>
                    <input name="email" type="email" placeholder="E-poçt ünvanı" value={formData.email} onChange={handleChange} required />
                </div>
                <div className="input-group">
                    <div className="icon-wrapper"><Lock size={20} /></div>
                    <input name="password" type="password" placeholder="Şifrə" value={formData.password} onChange={handleChange} required />
                </div>
            </div>
          )}

          {/* --- SIGN UP: STEP 1 (Credentials) --- */}
          {!isLogin && currentStep === 1 && (
            <div className="form-step animate-in">
                <div className="input-group">
                    <div className="icon-wrapper"><Mail size={20} /></div>
                    <input name="email" type="email" placeholder="E-poçt ünvanı" value={formData.email} onChange={handleChange} autoFocus />
                </div>
                <div className="input-group">
                    <div className="icon-wrapper"><Lock size={20} /></div>
                    <input name="password" type="password" placeholder="Şifrə" value={formData.password} onChange={handleChange} />
                </div>
            </div>
          )}

          {/* --- SIGN UP: STEP 2 (Personal Info + Username) --- */}
          {!isLogin && currentStep === 2 && (
             <div className="form-step animate-in">
                <div className="input-group">
                    <div className="icon-wrapper"><User size={20} /></div>
                    <input name="fullName" type="text" placeholder="Ad Soyad" value={formData.fullName} onChange={handleChange} autoFocus />
                </div>
                
                {/* YENİ USERNAME SAHƏSİ */}
                <div className="input-group username-group">
                    <div className="icon-wrapper"><AtSign size={20} /></div>
                    <span className="at-prefix">@</span>
                    <input 
                        name="username" 
                        type="text" 
                        placeholder="username" 
                        className="username-input"
                        value={formData.username} 
                        onChange={handleUsernameChange} 
                    />
                </div>
             </div>
          )}

          {/* BUTTONS */}
          <div className="form-actions">
            {!isLogin && currentStep === 2 && (
                <button type="button" className="prev-btn" onClick={handlePrevStep}>
                    <ArrowLeft size={20} />
                </button>
            )}

            <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? <Loader className="animate-spin" size={20} /> : (
                    isLogin ? 'Daxil Ol' : (currentStep === 1 ? 'Növbəti' : 'Tamamla')
                )}
                {!loading && (currentStep === 1 || isLogin) && <ArrowRight size={20} />}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          <button className="toggle-btn" onClick={handleToggle}>
            {isLogin ? "Hesabınız yoxdur? Qeydiyyat" : "Artıq hesabınız var? Giriş"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;