package com.drivethru.service.repository;

import com.drivethru.service.entity.Site;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SiteRepository extends JpaRepository<Site, Integer> {
    List<Site> findAllByIsActiveTrue();

    Site findBySiteName(String siteName);

    Site findBySiteIdAndIsActiveTrue(Integer SiteId);
}
