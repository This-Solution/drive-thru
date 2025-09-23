package com.drivethru.service.service;

import com.drivethru.service.constant.Constants;
import com.drivethru.service.dto.*;
import com.drivethru.service.entity.*;
import com.drivethru.service.entity.types.CarColorStatus;
import com.drivethru.service.entity.types.OrderStatus;
import com.drivethru.service.error.CustomErrorHolder;
import com.drivethru.service.error.CustomException;
import com.drivethru.service.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class CarDetailsServiceImpl implements CarDetailService {

    @Autowired
    AzureFileUploaderService azureFileUploaderService;

    @Autowired
    CarDetailRepository carDetailRepository;

    @Autowired
    CameraConfigRepository cameraConfigRepository;

    @Autowired
    OrderCarStatusRepository orderCarStatusRepository;

    @Autowired
    TenantRepository tenantRepository;

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Autowired
    SimpMessagingTemplate simpMessagingTemplate;

    @Autowired
    SiteRepository siteRepository;

    @Override
    public void addCarDetail(Map<String, Object> carDetailJson) {
        String currentDateFolder = LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        try {
            Map<String, Object> car = (Map<String, Object>) carDetailJson.get("car");
            List<Map<String, Object>> bodyStyles = (List<Map<String, Object>>) car.get("bodyStyle");
            String carType = (String) bodyStyles.get(0).get("name");
            List<Map<String, Object>> colors = (List<Map<String, Object>>) car.get("color");
            String carColor = (String) colors.get(0).get("name");
            String plateNumber = (String) carDetailJson.get("plate_number");
            String siteName = (String) carDetailJson.get("static_detail_1");
            String cameraName = (String) carDetailJson.get("static_detail_2");

            Site site = siteRepository.findBySiteName(siteName);
            CameraConfig cameraConfig = cameraConfigRepository.findBySiteIdAndTenantIdAndCameraName(site.getSiteId(), site.getTenantId(), cameraName);
            String cameraType = cameraConfig.getCameraType();
            CarResponse carResponse = new CarResponse();

            if (cameraType.equals(Constants.LAN_CAMERA)) {
                String carImageBase64 = (String) carDetailJson.get("car_image_base64");
                String plateImageBase64 = (String) carDetailJson.get("plate_image_base64");

                Path tempDir = Files.createTempDirectory("car-images");
                Path carImagePath = saveBase64Image(carImageBase64, "car_image.jpg", tempDir);
                Path plateImagePath = saveBase64Image(plateImageBase64, "plate_image.jpg", tempDir);

                String carImageName = plateNumber + "_car.jpg";
                String plateImageName = plateNumber + "_plate.jpg";
                String blobCarPath = azureFileUploaderService.uploadFile(currentDateFolder, carImageName, carImagePath);
                String blobPlatePath = azureFileUploaderService.uploadFile(currentDateFolder, plateImageName, plateImagePath);

                CarDetail carDetail = new CarDetail();
                carDetail.setTenantId(site.getTenantId());
                carDetail.setSiteId(site.getSiteId());
                carDetail.setCarType(carType);
                carDetail.setCarColor(carColor);
                carDetail.setCarPlateNumber(plateNumber);
                carDetail.setPlateImageUrl(blobPlatePath);
                carDetail.setCarImageUrl(blobCarPath);
                carDetail.setCreatedDate(LocalDateTime.now());
                carDetailRepository.save(carDetail);

                carResponse.setCameraType(Constants.LAN_CAMERA);
                carResponse.setCarPlateNumber(plateNumber);
                simpMessagingTemplate.convertAndSend("/topic/send", carResponse);

            }
            if (cameraType.equals(Constants.COUNTER_CAMERA)) {
                carResponse.setCameraType(Constants.COUNTER_CAMERA);
                carResponse.setCarPlateNumber(plateNumber);
                simpMessagingTemplate.convertAndSend("/topic/send", carResponse);
            }

        } catch (Exception e) {
            throw new CustomException(CustomErrorHolder.UPLOAD_FAILED);
        }
    }


    private Path saveBase64Image(String base64Image, String fileName, Path directory) {
        try {
            if (base64Image.contains(",")) {
                base64Image = base64Image.substring(base64Image.indexOf(",") + 1);
            }

            byte[] imageBytes = Base64.getDecoder().decode(base64Image);
            Path imagePath = directory.resolve(fileName);
            Files.write(imagePath, imageBytes);
            return imagePath;
        } catch (Exception e) {
            throw new CustomException(CustomErrorHolder.UPLOAD_FAILED);
        }
    }


    @Override
    public CarDetailResponse getCarDetail(CarDetailRequest carDetailRequest) {
        CarDetail carDetail = carDetailRepository.findFirstByTenantIdAndCarPlateNumberOrderByCreatedDateDesc(carDetailRequest.getTenantId(), carDetailRequest.getCarPlateNumber()).orElseThrow(() -> new CustomException(CustomErrorHolder.CAR_NOT_FOUND));

        CarDetailResponse carDetailResponse = new CarDetailResponse();
        carDetailResponse.setCarId(carDetail.getCarId());
        carDetailResponse.setCarPlateNumber(carDetail.getCarPlateNumber());
        carDetailResponse.setCarColor(carDetail.getCarColor());
        carDetailResponse.setCarType(carDetail.getCarType());
        carDetailResponse.setCarImageUrl(azureFileUploaderService.generateBlobUrl(carDetail.getCarImageUrl()));
        carDetailResponse.setPlateImageUrl(azureFileUploaderService.generateBlobUrl(carDetail.getPlateImageUrl()));

        List<CarDetail> carDetails = carDetailRepository.findByCarPlateNumber(carDetailRequest.getCarPlateNumber());
        List<CameraConfig> cameraConfig = cameraConfigRepository.findByTenantId(carDetailRequest.getTenantId());

        String cameraType = cameraConfig.stream()
                .map(CameraConfig::getCameraType)
                .findFirst()
                .orElse(null);

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime days30 = now.minusDays(30);
        LocalDateTime days60 = now.minusDays(60);
        LocalDateTime days90 = now.minusDays(90);

        long countLast30 = 0, redLast30 = 0, greenLast30 = 0;
        long count30to60 = 0, red30to60 = 0, green30to60 = 0;
        long count60to90 = 0, red60to90 = 0, green60to90 = 0;

        for (CarDetail detail : carDetails) {

            LocalDateTime createdDate = detail.getCreatedDate();

            Optional<OrderCarStatus> optionalStatus = orderCarStatusRepository.findByCarId(detail.getCarId());
            String status = optionalStatus.map(OrderCarStatus::getStatus).orElse(null);

            boolean isRed = CarColorStatus.RED.name().equalsIgnoreCase(status);
            boolean isGreen = CarColorStatus.GREEN.name().equalsIgnoreCase(status);

            if (createdDate != null) {
                if (createdDate.isAfter(days30)) {
                    countLast30++;
                    if (isRed) redLast30++;
                    if (isGreen) greenLast30++;
                } else if (createdDate.isAfter(days60) && createdDate.isBefore(days30)) {
                    count30to60++;
                    if (isRed) red30to60++;
                    if (isGreen) green30to60++;
                } else if (createdDate.isAfter(days90) && createdDate.isBefore(days60)) {
                    count60to90++;
                    if (isRed) red60to90++;
                    if (isGreen) green60to90++;
                }
            }
        }
        if ("L".equalsIgnoreCase(cameraType)) {
            countLast30 = Math.max(0, countLast30 - 1);
            count30to60 = Math.max(0, count30to60 - 1);
            count60to90 = Math.max(0, count60to90 - 1);
        }

        carDetailResponse.setLast30DayCount(countLast30);
        carDetailResponse.setLast30DayColorStatus(resolveColorStatus(countLast30, redLast30, greenLast30));

        carDetailResponse.setLast30To60DayCount(count30to60);
        carDetailResponse.setLast30To60DayColorStatus(resolveColorStatus(count30to60, red30to60, green30to60));

        carDetailResponse.setLast60To90DayCount(count60to90);
        carDetailResponse.setLast60To90DayColorStatus(resolveColorStatus(count60to90, red60to90, green60to90));

        return carDetailResponse;
    }

    private String resolveColorStatus(long count, long redCount, long greenCount) {
        if (count == 0) {
            return CarColorStatus.WHITE.name();
        } else if (count  == redCount) {
            return CarColorStatus.RED.name();
        } else if (count  == greenCount) {
            return CarColorStatus.GREEN.name();
        } else {
            return CarColorStatus.PINK.name();
        }
    }


    @Override
    public List<CurrentOrderItemResponse> getCurrentOrderDetails(CarDetailRequest carDetailRequest) {
        OrderDetail orderDetail = orderDetailRepository.findFirstByTenantIdAndCarPlateNumberOrderByCreatedDateDesc(carDetailRequest.getTenantId(), carDetailRequest.getCarPlateNumber()).orElseThrow(() -> new CustomException(CustomErrorHolder.ORDER_NOT_FOUND));
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderDetail.getOrderId());
        orderDetail.setOrderStatus(String.valueOf(OrderStatus.DELIVERED));
        orderDetailRepository.save(orderDetail);
        return orderItems.stream().map(item -> new CurrentOrderItemResponse(item.getName(), item.getQuantity(), item.getPrice())).collect(Collectors.toList());
    }

    @Override
    public LastAndMostPurchaseOrderDetailsResponse getLastAndMostPurchaseOrderDetails(CarDetailRequest carDetailRequest) {
        OrderDetail orderDetail = orderDetailRepository.findFirstByTenantIdAndCarPlateNumberAndOrderStatusOrderByCreatedDateDesc(carDetailRequest.getTenantId(), carDetailRequest.getCarPlateNumber(), String.valueOf(OrderStatus.DELIVERED)).orElse(null);
        LastAndMostPurchaseOrderDetailsResponse response = new LastAndMostPurchaseOrderDetailsResponse();
        if (orderDetail != null) {
            List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderDetail.getOrderId());
            List<OrderItemResponse> lastOrders = orderItems.stream().map(item -> new OrderItemResponse(item.getName(), item.getQuantity(), item.getPrice())).toList();

            List<OrderDetail> orderDetails = orderDetailRepository.findByTenantIdAndCarPlateNumberAndOrderStatus(carDetailRequest.getTenantId(), carDetailRequest.getCarPlateNumber(), String.valueOf(OrderStatus.DELIVERED));

            List<OrderItem> orderList = new ArrayList<>();
            for (OrderDetail detail : orderDetails) {
                List<OrderItem> items = orderItemRepository.findByOrderId(detail.getOrderId());
                orderList.addAll(items);
            }

            Map<String, Long> totalItemCounts = orderList.stream().collect(Collectors.groupingBy(OrderItem::getName, Collectors.counting()));

            List<OrderItemResponse> mostPurchaseOrders = totalItemCounts.entrySet().stream().sorted(Map.Entry.<String, Long>comparingByValue().reversed()).limit(5).map(entry -> new OrderItemResponse(entry.getKey(), entry.getValue().intValue(), 0.0)).toList();

            response.setLastOrders(lastOrders);
            response.setMostPurchaseOrders(mostPurchaseOrders);
            return response;
        }
        return response;
    }

}
