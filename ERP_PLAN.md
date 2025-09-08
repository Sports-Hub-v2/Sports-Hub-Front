# 조기축구 플랫폼 ERP 계획서

## 프로젝트 개요

### 타겟 시장 특성

- **조기축구 동호인**: 새벽 5-7시 축구하는 직장인들
- **주요 연령층**: 30-50대 직장인, 자영업자
- **라이프스타일**: 바쁜 일정 속에서 건강 관리하는 사람들
- **참여 패턴**: 주 1-2회, 정기적 참여

### 조기축구만의 특별한 니즈

- **시간 관리**: 새벽 시간대 특화 스케줄링
- **접근성**: 출근 전 위치 고려한 구장 선택
- **인원 관리**: 갑작스런 불참/추가 참여 대응
- **날씨 대응**: 비올 때 빠른 취소/연기 결정

## 데이터베이스 설계 (조기축구 특화)

### 핵심 테이블 구조

#### 1. morning_sessions (조기축구 세션)

```sql
CREATE TABLE morning_sessions (
    session_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    team_id BIGINT NOT NULL,
    session_date DATE NOT NULL,
    start_time TIME NOT NULL, -- 05:00, 06:00, 07:00
    field_location_id BIGINT NOT NULL,
    max_participants INT DEFAULT 22,
    weather_status VARCHAR(20),
    session_status ENUM('scheduled', 'cancelled', 'completed') DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_date_time (session_date, start_time),
    INDEX idx_team_date (team_id, session_date)
);
```

#### 2. session_participants (참가자 관리)

```sql
CREATE TABLE session_participants (
    participant_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id BIGINT NOT NULL,
    user_id BIGINT NOT NULL,
    attendance_status ENUM('confirmed', 'pending', 'absent') DEFAULT 'pending',
    registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_substitute BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (session_id) REFERENCES morning_sessions(session_id),
    UNIQUE KEY unique_session_user (session_id, user_id),
    INDEX idx_user_attendance (user_id, attendance_status)
);
```

#### 3. field_locations (구장 정보)

