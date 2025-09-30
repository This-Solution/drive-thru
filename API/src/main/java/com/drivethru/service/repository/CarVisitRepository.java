package com.drivethru.service.repository;

import com.drivethru.service.entity.CarVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CarVisitRepository extends JpaRepository<CarVisit, Integer> {
    CarVisit findFirstByCarIdAndTenantIdOrderByCreatedDateDesc(Integer carId, Integer TenantId);

    CarVisit findFirstByTenantIdAndSiteIdAndCameraIdOrderByCreatedDateDesc(Integer tenantId, Integer siteId, Integer cameraId);

    CarVisit findFirstByCameraIdAndCreatedDateAfterOrderByCreatedDateDesc(Integer cameraId, LocalDateTime createdDate);

    List<CarVisit> findByCarId(Integer carId);

    boolean existsByCarIdAndSiteIdAndCameraIdAndCreatedDateAfter(Integer carId, Integer siteId, Integer cameraId, LocalDateTime createdDate);

}
