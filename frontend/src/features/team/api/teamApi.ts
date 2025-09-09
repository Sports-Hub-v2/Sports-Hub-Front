// src/features/team/api/teamApi.ts

import axiosInstance from "@/lib/axiosInstance";
import type { Team } from "@/types/team"; // Team 전체 타입을 정의했다고 가정

// 팀 생성 시 보낼 데이터 타입
export interface TeamCreateRequestDto {
  name: string;
  region: string;
  subRegion?: string;
  description?: string;
  logoUrl?: string;
  homeGround?: string만   captainProfileId?: number; // 백엔드 호환성을 위해 추가
}

/**
 * 새로운 팀 생성 API
 * @param teamData 생성할 팀의 정보
 */
export const createTeamApi = async (
  teamData: TeamCreateRequestDto
): Promise<Team> => {
  try {
    // 현재 로그인한 사용자의 프로필 ID를 가져와서 captain으로 설정
    let requestData = { ...teamData };

    // captainProfileId가 없으면 현재 사용자를 captain으로 설정
    if (!requestData.captainProfileId) {
      // 임시로 1로 설정 (실제로는 현재 사용자의 프로필 ID를 가져와야 함)
      // TODO: 현재 로그인한 사용자의 프로필 ID를 가져오도록 수정
      requestData.captainProfileId = 1;
    }

    const response = await axiosInstance.post<Team>("/api/teams", requestData);
    return response.data;
  } catch (error: unknown) {
    // ▼▼▼ 버전에 상관없이 동작하는 안전한 에러 처리 로직 ▼▼▼
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(
        err.response?.data?.message || "팀 생성 중 오류가 발생했습니다."
      );
    }
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};

/**
 * 특정 팀의 상세 정보 조회 API
 * @param teamId 조회할 팀의 ID
 */
export const getTeamDetailApi = async (teamId: string): Promise<Team> => {
  try {
    const response = await axiosInstance.get<Team>(`/api/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching team detail for ID ${teamId}:`, error);
    throw new Error("팀 정보를 불러오는 데 실패했습니다.");
  }
};
