package com.drivethru.service.controller;

import com.drivethru.service.common.ResponseObject;
import com.drivethru.service.constant.RouteConstant;
import com.drivethru.service.entity.CameraConfig;
import com.drivethru.service.service.CameraConfigService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(RouteConstant.CAMERA)
public class CameraConfigController {

    @Autowired
    CameraConfigService cameraConfigService;

    @GetMapping
    public ResponseEntity<ResponseObject<List<CameraConfig>>> getAllCameraConfigs() {
        ResponseObject<List<CameraConfig>> responseObject = new ResponseObject<>();
        List<CameraConfig> cameraConfigs = cameraConfigService.getAllCameraConfigs();
        responseObject.setData(cameraConfigs);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }
}
