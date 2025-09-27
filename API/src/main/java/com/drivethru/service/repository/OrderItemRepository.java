package com.drivethru.service.repository;

import com.drivethru.service.dto.OrderItemCarDetailProjection;
import com.drivethru.service.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {
    List<OrderItem> findByOrderId(Integer orderId);

    @Query(value = "SELECT " +
            "oi.OrderItemId AS orderItemId, " +
            "oi.OrderId AS orderId, " +
            "oi.Name AS name, " +
            "oi.Price AS price, " +
            "oi.Quantity AS quantity, " +
            "oi.CreatedDate AS createdDate, " +
            "cd.CarPlateNumber AS carPlateNumber, " +
            "cd.CarColor AS carColor, " +
            "cd.CarId AS carId " +
            "FROM Sales.OrderItem oi " +
            "INNER JOIN Sales.OrderDetail od ON oi.OrderId = od.OrderId " +
            "INNER JOIN Vehicle.CarDetail cd ON od.CarId = cd.CarId " +
            "WHERE od.SiteId = :siteId " +
            "AND (:itemName IS NULL OR oi.Name = :itemName) " +
            "AND oi.CreatedDate BETWEEN :startTime AND :endTime",
            nativeQuery = true)
    List<OrderItemCarDetailProjection> findOrderItemsWithCarDetails(
            @Param("siteId") Integer siteId,
            @Param("itemName") String itemName,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime
    );
}
