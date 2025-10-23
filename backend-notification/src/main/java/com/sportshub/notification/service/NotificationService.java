package com.sportshub.notification.service;

import com.sportshub.notification.domain.Notification;
import com.sportshub.notification.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
@RequiredArgsConstructor
public class NotificationService {
    private final NotificationRepository notificationRepository;

    @Transactional
    public Notification create(Notification n) {
        n.setIsRead(Boolean.FALSE);
        return notificationRepository.save(n);
    }

    @Transactional(readOnly = true)
    public List<Notification> list(Long receiverProfileId, boolean unreadOnly) {
        if (unreadOnly) return notificationRepository.findByReceiverProfileIdAndIsReadFalseOrderByCreatedAtDesc(receiverProfileId);
        return notificationRepository.findByReceiverProfileIdOrderByCreatedAtDesc(receiverProfileId);
    }

    @Transactional
    public Notification markRead(Long id) {
        Notification n = notificationRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "notification not found"));
        n.setIsRead(Boolean.TRUE);
        return notificationRepository.save(n);
    }

    @Transactional
    public void delete(Long id) {
        if (!notificationRepository.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "notification not found");
        }
        notificationRepository.deleteById(id);
    }
}

