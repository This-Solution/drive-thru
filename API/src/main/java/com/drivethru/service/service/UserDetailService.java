package com.drivethru.service.service;

import com.drivethru.service.dto.LoginRequest;
import com.drivethru.service.dto.LoginResponse;
import com.drivethru.service.dto.LoginTokenResponse;
import com.drivethru.service.dto.UserDetailRequest;
import com.drivethru.service.entity.UserDetail;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface UserDetailService {

    LoginTokenResponse login(LoginRequest loginRequest);

    UserDetail addUser(UserDetailRequest userDetailRequest, String loginId);

    UserDetail editUser(Integer userId, UserDetailRequest userDetailRequest, String loginUserId);

    Boolean deleteUser(Integer userId , String loginUserId);

    List<UserDetail> getAllUser();
}
