import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { getMainMenu } from '../services/menuApi';

const MenuContext = createContext(null);

export function MenuProvider({ children }) {
  const [allItems, setAllItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const hasLoaded = useRef(false);

  useEffect(() => {
    if (hasLoaded.current) return;
    hasLoaded.current = true;

    getMainMenu()
      .then((itemsArray) => {
        setAllItems(itemsArray);

        const uniqueCats = [...new Set(itemsArray.map((i) => i.categoryName || 'Signature Bowls'))];
        setCategories(uniqueCats);
      })
      .catch((err) => {
        console.error('Global Store Error:', err);
        setError('Could not load menu data from the live server.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
