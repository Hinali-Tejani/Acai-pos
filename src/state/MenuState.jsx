import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

const MenuStateContext = createContext(null);

export function MenuStateProvider({ children }) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Sub-menu states to prevent repeating API requests for the same category
  const [submenuCache, setSubmenuCache] = useState({});
  const [activeItems, setActiveItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  // Helper map linking Category IDs from your .NET controller logic
  const categoryIdMap = {
    'bowls': 1,
    'smoothies': 2,
    'juice': 3,
    'roll icecream': 4
  };

  // 1. Initial boot connection to gather primary navigation tabs
  useEffect(() => {
    api.get('/getmainmenu')
      .then(res => {
        const itemsArray = Array.isArray(res.data) ? res.data : res.data.items || [];
        // Map unique category name properties cleanly
        const uniqueCats = [...new Set(itemsArray.map(i => i.categoryName || 'Bowls'))];
        setCategories(uniqueCats);
      })
      .catch(err => {
        console.error("Main Menu State Error:", err);
        setError('Could not connect to the primary menu data stream.');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  // 2. Fetch specific submenus dynamically when a category changes
  const loadSubmenu = async (categoryName) => {
    const normalizedKey = categoryName.toLowerCase().trim();
    const categoryId = categoryIdMap[normalizedKey] || 1; // Fallback to 1 if layout name changes

    // Return cached data immediately if we already fetched it during this session
    if (submenuCache[categoryId]) {
      setActiveItems(submenuCache[categoryId]);
      return;
    }

    try {
      setItemsLoading(true);
      const response = await api.get(`/getsubmenus/${categoryId}`);
      const submenuData = Array.isArray(response.data) ? response.data : response.data.items || [];
      
      // Save data locally in memory
      setSubmenuCache(prev => ({ ...prev, [categoryId]: submenuData }));
      setActiveItems(submenuData);
    } catch (err) {
      console.error(`Error loading submenu for category ID ${categoryId}:`, err);
      setActiveItems([]); // Fallback to safe empty grid view
    } finally {
      setItemsLoading(false);
    }
  };

  return (
    <MenuStateContext.Provider value={{ 
      categories, 
      activeItems, 
      loading, 
      itemsLoading, 
      error, 
      loadSubmenu 
    }}>
      {children}
    </MenuStateContext.Provider>
  );
}

export function useMenuState() {
  return useContext(MenuStateContext);
}
