package com.drivethru.service.controller;

import com.drivethru.service.common.ResponseObject;
import com.drivethru.service.dto.CarDetailRequest;
import com.drivethru.service.dto.CarDetailResponse;
import com.drivethru.service.dto.CurrentOrderItemResponse;
import com.drivethru.service.dto.LastAndMostPurchaseOrderDetailsResponse;
import com.drivethru.service.entity.CarDetail;
import com.drivethru.service.service.CarDetailService;
import com.drivethru.service.constant.RouteConstant;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(RouteConstant.CAR)
@CrossOrigin(origins = "*", methods = {RequestMethod.POST, RequestMethod.OPTIONS})
public class CarDetailController {

    @Autowired
    private CarDetailService carDetailService;

    @PostMapping(RouteConstant.CAR_WEBHOOK)
    public ResponseEntity<ResponseObject<CarDetail>> addCarDetail(@RequestParam Map<String, MultipartFile> files) {

        MultipartFile xmlFile = null;
        List<MultipartFile> Files = new ArrayList<>();

        System.out.println("[CarDetailController] - Received files:");
        for (Map.Entry<String, MultipartFile> entry : files.entrySet()) {
            String fieldName = entry.getKey();
            MultipartFile file = entry.getValue();

            if (file != null && !file.isEmpty()) {
                System.out.println(fieldName + ": " + file.getOriginalFilename() + " (" + file.getSize() + " bytes)");

                if (file.getOriginalFilename() != null && file.getOriginalFilename().endsWith("xml")) {
                    xmlFile = file;
                } else {
                    Files.add(file);
                }
            } else {
                System.out.println(fieldName + ": null or empty");
            }
        }

        carDetailService.addCarDetail(xmlFile, Files);
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

    @PostMapping(RouteConstant.GET_CAR_DETAIL)
    public ResponseEntity<ResponseObject<CarDetailResponse>> getCarDetail(@RequestBody CarDetailRequest carDetailRequest) {
        ResponseObject<CarDetailResponse> responseObject = new ResponseObject<>();
        CarDetailResponse carDetailResponse = carDetailService.getCarDetail(carDetailRequest);
        responseObject.setData(carDetailResponse);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @PostMapping(RouteConstant.GET_CURRENT_ORDER_DETAIL)
    public ResponseEntity<ResponseObject<List<CurrentOrderItemResponse>>> getCurrentOrderDetail(@RequestBody CarDetailRequest carDetailRequest) {
        ResponseObject<List<CurrentOrderItemResponse>> responseObject = new ResponseObject<>();
        List<CurrentOrderItemResponse> currentOrderItemResponse = carDetailService.getCurrentOrderDetails(carDetailRequest);
        responseObject.setData(currentOrderItemResponse);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @PostMapping(RouteConstant.GET_LAST_ORDER_DETAILS)
    public ResponseEntity<ResponseObject<LastAndMostPurchaseOrderDetailsResponse>> getLastAndMostPurchaseOrderDetails(@RequestBody CarDetailRequest carDetailRequest) {
        ResponseObject<LastAndMostPurchaseOrderDetailsResponse> responseObject = new ResponseObject<>();
        LastAndMostPurchaseOrderDetailsResponse lastAndMostPurchaseOrderDetails = carDetailService.getLastAndMostPurchaseOrderDetails(carDetailRequest);
        responseObject.setData(lastAndMostPurchaseOrderDetails);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

}
