package com.drivethru.service.helper;


import com.drivethru.service.entity.UserDetail;
import com.drivethru.service.repository.UserDetailRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Optional;

@Component
public class WebSocketEventListener {

    @Autowired
    UserDetailRepository userDetailRepository;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(event.getMessage());

        String sessionId = accessor.getSessionId();
        String clientId = accessor.getFirstNativeHeader("client-id");


        System.out.println("Session ID: " + sessionId);
        System.out.println("Client ID: " + clientId);

        if (clientId != null && !clientId.isEmpty()) {
            try {
                ObjectMapper objectMapper = new ObjectMapper();
                JsonNode clientData = objectMapper.readTree(clientId);

                int userId = clientData.get("userId").asInt();

                Optional<UserDetail> detail = userDetailRepository.findById(userId);
                detail.get().setSessionId(sessionId);
                userDetailRepository.save(detail.get());

            } catch (Exception e) {
                System.out.println("Failed to parse client-id JSON: " + e.getMessage());
            }
        } else {
            System.out.println("client-id header is missing.");
        }

    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        System.out.println("WebSocket Disconnected - Session ID: " + sessionId);
    }
}
