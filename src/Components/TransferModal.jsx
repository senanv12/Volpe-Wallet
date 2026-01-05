import React, { useState, useEffect } from 'react';
import { X, Send, CreditCard, User, CheckCircle } from 'lucide-react';
import api from '../api';
import { useData } from '../Context/DataContext';
import { useSettings } from '../Context/SettingsContext';
import './css/TransferModal.css';

const TransferModal = ({ isOpen, onClose, recipient }) => {
  // 1. Context-ləri təhlükəsiz çağırırıq
  const data = useData();
  const settings = useSettings();

  // Əgər Context hələ yüklənməyibsə, heç nə göstərmə (Xətanın qarşısını alır)
  if (!data || !settings) return null;

  const { cards, refreshData } = data;
  const { currentSymbol } = settings;
  
  // Safe Cards: Kartlar yoxdursa boş massiv götür ki, map xəta verməsin
  const safeCards = Array.isArray(cards) ? cards : [];

  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCards, setSelectedCards] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  // Modal açılanda işləyən hissə
  useEffect(() => {
    if (isOpen) {
      // Recipient varsa adını yaz, yoxdursa boş qoy
      if (recipient && recipient.username) {
        setUsername(recipient.username);
      } else {
        setUsername('');
      }
      setAmount('');
      setSelectedCards({});
      setMsg({ type: '', text: '' });
    }
  }, [isOpen, recipient]);

  // Kart seçimi
  const toggleCard = (cardId) => {
    setSelectedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  // Hesablama Məntiqi
  const calculateDistribution = () => {
    const target = Number(amount);
    if (!target || target <= 0) return { valid: false, sources: [], missing: 0 };

    let remaining = target;
    const sources = [];
    
    // Yalnız seçilmiş kartları filtrləyirik
    const mySelectedCards = safeCards.filter(c => selectedCards[c._id]);

    for (const card of mySelectedCards) {
        if (remaining <= 0) break;
        const available = Number(card.balance || 0); // Balans yoxdursa 0 götür
        const take = Math.min(available, remaining);
        
        if (take > 0) {
            sources.push({ cardId: card._id, deductAmount: take });
            remaining -= take;
        }
    }

    return {
        valid: remaining <= 0.01,
        sources: sources,
        missing: remaining
    };
  };

  const { valid, sources, missing } = calculateDistribution();

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!valid) return;

    setLoading(true);
    try {
      await api.post('/transactions/transfer', {
        receiverUsername: username,
        amount: Number(amount),
        sources: sources
      });

      setMsg({ type: 'success', text: 'Transfer uğurla tamamlandı!' });
      await refreshData();
      setTimeout(onClose, 2000);
    } catch (error) {
      setMsg({ type: 'error', text: error.response?.data?.message || 'Xəta baş verdi.' });
    } finally {
      setLoading(false);
    }
  };

  // Əgər modal bağlıdırsa, heç nə render etmə
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-effect">
        <div className="modal-header">
          {/* Təhlükəsiz başlıq: recipient yoxdursa xəta verməsin */}
          <h3>
             {recipient?.name ? `Transfer: ${recipient.name}` : 'Kartla Transfer'}
          </h3>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>

        <form onSubmit={handleTransfer} className="modal-body">
          {/* USERNAME INPUT */}
          <div className="input-group">
            <label>Qəbul edən (@username)</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input 
                type="text" 
                placeholder="@dostun" 
                value={username} 
                onChange={e => setUsername(e.target.value)} 
                // Əgər axtarışdan gəlibsə, dəyişməyə icazə veririk, amma default dolu gəlir
              />
            </div>
          </div>

          {/* MƏBLƏĞ */}
          <div className="input-group">
            <label>Məbləğ ({currentSymbol})</label>
            <div className="input-wrapper">
              <span className="currency-icon">{currentSymbol}</span>
              <input 
                type="number" placeholder="0.00" 
                value={amount} onChange={e => setAmount(e.target.value)} 
              />
            </div>
          </div>

          {/* KART SEÇİMİ (LIST) */}
          <div className="cards-selection-area">
            <p className="selection-title">Ödəniş mənbələrini seçin:</p>
            
            <div className="cards-scroll-list">
                {safeCards.length > 0 ? (
                    safeCards.map(card => {
                        const isSelected = !!selectedCards[card._id];
                        const sourceInfo = sources.find(s => s.cardId === card._id);
                        const deducted = sourceInfo ? sourceInfo.deductAmount : 0;

                        return (
                            <div key={card._id} className={`card-select-row ${isSelected ? 'active' : ''}`} onClick={() => toggleCard(card._id)}>
                                <div className="card-row-left">
                                    <CreditCard size={20} color={isSelected ? '#2dd4bf' : '#64748b'} />
                                    <div>
                                        <div className="card-name">{card.bankName} •••• {card.cardNumber.slice(-4)}</div>
                                        <div className="card-bal">Balans: {Number(card.balance).toFixed(2)} {currentSymbol}</div>
                                    </div>
                                </div>
                                {deducted > 0 && <div className="deduct-badge">-{deducted} {currentSymbol}</div>}
                                {isSelected && <CheckCircle size={18} color="#2dd4bf" style={{marginLeft:'auto'}} />}
                            </div>
                        );
                    })
                ) : (
                    <div className="no-cards-text">Kart tapılmadı. Zəhmət olmasa kart əlavə edin.</div>
                )}
            </div>

            {/* STATUS BAR */}
            {amount > 0 && safeCards.length > 0 && (
                <div className={`status-indicator ${valid ? 'success' : 'warning'}`}>
                    {valid 
                        ? <span>✅ Məbləğ tamamlandı! Göndərə bilərsiniz.</span>
                        : <span>❌ Hələ <b>{missing.toFixed(2)} {currentSymbol}</b> çatmır.</span>
                    }
                </div>
            )}
          </div>

          {msg.text && <div className={`message-box ${msg.type}`}>{msg.text}</div>}

          <button type="submit" className="submit-btn" disabled={loading || !valid || !username}>
            {loading ? 'Göndərilir...' : 'Göndər'} <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferModal;