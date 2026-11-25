import {useEffect, useState, useCallback} from 'react';
import * as signalR from '@microsoft/signalr';
// import {createReceiptBytes} from '../utils/receiptGenerator';

/**
 * Plays a notification sound when a new order arrives
 */
const playNotificationSound = () => {
  const audio = new Audio(
    'data:audio/wav;base64,UklGRiYAAABXQVZFZm10IBAAAAABAAEAQB8AAAB9AAACABAAZGF0YQIAAAAAAA=='
  );
  audio.play().catch((err) => console.log('Sound notification skipped:', err));
};

/**
 * Hook for managing SignalR web orders
 * Handles connection lifecycle, order state, and completion logic
 */
export function useSignalROrders () {
  const [orders, setOrders] = useState([]);
  const [notification, setNotification] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  // Initialize SignalR connection and event listeners
  useEffect(() => {
    let isMounted = true;
    let connection = null;
    let retryTimer = null;
    let isStarting = false;

    const scheduleInitialRetry = (attempt) => {
      if (!isMounted) return;
      const delay = Math.min(1000 * (2 ** attempt), 30000);
      retryTimer = window.setTimeout(() => initializeConnection(attempt + 1), delay);
    };

    const initializeConnection = async (attempt = 0) => {
      if (isStarting) return;
      isStarting = true;

      try {
        if (!connection || connection.state === signalR.HubConnectionState.Disconnected) {
          connection = new signalR.HubConnectionBuilder()
            .withUrl('https://palladiumacaiapi.runasp.net/orderhub')
            .withAutomaticReconnect([0, 2000, 5000, 10000, 30000])
            .build();

          connection.onreconnecting(() => {
            if (isMounted) {
              setIsConnected(false);
              setError('Reconnecting to web orders...');
            }
          });

          connection.onreconnected(() => {
            if (isMounted) {
              setIsConnected(true);
              setError(null);
              console.log('✅ Reconnected to SignalR hub');
            }
          });

          connection.onclose(() => {
            if (isMounted) {
              setIsConnected(false);
              setError('Web orders disconnected');
            }
          });

          connection.on('ReceiveWebOrder', (order) => {
            if (!isMounted) return;

            console.log('📦 New Order Received:', order);
            playNotificationSound();

            const orderID = order?.orderID;
            const isPaymentPending = order?.ispaymentPending === true
              || String(order?.paymentStatus || '').toLowerCase() === 'pending';

            if (isPaymentPending) {
              setNotification({
                type: 'pending',
                message: `New Pending Web Order #${orderID ?? 'Unknown'} received.`,
              });
              return;
            }

            setOrders((current) => {
              const safeCurrent = Array.isArray(current) ? current : [];
              const isDuplicate = safeCurrent.some((paid) => paid.orderID === orderID);

              if (isDuplicate || orderID == null) return safeCurrent;
              return [order, ...safeCurrent];
            });

            setNotification({
              type: 'paid',
              message: `New Paid Online Order Received! (#${orderID})`,
            });
          });
        }

        await connection.start();

        if (isMounted) {
          setIsConnected(true);
          setError(null);
          console.log('✅ Connected to SignalR hub');
        }
      } catch (err) {
        if (!isMounted) return;

        setIsConnected(false);
        setError(err.message || 'Failed to connect');
        console.error('❌ SignalR connection failed:', err);
        scheduleInitialRetry(attempt);
      } finally {
        isStarting = false;
      }
    };

    initializeConnection();

    return () => {
      isMounted = false;
      if (retryTimer) window.clearTimeout(retryTimer);
      if (connection) {
        connection.off('ReceiveWebOrder');
        connection.stop().catch((err) => console.error('Error stopping connection:', err));
      }
    };
  }, []); // Empty dependency array: run exactly once on mount

  /**
   * Removes a completed order from the state
   */
  const completeOrder = useCallback((orderID) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.orderID !== orderID));
  }, []);

  /**
   * Clears all orders from the state
   */
  const clearAllOrders = useCallback(() => {
    setOrders([]);
  }, []);

  const dismissNotification = useCallback(() => setNotification(null), []);

  return {
    orders,
    notification,
    dismissNotification,
    isConnected,
    error,
    completeOrder,
    clearAllOrders,
  };
}

// import {useEffect, useState, useRef} from 'react';
// import * as signalR from '@microsoft/signalr';

// export const useSignalROrders = () => {
//   const [isConnected, setIsConnected] = useState(false);
//   const [orders, setOrders] = useState([]);
//   const [error, setError] = useState(null);
//   const hubConnectionRef = useRef(null);

//   useEffect(() => {
//     const connection = new signalR.HubConnectionBuilder()
//       .withUrl('https://palladiumacaiapi.runasp.net/orderhub') // Use the correct hub URL
//       .withAutomaticReconnect()
//       .build();

//     // Listen for incoming website orders
//     connection.on('ReceiveWebOrder', (order) => {
//       console.log('📦 New Order Received:', order);
//       setOrders((prevOrders) => [order, ...prevOrders]);  // Add to top
//     });

//     connection.onreconnected(() => {
//       setIsConnected(true);
//       console.log('✅ Reconnected to order hub');
//     });

//     connection.onclose((error) => {
//       setIsConnected(false);
//       console.log('❌ Disconnected from hub');
//     });

//     // Start connection
//     connection
//       .start()
//       .then(() => {
//         setIsConnected(true);
//         console.log('✅ Connected to order hub');
//       })
//       .catch((err) => {
//         setError(err.message);
//         console.error('❌ Connection failed:', err);
//       });

//     hubConnectionRef.current = connection;

//     return async () => {
//       if (hubConnectionRef.current) {
//         await hubConnectionRef.current.stop();
//       }
//     };
//   }, []);

//   return {isConnected, orders, error};
// };