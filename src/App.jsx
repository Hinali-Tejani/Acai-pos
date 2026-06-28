import React, {useEffect} from 'react';
import {Routes, Route, useNavigate} from 'react-router-dom';
import {useMenuState} from './state/MenuState';
import useAppState, {SIZE_OPTIONS, BASE_OPTIONS, PREMIUM_TOPPINGS} from './state/AppState';
import Sidebar from './components/Sidebar';
import MainWorkspace from './components/MainWorkspace';
import AppStatus from './components/AppStatus';
import ProductDetailPage from './pages/ProductDetailPage';
import CartSummary from './components/CartSummary';

function App () {
  const {categories, activeItems, loading, itemsLoading, error, loadSubmenu} = useMenuState();
  const {
    activeCategory,
    setActiveCategory,
    selectedItem,
    setSelectedItem,
    chosenSize,
    setChosenSize,
    chosenBase,
    setChosenBase,
    selectedToppings,
    toggleTopping,
    selectItem,
    addToCart,
    removeCartItem,
    clearCart,
    resetSelection,
    calculateItemPrice,
    cart
  } = useAppState();

  useEffect(() => {
    if (categories.length > 0 && !activeCategory) {
      setActiveCategory(categories[0].id);
    }
  }, [categories, activeCategory]);

  useEffect(() => {
    if (activeCategory) {
      loadSubmenu(activeCategory);
    }
  }, [activeCategory]);

  const calculateCurrentItemPrice = (item = selectedItem) => calculateItemPrice(item);

  const handleToppingToggle = (topping) => {
    toggleTopping(topping);
  };

  const navigate = useNavigate();

  const handleSelectItem = (item) => {
    selectItem(item);
    navigate(`/product/${item.id}`, {state: {item}});
  };

  const handleAddToCart = (itemParam) => {
    const item = itemParam || selectedItem;
    if (!item) return;
    addToCart(item, calculateItemPrice(item));
  };

  const activeCategoryName = categories.find(cat => cat.id === activeCategory)?.name || 'Category';
  const cartTotal = cart.reduce((sum, item) => sum + item.finalPrice, 0);

  if (loading || error) {
    return <AppStatus loading={loading} error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="flex h-screen w-screen bg-purple-50 text-purple-900">
      <Sidebar
        categories={categories}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
        onResetItem={resetSelection}
      />

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col px-6 py-5 overflow-y-auto">
          <Routes>
            <Route
              path="/"
              element={
                <MainWorkspace
                  itemsLoading={itemsLoading}
                  activeItems={activeItems}
                  activeCategoryName={activeCategoryName}
                  onSelectItem={handleSelectItem}
                />
              }
            />
            <Route
              path="/product/:id"
              element={
                <ProductDetailPage
                  selectedItem={selectedItem}
                  activeItems={activeItems}
                  chosenSize={chosenSize}
                  setChosenSize={setChosenSize}
                  chosenBase={chosenBase}
                  setChosenBase={setChosenBase}
                  selectedToppings={selectedToppings}
                  onToppingToggle={handleToppingToggle}
                  sizeOptions={SIZE_OPTIONS}
                  baseOptions={BASE_OPTIONS}
                  premiumToppings={PREMIUM_TOPPINGS}
                  getItemPrice={calculateCurrentItemPrice}
                  onAddToCart={handleAddToCart}
                  onBack={resetSelection}
                />
              }
            />
          </Routes>
        </div>
      </div>

      <div className="w-[380px] overflow-y-auto border-l border-purple-200 bg-white p-6">
        <CartSummary
          cart={cart}
          cartTotal={cartTotal}
          onRemoveItem={removeCartItem}
          onClearCart={clearCart}
        />
      </div>
    </div>
  );
}

export default App;
