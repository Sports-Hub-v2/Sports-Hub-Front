package com.sportshub.team.service;

import com.sportshub.team.domain.Team;
import com.sportshub.team.repository.TeamRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TeamService {
    private final TeamRepository teamRepository;

    @Transactional
    public Team create(Team t) {
        try {
            return teamRepository.save(t);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "duplicate team name");
        }
    }

    @Transactional(readOnly = true)
    public Team get(Long id) {
        return teamRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "team not found"));
    }

    @Transactional
    public Team update(Long id, Team patch) {
        Team t = get(id);
        if (patch.getTeamName() != null) t.setTeamName(patch.getTeamName());
        if (patch.getRegion() != null) t.setRegion(patch.getRegion());
        if (patch.getCaptainProfileId() != null) t.setCaptainProfileId(patch.getCaptainProfileId());
        if (patch.getRivalTeams() != null) t.setRivalTeams(patch.getRivalTeams());
        try {
            return teamRepository.save(t);
        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "duplicate team name");
        }
    }

    @Transactional
    public void delete(Long id) {
        if (!teamRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "team not found");
        }
        teamRepository.deleteById(id);
    }

    @Transactional(readOnly = true)
    public List<Team> list(String region) {
        if (region == null || region.isBlank()) return teamRepository.findAll();
        return teamRepository.findByRegionIgnoreCase(region);
    }
}

