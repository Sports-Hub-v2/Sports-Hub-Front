// src/components/layout/HeaderFixed.tsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNotificationStore } from "@/stores/useNotificationStore";
import { RecruitCategory } from "@/types/recruitPost";

const HeaderFixed = () => {
  const navigate = useNavigate();
  const { isLoggedIn, user, logout } = useAuthStore();
  const { notifications, unreadCount, loadNotifications, markAsRead, markAllAsRead } = useNotificationStore();
  const [showNotifications, setShowNotifications] = useState(false);

  // 로그인 상태에서 알림 로드
  useEffect(() => {
    console.log("🔔 HeaderFixed useEffect - isLoggedIn:", isLoggedIn, "user:", user);
    if (isLoggedIn && user?.profileId) {
      console.log("🔔 알림 로드 시작 - profileId:", user.profileId);
      loadNotifications(user.profileId);
      // 30초마다 알림 새로고침
      const interval = setInterval(() => {
        console.log("🔔 알림 자동 새로고침 - profileId:", user.profileId);
        loadNotifications(user.profileId);
      }, 10 * 1000);
      return () => clearInterval(interval);
    } else {
      console.log("🔔 알림 로드 실패 - isLoggedIn:", isLoggedIn, "profileId:", user?.profileId);
    }
  }, [isLoggedIn, user?.profileId, loadNotifications]);

  // 추가 디버깅: 알림 상태 로그
  useEffect(() => {
    console.log("🔔 알림 상태 변경 - notifications:", notifications, "unreadCount:", unreadCount);
  }, [notifications, unreadCount]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNotificationClick = async (notificationId: number, isRead: boolean) => {
    if (!isRead) {
      await markAsRead(notificationId);
    }
    setShowNotifications(false);
  };

  const handleMarkAllAsRead = async () => {
    if (user?.profileId) {
      await markAllAsRead(user.profileId);
    }
  };

  // 알림 타입에 따른 제목 생성
  const getNotificationTitle = (notification: any) => {
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

  const categoryEnumToPathString = (categoryEnum: RecruitCategory): string =>
    categoryEnum.toString().toLowerCase();

  return (
    <header className="bg-[#0f1625] py-5 text-white fixed top-0 left-0 right-0 z-50">
      <div className="max-w-screen-xl mx-auto flex justify-between items-center px-4">
        <Link to="/" className="text-2xl font-bold tracking-wide">
          <span className="border-r pr-3 mr-3 text-white">Sport-Hub</span>
        </Link>

        <nav className="flex gap-8 text-white text-base font-sans">
          <Link to={`/${categoryEnumToPathString(RecruitCategory.MERCENARY)}`} className="text-white hover:text-gray-300">용병 목록</Link>
          <Link to={`/${categoryEnumToPathString(RecruitCategory.TEAM)}`} className="text-white hover:text-gray-300">팀 모집</Link>
          <Link to={`/${categoryEnumToPathString(RecruitCategory.MATCH)}`} className="text-white hover:text-gray-300">경기 모집</Link>
          {isLoggedIn && (
            <Link to="/team-manage" className="text-white hover:text-gray-300">팀 관리</Link>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <>
              {/* 알림 드롭다운 */}
              <div className="relative">
                <button
                  className="bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-1 rounded text-sm flex items-center gap-2 relative"
                  onClick={() => {
                    alert(`알림 버튼 클릭됨! 
로그인: ${isLoggedIn}
유저: ${user?.name}
ProfileId: ${user?.profileId}
알림 수: ${notifications.length}
읽지않음: ${unreadCount}`);
                    console.log("🔔 알림 버튼 클릭 - notifications:", notifications.length, "unreadCount:", unreadCount);
                    setShowNotifications(!showNotifications);
                  }}
                >
                  🔔 알림
                  {unreadCount > 0 && (
                    <span className="bg-red-500 text-white text-xs rounded-full px-2 py-0.5 min-w-[20px] text-center">
                      {unreadCount > 99 ? '99+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* 알림 드롭다운 메뉴 */}
                {showNotifications && (
                  <div className="absolute right-0 top-full mt-2 w-80 bg-white border rounded-lg shadow-lg z-50">
                    <div className="p-3 border-b bg-gray-50 rounded-t-lg">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold text-gray-900">알림</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllAsRead}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            모두 읽음
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="max-h-96 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-gray-500">
                          알림이 없습니다
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div
                            key={notification.id}
                            className={`p-3 border-b hover:bg-gray-50 cursor-pointer ${
                              !notification.isRead ? 'bg-blue-50' : ''
                            }`}
                            onClick={() => handleNotificationClick(notification.id, notification.isRead)}
                          >
                            <div className="flex justify-between items-start">
                              <div className="flex-1">
                                <h4 className={`text-sm font-medium text-gray-900 ${
                                  !notification.isRead ? 'font-semibold' : ''
                                }`}>
                                  {getNotificationTitle(notification)}
                                </h4>
                                <p className="text-sm text-gray-600 mt-1">
                                  {notification.message}
                                </p>
                                <p className="text-xs text-gray-400 mt-1">
                                  {new Date(notification.createdAt).toLocaleDateString('ko-KR', {
                                    month: 'short',
                                    day: 'numeric',
                                    hour: '2-digit',
                                    minute: '2-digit',
                                  })}
                                </p>
                              </div>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full ml-2 mt-1"></div>
                              )}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    
                    {notifications.length > 0 && (
                      <div className="p-3 border-t bg-gray-50 text-center">
                        <Link
                          to="/mypage"
                          className="text-sm text-blue-600 hover:text-blue-800"
                          onClick={() => setShowNotifications(false)}
                        >
                          마이페이지에서 모든 알림 보기
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <Link to="/mypage" className="text-white hover:underline text-sm tracking-wide">
                {user?.name}
              </Link>
              <button
                className="bg-red-500 hover:bg-red-400 text-white px-4 py-1 rounded text-sm"
                onClick={handleLogout}
              >
                로그아웃
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="bg-red-500 hover:bg-red-400 text-white px-4 py-1 rounded text-sm">
                로그인
              </Link>
              <Link to="/signup" className="bg-gray-100 hover:bg-gray-200 text-black px-4 py-1 rounded text-sm">
                회원가입
              </Link>
            </>
          )}
        </div>
      </div>

      {/* 드롭다운이 열렸을 때 백그라운드 클릭으로 닫기 */}
      {showNotifications && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowNotifications(false)}
        />
      )}
    </header>
  );
};

export default HeaderFixed;