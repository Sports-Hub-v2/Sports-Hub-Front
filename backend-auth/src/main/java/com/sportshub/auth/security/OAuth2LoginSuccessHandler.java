package com.sportshub.auth.security;

import com.sportshub.auth.domain.Account;
import com.sportshub.auth.repository.AccountRepository;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
public class OAuth2LoginSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {
    private final AccountRepository accountRepository;
    private final JwtTokenProvider jwtTokenProvider;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Value("${AUTH_SUCCESS_REDIRECT_URL:http://localhost:5173/oauth/callback}")
    private String successRedirectUrl;

    @Override
    @Transactional
    public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException, ServletException {
        OAuth2User user = (OAuth2User) authentication.getPrincipal();
        String email = getAttribute(user, "email");
        String provider = getAttribute(user, "provider");
        String providerId = getAttribute(user, "providerId");

        // Find or create account by email; if email is null, fall back to providerId based address
        String accountEmail = (email != null) ? email : (provider + "+" + providerId + "@oauth.local");

        Account account = accountRepository.findByEmail(accountEmail).orElseGet(() -> {
            Account a = new Account();
            a.setEmail(accountEmail);
            a.setPasswordHash(encoder.encode("oauth:" + UUID.randomUUID()));
            a.setRole("USER");
            a.setStatus("ACTIVE");
            a.setEmailVerified(Boolean.TRUE);
            return accountRepository.save(a);
        });

        Map<String, Object> claims = new HashMap<>();
        claims.put("accountId", account.getId());
        claims.put("email", account.getEmail());
        claims.put("role", account.getRole());
        claims.put("provider", provider);
        String token = jwtTokenProvider.createToken(String.valueOf(account.getId()), claims);

        String redirect = successRedirectUrl
                + "?token=" + URLEncoder.encode(token, StandardCharsets.UTF_8)
                + "&provider=" + URLEncoder.encode(provider != null ? provider : "", StandardCharsets.UTF_8);
        getRedirectStrategy().sendRedirect(request, response, redirect);
    }

    private String getAttribute(OAuth2User user, String key) {
        Object v = user.getAttributes().get(key);
        return v != null ? String.valueOf(v) : null;
    }
}

