// src/components/common/TeamRecruitCard.tsx
// 팀원 모집 카드 - 팀 문화 및 정기 활동 중심

import React from "react";
import { useNavigate } from "react-router-dom";
import { PostType } from "@/types/recruitPost";

interface TeamRecruitCardProps {
  post: PostType;
  onClick?: () => void;
  onApply?: (postId: number) => void;
  isAlreadyApplied?: boolean;
  onCancelApplication?: (postId: number) => void;
}

const TeamRecruitCard: React.FC<TeamRecruitCardProps> = ({
  post,
  onClick,
  onApply,
  isAlreadyApplied = false,
  onCancelApplication,
}) => {
  const navigate = useNavigate();

  // 팀명 추출
  const extractTeamName = () => {
    const match = post.title.match(/\[(.*?)\]/);
    return match ? match[1] : null;
  };

  // 팀 페이지로 이동
  const handleTeamNameClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('팀명 클릭:', { teamId: post.teamId, postId: post.id, title: post.title });
    if (post.teamId) {
      navigate(`/teams/${post.teamId}`);
    } else {
      console.warn('teamId가 없습니다. 백엔드에서 teamId를 제공하는지 확인하세요.');
    }
  };

  // 작성 시간 표시
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
  const getRecruitmentProgress = () => {
    const current = post.acceptedCount || 0;
    const required = post.requiredPersonnel;
    if (!required) return null;
    const percentage = Math.min((current / required) * 100, 100);
    return { current, required, percentage };
  };

  const progress = getRecruitmentProgress();
  const teamName = extractTeamName();

  // 포지션 배열로 분리
  const positions = post.preferredPositions
    ? post.preferredPositions.split(",").map((p) => p.trim())
    : [];

  return (
    <div
      className="bg-white rounded-xl border-2 border-gray-200 hover:border-green-500 hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* 상단: 팀명 헤더 */}
      {teamName && (
        <div className="bg-gradient-to-r from-green-500 to-green-600 px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">⚽</span>
              <h3
                className="text-white font-bold text-sm hover:underline cursor-pointer"
                onClick={handleTeamNameClick}
              >
                {teamName}
              </h3>
            </div>
            <span className="text-xs text-green-100">{getTimeAgo(post.createdAt)}</span>
          </div>
        </div>
      )}

      <div className="p-4">
        {/* 상태 배지 */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full ${
              post.status === "RECRUITING"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {post.status === "RECRUITING" ? "🟢 모집중" : "⚫ 마감"}
          </span>

          {post.skillLevel && (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-50 text-blue-700 border border-blue-200">
              🎯 {post.skillLevel}
            </span>
          )}

          {post.ageGroup && (
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-purple-50 text-purple-700 border border-purple-200">
              👥 {post.ageGroup}
            </span>
          )}
        </div>

        {/* 제목 */}
        <h3 className="text-base font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
          {post.title}
        </h3>

        {/* 모집 포지션 */}
        {positions.length > 0 && (
          <div className="mb-3">
            <p className="text-xs text-gray-500 mb-1.5">모집 포지션</p>
            <div className="flex items-center gap-1.5 flex-wrap">
              {positions.map((pos, idx) => (
                <span
                  key={idx}
                  className="px-2.5 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-md border border-green-200"
                >
                  {pos}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* 모집 인원 프로그레스 */}
        {progress && (
          <div className="mb-3 p-3 bg-green-50 rounded-lg border border-green-100">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-green-700">
                모집 현황: {progress.current}/{progress.required}명
              </span>
              <span className="text-xs font-medium text-green-600">
                {Math.round(progress.percentage)}%
              </span>
            </div>
            <div className="w-full bg-green-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-green-500 to-green-600 h-2 transition-all duration-300"
                style={{ width: `${progress.percentage}%` }}
              />
            </div>
          </div>
        )}

        {/* 활동 정보 */}
        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="flex items-center gap-1.5 text-gray-700">
            <span>📍</span>
            <span className="truncate">
              {post.region} {post.subRegion}
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <span>🏟️</span>
            <span className="truncate">{post.fieldLocation || "협의"}</span>
          </div>
        </div>

        {/* 구분선 */}
        <hr className="border-gray-200 mb-3" />

        {/* 하단: 설명 + 버튼 */}
        <div className="flex items-end justify-between gap-3">
          <div className="flex-1 min-w-0">
            {post.content ? (
              <p className="text-xs text-gray-600 line-clamp-2 leading-relaxed">
                {post.content}
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                {post.authorName && `팀장: ${post.authorName}`}
              </p>
            )}
          </div>

          {/* 가입 신청 버튼 */}
          {onApply && post.status === "RECRUITING" && (
            <>
              {isAlreadyApplied ? (
                <div className="flex items-center gap-2">
                  <span className="px-3 py-2 text-sm font-bold rounded-lg whitespace-nowrap bg-gray-200 text-gray-600">
                    ✅ 신청완료
                  </span>
                  {onCancelApplication && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancelApplication(post.id);
                      }}
                      className="px-3 py-2 text-sm font-bold rounded-lg transition-all whitespace-nowrap bg-red-50 hover:bg-red-100 text-red-600 border border-red-200"
                    >
                      취소
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onApply(post.id);
                  }}
                  className="px-4 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-md hover:shadow-lg"
                >
                  팀 합류하기
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamRecruitCard;
