import React, {createContext, useContext, useState, useEffect} from 'react';
import { getSubmenu } from '../services/menuApi';
import { useMenuStore } from '../context/MenuContext';

const MenuStateContext = createContext(null);

export function MenuStateProvider ({children}) {
  const { allItems: categories, loading, error: menuError } = useMenuStore();
  const [activeCategory, setActiveCategory] = useState(1);

  // Sub-menu states to prevent repeating API requests for the same category
  const [submenuCache, setSubmenuCache] = useState({});
  const [activeItems, setActiveItems] = useState([]);
  const [itemsLoading, setItemsLoading] = useState(false);

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
      const submenuData = await getSubmenu(catId);
      setSubmenuCache((prev) => ({ ...prev, [catId]: submenuData }));
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
      error: menuError,
      loadSubmenu
    }}>
      {children}
    </MenuStateContext.Provider>
  );
}

export function useMenuState () {
  return useContext(MenuStateContext);
}
