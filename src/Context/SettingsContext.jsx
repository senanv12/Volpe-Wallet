import React, { createContext, useState, useEffect, useContext } from 'react';
import { translationsData } from '../Data/translations'; // Lüğəti import edirik

const SettingsContext = createContext();

export const useSettings = () => useContext(SettingsContext);

export const SettingsProvider = ({ children }) => {
  const [language, setLanguage] = useState('AZ');
  
  // --- VALYUTA ---
  const [currency, setCurrency] = useState('AZN');
  const [exchangeRates, setExchangeRates] = useState({});
  const [loading, setLoading] = useState(true);

  const currencyOptions = [
    { code: 'AZN', symbol: '₼', label: 'Manat' },
    { code: 'USD', symbol: '$', label: 'Dollar' },
    { code: 'EUR', symbol: '€', label: 'Euro' },
    { code: 'RUB', symbol: '₽', label: 'Ruble' },
    { code: 'TRY', symbol: '₺', label: 'Lira' },
    { code: 'GBP', symbol: '£', label: 'Pound' },
  ];

  useEffect(() => {
    fetch('https://open.er-api.com/v6/latest/USD')
      .then(res => res.json())
      .then(data => {
        setExchangeRates(data.rates);
        setLoading(false);
      })
      .catch(err => console.error("Valyuta xətası:", err));
  }, []);

  const convertAmount = (amountInAZN) => {
    if (loading || !exchangeRates[currency]) return amountInAZN;
    const aznRate = exchangeRates['AZN'];
    const targetRate = exchangeRates[currency];
    const amountInUSD = amountInAZN / aznRate;
    return (amountInUSD * targetRate);
  };

  const currentSymbol = currencyOptions.find(c => c.code === currency)?.symbol || '';

  // --- TƏRCÜMƏ FUNKSİYASI (YENİ) ---
  const t = (key) => {
    // Seçilmiş dildə sözü tapır, tapmasa olduğu kimi qaytarır
    return translationsData[language][key] || key;
  };

  return (
    <SettingsContext.Provider value={{ 
      language, 
      setLanguage, 
      currency, 
      setCurrency, 
      currencyOptions,
      convertAmount,
      currentSymbol,
      t // t funksiyasını ixrac edirik
    }}>
      {children}
    </SettingsContext.Provider>
  );
};