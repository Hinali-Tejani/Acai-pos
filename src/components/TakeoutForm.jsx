import React, {forwardRef, useImperativeHandle, useState} from 'react';

function TakeoutForm (
  {
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phoneNumber,
    setPhoneNumber,
    required = true,
    onSubmit,
    onCancel,
    submitLabel = 'Submit',
    cancelLabel = 'Cancel',
  },
  ref,
) {
  const [errors, setErrors] = useState({});

  const getFieldError = (field, value) => {
    if (!required) return '';

    const trimmed = value.trim();

    if (field === 'firstName' || field === 'lastName') {
      if (!trimmed) {
        return `${field === 'firstName' ? 'First' : 'Last'} name is required`;
      }
      return '';
    }

    if (field === 'phoneNumber') {
      if (!trimmed) {
        return 'Phone number is required';
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
    if (field === 'phoneNumber') {
      value = value.replace(/\D/g, '');
    }

    setter(value);

    if (!errors[field]) return;

    const error = getFieldError(field, value);
    setErrors((current) => {
      if (error) {
        return {...current, [field]: error};
      }
      const next = {...current};
      delete next[field];
      return next;
    });
  };

  const validateForm = () => {
    const nextErrors = {};

    if (!required) {
      setErrors({});
      return true;
    }

    ['firstName', 'lastName', 'phoneNumber'].forEach((field) => {
      const value = field === 'firstName' ? firstName : field === 'lastName' ? lastName : phoneNumber;
      const error = getFieldError(field, value);
      if (error) nextErrors[field] = error;
    });

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!validateForm()) {
      return;
    }

    onSubmit?.({firstName, lastName, phoneNumber});
  };

  const handleCancel = () => {
    onCancel?.();
  };

  useImperativeHandle(
    ref,
    () => ({
      validate: () => validateForm(),
    }),
    [firstName, lastName, phoneNumber, required],
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-purple-200 bg-purple-50 p-4 pb-0">
      <div>
        <label className="block text-sm font-semibold text-purple-900">First Name</label>
        <input
          className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-purple-900 outline-none transition placeholder:text-purple-300 focus:border-purple-400 ${errors.firstName ? 'border-red-500 focus:border-red-500' : 'border-purple-200'}`}
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
          className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-purple-900 outline-none transition placeholder:text-purple-300 focus:border-purple-400 ${errors.lastName ? 'border-red-500 focus:border-red-500' : 'border-purple-200'}`}
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
          className={`mt-2 w-full rounded-xl border bg-white px-4 py-3 text-sm text-purple-900 outline-none transition placeholder:text-purple-300 focus:border-purple-400 ${errors.phoneNumber ? 'border-red-500 focus:border-red-500' : 'border-purple-200'}`}
          type="tel"
          value={phoneNumber}
          onChange={(e) => updateField('phoneNumber', setPhoneNumber, e.target.value)}
          placeholder="1234567890"
        />
        {errors.phoneNumber && <p className="mt-1 text-xs text-red-600">{errors.phoneNumber}</p>}
      </div>

      <button type="submit" className="mr-2 rounded-xl bg-purple-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-700">
        {submitLabel}
      </button>
      <button
        type="button"
        onClick={handleCancel}
        className="rounded-xl bg-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-300"
      >
        {cancelLabel}
      </button>
    </form>
  );
}

export default forwardRef(TakeoutForm);
