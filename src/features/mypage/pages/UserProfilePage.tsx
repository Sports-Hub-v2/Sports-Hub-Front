// src/features/myPage/pages/UserProfilePage.tsx

import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchPublicUserProfileApi } from "@/features/auth/api/userApi";
import type { PublicUserProfileResponseDto } from "@/types/user";
import MatchDayStyleProfile from "@/components/common/MatchDayStyleProfile";
import MatchDayStyleTabs, {
  defaultMyPageTabs,
} from "@/components/common/MatchDayStyleTabs";
import MatchDayStyleActivity, {
  sampleActivities,
} from "@/components/common/MatchDayStyleActivity";

// 1. 소속팀 목록을 보여주는 컴포넌트를 임포트합니다.
import UserTeamsList from "../components/UserTeamList";

const UserProfilePage: React.FC = () => {
  // 2. URL 파라미터에서 userId를 가져옵니다. (예: /profile/123 -> userId는 "123")
  const { userId } = useParams<{ userId: string }>();

  const [profile, setProfile] = useState<PublicUserProfileResponseDto | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const profileData = await fetchPublicUserProfileApi(userId);
        setProfile(profileData);
      } catch (err) {
        setError("프로필 정보를 불러오는 데 실패했습니다.");
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (isLoading) {
    return (
      <div className="text-center py-20 pt-24">프로필을 불러오는 중...</div>
    );
  }

  if (error || !profile) {
    return (
      <div className="text-center py-20 pt-24 text-red-500">
        {error || "사용자를 찾을 수 없습니다."}
      </div>
    );
  }

  // 탭별 콘텐츠 렌더링
  const renderTabContent = () => {
    switch (activeTab) {
      case "overview":
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              예정된 경기
            </h3>
            <MatchDayStyleActivity
              activities={sampleActivities.filter(
                (a) => a.status === "upcoming"
              )}
              emptyMessage="예정된 경기가 없습니다"
            />
          </div>
        );
      case "teams":
        return (
          <div className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              참여한 경기
            </h3>
            <MatchDayStyleActivity
              activities={sampleActivities}
              emptyMessage="참여한 경기 이력이 없습니다"
            />
          </div>
        );
      case "posts":
        return (
          <div className="p-6">
            <UserTeamsList />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-16">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* 프로필 헤더 */}
        <div className="mb-6">
          <MatchDayStyleProfile
            user={{
              id: parseInt(userId || "0"),
              name: profile.name,
              userid: profile.userid,
              region: profile.region,
              preferredPosition: profile.preferredPosition,
            }}
            showEditButton={false} // 다른 사용자 프로필이므로 수정 버튼 숨김
          />
        </div>

        {/* 탭 네비게이션 */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <MatchDayStyleTabs
            tabs={defaultMyPageTabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />

          {/* 탭 콘텐츠 */}
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
