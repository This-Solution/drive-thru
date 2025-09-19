package com.drivethru.service.service;

import com.drivethru.service.dto.CameraConfigRequest;
import com.drivethru.service.entity.CameraConfig;
import com.drivethru.service.entity.Role;
import com.drivethru.service.entity.UserDetail;
import com.drivethru.service.entity.types.RoleName;
import com.drivethru.service.error.CustomErrorHolder;
import com.drivethru.service.error.CustomException;
import com.drivethru.service.repository.CameraConfigRepository;
import com.drivethru.service.repository.RoleRepository;
import com.drivethru.service.repository.UserDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class CameraConfigServiceImpl implements CameraConfigService {

    @Autowired
    CameraConfigRepository cameraConfigRepository;

    @Autowired
    UserDetailRepository userDetailRepository;

    @Autowired
    RoleRepository roleRepository;

    @Override
    public List<CameraConfig> getAllCameraConfigs() {
        return cameraConfigRepository.findAllByIsActiveTrue();
    }

    public CameraConfig addCameraConfigs(CameraConfigRequest cameraConfigRequest, String loginId) {
        int loginUserId = Integer.parseInt(loginId);
        UserDetail detail = userDetailRepository.findById(loginUserId).orElseThrow(() -> new CustomException(CustomErrorHolder.USER_NOT_FOUND));
        Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
        if (!Objects.equals(role.getRoleName(), RoleName.SUPER_ADMIN.toString())) {
            throw new CustomException(CustomErrorHolder.ONLY_SUPER_ADMIN_CAN_ACCESS);
        }
        CameraConfig cameraConfig = new CameraConfig();
        cameraConfig.setTenantId(cameraConfigRequest.getTenantId());
        cameraConfig.setSiteId(cameraConfigRequest.getSiteId());
        cameraConfig.setCameraName(cameraConfigRequest.getCameraName());
        cameraConfig.setCameraType(cameraConfigRequest.getCameraType());
        cameraConfig.setCameraIpAddress(cameraConfigRequest.getCameraIpAddress());
        cameraConfig.setOrderIpAddress(cameraConfigRequest.getOrderIpAddress());
        cameraConfig.setActive(true);
        cameraConfig.setCreatedBy(detail.getUserId());
        cameraConfig.setCreatedDate(LocalDateTime.now());
        cameraConfigRepository.save(cameraConfig);
        return cameraConfig;
    }

    public CameraConfig editCameraConfigs(Integer cameraConfigId, CameraConfigRequest cameraConfigRequest, String loginId) {
        int loginUserId = Integer.parseInt(loginId);
        UserDetail detail = userDetailRepository.findById(loginUserId).orElseThrow(() -> new CustomException(CustomErrorHolder.USER_NOT_FOUND));
        Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
        if (!Objects.equals(role.getRoleName(), RoleName.SUPER_ADMIN.toString())) {
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
        cameraConfig.setUpdatedBy(detail.getUserId());
        cameraConfig.setUpdatedDate(LocalDateTime.now());
        cameraConfigRepository.save(cameraConfig);
        return cameraConfig;
    }

    public boolean deleteCameraConfig(Integer cameraConfigId, String loginId) {
        int loginUserId = Integer.parseInt(loginId);
        UserDetail detail = userDetailRepository.findById(loginUserId).orElseThrow(() -> new CustomException(CustomErrorHolder.USER_NOT_FOUND));
        Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
        return true;
    }
}
