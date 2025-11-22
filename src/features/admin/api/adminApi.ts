// src/features/admin/api/adminApi.ts

import axiosInstance from "@/lib/axiosInstance";
import { mockUsers, mockMatches, mockPosts, mockReports, mockApiDelay } from "../mock/mockAdminData";

// Microservices API URLs
const USER_SERVICE_URL = "http://localhost:8082/api";
const TEAM_SERVICE_URL = "http://localhost:8083/api";
const RECRUIT_SERVICE_URL = "http://localhost:8084/api";

// Mock mode flag - set to true to use mock data instead of real API
const USE_MOCK_DATA = false;

/**
 * 관리자 대시보드 통계 조회
 */
export const fetchAdminStatsApi = async () => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayUsers = mockUsers.filter(u => {
      const createdAt = new Date(u.createdAt);
      return createdAt >= today;
    }).length;

    const todayMatches = mockMatches.filter(m => {
      const matchDate = new Date(m.matchDate);
      return matchDate.toDateString() === today.toDateString();
    }).length;

    return {
      totalUsers: mockUsers.length,
      totalTeams: 7, // From backend teams count
      totalPosts: mockPosts.length,
      totalMatches: mockMatches.length,
      todayUsers,
      todayMatches,
      todayActiveUsers: Math.floor(mockUsers.length * 0.45),
      pendingReports: mockReports.filter(r => r.status === 'PENDING').length,
    };
  }

  try {
    // 팀, 게시물, 사용자 데이터 가져오기
    const [teamsResponse, postsResponse, usersResponse] = await Promise.all([
      axiosInstance.get(`${TEAM_SERVICE_URL}/teams`).catch(() => ({ data: [] })),
      axiosInstance.get(`${RECRUIT_SERVICE_URL}/recruit/posts`).catch(() => ({ data: [] })),
      axiosInstance.get(`${USER_SERVICE_URL}/users/profiles`).catch(() => ({ data: [] }))
    ]);

    const totalTeams = Array.isArray(teamsResponse.data) ? teamsResponse.data.length : 0;
    const totalPosts = Array.isArray(postsResponse.data) ? postsResponse.data.length : 0;
    const totalUsers = Array.isArray(usersResponse.data) ? usersResponse.data.length : 0;

    // 오늘 날짜 계산
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // 오늘 작성된 게시물 수 계산
    const todayPosts = Array.isArray(postsResponse.data)
      ? postsResponse.data.filter((p: any) => {
          const createdAt = new Date(p.createdAt);
          return createdAt >= today;
        }).length
      : 0;

    // 오늘 가입한 사용자 수 계산
    const todayUsers = Array.isArray(usersResponse.data)
      ? usersResponse.data.filter((u: any) => {
          const createdAt = new Date(u.createdAt);
          return createdAt >= today;
        }).length
      : 0;

    return {
      totalUsers,
      totalTeams,
      totalPosts,
      totalMatches: 0, // TODO: 경기 API 구현 필요
      todayUsers,
      todayMatches: 0,
      todayActiveUsers: 0, // TODO: 활동 사용자 API 필요
      pendingReports: 0, // TODO: 신고 API 추가 필요
    };
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    // 에러 발생 시 빈 통계 반환
    return {
      totalUsers: 0,
      totalTeams: 0,
      totalPosts: 0,
      totalMatches: 0,
      todayUsers: 0,
      todayMatches: 0,
      todayActiveUsers: 0,
      pendingReports: 0,
    };
  }
};

/**
 * 사용자 목록 조회 (관리자)
 */
export const fetchUsersApi = async (page: number = 0, size: number = 20) => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    const start = page * size;
    const end = start + size;
    const paginatedUsers = mockUsers.slice(start, end);

    return {
      content: paginatedUsers,
      totalElements: mockUsers.length,
      totalPages: Math.ceil(mockUsers.length / size),
      number: page,
      size: size,
    };
  }

  try {
    const response = await axiosInstance.get(`${USER_SERVICE_URL}/users/profiles`, {
      params: { page, size },
    });

    // 백엔드가 배열로 반환하는 경우 페이지네이션 형식으로 변환
    if (Array.isArray(response.data)) {
      return {
        content: response.data,
        totalElements: response.data.length,
        totalPages: Math.ceil(response.data.length / size),
        number: page,
        size: size,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Failed to fetch users:", error);
    // 엔드포인트 미구현 시 빈 데이터 반환
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: page,
      size: size,
    };
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

    // 백엔드가 배열로 반환하는 경우 페이지네이션 형식으로 변환
    if (Array.isArray(response.data)) {
      const start = page * size;
      const end = start + size;
      const paginatedTeams = response.data.slice(start, end);

      return {
        content: paginatedTeams,
        totalElements: response.data.length,
        totalPages: Math.ceil(response.data.length / size),
        number: page,
        size: size,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: page,
      size: size,
    };
  }
};

/**
 * 경기 목록 조회 (관리자)
 */
export const fetchMatchesApi = async (page: number = 0, size: number = 20) => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    const start = page * size;
    const end = start + size;
    const paginatedMatches = mockMatches.slice(start, end);

    return {
      content: paginatedMatches,
      totalElements: mockMatches.length,
      totalPages: Math.ceil(mockMatches.length / size),
      number: page,
      size: size,
    };
  }

  try {
    const response = await axiosInstance.get(`${RECRUIT_SERVICE_URL}/matches`, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: page,
      size: size,
    };
  }
};

