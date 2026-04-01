package com.harness.kata.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

@ConfigurationProperties(prefix = "wechat")
public record WeChatConfig(
        String appId,
        String appSecret,
        String redirectUri,
        String frontendRedirectUri
) {}

