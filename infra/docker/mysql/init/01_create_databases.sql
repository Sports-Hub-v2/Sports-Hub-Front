-- Initialize service-specific databases and grant privileges to app user.
CREATE DATABASE IF NOT EXISTS auth_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS user_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS team_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS recruit_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE DATABASE IF NOT EXISTS notification_db CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

-- The user 'sportshub' is created by the official image when MYSQL_USER/MYSQL_PASSWORD are provided.
-- Grant access to all service DBs for that user.
GRANT ALL PRIVILEGES ON auth_db.* TO 'sportshub'@'%';
GRANT ALL PRIVILEGES ON user_db.* TO 'sportshub'@'%';
GRANT ALL PRIVILEGES ON team_db.* TO 'sportshub'@'%';
GRANT ALL PRIVILEGES ON recruit_db.* TO 'sportshub'@'%';
GRANT ALL PRIVILEGES ON notification_db.* TO 'sportshub'@'%';
FLUSH PRIVILEGES;

