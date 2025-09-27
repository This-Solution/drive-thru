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

    @Autowired
    CarVisitRepository carVisitRepository;

    @Autowired
    UserDetailRepository userDetailRepository;

    @Override
    public void addCarDetail(Map<String, Object> carDetailJson) {
        String currentDateFolder = LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        String carType;
        String carColor;
        String plateNumber;
        String siteName;
        String cameraName;
        String carImageBase64;
        String plateImageBase64;

        try {
            Map<String, Object> car = (Map<String, Object>) carDetailJson.get("car");
            List<Map<String, Object>> bodyStyles = (List<Map<String, Object>>) car.get("bodyStyle");
            List<Map<String, Object>> colors = (List<Map<String, Object>>) car.get("color");

            carType = (String) bodyStyles.get(0).get("name");
            carColor = (String) colors.get(0).get("name");

            plateNumber = (String) carDetailJson.get("plate_number");
            siteName = (String) carDetailJson.get("static_detail_1");
            cameraName = (String) carDetailJson.get("static_detail_2");

            carImageBase64 = (String) carDetailJson.get("car_image_base64");
            plateImageBase64 = (String) carDetailJson.get("plate_image_base64");

        } catch (Exception e) {
            throw new CustomException(CustomErrorHolder.FAILED_CONVERT_DATA);
        }

        Site site = siteRepository.findBySiteName(siteName);
        if (site == null) {
            throw new CustomException(CustomErrorHolder.SITE_NOT_FOUND);
        }
        Integer siteId = site.getSiteId();

        CameraConfig cameraConfig = cameraConfigRepository.findBySiteIdAndTenantIdAndCameraName(site.getSiteId(), site.getTenantId(), cameraName);
        if (cameraConfig == null) {
            throw new CustomException(CustomErrorHolder.CAMERA_CONFIG_NOT_FOUND);
        }
        String cameraType = cameraConfig.getCameraType();

        List<UserDetail> userDetails = userDetailRepository.findBySiteId(siteId);
        Optional<CarDetail> existingCar = carDetailRepository.findByCarPlateNumber(plateNumber);
        CarDetail carDetail;

        if (existingCar.isPresent()) {
            carDetail = existingCar.get();
        } else {
            carDetail = new CarDetail();
            carDetail.setCarType(carType);
            carDetail.setCarColor(carColor);
            carDetail.setCarPlateNumber(plateNumber);
            carDetail.setCreatedDate(LocalDateTime.now());

            try {
                Path tempDir = Files.createTempDirectory("car-images");

                Path carImagePath = saveBase64Image(carImageBase64, "car_image.jpg", tempDir);
                Path plateImagePath = saveBase64Image(plateImageBase64, "plate_image.jpg", tempDir);

                String carImageName = plateNumber + "_car.jpg";
                String plateImageName = plateNumber + "_plate.jpg";

                String blobCarPath = azureFileUploaderService.uploadFile(currentDateFolder, carImageName, carImagePath);
                String blobPlatePath = azureFileUploaderService.uploadFile(currentDateFolder, plateImageName, plateImagePath);

                carDetail.setCarImageUrl(blobCarPath);
                carDetail.setPlateImageUrl(blobPlatePath);
            } catch (Exception e) {
                throw new CustomException(CustomErrorHolder.IMAGE_UPLOAD_FAILED);
            }
            carDetail = carDetailRepository.save(carDetail);
        }

        CarVisit carVisit = new CarVisit();
        carVisit.setCarId(carDetail.getCarId());
        carVisit.setTenantId(cameraConfig.getTenantId());
        carVisit.setSiteId(site.getSiteId());
        carVisit.setCameraId(cameraConfig.getCameraId());
        carVisit.setCreatedDate(LocalDateTime.now());

        carVisitRepository.save(carVisit);

        CarResponse carResponse = new CarResponse();
        carResponse.setCameraType(cameraType);
        carResponse.setCarPlateNumber(plateNumber);
        carResponse.setCameraName(cameraConfig.getCameraName());

        for (UserDetail user : userDetails) {
            simpMessagingTemplate.convertAndSend("/topic/send", carResponse);
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
        Optional<CarDetail> carDetail = carDetailRepository.findByCarPlateNumber(carDetailRequest.getCarPlateNumber());
        List<CarVisit> carVisits = carVisitRepository.findByCarId(carDetail.get().getCarId());

        CarDetailResponse carDetailResponse = new CarDetailResponse();
        carDetailResponse.setCarId(carDetail.get().getCarId());
        carDetailResponse.setCarPlateNumber(carDetail.get().getCarPlateNumber());
        carDetailResponse.setCarColor(carDetail.get().getCarColor());
        carDetailResponse.setCarType(carDetail.get().getCarType());
        carDetailResponse.setCarImageUrl(azureFileUploaderService.generateBlobUrl(carDetail.get().getCarImageUrl()));
        carDetailResponse.setPlateImageUrl(azureFileUploaderService.generateBlobUrl(carDetail.get().getPlateImageUrl()));

        Optional<CarDetail> carDetails = carDetailRepository.findByCarPlateNumber(carDetailRequest.getCarPlateNumber());
        CarVisit carVisit = carVisitRepository.findFirstByCarIdAndTenantIdOrderByCreatedDateDesc(carDetails.get().getCarId(), carDetailRequest.getTenantId());
        Optional<CameraConfig> cameraConfig = cameraConfigRepository.findById(carVisit.getCameraId());

        String cameraType = cameraConfig.get().getCameraType();

        LocalDateTime now = LocalDateTime.now();
        LocalDateTime days30 = now.minusDays(30);
        LocalDateTime days60 = now.minusDays(60);
        LocalDateTime days90 = now.minusDays(90);

        long countLast30 = 0, redLast30 = 0, greenLast30 = 0;
        long count30to60 = 0, red30to60 = 0, green30to60 = 0;
        long count60to90 = 0, red60to90 = 0, green60to90 = 0;

        for (CarVisit detail : carVisits) {
            LocalDateTime createdDate = carDetails.get().getCreatedDate();

            List<OrderCarStatus> optionalStatus = orderCarStatusRepository.findByCarId(carDetails.get().getCarId());
            String status = optionalStatus.stream().findFirst().map(OrderCarStatus::getStatus).orElse(null);

            boolean isRed = CarColorStatus.RED.name().equalsIgnoreCase(status);
            boolean isGreen = CarColorStatus.GREEN.name().equalsIgnoreCase(status);

            if (createdDate != null) {
                countLast30++;
                if (createdDate.isAfter(days30)) {
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

        if (cameraType.equals(Constants.LAN_CAMERA)) {
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
            return CarColorStatus.GREEN.name();
        } else if (count == redCount) {
            return CarColorStatus.RED.name();
        } else if (count == greenCount) {
            return CarColorStatus.GREEN.name();
        } else {
            return CarColorStatus.PINK.name();
        }
    }


    @Override
    public List<CurrentOrderItemResponse> getCurrentOrderDetails(CarDetailRequest carDetailRequest) {
        OrderDetail orderDetail = orderDetailRepository.findFirstByTenantIdAndCarPlateNumberOrderByCreatedDateDesc(carDetailRequest.getTenantId(), carDetailRequest.getCarPlateNumber()).orElseThrow(() -> new CustomException(CustomErrorHolder.ORDER_NOT_FOUND));
        Double totalPrice = Double.valueOf(orderDetail.getTotalPrice());
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderDetail.getOrderId());
        orderDetail.setOrderStatus(String.valueOf(OrderStatus.DELIVERED));
        orderDetailRepository.save(orderDetail);
        return orderItems.stream().map(item -> new CurrentOrderItemResponse(item.getName(), item.getQuantity(), item.getPrice(), totalPrice)).collect(Collectors.toList());
    }

    @Override
    public LastAndMostPurchaseOrderDetailsResponse getLastAndMostPurchaseOrderDetails(CarDetailRequest carDetailRequest) {
        OrderDetail orderDetail = orderDetailRepository.findFirstByTenantIdAndCarPlateNumberAndOrderStatusOrderByCreatedDateDesc(carDetailRequest.getTenantId(), carDetailRequest.getCarPlateNumber(), String.valueOf(OrderStatus.DELIVERED)).orElse(null);
        Double totalOrderItemPrice = orderDetail == null ? 0.0 : orderDetail.getTotalPrice();
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
            response.setTotalOrderItemPrice(totalOrderItemPrice);
            return response;
        }
        return response;
    }

    @Override
    public OrderCarStatus updateStatus(UpdateStatusRequest updateStatusRequest) {
        OrderCarStatus orderCarStatus = orderCarStatusRepository.findByOrderIdAndCarId(updateStatusRequest.getOrderId(), updateStatusRequest.getCarId());
        orderCarStatus.setStatus(String.valueOf(CarColorStatus.valueOf(updateStatusRequest.getStatus())));
        orderCarStatus.setNotes(updateStatusRequest.getNotes());
        orderCarStatusRepository.save(orderCarStatus);
        return orderCarStatus;
    }

    @Override
    public List<CameraResponseDTO> latestInfo(String siteId) {
        int loginSiteId = Integer.parseInt(siteId);
        List<CameraConfig> cameraConfigList = cameraConfigRepository.findAllBySiteIdAndIsActiveTrue(loginSiteId);
        List<CameraResponseDTO> cameraResponseList = new ArrayList<>();

        for (CameraConfig config : cameraConfigList) {
            LocalDateTime startOfDay = LocalDate.now().atStartOfDay();
            CarVisit carVisit = carVisitRepository.findFirstByCameraIdAndCreatedDateAfterOrderByCreatedDateDesc(config.getCameraId(), startOfDay);

            if (carVisit == null) continue;

            Optional<CarDetail> carDetailOpt = carDetailRepository.findById(carVisit.getCarId());
            if (!carDetailOpt.isPresent()) {
                continue;
            }

            CarDetail carDetail = carDetailOpt.get();
            CarDetailRequest carDetailRequest = new CarDetailRequest();
            carDetailRequest.setCarPlateNumber(carDetail.getCarPlateNumber());
            carDetailRequest.setTenantId(config.getTenantId());

            CameraResponseDTO cameraResponseDTO = new CameraResponseDTO();
            cameraResponseDTO.setCameraName(config.getCameraName());
            cameraResponseDTO.setCameraType(config.getCameraType());
            cameraResponseDTO.setCarPlateNumber(carDetail.getCarPlateNumber());
            cameraResponseDTO.setReloadTime(config.getReloadTime());
            cameraResponseList.add(cameraResponseDTO);
        }

        return cameraResponseList;
    }

}
