import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]); 


  const fetchInitialData = useCallback(async () => {
    try {
      const storedUser = JSON.parse(localStorage.getItem('user'));
      if (storedUser) {
        const { data } = await api.get('/cards');
        setCards(data);
        setUser(storedUser);
        return data;
      }
    } catch (error) {
      console.error("Məlumat yüklənmə xətası:", error);
    }
  }, []);

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  return (
    <DataContext.Provider value={{ user, setUser, cards, setCards, fetchInitialData }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);