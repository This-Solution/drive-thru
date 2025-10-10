package com.drivethru.service.repository;

import com.drivethru.service.entity.CarLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface CarLogRepository extends JpaRepository<CarLog, Integer> {
    Optional<CarLog> findByCarVisitId(Integer carVisitId);
}
