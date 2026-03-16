package com.harness.kata.types;

import java.time.Instant;

public record TaskDto(
    Long id,
    String title,
    String description,
    TaskStatus status,
    TaskPriority priority,
    String dueDate,
    Instant createdAt,
    Instant updatedAt
) {}
