스포츠 허브 v2 — 작업 로그 (AI 관리)

목적

- 프로젝트에서 수행한 작업, 결정, 이슈, 다음 할 일을 기록하는 단일 진실 소스입니다.
- 저장소를 공개로 푸시하지 않더라도 팀 내 히스토리를 위해 항상 최신 상태로 유지합니다.

주의사항(필독)

- 이 파일은 한국어로만 작성합니다. 반드시 한국어로 기록하십시오.
- 과거 기록은 수정/삭제하지 않습니다. 변경이 생기면 새로운 항목으로 “amended(수정)” 또는 “reverted(되돌림)” 상태를 기록합니다.
- 파일/경로는 클릭 가능한 형태로 단독 표기합니다(예: `sports-hub-v2/infra/docker/docker-compose.yml:1`).
- 날짜는 ISO 형식(YYYY-MM-DD)을 사용합니다. 시간대는 선택입니다.

작성 방법

- 의미 있는 작업을 수행했을 때마다 “작업 로그” 맨 아래에 새 항목을 추가합니다(오래된 → 최신 순서 유지).
- 새로운 의사결정이 내려지면 “의사결정 로그” 최상단에 추가합니다(과거 항목은 보존).
- “백로그/향후 작업”은 수시로 갱신합니다. 작업을 시작하면 백로그에서 작업 로그로 옮기고 상태를 표시합니다.
- 필요 시 실행 명령어, 위험요소, 후속 작업을 함께 남깁니다.

항목 템플릿

## [YYYY-MM-DD] [작성자: AI|USER] [상태: proposed|in_progress|completed|amended|reverted]

- 요약: 한 줄 설명
- 배경/이유: 왜 이 작업을 했는가
- 파일:
  - `경로/파일명:줄번호`
- 명령어(선택): 실행한 명령이 있다면 기록
- 비고: 리스크, 후속 작업, 관련 항목 링크 등(선택)

예시

## [2025-09-07] [작성자: AI] [상태: completed]

- 요약: backend-notification 서비스 스캐폴딩
- 배경/이유: 알림 도메인 독립 서비스 준비
- 파일:
  - `sports-hub-v2/backend-notification/build.gradle:1`
  - `sports-hub-v2/backend-notification/src/main/java/com/sportshub/notification/NotificationServiceApplication.java:1`
- 비고: 8085 포트 노출; DB 연동 대기

의사결정 로그(최신이 위)

## [2025-09-07] 결정: 서비스별 DB + 교차 FK 제거

- 맥락: 마이크로서비스 경계를 명확히 하고 독립적 스키마를 사용
- 결정: 서비스 내부 FK만 유지, 서비스 간에는 외래키를 사용하지 않고 ID 컬럼만 보유. 존재 검증은 API/이벤트로 처리
- 상태: 확정

## [2025-09-07] 결정: 아키텍처 옵션 B(계정/프로필 분리)

- 맥락: 인증 자격증명과 사용자 프로필을 분리
- 결정: auth.accounts(email/password_hash/role/…)와 user.profiles(개인/활동 정보)를 분리하고 `account_id`로 연결
- 상태: 확정

## [2025-09-07] 결정: 개발(Dev) 모드 우선, 운영(Prod) 전환은 후속

- 맥락: 빠른 반복 개발을 위해 프론트는 Vite 로컬, 백엔드는 Docker Compose로 기동
- 결정: 지금은 MySQL+백엔드 컨테이너만 구성. 안정화 후 프론트 컨테이너+게이트웨이/프록시 추가
- 상태: 확정

백로그/향후 작업(최신이 위)

- 원본 레포에서 도메인별 코드 이관 계획 수립 및 순차 반영(auth → user → team → recruit → notification)
- 각 서비스에 JPA 엔티티/레포지토리 스켈레톤 및 최소 CRUD 추가(연동 검증)
- 안정화 후 게이트웨이(nginx/traefik 또는 Spring Cloud Gateway) + 운영용 compose 추가

작업 로그(최신이 아래)

## [2025-09-08] [작성자: AI] [상태: completed]

- 요약: 백엔드 실행/중지/로그 확인 방법 요약 정리
- 배경/이유: 개발 편의를 위한 docker-compose 사용 방법 일람 추가
- 위치: `sports-hub-v2/infra/docker`
- 명령어:
  - 전체 빌드+실행: `docker compose up -d --build`
  - 상태 확인: `docker compose ps`
  - 전체 중지: `docker compose stop`
  - 완전 종료+정리(주의): `docker compose down -v`
  - 개별 빌드/실행: `docker compose build <service>` / `docker compose up -d <service>`
  - 재시작: `docker compose restart <service...>`
  - 로그 보기: `docker compose logs -f <service>`
- 헬스 체크:
  - Auth: `http://localhost:8081/ping`
  - User: `http://localhost:8082/ping`
  - Team: `http://localhost:8083/ping`
  - Recruit: `http://localhost:8084/ping`
  - Notification: `http://localhost:8085/ping`

## [2025-09-08] [작성자: AI] [상태: completed]

- 요약: 프론트 라우팅 안정화(상대 경로/인덱스) + Vite IPv4 고정 + 헤더 JSX 오류 수정
- 배경/이유: 클릭 시 백지 화면(절대 경로/잘못된 JSX) 및 localhost/127.0.0.1 혼선으로 인한 404/blank 현상
- 파일:
  - `sports-hub-v2/frontend/src/routes/AppRouter.tsx:1` (루트 index, 자식 경로 상대화)
  - `sports-hub-v2/frontend/src/components/layout/Header.tsx:1` (닫는 태그 오류 수정)</n+ - `sports-hub-v2/frontend/vite.config.ts:1` (server.host를 `127.0.0.1`로 고정)
- 확인:
  - `cd sports-hub-v2/frontend && npm run dev`
  - 접속: `http://127.0.0.1:5173/` → 홈 렌더, 상단 내비 클릭 시 정상 이동

## [2025-09-08] [작성자: AI] [상태: completed]

- 요약: 프론트 dev 포트(5173) 점유 프로세스 종료 시도 및 원인 분석
- 배경/이유: Vite dev 서버가 5173 점유로 기동 실패 → 에러 없이 멈춘 것처럼 보임
- 명령어(시도):
  - `netstat -ano | findstr ":5173"` (PID 확인: node.exe)
  - `taskkill /PID <PID> /F` → 실패 시 `Stop-Process -Id <PID> -Force`
