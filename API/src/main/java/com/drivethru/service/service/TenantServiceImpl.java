package com.drivethru.service.service;

import com.drivethru.service.dto.SiteResponse;
import com.drivethru.service.dto.TenantRequest;
import com.drivethru.service.dto.TenantResponse;
import com.drivethru.service.entity.Role;
import com.drivethru.service.entity.Tenant;
import com.drivethru.service.entity.UserDetail;
import com.drivethru.service.entity.types.RoleName;
import com.drivethru.service.error.CustomErrorHolder;
import com.drivethru.service.error.CustomException;
import com.drivethru.service.repository.RoleRepository;
import com.drivethru.service.repository.TenantRepository;
import com.drivethru.service.repository.UserDetailRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class TenantServiceImpl implements TenantService {

    @Autowired
    TenantRepository tenantRepository;

    @Autowired
    UserDetailRepository userDetailRepository;

    @Autowired
    RoleRepository roleRepository;

    @Override
    public List<TenantResponse> getAllTenant() {
        List<Tenant> tenants = tenantRepository.findAll();
        return tenants.stream().map(tenant -> {
            TenantResponse tenantResponse = new TenantResponse();
            BeanUtils.copyProperties(tenant, tenantResponse);
            userDetailRepository.findById(tenant.getCreatedBy()).ifPresent(createdUser -> tenantResponse.setCreateByName(createdUser.getFirstName() + " " + createdUser.getSurName()));
            if (tenant.getUpdatedBy() != null) {
                userDetailRepository.findById(tenant.getUpdatedBy()).ifPresent(updatedUser -> tenantResponse.setUpdateByName(updatedUser.getFirstName() + " " + updatedUser.getSurName()));
            }
            return tenantResponse;
        }).collect(Collectors.toList());
    }

    @Override
    public TenantResponse addTenant(TenantRequest tenantRequest, String loginId) {
        int loginUserId = Integer.parseInt(loginId);
        UserDetail detail = userDetailRepository.findById(loginUserId).orElseThrow(() -> new CustomException(CustomErrorHolder.USER_NOT_FOUND));
        Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
        if (!Objects.equals(role.getRoleName(), RoleName.SUPER_ADMIN.toString())) {
            throw new CustomException(CustomErrorHolder.ONLY_SUPER_ADMIN_CAN_ACCESS);
        }
        Tenant tenant = new Tenant();
        tenant.setTenantName(tenantRequest.getTenantName());
        tenant.setUrl(tenantRequest.getUrl());
        tenant.setActive(true);
        tenant.setCreatedBy(detail.getUserId());
        tenant.setCreatedDate(LocalDateTime.now());
        tenantRepository.save(tenant);
        TenantResponse tenantResponse = new TenantResponse();
        BeanUtils.copyProperties(tenant, tenantResponse);
        Optional<UserDetail> createdUserDetail = userDetailRepository.findById(tenant.getCreatedBy());
        tenantResponse.setCreateByName(createdUserDetail.get().getFirstName() + " " + createdUserDetail.get().getSurName());
        return tenantResponse;
    }

    @Override
    public TenantResponse editTenant(Integer tenantId, TenantRequest tenantRequest, String loginId) {
        int loginUserId = Integer.parseInt(loginId);
        UserDetail detail = userDetailRepository.findById(loginUserId).orElseThrow(() -> new CustomException(CustomErrorHolder.USER_NOT_FOUND));
        Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
        if (!Objects.equals(role.getRoleName(), RoleName.SUPER_ADMIN.toString())) {
            throw new CustomException(CustomErrorHolder.ONLY_SUPER_ADMIN_CAN_ACCESS);
        }
        Tenant tenant = tenantRepository.findById(tenantId).orElseThrow(() -> new CustomException(CustomErrorHolder.TENANT_NOT_FOUND));
        if (tenantRequest.getTenantName() != null) {
            tenant.setTenantName(tenantRequest.getTenantName());
        }
        if (tenantRequest.getUrl() != null) {
            tenant.setUrl(tenantRequest.getUrl());
        }
        tenant.setUpdatedBy(detail.getUserId());
        tenant.setUpdatedDate(LocalDateTime.now());
        tenantRepository.save(tenant);
        TenantResponse tenantResponse = new TenantResponse();
        BeanUtils.copyProperties(tenant, tenantResponse);
        Optional<UserDetail> createdUserDetail = userDetailRepository.findById(tenant.getCreatedBy());
        Optional<UserDetail> updatedUserDetail = userDetailRepository.findById(detail.getUserId());
        tenantResponse.setCreateByName(createdUserDetail.get().getFirstName() + " " + createdUserDetail.get().getSurName());
        tenantResponse.setUpdateByName(updatedUserDetail.get().getFirstName() + " " + updatedUserDetail.get().getSurName());
        return tenantResponse;
    }

    @Override
    public boolean deleteTenant(Integer tenantId, String loginId) {
        int loginUserId = Integer.parseInt(loginId);
        UserDetail detail = userDetailRepository.findById(loginUserId).orElseThrow(() -> new CustomException(CustomErrorHolder.USER_NOT_FOUND));
        Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
        if (!Objects.equals(role.getRoleName(), RoleName.SUPER_ADMIN.toString())) {
            throw new CustomException(CustomErrorHolder.ONLY_SUPER_ADMIN_CAN_ACCESS);
        }
        Tenant tenant = tenantRepository.findById(tenantId).orElseThrow(() -> new CustomException(CustomErrorHolder.TENANT_NOT_FOUND));
        tenant.setActive(false);
        tenant.setUpdatedBy(detail.getUserId());
        tenantRepository.save(tenant);
        return true;
    }
}
