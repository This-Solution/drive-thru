package com.drivethru.service.filter;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.Part;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.GenericFilterBean;

import java.io.IOException;
import java.util.Collection;
import java.util.Enumeration;

@Component
public class RequestLoggingFilter extends GenericFilterBean {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {

        if (request instanceof HttpServletRequest httpRequest) {

            System.out.println("\n[RequestLoggingFilter] Incoming Request Details:");
            System.out.println("Remote Address: " + request.getRemoteAddr());
            System.out.println("Method: " + httpRequest.getMethod());
            System.out.println("URL: " + httpRequest.getRequestURL());
            System.out.println("Query String: " + httpRequest.getQueryString());
            System.out.println("Content Type: " + httpRequest.getContentType());

            System.out.println("\nHeaders:");
            Enumeration<String> headerNames = httpRequest.getHeaderNames();
            while (headerNames.hasMoreElements()) {
                String headerName = headerNames.nextElement();
                System.out.println(headerName + ": " + httpRequest.getHeader(headerName));
            }

            System.out.println("\nParameters:");
            Enumeration<String> paramNames = httpRequest.getParameterNames();
            while (paramNames.hasMoreElements()) {
                String paramName = paramNames.nextElement();
                System.out.println(paramName + ": " + httpRequest.getParameter(paramName));
            }

            if (httpRequest.getContentType() != null &&
                    httpRequest.getContentType().startsWith("multipart/form-data")) {
                try {
                    Collection<Part> parts = httpRequest.getParts();
                    System.out.println("Parts count: " + parts.size());
                    for (Part part : parts) {
                        System.out.println("Part Name: " + part.getName());
                        System.out.println("Content Type: " + part.getContentType());
                        System.out.println("Size: " + part.getSize());
                        System.out.println("Submitted File Name: " + part.getSubmittedFileName());
                    }
                } catch (Exception e) {
                    System.out.println("\nCould not parse multipart request: " + e.getMessage());
                }
            }
        }

        chain.doFilter(request, response);
    }
}
