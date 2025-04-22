package com.zakzackr.reminder.controller;

import org.springframework.web.bind.annotation.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

// ALB→Spring Boot app.へのhealthcheck用のエンドポイント
@RestController
public class HealthCheckController {
    private static final Logger logger = LoggerFactory.getLogger(HealthCheckController.class);

    @GetMapping("/healthcheck")
    public String health() {
        logger.info("✅ /healthcheck にリクエストが届きました！");
        return "OK";
    }
}