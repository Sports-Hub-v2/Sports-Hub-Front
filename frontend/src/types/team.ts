// src/types/team.ts

// 팀의 전체 상세 정보를 위한 타입
export interface Team {
  id: number;
  name: string;
  captainId: number;
  captainName: string;
  region: string;
  subRegion: string | null;
  description: string | null;
  logoUrl: string | null;
  homeGround: string | null;
  createdAt: string;
  updatedAt: string;
  // TODO: 필요하다면 팀 멤버 목록 등 추가 정보 포함 가능
}

// 팀 목록 등에서 간단히 사용할 타입
export interface TeamSummary {
  id: number;
  name: string;
  logoUrl: string | null;
  region: string;
  roleInTeam: string; // "CAPTAIN", "MEMBER" 등
}