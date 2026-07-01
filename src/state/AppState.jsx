import {useState} from 'react';

export const SIZE_OPTIONS = [
    {label: 'Small', priceModifier: 0},
    {label: 'Medium', priceModifier: 1.5},
    {label: 'Large', priceModifier: 3.5}
];

export const BASE_OPTIONS = [
    'Traditional Acai Blend',
    'Acai + Pitaya Swirl',
    'Coconut Overnight Oats Base'
];

export const PREMIUM_TOPPINGS = [
    {name: 'Organic Granola', price: 0.75},
    {name: 'Fresh Strawberries', price: 1.25},
    {name: 'Sliced Bananas', price: 0.5},
    {name: 'Almond Butter Drizzle', price: 1.5}
];

const useAppState = () => {
    const [activeCategory, setActiveCategory] = useState('home');
    const [selectedItem, setSelectedItem] = useState(null);
    const [chosenSize, setChosenSize] = useState('');
    const [chosenBase, setChosenBase] = useState('Traditional Acai Blend');
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [cart, setCart] = useState([]);

    const resetSelection = () => {
        setSelectedItem(null);
        setSelectedToppings([]);
        setChosenSize('');
        setChosenBase('Traditional Acai Blend');
    };

    const calculateItemPrice = (item, size = chosenSize, toppings = selectedToppings) => {
        if (!item) return 0;
        const basePrice = parseFloat(item.price || item.submenuPrice || 0) || 10;
        const sizeMod = SIZE_OPTIONS.find((option) => option.label === size)?.priceModifier || 0;
        const toppingsMod = toppings.reduce((sum, topping) => sum + (topping.price || 0), 0);
        return Math.max(0, basePrice + sizeMod + toppingsMod);
    };

    const toggleTopping = (topping) => {
        setSelectedToppings((current) => {
            if (current.some((item) => item.name === topping.name)) {
                return current.filter((item) => item.name !== topping.name);
            }
            return [...current, topping];
        });
    };

    const selectItem = (item) => {
        setSelectedItem(item);
        setChosenSize(item.size || 'Medium');
        setChosenBase('Traditional Acai Blend');
        setSelectedToppings([]);
    };

    const addToCart = (item, finalPrice) => {
        if (!item) return;
        const basePrice = parseFloat(item.price || item.submenuPrice || 0) || 10;
        setCart((currentCart) => [
            ...currentCart,
            {
                uid: Date.now(),
                id: item.id,
                name: item.submenuName || item.itemName || item.name || 'Acai Item',
                size: chosenSize || item.size || 'Medium',
                base: chosenBase,
                toppings: selectedToppings.map((t) => t.name),
                finalPrice: finalPrice ?? calculateItemPrice(item),
                quantity: 1,
                basePrice: basePrice,
            }
        ]);
    };

    const updateCartItem = (uid, changes) => {
        setCart((currentCart) => currentCart.map((it) => it.uid === uid ? {...it, ...changes} : it));
    };

    const removeCartItem = (uid) => {
        setCart((currentCart) => currentCart.filter((item) => item.uid !== uid));
    };

    const clearCart = () => {
        setCart([]);
    };

    return {
        activeCategory,
        setActiveCategory,
        selectedItem,
        setSelectedItem,
        chosenSize,
        setChosenSize,
        chosenBase,
        setChosenBase,
        selectedToppings,
        toggleTopping,
        selectItem,
        addToCart,
        removeCartItem,
        clearCart,
        resetSelection,
        calculateItemPrice,
        cart,
        updateCartItem
    };
}

export default useAppState;