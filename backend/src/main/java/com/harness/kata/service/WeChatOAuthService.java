package com.harness.kata.service;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.harness.kata.config.WeChatConfig;
import com.harness.kata.repo.UserEntity;
import com.harness.kata.repo.UserRepository;
import com.harness.kata.types.AuthProvider;
import com.harness.kata.types.UserDto;
import jakarta.servlet.http.HttpSession;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.security.SecureRandom;
import java.util.Base64;

@Service
public class WeChatOAuthService {

    public static final String SESSION_STATE = "wechat_oauth_state";
    public static final String SESSION_USER_ID = "user_id";

    private final WeChatConfig config;
    private final UserRepository userRepository;
    private final RestClient rest;
    private final SecureRandom random = new SecureRandom();

    public WeChatOAuthService(WeChatConfig config, UserRepository userRepository) {
        this.config = config;
        this.userRepository = userRepository;
        this.rest = RestClient.create();
    }

    public URI loginRedirect(HttpSession session) {
        requireConfig();
        String state = newState();
        session.setAttribute(SESSION_STATE, state);

        String url = UriComponentsBuilder.fromHttpUrl("https://open.weixin.qq.com/connect/qrconnect")
                .queryParam("appid", config.appId())
                .queryParam("redirect_uri", config.redirectUri())
                .queryParam("response_type", "code")
                .queryParam("scope", "snsapi_login")
                .queryParam("state", state)
                .fragment("wechat_redirect")
                .build(true)
                .toUriString();

        return URI.create(url);
    }

    @Transactional
    public URI handleCallback(String code, String state, HttpSession session) {
        requireConfig();
        if (!StringUtils.hasText(code)) throw new IllegalArgumentException("code is required");
        if (!StringUtils.hasText(state)) throw new IllegalArgumentException("state is required");

        Object expected = session.getAttribute(SESSION_STATE);
        if (expected == null || !state.equals(expected.toString())) {
            throw new IllegalArgumentException("invalid state");
        }
        session.removeAttribute(SESSION_STATE);

        AccessTokenResponse token = rest.get()
                .uri(uri -> UriComponentsBuilder.fromHttpUrl("https://api.weixin.qq.com/sns/oauth2/access_token")
                        .queryParam("appid", config.appId())
                        .queryParam("secret", config.appSecret())
                        .queryParam("code", code)
                        .queryParam("grant_type", "authorization_code")
                        .build(true)
                        .toUri())
                .retrieve()
                .body(AccessTokenResponse.class);

        if (token == null || !StringUtils.hasText(token.openid) || !StringUtils.hasText(token.accessToken)) {
            throw new IllegalArgumentException("wechat token exchange failed");
        }

        UserInfoResponse userInfo = rest.get()
                .uri(uri -> UriComponentsBuilder.fromHttpUrl("https://api.weixin.qq.com/sns/userinfo")
                        .queryParam("access_token", token.accessToken)
                        .queryParam("openid", token.openid)
                        .queryParam("lang", "zh_CN")
                        .build(true)
                        .toUri())
                .retrieve()
                .body(UserInfoResponse.class);

        UserEntity user = userRepository.findByOpenid(token.openid).orElseGet(UserEntity::new);
        user.setProvider(AuthProvider.WECHAT);
        user.setOpenid(token.openid);
        if (StringUtils.hasText(token.unionid)) user.setUnionid(token.unionid);
        if (userInfo != null) {
            if (StringUtils.hasText(userInfo.nickname)) user.setNickname(userInfo.nickname);
            if (StringUtils.hasText(userInfo.headimgurl)) user.setAvatarUrl(userInfo.headimgurl);
        }
        user = userRepository.save(user);
        session.setAttribute(SESSION_USER_ID, user.getId());

        String front = StringUtils.hasText(config.frontendRedirectUri()) ? config.frontendRedirectUri() : "/";
        return URI.create(front);
    }

    @Transactional(readOnly = true)
    public UserDto currentUser(HttpSession session) {
        Object id = session.getAttribute(SESSION_USER_ID);
        if (id == null) return null;
        Long userId = (id instanceof Number n) ? n.longValue() : Long.valueOf(id.toString());
        UserEntity u = userRepository.findById(userId).orElse(null);
        if (u == null) return null;
        return new UserDto(u.getId(), u.getProvider(), u.getPhone(), u.getOpenid(), u.getNickname(), u.getAvatarUrl(), u.getCreatedAt(), u.getUpdatedAt());
    }

    public void logout(HttpSession session) {
        session.removeAttribute(SESSION_USER_ID);
    }

    private void requireConfig() {
        if (!StringUtils.hasText(config.appId()) || !StringUtils.hasText(config.appSecret()) || !StringUtils.hasText(config.redirectUri())) {
            throw new IllegalStateException("wechat config missing (wechat.app-id/app-secret/redirect-uri)");
        }
    }

    private String newState() {
        byte[] bytes = new byte[24];
        random.nextBytes(bytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);
    }

    public static final class AccessTokenResponse {
        @JsonProperty("access_token")
        public String accessToken;
        public String openid;
        public String unionid;
        @JsonProperty("errcode")
        public Integer errcode;
        @JsonProperty("errmsg")
        public String errmsg;
    }

    public static final class UserInfoResponse {
        public String openid;
        public String unionid;
        public String nickname;
        public String headimgurl;
        @JsonProperty("errcode")
        public Integer errcode;
        @JsonProperty("errmsg")
        public String errmsg;
    }
}

