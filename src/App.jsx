import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useMenuState} from './state/MenuState';
import useAppState, {BASE_OPTIONS} from './state/AppState';
import Sidebar from './components/Sidebar';
import AppStatus from './components/AppStatus';
import CartSummary from './components/CartSummary';
import AppRoutes from './routes/AppRoutes';

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
    selectedAllergies,
    toggleAllergy,
    selectItem,
    addToCart,
    removeCartItem,
    clearCart,
    resetSelection,
    calculateItemPrice,
    cart,
    updateCartItem,
    sizeOptions,
    sizesLoading,
    itemPrice,
    priceLoading,
    addOns,
    addOnsLoading,
    allergies,
    allergiesLoading
  } = useAppState();

  useEffect(() => {
    if (activeCategory && activeCategory !== 'home') {
      loadSubmenu(activeCategory);
    }
  }, [activeCategory, loadSubmenu]);

  const calculateCurrentItemPrice = (item = selectedItem) => calculateItemPrice(item);

  const handleToppingToggle = (topping) => {
    toggleTopping(topping);
  };

  const handleAllergyToggle = (allergy) => {
    toggleAllergy(allergy);
  };

  const navigate = useNavigate();
  const [orderType, setOrderType] = useState('walk-in');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isTakeoutModalOpen, setIsTakeoutModalOpen] = useState(false);

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
  const cartTotal = cart.reduce((sum, item) => sum + item.finalPrice * (item.quantity || 1), 0);

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
        firstName={firstName}
        lastName={lastName}
        phoneNumber={phoneNumber}
        setFirstName={setFirstName}
        setLastName={setLastName}
        setPhoneNumber={setPhoneNumber}
      />

      <div className="flex-1 overflow-hidden">
        <div className="flex h-full flex-col px-6 py-5 overflow-y-auto">
          <AppRoutes
            itemsLoading={itemsLoading}
            activeItems={activeItems}
            activeCategoryName={activeCategoryName}
            onSelectItem={handleSelectItem}
            selectedItem={selectedItem}
            chosenSize={chosenSize}
            setChosenSize={setChosenSize}
            chosenBase={chosenBase}
            setChosenBase={setChosenBase}
            selectedToppings={selectedToppings}
            onToppingToggle={handleToppingToggle}
            selectedAllergies={selectedAllergies}
            onAllergyToggle={handleAllergyToggle}
            sizeOptions={sizeOptions}
            baseOptions={BASE_OPTIONS}
            addOns={addOns}
            allergies={allergies}
            getItemPrice={calculateCurrentItemPrice}
            onAddToCart={handleAddToCart}
            onBack={resetSelection}
            activeCategory={activeCategory}
            orderType={orderType}
            setOrderType={setOrderType}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            isTakeoutModalOpen={isTakeoutModalOpen}
            setIsTakeoutModalOpen={setIsTakeoutModalOpen}
          />
        </div>
      </div>

      <div className="w-95 overflow-y-auto border-l border-purple-200 bg-white p-2">
        <CartSummary
          cart={cart}
          cartTotal={cartTotal}
          onRemoveItem={removeCartItem}
          onClearCart={clearCart}
          onUpdateItem={updateCartItem}
          allergies={allergies}
          orderType={orderType}
          setOrderType={setOrderType}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          isTakeoutModalOpen={isTakeoutModalOpen}
          setIsTakeoutModalOpen={setIsTakeoutModalOpen}
        />
      </div>
    </div>
  );
}

export default App;
