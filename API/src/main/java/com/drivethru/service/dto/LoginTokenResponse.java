package com.drivethru.service.dto;

public class LoginTokenResponse {
    private String sessionToken;
    private LoginResponse user;

    public String getSessionToken() {
        return sessionToken;
    }

    public void setSessionToken(String sessionToken) {
        this.sessionToken = sessionToken;
    }

    public LoginResponse getUser() {
        return user;
    }

    public void setUser(LoginResponse user) {
        this.user = user;
    }
}
