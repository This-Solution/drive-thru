package com.drivethru.service.dto;

import java.util.List;

public class LastAndMostPurchaseOrderDetailsResponse {
    private List<OrderItemResponse> lastOrders;
    private List<OrderItemResponse> mostPurchaseOrders;
    private Double totalOrderItemPrice;

    public Double getTotalOrderItemPrice() {
        return totalOrderItemPrice;
    }

    public void setTotalOrderItemPrice(Double totalOrderItemPrice) {
        this.totalOrderItemPrice = totalOrderItemPrice;
    }

    public List<OrderItemResponse> getLastOrders() {
        return lastOrders;
    }

    public void setLastOrders(List<OrderItemResponse> lastOrders) {
        this.lastOrders = lastOrders;
    }

    public List<OrderItemResponse> getMostPurchaseOrders() {
        return mostPurchaseOrders;
    }

    public void setMostPurchaseOrders(List<OrderItemResponse> mostPurchaseOrders) {
        this.mostPurchaseOrders = mostPurchaseOrders;
    }
}
