package com.drivethru.service.service;

import com.drivethru.service.entity.Role;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public interface RoleService {
    List<Role> getAllRoles();
}
