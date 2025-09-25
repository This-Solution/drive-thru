package com.drivethru.service.service;

import com.drivethru.service.dto.*;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
public interface CarDetailService {
    void addCarDetail (Map<String, Object> carDetailJson);

    CarDetailResponse getCarDetail(CarDetailRequest carDetailRequest);

    List<CurrentOrderItemResponse> getCurrentOrderDetails(CarDetailRequest carDetailRequest);

    LastAndMostPurchaseOrderDetailsResponse getLastAndMostPurchaseOrderDetails(CarDetailRequest carDetailRequest);

    List<CameraResponseDTO> latestInfo(String SiteId);
}
