package com.harness.kata.runtime;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.harness.kata.service.TaskService;
import com.harness.kata.types.TaskCreateRequest;
import com.harness.kata.types.TaskDto;
import com.harness.kata.types.TaskUpdateRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/tasks")
public class TaskController {

    private final TaskService taskService;
    private final ObjectMapper objectMapper;

    public TaskController(TaskService taskService, ObjectMapper objectMapper) {
        this.taskService = taskService;
        this.objectMapper = objectMapper;
    }

    @GetMapping
    public List<TaskDto> list() {
        return taskService.findAll();
    }

    @PostMapping
    public ResponseEntity<TaskDto> create(@RequestBody TaskCreateRequest request) {
        TaskDto created = taskService.create(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<TaskDto> updatePatch(@PathVariable Long id, @RequestBody JsonNode body) {
        return updateFromBody(id, body);
    }

    /**
     * POST alias for partial update: some dev proxies do not forward PATCH request bodies reliably.
     * The SPA calls this endpoint from {@code updateTask} in the frontend API client.
     */
    @PostMapping("/{id}/patch")
    public ResponseEntity<TaskDto> updatePost(@PathVariable Long id, @RequestBody JsonNode body) {
        return updateFromBody(id, body);
    }

    private ResponseEntity<TaskDto> updateFromBody(Long id, JsonNode body) {
        try {
            TaskUpdateRequest request = objectMapper.convertValue(body, TaskUpdateRequest.class);
            if (body.has("dueDate")) {
                JsonNode d = body.get("dueDate");
                if (d.isNull()) {
                    request.setClearDueDate(true);
                } else {
                    request.setDueDate(d.asText());
                }
            }
            if (body.has("clearDueDate") && body.get("clearDueDate").asBoolean()) {
                request.setClearDueDate(true);
            }
            return ResponseEntity.ok(taskService.update(id, request));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            taskService.delete(id);
            return ResponseEntity.noContent().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
