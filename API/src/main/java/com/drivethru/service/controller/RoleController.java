package com.drivethru.service.controller;

import com.drivethru.service.common.ResponseObject;
import com.drivethru.service.constant.RouteConstant;
import com.drivethru.service.entity.Role;
import com.drivethru.service.service.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(RouteConstant.ROLE)
public class RoleController {

    @Autowired
    RoleService roleService;

    @GetMapping
    public ResponseEntity<ResponseObject<List<Role>>> getAllRoles() {
        ResponseObject<List<Role>> responseObject = new ResponseObject<>();
        List<Role> Roles = roleService.getAllRoles();
        responseObject.setData(Roles);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }
}
