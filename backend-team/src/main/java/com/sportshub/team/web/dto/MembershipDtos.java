package com.sportshub.team.web.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

public class MembershipDtos {
    @Data
    public static class JoinRequest {
        @NotNull
        private Long profileId;
        @NotBlank
        private String roleInTeam;
    }

    @Data
    public static class UpdateRoleRequest {
        @NotBlank
        private String roleInTeam;
    }
}

