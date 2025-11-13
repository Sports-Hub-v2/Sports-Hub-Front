// src/features/auth/api/userApi.ts

import axiosInstance from "@/lib/axiosInstance";
import type {
  User,
  UserProfileUpdateDto,
  PublicUserProfileResponseDto,
} from "@/types/user";
import type { TeamSummary } from "@/types/team";
import { PostType, RecruitCategory } from "@/types/recruitPost";

const API_USERS_BASE_URL = "/api/users";

// Get my profile by accountId (v2 backend contract)
export const getProfileByAccountIdApi = async (
  accountId: number
): Promise<User> => {
  const res = await axiosInstance.get<User>(
    `http://localhost:8082${API_USERS_BASE_URL}/profiles/by-account/${accountId}`
  );
  return res.data as User;
};

// Create profile (first-time setup)
export const createProfileApi = async (
  payload: Partial<User> & { accountId: number; name: string }
): Promise<User> => {
  const res = await axiosInstance.post<User>(
    `http://localhost:8082${API_USERS_BASE_URL}/profiles`,
    payload
  );
  return res.data as User;
};

// Not implemented yet server-side — keep API surface for later
export const updateMyProfileApi = async (
  profileId: number,
  updatedData: Partial<UserProfileUpdateDto>
): Promise<User> => {
  const res = await axiosInstance.patch<User>(
    `http://localhost:8082${API_USERS_BASE_URL}/profiles/${profileId}`,
    updatedData
  );
  return res.data as User;
};

export const fetchPublicUserProfileApi = async (
  _userId: number | string
): Promise<PublicUserProfileResponseDto> => {
  throw new Error("공개 프로필 조회 API는 아직 준비 중입니다.");
};

export const getUserTeamsApi = async (
  accountId: number | string
): Promise<TeamSummary[]> => {
  try {
    const prof = await getProfileByAccountIdApi(Number(accountId));
    const profileId = (prof as any).id as number;

    // 멤버십 조회
    const memRes = await axiosInstance.get(
      `http://localhost:8083/api/teams/memberships/by-profile/${profileId}`
    );
    const memberships: any[] = Array.isArray(memRes.data) ? memRes.data : [];

    if (memberships.length === 0) {
      return [];
    }

    // 각 멤버십에 대해 팀 정보 조회 (실패한 것은 제외)
    const teams: TeamSummary[] = [];
    for (const membership of memberships) {
      try {
        // 백엔드 TeamMembership 구조: membership.id.teamId로 접근
        const teamId = membership?.id?.teamId;
        if (!teamId) {
          console.warn("팀 ID를 찾을 수 없음:", membership);
          continue;
        }

        const teamRes = await axiosInstance.get(`http://localhost:8083/api/teams/${teamId}`);
        const team = teamRes.data || {};

        teams.push({
          id: team.id,
          name: team.teamName ?? team.name ?? "팀명 없음",
          logoUrl: team.logoUrl || null,
          region: team.region ?? "",
          roleInTeam: membership.roleInTeam ?? "멤버",
        });
      } catch (teamError) {
        console.warn(`팀 ${membership?.id?.teamId} 정보 조회 실패:`, teamError);
        // 개별 팀 조회 실패는 무시하고 계속 진행
      }
    }

    return teams;
  } catch (error) {
    console.error("getUserTeamsApi 오류:", error);
    // 프로필이 없거나 멤버십 조회 실패 시 빈 배열 반환
    if ((error as any)?.response?.status === 404) {
      return [];
    }
    throw error;
  }
};

export const getUserPostsApi = async (
  _userId: number | string
): Promise<PostType[]> => {
  // 입력은 accountId로 받고, 내부에서 profileId로 변환 후 조회
  const prof = await getProfileByAccountIdApi(Number(_userId));
  const profileId = (prof as any).id as number;
  const res = await axiosInstance.get(`http://localhost:8084/api/recruit/posts`, {
    params: { writerProfileId: profileId },
  });
  const items: any[] = Array.isArray(res.data)
    ? res.data
    : res.data && Array.isArray((res.data as any).content)
    ? (res.data as any).content
    : [];
  const toPostType = (it: any): PostType => ({
    id: it.id ?? 0,
    title: it.title ?? "",
    content: it.content ?? "",
    region: it.region ?? "",
    subRegion: it.subRegion ?? null,
    thumbnailUrl: it.imageUrl ?? null,
    category: (it.category as RecruitCategory) ?? RecruitCategory.MERCENARY,
    targetType: it.targetType ?? "USER",
    fromParticipant: it.fromParticipant ?? "INDIVIDUAL",
    toParticipant: it.toParticipant ?? "TEAM",
    gameDate: it.matchDate ?? null,
    gameTime: undefined,
    status: (it.status ?? "RECRUITING") as any,
    requiredPersonnel: it.requiredPersonnel ?? null,
    ageGroup: it.ageGroup ?? null,
    preferredPositions: it.preferredPositions ?? null,
    matchRules: it.matchRules ?? null,
    minPlayers: it.minPlayers ?? null,
    maxPlayers: it.maxPlayers ?? null,
    authorId: it.writerProfileId ?? null,
    authorName: it.authorName ?? null,
    createdAt: it.createdAt ?? new Date().toISOString(),
    updatedAt: it.updatedAt ?? new Date().toISOString(),
  });
  return items.map(toPostType);
};
