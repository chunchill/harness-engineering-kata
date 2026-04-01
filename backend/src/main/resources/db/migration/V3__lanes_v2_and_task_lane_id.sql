-- Lanes v2: extensible lanes with numeric id

CREATE TABLE lanes_v2 (
    id BIGINT NOT NULL AUTO_INCREMENT,
    lane_key VARCHAR(32),
    name VARCHAR(255) NOT NULL,
    position INT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_lanes_v2_lane_key (lane_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed from existing v1 lanes if present
INSERT INTO lanes_v2 (lane_key, name, position, created_at, updated_at)
SELECT lane_key, name, position, created_at, updated_at
FROM lanes;

-- Ensure defaults exist (in case lanes table is absent/empty in some environments)
INSERT INTO lanes_v2 (lane_key, name, position, created_at, updated_at)
SELECT 'TODO', 'Todo', 0, NOW(6), NOW(6)
WHERE NOT EXISTS (SELECT 1 FROM lanes_v2 WHERE lane_key = 'TODO');
INSERT INTO lanes_v2 (lane_key, name, position, created_at, updated_at)
SELECT 'IN_PROGRESS', 'In Progress', 1, NOW(6), NOW(6)
WHERE NOT EXISTS (SELECT 1 FROM lanes_v2 WHERE lane_key = 'IN_PROGRESS');
INSERT INTO lanes_v2 (lane_key, name, position, created_at, updated_at)
SELECT 'DONE', 'Done', 2, NOW(6), NOW(6)
WHERE NOT EXISTS (SELECT 1 FROM lanes_v2 WHERE lane_key = 'DONE');

-- Tasks: add lane_id and backfill based on status -> lane_key
ALTER TABLE tasks ADD COLUMN lane_id BIGINT;

UPDATE tasks t
JOIN lanes_v2 l ON l.lane_key = t.status
SET t.lane_id = l.id
WHERE t.lane_id IS NULL;

-- If any tasks have null lane_id, default them to the first lane by position.
UPDATE tasks
SET lane_id = (SELECT id FROM lanes_v2 ORDER BY position ASC, id ASC LIMIT 1)
WHERE lane_id IS NULL;

ALTER TABLE tasks MODIFY lane_id BIGINT NOT NULL;

-- Replace v1 lanes table with v2
DROP TABLE lanes;
RENAME TABLE lanes_v2 TO lanes;

