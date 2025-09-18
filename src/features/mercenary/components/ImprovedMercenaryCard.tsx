import React, { useState } from "react";
import { PostType } from "../../../types/recruitPost";
import { Heart, Bell, Clock, Users, MapPin, Calendar } from "lucide-react";

type Props = {
  post: PostType;
  onClick: () => void;
  onNotificationToggle?: (postId: number, enabled: boolean) => void;
  onFavoriteToggle?: (postId: number, favorited: boolean) => void;
  onApply?: (postId: number) => void;
};

const ImprovedMercenaryCard = ({
  post,
  onClick,
  onNotificationToggle,
  onFavoriteToggle,
  onApply,
}: Props) => {
  const [isNotificationEnabled, setIsNotificationEnabled] = useState(false);
  const [isFavorited, setIsFavorited] = useState(false);

  // 모집 진행률 계산
  const getProgress = () => {
    if (!post.requiredPersonnel || !post.participants?.current) return 0;
    return Math.min(
      (post.participants.current / post.requiredPersonnel) * 100,
      100
    );
  };

  // 긴급 모집 여부 확인
  const isUrgent = () => {
    if (!post.gameDate) return false;
    const now = new Date();
    const gameDate = new Date(post.gameDate);
    const diffHours = (gameDate.getTime() - now.getTime()) / (1000 * 60 * 60);
    return diffHours <= 24 && diffHours > 0;
  };

  // 날짜 포맷팅
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekDay = ["일", "월", "화", "수", "목", "금", "토"][date.getDay()];
      return `${month}/${day}(${weekDay})`;
    } catch {
      return dateStr;
    }
  };

  // 시간 포맷팅
  const formatTime = (timeStr?: string) => {
    if (!timeStr) return "";
    try {
      const [hour] = timeStr.split(":");
      if (!hour) return timeStr;
      const hourNum = parseInt(hour);

      if (hourNum >= 5 && hourNum <= 6) {
        return `🌙 ${timeStr}`;
      } else if (hourNum >= 6 && hourNum <= 8) {
        return `🌅 ${timeStr}`;
      } else if (hourNum >= 8 && hourNum <= 10) {
        return `☀️ ${timeStr}`;
      } else if (hourNum >= 18 && hourNum <= 20) {
        return `🌆 ${timeStr}`;
      } else if (hourNum >= 20 || hourNum <= 4) {
        return `🌃 ${timeStr}`;
      }
      return `🕐 ${timeStr}`;
    } catch {
      return timeStr;
    }
  };

  // 상대 시간 계산
  const formatTimeAgo = (dateStr: string) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) return "방금 전";
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString();
  };

  // 알림 토글
  const handleNotificationToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !isNotificationEnabled;
    setIsNotificationEnabled(newState);
    onNotificationToggle?.(post.id, newState);
  };

  // 관심 등록 토글
  const handleFavoriteToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = !isFavorited;
    setIsFavorited(newState);
    onFavoriteToggle?.(post.id, newState);
  };

  const progress = getProgress();
  const urgent = isUrgent();

  return (
    <div
      className="group relative overflow-hidden rounded-xl bg-white shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-[1.02]"
      onClick={onClick}
    >
      {/* 상태 뱃지 */}
      <div className="absolute top-3 left-3 z-10 flex gap-2">
        <span className="px-3 py-1 bg-blue-500/90 backdrop-blur text-white text-xs font-bold rounded-full">
          {post.status === "RECRUITING" ? "모집중" : "모집완료"}
        </span>
        {urgent && (
          <span className="px-3 py-1 bg-red-500/90 backdrop-blur text-white text-xs font-bold rounded-full animate-pulse">
            🔥 긴급
          </span>
        )}
        {progress >= 90 && (
          <span className="px-3 py-1 bg-orange-500/90 backdrop-blur text-white text-xs font-bold rounded-full">
            마감임박
          </span>
        )}
      </div>

      {/* 액션 버튼들 */}
      <div className="absolute top-3 right-3 z-10 flex gap-2">
        <button
          onClick={handleNotificationToggle}
          className={`w-8 h-8 rounded-full backdrop-blur flex items-center justify-center transition-all ${
            isNotificationEnabled
              ? "bg-blue-500 text-white"
              : "bg-white/80 text-gray-600 hover:bg-white"
          }`}
        >
          <Bell className="w-4 h-4" />
        </button>
        <button
          onClick={handleFavoriteToggle}
          className={`w-8 h-8 rounded-full backdrop-blur flex items-center justify-center transition-all ${
            isFavorited
              ? "bg-red-500 text-white"
              : "bg-white/80 text-gray-600 hover:bg-white"
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? "fill-current" : ""}`} />
        </button>
      </div>

      {/* 이미지 섹션 */}
      <div className="relative h-48 bg-gradient-to-br from-blue-400 to-green-400 overflow-hidden">
        {post.imageUrl ? (
          <img
            src={post.imageUrl}
            alt={post.title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        ) : (
          <div className="flex items-center justify-center h-full">
            <span className="text-6xl opacity-80">⚽</span>
          </div>
        )}

        {/* 오버레이 정보 */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent p-4">
          <div className="text-white">
            <div className="flex items-center gap-2 text-sm opacity-90 mb-1">
              <Calendar className="w-4 h-4" />
              <span>{formatDate(post.gameDate)}</span>
              {post.gameTime && (
                <>
                  <Clock className="w-4 h-4 ml-2" />
                  <span>{formatTime(post.gameTime)}</span>
                </>
              )}
            </div>
            <p className="text-lg font-bold truncate">{post.title}</p>
            <div className="text-xs text-blue-200 mt-1">
              {post.targetType === "USER"
                ? "🏃‍♂️ 팀 → 용병(개인)"
                : "🤝 용병(개인) → 팀"}
            </div>
          </div>
        </div>
      </div>

      {/* 정보 섹션 */}
      <div className="p-4">
        {/* 지역 및 인원 정보 */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1 text-sm text-gray-500">
            <MapPin className="w-4 h-4" />
            <span>{post.region}</span>
            {post.subRegion && (
              <span className="text-gray-400">・{post.subRegion}</span>
            )}
          </div>
          <div className="flex items-center gap-1 text-sm font-semibold text-blue-600">
            <Users className="w-4 h-4" />
            <span>
              {post.participants?.current || 0}/{post.requiredPersonnel || 0}명
            </span>
          </div>
        </div>

        {/* 프로그레스 바 */}
        {post.requiredPersonnel && (
          <div className="mb-3">
            <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
              <span>모집 진행률</span>
              <span>{Math.round(progress)}%</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-500 ${
                  progress >= 100
                    ? "bg-gradient-to-r from-green-500 to-green-600"
                    : progress >= 70
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500"
                    : "bg-gradient-to-r from-blue-500 to-green-500"
                }`}
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        {/* 작성자 정보 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-400 to-green-400 flex items-center justify-center text-white text-sm font-bold">
              {post.authorName ? post.authorName[0] : "?"}
            </div>
            <span className="text-sm text-gray-600 font-medium">
              {post.authorName || "익명"}
            </span>
          </div>
          <span className="text-xs text-gray-400">
            {formatTimeAgo(post.createdAt)}
          </span>
        </div>
      </div>

      {/* 호버 시 추가 액션 버튼 */}
      <div className="absolute bottom-4 left-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <div className="flex gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onClick();
            }}
            className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors"
          >
            자세히 보기
          </button>
          {onApply && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApply(post.id);
              }}
              className="bg-green-500 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-600 transition-colors"
            >
              신청하기
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImprovedMercenaryCard;
