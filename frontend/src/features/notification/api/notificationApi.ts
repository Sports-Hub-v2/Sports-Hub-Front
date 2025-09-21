// src/features/notification/api/notificationApi.ts

import axiosInstance from "@/lib/axiosInstance";
import type { Notification, NotificationRequestDto } from "@/types/notification";

const API_BASE_URL = "/api/notifications";

// 내 알림 목록 조회 (profileId 기반)
export const getMyNotificationsApi = async (profileId: number): Promise<Notification[]> => {
  try {
    console.log("🔔 알림 API 호출 - profileId:", profileId);
    const response = await axiosInstance.get(`${API_BASE_URL}?receiverProfileId=${profileId}`);
    console.log("🔔 알림 API 성공 응답:", response.data);
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    console.error("🔔 알림 API 실패:", error);
    return [];
  }
};

// 알림 읽음 처리
export const markNotificationAsReadApi = async (notificationId: number): Promise<void> => {
  try {
    await axiosInstance.post(`${API_BASE_URL}/${notificationId}/read`);
  } catch (error) {
    console.error("알림 읽음 처리 실패:", error);
    throw error;
  }
};

// 모든 알림 읽음 처리 (현재 백엔드에 없으므로 개별 처리로 대체)
export const markAllNotificationsAsReadApi = async (profileId: number): Promise<void> => {
  try {
    // 우선 개별 읽음 처리로 구현 (백엔드에 bulk API 없음)
    const notifications = await getMyNotificationsApi(profileId);
    const unreadNotifications = notifications.filter(n => !n.isRead);
    
    for (const notification of unreadNotifications) {
      await markNotificationAsReadApi(notification.id);
    }
  } catch (error) {
    console.error("모든 알림 읽음 처리 실패:", error);
    throw error;
  }
};

// 알림 삭제
export const deleteNotificationApi = async (notificationId: number): Promise<void> => {
  try {
    await axiosInstance.delete(`${API_BASE_URL}/${notificationId}`);
  } catch (error) {
    console.error("알림 삭제 실패:", error);
    throw error;
  }
};

// 알림 생성 (시스템에서 사용)
export const createNotificationApi = async (notification: NotificationRequestDto): Promise<Notification> => {
  try {
    const response = await axiosInstance.post<Notification>(API_BASE_URL, notification);
    return response.data;
  } catch (error) {
    console.error("알림 생성 실패:", error);
    throw error;
  }
};
