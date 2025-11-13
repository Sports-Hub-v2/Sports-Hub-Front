// src/types/recruitPost.ts

export interface PostType {
  // API 응답 또는 화면 표시용 타입
  id: number;
  title: string;
  content: string;
  region: string;
  subRegion?: string;
  thumbnailUrl?: string; // PostType에는 있지만 CreationRequest에는 없을 수 있음, 또는 반대
  imageUrl?: string; // 개선된 컴포넌트에서 사용
  category: RecruitCategory; // Enum 값 사용
  targetType: RecruitTargetType; // Enum 값 사용
  fromParticipant: ParticipantType; // Enum 값 사용
  toParticipant: ParticipantType; // Enum 값 사용
  gameDate?: string;
  gameTime?: string;
  status: RecruitStatus; // Enum 값 사용
  requiredPersonnel?: number;
  ageGroup?: string;
  preferredPositions?: string;
  skillLevel?: string; // 개선된 컴포넌트에서 사용
  matchRules?: string;
  minPlayers?: number;
  maxPlayers?: number;
  authorId: number | null;
  authorName: string | null;
  createdAt: string;
  updatedAt: string;

  // 조기축구 특화 필드들
  fieldLocation?: string; // 경기 장소 (네이버 지도 연결용)

  // 알림 관련 필드들 (추후 구현)
  notificationSettings?: {
    enabled: boolean; // 알림 활성화 여부
    reminderBefore: number; // 경기 전 알림 시간 (분)
    weatherAlert: boolean; // 날씨 알림 여부
    statusChange: boolean; // 상태 변경 알림 여부
  };

  // 신청자 관리
  acceptedCount?: number; // 승인된 신청자 수 (백엔드에서 제공)

  // 참여자 관리 (추후 구현 - 현재는 acceptedCount 사용)
  participants?: {
    current: number; // 현재 참여자 수
    confirmed: number; // 확정된 참여자 수
    pending: number; // 대기 중인 참여자 수
  };

  // 실시간 상태 (추후 구현)
  isUrgent?: boolean; // 긴급 모집 여부
  isHot?: boolean; // 인기 모집글 여부
  lastActivity?: string; // 마지막 활동 시간
}

export enum RecruitCategory {
  MERCENARY = "MERCENARY",
  TEAM = "TEAM",
  MATCH = "MATCH",
}

export enum RecruitTargetType {
  USER = "USER",
  TEAM = "TEAM",
}

export enum ParticipantType {
  INDIVIDUAL = "INDIVIDUAL",
  TEAM = "TEAM",
}

export enum RecruitStatus {
  RECRUITING = "RECRUITING",
  COMPLETED = "COMPLETED",
  IN_PROGRESS = "IN_PROGRESS", // 백엔드 Enum에 정의되어 있다면
  FINISHED = "FINISHED", // 백엔드 Enum에 정의되어 있다면
  CANCELLED = "CANCELLED", // 백엔드 Enum에 정의되어 있다면
}

export enum ApplicationStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
}

/**
 * 게시글 생성 요청 시 서버로 전송할 데이터 타입.
 * 백엔드 PostCreateRequest.java 와 필드 구조 및 타입을 일치시킵니다.
 */
export interface RecruitPostCreationRequestDto {
  teamId: number; // 필수 - 작성자의 팀 ID
  writerProfileId: number; // 필수 - 작성자의 프로필 ID
  title: string;
  content?: string;
  region?: string;
  subRegion?: string;
  imageUrl?: string;
  // 백엔드 호환: PostCreateRequest.matchDate 사용 (gameDate는 프론트 내부 표현)
  matchDate?: string; // LocalDate -> ISO string (YYYY-MM-DD)
  gameDate?: string; // LocalDate -> ISO string (YYYY-MM-DD)
  gameTime?: string; // 경기 시간
  category?: string; // "MERCENARY", "TEAM", "MATCH"
  targetType?: string; // "USER", "TEAM"
  status?: string; // "RECRUITING", "COMPLETED"
  requiredPersonnel?: number; // 모집 인원
  preferredPositions?: string; // 선호 포지션
  ageGroup?: string; // 연령대
  skillLevel?: string; // 실력 수준
  cost?: number; // 참가비
  // 추가 필드 (선택)
  fieldLocation?: string; // 구장 위치
  parkingAvailable?: boolean;
  showerFacilities?: boolean;
}

/**
 * 백엔드로부터 받는 모집 게시글 응답 데이터 타입 (DTO)
 * GET /api/recruit-posts 또는 POST /api/recruit-posts 응답에 사용됩니다.
 */
export interface RecruitPostResponseDto {
  id: number;
  title: string;
  content: string;
  region: string;
  subRegion: string | null; // null일 수 있음
  thumbnailUrl: string | null;
  category: "MERCENARY" | "TEAM" | "MATCH"; // Enum은 보통 문자열로 넘어옵니다.
  targetType: string; // 'TEAM_TO_INDIVIDUAL' | 'INDIVIDUAL_TO_TEAM' 등
  fromParticipant: string | null;
  toParticipant: string | null;
  gameDate: string; // "YYYY-MM-DD" 형식의 문자열
  gameTime: string; // "HH:mm:ss" 형식의 문자열
  status: "RECRUITING" | "COMPLETED"; // 모집중, 모집완료 등
  requiredPersonnel: number | null;
  ageGroup: string | null;
  preferredPositions: string | null;
  matchRules: string | null;
  minPlayers: number | null;
  maxPlayers: number | null;
  authorId: number | null;
  authorName: string | null;
  createdAt: string; // "YYYY-MM-DDTHH:mm:ss" 형식의 ISO 문자열
  updatedAt: string;
  acceptedCount?: number; // 승인된 신청자 수
}

export type RecruitPostUpdateRequestDto =
  Partial<RecruitPostCreationRequestDto>;
