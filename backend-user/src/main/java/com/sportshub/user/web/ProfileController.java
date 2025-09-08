package com.sportshub.user.web;

import com.sportshub.user.domain.Profile;
import com.sportshub.user.service.ProfileService;
import com.sportshub.user.web.dto.ProfileDtos.CreateRequest;
import com.sportshub.user.web.dto.ProfileDtos.Response;
import com.sportshub.user.web.dto.ProfileDtos.UpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class ProfileController {
    private final ProfileService profileService;

    @PostMapping("/profiles")
    @ResponseStatus(HttpStatus.CREATED)
    public Response create(@Validated @RequestBody CreateRequest req) {
        Profile p = new Profile();
        BeanUtils.copyProperties(req, p);
        return toResponse(profileService.create(p));
    }

    @GetMapping("/profiles/{id}")
    public Response get(@PathVariable Long id) {
        return toResponse(profileService.get(id));
    }

    @GetMapping("/profiles/by-account/{accountId}")
    public Response getByAccount(@PathVariable Long accountId) {
        return toResponse(profileService.getByAccountId(accountId));
    }

    @PatchMapping("/profiles/{id}")
    public Response update(@PathVariable Long id, @RequestBody UpdateRequest req) {
        Profile patch = new Profile();
        BeanUtils.copyProperties(req, patch);
        return toResponse(profileService.update(id, patch));
    }

    private Response toResponse(Profile p) {
        Response r = new Response();
        BeanUtils.copyProperties(p, r);
        return r;
    }
}
