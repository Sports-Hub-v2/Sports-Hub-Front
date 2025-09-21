// src/types/application.ts

import { ApplicationStatus } from "./recruitPost"; // RecruitStatus와 동일한 Enum을 쓴다고 가정

// 백엔드의 ApplicationResponseDto와 일치하는 타입
export interface MyApplication {
  applicationId: number;
  status: ApplicationStatus;
  message: string;
  rejectionReason: string | null;
  appliedAt: string;
  postId: number;
  postTitle: string;
}

// '받은 신청' 목록용 타입 (신청자 정보 포함)
export interface ReceivedApplication {
  applicationId: number;
  status: ApplicationStatus;
  message: string;
  appliedAt: string;
  postId: number;
  postTitle: string;
  applicantId: number;
  applicantName: string;
}

export interface ApplicationRequestDto {
  message?: string; // UI 입력 메시지
  description?: string; // 서버 스키마 매핑용(백엔드는 description 사용)
  applicantProfileId?: number; // 지원자 프로필 ID
  applicantTeamId?: number; // 팀 대 팀 지원 시
}
