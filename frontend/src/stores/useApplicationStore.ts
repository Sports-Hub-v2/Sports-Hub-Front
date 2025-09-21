// src/stores/useApplicationStore.ts

import { create } from "zustand";
import type { MyApplication, ReceivedApplication } from "@/types/application";
import type { NotificationType } from "@/types/notification";
import { 
  getMyApplicationsByApplicantApi, 
  getReceivedApplicationsApi,
  acceptApplicationApi,
  rejectApplicationApi,
  cancelApplicationApi
} from "@/features/application/api/applicationApi";
import { createNotificationApi } from "@/features/notification/api/notificationApi";
import { getProfileByAccountIdApi } from "@/features/auth/api/userApi";

interface ApplicationState {
  myApplications: MyApplication[];
  receivedApplications: ReceivedApplication[];
  isLoadingMy: boolean;
  isLoadingReceived: boolean;
  
  // Actions
  loadMyApplications: (userId: number) => Promise<void>;
  loadReceivedApplications: (userId: number) => Promise<void>;
  refreshApplications: (userId: number) => Promise<void>;
  acceptApplication: (applicationId: number, postId: number) => Promise<void>;
  rejectApplication: (applicationId: number, postId: number) => Promise<void>;
  cancelApplication: (applicationId: number, postId: number) => Promise<void>;
}

export const useApplicationStore = create<ApplicationState>((set, get) => ({
  myApplications: [],
  receivedApplications: [],
  isLoadingMy: false,
  isLoadingReceived: false,

  loadMyApplications: async (userId: number) => {
    set({ isLoadingMy: true });
    try {
      const profile = await getProfileByAccountIdApi(userId);
      const applications = await getMyApplicationsByApplicantApi(profile.id);
      set({ myApplications: applications });
    } catch (error) {
      console.error("내 신청 내역 로드 실패:", error);
      set({ myApplications: [] });
    } finally {
      set({ isLoadingMy: false });
    }
  },

  loadReceivedApplications: async (profileId: number) => {
    set({ isLoadingReceived: true });
    try {
      const applications = await getReceivedApplicationsApi(profileId);
      set({ receivedApplications: applications });
    } catch (error) {
      console.error("받은 신청 내역 로드 실패:", error);
      set({ receivedApplications: [] });
    } finally {
      set({ isLoadingReceived: false });
    }
  },

  refreshApplications: async (userId: number) => {
    await Promise.all([
      get().loadMyApplications(userId),
      get().loadReceivedApplications(userId)
    ]);
  },

  acceptApplication: async (applicationId: number, postId: number) => {
    try {
      await acceptApplicationApi(applicationId, postId);
      
      // 받은 신청 목록을 업데이트
      const updatedApp = get().receivedApplications.find(app => app.applicationId === applicationId);
      set((state) => ({
        receivedApplications: state.receivedApplications.map((app) =>
          app.applicationId === applicationId
            ? { ...app, status: "ACCEPTED" as any }
            : app
        ),
      }));

      // 신청자에게 알림 발송
      if (updatedApp) {
        try {
          await createNotificationApi({
            receiverProfileId: updatedApp.applicantId,
            type: "APPLICATION_ACCEPTED",
            message: `'${updatedApp.postTitle}' 모집글에 대한 신청이 승인되었습니다.`,
            relatedType: "RECRUIT_POST",
            relatedId: postId,
          });
        } catch (notificationError) {
          console.error("알림 발송 실패:", notificationError);
        }
      }
    } catch (error) {
      console.error("신청 승인 실패:", error);
      throw error;
    }
  },

  rejectApplication: async (applicationId: number, postId: number) => {
    try {
      await rejectApplicationApi(applicationId, postId);
      
      // 받은 신청 목록을 업데이트
      const updatedApp = get().receivedApplications.find(app => app.applicationId === applicationId);
      set((state) => ({
        receivedApplications: state.receivedApplications.map((app) =>
          app.applicationId === applicationId
            ? { ...app, status: "REJECTED" as any }
            : app
        ),
      }));

      // 신청자에게 알림 발송
      if (updatedApp) {
        try {
          await createNotificationApi({
            receiverProfileId: updatedApp.applicantId,
            type: "APPLICATION_REJECTED",
            message: `'${updatedApp.postTitle}' 모집글에 대한 신청이 거절되었습니다.`,
            relatedType: "RECRUIT_POST",
            relatedId: postId,
          });
        } catch (notificationError) {
          console.error("알림 발송 실패:", notificationError);
        }
      }
    } catch (error) {
      console.error("신청 거절 실패:", error);
      throw error;
    }
  },

  cancelApplication: async (applicationId: number, postId: number) => {
    try {
      await cancelApplicationApi(applicationId, postId);
      // 내 신청 목록에서 제거
      set((state) => ({
        myApplications: state.myApplications.filter(
          (app) => app.applicationId !== applicationId
        ),
      }));
    } catch (error) {
      console.error("신청 취소 실패:", error);
      throw error;
    }
  },
}));
