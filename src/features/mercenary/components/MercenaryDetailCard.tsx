// src/features/mercenary/components/MercenaryDetailCard.tsx

import React from "react";
import type { PostType } from "@/types/recruitPost";
import { RecruitStatus } from "@/types/recruitPost";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate } from "react-router-dom";

interface MercenaryDetailCardProps {
  post: PostType;
  isExpanded: boolean;
  onClose?: () => void;
  onExpand?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onApply?: (postId: number) => void;
  onAuthorNameClick?: () => void;
  isAlreadyApplied?: boolean; // 중복 신청 방지
  onCancelApplication?: () => void; // 신청 취소
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
  } else if (statusValue === RecruitStatus.IN_PROGRESS) {
    styleClass += "text-yellow-600";
    statusText = "진행/경기중";
  } else if (statusValue === RecruitStatus.CANCELLED) {
    styleClass += "text-red-600";
    statusText = "모집취소";
  } else if (statusValue === RecruitStatus.FINISHED) {
    styleClass += "text-gray-600";
    statusText = "종료";
  } else {
    styleClass += "text-gray-700";
  }
  return <span className={styleClass}>{statusText}</span>;
};

const MercenaryDetailCard: React.FC<MercenaryDetailCardProps> = ({
  post,
  isExpanded,
  onClose,
  onExpand,
  onEdit,
  onDelete,
  onApply,
  onAuthorNameClick,
  isAlreadyApplied = false,
  onCancelApplication,
}) => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const isTeamToIndividual = post.targetType === "USER";
  const flowLabel = isTeamToIndividual
    ? "🏃‍♂️ 팀 → 용병(개인)"
    : "🤝 용병(개인) → 팀";
  const dateLabel = isTeamToIndividual ? "경기 날짜" : "활동 가능 날짜";
  const timeLabel = isTeamToIndividual ? "경기 시간" : "활동 가능 시간";
  const positionLabel = isTeamToIndividual ? "모집 포지션" : "선호 포지션";

  const formattedDate = post.gameDate
    ? post.gameDate.toString().split("T")[0]
    : "날짜 미정";
  const formattedTime = post.gameTime || "시간 미정";

  const handleApply = () => {
    if (onApply) {
      onApply(post.id);
    }
  };

  // 작성 시간 상대 표시
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

  // 모집 진행도
  const getProgress = () => {
    const current = post.acceptedCount || 0;
    const required = post.requiredPersonnel;
    if (!required) return null;
    const percentage = Math.min((current / required) * 100, 100);
    return { current, required, percentage };
  };

  const progress = getProgress();
  /*
  const handleApply = async () => {
    const message = prompt("작성자에게 전달할 간단한 메시지를 입력하세요 (선택사항):");
    if (message === null) return;

    try {
      const responseMessage = await applyToPostApi(post.id, { message });
      alert(responseMessage);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  }; */

  // 요약 카드 (펼치기 전)
  if (!isExpanded) {
    return (
      <div
        className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200 ease-in-out h-full flex flex-col"
        onClick={onExpand}
      >
        <div className="relative w-full h-32">
          {post.thumbnailUrl ? (
            <img
              src={post.thumbnailUrl}
              alt={post.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-12 h-12"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.158 0a.075.075 0 0 1 .15 0A.075.075 0 0 1 12.908 8.25h.008a.075.075 0 0 1 0 .15A.075.075 0 0 1 12.908 8.4h-.008a.075.075 0 0 1-.15 0A.075.075 0 0 1 12.75 8.25h.008Z"
                />
              </svg>
            </div>
          )}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 shadow">
            {flowLabel}
          </div>
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="text-sm font-semibold mt-1 mb-1 text-gray-800 truncate">
            {post.title}
          </h3>
          <div className="text-xs text-gray-500 mt-auto space-y-0.5">
            <p>
              지역: {post.region}
              {post.subRegion ? ` ${post.subRegion}` : ""}
            </p>
            <p>일시: {formattedDate}</p>
            {post.authorName && <p>{post.authorName}</p>}
            {post.status && (
              <p>상태: {getStatusDisplayForDetail(post.status)}</p>
            )}
          </div>
        </div>
      </div>
    );
  }

  // 상세 카드 (펼친 후)
  return (
    <div className="bg-white shadow-xl rounded-xl overflow-hidden col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-6 border-b border-gray-200">
        <div className="flex justify-between items-start mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 bg-blue-500 text-white text-xs font-semibold rounded-full">
              {flowLabel}
            </span>
            {isUrgent() && (
              <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                🔥 긴급
              </span>
            )}
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                post.status === "RECRUITING"
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {getStatusDisplayForDetail(post.status)}
            </span>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
            >
              ×
            </button>
          )}
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h2>

        {/* 메타 정보 */}
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <span>👤</span>
            <span
              className={`font-medium ${
                onAuthorNameClick ? "text-blue-600 hover:underline cursor-pointer" : ""
              }`}
              onClick={(e) => {
                if (onAuthorNameClick) {
                  e.stopPropagation();
                  onAuthorNameClick();
                }
              }}
            >
              {post.authorName || "작성자"}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <span>🕐</span>
            <span>{getTimeAgo(post.createdAt)}</span>
          </div>
        </div>
      </div>

      {/* 썸네일 이미지 */}
      {post.thumbnailUrl && (
        <img
          src={post.thumbnailUrl}
          alt={post.title}
          className="w-full h-80 object-cover"
        />
      )}

      <div className="p-6">
        {/* 모집 진행 현황 */}
        {isTeamToIndividual && progress && (
          <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📊</span>
                <div>
                  <div className="text-sm text-gray-600">모집 현황</div>
                  <div className="text-xl font-bold text-blue-600">
                    {progress.current}/{progress.required}명
                  </div>
                </div>
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                  <span>진행률</span>
                  <span className="font-semibold">{Math.round(progress.percentage)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 ${
                      progress.percentage >= 100
                        ? "bg-green-500"
                        : progress.percentage >= 70
                        ? "bg-yellow-500"
                        : "bg-blue-500"
                    }`}
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 경기/활동 정보 */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">📅 경기 정보</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
            <div>
              <span className="text-sm text-gray-600">📅 {dateLabel}</span>
              <p className="font-semibold text-gray-900">{formattedDate}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">🕐 {timeLabel}</span>
              <p className="font-semibold text-gray-900">{formattedTime}</p>
            </div>
            <div>
              <span className="text-sm text-gray-600">📍 지역</span>
              <p className="font-semibold text-gray-900">
                {post.region} {post.subRegion || ""}
              </p>
            </div>
            {post.fieldLocation && (
              <div>
                <span className="text-sm text-gray-600">🏟️ 경기 장소</span>
                <a
                  href={`https://map.naver.com/v5/search/${encodeURIComponent(post.fieldLocation)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-1"
                  onClick={(e) => e.stopPropagation()}
                >
                  {post.fieldLocation}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        </div>

        {/* 모집 조건 */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">⚽ 모집 조건</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 bg-gray-50 p-4 rounded-lg">
            {isTeamToIndividual && post.requiredPersonnel != null && (
              <div>
                <span className="text-sm text-gray-600">👥 필요 인원</span>
                <p className="font-semibold text-gray-900">{post.requiredPersonnel}명</p>
              </div>
            )}
            {post.preferredPositions && (
              <div>
                <span className="text-sm text-gray-600">⚽ {positionLabel}</span>
                <p className="font-semibold text-gray-900">{post.preferredPositions}</p>
              </div>
            )}
            {post.ageGroup && (
              <div>
                <span className="text-sm text-gray-600">🎂 연령대</span>
                <p className="font-semibold text-gray-900">{post.ageGroup}</p>
              </div>
            )}
            {post.skillLevel && (
              <div>
                <span className="text-sm text-gray-600">⭐ 실력 수준</span>
                <p className="font-semibold text-gray-900">{post.skillLevel}</p>
              </div>
            )}
          </div>
        </div>


        {/* 상세 내용 */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-900 mb-3 text-lg">📝 상세 내용</h3>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {post.content || "내용이 없습니다."}
            </p>
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="flex flex-wrap gap-3 justify-end pt-4 border-t border-gray-200">
          {/* 신청 관련 버튼 */}
          {onApply && post.status === "RECRUITING" && (
            <>
              {isAlreadyApplied ? (
                <div className="flex gap-2">
                  <button
                    disabled
                    className="px-6 py-3 bg-gray-300 text-gray-600 rounded-lg font-semibold cursor-not-allowed"
                  >
                    ✅ 신청 완료
                  </button>
                  {onCancelApplication && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onCancelApplication();
                      }}
                      className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                    >
                      신청 취소
                    </button>
                  )}
                </div>
              ) : (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApply();
                  }}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  신청하기
                </button>
              )}
            </>
          )}

          {/* 작성자 전용 버튼 */}
          {onEdit && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors"
            >
              수정
            </button>
          )}
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
            >
              삭제
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MercenaryDetailCard;
