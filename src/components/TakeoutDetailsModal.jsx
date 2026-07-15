import React from 'react';
import PopUp from './PopUp';
import OrderTypeForm from './OrderTypeForm';

export default function TakeoutDetailsModal ({
  isOpen,
  onClose,
  orderType,
  firstName,
  setFirstName,
  lastName,
  setLastName,
  phoneNumber,
  setPhoneNumber,
}) {
  return (
    <PopUp isOpen={isOpen} title="Takeout order details" onClose={onClose} size="md">
      <div className="space-y-3">
        <p className="text-sm text-purple-700">
          Customer information is required before you can pay now or pay later on a takeout order.
        </p>
        <OrderTypeForm
          orderType={orderType}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
          onSubmit={onClose}
          onCancel={onClose}
        />
      </div>
    </PopUp>
  );
}