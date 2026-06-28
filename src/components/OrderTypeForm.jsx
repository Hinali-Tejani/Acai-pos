import React from 'react';
import TakeoutForm from './TakeoutForm';

export default function OrderTypeForm({
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
  const isTakeout = orderType === 'takeout';

  return (
    <div className="space-y-4 rounded-3xl border border-purple-200 bg-white p-5">
      <div className="space-y-3">
        <div className="text-sm font-semibold text-purple-900">Order Type</div>
        <div className="grid grid-cols-2 gap-2">
          <button
            className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${orderType === 'walk-in' ? 'bg-purple-900 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
            type="button"
            onClick={() => setOrderType('walk-in')}
          >
            Walk-in
          </button>
          <button
            className={`rounded-3xl px-4 py-3 text-sm font-semibold transition ${orderType === 'takeout' ? 'bg-purple-900 text-white' : 'bg-purple-100 text-purple-700 hover:bg-purple-200'}`}
            type="button"
            onClick={() => setOrderType('takeout')}
          >
            Takeout
          </button>
        </div>
      </div>

      {isTakeout && (
        <TakeoutForm
          ref={takeoutFormRef}
          firstName={firstName}
          setFirstName={setFirstName}
          lastName={lastName}
          setLastName={setLastName}
          phone={phone}
          setPhone={setPhone}
        />
      )}
    </div>
  );
}
