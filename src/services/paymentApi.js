import api from './api';

export async function processOrder ({totalAmt, subTotal, tax, firstName, lastName, phoneNumber, cart, paymentMethod, isPayLater, orderType, selectedCustomer}) {
	try {
		const response = await api.post('/Checkout/ProcessOrder', {
			totalAmt,
			subTotal,
			tax,
			customerInfo: {
				customerID: selectedCustomer?.customerID || selectedCustomer?.id || 0,
				firstName: firstName || '',
				lastName: lastName || '',
				email: '',
				phoneNumber: phoneNumber || '',
				isGuest: (orderType === 'walk-in' && !phoneNumber && !selectedCustomer),
			},
			paymentMethod: isPayLater ? 'Pay at Store' : paymentMethod,
			isWebOrder: false,
			ispaymentPending: isPayLater,
			items: cart.map((item) => ({
				itemID: Number(item.id || item.itemID || 0),
				qty: Number(item.quantity || item.itemQty || 1),
				price: Number(item.basePrice || item.finalPrice || 0).toFixed(2),
				totalPrice: Number((item.finalPrice || 0) * (item.quantity || item.itemQty || 1)).toFixed(2),
				sizeID: Number(item.sizeID || item.sizeId || item.itemSizeID || 0),
				name: item.name || item.itemName || '',
				toppings: [
					...(item.toppings || []).map((topping) => ({
						itemID: item.id,
						toppingID: topping.addonID || topping.id || topping.toppingID || 0,
						qty: topping.quantity || 1,
						isAddon: topping.isAddon ?? true,
						modifierName: topping.name || '',
						isRemovableTopping: topping.isRemovable ?? false,
						isAllergy: topping.isAllergy ?? false,
						price: Number(topping.price || 0),
						totalPrice: Number(topping.totalPrice || topping.price || 0),
					})),
					...(item.allergies || []).map((allergy) => ({
						itemID: item.id,
						toppingID: allergy.id,
						qty: 1,
						isAddon: false,
						modifierName: allergy.name || '',
						isRemovableTopping: false,
						isAllergy: true,
						price: 0,
						totalPrice: 0,
					})),
				],
			})),
		});

		return response.data;
	} catch (error) {
		if (error.response && error.response.data) {
			return Promise.reject(error.response.data);
		}
		return Promise.reject({
			message: 'An unknown error occurred.',
		});
	}
}

export async function processPOSPayment (paymentData) {
	const response = await api.post('/Checkout/ProcessPOSPayment', paymentData);
	return response.data;
}
