import React from 'react';
import {Routes, Route} from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CategoryProductsPage from '../pages/CategoryProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import ManagerMenu from '../pages/ManagerMenu';
import RefundScreen from '../pages/RefundScreen';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes({
  itemsLoading,
  activeItems,
  activeCategoryName,
  onSelectItem,
  refundCart,
  addToRefundCart,
  removeRefundItem,
  updateRefundQuantity,
  clearRefundCart,
  refundTotal,
  selectedItem,
  chosenSize,
  setChosenSize,
  chosenBase,
  setChosenBase,
  selectedToppings,
  onToppingToggle,
  selectedAllergies,
  onAllergyToggle,
  sizeOptions,
  baseOptions,
  addOns,
  allergies,
  getItemPrice,
  onAddToCart,
  onBack,
  activeCategory,
  orderType,
  setOrderType,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phoneNumber,
  setPhoneNumber,
  isTakeoutModalOpen,
  setIsTakeoutModalOpen,
}) {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <HomePage
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
        }
      />
      <Route
        path="/home"
        element={
          <HomePage
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
        }
      />
      <Route
        path="/products/:categoryId"
        element={
          <CategoryProductsPage
            itemsLoading={itemsLoading}
            activeItems={activeItems}
            activeCategoryName={activeCategoryName}
            onSelectItem={onSelectItem}
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
            onToppingToggle={onToppingToggle}
            selectedAllergies={selectedAllergies}
            onAllergyToggle={onAllergyToggle}
            sizeOptions={sizeOptions}
            baseOptions={baseOptions}
            addOns={addOns}
            allergies={allergies}
            getItemPrice={getItemPrice}
            onAddToCart={onAddToCart}
            onBack={onBack}
            activeCategory={activeCategory}
          />
        }
      />
      <Route
        path="/manager-menu"
        element={<ManagerMenu />}
      />
      <Route
        path="/manager/refund"
        element={
          <RefundScreen
            refundCart={refundCart}
            addToRefundCart={addToRefundCart}
            removeRefundItem={removeRefundItem}
            updateRefundQuantity={updateRefundQuantity}
            clearRefundCart={clearRefundCart}
            refundTotal={refundTotal}
          />
        }
      />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
