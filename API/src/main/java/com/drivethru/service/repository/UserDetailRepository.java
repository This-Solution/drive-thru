package com.drivethru.service.repository;

import com.drivethru.service.entity.UserDetail;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserDetailRepository extends JpaRepository<UserDetail, Integer> {
    UserDetail findByEmailAndIsActive(String email, boolean isActive);

    List<UserDetail> findAllByIsActiveTrue();

    UserDetail findByUserIdAndIsActiveTrue(Integer serId);

    List<UserDetail> findBySiteId(Integer siteId);
}
