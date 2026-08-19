import api from './api';

const normalizeMoney = (value) => Number(value) || 0;

const mapCartItems = (items = []) => items.map((item) => {
    const quantity = Number(item.quantity) || 1;
    const price = normalizeMoney(item.basePrice ?? item.price ?? item.finalPrice ?? 0);
    const totalPrice = normalizeMoney(item.finalPrice ?? price) * quantity;
    const toppings = Array.isArray(item.toppingDetails) && item.toppingDetails.length > 0
        ? item.toppingDetails
        : Array.isArray(item.allergyDetails) && item.allergyDetails.length > 0
            ? item.allergyDetails
            : [];

    return {
        itemID: Number(item.itemID ?? item.id ?? 0) || 0,
        qty: quantity,
        price,
        totalPrice,
        sizeID: Number(item.sizeID ?? 0) || 0,
        name: item.name || 'Item',
        toppings: toppings.map((topping) => ({
            itemID: Number(topping.itemID ?? item.id ?? 0) || 0,
            toppingID: Number(topping.toppingID ?? 0) || 0,
            qty: Number(topping.qty ?? 1) || 1,
            isAddon: Boolean(topping.isAddon),
            modifierName: topping.modifierName || topping.name || '',
            isRemovableTopping: Boolean(topping.isRemovableTopping),
            isAllergy: Boolean(topping.isAllergy),
            price: normalizeMoney(topping.price),
            totalPrice: normalizeMoney(topping.totalPrice ?? topping.price),
        })),
    };
});

export async function processOrder (orderPayload) {
    const response = await api.post('/Checkout/ProcessOrder', {
        totalAmt: normalizeMoney(orderPayload?.totalAmt),
        subTotal: normalizeMoney(orderPayload?.subTotal),
        tax: normalizeMoney(orderPayload?.tax),
        customerInfo: {
            customerID: orderPayload?.customerInfo?.customerID ?? 0,
            firstName: orderPayload?.customerInfo?.firstName || '',
            lastName: orderPayload?.customerInfo?.lastName || '',
            email: orderPayload?.customerInfo?.email || '',
            phoneNumber: orderPayload?.customerInfo?.phoneNumber || '',
            address: orderPayload?.customerInfo?.address || '',
            zipCode: orderPayload?.customerInfo?.zipCode || '',
            password: orderPayload?.customerInfo?.password || '',
            isGuest: Boolean(orderPayload?.customerInfo?.isGuest ?? true),
        },
        paymentMethod: orderPayload?.paymentMethod || '',
        ispaymentPending: Boolean(orderPayload?.ispaymentPending ?? false),
        items: mapCartItems(orderPayload?.items),
    });

    return response.data;
}
