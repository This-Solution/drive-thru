package com.drivethru.service.controller;

import com.drivethru.service.common.ResponseObject;
import com.drivethru.service.configuration.JwtHelper;
import com.drivethru.service.constant.RouteConstant;
import com.drivethru.service.dto.TenantRequest;
import com.drivethru.service.dto.TenantResponse;
import com.drivethru.service.service.TenantService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(RouteConstant.TENANT)
public class TenantController {

    @Autowired
    TenantService tenantService;

    @Autowired
    JwtHelper jwtHelper;

    @GetMapping
    public ResponseEntity<ResponseObject<List<TenantResponse>>> getAllTenants() {
        ResponseObject<List<TenantResponse>> responseObject = new ResponseObject<>();
        List<TenantResponse> tenants = tenantService.getAllTenant();
        responseObject.setData(tenants);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @PostMapping
    public ResponseEntity<ResponseObject<TenantResponse>> addTenant(@RequestBody TenantRequest tenantRequest, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        String token = jwtHelper.cleanToken(authHeader);
        String id = jwtHelper.extractUserId(token);
        ResponseObject<TenantResponse> responseObject = new ResponseObject<>();
        TenantResponse tenantResponse = tenantService.addTenant(tenantRequest, id);
        responseObject.setData(tenantResponse);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @PutMapping("/{tenantId}")
    public ResponseEntity<ResponseObject<TenantResponse>> editTenant(@PathVariable Integer tenantId, @RequestBody TenantRequest tenantRequest, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        String token = jwtHelper.cleanToken(authHeader);
        String id = jwtHelper.extractUserId(token);
        ResponseObject<TenantResponse> responseObject = new ResponseObject<>();
        TenantResponse tenantResponse = tenantService.editTenant(tenantId, tenantRequest, id);
        responseObject.setData(tenantResponse);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @DeleteMapping("/{tenantId}")
    public ResponseEntity<ResponseObject<String>> deleteTenant(@PathVariable Integer tenantId, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        String token = jwtHelper.cleanToken(authHeader);
        String id = jwtHelper.extractUserId(token);
        ResponseObject<String> responseObject = new ResponseObject<>();
        Boolean tenant = tenantService.deleteTenant(tenantId, id);
        responseObject.setData("Delete Tenant Successfully");
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }
}
