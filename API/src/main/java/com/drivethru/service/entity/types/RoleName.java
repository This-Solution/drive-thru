package com.drivethru.service.entity.types;

public enum RoleName {
    SUPER_ADMIN("Super Admin"),
    ADMIN("Admin"),
    ORDER_OPERATOR("Order Operator"),
    DELIVERY_OPERATOR("Delivery Operator");

    private final String description;

    private RoleName(String description) {
        this.description = description;
    }

    public String getDescription() {
        return description;
    }
}
