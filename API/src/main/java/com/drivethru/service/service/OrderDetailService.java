package com.drivethru.service.service;

import com.drivethru.service.dto.WebhookOrderRequest;
import org.springframework.stereotype.Service;

@Service
public interface OrderDetailService {
    void createdOrder(WebhookOrderRequest webhookOrderRequest);
}
