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
import org.springframework.web.multipart.MultipartFile;
import org.w3c.dom.Document;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.InputStream;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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


    @Override
    public void addCarDetail(MultipartFile xmlFile, List<MultipartFile> Files) {
        String currentDateFolder = LocalDate.now().format(DateTimeFormatter.ofPattern("dd-MM-yyyy"));
        String licensePlate = Constants.UNKNOWN;
        String color = Constants.UNKNOWN;
        String ipAddress;

        try (InputStream inputStream = xmlFile.getInputStream()) {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            factory.setNamespaceAware(true);
            DocumentBuilder builder = factory.newDocumentBuilder();
            Document doc = builder.parse(inputStream);
            ipAddress = doc.getElementsByTagName("ipAddress").item(0).getTextContent().trim();
            licensePlate = doc.getElementsByTagName("licensePlate").item(0).getTextContent().trim();
            color = doc.getElementsByTagName("color").item(0).getTextContent().trim();
        } catch (Exception e) {
            throw new CustomException(CustomErrorHolder.CAR_NOT_FOUND);
        }
        CarDetail carDetail = new CarDetail();
        CameraConfig cameraConfig = cameraConfigRepository.findByCameraIpAddress(ipAddress);
        Tenant tenant = tenantRepository.findById(cameraConfig.getTenantId()).orElseThrow(() -> new CustomException(CustomErrorHolder.TENANT_NOT_FOUND));
        String cameraType = cameraConfig.getCameraType();
        CarResponse carResponse = new CarResponse();

        if (cameraType.equals(Constants.LAN_CAMERA)) {
            List<String> imagePaths = new ArrayList<>();
            try {
                int imageIndex = 1;
                for (MultipartFile file : Files) {
                    if (file != null && !file.isEmpty()) {
                        String imageName = licensePlate + "_" + imageIndex++ + ".jpg";
                        String uploadedPath = azureFileUploaderService.uploadFile(currentDateFolder, imageName, file);
                        imagePaths.add(uploadedPath);
                    }
                }
                String xmlBlobPath = azureFileUploaderService.uploadFile(currentDateFolder, licensePlate + ".xml", (MultipartFile) xmlFile);
                carDetail.setXmlUrl(xmlBlobPath);

            } catch (Exception e) {
                throw new CustomException(CustomErrorHolder.UPLOAD_FAILED);
            }
            carDetail.setTenantId(tenant.getTenantId());
            carDetail.setImageUrl(String.join(",", imagePaths));
            carDetail.setCarPlateNumber(licensePlate);
            carDetail.setCarColor(color);
            carDetail.setCreatedDate(LocalDateTime.now());
            carDetailRepository.save(carDetail);
            carResponse.setCameraType(cameraType);
            carResponse.setCarPlateNumber(licensePlate);
            simpMessagingTemplate.convertAndSend("/topic/send", carResponse);
        }
        if (cameraType.equals(Constants.COUNTER_CAMERA)) {
            carResponse.setCarPlateNumber(licensePlate);
            carResponse.setCameraType(Constants.COUNTER_CAMERA);
            simpMessagingTemplate.convertAndSend("/topic/send", carResponse);

        }
    }

    @Override
    public CarDetailResponse getCarDetail(CarDetailRequest carDetailRequest) {
        CarDetail carDetail = carDetailRepository.findFirstByTenantIdAndCarPlateNumberOrderByCreatedDateDesc(carDetailRequest.getTenantId(), carDetailRequest.getCarPlateNumber()).orElseThrow(() -> new CustomException(CustomErrorHolder.CAR_NOT_FOUND));
        CarDetailResponse carDetailResponse = new CarDetailResponse();
        carDetailResponse.setCarId(carDetail.getCarId());
        carDetailResponse.setCarPlateNumber(carDetail.getCarPlateNumber());
        carDetailResponse.setCarColor(carDetail.getCarColor());
        String[] imageUrls = carDetail.getImageUrl().split(",");
        List<String> blobImageUrls = new ArrayList<>();

        for (String imageUrl : imageUrls) {
            if (imageUrl != null && !imageUrl.trim().isEmpty()) {
                String blobUrl = azureFileUploaderService.generateBlobUrl(imageUrl.trim());
                blobImageUrls.add(blobUrl);
            }
        }

        carDetailResponse.setImageUrl(blobImageUrls);

        List<CarDetail> carDetails = carDetailRepository.findByCarPlateNumber(carDetailRequest.getCarPlateNumber());
        long count = 0;
        long redCount = 0;
        long greenCount = 0;

        for (CarDetail detail : carDetails) {
            count++;
            Optional<OrderCarStatus> optionalStatus = orderCarStatusRepository.findByCarId(detail.getCarId());
            if (optionalStatus.isPresent()) {
                String status = optionalStatus.get().getStatus();
                if (CarColorStatus.RED.name().equalsIgnoreCase(status)) {
                    redCount++;
                } else if (CarColorStatus.GREEN.name().equalsIgnoreCase(status)) {
                    greenCount++;
                }
            }
        }
        if (count == 1) {
            carDetailResponse.setCarColorStatus(String.valueOf(CarColorStatus.WHITE));
        } else if (count - 1 == redCount) {
            carDetailResponse.setCarColorStatus(String.valueOf(CarColorStatus.RED));
        } else if (count - 1 == greenCount) {
            carDetailResponse.setCarColorStatus(String.valueOf(CarColorStatus.GREEN));
        } else {
            carDetailResponse.setCarColorStatus(String.valueOf(CarColorStatus.PINK));
        }
        carDetailResponse.setOrderCount(count);
        return carDetailResponse;
    }

    @Override
    public List<CurrentOrderItemResponse> getCurrentOrderDetails(CarDetailRequest carDetailRequest) {
        OrderDetail orderDetail = orderDetailRepository.findFirstByTenantIdAndCarPlateNumberOrderByCreatedDateDesc(carDetailRequest.getTenantId(), carDetailRequest.getCarPlateNumber()).orElseThrow(() -> new CustomException(CustomErrorHolder.ORDER_NOT_FOUND));
        List<OrderItem> orderItems = orderItemRepository.findByOrderId(orderDetail.getOrderId());
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

            List<OrderItemResponse> mostPurchaseOrders = totalItemCounts.entrySet().stream().sorted(Map.Entry.<String, Long>comparingByValue().reversed()).limit(5).map(entry -> new OrderItemResponse(entry.getKey(), entry.getValue().intValue(), 0.0))
                    .toList();

            response.setLastOrders(lastOrders);
            response.setMostPurchaseOrders(mostPurchaseOrders);
            return response;
        }
        return response;
    }

}
