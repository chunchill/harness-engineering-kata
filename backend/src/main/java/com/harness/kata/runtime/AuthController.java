package com.harness.kata.runtime;

import com.harness.kata.service.PhoneAuthService;
import com.harness.kata.service.WeChatOAuthService;
import com.harness.kata.types.PhoneAuthRequest;
import com.harness.kata.types.UserDto;
import jakarta.servlet.http.HttpSession;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.net.URI;

@RestController
public class AuthController {

    private final WeChatOAuthService weChatOAuthService;
    private final PhoneAuthService phoneAuthService;

    public AuthController(WeChatOAuthService weChatOAuthService, PhoneAuthService phoneAuthService) {
        this.weChatOAuthService = weChatOAuthService;
        this.phoneAuthService = phoneAuthService;
    }

    @GetMapping("/auth/wechat/login")
    public ResponseEntity<Void> login(HttpSession session) {
        URI redirect = weChatOAuthService.loginRedirect(session);
        return ResponseEntity.status(HttpStatus.FOUND).location(redirect).build();
    }

    @PostMapping("/auth/register")
    public ResponseEntity<UserDto> register(@RequestBody PhoneAuthRequest body, HttpSession session) {
        try {
            UserDto u = phoneAuthService.register(body != null ? body.phone() : null, body != null ? body.password() : null, session);
            return ResponseEntity.status(HttpStatus.CREATED).body(u);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/auth/login")
    public ResponseEntity<UserDto> login(@RequestBody PhoneAuthRequest body, HttpSession session) {
        try {
            UserDto u = phoneAuthService.login(body != null ? body.phone() : null, body != null ? body.password() : null, session);
            return ResponseEntity.ok(u);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @GetMapping("/auth/wechat/callback")
    public ResponseEntity<Void> callback(@RequestParam(required = false) String code,
                                        @RequestParam(required = false) String state,
                                        HttpSession session) {
        try {
            URI redirect = weChatOAuthService.handleCallback(code, state, session);
            return ResponseEntity.status(HttpStatus.FOUND).location(redirect).build();
        } catch (IllegalArgumentException | IllegalStateException e) {
            // redirect back to app; surface errors via console/logs for now
            return ResponseEntity.status(HttpStatus.FOUND).location(URI.create("/")).build();
        }
    }

    @GetMapping("/me")
    public ResponseEntity<UserDto> me(HttpSession session) {
        UserDto me = weChatOAuthService.currentUser(session);
        if (me == null) return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        return ResponseEntity.ok(me);
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(HttpSession session) {
        weChatOAuthService.logout(session);
        return ResponseEntity.noContent().build();
    }
}

