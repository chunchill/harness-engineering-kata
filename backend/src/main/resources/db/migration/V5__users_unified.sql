CREATE TABLE users (
    id BIGINT NOT NULL AUTO_INCREMENT,
    provider VARCHAR(16) NOT NULL,
    phone VARCHAR(32),
    password_hash VARCHAR(255),
    openid VARCHAR(64),
    unionid VARCHAR(64),
    nickname VARCHAR(255),
    avatar_url VARCHAR(1024),
    created_at DATETIME(6) NOT NULL,
    updated_at DATETIME(6) NOT NULL,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_phone (phone),
    UNIQUE KEY uk_users_openid (openid)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

