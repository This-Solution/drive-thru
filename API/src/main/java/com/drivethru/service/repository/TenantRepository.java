package com.drivethru.service.repository;

import com.drivethru.service.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Integer> {
    Tenant findByTenantIdAndIsActiveTrue(Integer tenantId);

    List<Tenant> findAllByIsActiveTrue();

}
