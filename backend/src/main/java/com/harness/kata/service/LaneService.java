package com.harness.kata.service;

import com.harness.kata.repo.LaneEntity;
import com.harness.kata.repo.LaneRepository;
import com.harness.kata.types.LaneDto;
import com.harness.kata.types.LaneKey;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class LaneService {

    private final LaneRepository laneRepository;

    public LaneService(LaneRepository laneRepository) {
        this.laneRepository = laneRepository;
    }

    @Transactional(readOnly = true)
    public List<LaneDto> list() {
        ensureSeeded();
        return laneRepository.findAllByOrderByPositionAsc().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public LaneDto rename(LaneKey key, String name) {
        ensureSeeded();
        if (name == null || name.isBlank()) {
            throw new IllegalArgumentException("name is required");
        }
        LaneEntity lane = laneRepository.findById(key)
                .orElseThrow(() -> new IllegalArgumentException("lane not found: " + key));
        lane.setName(name.trim());
        lane = laneRepository.save(lane);
        return toDto(lane);
    }

    private void ensureSeeded() {
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
        return new LaneDto(e.getKey(), e.getName(), e.getPosition(), e.getCreatedAt(), e.getUpdatedAt());
    }
}

