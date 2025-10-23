// src/stores/useNotificationStore.ts

import { create } from "zustand";
import type { Notification } from "@/types/notification";
import { 
  getMyNotificationsApi, 
  markNotificationAsReadApi, 
  markAllNotificationsAsReadApi,
  deleteNotificationApi
} from "@/features/notification/api/notificationApi";

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  
  // Actions
  loadNotifications: (profileId: number) => Promise<void>;
  markAsRead: (notificationId: number) => Promise<void>;
  markAllAsRead: (profileId: number) => Promise<void>;
  deleteNotification: (notificationId: number) => Promise<void>;
  addNotification: (notification: Notification) => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCount: 0,
  isLoading: false,

  loadNotifications: async (profileId: number) => {
    console.log("🔔 NotificationStore loadNotifications 시작 - profileId:", profileId);
    set({ isLoading: true });
    try {
      const notifications = await getMyNotificationsApi(profileId);
      console.log("🔔 알림 API 응답:", notifications);
      const unreadCount = notifications.filter(n => !n.isRead).length;
      console.log("🔔 읽지 않은 알림 수:", unreadCount);
      set({ notifications, unreadCount });
    } catch (error) {
      console.error("🔔 알림 로드 실패:", error);
      set({ notifications: [], unreadCount: 0 });
    } finally {
      set({ isLoading: false });
    }
  },

  markAsRead: async (notificationId: number) => {
    try {
      await markNotificationAsReadApi(notificationId);
      set((state) => ({
        notifications: state.notifications.map((n) =>
          n.id === notificationId ? { ...n, isRead: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1),
      }));
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
      throw error;
    }
  },

  markAllAsRead: async (profileId: number) => {
    try {
      await markAllNotificationsAsReadApi(profileId);
      set((state) => ({
        notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
        unreadCount: 0,
      }));
    } catch (error) {
      console.error("모든 알림 읽음 처리 실패:", error);
      throw error;
    }
  },

  deleteNotification: async (notificationId: number) => {
    try {
      await deleteNotificationApi(notificationId);
      set((state) => {
        const notificationToDelete = state.notifications.find(n => n.id === notificationId);
        const newUnreadCount = notificationToDelete && !notificationToDelete.isRead 
          ? Math.max(0, state.unreadCount - 1)
          : state.unreadCount;
        
        return {
          notifications: state.notifications.filter((n) => n.id !== notificationId),
          unreadCount: newUnreadCount,
        };
      });
    } catch (error) {
      console.error("알림 삭제 실패:", error);
      throw error;
    }
  },

  addNotification: (notification: Notification) => {
    set((state) => ({
      notifications: [notification, ...state.notifications],
      unreadCount: notification.isRead ? state.unreadCount : state.unreadCount + 1,
    }));
  },
}));
