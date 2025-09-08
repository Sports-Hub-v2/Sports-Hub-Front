package com.sportshub.team.web;

import com.sportshub.team.domain.Team;
import com.sportshub.team.service.TeamService;
import com.sportshub.team.web.dto.TeamDtos.CreateRequest;
import com.sportshub.team.web.dto.TeamDtos.UpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams")
@RequiredArgsConstructor
public class TeamController {
    private final TeamService teamService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Team create(@Validated @RequestBody CreateRequest req) {
        Team t = new Team();
        BeanUtils.copyProperties(req, t);
        return teamService.create(t);
    }

    @GetMapping("/{id}")
    public Team get(@PathVariable Long id) {
        return teamService.get(id);
    }

    @PatchMapping("/{id}")
    public Team update(@PathVariable Long id, @RequestBody UpdateRequest req) {
        Team patch = new Team();
        BeanUtils.copyProperties(req, patch);
        return teamService.update(id, patch);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        teamService.delete(id);
    }

    @GetMapping
    public List<Team> list(@RequestParam(required = false) String region) {
        return teamService.list(region);
    }
}

