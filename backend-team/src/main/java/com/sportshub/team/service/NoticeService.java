package com.sportshub.team.service;

import com.sportshub.team.domain.TeamNotice;
import com.sportshub.team.repository.TeamNoticeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NoticeService {
    private final TeamNoticeRepository teamNoticeRepository;

    @Transactional
    public TeamNotice create(Long teamId, TeamNotice n) {
        n.setTeamId(teamId);
        return teamNoticeRepository.save(n);
    }

    @Transactional(readOnly = true)
    public List<TeamNotice> list(Long teamId) {
        return teamNoticeRepository.findByTeamIdOrderByCreatedAtDesc(teamId);
    }

    @Transactional(readOnly = true)
    public TeamNotice get(Long teamId, Long noticeId) {
        TeamNotice n = teamNoticeRepository.findById(noticeId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "notice not found"));
        if (!n.getTeamId().equals(teamId)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "notice not found");
        return n;
    }

    @Transactional
    public TeamNotice update(Long teamId, Long noticeId, TeamNotice patch) {
        TeamNotice n = get(teamId, noticeId);
        if (patch.getTitle() != null) n.setTitle(patch.getTitle());
        if (patch.getContent() != null) n.setContent(patch.getContent());
        return teamNoticeRepository.save(n);
    }

    @Transactional
    public void delete(Long teamId, Long noticeId) {
        TeamNotice n = get(teamId, noticeId);
        teamNoticeRepository.delete(n);
    }
}

