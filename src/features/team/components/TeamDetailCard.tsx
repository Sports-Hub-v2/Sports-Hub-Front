// src/features/team/components/TeamDetailCard.tsx
// 팀원 모집 상세 카드

import React from "react";
import type { PostType } from "@/types/recruitPost";
import { RecruitStatus } from "@/types/recruitPost";

interface TeamDetailCardProps {
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

const TeamDetailCard: React.FC<TeamDetailCardProps> = ({
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
  // 팀명 추출
  const extractTeamName = () => {
    const match = post.title.match(/\[(.*?)\]/);
    return match ? match[1] : null;
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

  // 모집 진행도
  const getProgress = () => {
    const current = post.acceptedCount || 0;
    const required = post.requiredPersonnel;
    if (!required) return null;
    const percentage = Math.min((current / required) * 100, 100);
    return { current, required, percentage };
  };

  const progress = getProgress();
  const teamName = extractTeamName();

  // 포지션 배열
  const positions = post.preferredPositions
    ? post.preferredPositions.split(",").map((p) => p.trim())
    : [];

  if (!isExpanded) return null;

  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden">
      {/* 상단: 팀 헤더 */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3 flex-wrap">
            {teamName && (
              <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg">
                <span className="text-2xl">⚽</span>
                <span className="text-white font-bold text-xl">{teamName}</span>
              </div>
            )}
            <span
              className={`px-3 py-1.5 text-sm font-bold rounded-full ${
                post.status === "RECRUITING"
                  ? "bg-white text-green-600"
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
        <div className="flex items-center gap-4 text-sm text-green-50">
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
              {post.authorName || "팀장"}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <span>🕐</span>
            <span>{getTimeAgo(post.createdAt)}</span>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* 모집 진행 현황 */}
        {progress && (
          <div className="mb-6 p-5 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border-2 border-green-200">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-500 text-white rounded-full w-12 h-12 flex items-center justify-center text-2xl">
                  👥
                </div>
                <div>
                  <div className="text-sm text-green-700 font-medium">모집 현황</div>
                  <div className="text-2xl font-bold text-green-600">
                    {progress.current}/{progress.required}명
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs text-green-700 mb-2">
                  <span className="font-medium">진행률</span>
                  <span className="font-bold text-base">{Math.round(progress.percentage)}%</span>
                </div>
                <div className="w-full bg-green-200 rounded-full h-3 overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 모집 포지션 */}
        {positions.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>⚽</span>
              <span>모집 포지션</span>
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              {positions.map((pos, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 bg-green-50 text-green-700 text-sm font-bold rounded-lg border-2 border-green-200 hover:bg-green-100 transition-colors"
                >
                  {pos}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 팀 정보 */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
            <span>📋</span>
            <span>팀 정보</span>
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {post.skillLevel && (
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-xs text-blue-600 font-medium mb-1">실력 수준</div>
                <div className="text-base font-bold text-blue-900">{post.skillLevel}</div>
              </div>
            )}
            {post.ageGroup && (
              <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                <div className="text-xs text-purple-600 font-medium mb-1">연령대</div>
                <div className="text-base font-bold text-purple-900">{post.ageGroup}</div>
              </div>
            )}
            {post.region && (
              <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                <div className="text-xs text-orange-600 font-medium mb-1">활동 지역</div>
                <div className="text-base font-bold text-orange-900">
                  {post.region} {post.subRegion}
                </div>
              </div>
            )}
            {post.fieldLocation && (
              <div className="p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                <div className="text-xs text-indigo-600 font-medium mb-1">주 활동 경기장</div>
                <div className="text-base font-bold text-indigo-900">{post.fieldLocation}</div>
              </div>
            )}
          </div>
        </div>

        {/* 팀 소개 */}
        {post.content && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3 flex items-center gap-2">
              <span>📝</span>
              <span>팀 소개</span>
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
                  className="px-6 py-3 text-base font-bold rounded-lg transition-all bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-lg hover:shadow-xl"
                >
                  팀 합류 신청하기
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamDetailCard;
