// src/features/mercenary/components/MercenaryPostModal.tsx

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
import RecruitPostBaseForm from '@/components/common/RecruitPostBaseForm';

interface FormData {
  title: string;
  content: string;
  region: string;
  subRegion: string;
  thumbnailUrl: string;
  gameDate: string;
  gameTime: string;
  requiredPersonnel: number | '';
  ageGroup: string;
  preferredPositions: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: RecruitPostCreationRequestDto) => void;
  initialData?: PostType | null;
}

type RecruitmentFlow = 'TEAM_TO_INDIVIDUAL' | 'INDIVIDUAL_TO_TEAM';

const MercenaryPostModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { user } = useAuthStore();

  // ▼▼▼ 2. useState에 위에서 정의한 FormData 타입을 명시적으로 적용합니다. ▼▼▼
  const [formData, setFormData] = useState<FormData>({
    title: "",
    content: "",
    region: "",
    subRegion: "",
    thumbnailUrl: "",
    gameDate: "",
    gameTime: "",
    requiredPersonnel: '',
    ageGroup: "",
    preferredPositions: "",
  });
  
  const [recruitmentFlow, setRecruitmentFlow] = useState<RecruitmentFlow>('TEAM_TO_INDIVIDUAL');
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
        gameDate: initialData.gameDate ? initialData.gameDate.substring(0, 10) : "",
        gameTime: initialData.gameTime || "",
        requiredPersonnel: initialData.requiredPersonnel ?? '',
        ageGroup: initialData.ageGroup || "",
        preferredPositions: initialData.preferredPositions || "",
      });
      setRecruitmentFlow(initialData.fromParticipant === 'INDIVIDUAL' ? 'INDIVIDUAL_TO_TEAM' : 'TEAM_TO_INDIVIDUAL');
    } else {
      setFormData({
        title: "", content: "", region: "", subRegion: "", thumbnailUrl: "",
        gameDate: "", gameTime: "", requiredPersonnel: '', ageGroup: "", preferredPositions: "",
      });
      setRecruitmentFlow('TEAM_TO_INDIVIDUAL');
      setFormError(null);
    }
  }, [initialData, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // ... (디버깅 코드는 그대로 유지)
    console.log("[1] '등록하기' 버튼 클릭됨, handleSubmit 함수 시작");
    setFormError(null);
    if (!user) { console.error("[DEBUG] 로그인 검사 실패!"); setFormError("글을 작성하려면 로그인이 필요합니다."); return; }
    console.log(" [2] 로그인 상태 확인 완료");
    if (!formData.title.trim() || !formData.content.trim() || !formData.region) { console.error("[DEBUG] 필수 필드 검사 실패!"); setFormError("제목, 내용, 지역은 필수 입력 항목입니다."); return; }
    console.log(" [3] 필수 필드 검사 통과, API 호출 준비");
    
    setIsLoading(true);

    const isTeamToIndividual = recruitmentFlow === 'TEAM_TO_INDIVIDUAL';
    const dto: RecruitPostCreationRequestDto = {
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: RecruitCategory.MERCENARY,
      region: formData.region,
      subRegion: formData.subRegion.trim() || undefined,
      thumbnailUrl: formData.thumbnailUrl.trim() || undefined, // ◀ thumbnailUrl 추가
      gameDate: formData.gameDate || undefined,
      gameTime: formData.gameTime || undefined,
      requiredPersonnel: isTeamToIndividual ? (formData.requiredPersonnel === '' ? undefined : Number(formData.requiredPersonnel)) : undefined,
      ageGroup: isTeamToIndividual ? (formData.ageGroup.trim() || undefined) : undefined,
      preferredPositions: formData.preferredPositions.trim() || undefined,
      fromParticipant: isTeamToIndividual ? ParticipantType.TEAM : ParticipantType.INDIVIDUAL,
      toParticipant: isTeamToIndividual ? ParticipantType.INDIVIDUAL : ParticipantType.TEAM,
      targetType: isTeamToIndividual ? RecruitTargetType.USER : RecruitTargetType.TEAM,
    };

    try {
      console.log("[4] API 호출 실행 직전. 보낼 데이터(DTO):", dto);
      await onSubmit(dto);
      console.log("[5] API 호출 성공!");
    } catch (error) {
       console.error("[DEBUG] API 호출 중 에러 발생!", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isTeamToIndividual = recruitmentFlow === 'TEAM_TO_INDIVIDUAL';
  const dateLabel = isTeamToIndividual ? '경기 날짜' : '활동 가능 날짜';
  const timeLabel = isTeamToIndividual ? '경기 시간' : '활동 가능 시간';
  const positionLabel = isTeamToIndividual ? '모집 포지션' : '선호 포지션';
  //const modalTitle = initialData ? "✏️ 모집 글 수정" : "✏️ 용병 모집 글 작성";
  //const submitButtonText = initialData ? "수정하기" : "등록하기";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="✏️ 용병 모집 글 작성">
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* 1. 공통 기본 폼 (제목, 내용) */}
        <RecruitPostBaseForm formData={formData} handleInputChange={handleInputChange} />
        
        {/* --- 2. MercenaryPostModal에서 직접 조립하는 커스텀 필드들 --- */}
        
        {/* 지역 / 세부 지역 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
          <div>
            <label htmlFor="region" className="block text-sm font-medium text-gray-700 mb-1">주요 지역 <span className="text-red-500">*</span></label>
            <select id="region" name="region" required value={formData.region} onChange={handleInputChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
              <option value="">지역 선택</option>
              {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="subRegion" className="block text-sm font-medium text-gray-700 mb-1">세부 지역</label>
            <input id="subRegion" name="subRegion" type="text" value={formData.subRegion} onChange={handleInputChange} placeholder="예: 강남구" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />
          </div>
        </div>

        {/* 모집 유형 */}
        <div>
          <label htmlFor="recruitmentFlow" className="block text-sm font-medium text-gray-700 mb-1">모집 유형 <span className="text-red-500">*</span></label>
          <select id="recruitmentFlow" name="recruitmentFlow" required value={recruitmentFlow} onChange={(e) => setRecruitmentFlow(e.target.value as RecruitmentFlow)} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
            <option value="TEAM_TO_INDIVIDUAL">팀 → 개인</option>
            <option value="INDIVIDUAL_TO_TEAM">개인 → 팀</option>
          </select>
        </div>

        {/* 날짜 / 시간 필드 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-5">
           <div>
               <label htmlFor="gameDate" className="block text-sm font-medium text-gray-700 mb-1">{dateLabel}</label>
               <input id="gameDate" name="gameDate" type="date" value={formData.gameDate} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
           </div>
           <div>
               <label htmlFor="gameTime" className="block text-sm font-medium text-gray-700 mb-1">{timeLabel}</label>
               <input id="gameTime" name="gameTime" type="time" value={formData.gameTime} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
           </div>
       </div>

       {/* 필요 인원 / 연령대 / 포지션 */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-4 gap-y-5">
            {isTeamToIndividual && (
              <>
                <div>
                    <label htmlFor="requiredPersonnel" className="block text-sm font-medium text-gray-700 mb-1">필요 인원</label>
                    <input id="requiredPersonnel" name="requiredPersonnel" type="number" min="0" value={formData.requiredPersonnel} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div>
                    <label htmlFor="ageGroup" className="block text-sm font-medium text-gray-700 mb-1">연령대</label>
                    <input id="ageGroup" name="ageGroup" type="text" value={formData.ageGroup} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="예: 20대, 30-40대"/>
                </div>
              </>
            )}
           <div>
               <label htmlFor="preferredPositions" className="block text-sm font-medium text-gray-700 mb-1">{positionLabel}</label>
               <input id="preferredPositions" name="preferredPositions" type="text" value={formData.preferredPositions} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="예: 공격수, 전체"/>
           </div>
        </div>
        
        {formError && (
          <div className="p-3 bg-red-50 border border-red-300 text-red-600 text-sm rounded-md">
            {formError}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-6 border-t mt-6">
          <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300">취소</button>
          <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            {isLoading ? "등록 중..." : "등록하기"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default MercenaryPostModal;