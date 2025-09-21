// src/types/team.ts

// 팀의 전체 상세 정보를 위한 타입 (백엔드 스키마와 일치)
export interface Team {
  id: number;
  teamName: string;
  captainProfileId: number | null;
  region: string | null;
  description: string | null;
  maxMembers: number | null;
  ageGroup: string | null;
  skillLevel: string | null;
  activityType: string | null;
  logoUrl: string | null;
  homeGround: string | null;
  rivalTeams: string | null;
  createdAt: string;
}

// 팀 멤버 정보 타입
export interface TeamMember {
  id: {
    teamId: number;
    profileId: number;
  };
  roleInTeam: string;
  joinedAt: string;
  isActive: boolean;
  // 프로필 정보 (조인된 데이터)
  profileName?: string;
  profileRegion?: string;
}

// 팀 목록 등에서 간단히 사용할 타입
export interface TeamSummary {
  id: number;
  name: string;
  logoUrl: string | null;
  region: string;
  roleInTeam: string; // "CAPTAIN", "MEMBER" 등
}
