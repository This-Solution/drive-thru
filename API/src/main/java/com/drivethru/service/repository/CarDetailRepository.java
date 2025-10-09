package com.drivethru.service.repository;

import com.drivethru.service.entity.CarDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface CarDetailRepository extends JpaRepository<CarDetail, Integer> {
    Optional<CarDetail> findByCarPlateNumber(String carPlateNumber);

    List<CarDetail> findAllByCreatedDateAfter(LocalDateTime createdDate);

}
