package com.sportshub.team.repository;

import com.sportshub.team.domain.TeamNotice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TeamNoticeRepository extends JpaRepository<TeamNotice, Long> {
    List<TeamNotice> findByTeamIdOrderByCreatedAtDesc(Long teamId);
}

