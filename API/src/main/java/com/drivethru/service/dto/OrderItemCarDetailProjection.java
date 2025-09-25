package com.drivethru.service.dto;

import java.time.LocalDateTime;

public interface OrderItemCarDetailProjection {

    Integer getOrderItemId();

    Integer getOrderId();

    String getName();

    Double getPrice();

    Integer getQuantity();

    LocalDateTime getCreatedDate();

    String getCarPlateNumber();

    String getCarColor();

    Integer getCarId();
}
