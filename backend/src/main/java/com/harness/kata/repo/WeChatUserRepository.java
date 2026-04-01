package com.harness.kata.repo;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface WeChatUserRepository extends JpaRepository<WeChatUserEntity, Long> {
    Optional<WeChatUserEntity> findByOpenid(String openid);
}

