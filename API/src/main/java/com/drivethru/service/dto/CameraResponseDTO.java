package com.drivethru.service.dto;

import java.util.List;

public class CameraResponseDTO {
    private String cameraName;
    private CarDetailResponse carDetail;
    private List<LastAndMostPurchaseOrderDetailsResponse> LastAndMostPurchaseOrderDetailsResponse;
    private List<CurrentOrderItemResponse> currentOrderDetails;

    public String getCameraName() {
        return cameraName;
    }

    public void setCameraName(String cameraName) {
        this.cameraName = cameraName;
    }

    public CarDetailResponse getCarDetail() {
        return carDetail;
    }

    public void setCarDetail(CarDetailResponse carDetail) {
        this.carDetail = carDetail;
    }

    public List<LastAndMostPurchaseOrderDetailsResponse> getLastAndMostPurchaseOrderDetailsResponse() {
        return LastAndMostPurchaseOrderDetailsResponse;
    }

    public void setLastAndMostPurchaseOrderDetailsResponse(List<LastAndMostPurchaseOrderDetailsResponse> lastAndMostPurchaseOrderDetailsResponse) {
        LastAndMostPurchaseOrderDetailsResponse = lastAndMostPurchaseOrderDetailsResponse;
    }

    public List<CurrentOrderItemResponse> getCurrentOrderDetails() {
        return currentOrderDetails;
    }

    public void setCurrentOrderDetails(List<CurrentOrderItemResponse> currentOrderDetails) {
        this.currentOrderDetails = currentOrderDetails;
    }
}
