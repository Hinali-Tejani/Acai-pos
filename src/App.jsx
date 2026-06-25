import React, { useState, useEffect } from 'react';
import { useMenuState } from './state/MenuState';
import Sidebar from './components/Sidebar';
import ProductGrid from './components/ProductGrid';
import Customizer from './components/Customizer';
import CheckoutTicket from './components/CheckoutTicket';
import './App.css';

const SIZE_OPTIONS = [
  { label: 'Small', priceModifier: -1.50 },
  { label: 'Medium', priceModifier: 0.00 },
  { label: 'Large', priceModifier: 2.50 }
];
const BASE_OPTIONS = ['Traditional Acai Blend', 'Acai + Pitaya Swirl', 'Coconut Overnight Oats Base'];
const PREMIUM_TOPPINGS = [
  { name: 'Organic Granola', price: 0.75 },
  { name: 'Fresh Strawberries', price: 1.25 },
  { name: 'Sliced Bananas', price: 0.50 },
  { name: 'Almond Butter Drizzle', price: 1.50 }
];

function App() {
  // Bind directly to your clean State management files
  const { categories, activeItems, loading, itemsLoading, error, loadSubmenu } = useMenuState();

  const [activeCategory, setActiveCategory] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [chosenSize, setChosenSize] = useState('');
  const [chosenBase, setChosenBase] = useState('Traditional Acai Blend');
  const [selectedToppings, setSelectedToppings] = useState([]);
  const [cart, setCart] = useState([]);

  // Auto-trigger category loading on initialization
  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0]);
    }
  }, [categories, activeCategory]);

  // Load the correct sub-menu via the API anytime a user tabs into a new category
  useEffect(() => {
    if (activeCategory) {
      loadSubmenu(activeCategory);
    }
  }, [activeCategory]);

  const calculateCurrentItemPrice = () => {
    if (!selectedItem) return 0;
    const basePrice = parseFloat(selectedItem.price || selectedItem.submenuPrice || 0);
    const sizeMod = SIZE_OPTIONS.find(s => s.label === chosenSize)?.priceModifier || 0;
    const toppingsMod = selectedToppings.reduce((sum, top) => sum + top.price, 0);
    return Math.max(0, basePrice + sizeMod + toppingsMod);
  };

  const handleToppingToggle = (topping) => {
    if (selectedToppings.some(t => t.name === topping.name)) {
      setSelectedToppings(selectedToppings.filter(t => t.name !== topping.name));
    } else {
      setSelectedToppings([...selectedToppings, topping]);
    }
  };

  const handleAddToCart = () => {
    setCart([...cart, {
      uid: Date.now(),
      id: selectedItem.id,
      name: selectedItem.submenuName || selectedItem.itemName || selectedItem.name || 'Acai Item',
      size: chosenSize || selectedItem.size || 'Medium',
      base: chosenBase,
      toppings: selectedToppings.map(t => t.name),
      finalPrice: calculateCurrentItemPrice()
    }]);
    setSelectedItem(null);
    setSelectedToppings([]);
  };

  if (loading) return <div className="pos-centered-msg"><h3>Loading System Profiles...</h3></div>;
  if (error) return <div className="pos-error-banner"><h4>{error}</h4><button onClick={() => window.location.reload()}>Retry Connection</button></div>;

  return (
    <div className="pos-container">
      <Sidebar 
        categories={categories} 
        activeCategory={activeCategory} 
        onCategoryChange={setActiveCategory} 
        onResetItem={() => setSelectedItem(null)} 
      />

      <div className="pos-main-workspace">
        {itemsLoading ? (
          <div className="pos-centered-msg"><h3>Querying Category Items...</h3></div>
        ) : !selectedItem ? (
          /* Maps the new sub-menu array elements dynamically */
          <ProductGrid 
            items={activeItems} 
            activeCategory={activeCategory} 
            onSelectItem={(item) => { 
              setSelectedItem(item); 
              setChosenSize(item.size || 'Medium'); 
              setChosenBase('Traditional Acai Blend'); 
              setSelectedToppings([]); 
            }} 
          />
        ) : (
          <Customizer 
            selectedItem={selectedItem} chosenSize={chosenSize} setChosenSize={setChosenSize}
            chosenBase={chosenBase} setChosenBase={setChosenBase} selectedToppings={selectedToppings}
            onToppingToggle={handleToppingToggle} sizeOptions={SIZE_OPTIONS} baseOptions={BASE_OPTIONS}
            premiumToppings={PREMIUM_TOPPINGS} currentItemPrice={calculateCurrentItemPrice()}
            onBack={() => setSelectedItem(null)} onAddToCart={handleAddToCart}
          />
        )}
      </div>

      <CheckoutTicket 
        cart={cart} cartTotal={cart.reduce((sum, item) => sum + item.finalPrice, 0)} 
        onRemoveItem={(uid) => setCart(cart.filter(c => c.uid !== uid))} 
        onClearCart={() => setCart([])} 
      />
    </div>
  );
}

export default App;
