package com.drivethru.service.helper;

import jakarta.annotation.PostConstruct;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.Cipher;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.PBEKeySpec;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.SecureRandom;
import java.util.Base64;

@Component
public class CryptoHelper {

    private SecretKeySpec secretKeySpec;
    private IvParameterSpec ivParameterSpec;

    @Value("${app.key}")
    private String appKey;
    @Value("${app.iv}")
    private String appIV;

    @PostConstruct
    public void init() {
        secretKeySpec = new SecretKeySpec(appKey.getBytes(StandardCharsets.UTF_8), "AES");
        ivParameterSpec = new IvParameterSpec(appIV.getBytes(StandardCharsets.UTF_8));
    }

    public String toBase64(String value) {
        return value != null ? Base64.getEncoder().encodeToString(value.getBytes(StandardCharsets.UTF_8)) : null;
    }

    public String fromBase64(String value) {
        return value != null ? new String(Base64.getDecoder().decode(value), StandardCharsets.UTF_8) : null;
    }

    public String getHashKey() {
        byte[] randomBytes = new byte[32];
        new SecureRandom().nextBytes(randomBytes);
        return Base64.getEncoder().encodeToString(randomBytes).substring(0, 15);
    }

    public String encryptPassword(String password, String hashKey) throws Exception {
        if (password == null || hashKey == null) return null;

        PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), hashKey.getBytes(StandardCharsets.UTF_8), 10000, 256);
        SecretKeyFactory skf = SecretKeyFactory.getInstance("PBKDF2WithHmacSHA512");
        byte[] hash = skf.generateSecret(spec).getEncoded();
        return Base64.getEncoder().encodeToString(hash);
    }

    public String encrypt(String value) throws Exception {
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivParameterSpec);
        byte[] encrypted = cipher.doFinal(value.getBytes(StandardCharsets.UTF_8));
        String base64 = Base64.getEncoder().encodeToString(encrypted);
        return base64.replace("/", "*").replace("+", "!");
    }

    public String decrypt(String value) throws Exception {
        String modified = value.replace("*", "/").replace("!", "+");
        byte[] decoded = Base64.getDecoder().decode(modified);
        Cipher cipher = Cipher.getInstance("AES/CBC/PKCS5Padding");
        cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, ivParameterSpec);
        byte[] decrypted = cipher.doFinal(decoded);
        return new String(decrypted, StandardCharsets.UTF_8);
    }

}
