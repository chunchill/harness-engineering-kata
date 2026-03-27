package com.harness.kata.types;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.time.Instant;

public record TaskDto(
    Long id,
    String title,
    String description,
    TaskStatus status,
    TaskPriority priority,
    @JsonProperty("dueDate")
    @JsonInclude(JsonInclude.Include.ALWAYS)
    String dueDate,
    Instant createdAt,
    Instant updatedAt
) {}
