package com.sportshub.auth.repository;

import com.sportshub.auth.domain.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByTokenHash(String tokenHash);
    List<RefreshToken> findByAccountIdAndRevokedAtIsNullAndExpiresAtAfter(Long accountId, LocalDateTime now);
}

