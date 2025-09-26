package com.drivethru.service.dto;

import java.time.LocalDateTime;

public class CameraConfigResponse {
    private Integer cameraId;
    private Integer tenantId;
    private String tenantName;
    private Integer siteId;
    private String siteName;
    private String cameraName;
    private String cameraType;
    private String description;
    private String cameraIpAddress;
    private String orderIpAddress;
    private boolean isActive;
    private Integer createdBy;
    private String createByName;
    private LocalDateTime createdDate;
    private Integer updatedBy;
    private String updateByName;
    private LocalDateTime updatedDate;
    private Integer reloadTime;

    public Integer getReloadTime() {
        return reloadTime;
    }

    public void setReloadTime(Integer reloadTime) {
        this.reloadTime = reloadTime;
    }

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

    public String getTenantName() {
        return tenantName;
    }

    public void setTenantName(String tenantName) {
        this.tenantName = tenantName;
    }

    public Integer getSiteId() {
        return siteId;
    }

    public void setSiteId(Integer siteId) {
        this.siteId = siteId;
    }

    public String getSiteName() {
        return siteName;
    }

    public void setSiteName(String siteName) {
        this.siteName = siteName;
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

    public boolean isActive() {
        return isActive;
    }

    public void setActive(boolean active) {
        isActive = active;
    }

    public Integer getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(Integer createdBy) {
        this.createdBy = createdBy;
    }

    public String getCreateByName() {
        return createByName;
    }

    public void setCreateByName(String createByName) {
        this.createByName = createByName;
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

    public String getUpdateByName() {
        return updateByName;
    }

    public void setUpdateByName(String updateByName) {
        this.updateByName = updateByName;
    }

    public LocalDateTime getUpdatedDate() {
        return updatedDate;
    }

    public void setUpdatedDate(LocalDateTime updatedDate) {
        this.updatedDate = updatedDate;
    }
}
