import React from 'react';
import TakeoutForm from './TakeoutForm';

export default function OrderTypeForm ({
  orderType,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phoneNumber,
  setPhoneNumber,
  onSubmit,
  onCancel,
}) {
  if (!orderType) {
    return (
      <div className="rounded-xl border border-purple-200 bg-purple-50 p-4 text-sm text-purple-700">
        Select a quick action to begin an order.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="text-sm font-semibold text-purple-900">
        {orderType === 'takeout' ? 'Takeout details' : 'Walk-in details'}
      </div>
      <TakeoutForm
        firstName={firstName}
        setFirstName={setFirstName}
        lastName={lastName}
        setLastName={setLastName}
        phoneNumber={phoneNumber}
        setPhoneNumber={setPhoneNumber}
        required={orderType === 'takeout'}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
    </div>
  );
}
