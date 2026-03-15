package com.harness.kata.types;

public record TaskUpdateRequest(String title, String description, TaskStatus status) {}
