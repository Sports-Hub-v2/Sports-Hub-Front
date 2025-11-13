// src/features/mercenary/components/ApplicationModal.tsx

import React, { useState } from "react";
import type { PostType } from "@/types/recruitPost";
import { useAuthStore } from "@/stores/useAuthStore";

interface ApplicationModalProps {
  post: PostType;
  onClose: () => void;
  onSubmit: (message: string) => Promise<void>;
}

const ApplicationModal: React.FC<ApplicationModalProps> = ({
  post,
  onClose,
  onSubmit,
}) => {
  const { user } = useAuthStore();
  const [message, setMessage] = useState(
    "안녕하세요!\n\n해당 모집에 신청하고 싶습니다.\n\n• 포지션: \n• 경력: \n• 연락처: \n\n감사합니다."
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("신청 메시지를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(message);
      onClose();
    } catch (error) {
      console.error("신청 오류:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "날짜 미정";
    const date = new Date(dateString);
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekday = weekdays[date.getDay()];
    return `${month}월 ${day}일 (${weekday})`;
  };

  const formatTime = (timeString?: string) => {
    if (!timeString) return "시간 미정";
    return timeString;
  };

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
            <h2 className="text-2xl font-bold text-gray-900">모집글 신청</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
            >
              ×
            </button>
          </div>

          {/* 모집글 정보 */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <h3 className="font-bold text-lg text-gray-900 mb-3">{post.title}</h3>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">📅 날짜:</span>
                <span className="ml-2 font-medium">{formatDate(post.gameDate)}</span>
              </div>
              <div>
                <span className="text-gray-600">🕐 시간:</span>
                <span className="ml-2 font-medium">{formatTime(post.gameTime)}</span>
              </div>
              <div>
                <span className="text-gray-600">📍 지역:</span>
                <span className="ml-2 font-medium">
                  {post.region} {post.subRegion}
                </span>
              </div>
              {post.requiredPersonnel && (
                <div>
                  <span className="text-gray-600">👥 모집 인원:</span>
                  <span className="ml-2 font-medium">{post.requiredPersonnel}명</span>
                </div>
              )}
              {post.preferredPositions && (
                <div className="col-span-2">
                  <span className="text-gray-600">⚽ 포지션:</span>
                  <span className="ml-2 font-medium">{post.preferredPositions}</span>
                </div>
              )}
            </div>

            {post.content && (
              <div className="mt-3 pt-3 border-t border-blue-200">
                <p className="text-sm text-gray-700 line-clamp-3">{post.content}</p>
              </div>
            )}
          </div>

          {/* 신청자 정보 */}
          <div className="mb-6">
            <h3 className="font-semibold text-gray-900 mb-2">신청자 정보</h3>
            <div className="bg-gray-50 p-3 rounded">
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
                신청 메시지 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="작성자에게 전달할 메시지를 입력하세요..."
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                💡 포지션, 경력, 연락처 등을 포함하면 선발 확률이 높아집니다!
              </p>
            </div>

            {/* 버튼 */}
            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
                disabled={isSubmitting}
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={isSubmitting}
              >
                {isSubmitting ? "신청 중..." : "신청하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplicationModal;
