package com.drivethru.service.controller;

import com.drivethru.service.common.ResponseObject;
import com.drivethru.service.configuration.JwtHelper;
import com.drivethru.service.constant.RouteConstant;
import com.drivethru.service.dto.SiteRequest;
import com.drivethru.service.dto.SiteResponse;
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
    public ResponseEntity<ResponseObject<SiteResponse>> addSite(@RequestBody SiteRequest siteRequest, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        String token = jwtHelper.cleanToken(authHeader);
        String id = jwtHelper.extractUserId(token);
        ResponseObject<SiteResponse> responseObject = new ResponseObject<>();
        SiteResponse siteResponse = siteService.addSite(siteRequest, id);
        responseObject.setData(siteResponse);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @PutMapping("/{siteId}")
    public ResponseEntity<ResponseObject<SiteResponse>> editSite(@PathVariable Integer siteId, @RequestBody SiteRequest siteRequest, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        String token = jwtHelper.cleanToken(authHeader);
        String id = jwtHelper.extractUserId(token);
        ResponseObject<SiteResponse> responseObject = new ResponseObject<>();
        SiteResponse siteResponse = siteService.editSite(siteId, siteRequest, id);
        responseObject.setData(siteResponse);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @DeleteMapping("/{siteId}")
    public ResponseEntity<ResponseObject<String>> deleteSite(@PathVariable Integer siteId, HttpServletRequest httpServletRequest) {
        String authHeader = httpServletRequest.getHeader(HttpHeaders.AUTHORIZATION);
        String token = jwtHelper.cleanToken(authHeader);
        String id = jwtHelper.extractUserId(token);
        ResponseObject<String> responseObject = new ResponseObject<>();
        Boolean site = siteService.deleteSite(siteId, id);
        responseObject.setData("Delete Site Successfully");
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @GetMapping
    public ResponseEntity<ResponseObject<List<SiteResponse>>> getAllSite() {
        ResponseObject<List<SiteResponse>> responseObject = new ResponseObject<>();
        List<SiteResponse> sites = siteService.getAllSites();
        responseObject.setData(sites);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @GetMapping("/{TenantId}")
    public ResponseEntity<ResponseObject<List<Site>>> getAllSitesByTenantId(@PathVariable Integer TenantId) {
        ResponseObject<List<Site>> responseObject = new ResponseObject<>();
        List<Site> sites = siteService.getAllSitesByTenantId(TenantId);
        responseObject.setData(sites);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }

    @GetMapping("getAllSitesByStatus/{isActive}")
    public ResponseEntity<ResponseObject<List<SiteResponse>>> getAllSitesByStatus(@PathVariable String isActive) {
        ResponseObject<List<SiteResponse>> responseObject = new ResponseObject<>();
        List<SiteResponse> sites = siteService.getAllSitesByStatus(Boolean.parseBoolean(isActive));
        responseObject.setData(sites);
        return new ResponseEntity<>(responseObject, HttpStatus.OK);
    }


}
