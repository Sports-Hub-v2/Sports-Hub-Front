// src/features/myPage/pages/MyPageLayout.tsx

import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import MatchDayStyleProfile from "@/components/common/MatchDayStyleProfile";
import MatchDayStyleTabs from "@/components/common/MatchDayStyleTabs";
import { getTeamsByProfileApi } from "@/features/team/api/teamApi";

const MyPageLayout: React.FC = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const [stats, setStats] = useState({
    matchesPlayed: 0,
    teamsCount: 0,
    averageRating: 0,
  });

  // 사용자 통계 데이터 로드
  useEffect(() => {
    const loadUserStats = async () => {
      const userId = user?.id;
      if (!userId) {
        console.log('MyPageLayout: user.id가 없습니다:', user);
        return;
      }

      console.log('MyPageLayout: 팀 목록 조회 시작, userId:', userId);
      
      try {
        // 소속 팀 수 조회 (accountId 기반)
        const teams = await getTeamsByProfileApi(userId);
        console.log('MyPageLayout: 조회된 팀 목록:', teams);
        
        setStats(prev => ({
          ...prev,
          teamsCount: teams.length,
          // TODO: 추후 추가 구현
          matchesPlayed: 0, // 경기 참여 기록 API 필요
          averageRating: 0,  // 평점 API 필요
        }));
        
        console.log('MyPageLayout: stats 업데이트 완료, teamsCount:', teams.length);
      } catch (error) {
        console.error('MyPageLayout: 사용자 통계 로드 에러:', error);
        // 에러시 기본값 유지
      }
    };

    loadUserStats();
  }, [user?.id]);

  // 현재 경로에 따른 탭 ID 매핑
  const getActiveTabFromPath = (pathname: string) => {
    if (pathname === "/mypage") return "overview";
    if (pathname === "/mypage/notifications") return "notifications";
    if (pathname === "/mypage/teams") return "teams";
    if (pathname === "/mypage/posts") return "posts";
    if (pathname === "/mypage/applications") return "applications";
    return "overview";
  };

  // 탭 설정
  const myPageTabs = [
    { id: "overview", label: "기본 정보", icon: undefined },
    { id: "notifications", label: "알림", icon: undefined },
    { id: "teams", label: "내 팀 목록", icon: undefined },
    { id: "posts", label: "내 글 목록", icon: undefined },
    { id: "applications", label: "신청 내역", icon: undefined },
  ];

  const handleTabChange = (tabId: string) => {
    switch (tabId) {
      case "overview":
        window.location.href = "/mypage";
        break;
      case "notifications":
        window.location.href = "/mypage/notifications";
        break;
      case "teams":
        window.location.href = "/mypage/teams";
        break;
      case "posts":
        window.location.href = "/mypage/posts";
        break;
      case "applications":
        window.location.href = "/mypage/applications";
        break;
    }
  };

  const handleEditProfile = () => {
    // TODO: 프로필 수정 페이지로 이동
    alert("프로필 수정 기능은 준비 중입니다.");
  };

  if (!user) {
    return <div className="text-center py-20 pt-24">로그인이 필요합니다.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 프로필 헤더 */}
        <div className="mb-6">
          <MatchDayStyleProfile
            user={{
              id: user.id,
              name: user.name || "사용자",
              userid: user.userid || "user",
              region: user.region,
              preferredPosition: user.preferredPosition,
              phoneNumber: user.phoneNumber,
            }}
            stats={stats}
            onEditProfile={handleEditProfile}
            showEditButton={true}
          />
        </div>

        {/* 탭 네비게이션과 콘텐츠 */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <MatchDayStyleTabs
            tabs={myPageTabs}
            activeTab={getActiveTabFromPath(location.pathname)}
            onTabChange={handleTabChange}
          />

          {/* 탭 콘텐츠 */}
          <div className="p-6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPageLayout;
