package com.drivethru.service.service;

import com.drivethru.service.dto.CarDetailRequest;
import com.drivethru.service.entity.CarLog;
import org.springframework.stereotype.Service;

@Service
public interface CarLogService {
    CarLog getCarLogDetails(CarDetailRequest carDetailRequest);
}
