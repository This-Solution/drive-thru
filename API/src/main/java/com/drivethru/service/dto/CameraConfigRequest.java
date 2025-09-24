package com.drivethru.service.dto;

public class CameraConfigRequest {
    private Integer tenantId;
    private Integer siteId;
    private String cameraName;
    private String cameraType;
    private String description;
    private String cameraIpAddress;
    private String orderIpAddress;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
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
}
