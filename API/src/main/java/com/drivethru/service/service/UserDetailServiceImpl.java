package com.drivethru.service.service;

import com.drivethru.service.configuration.JwtHelper;
import com.drivethru.service.dto.LoginRequest;
import com.drivethru.service.dto.LoginResponse;
import com.drivethru.service.dto.LoginTokenResponse;
import com.drivethru.service.dto.UserDetailRequest;
import com.drivethru.service.entity.Role;
import com.drivethru.service.entity.Tenant;
import com.drivethru.service.entity.UserDetail;
import com.drivethru.service.entity.types.RoleName;
import com.drivethru.service.error.CustomErrorHolder;
import com.drivethru.service.error.CustomException;
import com.drivethru.service.helper.CryptoHelper;
import com.drivethru.service.repository.RoleRepository;
import com.drivethru.service.repository.TenantRepository;
import com.drivethru.service.repository.UserDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Objects;

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

        Tenant tenant = tenantRepository.findById(userDetail.getTenantId()).orElseThrow(() -> new CustomException(CustomErrorHolder.TENANT_NOT_FOUND));
        Role role = roleRepository.findById(userDetail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
        LoginResponse loginResponse = new LoginResponse();
        loginResponse.setUserId(userDetail.getUserId());
        loginResponse.setTenantId(userDetail.getTenantId());
        loginResponse.setRoleId(userDetail.getRoleId());
        loginResponse.setName(userDetail.getFirstName() + " " + userDetail.getSurName());
        loginResponse.setPhone(userDetail.getPhone());
        String sessionToken = jwtHelper.generateToken(userDetail);
        LoginTokenResponse loginTokenResponse = new LoginTokenResponse();
        loginTokenResponse.setUser(loginResponse);
        loginTokenResponse.setSessionToken(sessionToken);

        return loginTokenResponse;

    }

    @Override
    public UserDetail addUser(UserDetailRequest userDetailRequest, String loginId) {
        try {
            int loginUserId = Integer.parseInt(loginId);
            UserDetail detail = userDetailRepository.findById(loginUserId).orElseThrow(() -> new CustomException(CustomErrorHolder.USER_NOT_FOUND));
            Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
            if (!Objects.equals(role.getRoleName(), RoleName.SUPER_ADMIN.toString())) {
                throw new CustomException(CustomErrorHolder.ONLY_SUPER_ADMIN_CAN_ACCESS);
            }
            String hashKey = cryptoHelper.getHashKey();
            String encryptedPassword = cryptoHelper.encryptPassword(userDetailRequest.getPassword(), hashKey);
            UserDetail userDetail = new UserDetail();
            userDetail.setTenantId(userDetailRequest.getTenantId());
            userDetail.setRoleId(role.getRoleId());
            userDetail.setFirstName(userDetailRequest.getFirstName());
            userDetail.setSurName(userDetailRequest.getSurName());
            userDetail.setEmail(userDetailRequest.getEmail());
            userDetail.setPhone(userDetailRequest.getPhone());
            userDetail.setPassword(encryptedPassword);
            userDetail.setHashKey(hashKey);
            userDetail.setActive(true);
            userDetail.setCreatedBy(detail.getUserId());
            userDetail.setCreatedDate(LocalDateTime.now());
            return userDetail;
        } catch (Exception e) {
            throw new CustomException(CustomErrorHolder.ADD_USER_FAILED);
        }
    }

    @Override
    public UserDetail editUser(Integer userId, UserDetailRequest userDetailRequest, String loginId) {
        try {
            int loginUserId = Integer.parseInt(loginId);
            UserDetail detail = userDetailRepository.findById(loginUserId).orElseThrow(() -> new CustomException(CustomErrorHolder.USER_NOT_FOUND));
            Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
            if (!Objects.equals(role.getRoleName(), RoleName.SUPER_ADMIN.toString())) {
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
            return userDetail;
        } catch (Exception e) {
            throw new CustomException(CustomErrorHolder.ADD_USER_FAILED);
        }
    }

    @Override
    public Boolean deleteUser(Integer userId, String loginId) {
        int loginUserId = Integer.parseInt(loginId);
        UserDetail detail = userDetailRepository.findById(loginUserId).orElseThrow(() -> new CustomException(CustomErrorHolder.USER_NOT_FOUND));
        Role role = roleRepository.findById(detail.getRoleId()).orElseThrow(() -> new CustomException(CustomErrorHolder.ROLE_NOT_FOUND));
        if (!Objects.equals(role.getRoleName(), RoleName.SUPER_ADMIN.toString())) {
            throw new CustomException(CustomErrorHolder.ONLY_SUPER_ADMIN_CAN_ACCESS);
        }
        UserDetail userDetail = userDetailRepository.findById(userId).orElseThrow(() -> new CustomException(CustomErrorHolder.USER_NOT_FOUND));
        userDetail.setActive(false);
        userDetail.setUpdatedBy(detail.getUserId());
        userDetail.setUpdatedDate(LocalDateTime.now());
        userDetailRepository.save(userDetail);
        return true;
    }

    @Override
    public List<UserDetail> getAllUser() {
        return userDetailRepository.findAllByIsActiveTrue();
    }
}
