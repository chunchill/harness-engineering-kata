package com.harness.kata.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LaneRepository extends JpaRepository<LaneEntity, Long> {
    List<LaneEntity> findAllByOrderByPositionAsc();
}

