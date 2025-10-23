package com.sportshub.auth.web;

import com.sportshub.auth.service.AuthTokenService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthTokenService authTokenService;

    @PostMapping("/login")
    @ResponseStatus(HttpStatus.OK)
    public TokenResponse login(@Validated @RequestBody LoginRequest req, HttpServletRequest http) {
        String device = http.getHeader("User-Agent");
        var pair = authTokenService.login(req.getEmail(), req.getPassword(), device);
        return TokenResponse.from(pair);
    }

    @PostMapping("/token/refresh")
    public TokenResponse refresh(@Validated @RequestBody RefreshRequest req, HttpServletRequest http) {
        String device = http.getHeader("User-Agent");
        var pair = authTokenService.refresh(req.getRefreshToken(), device);
        return TokenResponse.from(pair);
    }

    @PostMapping("/logout")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logout(@Validated @RequestBody RefreshRequest req) {
        authTokenService.logout(req.getRefreshToken());
    }

    @PostMapping("/logout-all")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void logoutAll(@Validated @RequestBody RefreshRequest req) {
        authTokenService.logoutAllByRefresh(req.getRefreshToken());
    }

    @Data
    public static class LoginRequest {
        @Email
        @NotBlank
        private String email;
        @NotBlank
        private String password;
    }

    @Data
    public static class RefreshRequest {
        @NotBlank
        private String refreshToken;
    }

    @Data
    public static class TokenResponse {
        private String accessToken;
        private long accessTokenExpiresIn;
        private String refreshToken;
        private long refreshTokenExpiresIn;
        private String tokenType;

        public static TokenResponse from(AuthTokenService.TokenPair p) {
            TokenResponse r = new TokenResponse();
            r.accessToken = p.accessToken;
            r.accessTokenExpiresIn = p.accessTokenExpiresIn;
            r.refreshToken = p.refreshToken;
            r.refreshTokenExpiresIn = p.refreshTokenExpiresIn;
            r.tokenType = p.tokenType;
            return r;
        }
    }
}

