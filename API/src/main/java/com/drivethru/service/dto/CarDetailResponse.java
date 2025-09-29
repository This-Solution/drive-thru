package com.drivethru.service.dto;

import com.fasterxml.jackson.annotation.JsonFormat;

import java.time.LocalDateTime;
import java.util.List;

public class CarDetailResponse {
    private Integer carId;
    private String carPlateNumber;
    private String carType;
    private String carImageUrl;
    private String plateImageUrl;
    private String carColor;
    private LocalDateTime createdTime;

    private long last30DayCount;
    private long last30To60DayCount;
    private long last60To90DayCount;

    private String last30DayColorStatus;
    private String last30To60DayColorStatus;
    private String last60To90DayColorStatus;

    public LocalDateTime getCreatedTime() {
        return createdTime;
    }

    public void setCreatedTime(LocalDateTime createdTime) {
        this.createdTime = createdTime;
    }

    public long getLast30DayCount() {
        return last30DayCount;
    }

    public void setLast30DayCount(long last30DayCount) {
        this.last30DayCount = last30DayCount;
    }

    public long getLast30To60DayCount() {
        return last30To60DayCount;
    }

    public void setLast30To60DayCount(long last30To60DayCount) {
        this.last30To60DayCount = last30To60DayCount;
    }

    public long getLast60To90DayCount() {
        return last60To90DayCount;
    }

    public void setLast60To90DayCount(long last60To90DayCount) {
        this.last60To90DayCount = last60To90DayCount;
    }

    public String getLast30DayColorStatus() {
        return last30DayColorStatus;
    }

    public void setLast30DayColorStatus(String last30DayColorStatus) {
        this.last30DayColorStatus = last30DayColorStatus;
    }

    public String getLast30To60DayColorStatus() {
        return last30To60DayColorStatus;
    }

    public void setLast30To60DayColorStatus(String last30To60DayColorStatus) {
        this.last30To60DayColorStatus = last30To60DayColorStatus;
    }

    public String getLast60To90DayColorStatus() {
        return last60To90DayColorStatus;
    }

    public void setLast60To90DayColorStatus(String last60To90DayColorStatus) {
        this.last60To90DayColorStatus = last60To90DayColorStatus;
    }

    public String getCarType() {
        return carType;
    }

    public void setCarType(String carType) {
        this.carType = carType;
    }

    public String getCarImageUrl() {
        return carImageUrl;
    }

    public void setCarImageUrl(String carImageUrl) {
        this.carImageUrl = carImageUrl;
    }

    public String getPlateImageUrl() {
        return plateImageUrl;
    }

    public void setPlateImageUrl(String plateImageUrl) {
        this.plateImageUrl = plateImageUrl;
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

}
