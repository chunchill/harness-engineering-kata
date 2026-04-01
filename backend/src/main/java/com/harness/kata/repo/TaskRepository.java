package com.harness.kata.repo;

import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import org.springframework.transaction.annotation.Transactional;
import java.util.List;

public interface TaskRepository extends JpaRepository<TaskEntity, Long> {

    List<TaskEntity> findAllByOrderByUpdatedAtDesc();

    long countByLaneId(Long laneId);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Transactional
    @Query("update TaskEntity t set t.laneId = :toLaneId where t.laneId = :fromLaneId")
    int moveTasksToLane(@Param("fromLaneId") Long fromLaneId, @Param("toLaneId") Long toLaneId);
}
