// src/features/match/components/MatchApplicationModal.tsx

import React, { useState } from "react";
import type { PostType } from "@/types/recruitPost";
import { useAuthStore } from "@/stores/useAuthStore";

interface MatchApplicationModalProps {
  post: PostType;
  onClose: () => void;
  onSubmit: (message: string) => Promise<void>;
}

const MatchApplicationModal: React.FC<MatchApplicationModalProps> = ({
  post,
  onClose,
  onSubmit,
}) => {
  const { user } = useAuthStore();

  const [message, setMessage] = useState(
    `안녕하세요! 경기 참가를 희망합니다.\n\n• 팀명: \n• 참가 인원: \n• 팀 실력: \n• 연락처: \n• 기타 사항: \n\n감사합니다.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("참가 신청 메시지를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(message);
      onClose();
    } catch (error) {
      console.error("경기 참가 신청 오류:", error);
    } finally {
      setIsSubmitting(false);
    }
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
    return null;
  };

  const dday = getDday();

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          {/* 헤더 */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span className="text-purple-600">⚽</span>
                경기 참가 신청
              </h2>
              <p className="text-sm text-gray-600 mt-1">경기 참가를 위한 신청서를 작성해주세요</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
            >
              ×
            </button>
          </div>

          {/* 경기 정보 */}
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 border-l-4 border-purple-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚽</span>
                <h3 className="font-bold text-lg text-gray-900">경기 정보</h3>
              </div>
              {dday && (
                <span
                  className={`px-3 py-1 text-sm font-bold rounded-full ${
                    dday === "D-Day"
                      ? "bg-red-500 text-white animate-pulse"
                      : "bg-yellow-400 text-yellow-900"
                  }`}
                >
                  {dday}
                </span>
              )}
            </div>
            <h4 className="font-semibold text-gray-800 mb-3">{post.title}</h4>

            {/* 경기 일정 - 크게 강조 */}
            <div className="grid grid-cols-2 gap-3 mb-3 p-3 bg-white/50 rounded-lg">
              <div>
                <span className="text-purple-700 font-bold text-sm">📅 경기 날짜</span>
                <p className="text-base font-bold text-purple-900 mt-1">
                  {formatGameDate(post.gameDate)}
                </p>
              </div>
              <div>
                <span className="text-purple-700 font-bold text-sm">🕐 경기 시간</span>
                <p className="text-base font-bold text-purple-900 mt-1">
                  {formatGameTime(post.gameTime)}
                </p>
              </div>
            </div>

            {/* 경기장 */}
            {post.fieldLocation && (
              <div className="p-3 bg-white/50 rounded-lg mb-3">
                <span className="text-purple-700 font-bold text-sm">🏟️ 경기장</span>
                <p className="text-base font-bold text-purple-900 mt-1">
                  {post.fieldLocation}
                </p>
                <p className="text-sm text-purple-700 mt-0.5">
                  {post.region} {post.subRegion}
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-sm">
              {post.skillLevel && (
                <div>
                  <span className="text-purple-700 font-medium">🎯 실력 수준:</span>
                  <span className="ml-2 text-gray-800">{post.skillLevel}</span>
                </div>
              )}
              {post.ageGroup && (
                <div>
                  <span className="text-purple-700 font-medium">👥 참가 연령:</span>
                  <span className="ml-2 text-gray-800">{post.ageGroup}</span>
                </div>
              )}
            </div>

            {post.content && (
              <div className="mt-3 pt-3 border-t border-purple-200">
                <p className="text-sm text-gray-700 line-clamp-3">{post.content}</p>
              </div>
            )}
          </div>

          {/* 신청자 정보 */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">신청자 정보</h3>
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-700">
                <span className="font-medium">이름:</span> {user?.nickname || user?.userid || "사용자"}
              </p>
              {user?.email && (
                <p className="text-sm text-gray-700 mt-1">
                  <span className="font-medium">이메일:</span> {user.email}
                </p>
              )}
            </div>
          </div>

          {/* 신청 메시지 폼 */}
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-900 mb-2">
                참가 신청 메시지 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={9}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                placeholder="주최자에게 전달할 메시지를 입력하세요..."
                required
              />
              <p className="text-xs text-purple-600 mt-2 flex items-start gap-1">
                <span>💡</span>
                <span>팀명, 참가 인원, 팀 실력, 연락처 등을 포함하면 매칭 확률이 높아집니다!</span>
              </p>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                disabled={isSubmitting}
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-lg transition-all font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "신청 중..." : "경기 참가 신청하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MatchApplicationModal;
