package com.drivethru.service.repository;

import com.drivethru.service.entity.CarVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CarVisitRepository extends JpaRepository<CarVisit, Integer> {
    CarVisit findFirstByCarIdAndTenantIdOrderByCreatedDateDesc(Integer carId, Integer TenantId);

    Optional<CarVisit> findFirstByTenantIdOrderByCreatedDateDesc(Integer tenantId);

    Optional<CarVisit> findFirstByTenantIdAndCameraIdOrderByCreatedDateDesc(Integer tenantId, Integer cameraId);

    CarVisit findFirstByCameraIdAndCreatedDateAfterOrderByCreatedDateDesc(Integer cameraId, LocalDateTime createdDate);

    List<CarVisit> findByCarId(Integer carId);

    @Query("SELECT c FROM CarVisit c WHERE c.carId = :carId AND c.createdDate > :cutoffTime")
    List<CarVisit> findRecentVisit(@Param("carId") Integer carId, @Param("cutoffTime") LocalDateTime cutoffTime);

}
