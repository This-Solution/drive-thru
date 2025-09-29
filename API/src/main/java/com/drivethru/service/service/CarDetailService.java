package com.drivethru.service.service;

import com.drivethru.service.dto.*;
import com.drivethru.service.entity.OrderCarStatus;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface CarDetailService {
    void addCarDetail (Map<String, Object> carDetailJson);

    CarDetailResponse getCarDetail(CarDetailRequest carDetailRequest);

    List<CurrentOrderItemResponse> getCurrentOrderDetails(CarDetailRequest carDetailRequest);

    LastAndMostPurchaseOrderDetailsResponse getLastAndMostPurchaseOrderDetails(CarDetailRequest carDetailRequest);

    OrderCarStatus updateStatus(UpdateStatusRequest updateStatusRequest);

    List<CameraResponseDTO> latestInfo(Integer SiteId);
}
