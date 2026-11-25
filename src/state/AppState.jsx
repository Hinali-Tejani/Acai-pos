import {useState, useEffect, useRef} from 'react';
import {getSizes, getPrice, getAddOns, getAllergies} from '../services/menuApi';

export const BASE_OPTIONS = [
    'Traditional Acai Blend',
    'Acai + Pitaya Swirl',
    'Coconut Overnight Oats Base'
];

const useAppState = () => {
    const [activeCategory, setActiveCategory] = useState('home');
    const [selectedItem, setSelectedItem] = useState(null);
    const [chosenSize, setChosenSize] = useState('');
    const [chosenBase, setChosenBase] = useState('Traditional Acai Blend');
    const [selectedToppings, setSelectedToppings] = useState([]);
    const [selectedAllergies, setSelectedAllergies] = useState([]);
    const [cart, setCart] = useState([]);
    const [refundCart, setRefundCart] = useState([]);
    const [sizeOptions, setSizeOptions] = useState([]);
    const [sizesLoading, setSizesLoading] = useState(false);
    const [priceCache, setPriceCache] = useState({}); // Cache for item+size prices
    const [itemPrice, setItemPrice] = useState(0);
    const [priceLoading, setPriceLoading] = useState(false);
    const [addOns, setAddOns] = useState([]);
    const [addOnsLoading, setAddOnsLoading] = useState(false);
    const [allergies, setAllergies] = useState([]);
    const [allergiesLoading, setAllergiesLoading] = useState(false);

    // Cache refs to prevent duplicate API calls
    const addonsCache = useRef({});
    const sizesCache = useRef({});
    const allergiesLoaded = useRef(false);

    // Fetch allergies on component mount
    useEffect(() => {
        if (allergiesLoaded.current) return;

        const loadAllergies = async () => {
            try {
                setAllergiesLoading(true);
                const fetchedAllergies = await getAllergies();
                setAllergies(fetchedAllergies);
                allergiesLoaded.current = true;
            } catch (error) {
                console.error('Error loading allergies:', error);
                setAllergies([]);
            } finally {
                setAllergiesLoading(false);
            }
        };

        loadAllergies();
    }, []);

    // Fetch add-ons when active category changes
    useEffect(() => {
        const loadAddOns = async () => {
            if (activeCategory === 'home' || !activeCategory) {
                setAddOns([]);
                return;
            }

            // Check cache first
            if (addonsCache.current[activeCategory]) {
                setAddOns(addonsCache.current[activeCategory]);
                return;
            }

            try {
                setAddOnsLoading(true);
                const fetchedAddOns = await getAddOns(activeCategory);
                setAddOns(fetchedAddOns);
                // Cache the result
                addonsCache.current[activeCategory] = fetchedAddOns;
            } catch (error) {
                console.error('Error loading add-ons:', error);
                setAddOns([]);
            } finally {
                setAddOnsLoading(false);
            }
        };

        loadAddOns();
    }, [activeCategory]);

    // Fetch sizes when active category changes
    useEffect(() => {
        const loadSizes = async () => {
            if (activeCategory === 'home' || !activeCategory) {
                setSizeOptions([]);
                return;
            }

            // Check cache first
            if (sizesCache.current[activeCategory]) {
                setSizeOptions(sizesCache.current[activeCategory]);
                return;
            }

            try {
                setSizesLoading(true);
                const fetchedSizes = await getSizes(activeCategory);
                setSizeOptions(fetchedSizes);
                // Cache the result
                sizesCache.current[activeCategory] = fetchedSizes;
                // Reset chosen size when sizes change
                setChosenSize('');
            } catch (error) {
                console.error('Error loading sizes:', error);
                // Fallback to empty sizes on error
                setSizeOptions([]);
            } finally {
                setSizesLoading(false);
            }
        };

        loadSizes();
    }, [activeCategory]);

    // Fetch price when item or size changes
    useEffect(() => {
        const loadPrice = async () => {
            if (!selectedItem || !chosenSize) {
                setItemPrice(0);
                return;
            }

            // Find the size object to get its ID
            const selectedSizeObj = sizeOptions.find((size) => size.name === (chosenSize || sizeOptions[0]?.name));
            const sizeId = selectedSizeObj?.id || selectedSizeObj?.sizeID || selectedItem.sizeId || selectedItem.sizeID || 0;

            if (!sizeId) {
                setItemPrice(0);
                return;
            }

            // Check cache first
            const cacheKey = `${selectedItem.id}-${sizeId}`;
            if (priceCache[cacheKey] !== undefined) {
                setItemPrice(priceCache[cacheKey]);
                return;
            }

            try {
                setPriceLoading(true);
                const price = await getPrice(selectedItem.id, sizeId);
                const numPrice = typeof price === 'number' ? price : parseFloat(price) || 0;
                setItemPrice(numPrice);
                // Cache the result
                setPriceCache(prev => ({...prev, [cacheKey]: numPrice}));
            } catch (error) {
                console.error('Error loading price:', error);
                setItemPrice(0);
            } finally {
                setPriceLoading(false);
            }
        };

        loadPrice();
    }, [selectedItem, chosenSize, sizeOptions, priceCache]);

    const resetSelection = () => {
        setSelectedItem(null);
        setSelectedToppings([]);
        setSelectedAllergies([]);
        setChosenSize('');
        setChosenBase('Traditional Acai Blend');
        setItemPrice(0);
    };

    const calculateItemPrice = (item, size = chosenSize, toppings = selectedToppings) => {
        // Use API-fetched price as base if available
        const basePrice = itemPrice || parseFloat(item.price || 0) || 10;

        // Add toppings cost
        const toppingsMod = toppings.reduce((sum, topping) => sum + (topping.price || 0), 0);
        return Math.max(0, basePrice + toppingsMod);
    };

    const toggleTopping = (topping) => {
        setSelectedToppings((current) => {
            if (current.some((item) => item.addonID === topping.addonID)) {
                return current.filter((item) => item.addonID !== topping.addonID);
            }
            return [...current, topping];
        });
    };

    const toggleAllergy = (allergy) => {
        setSelectedAllergies((current) => {
            if (current.some((item) => item.id === allergy.id)) {
                return current.filter((item) => item.id !== allergy.id);
            }
            return [...current, allergy];
        });
    };

    const selectItem = (item) => {
        setSelectedItem(item);
        setChosenSize(item.size || sizeOptions[0]?.name);
        setChosenBase('Traditional Acai Blend');
        setSelectedToppings([]);
        setSelectedAllergies([]);
    };

    const addToCart = (item, finalPrice) => {
        if (!item) return;

        const selectedSizeObj = sizeOptions.find((size) => size.name === (chosenSize || sizeOptions[0]?.name));
        const sizeId = selectedSizeObj?.id || selectedSizeObj?.sizeID || item.sizeId || item.sizeID || 0;

        setCart((currentCart) => [
            ...currentCart,
            {
                uid: Date.now(),
                id: item.id,
                name: item.name,
                size: chosenSize || sizeOptions[0]?.name,
                sizeId,
                base: chosenBase,
                toppings: selectedToppings,
                allergies: selectedAllergies,
                finalPrice: finalPrice ?? calculateItemPrice(item),
                quantity: 1,
                basePrice: itemPrice,
            }
        ]);
    };

    const addToRefundCart = (item) => {
        if (!item) return;

        const uniqueKey = item.uniqueKey;

        setRefundCart((current) => {
            const safeCurrent = Array.isArray(current) ? current : [];

            if (uniqueKey && safeCurrent.some((cartItem) => cartItem.uniqueKey === uniqueKey)) {
                return safeCurrent;
            }

            const uid = uniqueKey || item.uid || `${item.itemID ?? 'item'}-${item.itemSizeID ?? 'size'}-${Date.now()}`;

            return [
                ...safeCurrent,
                {
                    uid,
                    uniqueKey,
                    qty: 1,
                    id: item.id,
                    name: item.name,
                    size: item.size,
                    base: item.base,
                    toppings: item.toppings || [],
                    allergies: item.allergies || [],
                    finalPrice: -(item.finalPrice ?? (parseFloat(item.price || 0) || 0)),
                    quantity: 1,
                    refundOrderId: item.refundOrderId,
                    totalBeforeTax: item.totalBeforeTax,
                    itemID: item.itemID,
                    itemSizeID: item.itemSizeID,
                    totalItemRefund: Math.abs(Number(item.totalItemRefund ?? item.finalPrice ?? 0)),
                    isAlreadyRefunded: item.isAlreadyRefunded || false,
                }
            ];
        });
    };

    const removeRefundItem = (keyOrUid) => {
        setRefundCart((current) => (
            Array.isArray(current)
                ? current.filter((item) => item.uniqueKey !== keyOrUid && item.uid !== keyOrUid)
                : []
        ));
    };

    const clearRefundCart = () => setRefundCart([]);

    const refundTotal = Array.isArray(refundCart)
        ? refundCart.reduce((sum, item) => sum + (item.finalPrice * (item.quantity || 1)), 0)
        : 0;

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
        setSelectedToppings,
        toggleTopping,
        selectedAllergies,
        setSelectedAllergies,
        toggleAllergy,
        selectItem,
        addToCart,
        removeCartItem,
        clearCart,
        resetSelection,
        calculateItemPrice,
        cart,
        updateCartItem,
        sizeOptions,
        sizesLoading,
        itemPrice,
        priceLoading,
        addOns,
        addOnsLoading,
        allergies,
        allergiesLoading, refundCart,
        addToRefundCart,
        removeRefundItem,
        clearRefundCart,
        refundTotal
    };
}

export default useAppState;