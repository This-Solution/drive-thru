// context/StompContext.tsx
import { Client } from '@stomp/stompjs';
import { createContext, useContext, useEffect, useRef, useState } from 'react';

const StompContext = createContext(undefined);

export const StompProvider = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [orderWindow, setOrderWindow] = useState({});
  const [deliveryWindow, setDeliveryWindow] = useState({});
  const [client, setClient] = useState(null);


  const clientRef = useRef(null);

  useEffect(() => {
    if (client) {
      client.subscribe('/topic/send', handleMessage)
    }
  }, [client])

  const handleMessage = (message) => {
    if (!message.body) return;
    try {
      const response = JSON.parse(message.body);
      const cameraType = response.cameraType ?? '';
      const carPlateNumber = response.carPlateNumber?.toString() ?? '';

      if (cameraType === 'L') {
        setOrderWindow({ cameraType: cameraType, carPlateNumber: carPlateNumber })
      } else if (cameraType === 'C') {
        setDeliveryWindow({ cameraType: cameraType, carPlateNumber: carPlateNumber })
      }
    } catch (e) {
      console.error('Error decoding STOMP message:', e);
    }
  };

  useEffect(() => {
    const client = new Client({
      brokerURL: 'ws://dt1.thissolution.com/ws',
      reconnectDelay: 5000,
      debug: (msg) => console.log('DEBUG:', msg),

      onConnect: () => {
        console.log('Connected to WebSocket server!');
        setClient(client);
      },

      onStompError: (frame) => {
        console.error('Broker reported error: ' + frame.headers['message']);
        console.error('Additional details: ' + frame.body);
      },

      onWebSocketClose: (event) => {
        console.log('WebSocket closed:', event);
      },
      onWebSocketError: (event) => {
        console.error('WebSocket error:', event);
      }
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, []);

  return (
    <StompContext.Provider
      value={{
        orderWindow,
        deliveryWindow,
        errorMessage,
        clientRef
      }}
    >
      {children}
    </StompContext.Provider>
  );
};

export const useStomp = () => {
  const ctx = useContext(StompContext);
  if (!ctx) {
    throw new Error('useStomp must be used within a StompProvider');
  }
  return ctx;
};
