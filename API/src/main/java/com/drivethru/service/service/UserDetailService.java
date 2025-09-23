package com.drivethru.service.service;

import com.drivethru.service.dto.*;
import com.drivethru.service.entity.UserDetail;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserDetailService {

    LoginTokenResponse login(LoginRequest loginRequest);

    UserDetailResponse addUser(UserDetailRequest userDetailRequest, String loginId);

    UserDetailResponse editUser(Integer userId, UserDetailRequest userDetailRequest, String loginUserId);

    Boolean deleteUser(Integer userId, String loginUserId);

    List<UserDetailResponse> getAllUser();
}
