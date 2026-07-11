import React, {useEffect, useMemo, useState} from 'react';
import PopUp from './PopUp';
import TakeoutForm from './TakeoutForm';
import {createCustomer, getCustomers, updateCustomer} from '../services/customerApi';

const STORAGE_KEY = 'acai-pos-customers';

const readStoredCustomers = () => {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeStoredCustomers = (customers) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(customers));
  } catch {
    // Ignore storage failures.
  }
};

export default function CustomerSelectModal ({
  isOpen,
  onClose,
  onSelectCustomer,
  selectedCustomerLabel,
}) {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [formFirstName, setFormFirstName] = useState('');
  const [formLastName, setFormLastName] = useState('');
  const [formPhoneNumber, setFormPhoneNumber] = useState('');

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setMessage('');
    setSearchTerm('');
    setEditingCustomer(null);
    setFormFirstName('');
    setFormLastName('');
    setFormPhoneNumber('');

    const storedCustomers = readStoredCustomers();
    if (storedCustomers.length > 0) {
      setCustomers(storedCustomers);
    }

    const loadCustomers = async () => {
      setLoading(true);
      try {
        const remoteCustomers = await getCustomers();
        if (remoteCustomers.length > 0) {
          setCustomers(remoteCustomers);
          writeStoredCustomers(remoteCustomers);
        } else if (storedCustomers.length === 0) {
          setCustomers([]);
        }
      } catch (error) {
        if (storedCustomers.length === 0) {
          setMessage(error?.message || 'Unable to load customers');
        } else {
          setMessage('Using cached customer list');
        }
      } finally {
        setLoading(false);
      }
    };

    loadCustomers();
  }, [isOpen]);

  const filteredCustomers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      return customers;
    }

    return customers.filter((customer) => {
      const phone = String(customer.phoneNumber ?? '').toLowerCase();
      return phone.includes(term);
    });
  }, [customers, searchTerm]);

  const resetForm = () => {
    setEditingCustomer(null);
    setFormFirstName('');
    setFormLastName('');
    setFormPhoneNumber('');
    setMessage('');
  };

  const startAddCustomer = () => {
    resetForm();
  };

  const startEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setFormFirstName(customer.firstName || '');
    setFormLastName(customer.lastName || '');
    setFormPhoneNumber(customer.phoneNumber || '');
    setMessage(`Editing ${customer.firstName} ${customer.lastName}`);
  };

  const handleSelectCustomer = (customer) => {
    onSelectCustomer?.(customer);
    setMessage(`Selected ${customer.firstName} ${customer.lastName}`);
    onClose?.();
  };

  const upsertLocalCustomer = (nextCustomer) => {
    setCustomers((current) => {
      const nextList = current.some((customer) => customer.customerID === nextCustomer.customerID)
        ? current.map((customer) => (customer.customerID === nextCustomer.customerID ? nextCustomer : customer))
        : [nextCustomer, ...current];

      writeStoredCustomers(nextList);
      return nextList;
    });
  };

  const handleCustomerSubmit = async () => {
    const payload = {
      customerID: editingCustomer?.customerID,
      firstName: formFirstName.trim(),
      lastName: formLastName.trim(),
      phoneNumber: formPhoneNumber.trim(),
    };

    if (!payload.firstName || !payload.lastName || !payload.phoneNumber) {
      setMessage('First name, last name, and phone are required');
      return;
    }

    if (editingCustomer) {
      try {
        const response = await updateCustomer(payload);
        const nextCustomer = response?.customer ?? response?.data ?? response ?? payload;
        upsertLocalCustomer(nextCustomer);
        setMessage('Customer updated successfully');
        resetForm();
      } catch {
        const nextCustomer = payload;
        upsertLocalCustomer(nextCustomer);
        setMessage('Customer updated locally. Remote update endpoint was not available.');
        resetForm();
      }
      return;
    }

    try {
      const response = await createCustomer(payload);
      const nextCustomer = response?.customer ?? response?.data ?? response ?? payload;
      upsertLocalCustomer(nextCustomer);
      setMessage('Customer added successfully');
      resetForm();
    } catch {
      const nextCustomer = payload;
      upsertLocalCustomer(nextCustomer);
      setMessage('Customer saved locally. Check the create API response for backend wiring.');
      resetForm();
    }
  };

  return (
    <PopUp isOpen={isOpen} title="Select Customer" onClose={onClose} size="lg">
      <div className="space-y-4">
        <div className="flex items-center justify-between gap-3 rounded-2xl border border-purple-100 bg-purple-50 px-4 py-3 text-sm text-purple-700">
          <div>
            <div className="font-semibold text-purple-900">Customer picker</div>
            <div>{selectedCustomerLabel || 'No customer selected yet'}</div>
          </div>
          <button
            type="button"
            onClick={startAddCustomer}
            className="rounded-xl bg-purple-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-800"
          >
            Add New Customer
          </button>
        </div>

        <div className="space-y-3">
          <label className="block text-sm font-semibold text-purple-900">Search</label>
          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search by phone"
            className="w-full rounded-xl border border-purple-200 bg-white px-4 py-3 text-sm text-purple-900 outline-none transition placeholder:text-purple-300 focus:border-purple-400"
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
          <div className="overflow-hidden rounded-2xl border border-purple-200 bg-white shadow-sm">
            <div className="border-b border-purple-100 px-4 py-3 text-sm font-semibold text-purple-900">
              Customer list
            </div>
            <div className="max-h-90 overflow-auto">
              {loading ? (
                <div className="px-4 py-6 text-sm text-purple-700">Loading customers...</div>
              ) : filteredCustomers.length === 0 ? (
                <div className="px-4 py-6 text-sm text-purple-700">No customers found.</div>
              ) : (
                <table className="min-w-full text-left text-sm">
                  <thead className="sticky top-0 bg-purple-50 text-purple-900">
                    <tr>
                      <th className="px-4 py-3 font-semibold">First Name</th>
                      <th className="px-4 py-3 font-semibold">Last Name</th>
                      <th className="px-4 py-3 font-semibold">Phone</th>
                      <th className="px-4 py-3 font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCustomers.map((customer) => (
                      <tr key={customer.customerID} className="border-t border-purple-100">
                        <td className="px-4 py-3 text-purple-900">{customer.firstName}</td>
                        <td className="px-4 py-3 text-purple-900">{customer.lastName}</td>
                        <td className="px-4 py-3 text-purple-700">{customer.phoneNumber}</td>
                        <td className="px-4 py-3">
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleSelectCustomer(customer)}
                              className="rounded-lg bg-purple-900 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-purple-800"
                            >
                              Select
                            </button>
                            <button
                              type="button"
                              onClick={() => startEditCustomer(customer)}
                              className="rounded-lg bg-amber-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-amber-600"
                            >
                              Edit
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          <div className="space-y-3 rounded-2xl border border-purple-200 bg-purple-50 p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-purple-900">
                  {editingCustomer ? 'Edit customer' : 'Add customer'}
                </div>
                <div className="text-xs text-purple-700">
                  {editingCustomer ? 'Update the selected customer record.' : 'Create a new customer record.'}
                </div>
              </div>
              {editingCustomer && (
                <button
                  type="button"
                  onClick={startAddCustomer}
                  className="rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-purple-700 transition hover:bg-purple-100"
                >
                  New
                </button>
              )}
            </div>

            <TakeoutForm
              firstName={formFirstName}
              setFirstName={setFormFirstName}
              lastName={formLastName}
              setLastName={setFormLastName}
              phoneNumber={formPhoneNumber}
              setPhoneNumber={setFormPhoneNumber}
              required={true}
              onSubmit={handleCustomerSubmit}
              onCancel={resetForm}
              submitLabel={editingCustomer ? 'Save Changes' : 'Add Customer'}
              cancelLabel="Reset"
            />
          </div>
        </div>

        {message && <p className="text-sm text-purple-700">{message}</p>}
      </div>
    </PopUp>
  );
}