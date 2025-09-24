package com.drivethru.service.controller;

import com.drivethru.service.common.ResponseObject;
import com.drivethru.service.configuration.JwtHelper;
import com.drivethru.service.constant.RouteConstant;
import com.drivethru.service.dto.LoginRequest;
import com.drivethru.service.dto.LoginTokenResponse;
import com.drivethru.service.dto.UserDetailRequest;
import com.drivethru.service.dto.UserDetailResponse;
import com.drivethru.service.entity.Tenant;
import com.drivethru.service.entity.UserDetail;
import com.drivethru.service.service.UserDetailService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(RouteConstant.AUTH)
public class UserDetailController {

    @Autowired
    UserDetailService userDetailService;

    @Autowired
    JwtHelper jwtHelper;

    @PostMapping(RouteConstant.LOGIN)
    public ResponseEntity<ResponseObject<LoginTokenResponse>> login(@RequestBody LoginRequest loginRequest) {
        ResponseObject<LoginTokenResponse> responseObject = new ResponseObject<>();
        LoginTokenResponse login = userDetailService.login(loginRequest);
        responseObject.setData(login);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @PostMapping(RouteConstant.ADDUSER)
    public ResponseEntity<ResponseObject<UserDetailResponse>> addUser(@RequestBody UserDetailRequest userDetailRequest, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        String token = jwtHelper.cleanToken(authHeader);
        String id = jwtHelper.extractUserId(token);
        ResponseObject<UserDetailResponse> responseObject = new ResponseObject<>();
        UserDetailResponse userDetailResponse = userDetailService.addUser(userDetailRequest, id);
        responseObject.setData(userDetailResponse);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<ResponseObject<UserDetailResponse>> editUser(@PathVariable Integer userId, @RequestBody UserDetailRequest userDetailRequest, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        String token = jwtHelper.cleanToken(authHeader);
        String id = jwtHelper.extractUserId(token);
        ResponseObject<UserDetailResponse> responseObject = new ResponseObject<>();
        UserDetailResponse userDetailResponse = userDetailService.editUser(userId, userDetailRequest, id);
        responseObject.setData(userDetailResponse);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<ResponseObject<String>> deleteUser(@PathVariable Integer userId, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        String token = jwtHelper.cleanToken(authHeader);
        String id = jwtHelper.extractUserId(token);
        ResponseObject<String> responseObject = new ResponseObject<>();
        Boolean UserDetail = userDetailService.deleteUser(userId, id);
        responseObject.setData("Delete User Successfully");
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ResponseObject<List<UserDetailResponse>>> getAllUsers() {
        ResponseObject<List<UserDetailResponse>> responseObject = new ResponseObject<>();
        List<UserDetailResponse> userDetailResponses = userDetailService.getAllUser();
        responseObject.setData(userDetailResponses);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }
}
