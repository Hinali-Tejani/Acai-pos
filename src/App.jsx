import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useMenuState} from './state/MenuState';
import useAppState, {BASE_OPTIONS} from './state/AppState';
import {useThermalPrinter} from './hooks/useThermalPrinter';
import Sidebar from './components/Sidebar';
import AppStatus from './components/AppStatus';
import CartSummary from './components/CartSummary';
import AppRoutes from './routes/AppRoutes';
import TakeoutDetailsModal from './components/TakeoutDetailsModal';
import {processPOSPayment} from './services/paymentApi';

function App () {
  const {device, connectPrinter, printRaw} = useThermalPrinter();
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
    setSelectedToppings,
    toggleTopping,
    selectedAllergies,
    setSelectedAllergies,
    toggleAllergy,
    selectItem,
    addToCart,
    refundCart,
    addToRefundCart,
    removeRefundItem,
    updateRefundQuantity,
    clearRefundCart,
    refundTotal,
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
  const [isTakeoutDetailsOpen, setIsTakeoutDetailsOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingPaymentOrder, setPendingPaymentOrder] = useState(null);
  const [editingItemIndex, setEditingItemIndex] = useState(null);

  const handleSelectItem = (item) => {
    selectItem(item);
    setEditingItemIndex(null);
    navigate(`/product/${item.id}`, {state: {item}});
  };

  const handleSelectRefundItem = (item) => {
    selectItem(item);
    setEditingItemIndex(null);
    navigate(`/product/${item.id}`, {state: {item, refund: true}});
  };

  const handleAddToRefundCart = (item) => {
    addToRefundCart({
      ...item,
      size: chosenSize || sizeOptions[0]?.name || 'REGULAR',
      base: chosenBase,
      toppings: selectedToppings.map((topping) => topping.name),
      allergies: selectedAllergies.map((allergy) => allergy.name),
      finalPrice: calculateItemPrice(item),
    });
  };

  const handleEditLineItem = (index) => {
    const item = cart[index];
    if (!item) return;

    setEditingItemIndex(index);
    setSelectedItem(item);
    setChosenSize(item.size || sizeOptions[0]?.name || 'REGULAR');
    setChosenBase(item.base || BASE_OPTIONS[0]);
    setSelectedToppings((item.toppings || []).map((topping) => (
      addOns.find((addOn) => addOn.name === topping) || {name: topping, price: 0}
    )));
    setSelectedAllergies((item.allergies || []).map((allergy) => (
      allergies.find((availableAllergy) => availableAllergy.name === allergy) || {name: allergy, id: allergy}
    )));
    navigate(`/product/${item.id}`, {state: {item}});
  };

  const handleAddToCart = (itemParam) => {
    const item = itemParam || selectedItem;
    if (!item) return;

    if (editingItemIndex !== null) {
      const itemBeingEdited = cart[editingItemIndex];
      if (itemBeingEdited) {
        updateCartItem(itemBeingEdited.uid, {
          size: chosenSize || sizeOptions[0]?.name || 'REGULAR',
          base: chosenBase,
          toppings: selectedToppings.map((topping) => topping.name),
          allergies: selectedAllergies.map((allergy) => allergy.name),
          finalPrice: calculateItemPrice(item),
          basePrice: itemPrice,
        });
      }
      setEditingItemIndex(null);
      return;
    }

    addToCart(item, calculateItemPrice(item));
  };

  const handleDiscardChanges = () => {
    setEditingItemIndex(null);
    resetSelection();
  };

  const handleOpenPendingPaymentOrder = (order) => {
    setPendingPaymentOrder(order);
  };

  const handleProcessPayment = async (method, customOrderId = null, customTotal = null) => {
    const paymentMethod = method === 'CASH' ? 'CASH' : 'CARD';
    const checkoutPayload = {
      totalAmt: customTotal !== null ? Number(customTotal) || 0 : 0,
      orderID: customOrderId !== null ? Number(customOrderId) || 0 : 0,
      paymentMethod,
      cardNumber: paymentMethod === 'CARD' ? 'xxxx-xxxx-xxxx-1234' : '',
      cardType: paymentMethod === 'CARD' ? 'VISA' : '',
      transactionID: `${paymentMethod === 'CARD' ? 'TXN' : 'CASH'}-${Date.now()}`,
      transactionDateTime: new Date().toISOString(),
      referenceNumber: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
    };

    setIsProcessing(true);
    try {
      await processPOSPayment(checkoutPayload);
      alert('Payment completed successfully.');
      return true;
    } catch (error) {
      console.error('Checkout payment failed:', error);
      alert('Payment failed. Your order was not changed. Please try again.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  const activeCategoryName = categories.find(cat => cat.id === activeCategory)?.name || 'Category';
  const cartTotal = cart.reduce((sum, item) => sum + item.finalPrice * (item.quantity || 1), 0);

  if (loading || error) {
    return <AppStatus loading={loading} error={error} onRetry={() => window.location.reload()} />;
  }

  return (
    <div className="flex h-screen w-screen flex-col bg-gray-50 text-purple-900">
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
        isProcessing={isProcessing}
        onOpenPendingPaymentOrder={handleOpenPendingPaymentOrder}
      />

      <div className="flex min-h-0 flex-1 flex-row overflow-hidden">
        <div className="flex min-w-0 flex-1 flex-col overflow-y-auto px-2 py-4 sm:px-2 sm:py-2">
          <AppRoutes
            itemsLoading={itemsLoading}
            activeItems={activeItems}
            activeCategoryName={activeCategoryName}
            onSelectItem={handleSelectItem}
            onSelectRefundItem={handleSelectRefundItem}
            printerDevice={device}
            connectPrinter={connectPrinter}
            refundCart={refundCart}
            addToRefundCart={addToRefundCart}
            onAddToRefundCart={handleAddToRefundCart}
            removeRefundItem={removeRefundItem}
            updateRefundQuantity={updateRefundQuantity}
            clearRefundCart={clearRefundCart}
            refundTotal={refundTotal}
            selectedItem={selectedItem}
            chosenSize={chosenSize}
            setChosenSize={setChosenSize}
            chosenBase={chosenBase}
            setChosenBase={setChosenBase}
            selectedToppings={selectedToppings}
            editingItemIndex={editingItemIndex}
            onToppingToggle={handleToppingToggle}
            selectedAllergies={selectedAllergies}
            onAllergyToggle={handleAllergyToggle}
            sizeOptions={sizeOptions}
            baseOptions={BASE_OPTIONS}
            addOns={addOns}
            allergies={allergies}
            getItemPrice={calculateCurrentItemPrice}
            onAddToCart={handleAddToCart}
            onBack={handleDiscardChanges}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
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

        <div className="w-full shrink-0 overflow-y-auto border-t border-purple-200 bg-white lg:w-95 lg:border-t-0">
          <CartSummary
            cart={cart}
            cartTotal={cartTotal}
            onRemoveItem={removeCartItem}
            onClearCart={clearCart}
            onProcessPayment={handleProcessPayment}
            isProcessing={isProcessing}
            pendingPaymentOrder={pendingPaymentOrder}
            onPendingPaymentHandled={() => setPendingPaymentOrder(null)}
            onUpdateItem={updateCartItem}
            onEditItem={handleEditLineItem}
            editingItemIndex={editingItemIndex}
            orderType={orderType}
            setOrderType={setOrderType}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            onRequestTakeoutFormOpen={() => setIsTakeoutDetailsOpen(true)}
            printRaw={printRaw}
            refundCart={refundCart}
            addToRefundCart={addToRefundCart}
            removeRefundItem={removeRefundItem}
            updateRefundQuantity={updateRefundQuantity}
            clearRefundCart={clearRefundCart}
            refundTotal={refundTotal}
          />
        </div>
      </div>

      <TakeoutDetailsModal
        isOpen={isTakeoutDetailsOpen}
        onClose={() => setIsTakeoutDetailsOpen(false)}
        orderType={orderType}
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
      />

    </div>
  );
}

export default App;
