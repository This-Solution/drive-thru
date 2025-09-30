package com.drivethru.service.repository;

import com.drivethru.service.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface OrderDetailRepository extends JpaRepository<OrderDetail, Integer> {

    OrderDetail findFirstByTenantIdAndCarPlateNumberOrderByCreatedDateDesc(Integer tenantId, String carPlateNumber);

    Optional<OrderDetail> findFirstByTenantIdAndCarPlateNumberAndOrderStatusOrderByCreatedDateDesc(Integer tenantId, String carPlateNumber, String orderStatus);

    List<OrderDetail> findByTenantIdAndCarPlateNumberAndOrderStatus(Integer tenantId, String carPlateNumber, String orderStatus);
}
