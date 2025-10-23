package com.sportshub.auth.web.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

import java.time.LocalDateTime;

public class AccountDtos {
    @Data
    public static class CreateRequest {
        @Email
        @NotBlank
        private String email;

        @NotBlank
        @Size(min = 6, max = 100)
        private String password;

        @NotBlank
        private String role;
    }

    @Data
    public static class Response {
        private Long id;
        private String email;
        private String role;
        private String status;
        private Boolean emailVerified;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
    }
}

