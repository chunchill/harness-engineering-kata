package com.harness.kata.service;

import com.harness.kata.repo.LaneEntity;
import com.harness.kata.repo.LaneRepository;
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
    private final LaneRepository laneRepository;
    private final LaneService laneService;

    public TaskService(TaskRepository taskRepository, LaneRepository laneRepository, LaneService laneService) {
        this.taskRepository = taskRepository;
        this.laneRepository = laneRepository;
        this.laneService = laneService;
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
        laneService.ensureDefaultsExist();
        Long laneId = request.laneId() != null ? request.laneId() : firstLaneId();
        if (laneId == null) throw new IllegalStateException("No lanes exist");

        TaskEntity entity = new TaskEntity();
        entity.setTitle(request.title().trim());
        entity.setDescription(request.description() != null ? request.description().trim() : null);
        entity.setLaneId(laneId);
        maybeSyncStatusFromLane(entity);
        entity.setPriority(request.priority() != null ? request.priority() : TaskPriority.MEDIUM);
        entity.setDueDate(parseDueDate(request.dueDate()));
        entity = taskRepository.save(entity);
        return toDto(entity);
    }

    @Transactional
    public TaskDto update(Long id, TaskUpdateRequest request) {
        TaskEntity entity = taskRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("task not found: " + id));
        if (request.getTitle() != null && !request.getTitle().isBlank()) {
            entity.setTitle(request.getTitle().trim());
        }
        if (request.getDescription() != null) {
            entity.setDescription(request.getDescription().trim());
        }
        if (request.getStatus() != null) {
            entity.setStatus(request.getStatus());
        }
        if (request.getLaneId() != null) {
            entity.setLaneId(request.getLaneId());
            maybeSyncStatusFromLane(entity);
        }
        if (request.getPriority() != null) {
            entity.setPriority(request.getPriority());
        }
        if (Boolean.TRUE.equals(request.getClearDueDate())) {
            entity.setDueDate(null);
        } else if (request.getDueDate() != null && !request.getDueDate().isBlank()) {
            entity.setDueDate(parseDueDate(request.getDueDate()));
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
                e.getLaneId(),
                e.getStatus(),
                Objects.requireNonNullElse(e.getPriority(), TaskPriority.MEDIUM),
                e.getDueDate() != null ? e.getDueDate().format(DateTimeFormatter.ISO_LOCAL_DATE) : null,
                e.getCreatedAt(),
                e.getUpdatedAt()
        );
    }

    private Long firstLaneId() {
        return laneRepository.findAllByOrderByPositionAsc().stream()
                .findFirst()
                .map(LaneEntity::getId)
                .orElse(null);
    }

    /**
     * Backward compatibility: keep TaskStatus in sync for seeded lanes.
     * Custom lanes keep the existing status unchanged.
     */
    private void maybeSyncStatusFromLane(TaskEntity task) {
        if (task.getLaneId() == null) return;
        laneRepository.findById(task.getLaneId()).ifPresent((lane) -> {
            if (lane.getKey() == null) return;
            task.setStatus(TaskStatus.valueOf(lane.getKey().name()));
        });
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
