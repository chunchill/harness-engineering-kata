CREATE TABLE lanes (
    lane_key VARCHAR(32) NOT NULL,
    name VARCHAR(255) NOT NULL,
    position INT NOT NULL,
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (lane_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

INSERT INTO lanes (lane_key, name, position, created_at, updated_at) VALUES
    ('TODO', 'Todo', 0, NOW(6), NOW(6)),
    ('IN_PROGRESS', 'In Progress', 1, NOW(6), NOW(6)),
    ('DONE', 'Done', 2, NOW(6), NOW(6));

