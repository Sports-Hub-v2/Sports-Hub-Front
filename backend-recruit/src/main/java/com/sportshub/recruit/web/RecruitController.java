package com.sportshub.recruit.web;

import com.sportshub.recruit.domain.RecruitPost;
import com.sportshub.recruit.service.RecruitService;
import com.sportshub.recruit.web.dto.RecruitDtos.PostCreateRequest;
import com.sportshub.recruit.web.dto.RecruitDtos.PostUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/recruit/posts")
@RequiredArgsConstructor
public class RecruitController {
    private final RecruitService recruitService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public RecruitPost create(@Valid @RequestBody PostCreateRequest req) {
        RecruitPost p = new RecruitPost();
        BeanUtils.copyProperties(req, p);
        return recruitService.create(p);
    }

    @GetMapping("/{id}")
    public RecruitPost get(@PathVariable Long id) {
        return recruitService.get(id);
    }

    @PatchMapping("/{id}")
    public RecruitPost update(@PathVariable Long id, @RequestBody PostUpdateRequest req) {
        RecruitPost patch = new RecruitPost();
        BeanUtils.copyProperties(req, patch);
        return recruitService.update(id, patch);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        recruitService.delete(id);
    }

    @GetMapping
    public List<RecruitPost> list(@RequestParam(required = false) Long teamId,
                                  @RequestParam(required = false) Long writerProfileId,
                                  @RequestParam(required = false) String status,
                                  @RequestParam(required = false) String category) {
        return recruitService.list(teamId, writerProfileId, status, category);
    }
}
