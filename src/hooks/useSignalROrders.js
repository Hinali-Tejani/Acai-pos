// import { useEffect, useState, useCallback } from 'react';
// import * as signalR from '@microsoft/signalr';

// /**
//  * Plays a notification sound when a new order arrives
//  */
// const playNotificationSound = () => {
//   const audio = new Audio(
//     'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='
//   );
//   audio.play().catch((err) => console.log('Sound notification skipped:', err));
// };

// /**
//  * Hook for managing SignalR web orders
//  * Handles connection lifecycle, order state, and completion logic
//  */
// export function useSignalROrders() {
//   const [orders, setOrders] = useState([]);
//   const [isConnected, setIsConnected] = useState(false);
//   const [error, setError] = useState(null);

//   // Initialize SignalR connection and event listeners
//   useEffect(() => {
//     let isMounted = true;
//     let connection = null;

//     const initializeConnection = async () => {
//       try {
//         // Create the hub connection
//         connection = new signalR.HubConnectionBuilder()
//           .withUrl(`${import.meta.env.VITE_API_BASE_URL}/OrderHub`)
//           .withAutomaticReconnect()
//           .build();

//         // Set up the event listener BEFORE starting the connection
//         connection.on('ReceiveWebOrder', (order) => {
//           if (isMounted) {
//             console.log('📦 New Order Received:', order);
//             playNotificationSound();
//             // Append new order to the top of the array using functional update
//             setOrders((prevOrders) => [order, ...prevOrders]);
//           }
//         });

//         // Start the connection
//         await connection.start();

//         if (isMounted) {
//           setIsConnected(true);
//           setError(null);
//           console.log('✅ Connected to SignalR hub');
//         }
//       } catch (err) {
//         if (isMounted) {
//           setError(err.message || 'Failed to connect');
//           setIsConnected(false);
//           console.error('❌ SignalR connection failed:', err);
//         }
//       }
//     };

//     initializeConnection();

//     // Cleanup: stop the connection when component unmounts
//     return () => {
//       isMounted = false;
//       if (connection) {
//         connection.stop().catch((err) => console.error('Error stopping connection:', err));
//       }
//     };
//   }, []); // Empty dependency array: run exactly once on mount

//   /**
//    * Removes a completed order from the state
//    */
//   const completeOrder = useCallback((orderNo) => {
//     setOrders((prevOrders) => prevOrders.filter((order) => order.orderNo !== orderNo));
//   }, []);

//   /**
//    * Clears all orders from the state
//    */
//   const clearAllOrders = useCallback(() => {
//     setOrders([]);
//   }, []);

//   return {
//     orders,
//     isConnected,
//     error,
//     completeOrder,
//     clearAllOrders,
//   };
// }

import { useEffect, useState, useRef } from 'react';
import * as signalR from '@microsoft/signalr';

export const useSignalROrders = () => {
  const [isConnected, setIsConnected] = useState(false);
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState(null);
  const hubConnectionRef = useRef(null);

  useEffect(() => {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl('/AcaiAPI/OrderHub')
      .withAutomaticReconnect()
      .build();

    // Listen for incoming website orders
    connection.on('ReceiveWebOrder', (order) => {
      console.log('📦 New Order Received:', order);
      setOrders((prevOrders) => [order, ...prevOrders]);  // Add to top
    });

    connection.onreconnected(() => {
      setIsConnected(true);
      console.log('✅ Reconnected to order hub');
    });

    connection.onclose((error) => {
      setIsConnected(false);
      console.log('❌ Disconnected from hub');
    });

    // Start connection
    connection
      .start()
      .then(() => {
        setIsConnected(true);
        console.log('✅ Connected to order hub');
      })
      .catch((err) => {
        setError(err.message);
        console.error('❌ Connection failed:', err);
      });

    hubConnectionRef.current = connection;

    return async () => {
      if (hubConnectionRef.current) {
        await hubConnectionRef.current.stop();
      }
    };
  }, []);

  return { isConnected, orders, error };
};