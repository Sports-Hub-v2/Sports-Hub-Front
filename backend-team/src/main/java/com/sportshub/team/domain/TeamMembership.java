package com.sportshub.team.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Table(name = "team_memberships")
@Getter
@Setter
@NoArgsConstructor
public class TeamMembership {
    @EmbeddedId
    private TeamMembershipId id;

    @Column(name = "role_in_team", nullable = false)
    private String roleInTeam;

    @Column(name = "joined_at", insertable = false, updatable = false)
    private LocalDateTime joinedAt;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = Boolean.TRUE;
}

