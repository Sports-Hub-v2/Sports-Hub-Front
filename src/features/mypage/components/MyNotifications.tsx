// src/features/mypage/components/MyNotifications.tsx

import React, { useEffect } from 'react';
import { useAuthStore } from '@/stores/useAuthStore';
import { useNotificationStore } from '@/stores/useNotificationStore';
import type { Notification } from '@/types/notification';

const MyNotifications: React.FC = () => {
  const { user } = useAuthStore();
  const { 
    notifications, 
    unreadCount,
    isLoading, 
    loadNotifications, 
    markAsRead, 
    markAllAsRead,
    deleteNotification 
  } = useNotificationStore();

  useEffect(() => {
    if (user?.profileId) {
      loadNotifications(user.profileId);
    }
  }, [user?.profileId, loadNotifications]);

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error("알림 읽음 처리 실패:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (user?.profileId) {
      try {
        await markAllAsRead(user.profileId);
      } catch (error) {
        console.error("모든 알림 읽음 처리 실패:", error);
      }
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    if (window.confirm('이 알림을 삭제하시겠습니까?')) {
      try {
        await deleteNotification(notificationId);
      } catch (error) {
        console.error("알림 삭제 실패:", error);
      }
    }
  };

  // 알림 타입에 따른 제목 생성
  const getNotificationTitle = (notification: Notification) => {
    switch (notification.type) {
      case "APPLICATION_RECEIVED":
        return "새로운 신청";
      case "APPLICATION_ACCEPTED":
        return "신청 승인";
      case "APPLICATION_REJECTED":
        return "신청 거절";
      case "WELCOME":
        return "환영합니다";
      default:
        return "알림";
    }
  };

  // 알림 타입에 따른 아이콘
  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "APPLICATION_RECEIVED":
        return "📥";
      case "APPLICATION_ACCEPTED":
        return "✅";
      case "APPLICATION_REJECTED":
        return "❌";
      case "WELCOME":
        return "👋";
      default:
        return "🔔";
    }
  };

  if (isLoading) {
    return <div className="py-8 text-center">알림을 불러오는 중...</div>;
  }

  return (
    <div className="space-y-4">
      {/* 헤더 */}
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold border-b pb-2">
          알림 목록
          {unreadCount > 0 && (
            <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {unreadCount}
            </span>
          )}
        </h3>
        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllAsRead}
            className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
          >
            모두 읽음
          </button>
        )}
      </div>

      {/* 알림 목록 */}
      {notifications.length === 0 ? (
        <p className="py-8 text-center text-gray-500">알림이 없습니다.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 border rounded-lg transition-colors ${
                !notification.isRead 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3 flex-1">
                  {/* 아이콘 */}
                  <span className="text-2xl">
                    {getNotificationIcon(notification.type)}
                  </span>
                  
                  {/* 내용 */}
                  <div className="flex-1">
                    <h4 className={`text-sm font-medium ${
                      !notification.isRead ? 'font-semibold text-gray-900' : 'text-gray-700'
                    }`}>
                      {getNotificationTitle(notification)}
                    </h4>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(notification.createdAt).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>

                {/* 액션 버튼들 */}
                <div className="flex items-center space-x-2 ml-4">
                  {!notification.isRead && (
                    <button
                      onClick={() => handleMarkAsRead(notification.id)}
                      className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200"
                    >
                      읽음
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteNotification(notification.id)}
                    className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded hover:bg-red-200"
                  >
                    삭제
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNotifications;