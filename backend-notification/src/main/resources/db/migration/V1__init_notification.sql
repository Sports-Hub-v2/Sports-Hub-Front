CREATE TABLE IF NOT EXISTS notifications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    receiver_profile_id BIGINT NOT NULL,
    type VARCHAR(80) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    related_type VARCHAR(80),
    related_id BIGINT
);

CREATE INDEX idx_notifications_receiver ON notifications(receiver_profile_id);
CREATE INDEX idx_notifications_read_receiver ON notifications(is_read, receiver_profile_id);
