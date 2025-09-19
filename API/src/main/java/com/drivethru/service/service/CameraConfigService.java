package com.drivethru.service.service;

import com.drivethru.service.entity.CameraConfig;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface CameraConfigService {
    List<CameraConfig> getAllCameraConfigs();
}
