package com.drivethru.service.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "CarLog", schema = "Vehicle")
public class CarLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CarLogId")
    private Integer carLogId;
    @Column(name = "CarData")
    private String carData;
    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    public Integer getCarLogId() {
        return carLogId;
    }

    public void setCarLogId(Integer carLogId) {
        this.carLogId = carLogId;
    }

    public String getCarData() {
        return carData;
    }

    public void setCarData(String carData) {
        this.carData = carData;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}
