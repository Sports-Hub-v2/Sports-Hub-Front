package com.sportshub.auth.web;

import com.sportshub.auth.domain.Account;
import com.sportshub.auth.service.AccountService;
import com.sportshub.auth.web.dto.AccountDtos.CreateRequest;
import com.sportshub.auth.web.dto.AccountDtos.Response;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AccountController {
    private final AccountService accountService;

    @PostMapping("/accounts")
    @ResponseStatus(HttpStatus.CREATED)
    public Response create(@Validated @RequestBody CreateRequest req) {
        Account created = accountService.create(req.getEmail(), req.getPassword(), req.getRole());
        return toResponse(created);
    }

    @GetMapping("/accounts/{id}")
    public Response getById(@PathVariable Long id) {
        return toResponse(accountService.getById(id));
    }

    @GetMapping("/accounts")
    public Response getByEmail(@RequestParam String email) {
        return toResponse(accountService.getByEmail(email));
    }

    private Response toResponse(Account a) {
        Response r = new Response();
        BeanUtils.copyProperties(a, r);
        return r;
    }
}

