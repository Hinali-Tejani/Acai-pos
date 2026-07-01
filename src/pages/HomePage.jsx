import React from 'react';
import HomeActions from '../components/HomeActions';
import OrderTypeForm from '../components/OrderTypeForm';

export default function HomePage({
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
  return (
    <div className="h-full space-y-4">
      <div className="rounded-xl border border-purple-200 bg-white p-5 shadow-sm">
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

      {/* <div className="rounded-xl border border-dashed border-purple-200 bg-white px-6 py-8 text-sm text-purple-700 shadow-sm">
        <h3 className="text-lg font-semibold text-purple-900">Home</h3>
        <p className="mt-2">Choose a menu category from the sidebar to view products for that category.</p>
      </div> */}
    </div>
  );
}
