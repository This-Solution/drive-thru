package com.drivethru.service.repository;

import com.drivethru.service.entity.OrderCarStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderCarStatusRepository extends JpaRepository<OrderCarStatus, Integer> {
    List<OrderCarStatus> findByCarId(Integer carId);

    OrderCarStatus findByOrderIdAndCarId(Integer OrderId, Integer CarId);
}
