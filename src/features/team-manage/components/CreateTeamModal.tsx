// src/features/team-manage/components/CreateTeamModal.tsx

import React, { useState } from 'react';
import Modal from '@/components/common/Modal'; // 공용 모달 셸
import { REGIONS } from '@/constants/regions';
import type { TeamCreateRequestDto } from '@/features/team/api/teamApi';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newTeam: any) => void; // 성공 시 부모에게 알림
}

const CreateTeamModal: React.FC<Props> = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<TeamCreateRequestDto>({
    name: '',
    region: '',
    subRegion: '',
    description: '',
    logoUrl: '',
    homeGround: '',
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.region) {
      alert('팀 이름과 주요 지역은 필수입니다.');
      return;
    }
    setIsLoading(true);
    try {
      // API 호출은 부모 컴포넌트에서 하도록 성공 콜백으로 데이터 전달
      // 직접 호출하려면 여기서 import 해서 사용
      onSuccess(formData);
    } catch (error) {
      // 에러 처리는 부모 컴포넌트에서
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="새 팀 생성">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name">팀 이름 <span className="text-red-500">*</span></label>
          <input type="text" name="name" id="name" value={formData.name} onChange={handleInputChange} required className="w-full border rounded p-2 mt-1" />
        </div>
        <div>
          <label htmlFor="region">주요 지역 <span className="text-red-500">*</span></label>
          <select name="region" id="region" value={formData.region} onChange={handleInputChange} required className="w-full border rounded p-2 mt-1">
            <option value="">지역 선택</option>
            {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
          </select>
        </div>
        <div>
          <label htmlFor="description">팀 소개</label>
          <textarea name="description" id="description" value={formData.description} onChange={handleInputChange} rows={3} className="w-full border rounded p-2 mt-1" />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <button type="button" onClick={onClose} disabled={isLoading} className="px-4 py-2 bg-gray-200 rounded">취소</button>
          <button type="submit" disabled={isLoading} className="px-4 py-2 bg-blue-600 text-white rounded">
            {isLoading ? '생성 중...' : '생성하기'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateTeamModal;