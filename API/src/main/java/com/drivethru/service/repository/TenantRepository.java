package com.drivethru.service.repository;

import com.drivethru.service.entity.Tenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TenantRepository extends JpaRepository<Tenant, Integer> {
    Tenant findByTenantIdAndIsActiveTrue(Integer tenantId);
}
