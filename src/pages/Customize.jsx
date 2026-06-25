import React from 'react';
import {useLocation, useNavigate, useParams} from 'react-router-dom';

function Customize () {
  const {id} = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const item = location.state?.item || {name: "Selected Item", price: "0.00"};

  return (
    <div>
      <h2>Customize: {item.name}</h2>
      <p>Product ID: {id}</p>

      <div style={{margin: '20px 0', padding: '15px', border: '1px dashed #aaa'}}>
        <h3>Select Variants / Toppings</h3>
        <label><input type="checkbox" /> Extra Granola (+$1.00)</label><br />
        <label><input type="checkbox" /> Strawberries (+$1.50)</label><br />
        <label><input type="checkbox" /> Honey Drizzle (+$0.50)</label>
      </div>

      <button onClick={() => console.log(item)} style={{marginRight: '10px'}}>Add to Cart</button>
      <button onClick={() => navigate('/')}>Back to Menu</button>
    </div>
  );
}

export default Customize;
