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
    editingItemIndex,
    onToppingToggle,
    selectedAllergies,
    onAllergyToggle,
    sizeOptions,
    baseOptions,
    addOns,
    allergies,
    getItemPrice,
    onAddToCart,
    onAddToRefundCart,
    onBack,
    activeCategory = 'home'
}) {
    const {id} = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const itemFromState = location.state?.item;
    const isRefund = location.state?.refund === true;
    const item = selectedItem || itemFromState || activeItems.find((it) => String(it.id) === String(id));

    useEffect(() => {
        if (!item) return;
        if (!chosenSize) {
            setChosenSize(item.size || 'Small');
        }
        if (!chosenBase) {
            setChosenBase('Traditional Acai Blend');
        }
    }, [item, chosenSize, chosenBase, setChosenSize, setChosenBase]);

    const returnPath = isRefund
        ? '/manager/refund'
        : activeCategory && activeCategory !== 'home' ? `/products/${activeCategory}` : '/home';

    const handleBack = () => {
        if (onBack) onBack();
        navigate(returnPath);
    };

    const handleAddToOrder = () => {
        if (isRefund) {
            onAddToRefundCart(item);
        } else {
            onAddToCart(item);
        }
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

    const currentItemPrice = getItemPrice(item);

    return (
        <div className="space-y-8 overflow-y-auto">
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-purple-200 bg-white px-4 py-3 shadow-sm mb-2">
                <div className="flex items-center gap-3">
                    <h2 className="flex items-center gap-2 text-xl font-semibold text-purple-900">
                        {item.name} - <span className="text-sm">${currentItemPrice.toFixed(2)}</span>
                    </h2>
                    
                </div>

                <div className="flex gap-3">
                    {sizeOptions.map((sz) => (

                        <button
                            key={sz.id}
                            onClick={() => setChosenSize(sz.name)}
                            className={`rounded-sm border px-3 py-2 text-xs! font-semibold transition ${chosenSize === sz.name ? 'border-purple-900 bg-purple-900 text-white' : 'border-purple-200 bg-gray-50 text-purple-800 hover:border-purple-300 hover:bg-purple-100'}`}
                        >
                            {sz.name}
                            {/* <span className='text-[9px]'> {sz.priceModifier !== 0 && `(${sz.priceModifier > 0 ? '+' : ''}$${sz.priceModifier.toFixed(2)})`}</span> */}
                        </button>
                    ))}
                </div>
            </div>

            <ProductDetail
                selectedItem={item}
                chosenSize={chosenSize}
                setChosenSize={setChosenSize}
                chosenBase={chosenBase}
                setChosenBase={setChosenBase}
                selectedToppings={selectedToppings}
                onToppingToggle={onToppingToggle}
                selectedAllergies={selectedAllergies}
                onAllergyToggle={onAllergyToggle}
                sizeOptions={sizeOptions}
                baseOptions={baseOptions}
                addOns={addOns}
                allergies={allergies}
                onBack={handleBack}
                onAddToCart={handleAddToOrder}
                editingItemIndex={editingItemIndex}
                isRefund={isRefund}
            />
        </div>
    );
}
