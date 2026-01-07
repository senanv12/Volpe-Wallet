import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api';

const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [language, setLanguage] = useState(localStorage.getItem('appLang') || 'AZ');
  const [translations, setTranslations] = useState({});
  const [loadingLang, setLoadingLang] = useState(true);
  const [currency, setCurrency] = useState(localStorage.getItem('appCurrency') || 'AZN');
  const [rates, setRates] = useState({ AZN: 1, USD: 0.59, EUR: 0.54, TRY: 18.5, GBP: 0.46, RUB: 53.0 });

  const currencyOptions = [
    { code: 'AZN', symbol: '₼' },
    { code: 'TRY', symbol: '₺' },
    { code: 'USD', symbol: '$' },
    { code: 'GBP', symbol: '£' },
    { code: 'EUR', symbol: '€' },
    { code: 'RUB', symbol: '₽' }
  ];

  useEffect(() => {
    const fetchTranslations = async () => {
      setLoadingLang(true);
      try {
        const { data } = await api.get(`/translations?lang=${language}`);
        setTranslations(data);
        localStorage.setItem('appLang', language);
      } catch (error) {
        console.error("Dil yüklənmədi:", error);
      } finally {
        setLoadingLang(false);
      }
    };
    fetchTranslations();
  }, [language]);


  useEffect(() => {
    const fetchRates = async () => {
      try {
        const { data } = await api.get('/rates');
        setRates(data);
      } catch (error) {
        console.error("Məzənnələr alınmadı");
      }
    };
    fetchRates();
  }, []);

  useEffect(() => {
    localStorage.setItem('appCurrency', currency);
  }, [currency]);

  const t = (key) => {
    const fallbacks = {
      greeting_hello: "Salam",
      balance_increasing: "Balansın artır.",
      current_balance: "Cari Balans",
      welcome: "Xoş Gəldin",
      active: "AKTİV",
      status: "Status",
      nav_cards: "Kartlar",
      nav_transactions: "Bazar",
      nav_calculator: "Kalkulyator",
      stat_balance: "Kartların Cəmi",
      card_expires: "BİTMƏ TARİXİ"
    };

    if (loadingLang || !translations[key]) {
      return fallbacks[key] || key;
    }
    return translations[key];
  };

  const convertAmount = (amountInAZN) => {
    if (!amountInAZN) return 0;
    const rate = rates[currency] || 1;
    return amountInAZN * rate;
  };

  const currentSymbol = currencyOptions.find(c => c.code === currency)?.symbol || '';

  return (
    <SettingsContext.Provider value={{ 
      language, setLanguage, t, loadingLang,
      currency, setCurrency, currencyOptions, 
      convertAmount, currentSymbol, rates 
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => useContext(SettingsContext);