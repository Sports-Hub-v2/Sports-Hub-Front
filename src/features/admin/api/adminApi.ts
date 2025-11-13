// src/features/admin/api/adminApi.ts

import axiosInstance from "@/lib/axiosInstance";

// 마이크로서비스별 URL
const USER_SERVICE_URL = "http://localhost:8082/api";
const TEAM_SERVICE_URL = "http://localhost:8083/api";
const RECRUIT_SERVICE_URL = "http://localhost:8084/api";

/**
 * 관리자 대시보드 통계 조회
 */
export const fetchAdminStatsApi = async () => {
  try {
    // 여러 API 호출을 병렬로 실행
    const [profiles, teams, posts, matches] = await Promise.all([
      axiosInstance.get(`${USER_SERVICE_URL}/profiles`),
      axiosInstance.get(`${TEAM_SERVICE_URL}/teams`),
      axiosInstance.get(`${RECRUIT_SERVICE_URL}/posts`),
      axiosInstance.get(`${RECRUIT_SERVICE_URL}/matches`),
    ]);

    // 통계 계산
    const totalUsers = profiles.data.totalElements || profiles.data.length || 0;
    const totalTeams = teams.data.totalElements || teams.data.length || 0;
    const totalPosts = posts.data.totalElements || posts.data.length || 0;
    const totalMatches = matches.data.totalElements || matches.data.length || 0;

    // 오늘 날짜 계산
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 오늘 생성된 것들 필터링
    const todayUsers = Array.isArray(profiles.data.content || profiles.data)
      ? (profiles.data.content || profiles.data).filter((p: any) => {
          const createdAt = new Date(p.createdAt);
          return createdAt >= today;
        }).length
      : 0;

    const todayMatches = Array.isArray(matches.data.content || matches.data)
      ? (matches.data.content || matches.data).filter((m: any) => {
          const gameDate = new Date(m.gameDate || m.matchDate);
          return gameDate.toDateString() === today.toDateString();
        }).length
      : 0;

    return {
      totalUsers,
      totalTeams,
      totalPosts,
      totalMatches,
      todayUsers,
      todayMatches,
      todayActiveUsers: Math.floor(totalUsers * 0.45), // 임시: 전체 회원의 45%
      pendingReports: 0, // TODO: 신고 API 추가 필요
    };
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    throw error;
  }
};

/**
 * 사용자 목록 조회 (관리자)
 */
export const fetchUsersApi = async (page: number = 0, size: number = 20) => {
  try {
    const response = await axiosInstance.get(`${USER_SERVICE_URL}/profiles`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    throw error;
  }
};

/**
 * 팀 목록 조회 (관리자)
 */
export const fetchTeamsApi = async (page: number = 0, size: number = 20) => {
  try {
    const response = await axiosInstance.get(`${TEAM_SERVICE_URL}/teams`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    throw error;
  }
};

/**
 * 경기 목록 조회 (관리자)
 */
export const fetchMatchesApi = async (page: number = 0, size: number = 20) => {
  try {
    const response = await axiosInstance.get(`${RECRUIT_SERVICE_URL}/matches`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    throw error;
  }
};

/**
 * 게시물 목록 조회 (관리자)
 */
export const fetchPostsApi = async (page: number = 0, size: number = 20) => {
  try {
    const response = await axiosInstance.get(`${RECRUIT_SERVICE_URL}/posts`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    throw error;
  }
};

/**
 * 신고 목록 조회 (관리자)
 */
export const fetchReportsApi = async (page: number = 0, size: number = 20) => {
  try {
    // TODO: 백엔드에 신고 API가 없으면 빈 배열 반환
    const response = await axiosInstance.get(`${USER_SERVICE_URL}/reports`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch reports:", error);
    // 신고 API가 없으면 빈 데이터 반환
    return { content: [], totalElements: 0 };
  }
};

/**
 * 사용자 상세 조회
 */
export const fetchUserDetailApi = async (userId: number) => {
  try {
    const response = await axiosInstance.get(`${USER_SERVICE_URL}/profiles/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch user detail:", error);
    throw error;
  }
};

/**
 * 팀 상세 조회
 */
export const fetchTeamDetailApi = async (teamId: number) => {
  try {
    const response = await axiosInstance.get(`${TEAM_SERVICE_URL}/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch team detail:", error);
    throw error;
  }
};
