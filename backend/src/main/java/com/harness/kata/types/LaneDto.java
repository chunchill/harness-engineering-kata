package com.harness.kata.types;

import java.time.Instant;

public record LaneDto(
        LaneKey key,
        String name,
        int position,
        Instant createdAt,
        Instant updatedAt
) {}

