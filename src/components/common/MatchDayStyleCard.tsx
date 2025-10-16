// src/components/common/MatchDayStyleCard.tsx
// 매치데이 완전 동일 스타일의 카드 컴포넌트

import React from "react";
import { MapPin, Users, Calendar, Clock } from "lucide-react";
import { PostType } from "@/types/recruitPost";

interface MatchDayStyleCardProps {
  post: PostType;
  onApply?: () => void;
  onClick?: () => void;
  cardType?: "team" | "match";
}

const MatchDayStyleCard: React.FC<MatchDayStyleCardProps> = ({
  post,
  onApply,
  onClick,
  cardType = "team",
}) => {
  // 팀 이니셜 생성
  const getTeamInitials = (title: string) => {
    const words = title.split(" ");
    if (words.length >= 2) {
      return words[0][0] + words[1][0];
    }
    return title.substring(0, 2);
  };

  // 매치데이 색상 팔레트
  const getAvatarColor = (title: string) => {
    const colors = [
      "bg-emerald-500", // FS 스타일 (녹색)
      "bg-blue-500", // SB 스타일 (파란색)
      "bg-gray-800", // IU 스타일 (검은색)
      "bg-orange-500", // BG 스타일 (주황색)
    ];
    const hash = title
      .split("")
      .reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  // 상태 뱃지 스타일 (매치데이 동일)
  const getStatusBadge = () => {
    const baseClass = "px-2 py-1 text-xs font-medium rounded-full";

    switch (post.status) {
      case "RECRUITING":
        return (
          <span className={`${baseClass} bg-blue-100 text-blue-800`}>
            모집중
          </span>
        );
      case "COMPLETED":
        return (
          <span className={`${baseClass} bg-gray-100 text-gray-600`}>
            모집완료
          </span>
        );
      default:
        return (
          <span className={`${baseClass} bg-blue-100 text-blue-800`}>
            모집중
          </span>
        );
    }
  };

  // 시간대별 이모지
  const getTimeEmoji = (gameTime?: string) => {
    if (!gameTime) return "";

    const hour = parseInt(gameTime.split(":")[0]);
    if (hour >= 5 && hour < 9) return "🌅";
    if (hour >= 9 && hour < 12) return "☀️";
    if (hour >= 12 && hour < 18) return "🌤️";
    return "🌙";
  };

  // 날짜 포맷팅
  const formatDate = (dateString?: string) => {
    if (!dateString) return null;

    try {
      const date = new Date(dateString);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDay = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
      return `${month}월 ${day}일 ${weekDay}요일`;
    } catch {
      return dateString;
    }
  };

  // 인원 정보
  const getPersonnelInfo = () => {
    if (cardType === "match") {
      const current = post.participants?.current || 0;
      const max = post.maxPlayers || post.requiredPersonnel || 0;
      const remaining = max - current;

      if (remaining <= 3 && remaining > 0) {
        return { text: `${remaining}차리 남음!`, urgent: true };
      }
      return { text: `${current} / ${max}명`, urgent: false };
    }

    // 팀 모집의 경우
    return {
      text: `${post.requiredPersonnel || post.maxPlayers || 0}명 모집`,
      urgent: false,
    };
  };

  const personnelInfo = getPersonnelInfo();

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* 헤더 영역 */}
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            {/* 아바타 */}
            <div
              className={`w-10 h-10 rounded-full ${getAvatarColor(
                post.title
              )} flex items-center justify-center text-white font-bold text-sm`}
            >
              {getTeamInitials(post.title)}
            </div>

            {/* 제목과 위치 */}
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

          {/* 상태 뱃지 */}
          {getStatusBadge()}
        </div>

        {/* 날짜 정보 */}
        {post.gameDate && (
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
            <Calendar className="w-4 h-4" />
            <span>
              {getTimeEmoji(post.gameTime)} {formatDate(post.gameDate)}
              {post.gameTime && ` ${post.gameTime}`}
            </span>
          </div>
        )}

        {/* 인원 정보 */}
        <div className="flex items-center gap-2 text-sm mb-3">
          <Users className="w-4 h-4 text-gray-400" />
          <span
            className={
              personnelInfo.urgent
                ? "text-red-600 font-semibold"
                : "text-gray-600"
            }
          >
            {personnelInfo.text}
          </span>
        </div>

        {/* 상세 정보 태그들 */}
        <div className="flex flex-wrap gap-2 mb-4">
          {post.skillLevel && (
            <span className="px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
              {post.skillLevel}
            </span>
          )}
          {post.preferredPositions && (
            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs">
              {post.preferredPositions}
            </span>
          )}
          {cardType === "match" && personnelInfo.urgent && (
            <span className="px-2 py-1 bg-red-50 text-red-700 rounded text-xs animate-pulse">
              🔥 긴급
            </span>
          )}
        </div>

        {/* 내용 미리보기 */}
        {post.content && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {post.content}
          </p>
        )}
      </div>

      {/* 하단 버튼 영역 */}
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
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
              className={`px-4 py-2 text-white text-sm font-medium rounded-md transition-colors ${
                cardType === "match" && personnelInfo.urgent
                  ? "bg-red-500 hover:bg-red-600"
                  : "bg-yellow-500 hover:bg-yellow-600"
              }`}
            >
              {cardType === "team" ? "가입 신청" : "참가하기"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDayStyleCard;

