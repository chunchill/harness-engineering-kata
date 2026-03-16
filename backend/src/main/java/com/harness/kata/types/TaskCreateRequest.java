package com.harness.kata.types;

public record TaskCreateRequest(String title, String description, TaskPriority priority, String dueDate) {}
