// src/features/team/components/TeamRecruitModal.tsx

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
  teamName: string;
  teamLevel: string;
  activityDay: string;
  activityTime: string;
  requiredPersonnel: number | "";
  ageGroup: string;
  preferredPositions: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: RecruitPostCreationRequestDto) => void;
  initialData?: PostType | null;
}

const TeamRecruitModal: React.FC<Props> = ({
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
    teamName: "",
    teamLevel: "중급",
    activityDay: "",
    activityTime: "",
    requiredPersonnel: "",
    ageGroup: "",
    preferredPositions: "",
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
        teamName: "",
        teamLevel: "중급",
        activityDay: "",
        activityTime: "",
        requiredPersonnel: initialData.requiredPersonnel ?? "",
        ageGroup: initialData.ageGroup || "",
        preferredPositions: initialData.preferredPositions || "",
      });
    } else {
      setFormData({
        title: "",
        content: "",
        region: "",
        subRegion: "",
        thumbnailUrl: "",
        teamName: "",
        teamLevel: "중급",
        activityDay: "",
        activityTime: "",
        requiredPersonnel: "",
        ageGroup: "",
        preferredPositions: "",
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
      matchDate: undefined,
      category: "TEAM",
      targetType: "USER",
      status: "RECRUITING",
    };

    try {
      await onSubmit(dto);
    } catch (error) {
      console.error("팀 모집글 작성 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="👥 팀원 모집 글 작성">
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

        {/* 팀 이름 / 팀 레벨 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
          <div>
            <label
              htmlFor="teamName"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              팀 이름
            </label>
            <input
              id="teamName"
              name="teamName"
              type="text"
              value={formData.teamName}
              onChange={handleInputChange}
              placeholder="예: 강남FC"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="teamLevel"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              팀 레벨
            </label>
            <select
              id="teamLevel"
              name="teamLevel"
              value={formData.teamLevel}
              onChange={handleInputChange}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            >
              <option value="입문">입문</option>
              <option value="초급">초급</option>
              <option value="중급">중급</option>
              <option value="고급">고급</option>
              <option value="세미프로">세미프로</option>
            </select>
          </div>
        </div>

        {/* 활동 요일 / 시간 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
          <div>
            <label
              htmlFor="activityDay"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              주 활동 요일
            </label>
            <input
              id="activityDay"
              name="activityDay"
              type="text"
              value={formData.activityDay}
              onChange={handleInputChange}
              placeholder="예: 주말, 평일 저녁"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="activityTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              주 활동 시간
            </label>
            <input
              id="activityTime"
              name="activityTime"
              type="text"
              value={formData.activityTime}
              onChange={handleInputChange}
              placeholder="예: 19:00~21:00"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        {/* 모집 인원 / 연령대 / 포지션 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5">
          <div>
            <label
              htmlFor="requiredPersonnel"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              모집 인원
            </label>
            <input
              id="requiredPersonnel"
              name="requiredPersonnel"
              type="number"
              min="0"
              value={formData.requiredPersonnel}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label
              htmlFor="ageGroup"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              연령대
            </label>
            <input
              id="ageGroup"
              name="ageGroup"
              type="text"
              value={formData.ageGroup}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="예: 20대, 30-40대"
            />
          </div>
          <div>
            <label
              htmlFor="preferredPositions"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              모집 포지션
            </label>
            <input
              id="preferredPositions"
              name="preferredPositions"
              type="text"
              value={formData.preferredPositions}
              onChange={handleInputChange}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="예: 미드필더, 전체"
            />
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

export default TeamRecruitModal;
