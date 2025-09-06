package com.tagoapp.backend.controller;

import com.azure.storage.blob.BlobClient;
import com.azure.storage.blob.BlobContainerClient;
import com.azure.storage.blob.BlobServiceClient;
import com.azure.storage.blob.BlobServiceClientBuilder;
import com.azure.storage.blob.sas.BlobSasPermission;
import com.azure.storage.blob.sas.BlobServiceSasSignatureValues;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.OffsetDateTime;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/storage")
@CrossOrigin(origins = { "http://localhost:5173", "http://127.0.0.1:5173" })
public class StorageController {

    // application.propertiesから接続文字列を読み込む
    @Value("${azure.storage.connection-string}")
    private String connectionString;

    // 画像を保存するコンテナ名
    private final String containerName = "onsenreview-images";

    /**
     * 画像アップロード用の一時的なURL（SAS URL）を生成して返すAPI
     * 
     * @param requestBody リクエストボディ。fileNameを含むMap
     * @return SAS URLと、最終的に画像が保存されるBlob URLを含むMap
     */
    @PostMapping("/generate-upload-url")
    public ResponseEntity<Map<String, String>> generateUploadUrl(@RequestBody Map<String, String> requestBody) {
        try {
            String originalFileName = requestBody.get("fileName");
            if (originalFileName == null || originalFileName.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("error", "fileName is required"));
            }

            // Azure Blob Storageへの接続クライアントを作成
            BlobServiceClient blobServiceClient = new BlobServiceClientBuilder()
                    .connectionString(connectionString)
                    .buildClient();

            // コンテナを取得（存在しない場合は作成）
            BlobContainerClient containerClient = blobServiceClient.getBlobContainerClient(containerName);
            if (!containerClient.exists()) {
                containerClient.create();
            }

            // ユニークなファイル名を生成 
            // ファイル名の衝突を避けるため、UUIDを先頭に付与
            String fileExtension = "";
            int i = originalFileName.lastIndexOf('.');
            if (i > 0) {
                fileExtension = originalFileName.substring(i);
            }
            String uniqueBlobName = UUID.randomUUID().toString() + fileExtension;

            BlobClient blobClient = containerClient.getBlobClient(uniqueBlobName);

            // SAS (Shared Access Signature) を設定 
            // この署名を持つユーザーが、指定された時間だけ特定のアクションを実行できる
            BlobSasPermission blobSasPermission = new BlobSasPermission()
                    .setWritePermission(true) // 書き込み権限
                    .setCreatePermission(true); // 作成権限

            BlobServiceSasSignatureValues sasSignatureValues = new BlobServiceSasSignatureValues(
                    OffsetDateTime.now().plusMinutes(10), // URLの有効期限を10分に設定
                    blobSasPermission);

            // --- 5. SAS URLを生成 ---
            String sasToken = blobClient.generateSas(sasSignatureValues);
            String sasUrl = blobClient.getBlobUrl() + "?" + sasToken;

            // --- 6. クライアントに返す情報をまとめる ---
            Map<String, String> response = Map.of(
                    "sasUrl", sasUrl, // アップロードに使う一時URL
                    "blobUrl", blobClient.getBlobUrl() // DBに保存する最終的なURL
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body(Map.of("error", "Failed to generate SAS URL"));
        }
    }
}
