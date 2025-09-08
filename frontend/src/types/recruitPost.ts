// src/types/recruitPost.ts

export interface PostType {
  // API 응답 또는 화면 표시용 타입
  id: number;
  title: string;
  content: string;
  region: string;
  subRegion?: string;
  thumbnailUrl?: string; // PostType에는 있지만 CreationRequest에는 없을 수 있음, 또는 반대
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
  matchRules?: string;
  minPlayers?: number;
  maxPlayers?: number;
  authorId: number | null;
  authorName: string | null;
  createdAt: string;
  updatedAt: string;
  // postingTeamId, postingTeamName 등 추가된 필드 고려
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
  imageUrl?: string;
  matchDate?: string; // LocalDate -> ISO string (YYYY-MM-DD)
  category?: string; // "MERCENARY", "TEAM", "MATCH"
  targetType?: string; // "USER", "TEAM"
  status?: string; // "RECRUITING", "COMPLETED"
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
}

export type RecruitPostUpdateRequestDto =
  Partial<RecruitPostCreationRequestDto>;
