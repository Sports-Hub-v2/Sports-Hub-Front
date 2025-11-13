// src/features/match/components/MatchDetailCard.tsx
// 경기 모집 상세 카드

import React from "react";
import type { PostType } from "@/types/recruitPost";
import { RecruitStatus } from "@/types/recruitPost";

interface MatchDetailCardProps {
  post: PostType;
  isExpanded: boolean;
  onClose?: () => void;
  onExpand?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onApply?: (postId: number) => void;
  onAuthorNameClick?: () => void;
  isAlreadyApplied?: boolean;
  onCancelApplication?: () => void;
}

const getStatusDisplayForDetail = (
  statusValue: PostType["status"]
): React.ReactNode => {
  let styleClass = "font-semibold ";
  let statusText = statusValue as string;

  if (statusValue === RecruitStatus.RECRUITING) {
    styleClass += "text-green-600";
    statusText = "모집중";
  } else if (statusValue === RecruitStatus.COMPLETED) {
    styleClass += "text-blue-600";
    statusText = "모집완료";
  } else {
    styleClass += "text-gray-700";
  }
  return <span className={styleClass}>{statusText}</span>;
};

const MatchDetailCard: React.FC<MatchDetailCardProps> = ({
  post,
  isExpanded,
  onClose,
  onApply,
  onAuthorNameClick,
  isAlreadyApplied = false,
  onCancelApplication,
  onEdit,
  onDelete,
}) => {
  // D-day 계산
  const getDday = () => {
    if (!post.gameDate) return null;
    const gameDate = new Date(post.gameDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    gameDate.setHours(0, 0, 0, 0);
    const diffTime = gameDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return { text: "D-Day", isToday: true, isPast: false };
    if (diffDays > 0) return { text: `D-${diffDays}`, isToday: false, isPast: false };
    return { text: `경기종료`, isToday: false, isPast: true };
  };

  // 날짜 포맷팅
  const formatGameDate = (dateString?: string) => {
    if (!dateString) return "날짜 미정";
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];
    return {
      full: `${year}년 ${month}월 ${day}일 (${weekday})`,
      short: `${month}월 ${day}일 (${weekday})`
    };
  };

  // 시간 포맷팅
  const formatGameTime = (timeString?: string) => {
    if (!timeString) return "시간 미정";
    const [hour, minute] = timeString.split(":").map(Number);
    const period = hour >= 12 ? "오후" : "오전";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${period} ${displayHour}:${minute.toString().padStart(2, "0")}`;
  };

  // 경기 타입
  const getMatchType = () => {
    const title = post.title.toLowerCase();
    if (title.includes("풋살")) return { icon: "🥅", text: "풋살" };
    if (title.includes("친선")) return { icon: "🤝", text: "친선전" };
    if (title.includes("리그")) return { icon: "🏆", text: "리그전" };
    if (title.includes("토너먼트")) return { icon: "🔥", text: "토너먼트" };
    return { icon: "⚽", text: "일반 경기" };
  };

  // 작성 시간
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

  const dday = getDday();
  const dateInfo = formatGameDate(post.gameDate);
  const timeInfo = formatGameTime(post.gameTime);
  const matchType = getMatchType();

  if (!isExpanded) return null;

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden">
      {/* 상단: 경기 헤더 */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            {dday && (
              <div
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-lg ${
                  dday.isToday
                    ? "bg-red-500 text-white animate-pulse"
                    : dday.isPast
                    ? "bg-gray-400 text-white"
                    : "bg-yellow-400 text-yellow-900"
                }`}
              >
                <span className="text-2xl">📅</span>
                <span>{dday.text}</span>
              </div>
            )}
            <span
              className={`px-3 py-1.5 text-sm font-bold rounded-full ${
                post.status === "RECRUITING"
                  ? "bg-white text-purple-600"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {getStatusDisplayForDetail(post.status)}
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-4xl leading-none"
            >
              ×
            </button>
          )}
        </div>

        <h2 className="text-2xl font-bold text-white mb-3">{post.title}</h2>

        {/* 메타 정보 */}
        <div className="flex items-center gap-4 text-sm text-purple-50">
          <div className="flex items-center gap-1.5">
            <span>👤</span>
            <span
              className={`font-medium ${
                onAuthorNameClick ? "text-white hover:underline cursor-pointer" : ""
              }`}
              onClick={(e) => {
                if (onAuthorNameClick) {
                  e.stopPropagation();
                  onAuthorNameClick();
                }
              }}
            >
              {post.authorName || "주최자"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🕐</span>
            <span>{getTimeAgo(post.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* 경기 일정 정보 - 가장 중요하게 */}
        <div className="mb-6 p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border-2 border-purple-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                📅
              </div>
              <div>
                <div className="text-xs text-purple-600 font-medium">경기 날짜</div>
                <div className="text-base font-bold text-purple-900">{dateInfo.short}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                🕐
              </div>
              <div>
                <div className="text-xs text-purple-600 font-medium">경기 시간</div>
                <div className="text-base font-bold text-purple-900">{timeInfo}</div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="bg-purple-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                {matchType.icon}
              </div>
              <div>
                <div className="text-xs text-purple-600 font-medium">경기 유형</div>
                <div className="text-base font-bold text-purple-900">{matchType.text}</div>
              </div>
            </div>
          </div>
        </div>

        {/* 경기장 위치 - 크게 강조 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>📍</span>
            <span>경기장 위치</span>
          </h3>
          <div className="p-5 bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl border-2 border-indigo-200">
            <div className="flex items-start gap-3">
              <div className="text-4xl">🏟️</div>
              <div className="flex-1">
                <div className="text-xl font-bold text-indigo-900 mb-1">
                  {post.fieldLocation || "경기장 미정"}
                </div>
                <div className="text-sm text-indigo-700">
                  {post.region} {post.subRegion}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 경기 조건 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>⚙️</span>
            <span>경기 조건</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {post.skillLevel && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-600 font-medium mb-1">실력 수준</div>
                <div className="text-base font-bold text-blue-900">{post.skillLevel}</div>
              </div>
            )}
            {post.ageGroup && (
              <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="text-xs text-green-600 font-medium mb-1">참가 연령</div>
                <div className="text-base font-bold text-green-900">{post.ageGroup}</div>
              </div>
            )}
          </div>
        </div>

        {/* 경기 설명 */}
        {post.content && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>📝</span>
              <span>경기 안내</span>
            </h3>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{post.content}</p>
            </div>
          </div>
        )}

        {/* 하단 액션 버튼 */}
        <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
          <div className="flex items-center gap-2">
            {onEdit && (
              <button
                onClick={onEdit}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                ✏️ 수정
              </button>
            )}
            {onDelete && (
              <button
                onClick={onDelete}
                className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
              >
                🗑️ 삭제
              </button>
            )}
          </div>

          {onApply && post.status === "RECRUITING" && (
            <div className="flex items-center gap-2">
              {isAlreadyApplied ? (
                <>
                  <span className="px-4 py-2.5 text-sm font-bold bg-gray-200 text-gray-600 rounded-lg">
                    ✅ 신청완료
                  </span>
                  {onCancelApplication && (
                    <button
                      onClick={onCancelApplication}
                      className="px-4 py-2.5 text-sm font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors"
                    >
                      취소
                    </button>
                  )}
                </>
              ) : (
                <button
                  onClick={() => onApply(post.id)}
                  className="px-6 py-3 text-base font-bold rounded-lg transition-all bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl"
                >
                  경기 참가 신청하기
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetailCard;
