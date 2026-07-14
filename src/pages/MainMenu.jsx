import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useMenuStore } from '../context/MenuContext';
import Spinner from '../components/Spinner';

function MainMenu() {
  const { allItems: menuItems, loading, error } = useMenuStore();
  const navigate = useNavigate();

  if (loading) return <Spinner size="lg" />;
  if (error) return <h2>Error: {error}</h2>;

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
