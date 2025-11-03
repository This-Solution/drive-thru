package com.drivethru.service.service;

import com.drivethru.service.constant.Constants;
import com.drivethru.service.dto.OrderItemCarDetailProjection;
import com.drivethru.service.dto.WebhookOrderRequest;
import com.drivethru.service.entity.*;
import com.drivethru.service.entity.types.CarColorStatus;
import com.drivethru.service.entity.types.OrderStatus;
import com.drivethru.service.error.CustomErrorHolder;
import com.drivethru.service.error.CustomException;
import com.drivethru.service.helper.DateAndTimeHelper;
import com.drivethru.service.repository.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import java.io.ByteArrayInputStream;
import java.io.InputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Optional;
import java.util.List;

@Service
public class OrderDetailServiceImpl implements OrderDetailService {

    @Autowired
    OrderDetailRepository orderDetailRepository;

    @Autowired
    OrderItemRepository orderItemRepository;

    @Autowired
    TenantRepository tenantRepository;

    @Autowired
    CameraConfigRepository cameraConfigRepository;

    @Autowired
    CarDetailRepository carDetailRepository;

    @Autowired
    OrderCarStatusRepository orderCarStatusRepository;

    @Autowired
    SiteRepository siteRepository;

    @Autowired
    CarVisitRepository carVisitRepository;

    @Autowired
    OrderLogRepository orderLogRepository;

    @Override
    @Transactional
    public void createdOrder(WebhookOrderRequest webhookOrderRequest) {
        Double totalPrice;
        Document doc;
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            InputStream xmlStream = new ByteArrayInputStream(webhookOrderRequest.getOrder_xml().getBytes(StandardCharsets.UTF_8));
            doc = builder.parse(xmlStream);
            String totalPriceStr = doc.getElementsByTagName(Constants.TOTAL_PRICE).item(0).getTextContent();
            totalPrice = Double.parseDouble(totalPriceStr);
        } catch (Exception e) {
            throw new CustomException(CustomErrorHolder.ORDER_NOT_FOUND);
        }

        Site site = siteRepository.findBySiteNameAndIsActiveTrue(webhookOrderRequest.getSite_name());
        CameraConfig cameraConfig = cameraConfigRepository.findByCameraNameAndSiteIdAndIsActiveTrue(webhookOrderRequest.getDevice_name(), site.getSiteId());
        Tenant tenant = tenantRepository.findById(site.getTenantId()).orElseThrow(() -> new CustomException(CustomErrorHolder.TENANT_NOT_FOUND));
        CarVisit carVisit = carVisitRepository.findFirstByTenantIdAndSiteIdAndCameraIdOrderByCreatedDateDesc(tenant.getTenantId(), site.getSiteId(), cameraConfig.getCameraId());
        if (carVisit == null) {
            throw new CustomException(CustomErrorHolder.CAR_VISIT_NOT_FOUND);
        }
        Optional<CarDetail> carDetail = carDetailRepository.findById(carVisit.getCarId());

        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setTotalPrice(totalPrice);
        orderDetail.setSourceIp(webhookOrderRequest.getSource_ip());
        orderDetail.setCreatedDate(LocalDateTime.now());
        orderDetail.setTenantId(tenant.getTenantId());
        orderDetail.setSiteId(cameraConfig.getSiteId());
        orderDetail.setCarId(carDetail.get().getCarId());
        orderDetail.setCarPlateNumber(carDetail.get().getCarPlateNumber());
        orderDetail.setOrderStatus(String.valueOf(OrderStatus.CREATED));
        orderDetailRepository.save(orderDetail);

        NodeList nameNodes = doc.getElementsByTagName(Constants.NAME);
        for (int i = 0; i < nameNodes.getLength(); i++) {
            Node node = nameNodes.item(i);
            if (node.getNodeType() == Node.ELEMENT_NODE) {
                Element nameElement = (Element) node;
                String name = nameElement.getTextContent().trim();
                String priceStr = nameElement.getAttribute(Constants.PRICE);
                String countStr = nameElement.getAttribute(Constants.COUNT);
                Double price = priceStr.isEmpty() ? 0.0 : Double.parseDouble(priceStr);
                Integer quantity = countStr.isEmpty() ? 1 : Integer.parseInt(countStr);

                OrderItem orderItem = new OrderItem();
                orderItem.setOrderId(orderDetail.getOrderId());
                orderItem.setName(name);
                orderItem.setPrice(price);
                orderItem.setQuantity(quantity);
                orderItem.setCreatedDate(LocalDateTime.now());
                orderItemRepository.save(orderItem);
            }
        }

        OrderCarStatus orderCarStatus = new OrderCarStatus();
        orderCarStatus.setOrderId(orderDetail.getOrderId());
        orderCarStatus.setCarId(carDetail.get().getCarId());
        orderCarStatus.setTenantId(tenant.getTenantId());
        orderCarStatus.setStatus(String.valueOf(CarColorStatus.GREEN));
        orderCarStatus.setCreatedDate(LocalDateTime.now());
        orderCarStatusRepository.save(orderCarStatus);
        OrderLog log = new OrderLog();
        log.setOrderData("Received Webhook:\n"
                + "Order XML: " + webhookOrderRequest.getOrder_xml() + "\n"
                + "Device: " + webhookOrderRequest.getDevice_name() + "\n"
                + "Datetime: " + webhookOrderRequest.getDatetime() + "\n"
                + "Site: " + webhookOrderRequest.getSite_name() + "\n"
                + "Timestamp: " + webhookOrderRequest.getTimestamp());
        log.setCreatedDate(LocalDateTime.now());
        orderLogRepository.save(log);

    }

    @Override
    public List<OrderItemCarDetailProjection> getOrderItems(Integer siteId, String itemName, LocalDate localDate, String startTime, String endTime) {
        if (itemName != null && itemName.trim().isEmpty()) {
            itemName = null;
        }
        LocalDateTime actualStartTime;
        if (startTime != null) {
            LocalTime parsedStartTime = LocalTime.parse(startTime);
            actualStartTime = localDate.atTime(parsedStartTime);
        } else {
            actualStartTime = localDate.atTime(LocalTime.MIN);
        }
        LocalDateTime actualEndTime;
        if (endTime != null) {
            LocalTime parsedEndTime = LocalTime.parse(endTime);
            actualEndTime = localDate.atTime(parsedEndTime);
        } else {
            actualEndTime = localDate.atTime(LocalTime.MAX);
        }
        List<OrderItemCarDetailProjection> orderItems = orderItemRepository.findOrderItemsWithCarDetails(siteId, itemName, actualStartTime, actualEndTime);
        return orderItems;
    }
}
