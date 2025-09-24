package com.drivethru.service.controller;

import com.drivethru.service.common.ResponseObject;
import com.drivethru.service.configuration.JwtHelper;
import com.drivethru.service.constant.RouteConstant;
import com.drivethru.service.dto.CameraConfigRequest;
import com.drivethru.service.dto.CameraConfigResponse;
import com.drivethru.service.service.CameraConfigService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(RouteConstant.CAMERA)
public class CameraConfigController {

    @Autowired
    CameraConfigService cameraConfigService;

    @Autowired
    JwtHelper jwtHelper;

    @GetMapping
    public ResponseEntity<ResponseObject<List<CameraConfigResponse>>> getAllCameraConfigs() {
        ResponseObject<List<CameraConfigResponse>> responseObject = new ResponseObject<>();
        List<CameraConfigResponse> cameraConfigs = cameraConfigService.getAllCameraConfigs();
        responseObject.setData(cameraConfigs);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ResponseObject<CameraConfigResponse>> addCameraConfig(@RequestBody CameraConfigRequest cameraConfigRequest, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        String token = jwtHelper.cleanToken(authHeader);
        String id = jwtHelper.extractUserId(token);
        ResponseObject<CameraConfigResponse> responseObject = new ResponseObject<>();
        CameraConfigResponse cameraConfigResponse = cameraConfigService.addCameraConfigs(cameraConfigRequest, id);
        responseObject.setData(cameraConfigResponse);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @PutMapping("/{CameraConfigId}")
    public ResponseEntity<ResponseObject<CameraConfigResponse>> editCameraConfig(@PathVariable Integer CameraConfigId, @RequestBody CameraConfigRequest cameraConfigRequest, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        String token = jwtHelper.cleanToken(authHeader);
        String id = jwtHelper.extractUserId(token);
        ResponseObject<CameraConfigResponse> responseObject = new ResponseObject<>();
        CameraConfigResponse cameraConfigResponse = cameraConfigService.editCameraConfigs(CameraConfigId, cameraConfigRequest, id);
        responseObject.setData(cameraConfigResponse);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @DeleteMapping("/{CameraConfigId}")
    public ResponseEntity<ResponseObject<String>> deleteTenant(@PathVariable Integer CameraConfigId, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        String token = jwtHelper.cleanToken(authHeader);
        String id = jwtHelper.extractUserId(token);
        ResponseObject<String> responseObject = new ResponseObject<>();
        Boolean CameraConfig = cameraConfigService.deleteCameraConfig(CameraConfigId, id);
        responseObject.setData("Delete CameraConfig Successfully");
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }
}
