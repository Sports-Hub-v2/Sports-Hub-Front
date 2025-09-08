// src/features/mercenary/api/recruitApi.ts

import axiosInstance from "@/lib/axiosInstance";
import type {
  PostType,
  RecruitPostCreationRequestDto,
  RecruitPostResponseDto,
  RecruitPostUpdateRequestDto,
  RecruitCategory,
} from "@/types/recruitPost";
import type { ApplicationRequestDto } from '@/types/application';

const API_BASE_URL = "/api/recruit/posts";

export const fetchRecruitPosts = async (
  category: string,
  page: number = 0,
  size: number = 10
): Promise<PostType[]> => {
  try {
    const response = await axiosInstance.get(`${API_BASE_URL}`, {
      params: { category, page, size },
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
  } catch (error) {
    console.error(`Error fetching recruit posts for category ${category}:`, error);
    throw error;
  }
};

export const createRecruitPostApi = async (postData: RecruitPostCreationRequestDto): Promise<RecruitPostResponseDto> => {
  try {
    const response = await axiosInstance.post<RecruitPostResponseDto>(API_BASE_URL, postData);
    return response.data;
  } catch (error: unknown) {
    // ▼▼▼ 새로운 에러 처리 방식 ▼▼▼
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || '게시글 생성 중 오류가 발생했습니다.');
    }
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
};

export const deleteRecruitPostApi = async (postId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/${postId}`);
  } catch (error: unknown) {
    // ▼▼▼ 새로운 에러 처리 방식 ▼▼▼
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || '게시글 삭제 중 오류가 발생했습니다.');
    }
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
};

export const updateRecruitPostApi = async (postId: number, updateData: RecruitPostUpdateRequestDto): Promise<RecruitPostResponseDto> => {
  try {
    const response = await axiosInstance.put<RecruitPostResponseDto>(`${API_BASE_URL}/${postId}`, updateData);
    return response.data;
  } catch (error: unknown) {
    // ▼▼▼ 새로운 에러 처리 방식 ▼▼▼
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || '게시글 수정 중 오류가 발생했습니다.');
    }
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
};

export const applyToPostApi = async (postId: number, applicationData: ApplicationRequestDto): Promise<any> => {
  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/${postId}/applications`, applicationData);
    return response.data;
  } catch (error: unknown) {
    // ▼▼▼ 새로운 에러 처리 방식 ▼▼▼
    if (typeof error === 'object' && error !== null && 'response' in error) {
      const err = error as { response?: { data?: { message?: string } } };
      throw new Error(err.response?.data?.message || '신청 처리 중 오류가 발생했습니다.');
    }
    throw new Error('알 수 없는 오류가 발생했습니다.');
  }
};
