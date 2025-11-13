// src/features/team/components/TeamApplicationModal.tsx

import React, { useState } from "react";
import type { PostType } from "@/types/recruitPost";
import { useAuthStore } from "@/stores/useAuthStore";

interface TeamApplicationModalProps {
  post: PostType;
  onClose: () => void;
  onSubmit: (message: string) => Promise<void>;
}

const TeamApplicationModal: React.FC<TeamApplicationModalProps> = ({
  post,
  onClose,
  onSubmit,
}) => {
  const { user } = useAuthStore();

  // 팀명 추출
  const extractTeamName = () => {
    const match = post.title.match(/\[(.*?)\]/);
    return match ? match[1] : "팀";
  };

  const teamName = extractTeamName();

  const [message, setMessage] = useState(
    `안녕하세요! ${teamName}에 가입하고 싶습니다.\n\n• 희망 포지션: \n• 축구 경력: \n• 주 활동 가능 시간: \n• 자기소개: \n• 연락처: \n\n감사합니다.`
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      alert("가입 신청 메시지를 입력해주세요.");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(message);
      onClose();
    } catch (error) {
      console.error("팀 가입 신청 오류:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 포지션 배열
  const positions = post.preferredPositions
    ? post.preferredPositions.split(",").map((p) => p.trim())
    : [];

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
                <span className="text-green-600">⚽</span>
                팀 가입 신청
              </h2>
              <p className="text-sm text-gray-600 mt-1">팀에 합류하기 위한 신청서를 작성해주세요</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
            >
              ×
            </button>
          </div>

          {/* 팀 정보 */}
          <div className="bg-gradient-to-br from-green-50 to-green-100 border-l-4 border-green-500 p-4 mb-6 rounded-lg">
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">⚽</span>
              <h3 className="font-bold text-lg text-gray-900">{teamName}</h3>
            </div>
            <h4 className="font-semibold text-gray-800 mb-2">{post.title}</h4>

            <div className="grid grid-cols-2 gap-3 text-sm mt-3">
              {post.region && (
                <div>
                  <span className="text-green-700 font-medium">📍 활동 지역:</span>
                  <span className="ml-2 text-gray-800">
                    {post.region} {post.subRegion}
                  </span>
                </div>
              )}
              {post.fieldLocation && (
                <div>
                  <span className="text-green-700 font-medium">🏟️ 주 활동 경기장:</span>
                  <span className="ml-2 text-gray-800">{post.fieldLocation}</span>
                </div>
              )}
              {post.skillLevel && (
                <div>
                  <span className="text-green-700 font-medium">🎯 실력 수준:</span>
                  <span className="ml-2 text-gray-800">{post.skillLevel}</span>
                </div>
              )}
              {post.ageGroup && (
                <div>
                  <span className="text-green-700 font-medium">👥 연령대:</span>
                  <span className="ml-2 text-gray-800">{post.ageGroup}</span>
                </div>
              )}
              {post.requiredPersonnel && (
                <div>
                  <span className="text-green-700 font-medium">👤 모집 인원:</span>
                  <span className="ml-2 text-gray-800">{post.requiredPersonnel}명</span>
                </div>
              )}
            </div>

            {positions.length > 0 && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <span className="text-green-700 font-medium text-sm">⚽ 모집 포지션:</span>
                <div className="flex items-center gap-2 flex-wrap mt-2">
                  {positions.map((pos, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full"
                    >
                      {pos}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {post.content && (
              <div className="mt-3 pt-3 border-t border-green-200">
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
                가입 신청 메시지 <span className="text-red-500">*</span>
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={10}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                placeholder="팀장에게 전달할 메시지를 입력하세요..."
                required
              />
              <p className="text-xs text-green-600 mt-2 flex items-start gap-1">
                <span>💡</span>
                <span>희망 포지션, 축구 경력, 활동 가능 시간 등을 포함하면 승인 확률이 높아집니다!</span>
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
                className="flex-1 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white rounded-lg transition-all font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? "신청 중..." : "팀 가입 신청하기"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TeamApplicationModal;
