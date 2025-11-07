package com.drivethru.service.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CarOrderResponseDTO {
    private String carPlateNumber;
    private String carColor;
    private Double totalPrice;
    private Integer orderId;
    private Integer carId;
    private LocalDateTime createdDate;
    private List<OrderItemDTO> orderItemData;


    public String getCarPlateNumber() {
        return carPlateNumber;
    }

    public void setCarPlateNumber(String carPlateNumber) {
        this.carPlateNumber = carPlateNumber;
    }

    public String getCarColor() {
        return carColor;
    }

    public void setCarColor(String carColor) {
        this.carColor = carColor;
    }

    public Double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(Double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public Integer getOrderId() {
        return orderId;
    }

    public void setOrderId(Integer orderId) {
        this.orderId = orderId;
    }

    public Integer getCarId() {
        return carId;
    }

    public void setCarId(Integer carId) {
        this.carId = carId;
    }

    public List<OrderItemDTO> getOrderItemData() {
        return orderItemData;
    }

    public void setOrderItemData(List<OrderItemDTO> orderItemData) {
        this.orderItemData = orderItemData;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public static class OrderItemDTO {
        private Integer orderItemId;
        private String name;
        private Integer quantity;
        private Double price;

        public Integer getOrderItemId() {
            return orderItemId;
        }

        public void setOrderItemId(Integer orderItemId) {
            this.orderItemId = orderItemId;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public Double getPrice() {
            return price;
        }

        public void setPrice(Double price) {
            this.price = price;
        }
    }
}
