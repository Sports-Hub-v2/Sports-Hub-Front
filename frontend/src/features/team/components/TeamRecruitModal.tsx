// src/features/team/components/TeamRecruitModal.tsx

import { useState, useEffect } from "react";
import { X, Users, MapPin, Calendar, Clock, Trophy, Star } from "lucide-react";
import type {
  PostType,
  RecruitPostCreationRequestDto,
} from "@/types/recruitPost";

interface TeamRecruitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RecruitPostCreationRequestDto) => void;
  post?: PostType | null;
  isEditing?: boolean;
}

const TeamRecruitModal = ({
  isOpen,
  onClose,
  onSubmit,
  post,
  isEditing = false,
}: TeamRecruitModalProps) => {
  const [formData, setFormData] = useState<RecruitPostCreationRequestDto>({
    category: "team",
    targetType: "USER", // 팀은 항상 USER를 대상으로 모집
    title: "",
    content: "",
    requiredPeople: 1,
    location: "",
    date: "",
    time: "",
    imageUrl: "",
    skillLevel: "ALL",
  });

  useEffect(() => {
    if (isEditing && post) {
      setFormData({
        category: "team",
        targetType: "USER",
        title: post.title || "",
        content: post.content || "",
        requiredPeople: post.requiredPeople || 1,
        location: post.location || "",
        date: post.date || "",
        time: post.time || "",
        imageUrl: post.imageUrl || "",
        skillLevel: post.skillLevel || "ALL",
      });
    } else {
      setFormData({
        category: "team",
        targetType: "USER",
        title: "",
        content: "",
        requiredPeople: 1,
        location: "",
        date: "",
        time: "",
        imageUrl: "",
        skillLevel: "ALL",
      });
    }
  }, [isEditing, post, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  const handleChange = (
    field: keyof RecruitPostCreationRequestDto,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">
                {isEditing ? "팀 모집글 수정" : "팀원 모집하기"}
              </h2>
              <p className="text-sm text-gray-500">
                우리 팀에 합류할 새로운 팀원을 모집해보세요
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              모집 제목 *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="예: 축구팀 공격수 모집합니다"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {/* 모집 인원 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              모집 인원 *
            </label>
            <input
              type="number"
              value={formData.requiredPeople}
              onChange={(e) =>
                handleChange("requiredPeople", parseInt(e.target.value))
              }
              min="1"
              max="20"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              required
            />
          </div>

          {/* 실력 수준 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              원하는 실력 수준
            </label>
            <select
              value={formData.skillLevel}
              onChange={(e) => handleChange("skillLevel", e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            >
              <option value="ALL">무관</option>
              <option value="BEGINNER">초급</option>
              <option value="INTERMEDIATE">중급</option>
              <option value="ADVANCED">고급</option>
              <option value="PROFESSIONAL">프로</option>
            </select>
          </div>

          {/* 위치 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              주요 활동 지역 *
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleChange("location", e.target.value)}
                placeholder="예: 서울 강남구, 부산 해운대구"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                required
              />
            </div>
          </div>

          {/* 날짜와 시간 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                모집 마감일
              </label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => handleChange("date", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                선호 활동 시간
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="time"
                  value={formData.time}
                  onChange={(e) => handleChange("time", e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
              </div>
            </div>
          </div>

          {/* 팀 소개 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              팀 소개 및 모집 내용 *
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => handleChange("content", e.target.value)}
              placeholder="팀 소개, 모집하는 포지션, 활동 계획 등을 자세히 적어주세요"
              rows={6}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
              required
            />
          </div>

          {/* 팀 이미지 URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              팀 로고/이미지 URL (선택)
            </label>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={(e) => handleChange("imageUrl", e.target.value)}
              placeholder="https://example.com/team-logo.jpg"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* 버튼 */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center justify-center gap-2"
            >
              <Trophy className="w-4 h-4" />
              {isEditing ? "수정하기" : "팀원 모집"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TeamRecruitModal;
