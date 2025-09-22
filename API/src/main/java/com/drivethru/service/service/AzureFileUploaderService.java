package com.drivethru.service.service;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.sas.BlobSasPermission;
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.time.OffsetDateTime;

@Service
public class AzureFileUploaderService {

    @Autowired
    private BlobContainerClient blobContainerClient;

    public String uploadFile(String folderPath, String fileName, Path filePath) throws IOException {
        String blobPath = String.format("%s/%s", folderPath, fileName);
        BlobClient blobClient = blobContainerClient.getBlobClient(blobPath);

        try (InputStream inputStream = Files.newInputStream(filePath)) {
            blobClient.upload(inputStream, Files.size(filePath), true);
        }

        return blobPath;
    }

    public String generateBlobUrl(String blobName) {
        BlobClient blobClient = blobContainerClient.getBlobClient(blobName);
        BlobSasPermission permissions = new BlobSasPermission().setReadPermission(true);
        OffsetDateTime expiryTime = OffsetDateTime.now().plusMinutes(30);
        BlobServiceSasSignatureValues sasSignatureValues = new BlobServiceSasSignatureValues(expiryTime, permissions).setStartTime(OffsetDateTime.now().minusMinutes(5));
        String sasToken = blobClient.generateSas(sasSignatureValues);
        return blobClient.getBlobUrl() + "?" + sasToken;
    }

    public void deleteBlob(String blobName) {
        blobContainerClient.getBlobClient(blobName).delete();
    }
}
