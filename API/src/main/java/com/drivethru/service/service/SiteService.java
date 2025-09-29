package com.drivethru.service.service;

import com.drivethru.service.dto.SiteRequest;
import com.drivethru.service.dto.SiteResponse;
import com.drivethru.service.entity.Site;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface SiteService {
    SiteResponse addSite(SiteRequest siteRequest, String loginId);

    SiteResponse editSite(Integer siteId, SiteRequest siteRequest, String loginId);

    boolean deleteSite(Integer siteId, String loginId);

    List<SiteResponse> getAllSites();

    List<Site> getAllSitesByTenantId(Integer tenantId);
}
