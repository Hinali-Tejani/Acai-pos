import React from 'react';
import ProductGrid from './ProductGrid';
import HomeActions from './HomeActions';
import OrderTypeForm from './OrderTypeForm';
import Spinner from './Spinner';

export default function MainWorkspace ({
  itemsLoading,
  activeItems,
  activeCategoryName,
  onSelectItem,
  orderType,
  setOrderType,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phoneNumber,
  setPhoneNumber,
}) {
  const isHomeView = !activeCategoryName || activeCategoryName === 'home' || activeCategoryName === 'Home';

  if (itemsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className=" space-y-4">
      <div className="rounded-xl border border-purple-200 bg-white p-5 shadow-sm h-full">
        <HomeActions
          orderType={orderType}
          setOrderType={setOrderType}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
        {/* <div className="mt-4">
          <OrderTypeForm
            orderType={orderType}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
          />
        </div> */}
      </div>

      {isHomeView ? (
        <div className="rounded-xl border border-dashed border-purple-200 bg-white px-6 py-8 text-sm text-purple-700 shadow-sm">
          <h3 className="text-lg font-semibold text-purple-900">Home</h3>
          <p className="mt-2">Choose a menu category from the sidebar to view bowls and products.</p>
        </div>
      ) : (
        <div className="h-full overflow-y-auto">
          <ProductGrid
            items={activeItems}
            activeCategory={activeCategoryName}
            onSelectItem={onSelectItem}
          />
        </div>
      )}
    </div>
  );
}
