package com.drivethru.service.service;

import com.drivethru.service.dto.TenantRequest;
import com.drivethru.service.dto.TenantResponse;
import com.drivethru.service.entity.Tenant;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface TenantService {
    List<TenantResponse> getAllTenant();

    TenantResponse addTenant(TenantRequest tenantRequest, String loginId);

    TenantResponse editTenant(Integer tenantId, TenantRequest tenantRequest, String loginId);

    boolean deleteTenant(Integer tenantId, String loginId);
}
