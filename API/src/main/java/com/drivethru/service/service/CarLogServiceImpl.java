package com.drivethru.service.service;

import com.drivethru.service.dto.CarDetailRequest;
import com.drivethru.service.entity.CarDetail;
import com.drivethru.service.entity.CarLog;
import com.drivethru.service.entity.CarVisit;
import com.drivethru.service.error.CustomErrorHolder;
import com.drivethru.service.error.CustomException;
import com.drivethru.service.repository.CarDetailRepository;
import com.drivethru.service.repository.CarLogRepository;
import com.drivethru.service.repository.CarVisitRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class CarLogServiceImpl implements CarLogService {

    @Autowired
    CarDetailRepository carDetailRepository;

    @Autowired
    CarLogRepository carLogRepository;

    @Autowired
    CarVisitRepository carVisitRepository;

    @Override
    public CarLog getCarLogDetails(CarDetailRequest carDetailRequest) {
        Optional<CarDetail> carDetail = carDetailRepository.findByCarPlateNumber(carDetailRequest.getCarPlateNumber());
        CarVisit carVisit = carVisitRepository.findFirstByCarIdAndTenantIdOrderByCreatedDateDesc(carDetail.get().getCarId(), carDetailRequest.getTenantId());
        Optional<CarLog> carLog = carLogRepository.findByCarVisitId(carVisit.getCarVisitId());
        if (carLog.isEmpty()) {
            throw new CustomException(CustomErrorHolder.CAR_VISIT_NOT_FOUND);
        }
        return carLog.get();
    }
}
