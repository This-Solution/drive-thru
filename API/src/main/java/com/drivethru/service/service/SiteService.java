package com.drivethru.service.service;

import com.drivethru.service.dto.SiteRequest;
import com.drivethru.service.entity.Site;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SiteService {
    Site addSite(SiteRequest siteRequest, String loginId);

    Site editSite(Integer siteId, SiteRequest siteRequest, String loginId);

    boolean deleteSite(Integer siteId, String loginId);

    List<Site> getAllSites();
}
