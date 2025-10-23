package com.sportshub.recruit.web;

import com.sportshub.recruit.domain.RecruitApplication;
import com.sportshub.recruit.service.ApplicationService;
import com.sportshub.recruit.web.dto.RecruitDtos.ApplicationCreateRequest;
import com.sportshub.recruit.web.dto.RecruitDtos.ApplicationUpdateStatusRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping
@RequiredArgsConstructor
public class RecruitApplicationController {
    private final ApplicationService applicationService;

    @PostMapping("/api/recruit/posts/{postId}/applications")
    @ResponseStatus(HttpStatus.CREATED)
    public RecruitApplication apply(@PathVariable Long postId, @Valid @RequestBody ApplicationCreateRequest req) {
        RecruitApplication a = new RecruitApplication();
        BeanUtils.copyProperties(req, a);
        return applicationService.apply(postId, a);
    }

    @GetMapping("/api/recruit/posts/{postId}/applications")
    public List<RecruitApplication> list(@PathVariable Long postId) {
        return applicationService.listByPost(postId);
    }

    @PatchMapping("/api/recruit/posts/{postId}/applications/{applicationId}")
    public RecruitApplication updateStatus(@PathVariable Long postId, @PathVariable Long applicationId, @Valid @RequestBody ApplicationUpdateStatusRequest req) {
        return applicationService.updateStatus(postId, applicationId, req.getStatus());
    }

    @DeleteMapping("/api/recruit/posts/{postId}/applications/{applicationId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long postId, @PathVariable Long applicationId) {
        applicationService.delete(postId, applicationId);
    }

    @GetMapping("/api/recruit/applications/by-applicant/{profileId}")
    public List<RecruitApplication> listByApplicant(@PathVariable Long profileId) {
        return applicationService.listByApplicant(profileId);
    }

    @GetMapping("/api/recruit/applications/received/{profileId}")
    public List<RecruitApplication> listReceivedByProfile(@PathVariable Long profileId) {
        return applicationService.listByTeamProfile(profileId);
    }
}
