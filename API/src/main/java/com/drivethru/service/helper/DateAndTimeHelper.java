package com.drivethru.service.helper;

import org.springframework.stereotype.Component;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Component
public class DateAndTimeHelper {

    private static final String DEFAULT_PATTERN = "yyyy-MM-dd HH:mm:ss";

    public static LocalDateTime parse(String dateTimeStr) {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern(DEFAULT_PATTERN);
        return LocalDateTime.parse(dateTimeStr, formatter);
    }
}