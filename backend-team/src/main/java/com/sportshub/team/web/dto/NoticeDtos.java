package com.sportshub.team.web.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

public class NoticeDtos {
    @Data
    public static class CreateRequest {
        @NotBlank
        private String title;
        private String content;
    }

    @Data
    public static class UpdateRequest {
        private String title;
        private String content;
    }
}

