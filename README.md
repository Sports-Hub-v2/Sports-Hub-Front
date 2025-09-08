Sports Hub v2 (Structure-First)

This repository provides a clean, separated structure to migrate the existing sports-hub into independent backend services and a single frontend. Code will be migrated later from the original repo.

Layout
- frontend: React app (migrate later)
- backend-auth: Auth service (Spring Boot)
- backend-user: User profile service (Spring Boot)
- backend-team: Team and membership service (Spring Boot)
- backend-recruit: Recruit posts and applications (Spring Boot)
- backend-notification: Notification service (Spring Boot)
- infra/docker: Docker Compose orchestration and environment files

Getting Started
1) Copy infra/docker/.env.example to infra/docker/.env and adjust credentials.
2) From infra/docker, run: docker compose up -d --build
3) Access services:
   - Auth: http://localhost:8081
   - User: http://localhost:8082
   - Team: http://localhost:8083
   - Recruit: http://localhost:8084
   - Notification: http://localhost:8085

Notes
- These services are skeletons so Docker builds succeed; migrate code incrementally by domain.
- Initially use one MySQL database; later split schemas or databases if desired.
- A gateway (nginx/traefik or Spring Cloud Gateway) can be added later.

Dev seed data
- After services are up, you can seed sample data:
  - Windows (PowerShell): `./infra/seed/seed-dev.ps1`
  - macOS/Linux: `bash ./infra/seed/seed-dev.sh` (requires `jq`)
- Creates demo accounts (user1@, captain@, admin@) with passwords `Secret123!`, `Captain123!`, `Admin123!`, plus profiles, teams, memberships, notices, recruit posts, applications, and notifications.
