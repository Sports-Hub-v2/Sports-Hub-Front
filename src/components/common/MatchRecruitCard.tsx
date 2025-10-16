// src/components/common/MatchRecruitCard.tsx
// 매치데이 스타일의 경기 모집 카드 컴포넌트

import React from "react";
import { MapPin, Users, Calendar, Clock, AlertCircle } from "lucide-react";
import { PostType } from "@/types/recruitPost";

interface MatchRecruitCardProps {
  post: PostType;
  onApply?: () => void;
  onClick?: () => void;
}

const MatchRecruitCard: React.FC<MatchRecruitCardProps> = ({
  post,
  onApply,
  onClick,
}) => {
  // 남은 자리 계산
  const getRemainingSlots = () => {
    if (post.maxPlayers) {
      const current = post.participants?.current || 0;
      const remaining = post.maxPlayers - current;
      return { current, max: post.maxPlayers, remaining };
    }
    if (post.requiredPersonnel) {
      return {
        current: 0,
        max: post.requiredPersonnel,
        remaining: post.requiredPersonnel,
      };
    }
    return null;
  };

  const slots = getRemainingSlots();

  // 긴급 상태 판단 (남은 자리가 적거나 경기가 임박한 경우)
  const isUrgent = () => {
    if (slots && slots.remaining <= 3 && slots.remaining > 0) return true;

    if (post.gameDate) {
      const gameDate = new Date(post.gameDate);
      const now = new Date();
      const diffHours = (gameDate.getTime() - now.getTime()) / (1000 * 60 * 60);
      return diffHours <= 24 && diffHours > 0; // 24시간 이내
    }

    return false;
  };

  // 상태 표시
  const getStatusBadge = () => {
    if (post.status === "COMPLETED") {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-800 text-xs font-bold rounded-full">
          모집완료
        </span>
      );
    }

    if (post.status === "CANCELLED") {
      return (
        <span className="px-3 py-1 bg-red-100 text-red-800 text-xs font-bold rounded-full">
          취소됨
        </span>
      );
    }

    if (isUrgent() && post.status === "RECRUITING") {
      return (
        <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
          🔥 긴급
        </span>
      );
    }

    return (
      <span className="px-3 py-1 bg-blue-100 text-blue-800 text-xs font-bold rounded-full">
        모집중
      </span>
    );
  };

  // 경기 날짜/시간 포매팅
  const formatGameDateTime = () => {
    if (!post.gameDate) return "일정 미정";

    try {
      const date = new Date(post.gameDate);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDay = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];

      let timeStr = "";
      if (post.gameTime) {
        const [hour, minute] = post.gameTime.split(":");
        const hourNum = parseInt(hour);
        if (hourNum >= 5 && hourNum < 9) {
          timeStr = ` 🌅 ${hourNum}:${minute}`;
        } else if (hourNum >= 9 && hourNum < 12) {
          timeStr = ` ☀️ ${hourNum}:${minute}`;
        } else if (hourNum >= 12 && hourNum < 18) {
          timeStr = ` 🌤️ ${hourNum}:${minute}`;
        } else {
          timeStr = ` 🌙 ${hourNum}:${minute}`;
        }
      }

      return `${month}월 ${day}일 ${weekDay}요일${timeStr}`;
    } catch {
      return post.gameDate;
    }
  };

  // 남은 자리 표시
  const getRemainingText = () => {
    if (!slots) return "";

    if (slots.remaining <= 0) {
      return "모집완료";
    } else if (slots.remaining <= 3) {
      return `${slots.remaining}차리 남음!`;
    } else {
      return `${slots.current}/${slots.max}명`;
    }
  };

  return (
    <div
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer border border-gray-100 relative overflow-hidden"
      onClick={onClick}
    >
      {/* 헤더 - 제목과 상태 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900 text-sm leading-tight pr-2">
              {post.title}
            </h3>
            <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
              <MapPin className="w-3 h-3" />
              <span>{post.region}</span>
              {post.subRegion && <span>・{post.subRegion}</span>}
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </div>

      {/* 경기 정보 */}
      <div className="p-4 space-y-3">
        {/* 경기 일정 - 강조 표시 */}
        <div className="bg-blue-50 p-3 rounded-lg">
          <div className="flex items-center gap-2 text-sm font-medium text-blue-900">
            <Calendar className="w-4 h-4 text-blue-600" />
            <span>{formatGameDateTime()}</span>
          </div>
        </div>

        {/* 모집 인원 정보 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Users className="w-4 h-4 text-green-500" />
            <span>모집 인원</span>
          </div>
          <div className="text-sm font-medium">
            {slots && slots.remaining <= 3 && slots.remaining > 0 ? (
              <span className="text-red-600 font-bold">
                {getRemainingText()}
              </span>
            ) : (
              <span className="text-gray-700">{getRemainingText()}</span>
            )}
          </div>
        </div>

        {/* 실력 레벨 */}
        {post.skillLevel && (
          <div className="text-sm">
            <span className="inline-block px-2 py-1 bg-green-50 text-green-700 rounded text-xs">
              {post.skillLevel}
            </span>
          </div>
        )}

        {/* 참가비 */}
        {post.cost && post.cost > 0 && (
          <div className="text-sm">
            <span className="text-gray-500">참가비: </span>
            <span className="font-medium text-gray-700">
              {post.cost.toLocaleString()}원
            </span>
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
          {onApply &&
            post.status === "RECRUITING" &&
            slots &&
            slots.remaining > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onApply();
                }}
                className={`px-4 py-2 text-white text-sm font-medium rounded-lg transition-colors ${
                  isUrgent()
                    ? "bg-red-500 hover:bg-red-600 animate-pulse"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                참가하기
              </button>
            )}
        </div>
      </div>

      {/* 긴급 표시 스트라이프 */}
      {isUrgent() && post.status === "RECRUITING" && (
        <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
          <div className="absolute top-2 right-[-20px] w-24 h-6 bg-red-500 transform rotate-45">
            <div className="text-white text-xs font-bold text-center leading-6">
              URGENT
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MatchRecruitCard;

