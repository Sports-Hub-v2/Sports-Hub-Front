// src/components/common/MatchDayStyleProfile.tsx
// 매치데이 스타일의 사용자 프로필 컴포넌트

import React from "react";
import { MapPin, Calendar, Trophy, Users, Star, Edit3 } from "lucide-react";

interface MatchDayStyleProfileProps {
  user: {
    id: number;
    name: string;
    userid: string;
    region?: string;
    preferredPosition?: string;
    phoneNumber?: string;
    profileImageUrl?: string;
  };
  stats?: {
    matchesPlayed: number;
    teamsCount: number;
    averageRating: number;
  };
  onEditProfile?: () => void;
  showEditButton?: boolean;
}

const MatchDayStyleProfile: React.FC<MatchDayStyleProfileProps> = ({
  user,
  stats,
  onEditProfile,
  showEditButton = true,
}) => {
  // 사용자 이니셜 생성
  const getUserInitials = (name: string) => {
    const words = name.split(" ");
    if (words.length >= 2) {
      return words[0][0] + words[1][0];
    }
    return name.substring(0, 2);
  };

  // 사용자별 색상 (일관성 있게)
  const getUserColor = (name: string) => {
    const colors = [
      "bg-emerald-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-red-500",
      "bg-indigo-500",
    ];
    const hash = name
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // 등급 뱃지 (임시 데이터)
  const getGradeBadge = () => {
    return (
      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
        중급
      </span>
    );
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      {/* 헤더 배경 */}
      <div className="h-32 bg-gradient-to-r from-blue-400 to-green-400"></div>

      {/* 프로필 정보 */}
      <div className="relative px-6 pb-6">
        {/* 프로필 이미지/아바타 */}
        <div className="flex items-end justify-between -mt-16 mb-4">
          <div className="flex items-end gap-4">
            {user.profileImageUrl ? (
              <img
                src={user.profileImageUrl}
                alt={user.name}
                className="w-24 h-24 rounded-full border-4 border-white shadow-lg"
              />
            ) : (
              <div
                className={`w-24 h-24 rounded-full border-4 border-white shadow-lg ${getUserColor(
                  user.name
                )} flex items-center justify-center text-white font-bold text-2xl`}
              >
                {getUserInitials(user.name)}
              </div>
            )}

            {/* 등급 뱃지 */}
            <div className="mb-2">{getGradeBadge()}</div>
          </div>

          {/* 수정 버튼 */}
          {showEditButton && (
            <button
              onClick={onEditProfile}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
            >
              <Edit3 className="w-4 h-4" />
              <span className="text-sm font-medium">프로필 수정</span>
            </button>
          )}
        </div>

        {/* 기본 정보 */}
        <div className="space-y-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{user.name}</h1>
            <p className="text-gray-500">@{user.userid}</p>
          </div>

          {/* 상세 정보 */}
          <div className="flex flex-wrap gap-4 text-sm text-gray-600">
            {user.region && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{user.region}</span>
              </div>
            )}

            {user.preferredPosition && (
              <div className="flex items-center gap-1">
                <Trophy className="w-4 h-4" />
                <span>{user.preferredPosition}</span>
              </div>
            )}
          </div>
        </div>

        {/* 통계 정보 */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {stats?.matchesPlayed || 0}
            </div>
            <div className="text-sm text-gray-500">참여한 경기</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {stats?.teamsCount || 0}
            </div>
            <div className="text-sm text-gray-500">소속 팀</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-gray-900">
              {stats?.averageRating ? stats.averageRating.toFixed(1) : '0.0'}
            </div>
            <div className="text-sm text-gray-500">평균 평점</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MatchDayStyleProfile;


