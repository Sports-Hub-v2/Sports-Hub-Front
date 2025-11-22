// src/components/common/MatchRecruitCard.tsx
// 경기 모집 카드 - 경기 일정 및 장소 중심

import React from "react";
import { useNavigate } from "react-router-dom";
import { PostType } from "@/types/recruitPost";

interface MatchRecruitCardProps {
  post: PostType;
  onClick?: () => void;
  onApply?: (postId: number) => void;
  isAlreadyApplied?: boolean;
  onCancelApplication?: (postId: number) => void;
}

const MatchRecruitCard: React.FC<MatchRecruitCardProps> = ({
  post,
  onClick,
  onApply,
  isAlreadyApplied = false,
  onCancelApplication,
}) => {
  const navigate = useNavigate();

  // 팀 페이지로 이동
  const handleTeamClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('팀 클릭:', { teamId: post.teamId, teamName: post.teamName });
    if (post.teamId) {
      console.log('네비게이션 실행:', `/teams/${post.teamId}`);
      navigate(`/teams/${post.teamId}`);
    } else {
      console.warn('팀 ID가 없습니다.');
    }
  };

  // 경기장 위치 클릭 시 네이버 지도로 이동
  const handleLocationClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (post.fieldLocation) {
      const searchQuery = encodeURIComponent(`${post.region} ${post.subRegion || ''} ${post.fieldLocation}`.trim());
      window.open(`https://map.naver.com/v5/search/${searchQuery}`, '_blank');
    }
  };

  // D-day 계산
  const getDday = () => {
    if (!post.gameDate) return null;
    const gameDate = new Date(post.gameDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    gameDate.setHours(0, 0, 0, 0);
    const diffTime = gameDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "D-Day";
    if (diffDays > 0) return `D-${diffDays}`;
    return `경기종료`;
  };

  // 날짜 포맷팅
  const formatGameDate = (dateString?: string) => {
    if (!dateString) return "날짜 미정";
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];
    return `${month}월 ${day}일 (${weekday})`;
  };

  // 시간 포맷팅
  const formatGameTime = (timeString?: string) => {
    if (!timeString) return "시간 미정";
    const [hour, minute] = timeString.split(":").map(Number);
    const period = hour >= 12 ? "오후" : "오전";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${period} ${displayHour}:${minute.toString().padStart(2, "0")}`;
  };

  // 경기 타입 추출
  const getMatchType = () => {
    const title = post.title.toLowerCase();
    if (title.includes("풋살")) return "풋살";
    if (title.includes("친선")) return "친선전";
    if (title.includes("리그")) return "리그전";
    if (title.includes("토너먼트")) return "토너먼트";
    return "경기";
  };

  // 긴급 여부
  const isUrgent = () => {
    if (!post.gameDate) return false;
    const gameDate = new Date(post.gameDate);
    const today = new Date();
    const diffDays = Math.ceil(
      (gameDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );
    return diffDays <= 3 && diffDays >= 0;
  };

  const dday = getDday();
  const matchType = getMatchType();

  return (
    <div
      className="bg-white rounded-xl border-2 border-gray-200 hover:border-purple-500 hover:shadow-xl transition-all duration-200 cursor-pointer overflow-hidden"
      onClick={onClick}
    >
      {/* 상단: 경기 날짜 헤더 */}
      <div className="bg-gradient-to-r from-purple-600 to-purple-700 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1.5">
              <p className="text-white font-bold text-lg leading-none">
                {formatGameDate(post.gameDate)}
              </p>
            </div>
            {dday && (
              <span
                className={`px-2.5 py-1 text-xs font-bold rounded-full ${
                  dday === "D-Day"
                    ? "bg-red-500 text-white animate-pulse"
                    : dday.startsWith("D-")
                    ? "bg-yellow-400 text-yellow-900"
                    : "bg-gray-400 text-white"
                }`}
              >
                {dday}
              </span>
            )}
          </div>
          {isUrgent() && (
            <span className="bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-full animate-pulse">
              🔥 긴급
            </span>
          )}
        </div>
      </div>

      <div className="p-4">
        {/* 경기 시간 & 타입 */}
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <span className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-50 text-purple-700 text-sm font-semibold rounded-lg border border-purple-200">
            🕐 {formatGameTime(post.gameTime)}
          </span>
          <span className="px-3 py-1.5 bg-indigo-50 text-indigo-700 text-sm font-semibold rounded-lg border border-indigo-200">
            ⚽ {matchType}
          </span>
          <span
            className={`px-3 py-1 text-xs font-bold rounded-full ${
              post.status === "RECRUITING"
                ? "bg-green-100 text-green-700"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {post.status === "RECRUITING" ? "🟢 모집중" : "⚫ 마감"}
          </span>
        </div>

        {/* 제목 */}
        <h3 className="text-base font-bold text-gray-900 mb-3 leading-tight line-clamp-2">
          {post.title}
        </h3>

        {/* 경기장 위치 - 크게 강조 */}
        <div
          className="mb-3 p-3 bg-purple-50 rounded-lg border border-purple-100 hover:bg-purple-100 hover:border-purple-200 cursor-pointer transition-colors"
          onClick={handleLocationClick}
          title="지도에서 보기"
        >
          <div className="flex items-start gap-2">
            <span className="text-lg mt-0.5">📍</span>
            <div className="flex-1">
              <p className="text-xs text-purple-600 font-medium mb-0.5 flex items-center gap-1">
                경기장 <span className="text-[10px]">🗺️</span>
              </p>
              <p className="text-sm font-bold text-purple-900">
                {post.fieldLocation || "장소 미정"}
              </p>
              <p className="text-xs text-purple-600 mt-0.5">
                {post.region} {post.subRegion}
              </p>
            </div>
          </div>
        </div>

        {/* 경기 정보 그리드 */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {post.skillLevel && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-500">🎯 실력</span>
              <span className="font-semibold text-gray-900">{post.skillLevel}</span>
            </div>
          )}
          {post.ageGroup && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-500">👥 연령</span>
              <span className="font-semibold text-gray-900">{post.ageGroup}</span>
            </div>
          )}
          {post.requiredPersonnel && (
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-gray-500">🙋 모집</span>
              <span className="font-semibold text-gray-900">
                {post.acceptedCount || 0}/{post.requiredPersonnel}명
              </span>
            </div>
          )}
        </div>

        {/* 구분선 */}
        <hr className="border-gray-200 mb-3" />

        {/* 하단: 설명 + 버튼 */}
        <div className="flex items-end justify-between gap-3">
          <div className="flex-1 min-w-0">
            {post.authorName && (
              <p className="text-xs text-gray-500 mb-1">
                주최: <span className="font-semibold text-gray-700">{post.authorName}</span>
                {post.teamName && (
                  <>
                    <span className="text-gray-400 mx-1">|</span>
                    <span
                      className="font-semibold text-purple-600 hover:text-purple-700 cursor-pointer hover:underline"
                      onClick={handleTeamClick}
                      title={post.teamId ? "팀 페이지로 이동" : "팀 정보 없음"}
                    >
                      {post.teamName}
                    </span>
                  </>
                )}
              </p>
            )}
            {post.content && (
              <p className="text-xs text-gray-600 line-clamp-1 leading-relaxed">
                {post.content}
              </p>
            )}
          </div>

          {/* 경기 신청 버튼 */}
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
                  className="px-4 py-2.5 text-sm font-bold rounded-lg transition-all whitespace-nowrap bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-md hover:shadow-lg"
                >
                  경기 신청
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchRecruitCard;
