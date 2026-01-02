import React, { useState } from 'react';
import './css/CalculatorPage.css';
import { Calculator, RefreshCw, ExternalLink } from 'lucide-react';

// --- LOGOLARI İMPORT EDİRİK ---
// Fayl adlarının dəqiq olduğundan əmin olun
import KapitalLogo from '../Assets/Kapital_Bank_logo.svg.png';
import UnibankLogo from '../Assets/Unibank_Logo.png';
import ABBLogo from '../Assets/ABB_Logo.png';
import PashaLogo from '../Assets/PASHA_Bank_Georgia_logo_(English).png';

const banksData = [
  { 
    id: 1, 
    name: 'Kapital Bank', 
    url: 'https://kapitalbank.az/loans/cash-loan', 
    logo: KapitalLogo,
    color: '#ff003c' 
  },
  { 
    id: 2, 
    name: 'Unibank', 
    url: 'https://unibank.az/az/private-clients/loans', 
    logo: UnibankLogo,
    color: '#fe5000' 
  },
  { 
    id: 3, 
    name: 'ABB', 
    url: 'https://abb-bank.az/az/ferdi/kreditler', 
    logo: ABBLogo,
    color: '#28348b' 
  },
  { 
    id: 4, 
    name: 'Paşa Bank', 
    url: 'https://www.pashabank.az/sme/az/loans', 
    logo: PashaLogo,
    color: '#00aba9' 
  }
];

const CalculatorPage = () => {
  const [amount, setAmount] = useState('');
  const [months, setMonths] = useState('');
  const [rate, setRate] = useState('');
  const [result, setResult] = useState(null);
  
  const [showBanks, setShowBanks] = useState(false);

  const calculateLoan = () => {
    if (!amount || !months || !rate) {
      alert("Zəhmət olmasa bütün xanaları doldurun");
      return;
    }

    const principal = parseFloat(amount);
    const calculatedInterest = parseFloat(rate) / 100 / 12;
    const calculatedPayments = parseFloat(months);

    const x = Math.pow(1 + calculatedInterest, calculatedPayments);
    const monthly = (principal * x * calculatedInterest) / (x - 1);

    if (isFinite(monthly)) {
      setResult(monthly.toFixed(2));
      setShowBanks(true);
    } else {
      alert("Hesablama xətası");
    }
  };

  const resetCalculator = () => {
    setAmount('');
    setMonths('');
    setRate('');
    setResult(null);
    setShowBanks(false);
  };

  const handleBankRedirect = (url) => {
    window.open(url, '_blank');
  };

  return (
    <div className="calc-container fade-in-up">
      <div className="calc-card">
        
        <div className="calc-header">
          <Calculator size={32} color="#2dd4bf" />
          <h2>Kredit Kalkulyatoru</h2>
        </div>

        <div className="calc-form">
          <div className="form-group">
            <label>Məbləğ (AZN)</label>
            <input 
              type="number" 
              placeholder="Məs: 5000" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Müddət (Ay)</label>
            <input 
              type="number" 
              placeholder="Məs: 12" 
              value={months}
              onChange={(e) => setMonths(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Faiz Dərəcəsi (%)</label>
            <input 
              type="number" 
              placeholder="Məs: 14" 
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
          </div>

          <div className="calc-actions">
             <button className="calc-btn primary" onClick={calculateLoan}>
               Hesabla
             </button>
             <button className="calc-btn secondary" onClick={resetCalculator}>
               <RefreshCw size={18} /> Sıfırla
             </button>
          </div>
        </div>

        {/* NƏTİCƏ */}
        {result && (
          <div className="calc-result animate-pop">
            <p>Aylıq Ödəniş:</p>
            <h1>{result} ₼</h1>
          </div>
        )}

        {/* BANK SEÇİMİ (LOGOLAR İLƏ) */}
        {showBanks && (
          <div className="banks-section animate-fade">
            <p className="banks-title">Sərfəli təklif üçün bank seçin:</p>
            <div className="banks-grid">
              {banksData.map((bank) => (
                <button 
                  key={bank.id} 
                  className="bank-btn"
                  style={{ borderLeft: `5px solid ${bank.color}` }}
                  onClick={() => handleBankRedirect(bank.url)}
                  title={bank.name} // Hover edəndə ad görünsün
                >
                  {/* LOGO BURADADIR */}
                  <img src={bank.logo} alt={bank.name} className="bank-logo-img" />
                  
                  {/* Redirect İkonu */}
                  <ExternalLink size={16} color="#64748b" className="redirect-icon"/>
                </button>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default CalculatorPage;