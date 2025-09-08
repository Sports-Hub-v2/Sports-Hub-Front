package com.sportshub.auth.service;

import com.sportshub.auth.domain.Account;
import com.sportshub.auth.domain.RefreshToken;
import com.sportshub.auth.repository.AccountRepository;
import com.sportshub.auth.repository.RefreshTokenRepository;
import com.sportshub.auth.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthTokenService {
    private final AccountRepository accountRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();
    private final SecureRandom secureRandom = new SecureRandom();

    @Value("${AUTH_JWT_EXPIRE_MS:900000}")
    private long accessTtlMs; // default 15m

    @Value("${AUTH_REFRESH_EXPIRE_MS:604800000}")
    private long refreshTtlMs; // default 7d

    private String hash(String input) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] h = digest.digest(input.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (byte b : h) sb.append(String.format("%02x", b));
            return sb.toString();
        } catch (Exception e) {
            throw new IllegalStateException("hash error", e);
        }
    }

    private String newRefreshTokenString() {
        byte[] buf = new byte[48];
        secureRandom.nextBytes(buf);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(buf);
    }

    @Transactional
    public TokenPair login(String email, String rawPassword, String deviceInfo) {
        Account acc = accountRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid credentials"));
        if (!encoder.matches(rawPassword, acc.getPasswordHash())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid credentials");
        }
        return issueTokens(acc, deviceInfo, null);
    }

    @Transactional
    public TokenPair refresh(String refreshTokenStr, String deviceInfo) {
        String tokenHash = hash(refreshTokenStr);
        RefreshToken rt = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "invalid refresh token"));
        if (!rt.isActive()) {
            // reuse or expired
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "refresh token expired or revoked");
        }
        // rotate: revoke old and issue new
        rt.setRevokedAt(LocalDateTime.now());
        refreshTokenRepository.save(rt);
        Account acc = accountRepository.findById(rt.getAccountId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "account not found"));
        return issueTokens(acc, deviceInfo, rt);
    }

    @Transactional
    public void logout(String refreshTokenStr) {
        String tokenHash = hash(refreshTokenStr);
        RefreshToken rt = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NO_CONTENT));
        if (rt.getRevokedAt() == null) {
            rt.setRevokedAt(LocalDateTime.now());
            refreshTokenRepository.save(rt);
        }
    }

    @Transactional
    public void logoutAllByRefresh(String refreshTokenStr) {
        String tokenHash = hash(refreshTokenStr);
        RefreshToken rt = refreshTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NO_CONTENT));
        Long accountId = rt.getAccountId();
        List<RefreshToken> active = refreshTokenRepository.findByAccountIdAndRevokedAtIsNullAndExpiresAtAfter(accountId, LocalDateTime.now());
        for (RefreshToken t : active) {
            t.setRevokedAt(LocalDateTime.now());
        }
        refreshTokenRepository.saveAll(active);
    }

    private TokenPair issueTokens(Account acc, String deviceInfo, RefreshToken previous) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("accountId", acc.getId());
        claims.put("email", acc.getEmail());
        claims.put("role", acc.getRole());
        String access = jwtTokenProvider.createToken(String.valueOf(acc.getId()), claims);

        String refreshStr = newRefreshTokenString();
        RefreshToken newRt = new RefreshToken();
        newRt.setAccountId(acc.getId());
        newRt.setTokenHash(hash(refreshStr));
        newRt.setDeviceInfo(deviceInfo);
        newRt.setExpiresAt(LocalDateTime.ofInstant(Instant.now().plusMillis(refreshTtlMs), ZoneId.systemDefault()));
        refreshTokenRepository.save(newRt);

        TokenPair tp = new TokenPair();
        tp.accessToken = access;
        tp.accessTokenExpiresIn = accessTtlMs / 1000L;
        tp.refreshToken = refreshStr;
        tp.refreshTokenExpiresIn = refreshTtlMs / 1000L;
        tp.tokenType = "Bearer";
        return tp;
    }

    public static class TokenPair {
        public String accessToken;
        public long accessTokenExpiresIn;
        public String refreshToken;
        public long refreshTokenExpiresIn;
        public String tokenType;
    }
}

