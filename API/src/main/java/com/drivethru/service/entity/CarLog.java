package com.drivethru.service.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;
import java.util.Map;

@Entity
@Table(name = "CarLog", schema = "Vehicle")
public class CarLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "CarLogId")
    private Integer carLogId;
    @Column(name = "CarData")
    @JdbcTypeCode(SqlTypes.JSON)
    private Map<String, Object> carData;
    @Column(name = "CreatedDate")
    private LocalDateTime createdDate;
    @Column(name = "CarVisitId")
    private Integer carVisitId;

    public Integer getCarVisitId() {
        return carVisitId;
    }

    public void setCarVisitId(Integer carVisitId) {
        this.carVisitId = carVisitId;
    }

    public Integer getCarLogId() {
        return carLogId;
    }

    public void setCarLogId(Integer carLogId) {
        this.carLogId = carLogId;
    }

    public Map<String, Object> getCarData() {
        return carData;
    }

    public void setCarData(Map<String, Object> carData) {
        this.carData = carData;
    }

    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }
}
