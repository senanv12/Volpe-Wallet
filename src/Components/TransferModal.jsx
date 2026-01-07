import React, { useState, useEffect } from 'react';
import { X, Send, CreditCard, User, CheckCircle, ChevronDown } from 'lucide-react';
import api from '../api';
import { useData } from '../Context/DataContext';
import { useSettings } from '../Context/SettingsContext';
import './css/TransferModal.css';

const TransferModal = ({ isOpen, onClose, recipient }) => {
  const { cards, refreshData } = useData() || {};
  const { currency: globalCurrency } = useSettings() || {};

  const [username, setUsername] = useState('');
  const [amount, setAmount] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('AZN');
  const [selectedCards, setSelectedCards] = useState({});
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });

  const currencies = ['AZN', 'TRY', 'USD', 'GBP', 'EUR', 'RUB'];

  useEffect(() => {
    if (isOpen) {
      setSelectedCurrency(globalCurrency || 'AZN');
      setUsername(recipient?.username || ''); // Əgər profildən gəlibsə avtomatik yazılır
      setAmount('');
      setSelectedCards({});
      setMsg({ type: '', text: '' });
    }
  }, [isOpen, recipient, globalCurrency]);

  const toggleCard = (cardId) => {
    setSelectedCards(prev => ({ ...prev, [cardId]: !prev[cardId] }));
  };

  // Balans paylanmasını hesablamaq
  const calculateDistribution = () => {
    const target = Number(amount);
    if (!target || target <= 0) return { valid: false, sources: [], missing: target };
    
    let remaining = target;
    const sources = [];
    const safeCards = Array.isArray(cards) ? cards : [];
    const mySelectedCards = safeCards.filter(c => selectedCards[c._id]);

    for (const card of mySelectedCards) {
      if (remaining <= 0) break;
      const available = Number(card.balance || 0);
      const take = Math.min(available, remaining);
      if (take > 0) {
        sources.push({ cardId: card._id, deductAmount: take });
        remaining -= take;
      }
    }
    // Əgər qalıq 0-dırsa, deməli kartlardakı balans kifayət edir
    return { valid: remaining <= 0, sources, missing: remaining };
  };

  const { valid, sources, missing } = calculateDistribution();

const handleTransfer = async (e) => {
  e.preventDefault();
  
  // Şablon yoxlanışı: Sadəcə inputun boş olub-olmadığına baxırıq
  if (!username.trim() || !amount || amount <= 0) {
    setMsg({ type: 'error', text: 'Zəhmət olmasa bütün sahələri düzgün doldurun.' });
    return;
  }

  setLoading(true);
  try {
    // API-ya sorğu: Backend burada "sources" massivini götürüb kart balanslarını azaldacaq
    await api.post('/transactions/transfer', {
      receiverUsername: username, // Nə yazılsa qəbul edilir
      amount: Number(amount),
      currency: selectedCurrency,
      sources: sources, // Seçdiyin çoxlu kartlar və hərəsindən çıxılacaq məbləğ
      isTemplate: true  // Backend-ə bu transferin "sərbəst" olduğunu bildirmək üçün
    });

    setMsg({ type: 'success', text: 'Uğurlu əməliyyat! Balansınızdan pul çıxıldı.' });
    
    // Header və Dashboard-da balansın dərhal yenilənməsi üçün refresh çağırılır
    if (refreshData) await refreshData();
    
    // 2 saniyə sonra modalı bağla
    setTimeout(onClose, 2000);
  } catch (error) {
    // Əgər balans çatmasa və ya serverdə xəta olsa bura düşəcək
    setMsg({ type: 'error', text: error.response?.data?.message || 'Balans azaldılarkən xəta baş verdi.' });
  } finally {
    setLoading(false);
  }
};

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content glass-effect">
        <div className="modal-header">
          <h3>Pul Göndər</h3>
          <button onClick={onClose} className="close-btn"><X size={24} /></button>
        </div>

        <form onSubmit={handleTransfer} className="modal-body">
          {/* Username hissəsi */}
          <div className="input-group">
            <label>Alıcının Username-i</label>
            <div className="input-wrapper">
              <User className="input-icon" size={18} />
              <input 
                type="text" 
                placeholder="@username" 
                value={username} 
                onChange={e => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="input-group">
            <label>Valyuta və Məbləğ</label>
            <div className="amount-row">
                <select 
                    value={selectedCurrency} 
                    onChange={(e) => setSelectedCurrency(e.target.value)}
                    className="currency-dropdown"
                >
                    {currencies.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
                <div className="input-wrapper flex-1">
                    <input 
                        type="number" 
                        value={amount} 
                        onChange={e => setAmount(e.target.value)} 
                        placeholder="0.00" 
                        required
                    />
                </div>
            </div>
          </div>

          <div className="cards-selection-area">
            <p className="selection-title">Ödəniş üçün kartlarınızı seçin:</p>
            <div className="cards-scroll-list">
              {cards?.map(card => (
                <div 
                    key={card._id} 
                    className={`card-select-row ${selectedCards[card._id] ? 'active' : ''}`} 
                    onClick={() => toggleCard(card._id)}
                >
                  <div className="card-row-left">
                    <CreditCard size={20} />
                    <div className="card-info">
                      <span className="card-name">{card.bankName} (**** {card.cardNumber?.slice(-4)})</span>
                      <span className="card-bal">{Number(card.balance).toFixed(2)} {selectedCurrency}</span>
                    </div>
                  </div>
                  {selectedCards[card._id] && <CheckCircle size={18} color="#2dd4bf" />}
                </div>
              ))}
            </div>
            
            {amount > 0 && (
                <div className={`status-info ${valid ? 'ready' : 'not-enough'}`}>
                    {valid ? "✅ Balans kifayətdir" : `❌ Çatışmayan: ${missing.toFixed(2)} ${selectedCurrency}`}
                </div>
            )}
          </div>

          {msg.text && <div className={`message-box ${msg.type}`}>{msg.text}</div>}

          <button type="submit" className="submit-btn" disabled={loading || !valid || !username}>
            {loading ? 'İşlənilir...' : 'Transferi Təsdiqlə'} <Send size={18} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default TransferModal;