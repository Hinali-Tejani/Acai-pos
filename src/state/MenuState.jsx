import React, {createContext, useContext, useState, useEffect} from 'react';
import api from '../services/api';

const MenuStateContext = createContext(null);

export function MenuStateProvider ({children}) {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeCategory, setActiveCategory] = useState(1);

  // Sub-menu states to prevent repeating API requests for the same category
  const [submenuCache, setSubmenuCache] = useState({});
  const [activeItems, setActiveItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);

  // 1. Initial boot connection to gather primary navigation tabs
  useEffect(() => {
    loadMenu();

  }, []);

  const loadMenu = async () => {
    try {
      const res = await api.get('/getmainmenu');
      const itemsArray = Array.isArray(res.data) ? res.data : res.data.items || [];
      setCategories(itemsArray);

    } catch (error) {
      console.error("Main Menu State Error:", err);
      setError('Could not connect to the primary menu data stream.');
    }
    setLoading(false);
  }

  // 2. Fetch specific submenus dynamically when a category changes
  const loadSubmenu = async (catId) => {
    const normalizedKey = catId || 1;
    setActiveCategory(normalizedKey);

    // Return cached data immediately if we already fetched it during this session
    if (submenuCache[catId]) {
      setActiveItems(submenuCache[catId]);
      return;
    }

    try {
      setItemsLoading(true);
      const response = await api.get(`/getsubmenus/${catId}`);
      const submenuData = Array.isArray(response.data) ? response.data : response.data.items || [];

      // Save data locally in memory
      setSubmenuCache(prev => ({...prev, [catId]: submenuData}));
      setActiveItems(submenuData);
    } catch (err) {
      console.error(`Error loading submenu for category ID ${catId}:`, err);
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

export function useMenuState () {
  return useContext(MenuStateContext);
}
