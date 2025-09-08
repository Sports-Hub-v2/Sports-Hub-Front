package com.sportshub.user.service;

import com.sportshub.user.domain.Profile;
import com.sportshub.user.repository.ProfileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

@Service
@RequiredArgsConstructor
public class ProfileService {
    private final ProfileRepository profileRepository;

    @Transactional
    public Profile create(Profile p) {
        profileRepository.findByAccountId(p.getAccountId()).ifPresent(existing -> {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "profile already exists for account");
        });
        return profileRepository.save(p);
    }

    @Transactional(readOnly = true)
    public Profile get(Long id) {
        return profileRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "profile not found"));
    }

    @Transactional(readOnly = true)
    public Profile getByAccountId(Long accountId) {
        return profileRepository.findByAccountId(accountId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "profile not found"));
    }

    @Transactional
    public Profile update(Long id, Profile patch) {
        Profile p = profileRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "profile not found"));
        if (patch.getName() != null) p.setName(patch.getName());
        if (patch.getRegion() != null) p.setRegion(patch.getRegion());
        if (patch.getPreferredPosition() != null) p.setPreferredPosition(patch.getPreferredPosition());
        if (patch.getIsExPlayer() != null) p.setIsExPlayer(patch.getIsExPlayer());
        if (patch.getPhoneNumber() != null) p.setPhoneNumber(patch.getPhoneNumber());
        if (patch.getBirthDate() != null) p.setBirthDate(patch.getBirthDate());
        if (patch.getActivityStartDate() != null) p.setActivityStartDate(patch.getActivityStartDate());
        if (patch.getActivityEndDate() != null) p.setActivityEndDate(patch.getActivityEndDate());
        return profileRepository.save(p);
    }
}
