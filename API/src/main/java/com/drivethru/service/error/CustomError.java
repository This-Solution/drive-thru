package com.drivethru.service.error;

public class CustomError {
    private String error;
    private String errorTitle;
    private String errorMessage;

    public CustomError(String error, String errorTitle, String errorMessage) {
        this.error = error;
        this.errorTitle = errorTitle;
        this.errorMessage = errorMessage;
    }

    public String getError() {
        return error;
    }

    public void setError(String error) {
        this.error = error;
    }

    public String getErrorTitle() {
        return errorTitle;
    }

    public void setErrorTitle(String errorTitle) {
        this.errorTitle = errorTitle;
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public void setErrorMessage(String errorMessage) {
        this.errorMessage = errorMessage;
    }
}
