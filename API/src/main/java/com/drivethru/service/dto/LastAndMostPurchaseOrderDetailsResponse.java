package com.drivethru.service.dto;

import java.util.List;

public class LastAndMostPurchaseOrderDetailsResponse {
    private List<OrderItemResponse> lastOrders;
    private List<OrderItemResponse> mostPurchaseOrders;

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
