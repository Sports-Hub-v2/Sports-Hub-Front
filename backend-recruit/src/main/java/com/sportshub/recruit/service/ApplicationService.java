package com.sportshub.recruit.service;

import com.sportshub.recruit.domain.RecruitApplication;
import com.sportshub.recruit.repository.RecruitApplicationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {
    private final RecruitApplicationRepository applicationRepository;

    @Transactional
    public RecruitApplication apply(Long postId, RecruitApplication a) {
        a.setPostId(postId);
        if (a.getStatus() == null || a.getStatus().isBlank()) a.setStatus("PENDING");
        return applicationRepository.save(a);
    }

    @Transactional(readOnly = true)
    public List<RecruitApplication> listByPost(Long postId) {
        return applicationRepository.findByPostId(postId);
    }

    @Transactional(readOnly = true)
    public List<RecruitApplication> listByApplicant(Long applicantProfileId) {
        return applicationRepository.findByApplicantProfileId(applicantProfileId);
    }

    @Transactional(readOnly = true)
    public List<RecruitApplication> listByTeamProfile(Long teamProfileId) {
        return applicationRepository.findByTeamProfile(teamProfileId);
    }

    @Transactional
    public RecruitApplication updateStatus(Long postId, Long applicationId, String status) {
        RecruitApplication a = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "application not found"));
        if (!a.getPostId().equals(postId)) throw new ResponseStatusException(HttpStatus.NOT_FOUND, "application not found");
        a.setStatus(status);
        return applicationRepository.save(a);
    }

    @Transactional
    public void delete(Long postId, Long applicationId) {
        RecruitApplication a = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NO_CONTENT));
        if (!a.getPostId().equals(postId)) return;
        applicationRepository.delete(a);
    }
}

