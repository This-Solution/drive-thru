package com.drivethru.service.error;


public class CustomException extends RuntimeException {
    private String error;
    private String errorTitle;
    private String errorMessage;

    public CustomException(CustomError error) {
        super(error.getError());
        this.error = error.getError();
        this.errorTitle = error.getErrorTitle();
        this.errorMessage = error.getErrorMessage();
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
