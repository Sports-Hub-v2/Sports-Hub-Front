package com.sportshub.notification.web;

import com.sportshub.notification.domain.Notification;
import com.sportshub.notification.service.NotificationService;
import com.sportshub.notification.web.dto.NotificationDtos.CreateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Notification create(@Valid @RequestBody CreateRequest req) {
        Notification n = new Notification();
        BeanUtils.copyProperties(req, n);
        return notificationService.create(n);
    }

    @GetMapping
    public List<Notification> list(@RequestParam Long receiverProfileId,
                                   @RequestParam(defaultValue = "false") boolean unreadOnly) {
        return notificationService.list(receiverProfileId, unreadOnly);
    }

    @PostMapping("/{id}/read")
    public Notification markRead(@PathVariable Long id) {
        return notificationService.markRead(id);
    }

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void delete(@PathVariable Long id) {
        notificationService.delete(id);
    }
}

