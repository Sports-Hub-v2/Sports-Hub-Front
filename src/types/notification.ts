// src/types/notification.ts

export interface Notification {
  id: number;
  receiverProfileId: number;
  type: string;
  message: string;
  isRead: boolean;
  relatedType?: string;
  relatedId?: number;
  createdAt: string;
  title?: string; // UI에서 생성할 제목
}

export enum NotificationType {
  APPLICATION_RECEIVED = "APPLICATION_RECEIVED", // 신청을 받았을 때
  APPLICATION_ACCEPTED = "APPLICATION_ACCEPTED", // 신청이 승인되었을 때
  APPLICATION_REJECTED = "APPLICATION_REJECTED", // 신청이 거절되었을 때
  POST_REMINDER = "POST_REMINDER", // 게시글 관련 알림
  TEAM_INVITATION = "TEAM_INVITATION", // 팀 초대
  MATCH_REMINDER = "MATCH_REMINDER", // 경기 리마인더
  WELCOME = "WELCOME", // 환영 메시지
}

export interface NotificationRequestDto {
  receiverProfileId: number;
  type: string;
  message: string;
  relatedType?: string;
  relatedId?: number;
}
