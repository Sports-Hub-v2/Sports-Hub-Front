package com.sportshub.team.service;

import com.sportshub.team.domain.TeamMembership;
import com.sportshub.team.domain.TeamMembershipId;
import com.sportshub.team.repository.TeamMembershipRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MembershipService {
    private final TeamMembershipRepository membershipRepository;

    @Transactional
    public TeamMembership join(Long teamId, Long profileId, String role) {
        TeamMembershipId id = new TeamMembershipId(teamId, profileId);
        TeamMembership m = membershipRepository.findById(id).orElseGet(() -> {
            TeamMembership x = new TeamMembership();
            x.setId(id);
            x.setIsActive(true);
            return x;
        });
        m.setRoleInTeam(role);
        m.setIsActive(true);
        return membershipRepository.save(m);
    }

    @Transactional
    public TeamMembership updateRole(Long teamId, Long profileId, String role) {
        TeamMembership m = membershipRepository.findById(new TeamMembershipId(teamId, profileId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "membership not found"));
        m.setRoleInTeam(role);
        return membershipRepository.save(m);
    }

    @Transactional
    public void leave(Long teamId, Long profileId) {
        TeamMembership m = membershipRepository.findById(new TeamMembershipId(teamId, profileId))
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NO_CONTENT));
        if (Boolean.TRUE.equals(m.getIsActive())) {
            m.setIsActive(false);
            membershipRepository.save(m);
        }
    }

    @Transactional(readOnly = true)
    public List<TeamMembership> listActive(Long teamId) {
        return membershipRepository.findByIdTeamIdAndIsActiveTrue(teamId);
    }

    @Transactional(readOnly = true)
    public List<TeamMembership> listByProfile(Long profileId) {
        return membershipRepository.findByIdProfileIdAndIsActiveTrue(profileId);
    }
}
