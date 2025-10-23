package com.sportshub.auth.service;

import com.sportshub.auth.domain.Account;
import com.sportshub.auth.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

@Service
@RequiredArgsConstructor
public class AccountService {
    private final AccountRepository accountRepository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Transactional
    public Account create(String email, String rawPassword, String role) {
        accountRepository.findByEmail(email).ifPresent(a -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "email already exists");
        });
        Account a = new Account();
        a.setEmail(email);
        a.setPasswordHash(encoder.encode(rawPassword));
        a.setRole(role);
        a.setStatus("ACTIVE");
        a.setEmailVerified(Boolean.FALSE);
        return accountRepository.save(a);
    }

    @Transactional(readOnly = true)
    public Account getById(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "account not found"));
    }

    @Transactional(readOnly = true)
    public Account getByEmail(String email) {
        return accountRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "account not found"));
    }
}

