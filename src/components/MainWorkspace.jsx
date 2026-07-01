import React from 'react';
import ProductGrid from './ProductGrid';
import HomeActions from './HomeActions';
import OrderTypeForm from './OrderTypeForm';

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
  phone,
  setPhone,
  takeoutFormRef,
}) {
  const isHomeView = !activeCategoryName || activeCategoryName === 'home' || activeCategoryName === 'Home';

  if (itemsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="rounded-xl border border-purple-200 bg-white px-8 py-10 text-center shadow-sm">
          <h3 className="text-xl font-semibold text-purple-900">Querying Category Items...</h3>
        </div>
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
          phone={phone}
          setPhone={setPhone}
          takeoutFormRef={takeoutFormRef}
        />
        {/* <div className="mt-4">
          <OrderTypeForm
            orderType={orderType}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            phone={phone}
            setPhone={setPhone}
            takeoutFormRef={takeoutFormRef}
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
