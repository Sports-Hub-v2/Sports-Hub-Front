package com.sportshub.recruit.repository;

import com.sportshub.recruit.domain.RecruitPost;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface RecruitPostRepository extends JpaRepository<RecruitPost, Long> {
    List<RecruitPost> findByTeamId(Long teamId);
    List<RecruitPost> findByWriterProfileId(Long writerProfileId);
    List<RecruitPost> findByStatus(String status);
    List<RecruitPost> findByCategory(String category);
}
