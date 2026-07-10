import React from 'react';
import {Routes, Route} from 'react-router-dom';
import HomePage from '../pages/HomePage';
import CategoryProductsPage from '../pages/CategoryProductsPage';
import ProductDetailPage from '../pages/ProductDetailPage';
import NotFoundPage from '../pages/NotFoundPage';

export default function AppRoutes({
  itemsLoading,
  activeItems,
  activeCategoryName,
  onSelectItem,
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
  takeoutFormRef,
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
            takeoutFormRef={takeoutFormRef}
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
            takeoutFormRef={takeoutFormRef}
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
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
