package com.drivethru.service.error;


public class CustomErrorHolder {

    public static final CustomError FAILED_CONVERT_DATA = new CustomError("ERROR", "Failed to convert Data", "Failed to convert data.");
    public static final CustomError ORDER_NOT_FOUND = new CustomError("ERROR", "Order Not Found", "Order not found.");
    public static final CustomError CAR_NOT_FOUND = new CustomError("ERROR", "Car Not Found", "Car not found.");
    public static final CustomError UPLOAD_FAILED = new CustomError("ERROR", "Upload Failed", "Upload failed.");
    public static final CustomError USER_NOT_FOUND = new CustomError("ERROR", "User Not Found", "User not found.");
    public static final CustomError PASSWORD_INCORRECT = new CustomError("ERROR", "password", "Password is Incorrect.");
    public static final CustomError TENANT_NOT_FOUND = new CustomError("ERROR", "Tenant Not Found", "Tenant not found.");
    public static final CustomError ROLE_NOT_FOUND = new CustomError("ERROR", "Role Not Found", "Role not found.");
    public static final CustomError LOGIN_FAILED = new CustomError("ERROR", "Invalid Credentials", "Invalid Credentials.");
    public static final CustomError ADD_USER_FAILED = new CustomError("ERROR","Add User failed" ,"Add user failed.");
    public static final CustomError ONLY_SUPER_ADMIN_CAN_ACCESS = new CustomError("ERROR", "Only Super Admin Access To Add", "Only Super Admin Access To Add.");
    public static final CustomError SITE_NOT_FOUND = new CustomError("ERROR", "Site Not Found", "Site not found.");
    public static final CustomError EMAIL_INCORRECT = new CustomError("ERROR", "email", "Email is Incorrect.");
    public static final CustomError CAMERA_CONFIG_NOT_FOUND = new CustomError("Error","CameraConfig","CameraConfig Not Found.");
}