package com.harness.kata.service;

import com.harness.kata.repo.TaskRepository;
import com.harness.kata.types.TaskCreateRequest;
import com.harness.kata.types.TaskDto;
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
@Import(TaskService.class)
@ActiveProfiles("test")
class TaskServiceTest {

    @Autowired
    TaskService taskService;

    @Autowired
    TaskRepository taskRepository;

    @Test
    void create_and_findAll() {
        TaskDto created = taskService.create(new TaskCreateRequest("First task", "desc"));
        assertThat(created.id()).isNotNull();
        assertThat(created.title()).isEqualTo("First task");
        assertThat(created.description()).isEqualTo("desc");
        assertThat(created.status()).isEqualTo(TaskStatus.TODO);
        assertThat(created.createdAt()).isNotNull();
        assertThat(created.updatedAt()).isNotNull();

        List<TaskDto> all = taskService.findAll();
        assertThat(all).hasSize(1);
        assertThat(all.get(0).title()).isEqualTo("First task");
    }

    @Test
    void create_rejects_blank_title() {
        assertThatThrownBy(() -> taskService.create(new TaskCreateRequest("", "x")))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("title is required");
        assertThatThrownBy(() -> taskService.create(new TaskCreateRequest(null, "x")))
                .isInstanceOf(IllegalArgumentException.class);
    }

    @Test
    void update_status() {
        TaskDto created = taskService.create(new TaskCreateRequest("Task", null));
        TaskDto updated = taskService.update(created.id(), new TaskUpdateRequest(null, null, TaskStatus.IN_PROGRESS));
        assertThat(updated.status()).isEqualTo(TaskStatus.IN_PROGRESS);
        assertThat(updated.title()).isEqualTo("Task");
    }

    @Test
    void delete_removes_task() {
        TaskDto created = taskService.create(new TaskCreateRequest("To delete", null));
        taskService.delete(created.id());
        assertThat(taskService.findAll()).isEmpty();
    }

    @Test
    void update_throws_when_not_found() {
        assertThatThrownBy(() -> taskService.update(999L, new TaskUpdateRequest("x", null, null)))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("not found");
    }
}
