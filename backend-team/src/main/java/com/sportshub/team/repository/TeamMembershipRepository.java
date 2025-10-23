package com.sportshub.team.repository;

import com.sportshub.team.domain.TeamMembership;
import com.sportshub.team.domain.TeamMembershipId;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamMembershipRepository extends JpaRepository<TeamMembership, TeamMembershipId> {
    List<TeamMembership> findByIdTeamIdAndIsActiveTrue(Long teamId);
    List<TeamMembership> findByIdProfileIdAndIsActiveTrue(Long profileId);
}
