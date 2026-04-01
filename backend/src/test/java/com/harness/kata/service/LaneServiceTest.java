package com.harness.kata.service;

import com.harness.kata.repo.LaneEntity;
import com.harness.kata.repo.LaneRepository;
import com.harness.kata.repo.TaskEntity;
import com.harness.kata.repo.TaskRepository;
import com.harness.kata.types.LaneDto;
import com.harness.kata.types.LaneKey;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

@DataJpaTest
@Import(LaneService.class)
@ActiveProfiles("test")
class LaneServiceTest {

    @Autowired
    LaneService laneService;

    @Autowired
    LaneRepository laneRepository;

    @Autowired
    TaskRepository taskRepository;

    @Test
    void list_orders_by_position() {
        LaneEntity a = new LaneEntity();
        a.setKey(LaneKey.DONE);
        a.setName("Done");
        a.setPosition(2);
        laneRepository.save(a);

        LaneEntity b = new LaneEntity();
        b.setKey(LaneKey.TODO);
        b.setName("Todo");
        b.setPosition(0);
        laneRepository.save(b);

        List<LaneDto> out = laneService.list();
        assertThat(out).hasSize(2);
        assertThat(out.get(0).key()).isEqualTo(LaneKey.TODO);
        assertThat(out.get(1).key()).isEqualTo(LaneKey.DONE);
    }

    @Test
    void rename_updates_name() {
        LaneEntity e = new LaneEntity();
        e.setKey(LaneKey.IN_PROGRESS);
        e.setName("In Progress");
        e.setPosition(1);
        e = laneRepository.save(e);

        LaneDto updated = laneService.rename(e.getId(), "Working");
        assertThat(updated.name()).isEqualTo("Working");
    }

    @Test
    void rename_rejects_blank_name() {
        LaneEntity e = new LaneEntity();
        e.setKey(LaneKey.TODO);
        e.setName("Todo");
        e.setPosition(0);
        e = laneRepository.save(e);
        Long id = e.getId();

        assertThatThrownBy(() -> laneService.rename(id, " "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("name is required");
    }

    @Test
    void delete_rejects_default_lane() {
        LaneEntity e = new LaneEntity();
        e.setKey(LaneKey.TODO);
        e.setName("Todo");
        e.setPosition(0);
        e = laneRepository.save(e);
        Long id = e.getId();

        assertThatThrownBy(() -> laneService.delete(id))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("cannot delete default lane");
    }

    @Test
    void delete_reassigns_tasks_to_first_remaining_lane() {
        LaneEntity a = new LaneEntity();
        a.setName("A");
        a.setPosition(10);
        a = laneRepository.save(a);

        LaneEntity b = new LaneEntity();
        b.setName("B");
        b.setPosition(0);
        b = laneRepository.save(b);

        TaskEntity t = new TaskEntity();
        t.setTitle("T1");
        t.setLaneId(a.getId());
        taskRepository.save(t);

        laneService.delete(a.getId());

        assertThat(laneRepository.findById(a.getId())).isEmpty();
        TaskEntity out = taskRepository.findAll().get(0);
        assertThat(out.getLaneId()).isEqualTo(b.getId());
    }
}

