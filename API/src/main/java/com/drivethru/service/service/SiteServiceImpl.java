package com.drivethru.service.service;

import com.drivethru.service.dto.SiteRequest;
import com.drivethru.service.entity.Role;
import com.drivethru.service.entity.Site;
import com.drivethru.service.entity.UserDetail;
import com.drivethru.service.entity.types.RoleName;
import com.drivethru.service.error.CustomErrorHolder;
import com.drivethru.service.error.CustomException;
import com.drivethru.service.repository.RoleRepository;
import com.drivethru.service.repository.SiteRepository;
import com.drivethru.service.repository.UserDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

@Service
public class SiteServiceImpl implements SiteService {

    @Autowired
    UserDetailRepository userDetailRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    SiteRepository siteRepository;

    @Override
    public Site addSite(SiteRequest siteRequest, String loginId) {
        int loginUserId = Integer.parseInt(loginId);
        UserDetail detail = userDetailRepository.findById(loginUserId).orElseThrow(() -> new CustomException(CustomErrorHolder.USER_NOT_FOUND));
        Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
        if (!Objects.equals(role.getRoleName(), RoleName.SUPER_ADMIN.toString())) {
            throw new CustomException(CustomErrorHolder.ONLY_SUPER_ADMIN_CAN_ACCESS);
        }
        Site site = new Site();
        site.setTenantId(siteRequest.getTenantId());
        site.setSiteName(siteRequest.getSiteName());
        site.setAddressLine1(siteRequest.getAddressLine1());
        site.setAddressLine2(siteRequest.getAddressLine2());
        site.setCity(siteRequest.getCity());
        site.setState(siteRequest.getState());
        site.setPostal(siteRequest.getPostal());
        site.setActive(true);
        site.setCreatedBy(detail.getUserId());
        site.setCreatedDate(LocalDateTime.now());
        siteRepository.save(site);
        return site;
    }

    @Override
    public Site editSite(Integer siteId, SiteRequest siteRequest, String loginId) {
        int loginUserId = Integer.parseInt(loginId);
        UserDetail detail = userDetailRepository.findById(loginUserId).orElseThrow(() -> new CustomException(CustomErrorHolder.USER_NOT_FOUND));
        Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
        if (!Objects.equals(role.getRoleName(), RoleName.SUPER_ADMIN.toString())) {
            throw new CustomException(CustomErrorHolder.ONLY_SUPER_ADMIN_CAN_ACCESS);
        }
        Site site = siteRepository.findById(siteId).orElseThrow(() -> new CustomException(CustomErrorHolder.SITE_NOT_FOUND));
        if (siteRequest.getTenantId() != null) {
            site.setTenantId(siteRequest.getTenantId());
        }
        if (siteRequest.getSiteName() != null) {
            site.setSiteName(siteRequest.getSiteName());
        }
        if (siteRequest.getAddressLine1() != null) {
            site.setAddressLine1(siteRequest.getAddressLine1());
        }
        if (siteRequest.getAddressLine2() != null) {
            site.setAddressLine2(siteRequest.getAddressLine2());
        }
        if (siteRequest.getCity() != null) {
            site.setCity(siteRequest.getCity());
        }
        if (siteRequest.getState() != null) {
            site.setCity(siteRequest.getCity());
        }
        if (siteRequest.getPostal() != null) {
            site.setPostal(siteRequest.getPostal());
        }
        site.setUpdatedBy(detail.getUserId());
        site.setUpdatedDate(LocalDateTime.now());
        siteRepository.save(site);
        return site;
    }

    @Override
    public boolean deleteSite(Integer siteId, String loginId) {
        int loginUserId = Integer.parseInt(loginId);
        UserDetail detail = userDetailRepository.findById(loginUserId).orElseThrow(() -> new CustomException(CustomErrorHolder.USER_NOT_FOUND));
        Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
        if (!Objects.equals(role.getRoleName(), RoleName.SUPER_ADMIN.toString())) {
            throw new CustomException(CustomErrorHolder.ONLY_SUPER_ADMIN_CAN_ACCESS);
        }
        Site site = siteRepository.findById(siteId).orElseThrow(() -> new CustomException(CustomErrorHolder.SITE_NOT_FOUND));
        site.setActive(false);
        site.setUpdatedBy(detail.getUserId());
        site.setUpdatedDate(LocalDateTime.now());
        siteRepository.save(site);
        return true;
    }

    @Override
    public List<Site> getAllSites() {
        return siteRepository.findAllByIsActiveTrue();
    }
}
