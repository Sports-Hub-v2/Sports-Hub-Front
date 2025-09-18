// src/features/mypage/pages/MyPage.tsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserResponseDto } from "@/types/user";
import MatchDayStyleProfile from "@/components/common/MatchDayStyleProfile";
import MatchDayStyleTabs, {
  defaultMyPageTabs,
} from "@/components/common/MatchDayStyleTabs";
import MatchDayStyleActivity, {
  sampleActivities,
} from "@/components/common/MatchDayStyleActivity";
import UserTeamsList from "@/features/mypage/components/UserTeamList";
// import { deleteMyAccountApi } from '@/features/auth/api/authApi'; // 실제 탈퇴 API 함수 경로

const MyPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuthStore();
  const [myInfo, setMyInfo] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate("/login");
      return;
    }
    // useAuthStore의 user 객체를 UserResponseDto 타입으로 간주
    setMyInfo(user as UserResponseDto); // 타입 단언의 정확성 확인 필요
    setIsLoading(false);
  }, [user, isLoggedIn, navigate]);

  const handleEditProfile = () => {
    navigate("/mypage/edit"); // 프로필 수정 페이지로 이동
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "정말로 회원 탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다."
      )
    ) {
      try {
        // await deleteMyAccountApi(); // 실제 탈퇴 API 호출
        alert("회원 탈퇴가 처리되었습니다. 메인 페이지로 이동합니다.");
        logout();
        navigate("/");
      } catch (err) {
        console.error("Error deleting account:", err);
        setError("회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.");
      }
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-20 pt-24">
        내 정보를 불러오는 중입니다...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 pt-24 text-red-500">오류: {error}</div>
    );
  }

  if (!myInfo) {
    return (
      <div className="text-center py-20 pt-24">
        사용자 정보를 찾을 수 없습니다.
      </div>
    );
  }

  // 날짜 포맷팅 함수 (간단 예시)
  const formatDate = (dateString?: string) => {
    if (!dateString) return "정보 없음";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

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
              id: myInfo.id,
              name: myInfo.name,
              userid: myInfo.userid,
              region: myInfo.region,
              preferredPosition: myInfo.preferredPosition,
              phoneNumber: myInfo.phoneNumber,
            }}
            onEditProfile={handleEditProfile}
            showEditButton={true}
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

        {/* 계정 관리 섹션 */}
        <div className="mt-6 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            계정 관리
          </h2>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => alert("비밀번호 변경 기능은 준비 중입니다.")}
              className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
            >
              비밀번호 변경
            </button>
            <button
              onClick={handleDeleteAccount}
              className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg transition-colors text-sm font-medium"
            >
              회원 탈퇴
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
