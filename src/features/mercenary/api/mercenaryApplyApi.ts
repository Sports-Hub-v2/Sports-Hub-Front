// src/features/mercenary/api/mercenaryApplyApi.ts
import axiosInstance from "@/lib/axiosInstance.ts";
import { ApplicationRequestDto } from "@/types/application.ts";
import { useAuthStore } from "@/stores/useAuthStore";
import { getProfileByAccountIdApi } from "@/features/auth/api/userApi";
import { createNotificationApi } from "@/features/notification/api/notificationApi";

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
    let applicantProfileId = user?.profileId;
    if (!applicantProfileId && user?.id) {
      try {
        const prof = await getProfileByAccountIdApi(user.id);
        applicantProfileId = (prof as any).id;
      } catch {}
    }
    const body: any = {
      applicantProfileId,
      description: payload.description ?? payload.message ?? undefined,
    };
    
    // 신청 요청
    const response = await axiosInstance.post(
      `${API_BASE_URL}/${postid}/applications`,
      body
    );

    // 게시글 작성자에게 알림 생성
    try {
      // 게시글 정보 가져오기
      const postResponse = await axiosInstance.get(`${API_BASE_URL}/${postid}`);
      const post = postResponse.data;
      
      if (post && post.writerProfileId) {
        await createNotificationApi({
          receiverProfileId: post.writerProfileId,
          type: "APPLICATION_RECEIVED",
          message: `'${post.title}' 모집글에 새로운 신청이 들어왔습니다.`,
          relatedType: "RECRUIT_POST",
          relatedId: postid,
        });
        console.log("🔔 신청 알림 생성 완료");
      }
    } catch (notificationError) {
      console.error("🔔 신청 알림 생성 실패:", notificationError);
      // 알림 생성 실패해도 신청은 성공으로 처리
    }

    return response.data;
  } catch (error) {
    console.error("용병 신청 실패:", error);
    throw error;
  }
};
