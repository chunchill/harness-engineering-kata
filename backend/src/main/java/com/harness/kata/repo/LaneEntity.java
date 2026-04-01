package com.harness.kata.repo;

import com.harness.kata.types.LaneKey;
import jakarta.persistence.*;

import java.time.Instant;

@Entity
@Table(name = "lanes")
public class LaneEntity {

    @Id
    @Enumerated(EnumType.STRING)
    @Column(name = "lane_key", nullable = false, length = 32)
    private LaneKey key;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false)
    private int position;

    @Column(nullable = false, updatable = false)
    private Instant createdAt;

    @Column(nullable = false)
    private Instant updatedAt;

    @PrePersist
    void onPersist() {
        Instant now = Instant.now();
        if (createdAt == null) createdAt = now;
        if (updatedAt == null) updatedAt = now;
    }

    @PreUpdate
    void onUpdate() {
        updatedAt = Instant.now();
    }

    public LaneKey getKey() { return key; }
    public void setKey(LaneKey key) { this.key = key; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getPosition() { return position; }
    public void setPosition(int position) { this.position = position; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}

