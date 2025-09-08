package com.sportshub.team.web.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class TeamDtos {
    @Data
    public static class CreateRequest {
        @NotBlank
        private String teamName;
        private Long captainProfileId;
        private String region;
        private String rivalTeams;
    }

    @Data
    public static class UpdateRequest {
        private String teamName;
        private Long captainProfileId;
        private String region;
        private String rivalTeams;
    }
}