```sql
CREATE TABLE field_locations (
    field_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    field_name VARCHAR(100) NOT NULL,
    address TEXT NOT NULL,
    subway_stations JSON, -- 근처 지하철역 정보
    parking_available BOOLEAN DEFAULT FALSE,
    shower_facilities BOOLEAN DEFAULT FALSE,
    opening_hours JSON, -- 요일별 운영시간
    price_per_hour DECIMAL(10,2),
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

#### 4. user_preferences (사용자 선호도)

```sql
CREATE TABLE user_preferences (
    user_id BIGINT PRIMARY KEY,
    home_location JSON, -- {address, latitude, longitude}
    work_location JSON,
    preferred_times JSON, -- ['05:00', '06:00', '07:00']
    preferred_fields JSON, -- field_id 배열
    commute_route JSON, -- 경로 정보
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES profiles(id)
);
```

#### 5. weather_alerts (날씨 알림 로그)

```sql
CREATE TABLE weather_alerts (
    alert_id BIGINT PRIMARY KEY AUTO_INCREMENT,
    session_id BIGINT NOT NULL,
    weather_condition VARCHAR(50),
    temperature DECIMAL(4,1),
    precipitation_probability INT, -- 강수 확률 %
    alert_sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancellation_decision BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (session_id) REFERENCES morning_sessions(session_id)
);
```

### 데이터베이스 최적화 전략

#### 인덱싱 전략

- `session_date + start_time`: 조회 최적화
- `user_id + attendance_status`: 개인 참석 이력
- `field_location + session_date`: 구장별 스케줄
- `team_id + session_date`: 팀별 스케줄 조회

#### 파티셔닝

- `morning_sessions` 테이블: 월별 파티셔닝
- `session_participants` 테이블: 연도별 파티셔닝

#### 캐싱 전략

- 자주 조회되는 구장 정보 Redis 캐싱
- 주간 스케줄 정보 메모리 캐싱
- 날씨 정보 1시간 단위 캐싱

## ERP 로드맵

### Phase 1: 조기축구 MVP (현재 → 2주)

**새벽 축구의 핵심 pain point 해결**

- 시간대별 모집 (5시/6시/7시 시작)
- 출근 경로 기반 구장 추천
- 간편 참석/불참 체크
- 기본 팀 관리 및 용병 시스템

### Phase 2: 조기축구 운영 최적화 (2-4주)

**정기 모임 운영의 효율성 극대화**

- 정기 모임 자동 생성 (매주 화/목/토)
- 날씨 API 연동 자동 취소/연기 알림
- 출석률 통계 (개인별/팀별)
- 비용 정산 기능 (구장비, 공 값 등)

### Phase 3: 조기축구 커뮤니티 (1-2개월)

**새벽 축구인들만의 특별한 커뮤니티**

- 지역별 조기축구 연합 (강남/여의도/판교 등)
- 조기축구 리그전 (월 1회 토너먼트)
- 건강 관리 연동 (만보기, 칼로리 소모량)
- 회사별 대항전 매칭

### Phase 4: 조기축구 생태계 (2-3개월)

**새벽 축구의 모든 것을 해결하는 플랫폼**

- 새벽 구장 예약 시스템
- 조기축구용 용품 쇼핑 (새벽 배송)
- 스포츠 마사지/재활 연계
- 조기축구인 전용 보험

## 당장 해야 할 작업

### 즉시 구현 필요 (우선순위 순)

1. **시간대 모집 기능** - 새벽 5시/6시/7시 선택 옵션
2. **지역별 구장 정보** - 출근로 고려한 위치 및 주차 정보
3. **정기 모임 기능** - 매주 요일 반복 설정
4. **간편 참석 체크** - 원클릭 참석/불참 버튼
5. **날씨 연동 기능** - 비올 때 자동 취소 알림

### 데이터베이스 우선 작업

1. **조기축구 특화 테이블 설계 및 구현**
2. **기존 recruit_post 테이블에 시간대 필드 추가**
3. **구장 정보 데이터베이스 구축**
4. **사용자 선호도 테이블 추가**
5. **세션 참가자 관리 시스템 구축**

## 핵심 차별화 포인트

### 시장 우위 요소

- **시간대 특화**: 새벽 시간만의 니즈에 집중
- **직장인 라이프스타일**: 출근 전 루틴에 맞춤
- **커뮤니티 강화**: 같은 고민을 가진 사람들끼리
- **위치 기반 최적화**: 집-구장-회사 동선 고려

### 수익 모델

- **프리미엄 멤버십**: 우선 매칭, 날씨 알림, 통계 제공 (월 9,900원)
- **구장 파트너십**: 새벽 시간대 할인 예약 중개 수수료 (예약당 5-10%)
- **아침 식사 연계**: 근처 식당과 제휴 할인 (주문당 3-5%)
- **조기축구 용품**: 새벽 운동 특화 제품 판매 (마진율 20-30%)

## 위험 요소 및 대응 방안

### 기술적 위험

- **새벽 시간대 서버 부하**: 오전 6-7시 집중 접속 대비 → 로드밸런싱, CDN 적용
- **실시간 알림 시스템**: 푸시 알림 안정성 확보 → FCM, APNs 이중화
- **날씨 API 의존성**: 복수 기상청 API 연동 → 기상청, OpenWeather, AccuWeather

### 사업적 위험

- **계절성**: 겨울철 참여도 감소 대응책 → 실내 풋살장 연계, 겨울 리그전
- **경쟁사 진입**: 기존 축구 앱들의 새벽 특화 서비스 출시 → 선점 효과 및 차별화 강화
- **사용자 확보**: 초기 critical mass 확보 전략 → 오프라인 조기축구팀 직접 접촉

### 운영적 위험

- **날씨 취소 남발**: 과도한 취소로 인한 사용자 불만 → 취소 기준 명확화, 보상 시스템
- **구장 확보**: 새벽 시간대 구장 부족 → 장기 계약, 다양한 구장 확보
- **분쟁 처리**: 참가비, 부상 등 문제 → 명확한 규정, 보험 연계

## 성공 지표 (KPI)

### 단기 지표 (3개월)

- 월간 활성 사용자 (MAU): 500명
- 주간 세션 생성 수: 50회
- 사용자 재방문율: 70%

### 중기 지표 (6개월)

- 월간 활성 사용자 (MAU): 2,000명
- 프리미엄 전환율: 15%
- 월간 매출: 300만원

### 장기 지표 (1년)

- 월간 활성 사용자 (MAU): 10,000명
- 구장 파트너십: 50개소
- 월간 매출: 2,000만원

## 기술 스택 확장 계획

### 현재 구조 유지

- **백엔드**: Spring Boot 마이크로서비스
- **프론트엔드**: React + TypeScript
- **데이터베이스**: MySQL (서비스별 분리)
- **인프라**: Docker + Docker Compose

### 추가 필요 기술

- **실시간 알림**: Firebase Cloud Messaging
- **지도/위치**: Google Maps API, Kakao Map API
- **날씨**: 기상청 API, OpenWeatherMap API
- **결제**: 토스페이먼츠, 카카오페이
- **모니터링**: Prometheus + Grafana
- **로그 관리**: ELK Stack
