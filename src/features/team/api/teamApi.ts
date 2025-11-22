// src/features/team/api/teamApi.ts

import axiosInstance from "@/lib/axiosInstance";
import { useAuthStore } from "@/stores/useAuthStore";
import type { Team, TeamMember } from "@/types/team";

// 팀 생성 시 보낼 데이터 타입
export interface TeamCreateRequestDto {
  name: string;
  region: string;
  subRegion?: string;
  description?: string;
  logoUrl?: string;
  homeGround?: string;
  captainProfileId?: number; // 백엔드 호환성을 위해 추가
}

/**
 * 특정 프로필이 소속된 팀 목록 조회 API
 * @param profileId 조회할 프로필 ID
 */
export const getTeamsByProfileApi = async (profileId: number): Promise<Team[]> => {
  try {
    const response = await axiosInstance.get<Team[]>(`http://localhost:8083/api/teams/memberships/by-profile/${profileId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching teams for profile ID ${profileId}:`, error);
    // 404 에러인 경우 빈 배열 반환 (소속된 팀이 없는 경우)
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 404) {
        return [];
      }
    }
    throw new Error("소속 팀 목록을 불러오는 데 실패했습니다.");
  }
};

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
    const { user } = useAuthStore.getState();

    // captainProfileId가 없으면 현재 사용자를 captain으로 설정
    if (!requestData.captainProfileId) {
      // 임시로 1로 설정 (실제로는 현재 사용자의 프로필 ID를 가져와야 함)
      // TODO: 현재 로그인한 사용자의 프로필 ID를 가져오도록 수정
      requestData.captainProfileId = (user?.profileId as number | undefined) ?? 1;
    }

    const response = await axiosInstance.post<Team>("http://localhost:8083/api/teams", requestData);
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
    const response = await axiosInstance.get<Team>(`http://localhost:8083/api/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching team detail for ID ${teamId}:`, error);
    throw new Error("팀 정보를 불러오는 데 실패했습니다.");
  }
};

/**
 * 팀 정보 수정 API
 * @param teamId 수정할 팀의 ID
 * @param updateData 수정할 데이터
 */
export const updateTeamApi = async (
  teamId: string | number,
  updateData: Partial<Team>
): Promise<Team> => {
  try {
    const response = await axiosInstance.put<Team>(
      `http://localhost:8083/api/teams/${teamId}`,
      updateData
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating team ${teamId}:`, error);
    throw new Error("팀 정보 수정에 실패했습니다.");
  }
};

// ========== 팀 멤버십 관련 API ==========

/**
 * 팀 멤버 목록 조회 API
 * @param teamId 조회할 팀의 ID
 */
export const getTeamMembersApi = async (teamId: string | number): Promise<TeamMember[]> => {
  try {
    const response = await axiosInstance.get<TeamMember[]>(`http://localhost:8083/api/teams/${teamId}/members`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching team members for ID ${teamId}:`, error);
    throw new Error("팀 멤버 목록을 불러오는 데 실패했습니다.");
  }
};

/**
 * 팀 멤버 추가 API
 * @param teamId 팀 ID
 * @param profileId 추가할 프로필 ID
 * @param role 역할 (기본값: MEMBER)
 */
export const addTeamMemberApi = async (
  teamId: string | number,
  profileId: number,
  role: string = "MEMBER"
): Promise<TeamMember> => {
  try {
    const response = await axiosInstance.post<TeamMember>(
      `http://localhost:8083/api/teams/${teamId}/members`,
      { profileId, role }
    );
    return response.data;
  } catch (error) {
    console.error(`Error adding team member:`, error);
    throw new Error("팀 멤버 추가에 실패했습니다.");
  }
};

/**
 * 팀 멤버 역할 변경 API
 * @param teamId 팀 ID
 * @param profileId 프로필 ID
 * @param role 새로운 역할
 */
export const updateMemberRoleApi = async (
  teamId: string | number,
  profileId: number,
  role: string
): Promise<TeamMember> => {
  try {
    const response = await axiosInstance.put<TeamMember>(
      `http://localhost:8083/api/teams/${teamId}/members/${profileId}/role`,
      { role }
    );
    return response.data;
  } catch (error) {
    console.error(`Error updating member role:`, error);
    throw new Error("멤버 역할 변경에 실패했습니다.");
  }
};

/**
 * 팀 멤버 삭제 API
 * @param teamId 팀 ID
 * @param profileId 프로필 ID
 */
export const removeMemberApi = async (
  teamId: string | number,
  profileId: number
): Promise<void> => {
  try {
    await axiosInstance.delete(`http://localhost:8083/api/teams/${teamId}/members/${profileId}`);
  } catch (error) {
    console.error(`Error removing team member:`, error);
    throw new Error("팀 멤버 삭제에 실패했습니다.");
  }
};

/**
 * 사용자가 속한 팀 목록 조회 (기존 getUserTeamsApi 개선)
 * @param profileId 프로필 ID
 */
export const getUserTeamsApi = async (profileId: number): Promise<Team[]> => {
  try {
    const response = await axiosInstance.get<Team[]>(
      `http://localhost:8083/api/teams/memberships/by-profile/${profileId}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching user teams for profile ID ${profileId}:`, error);
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response?: { status?: number } };
      if (err.response?.status === 404) {
        return [];
      }
    }
    throw new Error("소속 팀 목록을 불러오는 데 실패했습니다.");
  }
};
