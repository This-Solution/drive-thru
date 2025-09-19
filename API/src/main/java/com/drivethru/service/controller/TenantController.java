package com.drivethru.service.controller;

import com.drivethru.service.common.ResponseObject;
import com.drivethru.service.constant.RouteConstant;
import com.drivethru.service.entity.Tenant;
import com.drivethru.service.service.TenantService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(RouteConstant.TENANT)
public class TenantController {

    @Autowired
    TenantService tenantService;

    @GetMapping
    public ResponseEntity<ResponseObject<List<Tenant>>> getAllTenants() {
        ResponseObject<List<Tenant>> responseObject = new ResponseObject<>();
        List<Tenant> tenants = tenantService.getAllTenant();
        responseObject.setData(tenants);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }
}
