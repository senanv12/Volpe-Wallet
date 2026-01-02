import React, { useState, useEffect, useRef } from 'react';
import { ArrowRightLeft, RefreshCw, Search, Check, X } from 'lucide-react';
import { useSettings } from '../Context/SettingsContext';
import axios from 'axios';
import './css/ConverterCard.css';

// Hər ehtimala qarşı boş obyekt və ya default dəyər üçün yoxlamalar əlavə edildi
const CURRENCY_INFO = {
  AZN: { name: "Manat", flag: "🇦🇿" },
  USD: { name: "Dollar", flag: "🇺🇸" },
  EUR: { name: "Euro", flag: "🇪🇺" },
  TRY: { name: "Lira", flag: "🇹🇷" },
  RUB: { name: "Ruble", flag: "🇷🇺" },
  GBP: { name: "Pound", flag: "🇬🇧" },
  BTC: { name: "Bitcoin", flag: "₿" },
  ETH: { name: "Ethereum", flag: "Ξ" },
  SOL: { name: "Solana", flag: "S" },
  BNB: { name: "Binance", flag: "B" },
  XRP: { name: "Ripple", flag: "X" },
  DOGE: { name: "Dogecoin", flag: "Ð" }
};

const ConverterCard = () => {
  const { rates } = useSettings();
  const [amount, setAmount] = useState(1);
  const [fromCurr, setFromCurr] = useState('AZN');
  const [toCurr, setToCurr] = useState('BTC');
  const [result, setResult] = useState(0);
  const [allRates, setAllRates] = useState({});
  const [loading, setLoading] = useState(true);

  // Axtarış State-ləri
  const [activeSearch, setActiveSearch] = useState(null); 
  const [searchQuery, setSearchQuery] = useState("");

  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const { left, top } = cardRef.current.getBoundingClientRect();
    cardRef.current.style.setProperty("--mouseX", `${e.clientX - left}px`);
    cardRef.current.style.setProperty("--mouseY", `${e.clientY - top}px`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const cryptoRes = await axios.get('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple,dogecoin&vs_currencies=usd');
        const cData = cryptoRes.data;
        const cryptoRates = { BTC: cData.bitcoin.usd, ETH: cData.ethereum.usd, SOL: cData.solana.usd, BNB: cData.binancecoin.usd, XRP: cData.ripple.usd, DOGE: cData.dogecoin.usd };
        
        const aznToUsd = rates['USD'] || 0.588;
        const fiatRatesInUSD = {};
        Object.keys(rates).forEach(key => { 
            fiatRatesInUSD[key] = (1 / rates[key]) * aznToUsd; 
        });

        setAllRates({ ...fiatRatesInUSD, ...cryptoRates });
        setLoading(false);
      } catch (e) { 
        console.error("API Error:", e);
        setLoading(false);
      }
    };
    if (rates && Object.keys(rates).length > 0) fetchData();
  }, [rates]);

  useEffect(() => {
    if (!allRates[fromCurr] || !allRates[toCurr]) return;
    setResult((amount * allRates[fromCurr]) / allRates[toCurr]);
  }, [amount, fromCurr, toCurr, allRates]);

  // Təhlükəsiz filtrləmə (Undefined obyekt yoxlaması ilə)
  const filteredCurrencies = Object.keys(allRates).filter(curr => {
    const info = CURRENCY_INFO[curr] || { name: "" };
    return curr.toLowerCase().includes(searchQuery.toLowerCase()) || 
           info.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const selectCurrency = (code) => {
    if (activeSearch === 'from') setFromCurr(code);
    else setToCurr(code);
    setActiveSearch(null);
    setSearchQuery("");
  };

  return (
    <div className="magic-card" ref={cardRef} onMouseMove={handleMouseMove}>
      <div className="magic-border"></div>
      <div className="magic-content">
        <div className="mc-header">
          <h3>Valyuta Çevirici</h3>
          <RefreshCw size={28} className={loading ? "spin" : ""} />
        </div>

        <div className="mc-body">
          <div className="mc-group large">
            <label>Məbləğ</label>
            <input 
              type="number" 
              value={amount} 
              onChange={(e) => setAmount(parseFloat(e.target.value) || 0)} 
            />
          </div>

          <div className="mc-row large">
            <div className="search-select-container">
              <label>Bundan</label>
              <div className="search-trigger" onClick={() => setActiveSearch('from')}>
                <span className="ui-flag">{CURRENCY_INFO[fromCurr]?.flag || "🌐"}</span>
                <span className="ui-code">{fromCurr}</span>
              </div>
            </div>

            <button className="mc-swap-btn large" onClick={() => { setFromCurr(toCurr); setToCurr(fromCurr); }}>
              <ArrowRightLeft size={28} />
            </button>

            <div className="search-select-container">
              <label>Buna</label>
              <div className="search-trigger" onClick={() => setActiveSearch('to')}>
                <span className="ui-flag">{CURRENCY_INFO[toCurr]?.flag || "🌐"}</span>
                <span className="ui-code">{toCurr}</span>
              </div>
            </div>
          </div>

          {/* SEARCH MODAL */}
          {activeSearch && (
            <div className="search-overlay animate-fade">
              <div className="search-box-wrapper">
                <div className="search-input-box">
                  <Search size={20} color="#2dd4bf" />
                  <input 
                    autoFocus 
                    placeholder="Valyuta axtar..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <X size={20} className="close-search" onClick={() => setActiveSearch(null)} />
                </div>
                <div className="search-results">
                  {filteredCurrencies.length > 0 ? filteredCurrencies.map(code => (
                    <div key={code} className="search-item" onClick={() => selectCurrency(code)}>
                      <span className="s-flag">{CURRENCY_INFO[code]?.flag || "🌐"}</span>
                      <div className="s-info">
                        <span className="s-code">{code}</span>
                        <span className="s-name">{CURRENCY_INFO[code]?.name || ""}</span>
                      </div>
                      {(activeSearch === 'from' ? fromCurr : toCurr) === code && <Check size={18} color="#2dd4bf" />}
                    </div>
                  )) : <div className="no-results">Heç nə tapılmadı</div>}
                </div>
              </div>
            </div>
          )}

          <div className="mc-result giant">
            <span>Nəticə:</span>
            <h2>
              {result < 0.0001 ? result.toFixed(8) : result.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})} 
              <small> {toCurr}</small>
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConverterCard;