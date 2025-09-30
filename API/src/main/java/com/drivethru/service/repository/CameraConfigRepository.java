package com.drivethru.service.repository;

import com.drivethru.service.entity.CameraConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CameraConfigRepository extends JpaRepository<CameraConfig, Integer> {
    List<CameraConfig> findByTenantId(Integer tenantId);

    CameraConfig findByCameraNameAndSiteIdAndIsActiveTrue(String cameraName , Integer siteId);

    List<CameraConfig> findAllByIsActiveTrue();

    CameraConfig findBySiteIdAndTenantIdAndCameraNameAndIsActiveTrue(Integer siteId, Integer tenantId, String cameraName);

    CameraConfig findByCameraIdAndIsActiveTrue(Integer cameraId);

    List<CameraConfig> findAllBySiteIdAndIsActiveTrue(Integer siteId);
}
