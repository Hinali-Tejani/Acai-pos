import api from './api';

export async function processPOSPayment (paymentData) {
	const response = await api.post('/Checkout/ProcessPOSPayment', paymentData);
	return response.data;
}