/**
 * 게시물 목록 조회 (관리자)
 * @param page 페이지 번호
 * @param size 페이지 크기
 * @param category 카테고리 필터 (MERCENARY, TEAM, MATCH 등)
 */
export const fetchPostsApi = async (page: number = 0, size: number = 20, category?: string) => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();

    let filteredPosts = mockPosts;
    if (category && category !== 'all') {
      filteredPosts = mockPosts.filter(p => p.category === category);
    }

    const start = page * size;
    const end = start + size;
    const paginatedPosts = filteredPosts.slice(start, end);

    return {
      content: paginatedPosts,
      totalElements: filteredPosts.length,
      totalPages: Math.ceil(filteredPosts.length / size),
      number: page,
      size: size,
    };
  }

  try {
    const params: any = { page, size };
    if (category && category !== 'all') {
      params.category = category;
    }
    const response = await axiosInstance.get(`${RECRUIT_SERVICE_URL}/recruit/posts`, {
      params,
    });

    // 백엔드가 배열로 반환하는 경우 페이지네이션 형식으로 변환
    if (Array.isArray(response.data)) {
      let filteredPosts = response.data;
      if (category && category !== 'all') {
        filteredPosts = response.data.filter((p: any) => p.category === category);
      }

      const start = page * size;
      const end = start + size;
      const paginatedPosts = filteredPosts.slice(start, end);

      return {
        content: paginatedPosts,
        totalElements: filteredPosts.length,
        totalPages: Math.ceil(filteredPosts.length / size),
        number: page,
        size: size,
      };
    }

    return response.data;
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    return {
      content: [],
      totalElements: 0,
      totalPages: 0,
      number: page,
      size: size,
    };
  }
};

/**
 * 신고 목록 조회 (관리자)
 */
export const fetchReportsApi = async (page: number = 0, size: number = 20) => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    const start = page * size;
    const end = start + size;
    const paginatedReports = mockReports.slice(start, end);

    return {
      content: paginatedReports,
      totalElements: mockReports.length,
      totalPages: Math.ceil(mockReports.length / size),
      number: page,
      size: size,
    };
  }

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
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    const user = mockUsers.find(u => u.id === userId);
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }

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

// ==================== 관리 액션 API ====================

/**
 * 사용자 정지
 */
export const suspendUserApi = async (userId: number, reason: string, duration?: number) => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    console.log(`[MOCK] Suspending user ${userId} for ${duration} days. Reason: ${reason}`);
    return { success: true, message: "User suspended successfully (mock)" };
  }

  try {
    const response = await axiosInstance.post(`${USER_SERVICE_URL}/profiles/${userId}/suspend`, {
      reason,
      duration, // days
    });
    return response.data;
  } catch (error) {
    console.error("Failed to suspend user:", error);
    throw error;
  }
};

/**
 * 사용자 정지 해제
 */
export const unsuspendUserApi = async (userId: number) => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    console.log(`[MOCK] Unsuspending user ${userId}`);
    return { success: true, message: "User unsuspended successfully (mock)" };
  }

  try {
    const response = await axiosInstance.post(`${USER_SERVICE_URL}/profiles/${userId}/unsuspend`);
    return response.data;
  } catch (error) {
    console.error("Failed to unsuspend user:", error);
    throw error;
  }
};

/**
 * 사용자 삭제 (소프트 삭제)
 */
