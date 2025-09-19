package com.drivethru.service.controller;

import com.drivethru.service.common.ResponseObject;
import com.drivethru.service.configuration.JwtHelper;
import com.drivethru.service.constant.RouteConstant;
import com.drivethru.service.dto.SiteRequest;
import com.drivethru.service.entity.Site;
import com.drivethru.service.service.SiteService;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(RouteConstant.SITE)
public class SiteController {

    @Autowired
    SiteService siteService;

    @Autowired
    JwtHelper jwtHelper;

    @PostMapping
    public ResponseEntity<ResponseObject<Site>> addSite(@RequestBody SiteRequest siteRequest, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        String token = jwtHelper.cleanToken(authHeader);
        String id = jwtHelper.extractUserId(token);
        ResponseObject<Site> responseObject = new ResponseObject<>();
        Site site = siteService.addSite(siteRequest, id);
        responseObject.setData(site);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @PutMapping("/{siteId}")
    public ResponseEntity<ResponseObject<Site>> editSite(@PathVariable Integer siteId, @RequestBody SiteRequest siteRequest, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        String token = jwtHelper.cleanToken(authHeader);
        String id = jwtHelper.extractUserId(token);
        ResponseObject<Site> responseObject = new ResponseObject<>();
        Site site = siteService.editSite(siteId, siteRequest, id);
        responseObject.setData(site);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @DeleteMapping("/{siteId}")
    public ResponseEntity<ResponseObject<String>> deleteSite(@PathVariable Integer siteId, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        String token = jwtHelper.cleanToken(authHeader);
        String id = jwtHelper.extractUserId(token);
        ResponseObject<String> responseObject = new ResponseObject<>();
        Boolean site = siteService.deleteSite(siteId, id);
        responseObject.setData("Delete User Successfully");
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ResponseObject<List<Site>>> getAllUsers() {
        ResponseObject<List<Site>> responseObject = new ResponseObject<>();
        List<Site> sites = siteService.getAllSites();
        responseObject.setData(sites);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }
}
