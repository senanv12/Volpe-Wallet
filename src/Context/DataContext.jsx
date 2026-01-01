import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [cards, setCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);

  // İstifadəçini localstorage-dən oxu
  useEffect(() => {
    const loggedInUser = JSON.parse(localStorage.getItem('user'));
    setUser(loggedInUser);
    if (loggedInUser) {
      refreshData();
    }
  }, []);

  // Məlumatları Backend-dən gətirən funksiya
  const refreshData = async () => {
    setLoading(true);
    try {
      const [cardsRes, transRes] = await Promise.all([
        api.get('/cards'),
        api.get('/transactions')
      ]);
      setCards(cardsRes.data);
      setTransactions(transRes.data);
    } catch (error) {
      console.error("Data gətirilə bilmədi:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DataContext.Provider value={{ 
      cards, 
      transactions, 
      loading, 
      refreshData, // Bu funksiyanı çağıranda hər yer yenilənəcək
      user 
    }}>
      {children}
    </DataContext.Provider>
  );
};