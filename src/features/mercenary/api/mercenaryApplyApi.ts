// src/features/mercenary/api/mercenaryApplyApi.ts
import axiosInstance from "@/lib/axiosInstance.ts";
import { ApplicationRequestDto } from "@/types/application.ts";
import { useAuthStore } from "@/stores/useAuthStore";

const API_BASE_URL = "/api/recruit/posts";

export interface MercenaryRequest {
  message: string;
}

export const applyMercenary = async (
  postid: number,
  payload: ApplicationRequestDto
) => {
  try {
    const { user } = useAuthStore.getState();
    const applicantProfileId = user?.profileId;
    const body: any = {
      applicantProfileId,
      description: payload.description ?? payload.message ?? undefined,
    };
    const response = await axiosInstance.post(
      `${API_BASE_URL}/${postid}/applications`,
      body
    );
    return response.data;
  } catch (error) {
    console.error("용병 신청 실패:", error);
    throw error;
  }
};

