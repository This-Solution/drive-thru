package com.drivethru.service.service;

import com.drivethru.service.configuration.JwtHelper;
import com.drivethru.service.dto.*;
import com.drivethru.service.entity.Role;
import com.drivethru.service.entity.Site;
import com.drivethru.service.entity.Tenant;
import com.drivethru.service.entity.UserDetail;
import com.drivethru.service.entity.types.RoleName;
import com.drivethru.service.error.CustomErrorHolder;
import com.drivethru.service.error.CustomException;
import com.drivethru.service.helper.CryptoHelper;
import com.drivethru.service.repository.RoleRepository;
import com.drivethru.service.repository.SiteRepository;
import com.drivethru.service.repository.TenantRepository;
import com.drivethru.service.repository.UserDetailRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserDetailServiceImpl implements UserDetailService {

    @Autowired
    UserDetailRepository userDetailRepository;

    @Autowired
    TenantRepository tenantRepository;

    @Autowired
    RoleRepository roleRepository;

    @Autowired
    JwtHelper jwtHelper;

    @Autowired
    CryptoHelper cryptoHelper;

    @Autowired
    SiteRepository siteRepository;

    @Override
    public LoginTokenResponse login(LoginRequest loginRequest) {
        UserDetail userDetail = userDetailRepository.findByEmailAndIsActive(loginRequest.getEmail(), true);
        if (userDetail == null) {
            throw new CustomException(CustomErrorHolder.EMAIL_INCORRECT);
        }
        String encryptedInputPassword;
        try {
            encryptedInputPassword = cryptoHelper.encryptPassword(loginRequest.getPassword(), userDetail.getHashKey());

        } catch (Exception e) {
            throw new CustomException(CustomErrorHolder.LOGIN_FAILED);
        }

        if (!Objects.equals(encryptedInputPassword, userDetail.getPassword())) {
            throw new CustomException(CustomErrorHolder.PASSWORD_INCORRECT);
        }
        Optional<Site> site = siteRepository.findById(userDetail.getSiteId());
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setUserId(userDetail.getUserId());
        loginResponse.setTenantId(userDetail.getTenantId());
        loginResponse.setRoleId(userDetail.getRoleId());
        loginResponse.setName(userDetail.getFirstName() + " " + userDetail.getSurName());
        loginResponse.setPhone(userDetail.getPhone());
        loginResponse.setSiteId(userDetail.getSiteId());
        loginResponse.setSiteName(site.get().getSiteName());
        loginResponse.setSessionId(userDetail.getSessionId());
        loginResponse.setEmail(userDetail.getEmail());
        String sessionToken = jwtHelper.generateToken(userDetail);
        LoginTokenResponse loginTokenResponse = new LoginTokenResponse();
        loginTokenResponse.setUser(loginResponse);
        loginTokenResponse.setSessionToken(sessionToken);

        return loginTokenResponse;
    }

    @Override
    public UserDetailResponse addUser(UserDetailRequest userDetailRequest, String loginId) {
        try {
            int loginUserId = Integer.parseInt(loginId);
            UserDetail detail = userDetailRepository.findByUserIdAndIsActiveTrue(loginUserId);
            Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
            if (!Objects.equals(role.getRoleName(), RoleName.SUPER_ADMIN.getDescription())) {
                throw new CustomException(CustomErrorHolder.ONLY_SUPER_ADMIN_CAN_ACCESS);
            }
            UserDetail existingUserByEmail = userDetailRepository.findByEmailAndIsActiveTrue(userDetailRequest.getEmail());
            if (existingUserByEmail != null) {
                throw new CustomException(CustomErrorHolder.EMAIL_ALREADY_EXISTS);
            }
            UserDetail existingUserByPhone = userDetailRepository.findByPhoneAndIsActiveTrue(userDetailRequest.getPhone());
            if (existingUserByPhone != null) {
                throw new CustomException(CustomErrorHolder.PHONE_NUMBER_ALREADY_EXISTS);
            }
            String hashKey = cryptoHelper.getHashKey();
            String encryptedPassword = cryptoHelper.encryptPassword(userDetailRequest.getPassword(), hashKey);
            UserDetail userDetail = new UserDetail();
            userDetail.setTenantId(userDetailRequest.getTenantId());
            userDetail.setRoleId(userDetailRequest.getRoleId());
            userDetail.setSiteId(userDetailRequest.getSiteId());
            userDetail.setFirstName(userDetailRequest.getFirstName());
            userDetail.setSurName(userDetailRequest.getSurName());
            userDetail.setEmail(userDetailRequest.getEmail());
            userDetail.setPhone(userDetailRequest.getPhone());
            userDetail.setPassword(encryptedPassword);
            userDetail.setHashKey(hashKey);
            userDetail.setActive(true);
            userDetail.setCreatedBy(detail.getUserId());
            userDetail.setCreatedDate(LocalDateTime.now());
            userDetailRepository.save(userDetail);

            UserDetailResponse userDetailResponse = new UserDetailResponse();
            BeanUtils.copyProperties(userDetail, userDetailResponse);
            Tenant tenant = tenantRepository.findByTenantIdAndIsActiveTrue(userDetail.getTenantId());
            Optional<Role> roles = roleRepository.findById(userDetail.getRoleId());
            UserDetail createdUserDetail = userDetailRepository.findByUserIdAndIsActiveTrue(userDetail.getCreatedBy());
            userDetailResponse.setTenantName(tenant.getTenantName());
            userDetailResponse.setRoleName(roles.get().getRoleName());
            userDetailResponse.setCreatedByName(createdUserDetail.getFirstName() + " " + createdUserDetail.getSurName());
            return userDetailResponse;
        } catch (Exception e) {
            throw new CustomException(CustomErrorHolder.ADD_USER_FAILED);
        }
    }

    @Override
    public UserDetailResponse editUser(Integer userId, UserDetailRequest userDetailRequest, String loginId) {
        try {
            int loginUserId = Integer.parseInt(loginId);
            UserDetail detail = userDetailRepository.findByUserIdAndIsActiveTrue(loginUserId);
            Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
            if (!Objects.equals(role.getRoleName(), RoleName.SUPER_ADMIN.getDescription())) {
                throw new CustomException(CustomErrorHolder.ONLY_SUPER_ADMIN_CAN_ACCESS);
            }
            UserDetail userDetail = userDetailRepository.findById(userId).orElseThrow(() -> new CustomException(CustomErrorHolder.USER_NOT_FOUND));
            if (userDetailRequest.getFirstName() != null) {
                userDetail.setFirstName(userDetailRequest.getFirstName());
            }
            if (userDetailRequest.getSurName() != null) {
                userDetail.setSurName(userDetailRequest.getSurName());
            }
            if (userDetailRequest.getEmail() != null) {
                userDetail.setEmail(userDetailRequest.getEmail());
            }
            if (userDetailRequest.getPhone() != null) {
                userDetail.setPhone(userDetailRequest.getPhone());
            }
            if (userDetailRequest.getPassword() != null) {
                String newHashKey = cryptoHelper.getHashKey();
                String encryptedPassword = cryptoHelper.encryptPassword(userDetailRequest.getPassword(), newHashKey);
                userDetail.setHashKey(newHashKey);
                userDetail.setPassword(encryptedPassword);
            }
            if (userDetailRequest.getRoleId() != null) {
                userDetail.setRoleId(userDetailRequest.getRoleId());
            }
            if (userDetailRequest.getTenantId() != null) {
                userDetail.setTenantId(userDetailRequest.getTenantId());
            }
            userDetail.setUpdatedBy(detail.getUserId());
            userDetail.setUpdatedDate(LocalDateTime.now());
            userDetailRepository.save(userDetail);

            UserDetailResponse userDetailResponse = new UserDetailResponse();
            BeanUtils.copyProperties(userDetail, userDetailResponse);
            Tenant tenant = tenantRepository.findByTenantIdAndIsActiveTrue(userDetail.getTenantId());
            Optional<Role> roles = roleRepository.findById(userDetail.getRoleId());
            UserDetail createdUserDetail = userDetailRepository.findByUserIdAndIsActiveTrue(userDetail.getCreatedBy());
            UserDetail updatedUserDetail = userDetailRepository.findByUserIdAndIsActiveTrue(userDetail.getCreatedBy());
            userDetailResponse.setTenantName(tenant.getTenantName());
            userDetailResponse.setRoleName(roles.get().getRoleName());
            userDetailResponse.setCreatedByName(createdUserDetail.getFirstName() + " " + createdUserDetail.getSurName());
            userDetailResponse.setUpdateByName(updatedUserDetail.getFirstName() + " " + updatedUserDetail.getSurName());
            return userDetailResponse;
        } catch (Exception e) {
            throw new CustomException(CustomErrorHolder.ADD_USER_FAILED);
        }
    }

    @Override
    public Boolean deleteUser(Integer userId, String loginId) {
        int loginUserId = Integer.parseInt(loginId);
        UserDetail detail = userDetailRepository.findByUserIdAndIsActiveTrue(loginUserId);
        Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
        if (!Objects.equals(role.getRoleName(), RoleName.SUPER_ADMIN.getDescription())) {
            throw new CustomException(CustomErrorHolder.ONLY_SUPER_ADMIN_CAN_ACCESS);
        }
        UserDetail userDetail = userDetailRepository.findByUserIdAndIsActiveTrue(userId);
        userDetail.setActive(false);
        userDetail.setUpdatedBy(detail.getUserId());
        userDetail.setUpdatedDate(LocalDateTime.now());
        userDetailRepository.save(userDetail);
        return true;
    }

    @Override
    public List<UserDetailResponse> getAllUser() {
        List<UserDetail> userDetails = userDetailRepository.findAllByIsActiveTrue();
        return userDetails.stream().map(userDetail -> {
            UserDetailResponse userDetailResponse = new UserDetailResponse();
            BeanUtils.copyProperties(userDetail, userDetailResponse);
            siteRepository.findById(userDetail.getSiteId()).ifPresent(site -> userDetailResponse.setSiteName(site.getSiteName()));
            tenantRepository.findById(userDetail.getTenantId()).ifPresent(tenant -> userDetailResponse.setTenantName(tenant.getTenantName()));
            roleRepository.findById(userDetail.getRoleId()).ifPresent(role -> userDetailResponse.setRoleName(role.getRoleName()));
            userDetailRepository.findById(userDetail.getCreatedBy()).ifPresent(createdUser -> userDetailResponse.setCreatedByName(createdUser.getFirstName() + " " + createdUser.getSurName()));
            if (userDetail.getUpdatedBy() != null) {
                userDetailRepository.findById(userDetail.getUpdatedBy()).ifPresent(updatedUser -> userDetailResponse.setUpdateByName(updatedUser.getFirstName() + " " + updatedUser.getSurName()));
            }
            return userDetailResponse;
        }).collect(Collectors.toList());
    }
}
