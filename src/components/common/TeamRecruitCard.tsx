// src/components/common/TeamRecruitCard.tsx
// 매치데이 스타일의 팀 모집 카드 컴포넌트

import React from "react";
import { MapPin, Users, Calendar, Clock } from "lucide-react";
import { PostType } from "@/types/recruitPost";

interface TeamRecruitCardProps {
  post: PostType;
  onApply?: () => void;
  onClick?: () => void;
}

const TeamRecruitCard: React.FC<TeamRecruitCardProps> = ({
  post,
  onApply,
  onClick,
}) => {
  // 팀 이니셜 생성 (팀명의 첫 글자들로)
  const getTeamInitials = (teamName: string) => {
    const words = teamName.split(" ");
    if (words.length >= 2) {
      return words[0][0] + words[1][0];
    }
    return teamName.substring(0, 2);
  };

  // 색상 선택 (팀명 기반으로 일관된 색상)
  const getTeamColor = (teamName: string) => {
    const colors = [
      "bg-green-500",
      "bg-blue-500",
      "bg-purple-500",
      "bg-red-500",
      "bg-yellow-500",
      "bg-indigo-500",
      "bg-pink-500",
      "bg-orange-500",
    ];
    const hash = teamName
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // 상태 표시
  const getStatusBadge = () => {
    switch (post.status) {
      case "RECRUITING":
        return (
          <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-bold rounded-full">
            모집중
          </span>
        );
      case "COMPLETED":
        return (
          <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full">
            모집완료
          </span>
        );
      case "CANCELLED":
        return (
          <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
            취소됨
          </span>
        );
      default:
        return null;
    }
  };

  // 경기 시간 포매팅
  const formatGameTime = () => {
    if (!post.gameDate) return null;

    try {
      const date = new Date(post.gameDate);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDay = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

      let timeStr = "";
      if (post.gameTime) {
        const [hour, minute] = post.gameTime.split(":");
        const hourNum = parseInt(hour);
        timeStr = ` ${hourNum}:${minute}`;
      }

      return `${month}월 ${day}일 ${weekDay}요일${timeStr}`;
    } catch {
      return post.gameDate;
    }
  };

  // 모집 인원 정보
  const getPersonnelInfo = () => {
    if (post.requiredPersonnel) {
      return `${post.requiredPersonnel}명 모집`;
    }
    if (post.maxPlayers) {
      const current = post.participants?.current || 0;
      return `${current} / ${post.maxPlayers}명`;
    }
    return "인원 미정";
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100"
      onClick={onClick}
    >
      {/* 헤더 - 팀 로고와 상태 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* 팀 로고/이니셜 */}
            <div
              className={`w-12 h-12 rounded-full ${getTeamColor(
                post.title
              )} flex items-center justify-center text-white font-bold text-lg`}
            >
              {getTeamInitials(post.title)}
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 text-sm">
                {post.title}
              </h3>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <MapPin className="w-3 h-3" />
                <span>{post.region}</span>
                {post.subRegion && <span>・{post.subRegion}</span>}
              </div>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      {/* 본문 정보 */}
      <div className="p-4 space-y-3">
        {/* 경기 일정 정보 */}
        {post.gameDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{formatGameTime()}</span>
          </div>
        )}

        {/* 모집 인원 */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users className="w-4 h-4 text-green-500" />
          <span>{getPersonnelInfo()}</span>
        </div>

        {/* 실력 레벨 */}
        {post.skillLevel && (
          <div className="text-sm">
            <span className="inline-block px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
              {post.skillLevel}
            </span>
          </div>
        )}

        {/* 포지션 */}
        {post.preferredPositions && (
          <div className="text-sm">
            <span className="text-gray-500">모집 포지션: </span>
            <span className="text-gray-700">{post.preferredPositions}</span>
          </div>
        )}

        {/* 내용 미리보기 */}
        {post.content && (
          <p className="text-sm text-gray-600 line-clamp-2">{post.content}</p>
        )}
      </div>

      {/* 하단 - 신청 버튼 */}
      <div className="p-4 border-t border-gray-100">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleDateString()}
          </span>
          {onApply && post.status === "RECRUITING" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApply();
              }}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-medium rounded-lg transition-colors"
            >
              가입 신청
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamRecruitCard;

