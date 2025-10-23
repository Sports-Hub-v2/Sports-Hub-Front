CREATE TABLE IF NOT EXISTS teams (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_name VARCHAR(100) NOT NULL,
    captain_profile_id BIGINT,
    region VARCHAR(100),
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    rival_teams TEXT,
    CONSTRAINT uq_teams_team_name UNIQUE (team_name)
);

CREATE TABLE IF NOT EXISTS team_memberships (
    team_id BIGINT NOT NULL,
    profile_id BIGINT NOT NULL,
    role_in_team VARCHAR(50) NOT NULL,
    joined_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    PRIMARY KEY (team_id, profile_id),
    CONSTRAINT fk_memberships_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);

CREATE INDEX idx_team_memberships_profile_id ON team_memberships(profile_id);

CREATE TABLE IF NOT EXISTS team_notices (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    team_id BIGINT NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_team_notices_team FOREIGN KEY (team_id) REFERENCES teams(id) ON DELETE CASCADE
);
