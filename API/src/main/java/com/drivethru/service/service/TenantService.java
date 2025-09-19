package com.drivethru.service.service;

import com.drivethru.service.entity.Tenant;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TenantService {
    List<Tenant> getAllTenant();
}
