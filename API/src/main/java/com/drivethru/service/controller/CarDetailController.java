package com.drivethru.service.controller;

import com.drivethru.service.common.ResponseObject;
import com.drivethru.service.configuration.JwtHelper;
import com.drivethru.service.constant.RouteConstant;
import com.drivethru.service.dto.*;
import com.drivethru.service.entity.CarDetail;
import com.drivethru.service.entity.OrderCarStatus;
import com.drivethru.service.service.CarDetailService;
import com.drivethru.service.service.OrderDetailService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(RouteConstant.CAR)
@CrossOrigin(origins = "*", methods = {RequestMethod.POST, RequestMethod.OPTIONS})
public class CarDetailController {

    @Autowired
    private CarDetailService carDetailService;

    @Autowired
    JwtHelper jwtHelper;

    @Autowired
    private OrderDetailService orderDetailService;

    @PostMapping(RouteConstant.CAR_WEBHOOK)
    public ResponseEntity<ResponseObject<CarDetail>> carDetail(@RequestBody Map<String, Object> carDetailJson) {
        System.out.println("[CarDetailController] - Received files:" + carDetailJson);
        carDetailService.addCarDetail(carDetailJson);
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

    @PostMapping("/updateStatus")
    public ResponseEntity<ResponseObject<OrderCarStatus>> updateStatus(@RequestBody UpdateStatusRequest updateStatusRequest) {
        ResponseObject<OrderCarStatus> responseObject = new ResponseObject<>();
        OrderCarStatus orderCarStatus = carDetailService.updateStatus(updateStatusRequest);
        responseObject.setData(orderCarStatus);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @GetMapping("/latest/{siteId}")
    public ResponseEntity<ResponseObject<List<CameraResponseDTO>>> getLatestCameraInfo(@PathVariable Integer siteId){
        ResponseObject<List<CameraResponseDTO>> responseObject = new ResponseObject<>();
        System.out.println(siteId);
        List<CameraResponseDTO> cameraResponseList = carDetailService.latestInfo(siteId);
        responseObject.setData(cameraResponseList);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ResponseObject<List<OrderItemCarDetailProjection>>> getOrderBySiteId(
            @RequestParam(value = "itemName", required = false) String itemName,
            @RequestParam(value = "date") @DateTimeFormat(pattern = "dd/MM/yyyy") LocalDate localDate,
            @RequestParam(required = false) String startTime,
            @RequestParam(required = false) String endTime, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        String token = jwtHelper.cleanToken(authHeader);
        String siteId = jwtHelper.extractSiteId(token);
        ResponseObject<List<OrderItemCarDetailProjection>> responseObject = new ResponseObject<>();
        List<OrderItemCarDetailProjection> orderItems = orderDetailService.getOrderItems(Integer.valueOf(siteId), itemName, localDate, startTime, endTime);
        responseObject.setData(orderItems);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }
}
