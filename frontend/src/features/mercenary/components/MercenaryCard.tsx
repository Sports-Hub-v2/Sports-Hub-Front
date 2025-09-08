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

  const getStatusBadge = () => {
    switch (post.status) {
      case "RECRUITING":
        return (
          <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
            모집중
          </span>
        );
      case "COMPLETED":
        return (
          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
            모집완료
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div
      onClick={onClick}
      className="cursor-pointer border rounded-lg shadow hover:shadow-md transition bg-white overflow-hidden"
    >
      {/* 썸네일 이미지 또는 기본 이미지 */}
      <div className="h-32 w-full bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center">
        {post.thumbnailUrl ? (
          <img
            src={post.thumbnailUrl}
            alt={post.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="text-white text-4xl">⚽</div>
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
          </div>

          {post.gameDate && (
            <div className="flex items-center gap-1">
              <span>📅</span>
              <span>{formatGameDate(post.gameDate)}</span>
            </div>
          )}

          {post.requiredPersonnel && (
            <div className="flex items-center gap-1">
              <span>👥</span>
              <span>{post.requiredPersonnel}명 모집</span>
            </div>
          )}
        </div>

        {/* 작성자 정보 */}
        <div className="text-xs text-gray-500 border-t pt-2">
          작성자: {post.authorName || "익명"}
        </div>
      </div>
    </div>
  );
};

export default MercenaryCard;
