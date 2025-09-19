package com.drivethru.service.dto;

import java.util.List;

public class CarDetailResponse {
    private Integer carId;
    private List<String> imageUrl;
    private String carPlateNumber;
    private Long orderCount;
    private String carColor;
    private String carColorStatus;

    public Long getOrderCount() {
        return orderCount;
    }

    public void setOrderCount(Long orderCount) {
        this.orderCount = orderCount;
    }

    public List<String> getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(List<String> imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Integer getCarId() {
        return carId;
    }

    public void setCarId(Integer carId) {
        this.carId = carId;
    }

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

    public String getCarColorStatus() {
        return carColorStatus;
    }

    public void setCarColorStatus(String carColorStatus) {
        this.carColorStatus = carColorStatus;
    }
}
