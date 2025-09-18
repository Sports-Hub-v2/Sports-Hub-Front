// src/features/mercenary/components/EnhancedMercenaryCard.tsx

import React, { useState } from "react";
import type { PostType } from "@/types/recruitPost";

interface Props {
  post: PostType;
  onClick: () => void;
  onNotificationToggle?: (postId: number, enabled: boolean) => void;
}

const EnhancedMercenaryCard: React.FC<Props> = ({
  post,
  onClick,
  onNotificationToggle,
}) => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(
    post.notificationSettings?.enabled || false
  );

  // 축구 시간대 분류 (조기축구 외 다양한 시간대 지원)
  const getTimeCategory = (timeStr?: string) => {
    if (!timeStr) return null;
    try {
      const [hour] = timeStr.split(":");
      if (!hour) return null;
      const hourNum = parseInt(hour);

      if (hourNum >= 5 && hourNum <= 6) {
        return {
          label: "새벽",
          color: "purple",
          icon: "🌙",
          desc: "조용한 분위기",
          bgColor: "bg-purple-500",
        };
      } else if (hourNum >= 6 && hourNum <= 8) {
        return {
          label: "아침",
          color: "orange",
          icon: "🌅",
          desc: "상쾌한 시작",
          bgColor: "bg-orange-500",
        };
      } else if (hourNum >= 8 && hourNum <= 10) {
        return {
          label: "오전",
          color: "blue",
          icon: "☀️",
          desc: "활기찬 경기",
          bgColor: "bg-blue-500",
        };
      } else if (hourNum >= 10 && hourNum <= 12) {
        return {
          label: "늦은오전",
          color: "green",
          icon: "🕐",
          desc: "여유로운 시간",
          bgColor: "bg-green-500",
        };
      } else if (hourNum >= 14 && hourNum <= 17) {
        return {
          label: "오후",
          color: "yellow",
          icon: "🌤️",
          desc: "따뜻한 햇살",
          bgColor: "bg-yellow-500",
        };
      } else if (hourNum >= 18 && hourNum <= 20) {
        return {
          label: "저녁",
          color: "indigo",
          icon: "🌆",
          desc: "퇴근 후 운동",
          bgColor: "bg-indigo-500",
        };
      } else if (hourNum >= 20 || hourNum <= 4) {
        return {
          label: "야간",
          color: "gray",
          icon: "🌃",
          desc: "나이트 게임",
          bgColor: "bg-gray-500",
        };
      }
      return {
        label: "일반",
        color: "gray",
        icon: "🕐",
        desc: "자유 시간",
        bgColor: "bg-gray-500",
      };
    } catch {
      return null;
    }
  };

  // D-Day 및 긴급도 계산
  const getTimeStatus = () => {
    if (!post.gameDate) return null;

    const now = new Date();
    const gameDate = new Date(post.gameDate);
    const diffTime = gameDate.getTime() - now.getTime();
    const diffHours = diffTime / (1000 * 60 * 60);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffTime < 0) {
      return { type: "expired", label: "경기 종료", color: "gray" };
    } else if (diffHours <= 6) {
      return { type: "urgent", label: "곧 시작", color: "red", animate: true };
    } else if (diffHours <= 24) {
      return { type: "today", label: "오늘", color: "orange", animate: true };
    } else if (diffDays === 1) {
      return { type: "tomorrow", label: "내일", color: "yellow" };
    } else if (diffDays <= 3) {
      return { type: "soon", label: `D-${diffDays}`, color: "blue" };
    } else {
      return { type: "normal", label: `${diffDays}일 후`, color: "green" };
    }
  };

  // 모집 진행률 계산
  const getProgress = () => {
    if (!post.requiredPersonnel || !post.participants?.current) return 0;
    return Math.min(
      (post.participants.current / post.requiredPersonnel) * 100,
      100
    );
  };

  // 날씨 아이콘
  const getWeatherIcon = (condition?: string) => {
    if (!condition) return "🌤️";
    switch (condition.toLowerCase()) {
      case "sunny":
        return "☀️";
      case "cloudy":
        return "☁️";
      case "rainy":
        return "🌧️";
      case "snow":
        return "❄️";
      default:
        return "🌤️";
    }
  };

  // 알림 토글
  const handleNotificationToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !isNotificationEnabled;
    setIsNotificationEnabled(newState);
    onNotificationToggle?.(post.id, newState);
  };

  const timeStatus = getTimeStatus();
  const timeCategory = getTimeCategory(post.gameTime);
  const progress = getProgress();

  return (
    <div
      onClick={onClick}
      className={`
        cursor-pointer border rounded-xl shadow-md hover:shadow-xl 
        transition-all duration-300 bg-white overflow-hidden relative
        ${timeStatus?.animate ? "animate-pulse" : ""}
        ${post.isHot ? "ring-2 ring-yellow-400" : ""}
        ${post.isUrgent ? "ring-2 ring-red-400" : ""}
      `}
    >
      {/* 상단 배지들 */}
      <div className="absolute top-2 left-2 z-10 flex gap-1">
        {timeCategory && (
          <span
            className={`
             text-xs px-2 py-1 rounded-full text-white font-medium
             ${timeCategory.bgColor}
           `}
            title={timeCategory.desc}
          >
            {timeCategory.icon} {timeCategory.label}
          </span>
        )}

        {post.isHot && (
          <span className="text-xs px-2 py-1 rounded-full bg-yellow-500 text-white font-medium animate-pulse">
            🔥 인기
          </span>
        )}
      </div>

      {/* 우상단 시간 상태 */}
      {timeStatus && (
        <div
          className={`
          absolute top-2 right-2 z-10 text-xs px-2 py-1 rounded-full text-white font-medium
          bg-${timeStatus.color}-500
          ${timeStatus.animate ? "animate-bounce" : ""}
        `}
        >
          {timeStatus.label}
        </div>
      )}

      {/* 썸네일 영역 */}
      <div className="h-32 w-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center relative">
        {post.thumbnailUrl ? (
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-white text-4xl">⚽</div>
        )}

        {/* 날씨 정보 오버레이 */}
        {post.weatherCondition && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded flex items-center gap-1">
            {getWeatherIcon(post.weatherCondition)}
            {post.weatherCondition}
          </div>
        )}

        {/* 참가비 표시 */}
        {post.cost && (
          <div className="absolute bottom-2 right-2 bg-green-600 text-white text-xs px-2 py-1 rounded">
            💰 {post.cost.toLocaleString()}원
          </div>
        )}
      </div>

      {/* 카드 내용 */}
      <div className="p-4 space-y-3">
        {/* 헤더 */}
        <div className="flex justify-between items-start">
          <div className="flex-1">
            <div className="text-xs text-blue-600 font-medium mb-1">
              {post.targetType === "USER"
                ? "🏃‍♂️ 팀 → 용병(개인)"
                : "🤝 용병(개인) → 팀"}
            </div>
            <h3 className="text-lg font-semibold text-gray-900 leading-tight">
              {post.title}
            </h3>
          </div>

          {/* 알림 버튼 */}
          <button
            onClick={handleNotificationToggle}
            className={`
              ml-2 p-1 rounded-full transition-colors
              ${
                isNotificationEnabled
                  ? "text-blue-600 bg-blue-100"
                  : "text-gray-400 hover:text-blue-600"
              }
            `}
          >
            {isNotificationEnabled ? "🔔" : "🔕"}
          </button>
        </div>

        {/* 핵심 정보 */}
        <div className="space-y-2 text-sm">
          {/* 위치 정보 */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1 text-gray-600">
              <span>📍</span>
              <span>{post.region}</span>
              {post.subRegion && (
                <span className="text-gray-400">・{post.subRegion}</span>
              )}
            </div>

            {/* 편의시설 아이콘 */}
            <div className="flex gap-1">
              {post.parkingAvailable && <span title="주차 가능">🅿️</span>}
              {post.showerFacilities && <span title="샤워 시설">🚿</span>}
            </div>
          </div>

          {/* 일시 정보 */}
          {post.gameDate && (
            <div className="flex items-center gap-1 text-gray-600">
              <span>📅</span>
              <span>{new Date(post.gameDate).toLocaleDateString()}</span>
              {post.gameTime && (
                <span className="text-gray-500">・{post.gameTime}</span>
              )}
            </div>
          )}

          {/* 모집 진행률 */}
          {post.requiredPersonnel && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-600">
                  👥 {post.participants?.current || 0}/{post.requiredPersonnel}
                  명
                </span>
                <span className="text-gray-500">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`
                    h-2 rounded-full transition-all duration-300
                    ${
                      progress >= 100
                        ? "bg-green-500"
                        : progress >= 70
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }
                  `}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* 하단 정보 */}
        <div className="flex justify-between items-center text-xs text-gray-500 border-t pt-2">
          <span>작성자: {post.authorName || "익명"}</span>
          <div className="flex items-center gap-2">
            {post.lastActivity && (
              <span title="마지막 활동">
                🕐 {new Date(post.lastActivity).toLocaleDateString()}
              </span>
            )}
            <span>{new Date(post.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMercenaryCard;
