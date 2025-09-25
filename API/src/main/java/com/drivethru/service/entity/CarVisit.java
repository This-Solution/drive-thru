package com.drivethru.service.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "CarVisit", schema = "Vehicle")
public class CarVisit {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CarVisitId")
    private Integer carVisitId;
    @Column(name = "CarId")
    private Integer carId;
    @Column(name = "TenantId")
    private Integer tenantId;
    @Column(name = "SiteId")
    private Integer siteId;
    @Column(name = "CameraId")
    private Integer cameraId;
    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;

    public Integer getCarVisitId() {
        return carVisitId;
    }

    public void setCarVisitId(Integer carVisitId) {
        this.carVisitId = carVisitId;
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

    public Integer getSiteId() {
        return siteId;
    }

    public void setSiteId(Integer siteId) {
        this.siteId = siteId;
    }

    public Integer getCameraId() {
        return cameraId;
    }

    public void setCameraId(Integer cameraId) {
        this.cameraId = cameraId;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}
