package com.sportshub.team.web;

import com.sportshub.team.domain.TeamMembership;
import com.sportshub.team.service.MembershipService;
import com.sportshub.team.web.dto.MembershipDtos.JoinRequest;
import com.sportshub.team.web.dto.MembershipDtos.UpdateRoleRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class TeamMembershipController {
    private final MembershipService membershipService;

    @PostMapping("/api/teams/{teamId}/members")
    @ResponseStatus(HttpStatus.CREATED)
    public TeamMembership join(@PathVariable Long teamId, @Valid @RequestBody JoinRequest req) {
        return membershipService.join(teamId, req.getProfileId(), req.getRoleInTeam());
    }

    @PatchMapping("/api/teams/{teamId}/members/{profileId}")
    public TeamMembership updateRole(@PathVariable Long teamId, @PathVariable Long profileId, @Valid @RequestBody UpdateRoleRequest req) {
        return membershipService.updateRole(teamId, profileId, req.getRoleInTeam());
    }

    @DeleteMapping("/api/teams/{teamId}/members/{profileId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void leave(@PathVariable Long teamId, @PathVariable Long profileId) {
        membershipService.leave(teamId, profileId);
    }

    @GetMapping("/api/teams/{teamId}/members")
    public List<TeamMembership> list(@PathVariable Long teamId) {
        return membershipService.listActive(teamId);
    }

    @GetMapping("/api/teams/memberships/by-profile/{profileId}")
    public List<TeamMembership> listByProfile(@PathVariable Long profileId) {
        return membershipService.listByProfile(profileId);
    }
}
