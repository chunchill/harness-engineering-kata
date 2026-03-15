package com.harness.kata.runtime;

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

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
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
    public ResponseEntity<TaskDto> update(@PathVariable Long id, @RequestBody TaskUpdateRequest request) {
        try {
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
