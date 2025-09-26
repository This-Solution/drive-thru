package com.drivethru.service.dto;


public class CameraResponseDTO {
    private String cameraName;
    private String cameraType;
    private String carPlateNumber;
    private Integer ReloadTime;

    public Integer getReloadTime() {
        return ReloadTime;
    }

    public void setReloadTime(Integer reloadTime) {
        ReloadTime = reloadTime;
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

    public String getCarPlateNumber() {
        return carPlateNumber;
    }

    public void setCarPlateNumber(String carPlateNumber) {
        this.carPlateNumber = carPlateNumber;
    }
}
