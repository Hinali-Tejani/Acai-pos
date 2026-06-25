import React from 'react';
import { useNavigate } from 'react-router-dom';

function Cart() {
  const navigate = useNavigate();

  return (
    <div>
      <h2>Your Checkout Cart</h2>
      <p>Review your selected items and variants here.</p>
      
      <div style={{ borderTop: '2px solid #333', marginTop: '20px', paddingTop: '20px' }}>
        <button onClick={() => alert('Order Placed!')} style={{ marginRight: '10px', backgroundColor: 'green', color: 'white' }}>
          Pay Now
        </button>
        <button onClick={() => navigate('/')}>Cancel & Clear</button>
      </div>
    </div>
  );
}

export default Cart;
