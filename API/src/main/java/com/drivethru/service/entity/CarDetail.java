package com.drivethru.service.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "CarDetail", schema = "Vehicle")
public class CarDetail {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CarId")
    private Integer carId;
    @Column(name = "CarType")
    private String carType;
    @Column(name = "CarColor")
    private String carColor;
    @Column(name = "CarPlateNumber")
    private String carPlateNumber;
    @Column(name = "PlateImageUrl")
    private String plateImageUrl;
    @Column(name = "CarImageUrl")
    private String carImageUrl;
    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    public Integer getCarId() {
        return carId;
    }

    public void setCarId(Integer carId) {
        this.carId = carId;
    }

    public String getCarType() {
        return carType;
    }

    public void setCarType(String carType) {
        this.carType = carType;
    }

    public String getCarColor() {
        return carColor;
    }

    public void setCarColor(String carColor) {
        this.carColor = carColor;
    }

    public String getCarPlateNumber() {
        return carPlateNumber;
    }

    public void setCarPlateNumber(String carPlateNumber) {
        this.carPlateNumber = carPlateNumber;
    }

    public String getPlateImageUrl() {
        return plateImageUrl;
    }

    public void setPlateImageUrl(String plateImageUrl) {
        this.plateImageUrl = plateImageUrl;
    }

    public String getCarImageUrl() {
        return carImageUrl;
    }

    public void setCarImageUrl(String carImageUrl) {
        this.carImageUrl = carImageUrl;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}
