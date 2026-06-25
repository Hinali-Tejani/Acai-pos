import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [allItems, setAllItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Fetches your .NET endpoint exactly once on boot
    api.get('/getmainmenu')
      .then(res => {
        const itemsArray = Array.isArray(res.data) ? res.data : res.data.items || [];
        setAllItems(itemsArray);
        
        // Dynamically extrapolate unique categories
        const uniqueCats = [...new Set(itemsArray.map(i => i.categoryName || 'Signature Bowls'))];
        setCategories(uniqueCats);
      })
      .catch(err => {
        console.error("Global Store Error:", err);
        setError('Could not load menu data from the live server.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []); // Empty array ensures this fires exactly once globally

  return (
    <MenuContext.Provider value={{ allItems, categories, loading, error }}>
      {children}
    </MenuContext.Provider>
  );
}

// Custom hook for simple component access
export function useMenuStore() {
  return useContext(MenuContext);
}
