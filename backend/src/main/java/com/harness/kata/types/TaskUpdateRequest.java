package com.harness.kata.types;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

/**
 * Mutable DTO for PATCH /tasks/{id}. Jackson binds only JSON-present fields; partial updates work reliably.
 */
@JsonIgnoreProperties(ignoreUnknown = true)
public class TaskUpdateRequest {

    private String title;
    private String description;
    private TaskStatus status;
    private TaskPriority priority;
    private String dueDate;
    private Boolean clearDueDate;

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public TaskPriority getPriority() {
        return priority;
    }

    public void setPriority(TaskPriority priority) {
        this.priority = priority;
    }

    public String getDueDate() {
        return dueDate;
    }

    public void setDueDate(String dueDate) {
        this.dueDate = dueDate;
    }

    public Boolean getClearDueDate() {
        return clearDueDate;
    }

    public void setClearDueDate(Boolean clearDueDate) {
        this.clearDueDate = clearDueDate;
    }
}
