import api from './api';

export async function printKitchenReceipt (order) {
    const response = await api.post('/Printer/PrintKitchenReceipt', order);
    return response.data;
}