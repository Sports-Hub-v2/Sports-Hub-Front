Sports Hub v2 (마이크로서비스 아키텍처)

스포츠 팀 매칭 플랫폼의 마이크로서비스 구조 버전입니다. 기존 모놀리식 구조에서 도메인별 독립 서비스로 분리했습니다.

## 🏗️ 서비스 구조

### 백엔드 서비스들 (Spring Boot)

- **backend-auth** (8081) - 인증/OAuth/JWT 관리
- **backend-user** (8082) - 사용자 프로필 서비스
- **backend-team** (8083) - 팀/멤버십/공지 관리
- **backend-recruit** (8084) - 모집글/지원서 서비스
- **backend-notification** (8085) - 알림 서비스

### 프론트엔드

- **frontend** - React + TypeScript + Vite (포트 5173)
- Tailwind CSS 스타일링
- 백엔드 서비스들과 프록시 연동

### 인프라

- **infra/docker** - Docker Compose 오케스트레이션
- MySQL 데이터베이스 (서비스별 분리)
- Flyway 마이그레이션

## 🚀 시작하기

### 1. 환경설정

```bash
# .env 파일 생성
cp infra/docker/.env.example infra/docker/.env
# 필요한 경우 OAuth 클라이언트 ID/Secret 수정
```

### 2. 서비스 실행

```bash
cd infra/docker
docker compose up -d --build
```

### 3. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
```

### 4. 접속 확인

- **프론트엔드**: http://localhost:5173
- **Auth 서비스**: http://localhost:8081/ping
- **User 서비스**: http://localhost:8082/ping
- **Team 서비스**: http://localhost:8083/ping
- **Recruit 서비스**: http://localhost:8084/ping
- **Notification 서비스**: http://localhost:8085/ping

## 📊 현재 개발 상태

### ✅ 완료된 기능

- 인증 시스템 (로그인/OAuth/JWT)
- 사용자 프로필 관리 (계정/프로필 분리)
- 마이페이지 기본 기능

### 🚧 개발 중

- 팀 관리 기능
- 모집글/지원서 시스템
- 알림 서비스
- 프론트엔드 UI 연동

Dev seed data

- After services are up, you can seed sample data:
  - Windows (PowerShell): `./infra/seed/seed-dev.ps1`
  - macOS/Linux: `bash ./infra/seed/seed-dev.sh` (requires `jq`)
- Creates demo accounts (user1@, captain@, admin@) with passwords `Secret123!`, `Captain123!`, `Admin123!`, plus profiles, teams, memberships, notices, recruit posts, applications, and notifications.
