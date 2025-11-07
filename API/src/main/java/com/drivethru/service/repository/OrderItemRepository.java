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
            "cd.CarType AS carType, " +
            "cd.CarId AS carId, " +
            "od.TotalPrice AS totalPrice "+
            "FROM Sales.OrderItem oi " +
            "INNER JOIN Sales.OrderDetail od ON oi.OrderId = od.OrderId " +
            "INNER JOIN Vehicle.CarDetail cd ON od.CarId = cd.CarId " +
            "WHERE od.SiteId = :siteId " +
            "AND (:searchTerm IS NULL OR cd.CarPlateNumber LIKE :searchTerm + '%' OR oi.Name LIKE :searchTerm + '%') " +
            "AND oi.CreatedDate BETWEEN :startTime AND :endTime " +
            "ORDER BY" +
            "   CASE WHEN :sortBy = 'createdDate' AND :sortDir = 'asc' THEN oi.CreatedDate END ASC," +
            "   CASE WHEN :sortBy = 'createdDate' AND :sortDir = 'desc' THEN oi.CreatedDate END DESC," +
            "   CASE WHEN :sortBy = 'totalPrice' AND :sortDir = 'asc' THEN od.TotalPrice END ASC," +
            "   CASE WHEN :sortBy = 'totalPrice' AND :sortDir = 'desc' THEN od.TotalPrice END DESC," +
            "   CASE WHEN :sortBy = 'carColor' AND :sortDir = 'asc' THEN cd.CarColor END ASC," +
            "   CASE WHEN :sortBy = 'carColor' AND :sortDir = 'desc' THEN cd.CarColor END DESC",
            nativeQuery = true)
    List<OrderItemCarDetailProjection> findOrderItemsWithCarDetails(
            @Param("siteId") Integer siteId,
            @Param("searchTerm") String itemName,
            @Param("startTime") LocalDateTime startTime,
            @Param("endTime") LocalDateTime endTime,
            @Param("sortBy") String sortBy,
            @Param("sortDir") String sortDir
    );
}
