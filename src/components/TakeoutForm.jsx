import React, { forwardRef, useImperativeHandle, useState } from 'react';

function TakeoutForm(
  {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phone,
    setPhone,
  },
  ref,
) {
  const [errors, setErrors] = useState({});

  const getFieldError = (field, value) => {
    const trimmed = value.trim();

    if (field === 'firstName' || field === 'lastName') {
      if (!trimmed) {
        return `${field === 'firstName' ? 'First' : 'Last'} name is required for takeout orders.`;
      }
      if (!/^[A-Za-z]+$/.test(trimmed)) {
        return `${field === 'firstName' ? 'First' : 'Last'} name must contain only letters.`;
      }
      if (trimmed.length <= 3) {
        return `${field === 'firstName' ? 'First' : 'Last'} name must be more than 3 letters.`;
      }
      return '';
    }

    if (field === 'phone') {
      if (!trimmed) {
        return 'Phone number is required for takeout orders.';
      }
      if (!/^[0-9]+$/.test(trimmed)) {
        return 'Phone number must contain only digits.';
      }
      if (trimmed.length !== 10) {
        return 'Phone number must be exactly 10 digits.';
      }
      return '';
    }

    return '';
  };

  const updateField = (field, setter, value) => {
    if (field === 'phone') {
      value = value.replace(/\D/g, '');
    }

    setter(value);

    if (!errors[field]) return;

    const error = getFieldError(field, value);
    setErrors((current) => {
      if (error) {
        return { ...current, [field]: error };
      }
      const next = { ...current };
      delete next[field];
      return next;
    });
  };

  useImperativeHandle(
    ref,
    () => ({
      validate: () => {
        const nextErrors = {};

        ['firstName', 'lastName', 'phone'].forEach((field) => {
          const value = field === 'firstName' ? firstName : field === 'lastName' ? lastName : phone;
          const error = getFieldError(field, value);
          if (error) nextErrors[field] = error;
        });

        setErrors(nextErrors);
        return Object.keys(nextErrors).length === 0;
      },
    }),
    [firstName, lastName, phone],
  );

  return (
    <div className="space-y-4 rounded-3xl border border-purple-200 bg-purple-50 p-4">
      <div>
        <label className="block text-sm font-semibold text-purple-900">First Name</label>
        <input
          className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-purple-900 outline-none transition placeholder:text-purple-300 focus:border-purple-400 ${errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-purple-200'}`}
          type="text"
          value={firstName}
          onChange={(e) => updateField('firstName', setFirstName, e.target.value)}
          placeholder="Jane"
        />
        {errors.firstName && <p className="mt-1 text-xs text-red-600">{errors.firstName}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-purple-900">Last Name</label>
        <input
          className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-purple-900 outline-none transition placeholder:text-purple-300 focus:border-purple-400 ${errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-purple-200'}`}
          type="text"
          value={lastName}
          onChange={(e) => updateField('lastName', setLastName, e.target.value)}
          placeholder="Doe"
        />
        {errors.lastName && <p className="mt-1 text-xs text-red-600">{errors.lastName}</p>}
      </div>

      <div>
        <label className="block text-sm font-semibold text-purple-900">Phone Number</label>
        <input
          className={`mt-2 w-full rounded-2xl border bg-white px-4 py-3 text-sm text-purple-900 outline-none transition placeholder:text-purple-300 focus:border-purple-400 ${errors.phone ? 'border-red-500 focus:border-red-500' : 'border-purple-200'}`}
          type="tel"
          value={phone}
          onChange={(e) => updateField('phone', setPhone, e.target.value)}
          placeholder="1234567890"
        />
        {errors.phone && <p className="mt-1 text-xs text-red-600">{errors.phone}</p>}
      </div>
    </div>
  );
}

export default forwardRef(TakeoutForm);
