package com.drivethru.service.service;

import com.drivethru.service.constant.Constants;
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
import java.time.LocalDateTime;

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

    @Override
    @Transactional
    public void createdOrder(WebhookOrderRequest webhookOrderRequest) {
        try {
            DocumentBuilderFactory factory = DocumentBuilderFactory.newInstance();
            DocumentBuilder builder = factory.newDocumentBuilder();
            InputStream xmlStream = new ByteArrayInputStream(webhookOrderRequest.getOrder_xml().getBytes(StandardCharsets.UTF_8));
            Document doc = builder.parse(xmlStream);
            String totalPriceStr = doc.getElementsByTagName(Constants.TOTAL_PRICE).item(0).getTextContent();
            Integer totalPrice = (int) Double.parseDouble(totalPriceStr);
            LocalDateTime dateTime = DateAndTimeHelper.parse(webhookOrderRequest.getDatetime());
            CameraConfig cameraConfig = cameraConfigRepository.findByOrderIpAddress(webhookOrderRequest.getSource_ip());
            Tenant tenant = tenantRepository.findById(cameraConfig.getTenantId()).orElseThrow(() -> new CustomException(CustomErrorHolder.TENANT_NOT_FOUND));
            CarDetail carDetail = carDetailRepository.findFirstByTenantIdOrderByCreatedDateDesc(tenant.getTenantId()).orElseThrow(() -> new CustomException(CustomErrorHolder.CAR_NOT_FOUND));

            OrderDetail orderDetail = new OrderDetail();
            orderDetail.setTotalPrice(totalPrice);
            orderDetail.setSourceIp(webhookOrderRequest.getSource_ip());
            orderDetail.setCreatedDate(dateTime);
            orderDetail.setTenantId(carDetail.getTenantId());
            orderDetail.setSiteId(cameraConfig.getSiteId());
            orderDetail.setCarId(carDetail.getCarId());
            orderDetail.setCarPlateNumber(carDetail.getCarPlateNumber());
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
            orderCarStatus.setCarId(carDetail.getCarId());
            orderCarStatus.setTenantId(tenant.getTenantId());
            orderCarStatus.setStatus(String.valueOf(CarColorStatus.GREEN));
            orderCarStatus.setCreatedDate(LocalDateTime.now());
            orderCarStatusRepository.save(orderCarStatus);

        } catch (Exception e) {
            throw new CustomException(CustomErrorHolder.ORDER_NOT_FOUND);
        }
    }
}
