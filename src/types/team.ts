// src/types/team.ts

// 팀의 전체 상세 정보를 위한 타입 (백엔드 스키마와 일치)
export interface Team {
  id: number;
  teamName: string;
  captainProfileId: number | null;
  region: string | null;
  subRegion: string | null;
  description: string | null;
  logoUrl: string | null;
  homeGround: string | null;
  maxMembers: number | null;
  skillLevel: string | null;
  status: string; // ACTIVE, INACTIVE, SUSPENDED
  verified: boolean;
  // 통계 필드
  totalMembers: number;
  totalMatches: number;
  totalWins: number;
  totalDraws: number;
  totalLosses: number;
  // 메타 정보
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

// 팀 멤버 정보 타입 (백엔드 TeamMemberResponseDto와 일치)
export interface TeamMember {
  profileId: number;
  name: string;
  role: string; // CAPTAIN(팀장), MEMBER(팀원)
  isActive: boolean;
}

// 팀 목록 등에서 간단히 사용할 타입
export interface TeamSummary {
  id: number;
  name: string;
  logoUrl: string | null;
  region: string;
  roleInTeam: string; // "CAPTAIN", "MEMBER" 등
}
