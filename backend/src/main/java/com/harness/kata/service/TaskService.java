package com.harness.kata.service;

import com.harness.kata.repo.TaskEntity;
import com.harness.kata.repo.TaskRepository;
import com.harness.kata.types.TaskCreateRequest;
import com.harness.kata.types.TaskDto;
import com.harness.kata.types.TaskPriority;
import com.harness.kata.types.TaskStatus;
import com.harness.kata.types.TaskUpdateRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Service
public class TaskService {

    private final TaskRepository taskRepository;

    public TaskService(TaskRepository taskRepository) {
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<TaskDto> findAll() {
        return taskRepository.findAllByOrderByUpdatedAtDesc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public TaskDto create(TaskCreateRequest request) {
        if (request == null || request.title() == null || request.title().isBlank()) {
            throw new IllegalArgumentException("title is required");
        }
        TaskEntity entity = new TaskEntity();
        entity.setTitle(request.title().trim());
        entity.setDescription(request.description() != null ? request.description().trim() : null);
        entity.setStatus(TaskStatus.TODO);
        entity.setPriority(request.priority() != null ? request.priority() : TaskPriority.MEDIUM);
        entity.setDueDate(parseDueDate(request.dueDate()));
        entity = taskRepository.save(entity);
        return toDto(entity);
    }

    @Transactional
    public TaskDto update(Long id, TaskUpdateRequest request) {
        TaskEntity entity = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("task not found: " + id));
        if (request.title() != null && !request.title().isBlank()) {
            entity.setTitle(request.title().trim());
        }
        if (request.description() != null) {
            entity.setDescription(request.description().trim());
        }
        if (request.status() != null) {
            entity.setStatus(request.status());
        }
        if (request.priority() != null) {
            entity.setPriority(request.priority());
        }
        if (Boolean.TRUE.equals(request.clearDueDate())) {
            entity.setDueDate(null);
        } else if (request.dueDate() != null && !request.dueDate().isBlank()) {
            entity.setDueDate(parseDueDate(request.dueDate()));
        }
        entity = taskRepository.save(entity);
        return toDto(entity);
    }

    @Transactional
    public void delete(Long id) {
        if (!taskRepository.existsById(id)) {
            throw new IllegalArgumentException("task not found: " + id);
        }
        taskRepository.deleteById(id);
    }

    private TaskDto toDto(TaskEntity e) {
        return new TaskDto(
                e.getId(),
                e.getTitle(),
                e.getDescription(),
                e.getStatus(),
                Objects.requireNonNullElse(e.getPriority(), TaskPriority.MEDIUM),
                e.getDueDate() != null ? e.getDueDate().format(DateTimeFormatter.ISO_LOCAL_DATE) : null,
                e.getCreatedAt(),
                e.getUpdatedAt()
        );
    }

    private LocalDate parseDueDate(String s) {
        if (s == null || s.isBlank()) return null;
        try {
            return LocalDate.parse(s, DateTimeFormatter.ISO_LOCAL_DATE);
        } catch (DateTimeParseException e) {
            throw new IllegalArgumentException("Invalid dueDate format, expected YYYY-MM-DD: " + s);
        }
    }
}
