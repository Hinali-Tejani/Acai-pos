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
    onBack
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

    const handleBack = () => {
        if (onBack) onBack();
        navigate('/');
    };

    if (!item) {
        return (
            <div className="pos-centered-msg">
                <h3>Product not found</h3>
                <button onClick={handleBack}>Back to Menu</button>
            </div>
        );
    }

    return (
        <div className="pos-product-detail-page">
            <div className="pos-detail-header">
                <button className="pos-back-btn" onClick={handleBack}>← Back to Menu</button>
                <h2>{item.submenuName || item.itemName || item.name || 'Product Detail'}</h2>
            </div>

            {item.imageUrl && (
                <div className="pos-detail-image-wrapper">
                    <img src={item.imageUrl} alt={item.name} className="pos-detail-image" />
                </div>
            )}

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
                onAddToCart={() => onAddToCart(item)}
            />
        </div>
    );
}
