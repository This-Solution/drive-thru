package com.drivethru.service.controller;

import com.drivethru.service.common.ResponseObject;
import com.drivethru.service.dto.CarDetailRequest;
import com.drivethru.service.entity.CarLog;
import com.drivethru.service.service.CarLogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/CarLog")
public class CarLogController {

    @Autowired
    CarLogService carLogService;

    @PostMapping
    public ResponseEntity<ResponseObject<CarLog>> getCarDetail(@RequestBody CarDetailRequest carDetailRequest) {
        ResponseObject<CarLog> responseObject = new ResponseObject<>();
        CarLog carLog = carLogService.getCarLogDetails(carDetailRequest);
        responseObject.setData(carLog);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

}
