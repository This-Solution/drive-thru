package com.drivethru.service.dto;


public class WebhookOrderRequest {
    private String order_xml;
    private double timestamp;
    private String datetime;
    private String site_name;
    private String device_name;
    private String source_ip;

    public String getOrder_xml() {
        return order_xml;
    }

    public void setOrder_xml(String order_xml) {
        this.order_xml = order_xml;
    }

    public double getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(double timestamp) {
        this.timestamp = timestamp;
    }

    public String getDatetime() {
        return datetime;
    }

    public void setDatetime(String datetime) {
        this.datetime = datetime;
    }

    public String getSite_name() {
        return site_name;
    }

    public void setSite_name(String site_name) {
        this.site_name = site_name;
    }

    public String getDevice_name() {
        return device_name;
    }

    public void setDevice_name(String device_name) {
        this.device_name = device_name;
    }

    public String getSource_ip() {
        return source_ip;
    }

    public void setSource_ip(String source_ip) {
        this.source_ip = source_ip;
    }
}
