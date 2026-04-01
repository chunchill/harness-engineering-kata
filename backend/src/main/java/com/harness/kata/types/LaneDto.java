package com.harness.kata.types;

import java.time.Instant;

public record LaneDto(
        Long id,
        LaneKey key,
        String name,
        int position,
        Instant createdAt,
        Instant updatedAt
) {}

