import React, {useEffect} from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';
import ProductDetail from '../components/ProductDetail';

export default function ProductDetailPage ({
    selectedItem,
    activeItems,
    chosenSize,
    setChosenSize,
    chosenBase,
    setChosenBase,
    selectedToppings,
    onToppingToggle,
    sizeOptions,
    baseOptions,
    premiumToppings,
    getItemPrice,
    onAddToCart,
    onBack,
    activeCategory = 'home'
}) {
    const {id} = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const itemFromState = location.state?.item;
    const item = selectedItem || itemFromState || activeItems.find((it) => String(it.id) === String(id));

    useEffect(() => {
        if (!item) return;
        if (!chosenSize) {
            setChosenSize(item.size || 'Medium');
        }
        if (!chosenBase) {
            setChosenBase('Traditional Acai Blend');
        }
    }, [item, chosenSize, chosenBase, setChosenSize, setChosenBase]);

    const returnPath = activeCategory && activeCategory !== 'home' ? `/products/${activeCategory}` : '/home';

    const handleBack = () => {
        if (onBack) onBack();
        navigate(returnPath);
    };

    const handleAddToOrder = () => {
        onAddToCart(item);
        navigate(returnPath);
    };

    if (!item) {
        return (
            <div className="flex h-full flex-col items-center justify-center rounded-xl border border-purple-200 bg-white p-10 shadow-sm">
                <h3 className="mb-4 text-2xl font-semibold text-purple-900">Product not found</h3>
                <button
                    className="rounded-xl bg-purple-900 px-6 py-3 text-sm font-semibold text-white hover:bg-purple-800"
                    onClick={() => navigate(returnPath)}
                >
                    Back to Home
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between gap-4 rounded-[32px] border border-purple-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-semibold text-purple-900">
                    {item.submenuName || item.itemName || item.name || 'Product Detail'}
                </h2>
            </div>
            {/* 
            {item.imageUrl && (
                <div className="overflow-hidden rounded-[32px] border border-purple-200 bg-white shadow-sm">
                    <img src={item.imageUrl} alt={item.name} className="h-[320px] w-full object-cover" />
                </div>
            )} */}

            <ProductDetail
                selectedItem={item}
                chosenSize={chosenSize}
                setChosenSize={setChosenSize}
                chosenBase={chosenBase}
                setChosenBase={setChosenBase}
                selectedToppings={selectedToppings}
                onToppingToggle={onToppingToggle}
                sizeOptions={sizeOptions}
                baseOptions={baseOptions}
                premiumToppings={premiumToppings}
                currentItemPrice={getItemPrice(item)}
                onBack={handleBack}
                onAddToCart={handleAddToOrder}
            />
        </div>
    );
}
