package com.tagoapp.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**") // /api/ で始まるすべてのパスに適用
                .allowedOrigins(
                    "http://localhost:5173", 
                    "http://127.0.0.1:5173", 
                    "https://tagoapp-onsen-reviews.japaneast.cloudapp.azure.com" // 本番環境のURLも追加
                )
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // OPTIONSとDELETEを明示的に許可
                .allowedHeaders("*")    // すべてのヘッダーを許可
                .allowCredentials(true); // クレデンシャル情報の送信を許可
    }
}