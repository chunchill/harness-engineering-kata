package com.harness.kata.repo;

import com.harness.kata.types.LaneKey;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LaneRepository extends JpaRepository<LaneEntity, LaneKey> {
    List<LaneEntity> findAllByOrderByPositionAsc();
}

