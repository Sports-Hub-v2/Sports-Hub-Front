package com.sportshub.notification.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class NotificationDtos {
    @Data
    public static class CreateRequest {
        @NotNull
        private Long receiverProfileId;
        @NotBlank
        private String type;
        @NotBlank
        private String message;
        private String relatedType;
        private Long relatedId;
    }
}

