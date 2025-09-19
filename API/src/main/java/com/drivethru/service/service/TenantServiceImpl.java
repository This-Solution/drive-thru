package com.drivethru.service.service;

import com.drivethru.service.entity.Tenant;
import com.drivethru.service.repository.TenantRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TenantServiceImpl implements TenantService {

    @Autowired
    TenantRepository tenantRepository;

    @Override
    public List<Tenant> getAllTenant() {
        return tenantRepository.findAll();
    }
}
