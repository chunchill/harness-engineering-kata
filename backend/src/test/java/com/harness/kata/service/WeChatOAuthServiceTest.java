package com.harness.kata.service;

import com.harness.kata.config.WeChatConfig;
import com.harness.kata.repo.UserRepository;
import jakarta.servlet.http.HttpSession;
import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpSession;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.Mockito.*;

class WeChatOAuthServiceTest {

    @Test
    void loginRedirect_sets_state_in_session() {
        WeChatConfig cfg = new WeChatConfig("app", "secret", "https://example.com/callback", "http://localhost:5180/");
        UserRepository repo = mock(UserRepository.class);
        WeChatOAuthService svc = new WeChatOAuthService(cfg, repo);

        HttpSession session = new MockHttpSession();
        var uri = svc.loginRedirect(session);

        assertThat(uri.toString()).contains("open.weixin.qq.com/connect/qrconnect");
        assertThat(session.getAttribute(WeChatOAuthService.SESSION_STATE)).isNotNull();
    }

    @Test
    void handleCallback_rejects_invalid_state() {
        WeChatConfig cfg = new WeChatConfig("app", "secret", "https://example.com/callback", "http://localhost:5180/");
        UserRepository repo = mock(UserRepository.class);
        WeChatOAuthService svc = new WeChatOAuthService(cfg, repo);

        MockHttpSession session = new MockHttpSession();
        session.setAttribute(WeChatOAuthService.SESSION_STATE, "expected");

        assertThatThrownBy(() -> svc.handleCallback("code", "wrong", session))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("state");
    }
}

