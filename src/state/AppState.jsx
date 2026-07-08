import {useState, useEffect} from 'react';
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
    const [sizeOptions, setSizeOptions] = useState([]);
    const [sizesLoading, setSizesLoading] = useState(false);
    const [priceCache, setPriceCache] = useState({}); // Cache for item+size prices
    const [itemPrice, setItemPrice] = useState(0);
    const [priceLoading, setPriceLoading] = useState(false);
    const [addOns, setAddOns] = useState([]);
    const [addOnsLoading, setAddOnsLoading] = useState(false);
    const [allergies, setAllergies] = useState([]);
    const [allergiesLoading, setAllergiesLoading] = useState(false);

    // Fetch allergies on component mount
    useEffect(() => {
        const loadAllergies = async () => {
            try {
                setAllergiesLoading(true);
                const fetchedAllergies = await getAllergies();
                
                // Transform API response to match expected format
                const formattedAllergies = Array.isArray(fetchedAllergies)
                    ? fetchedAllergies.map(allergy => ({
                        id: allergy.id || allergy.allergyID || allergy.ID || '',
                        name: allergy.name || allergy.title || allergy.allergyName || 'Unknown'
                    }))
                    : [];
                
                setAllergies(formattedAllergies);
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
            
            try {
                setAddOnsLoading(true);
                const fetchedAddOns = await getAddOns(activeCategory);
                
                // Transform API response to match expected format
                const formattedAddOns = Array.isArray(fetchedAddOns)
                    ? fetchedAddOns.map(addon => ({
                        name: addon.name || addon.title || addon.addOnName || 'Unknown',
                        price: addon.price ?? addon.cost ?? 0
                    }))
                    : [];
                
                setAddOns(formattedAddOns);
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
            
            try {
                setSizesLoading(true);
                const fetchedSizes = await getSizes(activeCategory);
                
                // Transform API response to match expected format if needed
                const formattedSizes = Array.isArray(fetchedSizes)
                    ? fetchedSizes.map(size => ({
                        id: size.id || size.sizeID || size.ID || '',
                        label: size.label || size.name || size.sizeName || 'Unknown',
                        priceModifier: size.priceModifier ?? size.price ?? 0
                    }))
                    : [];
                
                setSizeOptions(formattedSizes);
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
            const selectedSizeObj = sizeOptions.find(s => s.label === chosenSize);
            const sizeID = selectedSizeObj?.id;

            if (!sizeID) {
                setItemPrice(0);
                return;
            }

            // Check cache first
            const cacheKey = `${selectedItem.id}-${sizeID}`;
            if (priceCache[cacheKey] !== undefined) {
                setItemPrice(priceCache[cacheKey]);
                return;
            }

            try {
                setPriceLoading(true);
                const price = await getPrice(selectedItem.id, sizeID);
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
        const basePrice = itemPrice || parseFloat(item.price || item.submenuPrice || 0) || 10;
        
        // Add toppings cost
        const toppingsMod = toppings.reduce((sum, topping) => sum + (topping.price || 0), 0);
        return Math.max(0, basePrice + toppingsMod);
    };

    const toggleTopping = (topping) => {
        setSelectedToppings((current) => {
            if (current.some((item) => item.name === topping.name)) {
                return current.filter((item) => item.name !== topping.name);
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
        setChosenSize(item.size || sizeOptions[0]?.label || 'Medium');
        setChosenBase('Traditional Acai Blend');
        setSelectedToppings([]);
        setSelectedAllergies([]);
    };

    const addToCart = (item, finalPrice) => {
        if (!item) return;
        setCart((currentCart) => [
            ...currentCart,
            {
                uid: Date.now(),
                id: item.id,
                name: item.submenuName || item.itemName || item.name || 'Acai Item',
                size: chosenSize || sizeOptions[0]?.label || 'Medium',
                base: chosenBase,
                toppings: selectedToppings.map((t) => t.name),
                allergies: selectedAllergies.map((a) => a.name),
                finalPrice: finalPrice ?? calculateItemPrice(item),
                quantity: 1,
                basePrice: itemPrice,
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
        selectedAllergies,
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
        allergiesLoading
    };
}

export default useAppState;