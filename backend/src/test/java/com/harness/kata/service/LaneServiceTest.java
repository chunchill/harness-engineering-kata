package com.harness.kata.service;

import com.harness.kata.repo.LaneEntity;
import com.harness.kata.repo.LaneRepository;
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
        laneRepository.save(e);

        LaneDto updated = laneService.rename(LaneKey.IN_PROGRESS, "Working");
        assertThat(updated.name()).isEqualTo("Working");
    }

    @Test
    void rename_rejects_blank_name() {
        assertThatThrownBy(() -> laneService.rename(LaneKey.TODO, " "))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("name is required");
    }
}

