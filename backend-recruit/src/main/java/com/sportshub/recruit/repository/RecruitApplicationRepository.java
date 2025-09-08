package com.sportshub.recruit.repository;

import com.sportshub.recruit.domain.RecruitApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface RecruitApplicationRepository extends JpaRepository<RecruitApplication, Long> {
    List<RecruitApplication> findByPostId(Long postId);
    List<RecruitApplication> findByApplicantProfileId(Long applicantProfileId);
    
    @Query("SELECT a FROM RecruitApplication a JOIN RecruitPost p ON a.postId = p.id " +
           "WHERE p.writerProfileId = :profileId ORDER BY a.applicationDate DESC")
    List<RecruitApplication> findByTeamProfile(@Param("profileId") Long profileId);
}

