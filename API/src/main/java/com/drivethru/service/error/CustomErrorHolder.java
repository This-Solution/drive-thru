package com.drivethru.service.error;


public class CustomErrorHolder {

    public static final CustomError FAILED_CONVERT_DATA = new CustomError("ERROR", "Failed to Convert Data", "Failed to convert data.");
    public static final CustomError SITE_NOT_FOUND = new CustomError("ERROR", "Site Not Found", "The specified site was not found.");
    public static final CustomError CAMERA_CONFIG_NOT_FOUND = new CustomError("ERROR", "Camera Configuration Not Found", "Camera configuration was not found.");
    public static final CustomError IMAGE_UPLOAD_FAILED = new CustomError("ERROR", "Image Upload Failed", "Failed to upload image.");
    public static final CustomError ORDER_NOT_FOUND = new CustomError("ERROR", "Order Not Found", "The requested order was not found.");
    public static final CustomError CAR_NOT_FOUND = new CustomError("ERROR", "Car Not Found", "The specified car was not found.");
    public static final CustomError UPLOAD_FAILED = new CustomError("ERROR", "Upload Failed", "File upload failed.");
    public static final CustomError USER_NOT_FOUND = new CustomError("ERROR", "User Not Found", "The specified user was not found.");
    public static final CustomError PASSWORD_INCORRECT = new CustomError("ERROR", "Incorrect Password", "The password entered is incorrect.");
    public static final CustomError TENANT_NOT_FOUND = new CustomError("ERROR", "Tenant Not Found", "The specified tenant was not found.");
    public static final CustomError ROLE_NOT_FOUND = new CustomError("ERROR", "Role Not Found", "The specified role was not found.");
    public static final CustomError LOGIN_FAILED = new CustomError("ERROR", "Invalid Credentials", "Invalid login credentials provided.");
    public static final CustomError ADD_USER_FAILED = new CustomError("ERROR", "Failed to Add User", "Failed to add new user.");
    public static final CustomError ONLY_SUPER_ADMIN_CAN_ACCESS = new CustomError("ERROR", "Super Admin Access Required", "Only Super Admin can perform this action.");
    public static final CustomError EMAIL_INCORRECT = new CustomError("ERROR", "Invalid Email", "The email address entered is invalid.");
    public static final CustomError CAR_VISIT_NOT_FOUND = new CustomError("ERROR", "CarVisit Not Found", "The specified car visit was not found.");

}