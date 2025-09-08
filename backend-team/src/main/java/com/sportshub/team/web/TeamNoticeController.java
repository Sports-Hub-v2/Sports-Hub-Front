package com.sportshub.team.web;

import com.sportshub.team.domain.TeamNotice;
import com.sportshub.team.service.NoticeService;
import com.sportshub.team.web.dto.NoticeDtos.CreateRequest;
import com.sportshub.team.web.dto.NoticeDtos.UpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/teams/{teamId}/notices")
@RequiredArgsConstructor
public class TeamNoticeController {
    private final NoticeService noticeService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TeamNotice create(@PathVariable Long teamId, @Valid @RequestBody CreateRequest req) {
        TeamNotice n = new TeamNotice();
        BeanUtils.copyProperties(req, n);
        return noticeService.create(teamId, n);
    }

    @GetMapping
    public List<TeamNotice> list(@PathVariable Long teamId) {
        return noticeService.list(teamId);
    }

    @GetMapping("/{noticeId}")
    public TeamNotice get(@PathVariable Long teamId, @PathVariable Long noticeId) {
        return noticeService.get(teamId, noticeId);
    }

    @PatchMapping("/{noticeId}")
    public TeamNotice update(@PathVariable Long teamId, @PathVariable Long noticeId, @RequestBody UpdateRequest req) {
        TeamNotice patch = new TeamNotice();
        BeanUtils.copyProperties(req, patch);
        return noticeService.update(teamId, noticeId, patch);
    }

    @DeleteMapping("/{noticeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long teamId, @PathVariable Long noticeId) {
        noticeService.delete(teamId, noticeId);
    }
}

