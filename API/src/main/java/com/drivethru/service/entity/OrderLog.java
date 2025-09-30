package com.drivethru.service.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "OrderLog", schema = "Sales")
public class OrderLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderLogId")
    private Integer orderLogId;
    @Column(name = "OrderData")
    private String orderData;
    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    public Integer getOrderLogId() {
        return orderLogId;
    }

    public void setOrderLogId(Integer orderLogId) {
        this.orderLogId = orderLogId;
    }

    public String getOrderData() {
        return orderData;
    }

    public void setOrderData(String orderData) {
        this.orderData = orderData;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}
