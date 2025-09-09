// src/components/mercenary/MercenaryCard.tsx

import type { PostType } from "@/types/recruitPost";

type Props = {
  post: PostType;
  onClick: () => void;
};

const MercenaryCard = ({ post, onClick }: Props) => {
  // 조기축구 특화 정보 표시
  const getPostTypeLabel = () => {
    if (post.category === "MERCENARY") {
      return post.targetType === "TEAM" ? "🏃‍♂️ 팀 찾는 개인" : "🤝 개인 찾는 팀";
    }
    return "⚽ 용병 모집";
  };

  const formatGameDate = (dateStr?: string) => {
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

  // 조기축구 시간대 표시 (다양한 시간대 지원)
  const formatGameTime = (timeStr?: string) => {
    if (!timeStr) return "";
    try {
      const [hour] = timeStr.split(":");
      const hourNum = parseInt(hour);
      
      // 조기축구 특성에 맞는 시간대 분류
      if (hourNum >= 5 && hourNum <= 6) {
        return `🌙 ${timeStr}`; // 새벽
      } else if (hourNum >= 6 && hourNum <= 8) {
        return `🌅 ${timeStr}`; // 아침
      } else if (hourNum >= 8 && hourNum <= 10) {
        return `☀️ ${timeStr}`; // 오전
      } else if (hourNum >= 18 && hourNum <= 20) {
        return `🌆 ${timeStr}`; // 저녁
      } else if (hourNum >= 20 || hourNum <= 4) {
        return `🌃 ${timeStr}`; // 야간
      }
      return `🕐 ${timeStr}`; // 기타 시간
    } catch {
      return timeStr;
    }
  };

  // 시간대별 특성 정보
  const getTimeCharacteristics = (timeStr?: string) => {
    if (!timeStr) return null;
    try {
      const [hour] = timeStr.split(":");
      const hourNum = parseInt(hour);
      
      if (hourNum >= 5 && hourNum <= 6) {
        return { label: "새벽", color: "purple", icon: "🌙", desc: "조용한 분위기" };
      } else if (hourNum >= 6 && hourNum <= 8) {
        return { label: "아침", color: "orange", icon: "🌅", desc: "상쾌한 시작" };
      } else if (hourNum >= 8 && hourNum <= 10) {
        return { label: "오전", color: "blue", icon: "☀️", desc: "활기찬 경기" };
      } else if (hourNum >= 10 && hourNum <= 12) {
        return { label: "늦은오전", color: "green", icon: "🕐", desc: "여유로운 시간" };
      } else if (hourNum >= 18 && hourNum <= 20) {
        return { label: "저녁", color: "indigo", icon: "🌆", desc: "퇴근 후 운동" };
      } else if (hourNum >= 20 || hourNum <= 4) {
        return { label: "야간", color: "gray", icon: "🌃", desc: "나이트 게임" };
      }
      return { label: "일반", color: "gray", icon: "🕐", desc: "자유 시간" };
    } catch {
      return null;
    }
  };

  // 상태별 뱃지 (알림 기능 대비 더 상세화)
  const getStatusBadge = () => {
    const now = new Date();
    const gameDate = post.gameDate ? new Date(post.gameDate) : null;

    // 경기 시간이 지났는지 확인
    const isGamePassed = gameDate && gameDate < now;

    switch (post.status) {
      case "RECRUITING":
        if (isGamePassed) {
          return (
            <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full animate-pulse">
              ⏰ 시간 지남
            </span>
          );
        }
        // D-Day 계산
        if (gameDate) {
          const diffTime = gameDate.getTime() - now.getTime();
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          if (diffDays === 0) {
            return (
              <span className="text-xs bg-orange-100 text-orange-800 px-2 py-1 rounded-full animate-pulse">
                🔥 오늘
              </span>
            );
          } else if (diffDays === 1) {
            return (
              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                📅 내일
              </span>
            );
          } else if (diffDays <= 3) {
            return (
              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                📅 D-{diffDays}
              </span>
            );
          }
        }
        return (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            💚 모집중
          </span>
        );
      case "COMPLETED":
        return (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            ✅ 모집완료
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded-full animate-pulse">
            ⚽ 경기중
          </span>
        );
      case "CANCELLED":
        return (
          <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded-full">
            ❌ 취소됨
          </span>
        );
      default:
        return null;
    }
  };

  // 모집 긴급도 표시 (알림 우선순위 대비)
  const getUrgencyIndicator = () => {
    const gameDate = post.gameDate ? new Date(post.gameDate) : null;
    if (!gameDate || post.status !== "RECRUITING") return null;

    const now = new Date();
    const diffHours = (gameDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours <= 24 && diffHours > 0) {
      return (
        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-bounce">
          🚨 급구
        </div>
      );
    }
    return null;
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer border rounded-lg shadow hover:shadow-lg transition-all duration-200 bg-white overflow-hidden relative"
    >
      {/* 긴급도 표시 */}
      {getUrgencyIndicator()}

      {/* 썸네일 이미지 또는 기본 이미지 */}
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

        {/* 조기축구 시간대 오버레이 */}
        {post.gameTime && (
          <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {formatGameTime(post.gameTime)}
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        {/* 모집 유형 및 상태 */}
        <div className="flex justify-between items-center">
          <div className="text-xs text-blue-600 font-medium">
            {getPostTypeLabel()}
          </div>
          {getStatusBadge()}
        </div>

        {/* 제목 */}
        <h3 className="text-lg font-semibold truncate text-gray-900">
          {post.title}
        </h3>

        {/* 조기축구 핵심 정보 */}
        <div className="space-y-1 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span>📍</span>
            <span>{post.region || "지역 미설정"}</span>
            {post.subRegion && (
              <span className="text-xs text-gray-400">・{post.subRegion}</span>
            )}
          </div>

          {post.gameDate && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <span>📅</span>
                <span>{formatGameDate(post.gameDate)}</span>
              </div>
              {post.gameTime && (
                <div className="text-xs text-gray-500">
                  {formatGameTime(post.gameTime)}
                </div>
              )}
            </div>
          )}

          {post.requiredPersonnel && (
            <div className="flex items-center gap-1">
              <span>👥</span>
              <span>{post.requiredPersonnel}명 모집</span>
            </div>
          )}

          {/* 참가비/비용 정보 (추후 백엔드 필드 추가 시) */}
          {/* {post.cost && (
            <div className="flex items-center gap-1">
              <span>💰</span>
              <span>{post.cost.toLocaleString()}원</span>
            </div>
          )} */}
        </div>

        {/* 작성자 정보 및 생성 시간 */}
        <div className="text-xs text-gray-500 border-t pt-2 flex justify-between items-center">
          <span>작성자: {post.authorName || "익명"}</span>
          <span>{formatGameDate(post.createdAt)}</span>
        </div>

        {/* 알림 설정 버튼 (추후 구현) */}
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              // TODO: 알림 설정 기능
              console.log("알림 설정:", post.id);
            }}
            className="text-xs text-gray-400 hover:text-blue-600 transition-colors"
          >
            🔔 알림 설정
          </button>
        </div>
      </div>
    </div>
  );
};

export default MercenaryCard;
