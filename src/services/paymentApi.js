import api from './api';

export async function processOrder ({totalAmt, subTotal, tax, firstName, lastName, phoneNumber, cart, paymentMethod, isPayLater}) {

	const response = await api.post('/Checkout/ProcessOrder', {
		totalAmt,
		subTotal,
		tax,
		customerInfo: {
			customerID: 0,
			firstName: firstName || '',
			lastName: lastName || '',
			email: '',
			phoneNumber: phoneNumber || '',
			isGuest: phoneNumber || firstName ? 0 : 1,
		},
		paymentMethod,
		isWebOrder: false,
		ispaymentPending: isPayLater,
		items: cart.map((item) => ({
			itemID: item.id,
			qty: item.quantity || 1,
			price: parseFloat(item.basePrice || item.finalPrice || 0).toFixed(2),
			totalPrice: parseFloat((item.finalPrice || 0) * (item.quantity || 1)).toFixed(2),
			sizeID: item.sizeId || 0,
			name: item.name,
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
}

export async function processPOSPayment (paymentData) {
	const response = await api.post('/Checkout/ProcessPOSPayment', paymentData);
	return response.data;
}
