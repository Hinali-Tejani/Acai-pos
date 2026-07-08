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
    selectedAllergies,
    onAllergyToggle,
    sizeOptions,
    baseOptions,
    addOns,
    allergies,
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
            setChosenSize(item.size || 'Small');
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
            <div className="flex items-center justify-between gap-3 rounded-xl border border-purple-200 bg-white px-4 py-3 shadow-sm mb-5">
                <h2 className="text-xl font-semibold text-purple-900">
                    {item.submenuName || item.itemName || item.name || 'Product Detail'}
                </h2>

                <div className="flex gap-3">
                    {sizeOptions.map((sz) => (
                        <button
                            key={sz.label}
                            onClick={() => setChosenSize(sz.label)}
                            className={`rounded-sm border px-3 py-2 text-xs! font-semibold transition ${chosenSize === sz.label ? 'border-purple-900 bg-purple-900 text-white' : 'border-purple-200 bg-purple-50 text-purple-800 hover:border-purple-300 hover:bg-purple-100'}`}
                        >
                            {sz.label} 
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
                currentItemPrice={getItemPrice(item)}
                onBack={handleBack}
                onAddToCart={handleAddToOrder}
            />
        </div>
    );
}