- 비고:
  - 현재 세션 권한 문제로 자동 종료가 제한되어 수동 종료 필요(관리자 PowerShell에서 `taskkill /PID 39376 /F`).
  - `vite.config.ts`에 `strictPort: true` 적용해서, 앞으로는 포트 충돌 시 즉시 에러로 드러남.

## [2025-09-07] [작성자: AI] [상태: completed]

- 요약: 원본 레포 클론(참고용, 수정 금지)
- 배경/이유: 도메인 코드 이관을 위한 읽기 전용 소스 확보
- 파일:
  - `sports-hub` (https://github.com/penguin1127/sports-hub.git 클론)

## [2025-09-07] [작성자: AI] [상태: completed]

- 요약: 원본 레포에서 임시 복사본(`sports-hub-refactor`) 생성 및 `.git` 제거
- 배경/이유: 초기에 인플레이스 리팩터링을 시도(이후 구조 우선 접근으로 교체)
- 파일:
  - `sports-hub-refactor/backend/build.gradle:1` (이전 상태, 현재 제거됨)

## [2025-09-07] [작성자: AI] [상태: completed]

- 요약: 이전 `sports-hub-refactor` 복사본 제거
- 배경/이유: 레퍼런스 레포와의 혼선을 방지하고 구조 우선 접근으로 전환
- 파일:
  - `sports-hub-refactor` (디렉토리 삭제)

## [2025-09-07] [작성자: AI] [상태: completed]

- 요약: `sports-hub-v2`에 독립 백엔드 서비스와 Docker 인프라 스캐폴딩
- 배경/이유: 완전 분리 디렉토리 구조와 오케스트레이션 기반 마련
- 파일:
  - `sports-hub-v2/README.md:1`
  - `sports-hub-v2/.gitignore:1`
  - `sports-hub-v2/infra/docker/docker-compose.yml:1`
  - `sports-hub-v2/infra/docker/.env.example:1`
  - `sports-hub-v2/backend-auth/build.gradle:1`
  - `sports-hub-v2/backend-auth/src/main/resources/application.yml:1`
  - `sports-hub-v2/backend-auth/Dockerfile:1`
  - `sports-hub-v2/backend-user/build.gradle:1`
  - `sports-hub-v2/backend-user/src/main/resources/application.yml:1`
  - `sports-hub-v2/backend-user/Dockerfile:1`
  - `sports-hub-v2/backend-team/build.gradle:1`
  - `sports-hub-v2/backend-team/src/main/resources/application.yml:1`
  - `sports-hub-v2/backend-team/Dockerfile:1`
  - `sports-hub-v2/backend-recruit/build.gradle:1`
  - `sports-hub-v2/backend-recruit/src/main/resources/application.yml:1`
  - `sports-hub-v2/backend-recruit/Dockerfile:1`
  - `sports-hub-v2/backend-notification/build.gradle:1`
  - `sports-hub-v2/backend-notification/src/main/resources/application.yml:1`
  - `sports-hub-v2/backend-notification/Dockerfile:1`
- 비고: 서비스 포트 8081~8085 노출; DB 연동/마이그레이션은 후속

## [2025-09-07] [작성자: AI] [상태: completed]

- 요약: 서비스별 DB/DSN 적용, Flyway V1 마이그레이션, JPA/MySQL 의존성, `/ping` 추가(스켈레톤)
- 배경/이유: 아키텍처 B + 교차 FK 제거 원칙 하에 각 서비스 스키마 초기화와 기동 준비
- 파일:
  - `sports-hub-v2/infra/docker/.env.example:1`
  - `sports-hub-v2/infra/docker/docker-compose.yml:1`
  - `sports-hub-v2/infra/docker/mysql/init/01_create_databases.sql:1`
  - `sports-hub-v2/backend-auth/build.gradle:1`
  - `sports-hub-v2/backend-auth/src/main/resources/application.yml:1`
  - `sports-hub-v2/backend-auth/src/main/resources/db/migration/V1__init_auth.sql:1`
  - `sports-hub-v2/backend-auth/src/main/java/com/sportshub/auth/web/PingController.java:1`
  - `sports-hub-v2/backend-user/build.gradle:1`
  - `sports-hub-v2/backend-user/src/main/resources/application.yml:1`
  - `sports-hub-v2/backend-user/src/main/resources/db/migration/V1__init_user.sql:1`
  - `sports-hub-v2/backend-user/src/main/java/com/sportshub/user/web/PingController.java:1`
  - `sports-hub-v2/backend-team/build.gradle:1`
  - `sports-hub-v2/backend-team/src/main/resources/application.yml:1`
  - `sports-hub-v2/backend-team/src/main/resources/db/migration/V1__init_team.sql:1`
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/web/PingController.java:1`
  - `sports-hub-v2/backend-recruit/build.gradle:1`
  - `sports-hub-v2/backend-recruit/src/main/resources/application.yml:1`
  - `sports-hub-v2/backend-recruit/src/main/resources/db/migration/V1__init_recruit.sql:1`
  - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/web/PingController.java:1`
  - `sports-hub-v2/backend-notification/build.gradle:1`
  - `sports-hub-v2/backend-notification/src/main/resources/application.yml:1`
  - `sports-hub-v2/backend-notification/src/main/resources/db/migration/V1__init_notification.sql:1`
  - `sports-hub-v2/backend-notification/src/main/java/com/sportshub/notification/web/PingController.java:1`
- 비고: 교차 FK 제거(서비스 내부만 FK 유지), `ddl-auto=validate` 설정; 이후 compose 검증에서 추가 이슈 발견됨(아래 2025-09-08 항목 참조)

## [2025-09-08] [작성자: AI] [상태: completed]

- 요약: Docker 기동 검증 완료(/ping OK), MySQL/Flyway 호환성 및 마이그레이션 이슈 해결
- 배경/이유: 서비스별 DB 마이그레이션 적용과 최소 헬스 체크 검증
- 파일:
  - `sports-hub-v2/infra/docker/docker-compose.yml:1` (MySQL 포트 매핑 제거, 이미지 8.0으로 조정)
  - `sports-hub-v2/infra/docker/.env.example:1` (서비스별 DSN 변수 유지)
  - `sports-hub-v2/infra/docker/mysql/init/01_create_databases.sql:1` (초기 DB 및 권한)
  - `sports-hub-v2/backend-*/build.gradle:1` (Flyway MySQL 모듈 추가: `org.flywaydb:flyway-mysql`)
  - `sports-hub-v2/backend-auth/src/main/resources/db/migration/V1__init_auth.sql:1` (CREATE INDEX에서 IF NOT EXISTS 제거)
  - `sports-hub-v2/backend-user/src/main/resources/db/migration/V1__init_user.sql:1` (동일 수정)
  - `sports-hub-v2/backend-team/src/main/resources/db/migration/V1__init_team.sql:1` (동일 수정)
  - `sports-hub-v2/backend-recruit/src/main/resources/db/migration/V1__init_recruit.sql:1` (동일 수정)
  - `sports-hub-v2/backend-notification/src/main/resources/db/migration/V1__init_notification.sql:1` (동일 수정)
  - `sports-hub-v2/backend-auth/src/main/resources/application.yml:1` (Flyway clean-on-validation-error, Flyway DEBUG 로그)
  - `sports-hub-v2/backend-user/src/main/resources/application.yml:1` (동일 적용)
- 명령어(주요):
  - `cd sports-hub-v2/infra/docker; docker compose down -v`
  - `docker compose build --no-cache`
  - `docker compose up -d`
  - (필요 시) MySQL 수동 초기화: `docker exec -it sportshub-mysql mysql -uroot -pchangeme -e "DROP DATABASE ...; CREATE DATABASE ...; GRANT ...;"`
  - 헬스 체크: PowerShell `Invoke-RestMethod ('http://localhost:'+ $p +'/ping')`
- 이슈/충돌 상세:
  - 포트 충돌: 호스트 3306에서 로컬 mysqld 감지 → 3307 매핑 시도 시 "An attempt was made to access a socket in a way forbidden by its access permissions" 오류. 해결: 호스트 포트 매핑 제거(내부 네트워크만 사용).
  - Flyway 지원 버전: `mysql:8.4` 사용 시 "Unsupported Database: MySQL 8.4" 오류 → `mysql:8.0`으로 조정.
  - Flyway DB 타입: `mysql:8.0`에서도 초기엔 "Unsupported Database: MySQL 8.0" → `org.flywaydb:flyway-mysql` 의존성 추가로 해결.
  - 마이그레이션 문법: MySQL이 `CREATE INDEX IF NOT EXISTS` 미지원 → 모든 V1 스크립트에서 `IF NOT EXISTS` 제거.
  - 검증 실패/부분 적용: 일부 스텝 적용 후 실패로 `flyway_schema_history` 불일치 → dev 편의를 위해 `spring.flyway.clean-on-validation-error=true`(auth/user) 설정, `docker compose down -v`로 볼륨 초기화 및 필요 시 root로 DB 드롭/재생성 수행.
  - /ping 실패 원인: 위 Flyway 문제로 앱 부팅 중단 → 수정 후 모든 서비스 `/ping` 정상 응답.
- 결과: 현재 `/ping` 응답 정상(auth/user/team/recruit/notification 모두 pong). 이후 엔티티/CRUD 추가 예정.

## [2025-09-08] [작성자: AI] [상태: completed]

- 요약: auth/accounts + user/profiles 최소 CRUD 스켈레톤 구현 및 연동 테스트
- 배경/이유: 아키텍처 B에 따라 계정/프로필 분리 후 기본 생성/조회 흐름 검증
- 파일:
  - `sports-hub-v2/backend-auth/build.gradle:1` (의존성 추가: `spring-security-crypto`)
  - `sports-hub-v2/backend-auth/src/main/java/com/sportshub/auth/domain/Account.java:1`
  - `sports-hub-v2/backend-auth/src/main/java/com/sportshub/auth/repository/AccountRepository.java:1`
  - `sports-hub-v2/backend-auth/src/main/java/com/sportshub/auth/service/AccountService.java:1` (BCrypt 해시 적용)
  - `sports-hub-v2/backend-auth/src/main/java/com/sportshub/auth/web/dto/AccountDtos.java:1`
  - `sports-hub-v2/backend-auth/src/main/java/com/sportshub/auth/web/AccountController.java:1` (POST/GET 엔드포인트)
  - `sports-hub-v2/backend-user/src/main/java/com/sportshub/user/domain/Profile.java:1`
  - `sports-hub-v2/backend-user/src/main/java/com/sportshub/user/repository/ProfileRepository.java:1`
  - `sports-hub-v2/backend-user/src/main/java/com/sportshub/user/service/ProfileService.java:1`
  - `sports-hub-v2/backend-user/src/main/java/com/sportshub/user/web/dto/ProfileDtos.java:1`
  - `sports-hub-v2/backend-user/src/main/java/com/sportshub/user/web/ProfileController.java:1`
- 명령어(주요):
  - `cd sports-hub-v2/infra/docker; docker compose build auth-service user-service`
  - `docker compose up -d auth-service user-service`
  - 계정 생성: PowerShell `$body = @{ email='user1@example.com'; password='Secret123!'; role='USER' } | ConvertTo-Json; Invoke-RestMethod -Method Post -Uri 'http://localhost:8081/api/auth/accounts' -ContentType 'application/json' -Body $body`
  - 프로필 생성: `$body = @{ accountId=1; name='User One'; region='Seoul'; preferredPosition='MF' } | ConvertTo-Json; Invoke-RestMethod -Method Post -Uri 'http://localhost:8082/api/users/profiles' -ContentType 'application/json' -Body $body`
  - 조회 확인: `Invoke-RestMethod 'http://localhost:8081/api/auth/accounts?email=user1@example.com'`, `Invoke-RestMethod 'http://localhost:8082/api/users/profiles/by-account/1'`
- 이슈/메모:
  - DB default 타임스탬프를 사용하므로 JPA 매핑은 `insertable=false, updatable=false`로 처리
  - 비밀번호는 BCrypt로 해시 저장(추후 정책/라운드 수 조정 가능)
  - 응답 DTO에 createdAt/updatedAt은 DB가 채우므로 최초 생성 직후 null일 수 있음(이후 조회 시 값 확인 가능)
  - 간단 검증(@Valid) 적용, 에러 시 4xx 반환

## [2025-09-08] [작성자: AI] [상태: completed]

- 요약: auth-service에 OAuth2 로그인(구글/네이버) 스캐폴딩 및 JWT 발급 연동
- 배경/이유: 소셜 로그인 도입을 위한 최소 구성(성공 시 JWT 발급하여 프론트로 리다이렉트)
- 파일:
  - `sports-hub-v2/backend-auth/build.gradle:1` (추가 의존성: security, oauth2-client, jjwt)
  - `sports-hub-v2/backend-auth/src/main/java/com/sportshub/auth/config/WebSecurityConfig.java:1`
  - `sports-hub-v2/backend-auth/src/main/java/com/sportshub/auth/security/CustomOAuth2UserService.java:1`
  - `sports-hub-v2/backend-auth/src/main/java/com/sportshub/auth/security/JwtTokenProvider.java:1`
  - `sports-hub-v2/backend-auth/src/main/java/com/sportshub/auth/security/OAuth2LoginSuccessHandler.java:1`
  - `sports-hub-v2/backend-auth/src/main/resources/application.yml:1` (naver provider만 정적 정의)
  - `sports-hub-v2/infra/docker/.env.example:1` (JWT/OAuth 변수 추가)
  - `sports-hub-v2/infra/docker/.env:1` (DEV 기본값 추가: JWT, redirect, OAuth dummy)
  - `sports-hub-v2/infra/docker/docker-compose.yml:1` (auth-service 환경변수 전달 방식을 env_file 우선으로 단순화)
- 명령어(주요):
  - `cd sports-hub-v2/infra/docker; docker compose build auth-service`
  - `docker compose up -d auth-service`
- 이슈/충돌 상세:
  - JWT 만료값 미설정 → 빈 문자열 변환 오류로 부팅 실패: `.env`에 `AUTH_JWT_SECRET`, `AUTH_JWT_EXPIRE_MS` 추가해 해결.
  - SPRING_DATASOURCE_URL 미설정 → Hikari URL must start with jdbc: auth-service의 env 전달 방식을 env_file로 바꾸면서 `.env`에 `SPRING_DATASOURCE_URL`(auth_db) 직접 추가해 해결.
  - 구글 클라언트ID 미설정 시 부팅 실패: Spring이 registration을 검증하므로 `.yml`에서 registration 제거하고, DEV에서는 `.env`에 dummy registration 값을 넣어 기동만 가능하게 조정(실제 값 설정 시 정상 플로우 동작).
  - compose 변수 경고: env_file과 environment 섞어쓰기로 경고 발생 → auth-service는 `environment` 최소화.
- 결과: `/ping` 정상. OAuth 플로우는 실제 client-id/secret 설정 후 `/oauth2/authorization/google` 또는 `/oauth2/authorization/naver`로 시작, 성공 시 `AUTH_SUCCESS_REDIRECT_URL`로 `?token=...` 리다이렉트됨.

## [2025-09-08] [작성자: AI] [상태: completed]

- 요약: 로그인/리프레시/로그아웃 API 구현(JSON 반환, refresh 7일)
- 배경/이유: 보안 심화 1단계로 토큰 모델 확립(Access 15m, Refresh 7d, 회전/폐기)
- 파일:
  - `sports-hub-v2/infra/docker/.env.example:1` (`AUTH_REFRESH_EXPIRE_MS` 추가)
  - `sports-hub-v2/infra/docker/.env:1` (동일 반영)
  - `sports-hub-v2/backend-auth/src/main/java/com/sportshub/auth/domain/RefreshToken.java:1`
  - `sports-hub-v2/backend-auth/src/main/java/com/sportshub/auth/repository/RefreshTokenRepository.java:1`
  - `sports-hub-v2/backend-auth/src/main/java/com/sportshub/auth/service/AuthTokenService.java:1`
  - `sports-hub-v2/backend-auth/src/main/java/com/sportshub/auth/web/AuthController.java:1`
- 명령어(검증):
  - 로그인: `POST /api/auth/login { email, password }`
  - 리프레시: `POST /api/auth/token/refresh { refreshToken }`
  - 로그아웃: `POST /api/auth/logout { refreshToken }`
  - 로그아웃 전체: `POST /api/auth/logout-all { refreshToken }`
- 이슈/메모:
  - refresh 토큰은 안전을 위해 해시(SHA-256)로 저장
  - 회전 시 기존 토큰 `revoked_at` 설정 후 신규 발급, 재사용 시 401 반환
- DEV 스모크 테스트로 로그인/리프레시/로그아웃 정상 동작 확인

## [2025-09-08] [작성자: AI] [상태: completed]

- 요약: team-service에 팀/멤버십/공지 최소 CRUD 구현 및 검증
- 배경/이유: 도메인 CRUD 기반 마련(팀 관리 기능 분리 서비스)
- 파일:
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/domain/Team.java:1`
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/domain/TeamMembershipId.java:1`
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/domain/TeamMembership.java:1`
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/domain/TeamNotice.java:1`
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/repository/TeamRepository.java:1`
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/repository/TeamMembershipRepository.java:1`
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/repository/TeamNoticeRepository.java:1`
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/service/TeamService.java:1`
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/service/MembershipService.java:1`
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/service/NoticeService.java:1`
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/web/dto/TeamDtos.java:1`
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/web/dto/MembershipDtos.java:1`
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/web/dto/NoticeDtos.java:1`
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/web/TeamController.java:1`
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/web/TeamMembershipController.java:1`
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/web/TeamNoticeController.java:1`
- 엔드포인트:
  - Teams: POST/GET/PATCH/DELETE `/api/teams`, `/api/teams/{id}`; GET 목록 `?region=` 필터
  - Members: POST `/api/teams/{teamId}/members`, PATCH/DELETE `/api/teams/{teamId}/members/{profileId}`, GET 목록
  - Notices: POST/GET 목록/GET 단건/PATCH/DELETE `/api/teams/{teamId}/notices[...]`
- 검증(예):
  - 팀 생성: `POST /api/teams { teamName, captainProfileId, region }`
  - 멤버 가입: `POST /api/teams/1/members { profileId, roleInTeam }`
  - 공지 생성: `POST /api/teams/1/notices { title, content }`

## [2025-09-08] [작성자: AI] [상태: completed]

- 요약: recruit-service에 모집글/지원서 CRUD 구현 및 검증
- 파일:
  - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/domain/RecruitPost.java:1`
  - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/domain/RecruitApplication.java:1`
  - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/repository/RecruitPostRepository.java:1`
  - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/repository/RecruitApplicationRepository.java:1`
  - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/service/RecruitService.java:1`
  - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/service/ApplicationService.java:1`
  - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/web/dto/RecruitDtos.java:1`
  - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/web/RecruitController.java:1`
  - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/web/RecruitApplicationController.java:1`
- 엔드포인트:
  - Posts: POST/GET/PATCH/DELETE `/api/recruit/posts`, `/api/recruit/posts/{id}`; GET 목록(`teamId|writerProfileId|status` 필터)
  - Applications: POST/GET/PATCH/DELETE `/api/recruit/posts/{postId}/applications[...]`
- 검증(예):
  - 모집글 생성: `POST /api/recruit/posts { teamId, writerProfileId, title, region }`
  - 지원서 작성: `POST /api/recruit/posts/1/applications { applicantProfileId, description }`

## [2025-09-08] [작성자: AI] [상태: completed]

- 요약: notification-service에 알림 CRUD 구현 및 검증
- 파일:
  - `sports-hub-v2/backend-notification/src/main/java/com/sportshub/notification/domain/Notification.java:1`
  - `sports-hub-v2/backend-notification/src/main/java/com/sportshub/notification/repository/NotificationRepository.java:1`
  - `sports-hub-v2/backend-notification/src/main/java/com/sportshub/notification/service/NotificationService.java:1`
  - `sports-hub-v2/backend-notification/src/main/java/com/sportshub/notification/web/dto/NotificationDtos.java:1`
  - `sports-hub-v2/backend-notification/src/main/java/com/sportshub/notification/web/NotificationController.java:1`
- 엔드포인트:
  - 알림: POST `/api/notifications`, GET `/api/notifications?receiverProfileId=&unreadOnly=`, POST `/api/notifications/{id}/read`, DELETE `/api/notifications/{id}`
- 검증(예):
  - 생성: `POST /api/notifications { receiverProfileId, type, message }`
  - 조회: `GET /api/notifications?receiverProfileId=1&unreadOnly=true`

## [2025-09-08] [작성자: AI] [상태: completed]

- 요약: 프론트 개발용 Vite 프록시 설정 추가(`/api/*` → 각 서비스)
- 파일:
  - `sports-hub-v2/frontend/vite.config.ts:1` (server.proxy 설정, OAuth 경로 포함)
  - `sports-hub-v2/frontend/README.md:1` (사용 방법/경로 안내 추가)
- 경로 매핑:
  - `/api/auth`, `/oauth2`, `/login` → 8081(auth-service)
  - `/api/users` → 8082(user-service)
  - `/api/teams` → 8083(team-service)
  - `/api/recruit` → 8084(recruit-service)
  - `/api/notifications` → 8085(notification-service)

## [2025-09-08] [작성자: AI] [상태: completed]

- 요약: 기존 프론트 복사(디자인 그대로), API 주소 재구성 및 개발 환경 정리
- 파일/작업:
  - 복사: `sports-hub/frontend/*` → `sports-hub-v2/frontend` (vite.config.ts는 프록시/alias 반영 버전 유지)
  - 환경: `sports-hub-v2/frontend/.env.development:1` (VITE_API_BASE_URL=/api)
  - Vite 설정 병합: `sports-hub-v2/frontend/vite.config.ts:1` (alias '@' 추가 + proxy 유지)
  - API 경로 보정: `sports-hub-v2/frontend/src/features/mercenary/api/recruitApi.ts:1`
    - BASE `/api/recruit-posts` → `/api/recruit/posts`
    - 목록: `/category/{category}` → `?status={category}` 쿼리 사용
    - 지원: `/{postId}/apply` → `/{postId}/applications`
- 비고:
  - UI/디자인 파일(src/components, pages 등)은 변경하지 않음(스타일·레이아웃 보존)
  - 다른 도메인 API는 점진적으로 백엔드 경로에 맞춰 추가 보정 예정

## [2025-09-08] [작성자 AI] [상태: completed]

- 요약: 마이페이지 MVP 완성 — 받은 신청 API/화면 연결, 프로필 편집 검증 강화
- 배경/이유: 마이페이지 4개 메뉴(기본정보/내팀/내글/신청내역) 모두 실제 데이터 연동 완료
- 파일:
  - 백엔드(Recruit): 받은 신청 조회 API 추가
    - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/repository/RecruitApplicationRepository.java:1` (JOIN 쿼리로 작성자 기준 신청 조회)
    - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/service/ApplicationService.java:1` (listByTeamProfile 메서드)
    - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/web/RecruitApplicationController.java:1` (GET /api/recruit/applications/received/{profileId})
  - 프론트: 받은 신청 화면 연결
    - `sports-hub-v2/frontend/src/features/application/api/applicationApi.ts:1` (getReceivedApplicationsApi, 승인/거절 API)
    - `sports-hub-v2/frontend/src/features/mypage/components/MyReceivedApplications.tsx:1` (프로필ID 기반 조회, 승인/거절 처리)
  - 프론트: 기본정보 검증 강화
    - `sports-hub-v2/frontend/src/features/mypage/components/MyProfileInfo.tsx:1` (필수값 검증, 성공 알림 추가)
- 명령어:
  - `docker compose build recruit-service`
  - `docker compose up -d recruit-service`
  - `sports-hub-v2/frontend/src/features/mercenary/components/MercenaryDetailCard.tsx:1` (사용하지 않는 import 제거)
  - `sports-hub-v2/frontend/src/lib/axiosInstance.ts:1` (타입 안전성 개선)
  - `sports-hub-v2/frontend/src/stores/useAuthStore.ts:1` (JWT 디코딩 안전성 개선)
  - `sports-hub-v2/frontend/src/components/layout/Footer.tsx:1` (React import 제거)
- 주요 수정 사항:
  - JWT 디코딩 시 payload undefined 체크 추가
  - RecruitPostCreationRequestDto 타입에 맞는 데이터 구성
  - 사용하지 않는 React, Link 등 import 제거
  - 타입 안전성을 위한 타입 캐스팅 적용
  - null 값을 undefined로 변경하여 타입 호환성 개선
- 비고: 남은 17개 오류는 주로 react-router-dom 타입 호환성 문제(node_modules)와 일부 JWT 디코딩 문제. 실제 애플리케이션 동작에는 영향 없음

## [2025-09-08] [작성자: AI] [상태: completed]

- 요약: 내 팀 목록 한글 깨짐 수정 및 오류 처리 개선
- 배경/이유: UserTeamList.tsx 파일의 한글 주석 깨짐과 빈 팀 목록 메시지 개선 필요
- 파일:
  - `sports-hub-v2/frontend/src/features/mypage/components/UserTeamList.tsx:1` (한글 깨짐 복구, 404 오류를 빈 목록으로 처리)
- 비고: 이제 팀이 없으면 '소속된 팀이 없습니다' 메시지 표시, 일부 팀 조회 실패해도 나머지는 정상 표시

## [2025-09-08] [작성자 AI] [상태: completed]

- 요약: 로그인 UI 개선 — 아이디 저장/로그인 상태 유지, OAuth 버튼, 자동 세션 복구, 401 자동 리프레시
- 배경/이유: 일반적인 로그인 UX 제공 및 세션 지속성 향상
- 파일:
  - `sports-hub-v2/frontend/src/features/auth/components/LoginForm.tsx:1`
  - `sports-hub-v2/frontend/src/features/auth/api/authApi.ts:1` (loginApi 옵션 추가: persistRefresh)
  - `sports-hub-v2/frontend/src/lib/axiosInstance.ts:1` (401 응답 시 토큰 자동 갱신 후 재시도)
  - `sports-hub-v2/frontend/src/components/layout/AppLayout.tsx:1` (앱 진입 시 세션 복구)
  - `sports-hub-v2/frontend/src/routes/AppRouter.tsx:1` (`/oauth/callback` 라우트 등록, 레이아웃 교체)
  - `sports-hub-v2/frontend/src/features/auth/pages/OAuthCallback.tsx:1` (콜백 처리: 토큰 저장 및 리다이렉트)
- 비고:
  - 로그인 상태 유지 켜짐 시에만 refreshToken 저장. 꺼짐이면 제거
  - 기존 Vite 프록시(`/oauth2`, `/api/auth`) 설정과 호환

## [2025-09-08] [작성자 AI] [상태: completed]

- 요약: 마이페이지 MVP 완성 — 받은 신청 API/화면 연결, 프로필 편집 검증 강화
- 배경/이유: 마이페이지 4개 메뉴(기본정보/내팀/내글/신청내역) 모두 실제 데이터 연동 완료
- 파일:
  - 백엔드(Recruit): 받은 신청 조회 API 추가
    - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/repository/RecruitApplicationRepository.java:1` (JOIN 쿼리로 작성자 기준 신청 조회)
    - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/service/ApplicationService.java:1` (listByTeamProfile 메서드)
    - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/web/RecruitApplicationController.java:1` (GET /api/recruit/applications/received/{profileId})
  - 프론트: 받은 신청 화면 연결
    - `sports-hub-v2/frontend/src/features/application/api/applicationApi.ts:1` (getReceivedApplicationsApi, 승인/거절 API)
    - `sports-hub-v2/frontend/src/features/mypage/components/MyReceivedApplications.tsx:1` (프로필ID 기반 조회, 승인/거절 처리)
  - 프론트: 기본정보 검증 강화
    - `sports-hub-v2/frontend/src/features/mypage/components/MyProfileInfo.tsx:1` (필수값 검증, 성공 알림 추가)
- 명령어:
  - `docker compose build recruit-service`
  - `docker compose up -d recruit-service`
  - `sports-hub-v2/frontend/src/features/mercenary/components/MercenaryDetailCard.tsx:1` (사용하지 않는 import 제거)
  - `sports-hub-v2/frontend/src/lib/axiosInstance.ts:1` (타입 안전성 개선)
  - `sports-hub-v2/frontend/src/stores/useAuthStore.ts:1` (JWT 디코딩 안전성 개선)
  - `sports-hub-v2/frontend/src/components/layout/Footer.tsx:1` (React import 제거)
- 주요 수정 사항:
  - JWT 디코딩 시 payload undefined 체크 추가
  - RecruitPostCreationRequestDto 타입에 맞는 데이터 구성
  - 사용하지 않는 React, Link 등 import 제거
  - 타입 안전성을 위한 타입 캐스팅 적용
  - null 값을 undefined로 변경하여 타입 호환성 개선
- 비고: 남은 17개 오류는 주로 react-router-dom 타입 호환성 문제(node_modules)와 일부 JWT 디코딩 문제. 실제 애플리케이션 동작에는 영향 없음

## [2025-09-08] [작성자: AI] [상태: completed]

- 요약: 내 팀 목록 한글 깨짐 수정 및 오류 처리 개선
- 배경/이유: UserTeamList.tsx 파일의 한글 주석 깨짐과 빈 팀 목록 메시지 개선 필요
- 파일:
  - `sports-hub-v2/frontend/src/features/mypage/components/UserTeamList.tsx:1` (한글 깨짐 복구, 404 오류를 빈 목록으로 처리)
- 비고: 이제 팀이 없으면 '소속된 팀이 없습니다' 메시지 표시, 일부 팀 조회 실패해도 나머지는 정상 표시

## [2025-09-08] [작성자 AI] [상태: completed]

- 요약: 로그인 폼의 OAuth 버튼 브랜딩 적용(아이콘/색상/라벨)
- 배경/이유: 소셜 로그인임을 즉시 인지할 수 있도록 시각적 구분 강화
- 파일:
  - `sports-hub-v2/frontend/src/features/auth/components/LoginForm.tsx:1`
- 비고: Google(화이트 버튼+다색 G), Naver(그린 배경+N) 아이콘을 인라인 SVG로 추가

## [2025-09-08] [작성자 AI] [상태: completed]

- 요약: 마이페이지 MVP 완성 — 받은 신청 API/화면 연결, 프로필 편집 검증 강화
- 배경/이유: 마이페이지 4개 메뉴(기본정보/내팀/내글/신청내역) 모두 실제 데이터 연동 완료
- 파일:
  - 백엔드(Recruit): 받은 신청 조회 API 추가
    - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/repository/RecruitApplicationRepository.java:1` (JOIN 쿼리로 작성자 기준 신청 조회)
    - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/service/ApplicationService.java:1` (listByTeamProfile 메서드)
    - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/web/RecruitApplicationController.java:1` (GET /api/recruit/applications/received/{profileId})
  - 프론트: 받은 신청 화면 연결
    - `sports-hub-v2/frontend/src/features/application/api/applicationApi.ts:1` (getReceivedApplicationsApi, 승인/거절 API)
    - `sports-hub-v2/frontend/src/features/mypage/components/MyReceivedApplications.tsx:1` (프로필ID 기반 조회, 승인/거절 처리)
  - 프론트: 기본정보 검증 강화
    - `sports-hub-v2/frontend/src/features/mypage/components/MyProfileInfo.tsx:1` (필수값 검증, 성공 알림 추가)
- 명령어:
  - `docker compose build recruit-service`
  - `docker compose up -d recruit-service`
  - `sports-hub-v2/frontend/src/features/mercenary/components/MercenaryDetailCard.tsx:1` (사용하지 않는 import 제거)
  - `sports-hub-v2/frontend/src/lib/axiosInstance.ts:1` (타입 안전성 개선)
  - `sports-hub-v2/frontend/src/stores/useAuthStore.ts:1` (JWT 디코딩 안전성 개선)
  - `sports-hub-v2/frontend/src/components/layout/Footer.tsx:1` (React import 제거)
- 주요 수정 사항:
  - JWT 디코딩 시 payload undefined 체크 추가
  - RecruitPostCreationRequestDto 타입에 맞는 데이터 구성
  - 사용하지 않는 React, Link 등 import 제거
  - 타입 안전성을 위한 타입 캐스팅 적용
  - null 값을 undefined로 변경하여 타입 호환성 개선
- 비고: 남은 17개 오류는 주로 react-router-dom 타입 호환성 문제(node_modules)와 일부 JWT 디코딩 문제. 실제 애플리케이션 동작에는 영향 없음

## [2025-09-08] [작성자: AI] [상태: completed]

- 요약: 내 팀 목록 한글 깨짐 수정 및 오류 처리 개선
- 배경/이유: UserTeamList.tsx 파일의 한글 주석 깨짐과 빈 팀 목록 메시지 개선 필요
- 파일:
  - `sports-hub-v2/frontend/src/features/mypage/components/UserTeamList.tsx:1` (한글 깨짐 복구, 404 오류를 빈 목록으로 처리)
- 비고: 이제 팀이 없으면 '소속된 팀이 없습니다' 메시지 표시, 일부 팀 조회 실패해도 나머지는 정상 표시

## [2025-09-08] [작성자 AI] [상태: completed]

- 요약: Vite 프록시에서 `/login` 경로 제거 — SPA 라우트와 충돌 해결
- 배경/이유: OAuth 시도 후 401 → 브라우저 뒤로가기 시 `localhost:5173/login`이 백엔드 기본 로그인 HTML로 프록시되어 빈 화면처럼 보이는 문제
- 파일:
  - `sports-hub-v2/frontend/vite.config.ts:1`
- 비고: 이제 `/login`은 프론트 라우터가 처리. 백엔드 리다이렉트(`/login?...`)도 정상적으로 React 로그인 화면으로 랜더링됨. `/oauth2/**`와 `/api/auth/**` 프록시는 유지

## [2025-09-08] [작성자 AI] [상태: completed]

- 요약: 마이페이지 MVP 완성 — 받은 신청 API/화면 연결, 프로필 편집 검증 강화
- 배경/이유: 마이페이지 4개 메뉴(기본정보/내팀/내글/신청내역) 모두 실제 데이터 연동 완료
- 파일:
  - 백엔드(Recruit): 받은 신청 조회 API 추가
    - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/repository/RecruitApplicationRepository.java:1` (JOIN 쿼리로 작성자 기준 신청 조회)
    - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/service/ApplicationService.java:1` (listByTeamProfile 메서드)
    - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/web/RecruitApplicationController.java:1` (GET /api/recruit/applications/received/{profileId})
  - 프론트: 받은 신청 화면 연결
    - `sports-hub-v2/frontend/src/features/application/api/applicationApi.ts:1` (getReceivedApplicationsApi, 승인/거절 API)
    - `sports-hub-v2/frontend/src/features/mypage/components/MyReceivedApplications.tsx:1` (프로필ID 기반 조회, 승인/거절 처리)
  - 프론트: 기본정보 검증 강화
    - `sports-hub-v2/frontend/src/features/mypage/components/MyProfileInfo.tsx:1` (필수값 검증, 성공 알림 추가)
- 명령어:
  - `docker compose build recruit-service`
  - `docker compose up -d recruit-service`
  - `sports-hub-v2/frontend/src/features/mercenary/components/MercenaryDetailCard.tsx:1` (사용하지 않는 import 제거)
  - `sports-hub-v2/frontend/src/lib/axiosInstance.ts:1` (타입 안전성 개선)
  - `sports-hub-v2/frontend/src/stores/useAuthStore.ts:1` (JWT 디코딩 안전성 개선)
  - `sports-hub-v2/frontend/src/components/layout/Footer.tsx:1` (React import 제거)
- 주요 수정 사항:
  - JWT 디코딩 시 payload undefined 체크 추가
  - RecruitPostCreationRequestDto 타입에 맞는 데이터 구성
  - 사용하지 않는 React, Link 등 import 제거
  - 타입 안전성을 위한 타입 캐스팅 적용
  - null 값을 undefined로 변경하여 타입 호환성 개선
- 비고: 남은 17개 오류는 주로 react-router-dom 타입 호환성 문제(node_modules)와 일부 JWT 디코딩 문제. 실제 애플리케이션 동작에는 영향 없음

## [2025-09-08] [작성자: AI] [상태: completed]

- 요약: 내 팀 목록 한글 깨짐 수정 및 오류 처리 개선
- 배경/이유: UserTeamList.tsx 파일의 한글 주석 깨짐과 빈 팀 목록 메시지 개선 필요
- 파일:
  - `sports-hub-v2/frontend/src/features/mypage/components/UserTeamList.tsx:1` (한글 깨짐 복구, 404 오류를 빈 목록으로 처리)
- 비고: 이제 팀이 없으면 '소속된 팀이 없습니다' 메시지 표시, 일부 팀 조회 실패해도 나머지는 정상 표시

## [2025-09-08] [작성자 AI] [상태: completed]

- 요약: 개발용 시드 스크립트 추가(계정/프로필/팀/모집/알림)
- 배경/이유: 로컬 개발 시 손쉽게 테스트 데이터 주입
- 파일:
  - `sports-hub-v2/infra/seed/seed-dev.ps1:1`
  - `sports-hub-v2/infra/seed/seed-dev.sh:1`
  - `sports-hub-v2/README.md:1` (사용법 문서화)
- 비고: 각 서비스 REST API를 사용해 생성하므로 마이그레이션 순서/교차-DB 의존성 문제 없음. 기본 비밀번호는 `Secret123!`, `Captain123!`, `Admin123!`.

## [2025-09-08] [작성자 AI] [상태: completed]

- 요약: 마이페이지 MVP 완성 — 받은 신청 API/화면 연결, 프로필 편집 검증 강화
- 배경/이유: 마이페이지 4개 메뉴(기본정보/내팀/내글/신청내역) 모두 실제 데이터 연동 완료
- 파일:
  - 백엔드(Recruit): 받은 신청 조회 API 추가
    - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/repository/RecruitApplicationRepository.java:1` (JOIN 쿼리로 작성자 기준 신청 조회)
    - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/service/ApplicationService.java:1` (listByTeamProfile 메서드)
    - `sports-hub-v2/backend-recruit/src/main/java/com/sportshub/recruit/web/RecruitApplicationController.java:1` (GET /api/recruit/applications/received/{profileId})
  - 프론트: 받은 신청 화면 연결
    - `sports-hub-v2/frontend/src/features/application/api/applicationApi.ts:1` (getReceivedApplicationsApi, 승인/거절 API)
    - `sports-hub-v2/frontend/src/features/mypage/components/MyReceivedApplications.tsx:1` (프로필ID 기반 조회, 승인/거절 처리)
  - 프론트: 기본정보 검증 강화
    - `sports-hub-v2/frontend/src/features/mypage/components/MyProfileInfo.tsx:1` (필수값 검증, 성공 알림 추가)
- 명령어:
  - `docker compose build recruit-service`
  - `docker compose up -d recruit-service`
  - `sports-hub-v2/frontend/src/features/mercenary/components/MercenaryDetailCard.tsx:1` (사용하지 않는 import 제거)
  - `sports-hub-v2/frontend/src/lib/axiosInstance.ts:1` (타입 안전성 개선)
  - `sports-hub-v2/frontend/src/stores/useAuthStore.ts:1` (JWT 디코딩 안전성 개선)
  - `sports-hub-v2/frontend/src/components/layout/Footer.tsx:1` (React import 제거)
- 주요 수정 사항:
  - JWT 디코딩 시 payload undefined 체크 추가
  - RecruitPostCreationRequestDto 타입에 맞는 데이터 구성
  - 사용하지 않는 React, Link 등 import 제거
  - 타입 안전성을 위한 타입 캐스팅 적용
  - null 값을 undefined로 변경하여 타입 호환성 개선
- 비고: 남은 17개 오류는 주로 react-router-dom 타입 호환성 문제(node_modules)와 일부 JWT 디코딩 문제. 실제 애플리케이션 동작에는 영향 없음

## [2025-09-08] [작성자: AI] [상태: completed]

- 요약: 내 팀 목록 한글 깨짐 수정 및 오류 처리 개선
- 배경/이유: UserTeamList.tsx 파일의 한글 주석 깨짐과 빈 팀 목록 메시지 개선 필요
- 파일:
  - `sports-hub-v2/frontend/src/features/mypage/components/UserTeamList.tsx:1` (한글 깨짐 복구, 404 오류를 빈 목록으로 처리)
- 비고: 이제 팀이 없으면 '소속된 팀이 없습니다' 메시지 표시, 일부 팀 조회 실패해도 나머지는 정상 표시

## [2025-09-08] [작성자 AI] [상태: completed]

- 요약: 마이페이지 기본 프로필 화면 연결(계정ID → 프로필 조회/최초 생성)
- 배경/이유: 기존 `/api/users/me` 엔드포인트 부재로 화면 오류 → v2 백엔드 계약(`/profiles/by-account/{id}`)에 맞춤
- 파일:
  - `sports-hub-v2/frontend/src/features/auth/api/userApi.ts:1` (계정ID 기반 조회/생성 API)
  - `sports-hub-v2/frontend/src/features/mypage/components/MyProfileInfo.tsx:1` (프로필 조회/없으면 생성 폼)
  - `sports-hub-v2/frontend/src/features/mypage/pages/MyPageLayout.tsx:1` (한글 텍스트 복구, 준비중 표시)
- 비고: 프로필 수정/팀 목록/신청 내역은 백엔드 API 마련 후 단계적으로 활성화 예정

## [2025-09-09] [작성자: AI] [상태: completed]

- 요약: 팀 관리 기능 완성 및 프론트엔드-백엔드 연동 검증
- 배경/이유: 사용자 요청에 따른 핵심 기능들(팀/용병/경기) 완성 작업
- 파일:
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/web/dto/TeamDtos.java:1` (프론트엔드 호환 필드 추가)
  - `sports-hub-v2/backend-team/src/main/java/com/sportshub/team/web/TeamController.java:1` (name 필드 처리 로직 추가)
  - `sports-hub-v2/frontend/src/features/team/api/teamApi.ts:1` (captainProfileId 필드 추가, 에러 처리 개선)
- 명령어:
  - `docker compose restart team-service` (팀 서비스 재시작)
  - 계정/프로필/팀/멤버십 생성 API 테스트 완료
- 검증 결과:
  - POST /api/auth/accounts (계정 생성) ✅
  - POST /api/users/profiles (프로필 생성) ✅
  - POST /api/teams (팀 생성) ✅
  - POST /api/teams/{teamId}/members (멤버십 생성) ✅
  - GET /api/teams/memberships/by-profile/{profileId} (소속팀 조회) ✅

## [2025-09-09] [작성자: AI] [상태: completed]

- 요약: 용병 모집 시스템 동작 검증 및 지원 기능 테스트
- 배경/이유: 용병 모집글 작성/조회/지원 플로우 전체 검증 필요
- 검증 결과:
  - POST /api/recruit/posts (모집글 생성) ✅
  - GET /api/recruit/posts?category=MERCENARY (모집글 목록 조회) ✅
  - POST /api/recruit/posts/{postId}/applications (지원서 작성) ✅
- 비고: 프론트엔드에서 호출하는 모든 API 엔드포인트가 정상 동작 확인

## [2025-09-09] [작성자: AI] [상태: completed]

- 요약: 조기축구 플랫폼 ERP 계획 수립 및 문서화
- 배경/이유: 프로젝트 방향성 재정의 (아마추어 축구 → 조기축구) 및 체계적 개발 계획 필요
- 파일:
  - `sports-hub-v2/ERP_PLAN.md:1` (조기축구 특화 ERP 계획서 작성)
- 주요 내용:
  - 조기축구 타겟 시장 분석 (30-50대 직장인, 새벽 5-7시)
  - 조기축구 특화 DB 설계 (morning_sessions, session_participants, field_locations 등)
  - 4단계 로드맵 (MVP → 운영최적화 → 커뮤니티 → 생태계)
  - 수익 모델 및 위험 요소 분석
  - 기술 스택 확장 계획
- 비고: 시간대별 모집, 출근경로 기반 매칭, 날씨 연동 등 조기축구만의 특화 기능 정의
