// src/components/common/RecruitPostModal.tsx

import React, { useState, useEffect } from 'react';
import { useAuthStore } from "@/stores/useAuthStore";
import {
  RecruitCategory,
  RecruitTargetType,
  ParticipantType,
  PostType,
  RecruitPostCreationRequestDto
} from "@/types/recruitPost";
import { REGIONS } from '@/constants/regions';
import Modal from '@/components/common/Modal';

interface FormData {
  title: string;
  content: string;
  region: string;
  subRegion: string;
  gameDate: string;
  gameTime: string;
  requiredPersonnel: number | '';
  preferredPositions: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: RecruitPostCreationRequestDto) => Promise<void>;
  category: RecruitCategory;
  initialData?: PostType | null;
}

type RecruitmentFlow = 'TEAM_TO_INDIVIDUAL' | 'INDIVIDUAL_TO_TEAM';

const RecruitPostModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, category, initialData }) => {
  const { user } = useAuthStore();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    region: "",
    subRegion: "",
    gameDate: "",
    gameTime: "",
    requiredPersonnel: '',
    preferredPositions: "",
  });

  const [recruitmentFlow, setRecruitmentFlow] = useState<RecruitmentFlow>('TEAM_TO_INDIVIDUAL');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // 카테고리별 설정
  const categoryConfig = {
    [RecruitCategory.MERCENARY]: {
      title: "용병 모집",
      emoji: "🔥",
    },
    [RecruitCategory.TEAM]: {
      title: "팀원 모집",
      emoji: "🛡️",
    },
    [RecruitCategory.MATCH]: {
      title: "경기 모집",
      emoji: "🏟️",
    },
  };

  const config = categoryConfig[category];

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        title: initialData.title || "",
        content: initialData.content || "",
        region: initialData.region || "",
        subRegion: initialData.subRegion || "",
        gameDate: initialData.gameDate ? initialData.gameDate.substring(0, 10) : "",
        gameTime: initialData.gameTime || "",
        requiredPersonnel: initialData.requiredPersonnel ?? '',
        preferredPositions: initialData.preferredPositions || "",
      });
      if (category === RecruitCategory.MERCENARY) {
        setRecruitmentFlow(initialData.fromParticipant === 'INDIVIDUAL' ? 'INDIVIDUAL_TO_TEAM' : 'TEAM_TO_INDIVIDUAL');
      }
    } else if (isOpen) {
      setFormData({
        title: "", content: "", region: "", subRegion: "",
        gameDate: "", gameTime: "", requiredPersonnel: '',
        preferredPositions: "",
      });
      setRecruitmentFlow('TEAM_TO_INDIVIDUAL');
      setFormError(null);
    }
  }, [initialData, isOpen, category]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!user) {
      setFormError("글을 작성하려면 로그인이 필요합니다.");
      return;
    }

    if (!formData.title.trim() || !formData.content.trim() || !formData.region) {
      setFormError("제목, 내용, 지역은 필수 입력 항목입니다.");
      return;
    }

    setIsLoading(true);

    const isTeamToIndividual = recruitmentFlow === 'TEAM_TO_INDIVIDUAL';

    const dto: RecruitPostCreationRequestDto = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: category,
      region: formData.region,
      subRegion: formData.subRegion.trim() || undefined,
      gameDate: formData.gameDate || undefined,
      gameTime: formData.gameTime || undefined,
      requiredPersonnel: formData.requiredPersonnel !== '' ? Number(formData.requiredPersonnel) : undefined,
      preferredPositions: formData.preferredPositions.trim() || undefined,
      fromParticipant: category === RecruitCategory.MERCENARY
        ? (isTeamToIndividual ? ParticipantType.TEAM : ParticipantType.INDIVIDUAL)
        : ParticipantType.TEAM,
      toParticipant: category === RecruitCategory.MERCENARY
        ? (isTeamToIndividual ? ParticipantType.INDIVIDUAL : ParticipantType.TEAM)
        : ParticipantType.INDIVIDUAL,
      targetType: category === RecruitCategory.MERCENARY
        ? (isTeamToIndividual ? RecruitTargetType.USER : RecruitTargetType.TEAM)
        : RecruitTargetType.USER,
    };

    try {
      await onSubmit(dto);
    } catch (error) {
      console.error("게시글 저장 실패:", error);
      setFormError("게시글 저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${config.emoji} ${config.title}`}>
      <form onSubmit={handleSubmit} className="space-y-5">

        {/* 섹션 1: 기본 정보 */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-gray-600 mb-3 flex items-center gap-2">
            <span>📋</span> 기본 정보
          </h3>
          <div className="space-y-3">
            {/* 용병 전용: 모집 유형 */}
            {category === RecruitCategory.MERCENARY && (
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  모집 유형
                </label>
                <select
                  value={recruitmentFlow}
                  onChange={(e) => setRecruitmentFlow(e.target.value as RecruitmentFlow)}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="TEAM_TO_INDIVIDUAL">팀에서 용병 모집</option>
                  <option value="INDIVIDUAL_TO_TEAM">개인이 팀 찾기</option>
                </select>
              </div>
            )}

            {/* 제목 */}
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="모집글 제목을 입력하세요"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* 지역 / 세부지역 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  지역 <span className="text-red-500">*</span>
                </label>
                <select
                  name="region"
                  required
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">지역 선택</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-500 mb-1">
                  세부 지역
                </label>
                <input
                  name="subRegion"
                  type="text"
                  value={formData.subRegion}
                  onChange={handleInputChange}
                  placeholder="예: 강남구"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 섹션 2: 일정 */}
        <div className="bg-blue-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-blue-600 mb-3 flex items-center gap-2">
            <span>📅</span> 일정
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                날짜 <span className="text-red-500">*</span>
              </label>
              <input
                name="gameDate"
                type="date"
                required
                value={formData.gameDate}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                시간 <span className="text-red-500">*</span>
              </label>
              <input
                name="gameTime"
                type="time"
                required
                value={formData.gameTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 섹션 3: 모집 조건 */}
        <div className="bg-green-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-green-600 mb-3 flex items-center gap-2">
            <span>👥</span> 모집 조건
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                모집 인원
              </label>
              <input
                name="requiredPersonnel"
                type="number"
                min="1"
                value={formData.requiredPersonnel}
                onChange={handleInputChange}
                placeholder="명"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">
                포지션
              </label>
              <input
                name="preferredPositions"
                type="text"
                value={formData.preferredPositions}
                onChange={handleInputChange}
                placeholder="예: FW, MF"
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* 섹션 4: 상세 내용 */}
        <div className="bg-yellow-50 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-yellow-600 mb-3 flex items-center gap-2">
            <span>📝</span> 상세 내용
          </h3>
          <textarea
            name="content"
            required
            value={formData.content}
            onChange={handleInputChange}
            placeholder="모집 내용을 자세히 작성해주세요 (연령대, 실력 수준, 기타 요구사항 등)"
            rows={4}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* 에러 메시지 */}
        {formError && (
          <div className="p-3 bg-red-50 border border-red-300 text-red-600 text-sm rounded-md">
            {formError}
          </div>
        )}

        {/* 버튼 */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-5 py-2.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-5 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? "등록 중..." : (initialData ? "수정하기" : "등록하기")}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default RecruitPostModal;
