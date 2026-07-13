import api from './api';

const CUSTOMER_LIST_ENDPOINTS = [
    '/Customers/GetCustomers',
];

const normalizeCustomer = (customer = {}, index = 0) => ({
    customerId: customer.customerId ?? customer.customerID ?? customer.id ?? customer.ID ?? index,
    firstName: customer.firstName ?? customer.FirstName ?? '',
    lastName: customer.lastName ?? customer.LastName ?? '',
    phone: customer.phone ?? customer.Phone ?? '',
});

const normalizeCustomerList = (data) => {
    const items = Array.isArray(data) ? data : data?.items || data?.customers || data?.data || [];
    return items.map((customer, index) => normalizeCustomer(customer, index));
};

export async function getCustomers () {
    try {
        const response = await api.get('/Customers/GetCustomers');
        return normalizeCustomerList(response.data);
    } catch (error) {
        if (error?.response?.status && error.response.status !== 404) {
            throw error;
        }
    }
    return [];
}

export async function createCustomer (customer) {
    const response = await api.post('/Customers/CreateCustomer', customer);
    return response.data;
}

export async function updateCustomer (customer) {
    const payload = {
        ...customer,
        customerId: customer.customerId ?? customer.customerID ?? customer.id,
    };

    try {
        const response = await api.put('/Customers/UpdateCustomer', payload);
        return response.data;
    } catch {
        const response = await api.patch('/Customers/UpdateCustomer', payload);
        return response.data;
    }
}
