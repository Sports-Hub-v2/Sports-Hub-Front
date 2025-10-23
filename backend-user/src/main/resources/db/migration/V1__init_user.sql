CREATE TABLE IF NOT EXISTS profiles (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    account_id BIGINT NOT NULL UNIQUE,
    name VARCHAR(50),
    region VARCHAR(100),
    preferred_position VARCHAR(50),
    is_ex_player VARCHAR(50),
    phone_number VARCHAR(20),
    birth_date DATE,
    activity_start_date DATE,
    activity_end_date DATE,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE INDEX idx_profiles_region ON profiles(region);
