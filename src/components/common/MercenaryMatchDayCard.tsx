import React from "react";
import { PostType } from "@/types/recruitPost";

interface MercenaryMatchDayCardProps {
  post: PostType;
  onClick?: () => void;
  onApply?: (postId: number) => void;
}

const MercenaryMatchDayCard: React.FC<MercenaryMatchDayCardProps> = ({
  post,
  onClick,
  onApply,
}) => {
  // 날짜/시간 포맷팅
  const formatGameDate = (dateString?: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];
    return `${month}/${day}(${weekday})`;
  };

  const formatGameTime = (timeString?: string) => {
    if (!timeString) return "";
    const [hour] = timeString.split(":").map(Number);

    if (hour >= 5 && hour < 9) return "🌅 새벽";
    if (hour >= 9 && hour < 12) return "🌞 오전";
    if (hour >= 12 && hour < 18) return "☀️ 오후";
    if (hour >= 18 && hour < 22) return "🌆 저녁";
    return "🌙 늦은시간";
  };

  // 긴급도 체크
  const isUrgent = () => {
    if (!post.gameDate) return false;
    const gameDate = new Date(post.gameDate);
    const today = new Date();
    const diffDays = Math.ceil(
      (gameDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 2;
  };

  // 모집 타입에 따른 스타일링
  const getTypeInfo = () => {
    if (post.targetType === "USER") {
      return {
        emoji: "🏃‍♂️",
        label: "팀 → 용병",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        textColor: "text-blue-600",
      };
    } else {
      return {
        emoji: "🤝",
        label: "용병 → 팀",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        textColor: "text-green-600",
      };
    }
  };

  const typeInfo = getTypeInfo();

  // 지역 표시
  const getLocationText = () => {
    if (post.region && post.subRegion) {
      return `${post.region} ${post.subRegion}`;
    }
    return post.region || "지역 미정";
  };

  return (
    <div
      className="bg-white rounded-lg border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer"
      onClick={onClick}
    >
      {/* 헤더 */}
      <div className="p-4 border-b border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <div
            className={`flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${typeInfo.bgColor} ${typeInfo.textColor}`}
          >
            <span>{typeInfo.emoji}</span>
            <span>{typeInfo.label}</span>
          </div>

          {/* 상태 배지 */}
          <div className="flex items-center gap-1">
            {isUrgent() && (
              <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full animate-pulse">
                🔥 긴급
              </span>
            )}
            <span
              className={`px-2 py-1 text-xs font-medium rounded-full ${
                post.status === "RECRUITING"
                  ? "bg-green-100 text-green-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {post.status === "RECRUITING" ? "모집중" : "모집완료"}
            </span>
          </div>
        </div>

        {/* 제목 */}
        <h3 className="font-semibold text-gray-900 text-sm leading-tight mb-2 line-clamp-2">
          {post.title}
        </h3>
      </div>

      {/* 메인 정보 */}
      <div className="p-4">
        {/* 날짜/시간 */}
        <div className="flex items-center gap-4 mb-3 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span>{formatGameDate(post.gameDate) || "날짜 미정"}</span>
          </div>
          {post.gameTime && (
            <div className="flex items-center gap-1">
              <span>{formatGameTime(post.gameTime)}</span>
            </div>
          )}
        </div>

        {/* 지역 */}
        <div className="flex items-center gap-1 mb-3 text-sm text-gray-600">
          <span>📍</span>
          <span>{getLocationText()}</span>
        </div>

        {/* 인원 정보 (팀→용병인 경우만) */}
        {post.targetType === "USER" && post.requiredPersonnel && (
          <div className="flex items-center gap-1 mb-3 text-sm">
            <span>👥</span>
            <span className="text-gray-600">모집 인원:</span>
            <span className="font-medium text-blue-600">
              {post.requiredPersonnel}명
            </span>
          </div>
        )}

        {/* 선호 포지션 */}
        {post.preferredPositions && post.preferredPositions.length > 0 && (
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="text-sm text-gray-600">⚽</span>
            <div className="flex flex-wrap gap-1">
              {post.preferredPositions.slice(0, 3).map((position, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
                >
                  {position}
                </span>
              ))}
              {post.preferredPositions.length > 3 && (
                <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                  +{post.preferredPositions.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* 실력 수준 */}
        {post.skillLevel && (
          <div className="flex items-center gap-1 mb-3 text-sm">
            <span>⭐</span>
            <span className="text-gray-600">실력:</span>
            <span className="font-medium text-yellow-600">
              {post.skillLevel}
            </span>
          </div>
        )}

        {/* 내용 미리보기 */}
        {post.content && (
          <p className="text-sm text-gray-600 line-clamp-2 mb-4">
            {post.content}
          </p>
        )}

        {/* 하단 버튼 */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="text-xs text-gray-500">
            {post.authorName && `by ${post.authorName}`}
          </div>

          {onApply && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onApply(post.id);
              }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                post.targetType === "USER"
                  ? "bg-blue-500 hover:bg-blue-600 text-white"
                  : "bg-green-500 hover:bg-green-600 text-white"
              }`}
            >
              {post.targetType === "USER" ? "지원하기" : "연락하기"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MercenaryMatchDayCard;


