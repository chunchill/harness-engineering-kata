package com.harness.kata.service;

import com.harness.kata.repo.LaneEntity;
import com.harness.kata.repo.LaneRepository;
import com.harness.kata.repo.TaskRepository;
import com.harness.kata.types.LaneDto;
import com.harness.kata.types.LaneKey;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class LaneService {

    private final LaneRepository laneRepository;
    private final TaskRepository taskRepository;

    public LaneService(LaneRepository laneRepository, TaskRepository taskRepository) {
        this.laneRepository = laneRepository;
        this.taskRepository = taskRepository;
    }

    @Transactional(readOnly = true)
    public List<LaneDto> list() {
        ensureDefaultsExist();
        return laneRepository.findAllByOrderByPositionAsc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LaneDto rename(Long id, String name) {
        ensureDefaultsExist();
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("name is required");
        }
        LaneEntity lane = laneRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("lane not found: " + id));
        lane.setName(name.trim());
        lane = laneRepository.save(lane);
        return toDto(lane);
    }

    @Transactional
    public LaneDto create(String name) {
        ensureDefaultsExist();
        if (name == null || name.isBlank()) throw new IllegalArgumentException("name is required");
        int nextPos = laneRepository.findAllByOrderByPositionAsc().stream()
                .mapToInt(LaneEntity::getPosition)
                .max()
                .orElse(-1) + 1;
        LaneEntity e = new LaneEntity();
        e.setName(name.trim());
        e.setPosition(nextPos);
        e = laneRepository.save(e);
        return toDto(e);
    }

    @Transactional
    public void delete(Long id) {
        ensureDefaultsExist();
        if (id == null) throw new IllegalArgumentException("id is required");

        LaneEntity lane = laneRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("lane not found: " + id));

        // Protect default seeded lanes (those that participate in status mapping).
        if (lane.getKey() != null) {
            throw new IllegalArgumentException("cannot delete default lane: " + id);
        }

        Optional<LaneEntity> firstRemaining = laneRepository.findAllByOrderByPositionAsc().stream()
                .filter(l -> !id.equals(l.getId()))
                .findFirst();

        if (firstRemaining.isEmpty()) {
            throw new IllegalArgumentException("cannot delete last lane");
        }

        Long toLaneId = firstRemaining.get().getId();
        if (taskRepository.countByLaneId(id) > 0) {
            taskRepository.moveTasksToLane(id, toLaneId);
        }

        laneRepository.delete(lane);
    }

    @Transactional
    public void ensureDefaultsExist() {
        if (laneRepository.count() > 0) return;

        laneRepository.save(seed(LaneKey.TODO, "Todo", 0));
        laneRepository.save(seed(LaneKey.IN_PROGRESS, "In Progress", 1));
        laneRepository.save(seed(LaneKey.DONE, "Done", 2));
    }

    private LaneEntity seed(LaneKey key, String name, int position) {
        LaneEntity e = new LaneEntity();
        e.setKey(key);
        e.setName(name);
        e.setPosition(position);
        return e;
    }

    private LaneDto toDto(LaneEntity e) {
        return new LaneDto(e.getId(), e.getKey(), e.getName(), e.getPosition(), e.getCreatedAt(), e.getUpdatedAt());
    }
}

