package com.harness.kata.service;

import com.harness.kata.repo.UserEntity;
import com.harness.kata.repo.UserRepository;
import com.harness.kata.types.AuthProvider;
import com.harness.kata.types.UserDto;
import jakarta.servlet.http.HttpSession;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
public class PhoneAuthService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    public PhoneAuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional
    public UserDto register(String phone, String password, HttpSession session) {
        if (!StringUtils.hasText(phone) || !StringUtils.hasText(password)) {
            throw new IllegalArgumentException("phone and password are required");
        }
        String p = phone.trim();
        if (userRepository.findByPhone(p).isPresent()) {
            throw new IllegalArgumentException("phone already registered");
        }
        UserEntity u = new UserEntity();
        u.setProvider(AuthProvider.PHONE);
        u.setPhone(p);
        u.setPasswordHash(encoder.encode(password));
        u = userRepository.save(u);
        session.setAttribute(WeChatOAuthService.SESSION_USER_ID, u.getId());
        return toDto(u);
    }

    @Transactional
    public UserDto login(String phone, String password, HttpSession session) {
        if (!StringUtils.hasText(phone) || !StringUtils.hasText(password)) {
            throw new IllegalArgumentException("phone and password are required");
        }
        String p = phone.trim();
        UserEntity u = userRepository.findByPhone(p).orElseThrow(() -> new IllegalArgumentException("invalid credentials"));
        if (u.getPasswordHash() == null || !encoder.matches(password, u.getPasswordHash())) {
            throw new IllegalArgumentException("invalid credentials");
        }
        session.setAttribute(WeChatOAuthService.SESSION_USER_ID, u.getId());
        return toDto(u);
    }

    private UserDto toDto(UserEntity u) {
        return new UserDto(u.getId(), u.getProvider(), u.getPhone(), u.getOpenid(), u.getNickname(), u.getAvatarUrl(), u.getCreatedAt(), u.getUpdatedAt());
    }
}

