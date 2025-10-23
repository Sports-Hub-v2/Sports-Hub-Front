package com.sportshub.notification.repository;

import com.sportshub.notification.domain.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByReceiverProfileIdOrderByCreatedAtDesc(Long receiverProfileId);
    List<Notification> findByReceiverProfileIdAndIsReadFalseOrderByCreatedAtDesc(Long receiverProfileId);
}

