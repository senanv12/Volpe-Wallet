import React, { useState } from 'react';
import { X, Send, CheckCircle, AlertCircle, Loader } from 'lucide-react';
import api from '../api';
import { useData } from '../Context/DataContext';

const TransferModal = ({ isOpen, onClose, recipient }) => {
  const { refreshData, user } = useData();
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null); // null | 'success' | 'error'
  const [msg, setMsg] = useState('');

  if (!isOpen || !recipient) return null;

  const handleTransfer = async () => {
    if (!amount || amount <= 0) return;
    setLoading(true);
    setMsg('');
    setStatus(null);

    try {
      await api.post('/transactions/transfer', {
        recipientUsername: recipient.username,
        amount: parseFloat(amount)
      });
      
      setStatus('success');
      setMsg('Köçürmə uğurla tamamlandı!');
      refreshData(); // Balansı dərhal yenilə
      
      // 2 saniyə sonra modalı bağla
      setTimeout(() => {
        onClose();
        setStatus(null);
        setAmount('');
      }, 2000);
      
    } catch (error) {
      setStatus('error');
      setMsg(error.response?.data?.message || 'Xəta baş verdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <button onClick={onClose} style={styles.closeBtn}><X size={20}/></button>
        
        <div style={styles.header}>
            <h3>Pul Köçürmə</h3>
            <p>Sürətli və komissiyasız</p>
        </div>

        <div style={styles.recipientBox}>
            <div style={styles.avatar}>
                {recipient.avatar ? <img src={recipient.avatar} alt="av" style={styles.img}/> : recipient.name[0]}
            </div>
            <div>
                <div style={styles.name}>{recipient.name}</div>
                <div style={styles.username}>@{recipient.username}</div>
            </div>
        </div>

        {status === 'success' ? (
            <div style={{...styles.statusBox, color: '#2dd4bf'}}>
                <CheckCircle size={40} />
                <p>{msg}</p>
            </div>
        ) : (
            <>
                <div style={styles.inputGroup}>
                    <label>Məbləğ (AZN)</label>
                    <input 
                        type="number" 
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="0.00"
                        style={styles.input}
                        autoFocus
                    />
                    <small style={{color:'#6b7280'}}>Balansınız: {user?.walletBalance} ₼</small>
                </div>

                {status === 'error' && (
                    <div style={{...styles.statusBox, color: '#ef4444', flexDirection:'row', gap:'10px', fontSize:'14px'}}>
                        <AlertCircle size={18} /> {msg}
                    </div>
                )}

                <button 
                    onClick={handleTransfer} 
                    disabled={loading || !amount}
                    style={{...styles.sendBtn, opacity: (loading || !amount) ? 0.7 : 1}}
                >
                    {loading ? <Loader className="animate-spin" /> : <>Göndər <Send size={18}/></>}
                </button>
            </>
        )}
      </div>
    </div>
  );
};

// Sadə inline CSS (Faylı çoxaltmamaq üçün)
const styles = {
    overlay: {
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', zIndex: 9999,
        display: 'flex', alignItems: 'center', justifyContent: 'center'
    },
    modal: {
        background: '#161b22', width: '90%', maxWidth: '400px', borderRadius: '24px',
        padding: '30px', border: '1px solid rgba(255,255,255,0.1)', position: 'relative',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5)'
    },
    closeBtn: {
        position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'none',
        color: '#6b7280', cursor: 'pointer'
    },
    header: { textAlign: 'center', marginBottom: '25px', color: 'white' },
    recipientBox: {
        display: 'flex', alignItems: 'center', gap: '15px', background: 'rgba(255,255,255,0.03)',
        padding: '15px', borderRadius: '16px', marginBottom: '20px', border: '1px solid #30363d'
    },
    avatar: {
        width: '50px', height: '50px', borderRadius: '50%', background: '#2dd4bf',
        display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', overflow: 'hidden'
    },
    img: { width: '100%', height: '100%', objectFit: 'cover' },
    name: { color: 'white', fontWeight: '600' },
    username: { color: '#6b7280', fontSize: '13px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' },
    input: {
        background: 'transparent', border: '1px solid #30363d', padding: '15px',
        borderRadius: '12px', color: 'white', fontSize: '24px', fontWeight: 'bold', textAlign: 'center', outline: 'none'
    },
    sendBtn: {
        width: '100%', padding: '15px', background: 'linear-gradient(135deg, #2dd4bf, #0f766e)',
        border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', fontSize: '16px',
        cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px'
    },
    statusBox: {
        textAlign: 'center', padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px'
    }
};

export default TransferModal;