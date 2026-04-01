package com.harness.kata.types;

import java.time.Instant;

public record UserDto(Long id, AuthProvider provider, String phone, String openid, String nickname, String avatarUrl, Instant createdAt, Instant updatedAt) {}

