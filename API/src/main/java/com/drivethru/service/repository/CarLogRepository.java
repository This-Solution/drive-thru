package com.drivethru.service.repository;

import com.drivethru.service.entity.CarLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CarLogRepository extends JpaRepository<CarLog, Integer> {
}
