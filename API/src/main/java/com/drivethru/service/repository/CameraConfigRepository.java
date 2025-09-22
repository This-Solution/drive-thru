package com.drivethru.service.repository;

import com.drivethru.service.entity.CameraConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CameraConfigRepository extends JpaRepository<CameraConfig, Integer> {
    CameraConfig findByCameraIpAddress(String cameraIpAddress);

    CameraConfig findByOrderIpAddress(String orderIpAddress);

    List<CameraConfig> findAllByIsActiveTrue();

    CameraConfig findBySiteIdAndTenantIdAndCameraName(Integer siteId, Integer tenantId ,String cameraName);
}
