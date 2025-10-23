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

## 🚀 빠른 시작

### 🎯 자동 설치 (권장)

**Windows (PowerShell)**:

```powershell
# PowerShell 관리자 모드에서 실행
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
Invoke-WebRequest -Uri "https://raw.githubusercontent.com/Sports-Hub-v2/Sports-Hub-Front/main/setup.ps1" -OutFile "setup.ps1"
.\setup.ps1
```

**Linux/macOS**:

```bash
# 자동 설치 스크립트 다운로드 및 실행
curl -O https://raw.githubusercontent.com/Sports-Hub-v2/Sports-Hub-Front/main/setup.sh
chmod +x setup.sh
./setup.sh
```

### 🔧 수동 설치

개발자이거나 세부 설정이 필요한 경우:

#### 1. 모든 서비스 다운로드

```bash
# 각 마이크로서비스 클론
git clone https://github.com/Sports-Hub-v2/Sports-Hub-Backend-Auth.git backend-auth
git clone https://github.com/Sports-Hub-v2/Sports-Hub-Backend-User.git backend-user
git clone https://github.com/Sports-Hub-v2/Sports-Hub-Backend-Team.git backend-team
git clone https://github.com/Sports-Hub-v2/Sports-Hub-Backend-Recruit.git backend-recruit
git clone https://github.com/Sports-Hub-v2/Sports-Hub-Backend-Notification.git backend-notification
git clone https://github.com/Sports-Hub-v2/Sports-Hub-Infra.git infra
git clone https://github.com/Sports-Hub-v2/Sports-Hub-Front.git frontend
```

#### 2. 환경 설정

```bash
# 기본 설정 파일 복사
cp infra/docker/.env.example infra/docker/.env

# 자동 환경 설정 스크립트 (선택사항)
chmod +x configure.sh
./configure.sh
```

#### 3. 서비스 실행

```bash
# 백엔드 서비스들 실행
cd infra/docker
docker compose up -d --build

# 프론트엔드 실행 (별도 터미널)
cd ../../frontend
npm install
npm run dev
```

#### 4. 접속 확인

- **프론트엔드**: http://localhost:5173
- **Auth 서비스**: http://localhost:8081/ping
- **User 서비스**: http://localhost:8082/ping
- **Team 서비스**: http://localhost:8083/ping
- **Recruit 서비스**: http://localhost:8084/ping
- **Notification 서비스**: http://localhost:8085/ping

## 🛠️ 개발자 도구

### 인프라 관리 스크립트

```bash
# Windows (PowerShell)
./manage.ps1 [command]

# Linux/macOS
./manage.sh [command]
```

**사용 가능한 명령어:**

- `start` - 모든 서비스 시작
- `stop` - 모든 서비스 중지
- `restart` - 모든 서비스 재시작
- `status` - 서비스 상태 확인
- `logs` - 모든 서비스 로그 보기
- `reset` - 데이터베이스 초기화 (전체 리셋)
- `test-data` - 테스트 데이터 추가
- `clean` - Docker 리소스 정리

### 테스트 데이터 관리

```bash
# 테스트 데이터 추가 (Windows)
./add-test-data.ps1

# 테스트 데이터 추가 (Linux/macOS)
./add-test-data.sh
```

**포함된 테스트 데이터:**

- 강남구 아침 축구 용병 모집 (긴급)
- 홍대 새벽 축구 정기 멤버 모집
- 용산구 오늘 저녁 풋살 용병 모집
- 개인 용병 지원글

### 환경 설정 자동화

```bash
# 보안 강화된 환경 설정 자동 생성
./configure.sh
```

### 로그 확인

```bash
# 모든 서비스 로그
docker compose logs -f

# 특정 서비스 로그 (예: recruit-service)
docker compose logs -f recruit-service
```

### 데이터베이스 접속

```bash
# MySQL 컨테이너 접속
docker exec -it sportshub-mysql mysql -u sportshub -p

# 데이터베이스 목록 확인
SHOW DATABASES;
```

### 서비스 재시작

```bash
# 특정 서비스만 재시작
docker compose restart auth-service

# 전체 재시작
docker compose restart
```

## 🔧 시스템 요구사항

### 필수 소프트웨어

- **Docker**: 20.10 이상
- **Docker Compose**: 2.0 이상
- **Git**: 2.30 이상
- **Node.js**: 18 이상 (프론트엔드)

### 권장 사양

- **메모리**: 8GB 이상
- **디스크**: 10GB 이상 여유 공간
- **CPU**: 4코어 이상

### 네트워크 포트

- **3306**: MySQL 데이터베이스
- **5173**: 프론트엔드 (Vite 개발 서버)
- **8081-8085**: 백엔드 마이크로서비스들

## 📊 현재 개발 상태

### ✅ 완료된 기

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
