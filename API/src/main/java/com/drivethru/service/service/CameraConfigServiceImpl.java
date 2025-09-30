package com.drivethru.service.service;

import com.drivethru.service.dto.CameraConfigRequest;
import com.drivethru.service.dto.CameraConfigResponse;
import com.drivethru.service.entity.*;
import com.drivethru.service.entity.types.RoleName;
import com.drivethru.service.error.CustomErrorHolder;
import com.drivethru.service.error.CustomException;
import com.drivethru.service.repository.*;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class CameraConfigServiceImpl implements CameraConfigService {

    @Autowired
    CameraConfigRepository cameraConfigRepository;

    @Autowired
    UserDetailRepository userDetailRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    TenantRepository tenantRepository;

    @Autowired
    SiteRepository siteRepository;

    @Override
    public List<CameraConfigResponse> getAllCameraConfigsBySiteId(Integer siteId) {
        List<CameraConfig> cameraConfigs = cameraConfigRepository.findAllBySiteIdAndIsActiveTrue(siteId);
        return cameraConfigs.stream().map(configs -> {
            CameraConfigResponse cameraConfigResponse = new CameraConfigResponse();
            BeanUtils.copyProperties(configs, cameraConfigResponse);
            tenantRepository.findById(configs.getTenantId()).ifPresent(tenant -> cameraConfigResponse.setTenantName(tenant.getTenantName()));
            siteRepository.findById(configs.getSiteId()).ifPresent(site -> cameraConfigResponse.setSiteName(site.getSiteName()));
            userDetailRepository.findById(configs.getCreatedBy()).ifPresent(createdUser -> cameraConfigResponse.setCreateByName(createdUser.getFirstName() + " " + createdUser.getSurName()));
            if (configs.getUpdatedBy() != null) {
                userDetailRepository.findById(configs.getUpdatedBy()).ifPresent(updatedUser -> cameraConfigResponse.setUpdateByName(updatedUser.getFirstName() + " " + updatedUser.getSurName()));
            }
            return cameraConfigResponse;
        }).collect(Collectors.toList());
    }

    @Override
    public CameraConfigResponse addCameraConfigs(CameraConfigRequest cameraConfigRequest, String loginId) {
        int loginUserId = Integer.parseInt(loginId);
        UserDetail detail = userDetailRepository.findByUserIdAndIsActiveTrue(loginUserId);
        Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
        if (!Objects.equals(role.getRoleName(), RoleName.SUPER_ADMIN.getDescription())) {
            throw new CustomException(CustomErrorHolder.ONLY_SUPER_ADMIN_CAN_ACCESS);
        }
        CameraConfig cameraConfig = new CameraConfig();
        cameraConfig.setTenantId(cameraConfigRequest.getTenantId());
        cameraConfig.setSiteId(cameraConfigRequest.getSiteId());
        cameraConfig.setCameraName(cameraConfigRequest.getCameraName());
        cameraConfig.setDescription(cameraConfigRequest.getDescription());
        cameraConfig.setCameraType(cameraConfigRequest.getCameraType());
        cameraConfig.setCameraIpAddress(cameraConfigRequest.getCameraIpAddress());
        cameraConfig.setOrderIpAddress(cameraConfigRequest.getOrderIpAddress());
        cameraConfig.setReloadTime(cameraConfigRequest.getReloadTime());
        cameraConfig.setActive(true);
        cameraConfig.setCreatedBy(detail.getUserId());
        cameraConfig.setCreatedDate(LocalDateTime.now());
        cameraConfigRepository.save(cameraConfig);
        CameraConfigResponse cameraConfigResponse = new CameraConfigResponse();
        BeanUtils.copyProperties(cameraConfig, cameraConfigResponse);
        Tenant tenant = tenantRepository.findByTenantIdAndIsActiveTrue(cameraConfigRequest.getTenantId());
        Site site = siteRepository.findBySiteIdAndIsActiveTrue(cameraConfigRequest.getSiteId());
        UserDetail createdUserDetail = userDetailRepository.findByUserIdAndIsActiveTrue(cameraConfig.getCreatedBy());
        cameraConfigResponse.setTenantName(tenant.getTenantName());
        cameraConfigResponse.setSiteName(site.getSiteName());
        cameraConfigResponse.setCreateByName(createdUserDetail.getFirstName() + " " + createdUserDetail.getSurName());
        return cameraConfigResponse;
    }

    @Override
    public CameraConfigResponse editCameraConfigs(Integer cameraConfigId, CameraConfigRequest cameraConfigRequest, String loginId) {
        int loginUserId = Integer.parseInt(loginId);
        UserDetail detail = userDetailRepository.findByUserIdAndIsActiveTrue(loginUserId);
        Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
        if (!Objects.equals(role.getRoleName(), RoleName.SUPER_ADMIN.getDescription())) {
            throw new CustomException(CustomErrorHolder.ONLY_SUPER_ADMIN_CAN_ACCESS);
        }
        CameraConfig cameraConfig = cameraConfigRepository.findById(cameraConfigId).orElseThrow(() -> new CustomException(CustomErrorHolder.CAMERA_CONFIG_NOT_FOUND));
        if (cameraConfigRequest.getTenantId() != null) {
            cameraConfig.setTenantId(cameraConfigRequest.getTenantId());
        }
        if (cameraConfigRequest.getSiteId() != null) {
            cameraConfig.setSiteId(cameraConfigRequest.getSiteId());
        }
        if (cameraConfigRequest.getCameraName() != null) {
            cameraConfig.setCameraName(cameraConfigRequest.getCameraName());
        }
        if (cameraConfigRequest.getCameraType() != null) {
            cameraConfig.setCameraType(cameraConfigRequest.getCameraType());
        }
        if (cameraConfigRequest.getCameraIpAddress() != null) {
            cameraConfig.setCameraIpAddress(cameraConfigRequest.getCameraIpAddress());
        }
        if (cameraConfigRequest.getOrderIpAddress() != null) {
            cameraConfig.setOrderIpAddress(cameraConfigRequest.getOrderIpAddress());
        }
        if (cameraConfigRequest.getDescription() != null) {
            cameraConfig.setDescription(cameraConfigRequest.getDescription());
        }
        if(cameraConfigRequest.getReloadTime() != null) {
            cameraConfig.setReloadTime(cameraConfigRequest.getReloadTime());
        }
        cameraConfig.setUpdatedBy(detail.getUserId());
        cameraConfig.setUpdatedDate(LocalDateTime.now());
        cameraConfigRepository.save(cameraConfig);
        CameraConfigResponse cameraConfigResponse = new CameraConfigResponse();
        BeanUtils.copyProperties(cameraConfig, cameraConfigResponse);
        Tenant tenant = tenantRepository.findByTenantIdAndIsActiveTrue(cameraConfig.getTenantId());
        Site site = siteRepository.findBySiteIdAndIsActiveTrue(cameraConfig.getSiteId());
        UserDetail createdUserDetail = userDetailRepository.findByUserIdAndIsActiveTrue(cameraConfig.getCreatedBy());
        UserDetail updatedUserDetail = userDetailRepository.findByUserIdAndIsActiveTrue(cameraConfig.getUpdatedBy());
        cameraConfigResponse.setTenantName(tenant.getTenantName());
        cameraConfigResponse.setSiteName(site.getSiteName());
        cameraConfigResponse.setCreateByName(createdUserDetail.getFirstName() + " " + createdUserDetail.getSurName());
        cameraConfigResponse.setUpdateByName(updatedUserDetail.getFirstName() + " " + updatedUserDetail.getSurName());
        return cameraConfigResponse;
    }

    @Override
    public boolean deleteCameraConfig(Integer cameraConfigId, String loginId) {
        int loginUserId = Integer.parseInt(loginId);
        UserDetail detail = userDetailRepository.findByUserIdAndIsActiveTrue(loginUserId);
        Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
        if (!Objects.equals(role.getRoleName(), RoleName.SUPER_ADMIN.getDescription())) {
            throw new CustomException(CustomErrorHolder.ONLY_SUPER_ADMIN_CAN_ACCESS);
        }
        CameraConfig cameraConfig = cameraConfigRepository.findByCameraIdAndIsActiveTrue(cameraConfigId);
        cameraConfig.setActive(false);
        cameraConfig.setUpdatedBy(detail.getUserId());
        cameraConfig.setUpdatedDate(LocalDateTime.now());
        cameraConfigRepository.save(cameraConfig);
        return true;
    }

    @Override
    public List<CameraConfigResponse> getAllCameraConfigs() {
        List<CameraConfig> cameraConfigs = cameraConfigRepository.findAll();
        return cameraConfigs.stream().map(configs -> {
            CameraConfigResponse cameraConfigResponse = new CameraConfigResponse();
            BeanUtils.copyProperties(configs, cameraConfigResponse);
            siteRepository.findById(configs.getSiteId()).ifPresent(site -> cameraConfigResponse.setSiteName(site.getSiteName()));
            tenantRepository.findById(configs.getTenantId()).ifPresent(tenant -> cameraConfigResponse.setTenantName(tenant.getTenantName()));
            userDetailRepository.findById(configs.getCreatedBy()).ifPresent(createdUser -> cameraConfigResponse.setCreateByName(createdUser.getFirstName() + " " + createdUser.getSurName()));
            if (configs.getUpdatedBy() != null) {
                userDetailRepository.findById(configs.getUpdatedBy()).ifPresent(updatedUser -> cameraConfigResponse.setUpdateByName(updatedUser.getFirstName() + " " + updatedUser.getSurName()));
            }
            return cameraConfigResponse;
        }).collect(Collectors.toList());
    }
}
