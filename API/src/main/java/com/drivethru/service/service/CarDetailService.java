package com.drivethru.service.service;

import com.drivethru.service.dto.CarDetailRequest;
import com.drivethru.service.dto.CarDetailResponse;
import com.drivethru.service.dto.CurrentOrderItemResponse;
import com.drivethru.service.dto.LastAndMostPurchaseOrderDetailsResponse;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public interface CarDetailService {
    void addCarDetail(MultipartFile xmlFile, List<MultipartFile> Files);

    CarDetailResponse getCarDetail(CarDetailRequest carDetailRequest);

    List<CurrentOrderItemResponse> getCurrentOrderDetails(CarDetailRequest carDetailRequest);

    LastAndMostPurchaseOrderDetailsResponse getLastAndMostPurchaseOrderDetails(CarDetailRequest carDetailRequest);
}
