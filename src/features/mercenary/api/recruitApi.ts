// src/features/mercenary/api/recruitApi.ts

import axiosInstance from "@/lib/axiosInstance";
import { useAuthStore } from "@/stores/useAuthStore";
import { getProfileByAccountIdApi } from "@/features/auth/api/userApi";
import type {
  PostType,
  RecruitPostCreationRequestDto,
  RecruitPostResponseDto,
  RecruitPostUpdateRequestDto,
  RecruitCategory,
} from "@/types/recruitPost";
import type { ApplicationRequestDto } from "@/types/application";

const API_BASE_URL = "http://localhost:8084/api/recruit/posts";

export const fetchRecruitPosts = async (
  category: string,
  page: number = 0,
  size: number = 10
): Promise<PostType[]> => {
  try {
    // 프론트엔드 카테고리를 백엔드 카테고리로 매핑
    // 백엔드가 TEAM, MATCH를 그대로 사용하므로 매핑 불필요
    const categoryMap: Record<string, string> = {
      'MERCENARY': 'MERCENARY',
      'TEAM': 'TEAM',
      'MATCH': 'MATCH'
    };
    const backendCategory = categoryMap[category] || category;

    const response = await axiosInstance.get(`${API_BASE_URL}`, {
      params: { category: backendCategory, page, size },
    });
    const data: any = response.data;
    const items: any[] = Array.isArray(data)
      ? data
      : data && Array.isArray(data.content)
      ? data.content
      : [];

    // 백엔드 구조(간단 RecruitPost) → 프론트 PostType으로 안전하게 매핑
    const toPostType = (it: any): PostType => ({
      id: it.id ?? 0,
      title: it.title ?? "",
      content: it.content ?? "",
      region: it.region ?? "",
      subRegion: it.subRegion ?? null,
      thumbnailUrl: it.imageUrl ?? null,
      category: (category as unknown as RecruitCategory) ?? "MERCENARY",
      targetType: it.targetType ?? "USER",
      fromParticipant: it.fromParticipant ?? "INDIVIDUAL",
      toParticipant: it.toParticipant ?? "TEAM",
      gameDate: it.matchDate ?? null,
      gameTime: it.gameTime ?? null,
      status: (it.status ?? "RECRUITING") as any,
      requiredPersonnel: it.requiredPersonnel ?? null,
      ageGroup: it.ageGroup ?? null,
      preferredPositions: it.preferredPositions ?? null,
      skillLevel: it.skillLevel ?? null,
      fieldLocation: it.fieldLocation ?? null,
      matchRules: it.matchRules ?? null,
      minPlayers: it.minPlayers ?? null,
      maxPlayers: it.maxPlayers ?? null,
      authorId: it.writerProfileId ?? null,
      authorName: it.authorName ?? null,
      createdAt: it.createdAt ?? new Date().toISOString(),
      updatedAt: it.updatedAt ?? new Date().toISOString(),
      acceptedCount: it.acceptedCount ?? 0,
      participants: it.acceptedCount !== undefined ? {
        current: it.acceptedCount ?? 0,
        confirmed: it.acceptedCount ?? 0,
        pending: 0,
      } : undefined,
    });

    return items.map(toPostType);
  } catch (error) {
    console.error(
      `Error fetching recruit posts for category ${category}:`,
      error
    );
    throw error;
  }
};

export const createRecruitPostApi = async (
  postData: RecruitPostCreationRequestDto
): Promise<RecruitPostResponseDto> => {
  try {
    // 보장: 작성자 프로필 ID 주입
    const { user } = useAuthStore.getState();
    let writerProfileId = (postData as any).writerProfileId;
    if (!writerProfileId && user?.profileId) writerProfileId = user.profileId;
    if (!writerProfileId && user?.id) {
      try { const prof = await getProfileByAccountIdApi(user.id); writerProfileId = (prof as any).id; } catch {}
    }
    const enriched = { ...postData, writerProfileId } as any;

    const response = await axiosInstance.post<RecruitPostResponseDto>(
      API_BASE_URL,
      enriched
    );
    return response.data;
  } catch (error: unknown) {
    // ▼▼▼ 새로운 에러 처리 방식 ▼▼▼
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(
        err.response?.data?.message || "게시글 생성 중 오류가 발생했습니다."
      );
    }
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};

export const deleteRecruitPostApi = async (postId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/${postId}`);
  } catch (error: unknown) {
    // ▼▼▼ 새로운 에러 처리 방식 ▼▼▼
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(
        err.response?.data?.message || "게시글 삭제 중 오류가 발생했습니다."
      );
    }
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};

export const updateRecruitPostApi = async (
  postId: number,
  updateData: RecruitPostUpdateRequestDto
): Promise<RecruitPostResponseDto> => {
  try {
    console.log("updateRecruitPostApi 호출:", { postId, updateData });
    const response = await axiosInstance.patch<RecruitPostResponseDto>(
      `${API_BASE_URL}/${postId}`,
      updateData
    );
    console.log("updateRecruitPostApi 응답:", response.data);
    return response.data;
  } catch (error: unknown) {
    console.error("updateRecruitPostApi 에러:", error);
    // ▼▼▼ 새로운 에러 처리 방식 ▼▼▼
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as {
        response?: { data?: { message?: string }; status?: number };
      };
      console.error("HTTP 응답 에러:", err.response);
      throw new Error(
        err.response?.data?.message ||
          `게시글 수정 중 오류가 발생했습니다. (HTTP ${err.response?.status})`
      );
    }
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};

export const applyToPostApi = async (
  postId: number,
  applicationData: ApplicationRequestDto
): Promise<any> => {
  try {
    const { user } = useAuthStore.getState();
    let applicantProfileId = user?.profileId;
    if (!applicantProfileId && user?.id) {
      try { const prof = await getProfileByAccountIdApi(user.id); applicantProfileId = (prof as any).id; } catch {}
    }
    const payload: any = {
      applicantProfileId,
      description: (applicationData as any).message ?? (applicationData as any).description ?? undefined,
    };
    
    const response = await axiosInstance.post(`${API_BASE_URL}/${postId}/applications`, payload);
    
    // 신청 후 작성자에게 알림 발송
    try {
      const postResponse = await axiosInstance.get(`${API_BASE_URL}/${postId}`);
      const post = postResponse.data;
      
      if (post.writerProfileId && user?.id) {
        // 작성자의 계정 정보를 가져와서 알림 발송
        // 여기서는 간단하게 writerProfileId를 userId로 사용 (실제로는 프로필ID -> 계정ID 변환 필요)
        const { createNotificationApi } = await import("@/features/notification/api/notificationApi");
        await createNotificationApi({
          userId: post.writerProfileId, // 실제로는 프로필 ID를 계정 ID로 변환해야 함
          type: "APPLICATION_RECEIVED" as any,
          title: "새로운 신청이 도착했습니다!",
          message: `'${post.title}' 모집글에 새로운 신청이 도착했습니다.`,
          relatedId: postId,
        });
      }
    } catch (notificationError) {
      console.error("알림 발송 실패:", notificationError);
      // 알림 실패해도 신청은 성공한 것으로 처리
    }
    
    return response.data;
  } catch (error: unknown) {
    // ▼▼▼ 새로운 에러 처리 방식 ▼▼▼
    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(
        err.response?.data?.message || "신청 처리 중 오류가 발생했습니다."
      );
    }
    throw new Error("알 수 없는 오류가 발생했습니다.");
  }
};
