package com.drivethru.service.entity;


import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "OrderCarStatus", schema = "Sales")
public class OrderCarStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "OrderCarStatusId")
    private Integer orderCarStatusId;
    @Column(name = "OrderId")
    private Integer orderId;
    @Column(name = "CarId")
    private Integer carId;
    @Column(name = "TenantId")
    private Integer tenantId;
    @Column(name = "Status")
    private String status;
    @Column(name = "Notes")
    private String notes;
    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    public Integer getOrderCarStatusId() {
        return orderCarStatusId;
    }

    public void setOrderCarStatusId(Integer orderCarStatusId) {
        this.orderCarStatusId = orderCarStatusId;
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

    public Integer getTenantId() {
        return tenantId;
    }

    public void setTenantId(Integer tenantId) {
        this.tenantId = tenantId;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}
