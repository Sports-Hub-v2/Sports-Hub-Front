CREATE TABLE IF NOT EXISTS recruit_posts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT NOT NULL,
    writer_profile_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    region VARCHAR(255),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    image_url VARCHAR(255),
    match_date DATE,
    category VARCHAR(255),
    target_type VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'OPEN'
);

CREATE INDEX idx_recruit_posts_team_id ON recruit_posts(team_id);
CREATE INDEX idx_recruit_posts_writer_profile_id ON recruit_posts(writer_profile_id);
CREATE INDEX idx_recruit_posts_status ON recruit_posts(status);

CREATE TABLE IF NOT EXISTS recruit_applications (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    post_id BIGINT NOT NULL,
    applicant_profile_id BIGINT NOT NULL,
    description TEXT,
    status VARCHAR(20) NOT NULL,
    application_date DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_recruit_applications_post FOREIGN KEY (post_id) REFERENCES recruit_posts(id) ON DELETE CASCADE
);

CREATE INDEX idx_recruit_applications_applicant_profile_id ON recruit_applications(applicant_profile_id);
CREATE INDEX idx_recruit_applications_status ON recruit_applications(status);
