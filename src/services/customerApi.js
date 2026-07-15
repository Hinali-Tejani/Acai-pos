import api from './api';

export async function getCustomers () {
    try {
        const response = await api.get('/Customers/GetCustomers');
        return response.data;
    } catch (error) {
        if (error?.response?.status && error.response.status !== 404) {
            throw error;
        }
    }
    return [];
}

export async function createCustomer (customer) {
    const response = await api.post('/Customers/CreateCustomer', {
        firstName: customer.firstName,
        lastName: customer.lastName,
        phoneNumber: customer.phoneNumber,
    });
    return response.data;
}

export async function updateCustomer (customer) {
    const payload = {
        ...customer,
        customerId: customer.customerID,
    };

    try {
        const response = await api.put('/Customers/UpdateCustomer', payload);
        return response.data;
    } catch {
        const response = await api.patch('/Customers/UpdateCustomer', payload);
        return response.data;
    }
}