export const deleteUserApi = async (userId: number) => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    console.log(`[MOCK] Deleting user ${userId}`);
    return { success: true, message: "User deleted successfully (mock)" };
  }

  try {
    const response = await axiosInstance.delete(`${USER_SERVICE_URL}/profiles/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete user:", error);
    throw error;
  }
};

/**
 * 팀 인증
 */
export const verifyTeamApi = async (teamId: number) => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    console.log(`[MOCK] Verifying team ${teamId}`);
    return { success: true, message: "Team verified successfully (mock)" };
  }

  try {
    const response = await axiosInstance.post(`${TEAM_SERVICE_URL}/teams/${teamId}/verify`);
    return response.data;
  } catch (error) {
    console.error("Failed to verify team:", error);
    throw error;
  }
};

/**
 * 팀 인증 해제
 */
export const unverifyTeamApi = async (teamId: number) => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    console.log(`[MOCK] Unverifying team ${teamId}`);
    return { success: true, message: "Team unverified successfully (mock)" };
  }

  try {
    const response = await axiosInstance.post(`${TEAM_SERVICE_URL}/teams/${teamId}/unverify`);
    return response.data;
  } catch (error) {
    console.error("Failed to unverify team:", error);
    throw error;
  }
};

/**
 * 팀 해산
 */
export const disbandTeamApi = async (teamId: number, reason: string) => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    console.log(`[MOCK] Disbanding team ${teamId}. Reason: ${reason}`);
    return { success: true, message: "Team disbanded successfully (mock)" };
  }

  try {
    const response = await axiosInstance.post(`${TEAM_SERVICE_URL}/teams/${teamId}/disband`, {
      reason,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to disband team:", error);
    throw error;
  }
};

/**
 * 게시물 승인
 */
export const approvePostApi = async (postId: number) => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    console.log(`[MOCK] Approving post ${postId}`);
    return { success: true, message: "Post approved successfully (mock)" };
  }

  try {
    const response = await axiosInstance.post(`${RECRUIT_SERVICE_URL}/posts/${postId}/approve`);
    return response.data;
  } catch (error) {
    console.error("Failed to approve post:", error);
    throw error;
  }
};

/**
 * 게시물 거부
 */
export const rejectPostApi = async (postId: number, reason: string) => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    console.log(`[MOCK] Rejecting post ${postId}. Reason: ${reason}`);
    return { success: true, message: "Post rejected successfully (mock)" };
  }

  try {
    const response = await axiosInstance.post(`${RECRUIT_SERVICE_URL}/posts/${postId}/reject`, {
      reason,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to reject post:", error);
    throw error;
  }
};

/**
 * 게시물 삭제
 */
export const deletePostApi = async (postId: number) => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    console.log(`[MOCK] Deleting post ${postId}`);
    return { success: true, message: "Post deleted successfully (mock)" };
  }

  try {
    const response = await axiosInstance.delete(`${RECRUIT_SERVICE_URL}/posts/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Failed to delete post:", error);
    throw error;
  }
};

/**
 * 경기 취소
 */
export const cancelMatchApi = async (matchId: number, reason: string) => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    console.log(`[MOCK] Cancelling match ${matchId}. Reason: ${reason}`);
    return { success: true, message: "Match cancelled successfully (mock)" };
  }

  try {
    const response = await axiosInstance.post(`${RECRUIT_SERVICE_URL}/matches/${matchId}/cancel`, {
      reason,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to cancel match:", error);
    throw error;
  }
};

/**
 * 경기 완료 처리
 */
export const completeMatchApi = async (matchId: number, homeScore: number, awayScore: number) => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    console.log(`[MOCK] Completing match ${matchId}. Score: ${homeScore}-${awayScore}`);
    return { success: true, message: "Match completed successfully (mock)" };
  }

  try {
    const response = await axiosInstance.post(`${RECRUIT_SERVICE_URL}/matches/${matchId}/complete`, {
      homeScore,
      awayScore,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to complete match:", error);
    throw error;
  }
};

/**
 * 신고 처리
 */
export const resolveReportApi = async (reportId: number, action: string, note?: string) => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    console.log(`[MOCK] Resolving report ${reportId}. Action: ${action}. Note: ${note}`);
    return { success: true, message: "Report resolved successfully (mock)" };
  }

  try {
    const response = await axiosInstance.post(`${USER_SERVICE_URL}/reports/${reportId}/resolve`, {
      action,
      note,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to resolve report:", error);
    throw error;
  }
};

/**
 * 신고 기각
 */
export const rejectReportApi = async (reportId: number, reason: string) => {
  if (USE_MOCK_DATA) {
    await mockApiDelay();
    console.log(`[MOCK] Rejecting report ${reportId}. Reason: ${reason}`);
    return { success: true, message: "Report rejected successfully (mock)" };
  }

  try {
    const response = await axiosInstance.post(`${USER_SERVICE_URL}/reports/${reportId}/reject`, {
      reason,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to reject report:", error);
    throw error;
  }
};
