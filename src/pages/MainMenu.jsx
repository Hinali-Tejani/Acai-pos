import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

function MainMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/getmainmenu')
      .then(res => setMenuItems(Array.isArray(res.data) ? res.data : res.data.items || []))
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <h2>Loading Menu...</h2>;

  return (
    <div>
      <h2>Acai Main Menu</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
        {menuItems.map((item) => (
          <div 
            key={item.id} 
            style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', cursor: 'pointer' }}
            onClick={() => navigate(`/customize/${item.id}`, { state: { item } })}
          >
            <h3>{item.name || 'Acai Bowl'}</h3>
            <p>${item.price || '0.00'}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MainMenu;
