package com.harness.kata.service;

import com.harness.kata.repo.TaskRepository;
import com.harness.kata.repo.LaneRepository;
import com.harness.kata.types.TaskCreateRequest;
import com.harness.kata.types.TaskDto;
import com.harness.kata.types.TaskPriority;
import com.harness.kata.types.TaskStatus;
import com.harness.kata.types.TaskUpdateRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@Import({TaskService.class, LaneService.class})
@ActiveProfiles("test")
class TaskServiceTest {

    @Autowired
    TaskService taskService;

    @Autowired
    LaneRepository laneRepository;

    @Autowired
    TaskRepository taskRepository;

    @Test
    void create_and_findAll() {
        TaskDto created = taskService.create(new TaskCreateRequest("First task", "desc", null, null, null));
        assertThat(created.id()).isNotNull();
        assertThat(created.title()).isEqualTo("First task");
        assertThat(created.description()).isEqualTo("desc");
        assertThat(created.laneId()).isNotNull();
        assertThat(created.status()).isEqualTo(TaskStatus.TODO);
        assertThat(created.priority()).isEqualTo(TaskPriority.MEDIUM);
        assertThat(created.dueDate()).isNull();
        assertThat(created.createdAt()).isNotNull();
        assertThat(created.updatedAt()).isNotNull();

        List<TaskDto> all = taskService.findAll();
        assertThat(all).hasSize(1);
        assertThat(all.get(0).title()).isEqualTo("First task");
    }

    @Test
    void create_rejects_blank_title() {
        assertThatThrownBy(() -> taskService.create(new TaskCreateRequest("", "x", null, null, null)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("title is required");
        assertThatThrownBy(() -> taskService.create(new TaskCreateRequest(null, "x", null, null, null)))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void update_status() {
        TaskDto created = taskService.create(new TaskCreateRequest("Task", null, null, null, null));
        TaskUpdateRequest req = new TaskUpdateRequest();
        req.setStatus(TaskStatus.IN_PROGRESS);
        TaskDto updated = taskService.update(created.id(), req);
        assertThat(updated.status()).isEqualTo(TaskStatus.IN_PROGRESS);
        assertThat(updated.title()).isEqualTo("Task");
    }

    @Test
    void delete_removes_task() {
        TaskDto created = taskService.create(new TaskCreateRequest("To delete", null, null, null, null));
        taskService.delete(created.id());
        assertThat(taskService.findAll()).isEmpty();
    }

    @Test
    void update_throws_when_not_found() {
        TaskUpdateRequest req = new TaskUpdateRequest();
        req.setTitle("x");
        assertThatThrownBy(() -> taskService.update(999L, req))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not found");
    }

    @Test
    void create_with_priority_returns_priority() {
        TaskDto created = taskService.create(new TaskCreateRequest("High priority", null, TaskPriority.HIGH, null, null));
        assertThat(created.priority()).isEqualTo(TaskPriority.HIGH);
        assertThat(created.title()).isEqualTo("High priority");
    }

    @Test
    void update_priority_persists() {
        TaskDto created = taskService.create(new TaskCreateRequest("Task", null, TaskPriority.MEDIUM, null, null));
        TaskUpdateRequest req = new TaskUpdateRequest();
        req.setPriority(TaskPriority.LOW);
        TaskDto updated = taskService.update(created.id(), req);
        assertThat(updated.priority()).isEqualTo(TaskPriority.LOW);
        assertThat(taskService.findAll().get(0).priority()).isEqualTo(TaskPriority.LOW);
    }

    @Test
    void create_with_dueDate_returns_dueDate() {
        TaskDto created = taskService.create(new TaskCreateRequest("With due", null, null, "2025-12-31", null));
        assertThat(created.dueDate()).isEqualTo("2025-12-31");
        assertThat(created.title()).isEqualTo("With due");
    }

    @Test
    void update_dueDate_set_and_clear() {
        TaskDto created = taskService.create(new TaskCreateRequest("Task", null, null, "2025-06-15", null));
        assertThat(created.dueDate()).isEqualTo("2025-06-15");

        TaskUpdateRequest clear = new TaskUpdateRequest();
        clear.setClearDueDate(true);
        TaskDto updated = taskService.update(created.id(), clear);
        assertThat(updated.dueDate()).isNull();
    }

    @Test
    void update_dueDate_when_previously_null() {
        TaskDto created = taskService.create(new TaskCreateRequest("No due", null, null, null, null));
        assertThat(created.dueDate()).isNull();
        TaskUpdateRequest req = new TaskUpdateRequest();
        req.setDueDate("2025-09-01");
        TaskDto updated = taskService.update(created.id(), req);
        assertThat(updated.dueDate()).isEqualTo("2025-09-01");
    }
}
