package com.drivethru.service.error;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class

CustomExceptionHandler extends ResponseEntityExceptionHandler {
    @ExceptionHandler(value = {CustomException.class})
    public ResponseEntity<CustomErrorResponse> customDCExceptionHandler(RuntimeException ex, HttpServletRequest request) {

        CustomException exception = (CustomException) ex;

        CustomErrorResponse error = new CustomErrorResponse();
        error.setError(exception.getError());
        error.setErrorTitle(exception.getErrorTitle());
        error.setErrorMessage(exception.getErrorMessage());
        error.setPath(request.getRequestURI().substring(request.getContextPath().length()));
        error.setTimestamp(LocalDateTime.now());
        error.setStatus(HttpStatus.BAD_REQUEST.value());

        return new ResponseEntity<>(error, HttpStatus.BAD_REQUEST);
    }

}
