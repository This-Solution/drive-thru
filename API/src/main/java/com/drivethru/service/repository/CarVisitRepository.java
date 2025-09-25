package com.drivethru.service.repository;

import com.drivethru.service.entity.CarVisit;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarVisitRepository extends JpaRepository<CarVisit, Integer> {
    CarVisit findFirstByCarIdAndTenantIdOrderByCreatedDateDesc(Integer carId, Integer TenantId);
    Optional<CarVisit> findFirstByTenantIdOrderByCreatedDateDesc(Integer tenantId);
    CarVisit findFirstByCameraIdOrderByCreatedDateDesc(Integer cameraId);
    List<CarVisit> findByCarId(Integer carId);
}
