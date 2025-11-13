// src/components/common/TeamRecruitCard.tsx
// 팀원 모집 카드 컴포넌트 (용병 카드 스타일로 개선)

import React from "react";
import { PostType } from "@/types/recruitPost";

interface TeamRecruitCardProps {
  post: PostType;
  onClick?: () => void;
  onApply?: (postId: number) => void;
  isAlreadyApplied?: boolean;
}

const TeamRecruitCard: React.FC<TeamRecruitCardProps> = ({
  post,
  onClick,
  onApply,
  isAlreadyApplied = false,
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

  // 작성 시간 표시 (상대 시간)
  const getTimeAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffMs = now.getTime() - created.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffMins < 1) return "방금 전";
    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)}주 전`;
    return `${Math.floor(diffDays / 30)}개월 전`;
  };

  // 모집 진행도 계산
  const getRecruitmentProgress = () => {
    const current = post.acceptedCount || 0;
    const required = post.requiredPersonnel;

    if (!required) return null;

    const percentage = Math.min((current / required) * 100, 100);
    return { current, required, percentage };
  };

  const progress = getRecruitmentProgress();

  // 지역 표시
  const getLocationText = () => {
    if (post.region && post.subRegion) {
      return `${post.region} ${post.subRegion}`;
    }
    return post.region || "지역 미정";
  };

  return (
    <div
      className="bg-white rounded-lg border-2 border-gray-200 hover:border-green-400 hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      <div className="flex">
        {/* 왼쪽 상태바 */}
        <div
          className={`w-1.5 ${
            isUrgent()
              ? "bg-gradient-to-b from-red-500 to-orange-500"
              : post.status === "RECRUITING"
              ? "bg-gradient-to-b from-green-500 to-green-600"
              : "bg-gray-300"
          }`}
        />

        {/* 메인 콘텐츠 */}
        <div className="flex-1 p-4">
          {/* 상단: 배지들 + 작성 시간 */}
          <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-green-50 text-green-600">
                🏃‍♂️ 팀원 모집
              </span>

              {isUrgent() && (
                <span className="px-2 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full animate-pulse">
                  🔥 긴급
                </span>
              )}

              <span
                className={`px-2 py-1 text-xs font-medium rounded-full ${
                  post.status === "RECRUITING"
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-100 text-gray-600"
                }`}
              >
                {post.status === "RECRUITING" ? "✅ 모집중" : "마감"}
              </span>
            </div>

            {/* 작성 시간 */}
            <span className="text-xs text-gray-500">
              🕐 {getTimeAgo(post.createdAt)}
            </span>
          </div>

          {/* 제목 */}
          <h3 className="text-base font-bold text-gray-900 mb-3 leading-snug line-clamp-2">
            {post.title}
          </h3>

          {/* 핵심 정보 한 줄 */}
          <div className="flex items-center gap-3 mb-3 text-sm flex-wrap">
            {/* 날짜/시간 */}
            <div className="flex items-center gap-1 font-medium text-gray-800">
              <span>📅</span>
              <span>{formatGameDate(post.gameDate) || "날짜미정"}</span>
              {post.gameTime && (
                <span className="ml-1">{formatGameTime(post.gameTime)}</span>
              )}
            </div>

            {/* 지역 */}
            <div className="flex items-center gap-1 text-gray-700">
              <span>📍</span>
              <span>{getLocationText()}</span>
            </div>

            {/* 인원 + 진행도 */}
            {progress && (
              <div className="flex items-center gap-1 font-medium text-green-600">
                <span>👥</span>
                <span>
                  {progress.current}/{progress.required}명
                  {progress.percentage >= 100 && " ✓"}
                </span>
              </div>
            )}

            {/* 포지션 */}
            {post.preferredPositions && (
              <div className="flex items-center gap-1 text-gray-700">
                <span>⚽</span>
                <span>{post.preferredPositions}</span>
              </div>
            )}
          </div>

          {/* 모집 진행도 바 */}
          {progress && progress.required && (
            <div className="mb-3 p-2 bg-green-50 rounded">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span className="text-sm font-bold text-green-600">
                    {progress.current}/{progress.required}명
                  </span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full transition-all duration-300 ${
                          progress.percentage >= 100
                            ? "bg-green-500"
                            : progress.percentage >= 70
                            ? "bg-yellow-500"
                            : "bg-green-500"
                        }`}
                        style={{ width: `${progress.percentage}%` }}
                      />
                    </div>
                    <span className="text-xs font-medium text-gray-600 w-8 text-right">
                      {Math.round(progress.percentage)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 구분선 */}
          <hr className="border-gray-200 mb-3" />

          {/* 하단: 요약 + 버튼 */}
          <div className="flex items-center justify-between gap-3">
            {/* 내용 미리보기 또는 작성자 */}
            <div className="flex-1 min-w-0">
              {post.content ? (
                <p className="text-xs text-gray-600 line-clamp-1">
                  {post.content}
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  {post.authorName && post.authorName}
                </p>
              )}
            </div>

            {/* 신청 버튼 */}
            {onApply && post.status === "RECRUITING" && (
              <>
                {isAlreadyApplied ? (
                  <button
                    disabled
                    className="px-4 py-2 text-sm font-semibold rounded-lg whitespace-nowrap bg-gray-300 text-gray-600 cursor-not-allowed"
                  >
                    ✅ 신청완료
                  </button>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onApply(post.id);
                    }}
                    className="px-4 py-2 text-sm font-semibold rounded-lg transition-all whitespace-nowrap bg-green-600 hover:bg-green-700 text-white shadow-sm hover:shadow"
                  >
                    가입 신청
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamRecruitCard;
