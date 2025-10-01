package com.drivethru.service.service;

import com.drivethru.service.dto.CameraConfigRequest;
import com.drivethru.service.dto.CameraConfigResponse;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CameraConfigService {
    List<CameraConfigResponse> getAllCameraConfigsBySiteId(Integer siteId);

    CameraConfigResponse addCameraConfigs(CameraConfigRequest cameraConfigRequest, String loginId);

    CameraConfigResponse editCameraConfigs(Integer cameraConfigId, CameraConfigRequest cameraConfigRequest, String loginId);

    boolean deleteCameraConfig(Integer cameraConfigId, String loginId);

    List<CameraConfigResponse> getAllCameraConfigs(boolean isActive);
}
