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

interface PositionCount {
  FW: number;
  MF: number;
  DF: number;
  GK: number;
  ALL: number;
}

interface FormData {
  title: string;
  content: string;
  region: string;
  subRegion: string;
  gameDate: string;
  gameTime: string;
  requiredPersonnel: number | '';
  preferredPositions: string;
  teamName: string;
  positionCounts: PositionCount;
  selectedPositions: Set<keyof PositionCount>;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: RecruitPostCreationRequestDto) => Promise<void>;
  category: RecruitCategory;
  initialData?: PostType | null;
}

type RecruitmentFlow = 'TEAM_TO_INDIVIDUAL' | 'INDIVIDUAL_TO_TEAM';
type PositionMode = 'SIMPLE' | 'DETAILED';

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
    teamName: "",
    positionCounts: { FW: 0, MF: 0, DF: 0, GK: 0, ALL: 0 },
    selectedPositions: new Set(),
  });

  const [recruitmentFlow, setRecruitmentFlow] = useState<RecruitmentFlow>('TEAM_TO_INDIVIDUAL');
  const [positionMode, setPositionMode] = useState<PositionMode>('SIMPLE');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [fieldWarnings, setFieldWarnings] = useState<Record<string, string>>({});
  const [showGuide, setShowGuide] = useState<string | null>(null);

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
        teamName: initialData.teamName || "",
        positionCounts: { FW: 0, MF: 0, DF: 0, GK: 0, ALL: 0 },
        selectedPositions: new Set(),
      });
      if (category === RecruitCategory.MERCENARY) {
        setRecruitmentFlow(initialData.fromParticipant === 'INDIVIDUAL' ? 'INDIVIDUAL_TO_TEAM' : 'TEAM_TO_INDIVIDUAL');
      }
    } else if (isOpen) {
      setFormData({
        title: "", content: "", region: "", subRegion: "",
        gameDate: "", gameTime: "", requiredPersonnel: '',
        preferredPositions: "", teamName: "",
        positionCounts: { FW: 0, MF: 0, DF: 0, GK: 0, ALL: 0 },
        selectedPositions: new Set(),
      });
      setRecruitmentFlow('TEAM_TO_INDIVIDUAL');
      setPositionMode('SIMPLE');
      setFormError(null);
      setFieldWarnings({});
    }
  }, [initialData, isOpen, category]);

  // 실시간 검증
  useEffect(() => {
    const warnings: Record<string, string> = {};

    // 제목 길이 검증
    if (formData.title.length > 0 && formData.title.length < 10) {
      warnings.title = "💡 제목은 10자 이상 권장합니다";
    }

    // 날짜 검증
    if (formData.gameDate && formData.gameTime) {
      const selectedDateTime = new Date(`${formData.gameDate}T${formData.gameTime}`);
      const now = new Date();
      if (selectedDateTime < now) {
        warnings.gameDate = "⚠️ 과거 날짜는 선택할 수 없습니다";
      }
    }

    // 포지션 검증
    const totalPersonnel = getTotalRequiredPersonnel();
    if (totalPersonnel === 0 && (formData.gameDate || formData.title)) {
      warnings.positions = "⚠️ 최소 1명 이상 선택해주세요";
    }

    setFieldWarnings(warnings);
  }, [formData.title, formData.gameDate, formData.gameTime, formData.positionCounts]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 간편 모드: 총 인원 증감
  const handleSimplePersonnelChange = (delta: number) => {
    const currentTotal = formData.positionCounts.ALL;
    const newTotal = Math.max(0, Math.min(99, currentTotal + delta));
    setFormData(prev => ({
      ...prev,
      positionCounts: { FW: 0, MF: 0, DF: 0, GK: 0, ALL: newTotal }
    }));
  };

  // 세부 모드: 포지션별 증감
  const handlePositionCountChange = (position: keyof PositionCount, delta: number) => {
    setFormData(prev => {
      const currentCount = prev.positionCounts[position];
      const newCount = Math.max(0, Math.min(20, currentCount + delta));
      return {
        ...prev,
        positionCounts: { ...prev.positionCounts, [position]: newCount, ALL: 0 }
      };
    });
  };

  // 총 모집 인원 계산
  const getTotalRequiredPersonnel = () => {
    const { FW, MF, DF, GK, ALL } = formData.positionCounts;
    return FW + MF + DF + GK + ALL;
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

    if (!formData.gameDate || !formData.gameTime) {
      setFormError("경기 날짜와 시간은 필수 입력 항목입니다.");
      return;
    }

    const now = new Date();
    const selectedDateTime = new Date(`${formData.gameDate}T${formData.gameTime}`);

    if (selectedDateTime < now) {
      setFormError("과거 날짜와 시간은 선택할 수 없습니다. 현재 시간 이후로 선택해주세요.");
      return;
    }

    const totalPersonnel = getTotalRequiredPersonnel();
    if (totalPersonnel === 0) {
      setFormError("최소 1개 이상의 포지션과 인원을 선택해주세요.");
      return;
    }

    setIsLoading(true);

    const isTeamToIndividual = recruitmentFlow === 'TEAM_TO_INDIVIDUAL';

    // 포지션 정보를 문자열로 변환
    const buildPositionString = () => {
      const positions: string[] = [];
      (['FW', 'MF', 'DF', 'GK', 'ALL'] as const).forEach(pos => {
        if (formData.positionCounts[pos] > 0) {
          positions.push(`${pos}:${formData.positionCounts[pos]}`);
        }
      });
      return positions.join(', ');
    };

    const dto: RecruitPostCreationRequestDto = {
      teamId: user.teamId || 1,
      writerProfileId: user.profileId || 1,
      title: formData.title.trim(),
      content: formData.content.trim(),
      category: category,
      region: formData.region,
      subRegion: formData.subRegion.trim() || undefined,
      matchDate: formData.gameDate,
      gameTime: formData.gameTime,
      requiredPersonnel: getTotalRequiredPersonnel() || undefined,
      preferredPositions: buildPositionString() || undefined,
      targetType: category === RecruitCategory.MERCENARY
        ? (isTeamToIndividual ? RecruitTargetType.USER : RecruitTargetType.TEAM)
        : RecruitTargetType.USER,
      status: "RECRUITING",
    };

    try {
      await onSubmit(dto);
    } catch (error) {
      console.error("게시글 저장 실패:", error);
      setFormError(error instanceof Error ? error.message : "게시글 저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  // 가이드 토글
  const toggleGuide = (section: string) => {
    setShowGuide(showGuide === section ? null : section);
  };

  // 인원 시각화 블록
  const renderPersonnelBlocks = () => {
    const total = getTotalRequiredPersonnel();
    const blocks = [];
    for (let i = 0; i < Math.min(total, 10); i++) {
      blocks.push(<div key={i} className="w-3 h-3 bg-blue-600 rounded-sm" />);
    }
    if (total > 10) {
      blocks.push(<span key="more" className="text-xs text-blue-600 font-semibold">+{total - 10}</span>);
    }
    return blocks;
  };

  // 포지션 라벨
  const positionLabels = {
    FW: { label: '공격수', emoji: '⚽', color: 'text-red-600' },
    MF: { label: '미드필더', emoji: '⚽', color: 'text-blue-600' },
    DF: { label: '수비수', emoji: '🛡️', color: 'text-green-600' },
    GK: { label: '골키퍼', emoji: '🧤', color: 'text-purple-600' }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`${config.emoji} ${config.title}`}>
      <form onSubmit={handleSubmit} className="space-y-4">

        {/* 섹션 1: 기본 정보 */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold text-gray-900 flex items-center gap-2">
              <span>📋</span> 기본 정보
            </h3>
            <button
              type="button"
              onClick={() => toggleGuide('basic')}
              className="text-blue-600 hover:text-blue-700 text-xs"
            >
              💡 작성 팁
            </button>
          </div>

          {showGuide === 'basic' && (
            <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-md text-xs text-gray-700 animate-fadeIn">
              <p className="font-semibold mb-1">✨ 좋은 제목 예시:</p>
              <p className="mb-2">• [강남구] 오전 7시 조기축구 용병 급구 (DF 2명)</p>
              <p className="mb-2">• [서초] 주말 풋살 멤버 모집 - 초보 환영!</p>
              <p className="text-gray-500">지역, 시간, 포지션을 명확히 적으면 신청률이 높아집니다.</p>
            </div>
          )}

          <div className="space-y-3">
            {/* 용병 전용: 모집 유형 */}
            {category === RecruitCategory.MERCENARY && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  모집 유형 <span className="text-red-500">*</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRecruitmentFlow('TEAM_TO_INDIVIDUAL')}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      recruitmentFlow === 'TEAM_TO_INDIVIDUAL'
                        ? 'border-blue-600 bg-blue-50 text-blue-700 font-semibold shadow-sm'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">🛡️</span>
                      <span className="text-sm">팀 → 용병</span>
                      <span className="text-xs text-gray-500">팀에서 용병 모집</span>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRecruitmentFlow('INDIVIDUAL_TO_TEAM')}
                    className={`px-4 py-3 rounded-lg border-2 transition-all ${
                      recruitmentFlow === 'INDIVIDUAL_TO_TEAM'
                        ? 'border-green-600 bg-green-50 text-green-700 font-semibold shadow-sm'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-lg">⚔️</span>
                      <span className="text-sm">개인 → 팀</span>
                      <span className="text-xs text-gray-500">개인이 팀 찾기</span>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* 소속팀 입력 - 항상 표시, 조건부 비활성화 */}
            {category === RecruitCategory.MERCENARY && (
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  소속 팀 {recruitmentFlow === 'TEAM_TO_INDIVIDUAL' && <span className="text-red-500">*</span>}
                </label>
                <input
                  name="teamName"
                  type="text"
                  required={recruitmentFlow === 'TEAM_TO_INDIVIDUAL'}
                  disabled={recruitmentFlow === 'INDIVIDUAL_TO_TEAM'}
                  value={formData.teamName}
                  onChange={handleInputChange}
                  placeholder={recruitmentFlow === 'TEAM_TO_INDIVIDUAL' ? "예: FC 서울, 강남 유나이티드" : "개인 지원 시 불필요"}
                  className={`w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600 ${
                    recruitmentFlow === 'INDIVIDUAL_TO_TEAM' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'
                  }`}
                />
              </div>
            )}

            {/* 제목 */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                제목 <span className="text-red-500">*</span>
              </label>
              <input
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleInputChange}
                placeholder="모집글 제목을 입력하세요"
                className={`w-full px-3 py-2 bg-white border rounded-md text-sm focus:outline-none focus:ring-2 transition-all ${
                  fieldWarnings.title ? 'border-yellow-400 focus:ring-yellow-500' : 'border-gray-300 focus:ring-blue-600'
                }`}
              />
              {fieldWarnings.title && (
                <p className="mt-1 text-xs text-yellow-600">{fieldWarnings.title}</p>
              )}
            </div>

            {/* 지역 / 세부지역 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  지역 <span className="text-red-500">*</span>
                </label>
                <select
                  name="region"
                  required
                  value={formData.region}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                  <option value="">지역 선택</option>
                  {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  세부 지역
                </label>
                <input
                  name="subRegion"
                  type="text"
                  value={formData.subRegion}
                  onChange={handleInputChange}
                  placeholder="예: 강남구"
                  className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 섹션 2: 일정 */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>📅</span> 일정
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                날짜 <span className="text-red-500">*</span>
              </label>
              <input
                name="gameDate"
                type="date"
                required
                value={formData.gameDate}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 bg-white border rounded-md text-sm focus:outline-none focus:ring-2 transition-all ${
                  fieldWarnings.gameDate ? 'border-red-400 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-600'
                }`}
              />
              {fieldWarnings.gameDate && (
                <p className="mt-1 text-xs text-red-600">{fieldWarnings.gameDate}</p>
              )}
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                시간 <span className="text-red-500">*</span>
              </label>
              <input
                name="gameTime"
                type="time"
                required
                value={formData.gameTime}
                onChange={handleInputChange}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              />
            </div>
          </div>
        </div>

        {/* 섹션 3: 모집 조건 (강조) */}
        <div className="bg-blue-900 text-white rounded-lg p-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-semibold flex items-center gap-2">
              <span>👥</span> 모집 조건
            </h3>
            <button
              type="button"
              onClick={() => toggleGuide('positions')}
              className="text-blue-200 hover:text-white text-xs"
            >
              💡 도움말
            </button>
          </div>

          {showGuide === 'positions' && (
            <div className="mb-3 p-3 bg-blue-800 rounded-md text-xs animate-fadeIn">
              <p className="mb-2">• <strong>간편 입력:</strong> 포지션 무관으로 빠르게 입력</p>
              <p>• <strong>세부 설정:</strong> 포지션별로 정확한 인원 지정</p>
            </div>
          )}

          {/* 모드 선택 */}
          <div className="mb-4">
            <div className="flex gap-2 mb-3">
              <button
                type="button"
                onClick={() => setPositionMode('SIMPLE')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  positionMode === 'SIMPLE'
                    ? 'bg-white text-blue-900 shadow-md'
                    : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
                }`}
              >
                간편 입력
              </button>
              <button
                type="button"
                onClick={() => setPositionMode('DETAILED')}
                className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-all ${
                  positionMode === 'DETAILED'
                    ? 'bg-white text-blue-900 shadow-md'
                    : 'bg-blue-800 text-blue-200 hover:bg-blue-700'
                }`}
              >
                세부 설정
              </button>
            </div>

            {/* 간편 모드 */}
            {positionMode === 'SIMPLE' && (
              <div className="bg-white rounded-lg p-4 text-gray-900">
                <label className="block text-xs font-medium text-gray-700 mb-2">
                  총 모집 인원
                </label>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleSimplePersonnelChange(-1)}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-md text-lg font-bold transition-colors"
                  >
                    -
                  </button>
                  <div className="flex-1 flex items-center justify-center gap-2 py-2">
                    <div className="flex items-center gap-1 flex-wrap">
                      {renderPersonnelBlocks()}
                    </div>
                    <span className="text-2xl font-bold text-blue-600">{getTotalRequiredPersonnel()}명</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSimplePersonnelChange(1)}
                    className="w-10 h-10 bg-gray-200 hover:bg-gray-300 rounded-md text-lg font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
                <p className="text-xs text-gray-500 text-center mt-2">포지션 무관으로 모집합니다</p>
              </div>
            )}

            {/* 세부 모드 */}
            {positionMode === 'DETAILED' && (
              <div className="bg-white rounded-lg p-4 text-gray-900 space-y-2">
                {(['FW', 'MF', 'DF', 'GK'] as const).map((position) => {
                  const config = positionLabels[position];
                  const count = formData.positionCounts[position];
                  return (
                    <div key={position} className="flex items-center gap-3 p-2 bg-gray-50 rounded-md">
                      <span className={`text-lg ${config.color}`}>{config.emoji}</span>
                      <label className="flex-1 text-sm font-medium text-gray-700">
                        {config.label} ({position})
                      </label>
                      <button
                        type="button"
                        onClick={() => handlePositionCountChange(position, -1)}
                        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold transition-colors"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-semibold text-gray-900">{count}</span>
                      <button
                        type="button"
                        onClick={() => handlePositionCountChange(position, 1)}
                        className="w-8 h-8 bg-gray-200 hover:bg-gray-300 rounded text-sm font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                  );
                })}

                {/* 총합 표시 */}
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">📊 총 모집 인원</span>
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        {renderPersonnelBlocks()}
                      </div>
                      <span className="text-lg font-bold text-blue-600">{getTotalRequiredPersonnel()}명</span>
                    </div>
                  </div>
                  {getTotalRequiredPersonnel() > 0 && (
                    <p className="text-xs text-gray-500 mt-1">
                      {Object.entries(formData.positionCounts)
                        .filter(([key, val]) => key !== 'ALL' && val > 0)
                        .map(([key, val]) => `${positionLabels[key as keyof typeof positionLabels]?.label || key} ${val}명`)
                        .join(', ')}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {fieldWarnings.positions && (
            <p className="text-xs text-yellow-300 mt-2">{fieldWarnings.positions}</p>
          )}
        </div>

        {/* 섹션 4: 상세 내용 */}
        <div className="bg-white rounded-lg border-2 border-gray-200 p-4">
          <h3 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <span>📝</span> 상세 내용
          </h3>
          <textarea
            name="content"
            required
            value={formData.content}
            onChange={handleInputChange}
            placeholder="모집 내용을 자세히 작성해주세요 (연령대, 실력 수준, 기타 요구사항 등)"
            rows={4}
            className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>

        {/* 에러 메시지 */}
        {formError && (
          <div className="p-3 bg-red-50 border border-red-300 text-red-600 text-sm rounded-md animate-shake">
            {formError}
          </div>
        )}

        {/* 버튼 */}
        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-6 py-2.5 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors font-medium disabled:opacity-50"
          >
            취소
          </button>
          <button
            type="submit"
            disabled={isLoading || Object.keys(fieldWarnings).some(key => key === 'gameDate')}
            className="px-6 py-2.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
          >
            {isLoading ? "등록 중..." : (initialData ? "수정하기" : "등록하기")}
          </button>
        </div>
      </form>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.3s ease-out;
        }
      `}</style>
    </Modal>
  );
};

export default RecruitPostModal;
