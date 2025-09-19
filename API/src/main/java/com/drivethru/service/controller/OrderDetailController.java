package com.drivethru.service.controller;

import com.drivethru.service.common.ResponseObject;
import com.drivethru.service.constant.RouteConstant;
import com.drivethru.service.dto.WebhookOrderRequest;
import com.drivethru.service.entity.OrderDetail;
import com.drivethru.service.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(RouteConstant.ORDER)
public class OrderDetailController {

    @Autowired
    OrderDetailService orderDetailService;

    @PostMapping(RouteConstant.ORDER_WEBHOOK)
    public ResponseEntity<ResponseObject<OrderDetail>> handleWebhook(@RequestBody WebhookOrderRequest webhookOrderRequest) {
        System.out.println("Received Webhook:");
        System.out.println("Order XML: " + webhookOrderRequest.getOrder_xml());
        System.out.println("Device: " + webhookOrderRequest.getDevice_name());
        System.out.println("Datetime: " + webhookOrderRequest.getDatetime());
        System.out.println("Site: " + webhookOrderRequest.getSite_name());
        System.out.println("Timestamp: " + webhookOrderRequest.getTimestamp());
        orderDetailService.createdOrder(webhookOrderRequest);
        return new ResponseEntity<>(null, HttpStatus.OK);
    }

}
