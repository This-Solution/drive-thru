package com.drivethru.service.service;

import com.drivethru.service.dto.OrderItemCarDetailProjection;
import com.drivethru.service.dto.WebhookOrderRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public interface OrderDetailService {
    void createdOrder(WebhookOrderRequest webhookOrderRequest);

    List<OrderItemCarDetailProjection> getOrderItems(Integer siteId, String itemName, String carPlateNumber, LocalDate localDate, String startTime, String endTime);
}
