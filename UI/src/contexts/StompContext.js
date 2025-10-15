// context/StompContext.tsx
import { Client } from '@stomp/stompjs';
import { createContext, useContext, useEffect, useState } from 'react';
import { useSelector } from 'store';
import constants from 'utils/constants';

const StompContext = createContext(undefined);

export const StompProvider = ({ children }) => {
  const [errorMessage, setErrorMessage] = useState('');
  const [carDetailFromCamera, setCarDetailFromCamera] = useState(null);

  const { user } = useSelector((state) => state.auth);

  const handleMessage = (message) => {
    if (!message.body) return;
    try {
      const response = JSON.parse(message.body);
      const cameraType = response.cameraType ?? '';
      const cameraName = response.cameraName ?? '';
      const carPlateNumber = response.carPlateNumber?.toString() ?? '';

      const details = {
        cameraType: cameraType,
        cameraName: cameraName,
        carPlateNumber: carPlateNumber
      }

      setCarDetailFromCamera(details);

    } catch (e) {
      console.error('Error decoding STOMP message:', e);
    }
  };

  useEffect(() => {
    const connectionHeaders = {
      'client-id': JSON.stringify(user),
    };

    const client = new Client({
      brokerURL: constants.webSocketUrl,
      reconnectDelay: 5000,
      debug: (msg) => console.log('DEBUG:', msg),

      onConnect: () => {
        console.log('Connected to WebSocket server!');
        client.subscribe(`/topic/send/${user.userId}`, handleMessage);
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
      },
    });
    client.connectHeaders = connectionHeaders;
    client.activate();

    return () => {
      client.deactivate();
    };
  }, [user]);

  return (
    <StompContext.Provider
      value={{
        errorMessage,
        carDetailFromCamera
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
