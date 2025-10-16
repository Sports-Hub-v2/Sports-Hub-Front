// src/features/match/components/MatchRecruitModal.tsx

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { PostType, RecruitPostCreationRequestDto } from "@/types/recruitPost";
import { REGIONS } from "@/constants/regions";
import Modal from "@/components/common/Modal";
import RecruitPostBaseForm from "@/components/common/RecruitPostBaseForm";

interface FormData {
  title: string;
  content: string;
  region: string;
  subRegion: string;
  thumbnailUrl: string;
  gameDate: string;
  gameTime: string;
  location: string;
  field: string;
  matchType: string;
  teamSize: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: RecruitPostCreationRequestDto) => void;
  initialData?: PostType | null;
}

const MatchRecruitModal: React.FC<Props> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const { user } = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    region: "",
    subRegion: "",
    thumbnailUrl: "",
    gameDate: "",
    gameTime: "",
    location: "",
    field: "",
    matchType: "친선경기",
    teamSize: "6vs6",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        title: initialData.title || "",
        content: initialData.content || "",
        region: initialData.region || "",
        subRegion: initialData.subRegion || "",
        thumbnailUrl: initialData.thumbnailUrl || "",
        gameDate: initialData.gameDate
          ? initialData.gameDate.substring(0, 10)
          : "",
        gameTime: initialData.gameTime || "",
        location: "",
        field: "",
        matchType: "친선경기",
        teamSize: "6vs6",
      });
    } else {
      setFormData({
        title: "",
        content: "",
        region: "",
        subRegion: "",
        thumbnailUrl: "",
        gameDate: "",
        gameTime: "",
        location: "",
        field: "",
        matchType: "친선경기",
        teamSize: "6vs6",
      });
      setFormError(null);
    }
  }, [initialData, isOpen]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!user) {
      setFormError("글을 작성하려면 로그인이 필요합니다.");
      return;
    }

    if (
      !formData.title.trim() ||
      !formData.content.trim() ||
      !formData.region
    ) {
      setFormError("제목, 내용, 지역은 필수 입력 항목입니다.");
      return;
    }

    setIsLoading(true);

    const dto: RecruitPostCreationRequestDto = {
      teamId: 1,
      writerProfileId: user.profileId || 1,
      title: formData.title.trim(),
      content: formData.content.trim(),
      region: formData.region,
      imageUrl: formData.thumbnailUrl.trim() || undefined,
      matchDate: formData.gameDate || undefined,
      category: "MATCH",
      targetType: "TEAM",
      status: "RECRUITING",
    };

    try {
      await onSubmit(dto);
    } catch (error) {
      console.error("경기 모집글 작성 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="⚽ 경기 모집 글 작성">
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 공통 기본 폼 */}
        <RecruitPostBaseForm
          formData={formData}
          handleInputChange={handleInputChange}
        />

        {/* 지역 / 세부 지역 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
          <div>
            <label
              htmlFor="region"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              주요 지역 <span className="text-red-500">*</span>
            </label>
            <select
              id="region"
              name="region"
              required
              value={formData.region}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">지역 선택</option>
              {REGIONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="subRegion"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              세부 지역
            </label>
            <input
              id="subRegion"
              name="subRegion"
              type="text"
              value={formData.subRegion}
              onChange={handleInputChange}
              placeholder="예: 강남구"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>
        </div>

        {/* 경기 날짜 / 시간 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
          <div>
            <label
              htmlFor="gameDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              경기 날짜
            </label>
            <input
              id="gameDate"
              name="gameDate"
              type="date"
              value={formData.gameDate}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="gameTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              경기 시간
            </label>
            <input
              id="gameTime"
              name="gameTime"
              type="time"
              value={formData.gameTime}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* 경기장 정보 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
          <div>
            <label
              htmlFor="location"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              경기장 위치
            </label>
            <input
              id="location"
              name="location"
              type="text"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="예: 서울 강남구 테헤란로 123"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="field"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              경기장 종류
            </label>
            <select
              id="field"
              name="field"
              value={formData.field}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="">선택</option>
              <option value="잔디구장">잔디구장</option>
              <option value="인조잔디">인조잔디</option>
              <option value="풋살장">풋살장</option>
            </select>
          </div>
        </div>

        {/* 경기 유형 / 인원 구성 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
          <div>
            <label
              htmlFor="matchType"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              경기 유형
            </label>
            <select
              id="matchType"
              name="matchType"
              value={formData.matchType}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="친선경기">친선경기</option>
              <option value="연습경기">연습경기</option>
              <option value="리그전">리그전</option>
              <option value="토너먼트">토너먼트</option>
            </select>
          </div>
          <div>
            <label
              htmlFor="teamSize"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              인원 구성
            </label>
            <select
              id="teamSize"
              name="teamSize"
              value={formData.teamSize}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="5vs5">5vs5</option>
              <option value="6vs6">6vs6</option>
              <option value="7vs7">7vs7</option>
              <option value="8vs8">8vs8</option>
              <option value="11vs11">11vs11</option>
            </select>
          </div>
        </div>

        {formError && (
          <div className="p-3 bg-red-50 border border-red-300 text-red-600 text-sm rounded-md">
            {formError}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6 border-t mt-6">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {isLoading ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MatchRecruitModal;
