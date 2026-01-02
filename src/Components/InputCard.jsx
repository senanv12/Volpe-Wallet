import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { useData } from '../Context/DataContext';
import { LeoCard, KapitalCard, AbbCard, DefaultCard } from './CreditCards';
import './css/InputCard.css';

const InputCard = () => {
  const { user, refreshData } = useData();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const [cardData, setCardData] = useState({
    cardNumber: '', cardHolder: '', expiry: '', cvv: ''
  });
  const [cardType, setCardType] = useState('default'); 
  const [isFlipped, setIsFlipped] = useState(false);

  // Kart tipinə görə davranışlar
  useEffect(() => {
    if (cardType === 'leobank') {
      setIsFlipped(true); // Leobank seçilən kimi arxasını çevir
    } else if (cardType === 'kapital') {
      setIsFlipped(false); // Kapital dik duracaq (CSS ilə), amma üzü bizə baxsan
    }
  }, [cardType]);

  const handleInputFocus = (e) => {
    const fieldName = e.target.name;
    if (fieldName === 'cvv') {
      setIsFlipped(true);
    } else {
      // Leobank həmişə arxa tərəfi göstərir (dizayn belədir)
      if (cardType === 'leobank') setIsFlipped(true);
      else setIsFlipped(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'cardNumber') {
      let rawValue = value.replace(/\D/g, '');
      let detectedType = 'default';
      
      if (rawValue.startsWith('4098') || rawValue.startsWith('5522')) detectedType = 'leobank';
      else if (rawValue.startsWith('4169')) detectedType = 'kapital';
      else if (rawValue.startsWith('4127')) detectedType = 'abb';
      
      setCardType(detectedType);
      
      let formatted = rawValue.replace(/(\d{4})/g, '$1 ').trim();
      setCardData({ ...cardData, [name]: formatted });
    } else if (name === 'expiry') {
      let val = value.replace(/\D/g, '');
      if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2, 4);
      setCardData({ ...cardData, [name]: val });
    } else {
      setCardData({ ...cardData, [name]: value });
    }
  };

  const handleAddCard = async () => {
    if (!user) {
      if(window.confirm("Kart əlavə etmək üçün daxil olun.")) navigate('/login');
      return;
    }
    setLoading(true);
    try {
      const payload = {
        ...cardData,
        cardHolder: cardData.cardHolder.toUpperCase(),
        cardType,
        balance: Math.floor(Math.random() * 2000) + 100 
      };
      await api.post('/cards', payload);
      alert("Kart əlavə edildi!");
      setCardData({ cardNumber: '', cardHolder: '', expiry: '', cvv: '' });
      refreshData(); 
    } catch (error) {
      alert("Xəta: " + (error.response?.data?.message || "Xəta"));
    } finally { setLoading(false); }
  };

  return (
    <div className="input-card-container" id="input-card-section">
      <div className="form-wrapper">
        <h2 style={{textAlign: 'center', marginBottom: '40px'}}>Kartını Əlavə Et</h2>
        <div className="content-row">
          
          {/* Kapital Bank olanda 'portrait-mode', digərlərində 'landscape-mode' */}
          <div 
            className={`card-scene ${cardType === 'kapital' ? 'portrait-mode' : 'landscape-mode'}`} 
            onClick={() => setIsFlipped(!isFlipped)}
          >
            {cardType === 'leobank' && <LeoCard cardData={cardData} isFlipped={isFlipped} showCvvOverride={true} />}
            {cardType === 'kapital' && <KapitalCard cardData={cardData} isFlipped={isFlipped} showCvvOverride={true} />}
            {cardType === 'abb' && <AbbCard cardData={cardData} isFlipped={isFlipped} showCvvOverride={true} />}
            {cardType === 'default' && <DefaultCard cardData={cardData} isFlipped={isFlipped} showCvvOverride={true} />}
          </div>

          <div className="input-form">
            <div className="form-group"><label>Kart Nömrəsi</label><input type="text" name="cardNumber" maxLength="19" value={cardData.cardNumber} onChange={handleChange} onFocus={handleInputFocus} placeholder="4169... / 5522..." /></div>
            <div className="form-group"><label>Kart Sahibi</label><input type="text" name="cardHolder" value={cardData.cardHolder} onChange={handleChange} onFocus={handleInputFocus} placeholder="AD SOYAD" /></div>
            <div className="form-row">
              <div className="form-group"><label>Bitmə Tarixi</label><input type="text" name="expiry" maxLength="5" value={cardData.expiry} onChange={handleChange} onFocus={handleInputFocus} placeholder="MM/YY" /></div>
              <div className="form-group"><label>CVV</label><input type="password" name="cvv" maxLength="3" value={cardData.cvv} onChange={handleChange} onFocus={handleInputFocus} placeholder="***" /></div>
            </div>
            <button className="add-btn" onClick={handleAddCard} disabled={loading}>{loading ? "Yüklənir..." : "Karta Əlavə Et"}</button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default InputCard;