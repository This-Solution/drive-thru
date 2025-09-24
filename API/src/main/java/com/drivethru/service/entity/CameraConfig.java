package com.drivethru.service.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "CameraConfig", schema = "Vehicle")
public class CameraConfig {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CameraId")
    private Integer cameraId;
    @Column(name = "TenantId")
    private Integer tenantId;
    @Column(name = "SiteId")
    private Integer siteId;
    @Column(name = "CameraName")
    private String cameraName;
    @Column(name = "CameraType")
    private String cameraType;
    @Column(name = "Description")
    private String description;
    @Column(name = "CameraIpAddress")
    private String cameraIpAddress;
    @Column(name = "OrderIpAddress")
    private String orderIpAddress;
    @Column(name = "IsActive")
    private boolean isActive;
    @Column(name = "CreatedBy")
    private Integer createdBy;
    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;
    @Column(name = "UpdatedBy")
    private Integer updatedBy;
    @Column(name = "UpdatedDate")
    private LocalDateTime updatedDate;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getCameraId() {
        return cameraId;
    }

    public void setCameraId(Integer cameraId) {
        this.cameraId = cameraId;
    }

    public Integer getTenantId() {
        return tenantId;
    }

    public void setTenantId(Integer tenantId) {
        this.tenantId = tenantId;
    }

    public Integer getSiteId() {
        return siteId;
    }

    public void setSiteId(Integer siteId) {
        this.siteId = siteId;
    }

    public String getCameraName() {
        return cameraName;
    }

    public void setCameraName(String cameraName) {
        this.cameraName = cameraName;
    }

    public String getCameraType() {
        return cameraType;
    }

    public void setCameraType(String cameraType) {
        this.cameraType = cameraType;
    }

    public String getCameraIpAddress() {
        return cameraIpAddress;
    }

    public void setCameraIpAddress(String cameraIpAddress) {
        this.cameraIpAddress = cameraIpAddress;
    }

    public String getOrderIpAddress() {
        return orderIpAddress;
    }

    public void setOrderIpAddress(String orderIpAddress) {
        this.orderIpAddress = orderIpAddress;
    }

    public Boolean getActive() {
        return isActive;
    }

    public void setActive(Boolean active) {
        isActive = active;
    }

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public Integer getUpdatedBy() {
        return updatedBy;
    }

    public void setUpdatedBy(Integer updatedBy) {
        this.updatedBy = updatedBy;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }
}
