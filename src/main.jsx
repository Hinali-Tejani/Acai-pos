import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { MenuStateProvider } from './state/MenuState';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MenuStateProvider>
      <App />
    </MenuStateProvider>
  </React.StrictMode>
);
