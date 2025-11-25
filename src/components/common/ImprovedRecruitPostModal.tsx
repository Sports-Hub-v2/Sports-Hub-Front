// src/components/common/ImprovedRecruitPostModal.tsx

import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, Clock, Users, Info } from 'lucide-react';
import { useAuthStore } from "@/stores/useAuthStore";
import {
  RecruitCategory,
  RecruitTargetType,
  PostType,
  RecruitPostCreationRequestDto
} from "@/types/recruitPost";
import { REGIONS } from '@/constants/regions';

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

const ImprovedRecruitPostModal: React.FC<Props> = ({ isOpen, onClose, onSubmit, category, initialData }) => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);

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

  const categoryConfig = {
    [RecruitCategory.MERCENARY]: {
      title: "용병 모집글 작성",
      emoji: "🔥",
      tabs: ["기본 정보", "모집 조건", "상세 내용"]
    },
    [RecruitCategory.TEAM]: {
      title: "팀원 모집글 작성",
      emoji: "🛡️",
      tabs: ["기본 정보", "모집 조건", "상세 내용"]
    },
    [RecruitCategory.MATCH]: {
      title: "경기 모집글 작성",
      emoji: "🏟️",
      tabs: ["기본 정보", "모집 조건", "상세 내용"]
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
      setActiveTab(0);
    }
  }, [initialData, isOpen, category]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSimplePersonnelChange = (delta: number) => {
    const currentTotal = formData.positionCounts.ALL;
    const newTotal = Math.max(0, Math.min(99, currentTotal + delta));
    setFormData(prev => ({
      ...prev,
      positionCounts: { FW: 0, MF: 0, DF: 0, GK: 0, ALL: newTotal }
    }));
  };

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

  const renderPersonnelBlocks = () => {
    const total = getTotalRequiredPersonnel();
    const blocks = [];
    for (let i = 0; i < Math.min(total, 10); i++) {
      blocks.push(<div key={i} className="w-3 h-3 bg-indigo-600 rounded-sm" />);
    }
    if (total > 10) {
      blocks.push(<span key="more" className="text-xs text-indigo-600 font-semibold">+{total - 10}</span>);
    }
    return blocks;
  };

  const positionLabels = {
    FW: { label: '공격수', emoji: '⚽', color: 'text-red-600' },
    MF: { label: '미드필더', emoji: '⚽', color: 'text-blue-600' },
    DF: { label: '수비수', emoji: '🛡️', color: 'text-green-600' },
    GK: { label: '골키퍼', emoji: '🧤', color: 'text-purple-600' }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
          {/* 헤더 */}
          <div className="sticky top-0 z-10 bg-slate-900 text-white p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {config.emoji} {config.title}
                </h2>
                <p className="text-gray-300 mt-1">
                  {initialData ? "모집글을 수정합니다" : "새로운 모집글을 작성합니다"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 탭 네비게이션 */}
            <div className="flex gap-4 mt-6">
              {config.tabs.map((tab, index) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(index)}
                  className={`pb-2 px-1 border-b-2 transition-all ${
                    activeTab === index
                      ? "border-indigo-500 text-white font-semibold"
                      : "border-transparent text-gray-400 hover:text-white"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* 폼 콘텐츠 */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
            {/* 탭 1: 기본 정보 */}
            {activeTab === 0 && (
              <div className="space-y-6">
                {/* 용병 전용: 모집 유형 */}
                {category === RecruitCategory.MERCENARY && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      모집 유형 <span className="text-red-500">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-4">
                      <button
                        type="button"
                        onClick={() => setRecruitmentFlow('TEAM_TO_INDIVIDUAL')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          recruitmentFlow === 'TEAM_TO_INDIVIDUAL'
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-3xl mb-2">🛡️</div>
                        <div className="font-semibold">팀 → 용병</div>
                        <div className="text-sm text-gray-500 mt-1">팀에서 용병 모집</div>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRecruitmentFlow('INDIVIDUAL_TO_TEAM')}
                        className={`p-4 rounded-xl border-2 transition-all ${
                          recruitmentFlow === 'INDIVIDUAL_TO_TEAM'
                            ? 'border-indigo-500 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="text-3xl mb-2">⚔️</div>
                        <div className="font-semibold">개인 → 팀</div>
                        <div className="text-sm text-gray-500 mt-1">개인이 팀 찾기</div>
                      </button>
                    </div>
                  </div>
                )}

                {/* 소속팀 입력 */}
                {category === RecruitCategory.MERCENARY && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                      className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 ${
                        recruitmentFlow === 'INDIVIDUAL_TO_TEAM' ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white'
                      }`}
                    />
                  </div>
                )}

                {/* 제목 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="title"
                    type="text"
                    required
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="모집글 제목을 입력하세요"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  />
                </div>

                {/* 지역 / 세부지역 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      지역 <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="region"
                      required
                      value={formData.region}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    >
                      <option value="">지역 선택</option>
                      {REGIONS.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      세부 지역
                    </label>
                    <input
                      name="subRegion"
                      type="text"
                      value={formData.subRegion}
                      onChange={handleInputChange}
                      placeholder="예: 강남구"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                  </div>
                </div>

                {/* 일정 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      날짜 <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="gameDate"
                      type="date"
                      required
                      value={formData.gameDate}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline w-4 h-4 mr-1" />
                      시간 <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="gameTime"
                      type="time"
                      required
                      value={formData.gameTime}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 탭 2: 모집 조건 */}
            {activeTab === 1 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    <Users className="inline w-5 h-5 mr-2" />
                    모집 인원 설정
                  </h3>
                </div>

                {/* 모드 선택 */}
                <div className="flex gap-3 mb-6">
                  <button
                    type="button"
                    onClick={() => setPositionMode('SIMPLE')}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                      positionMode === 'SIMPLE'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    간편 입력
                  </button>
                  <button
                    type="button"
                    onClick={() => setPositionMode('DETAILED')}
                    className={`flex-1 py-3 px-4 rounded-lg text-sm font-medium transition-all ${
                      positionMode === 'DETAILED'
                        ? 'bg-indigo-600 text-white shadow-md'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    세부 설정
                  </button>
                </div>

                {/* 간편 모드 */}
                {positionMode === 'SIMPLE' && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <label className="block text-sm font-medium text-gray-700 mb-4">
                      총 모집 인원
                    </label>
                    <div className="flex items-center gap-4">
                      <button
                        type="button"
                        onClick={() => handleSimplePersonnelChange(-1)}
                        className="w-12 h-12 bg-white border-2 border-gray-300 hover:border-indigo-500 rounded-lg text-xl font-bold transition-colors"
                      >
                        -
                      </button>
                      <div className="flex-1 flex items-center justify-center gap-3 py-3">
                        <div className="flex items-center gap-1 flex-wrap">
                          {renderPersonnelBlocks()}
                        </div>
                        <span className="text-3xl font-bold text-indigo-600">{getTotalRequiredPersonnel()}명</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSimplePersonnelChange(1)}
                        className="w-12 h-12 bg-white border-2 border-gray-300 hover:border-indigo-500 rounded-lg text-xl font-bold transition-colors"
                      >
                        +
                      </button>
                    </div>
                    <p className="text-sm text-gray-500 text-center mt-4">포지션 무관으로 모집합니다</p>
                  </div>
                )}

                {/* 세부 모드 */}
                {positionMode === 'DETAILED' && (
                  <div className="space-y-3">
                    {(['FW', 'MF', 'DF', 'GK'] as const).map((position) => {
                      const config = positionLabels[position];
                      const count = formData.positionCounts[position];
                      return (
                        <div key={position} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <span className={`text-2xl ${config.color}`}>{config.emoji}</span>
                          <label className="flex-1 text-sm font-medium text-gray-700">
                            {config.label} ({position})
                          </label>
                          <button
                            type="button"
                            onClick={() => handlePositionCountChange(position, -1)}
                            className="w-10 h-10 bg-white border-2 border-gray-300 hover:border-indigo-500 rounded-lg text-lg font-bold transition-colors"
                          >
                            -
                          </button>
                          <span className="w-10 text-center text-lg font-semibold text-gray-900">{count}</span>
                          <button
                            type="button"
                            onClick={() => handlePositionCountChange(position, 1)}
                            className="w-10 h-10 bg-white border-2 border-gray-300 hover:border-indigo-500 rounded-lg text-lg font-bold transition-colors"
                          >
                            +
                          </button>
                        </div>
                      );
                    })}

                    {/* 총합 표시 */}
                    <div className="mt-4 pt-4 border-t-2 border-gray-200">
                      <div className="flex items-center justify-between p-4 bg-indigo-50 rounded-lg">
                        <span className="text-sm font-semibold text-gray-700">📊 총 모집 인원</span>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            {renderPersonnelBlocks()}
                          </div>
                          <span className="text-2xl font-bold text-indigo-600">{getTotalRequiredPersonnel()}명</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* 탭 3: 상세 내용 */}
            {activeTab === 2 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Info className="inline w-4 h-4 mr-1" />
                    상세 내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    name="content"
                    required
                    value={formData.content}
                    onChange={handleInputChange}
                    placeholder="모집 내용을 자세히 작성해주세요&#10;&#10;• 팀 분위기와 실력 수준&#10;• 경기 장소 및 주차 정보&#10;• 준비물 및 참가비&#10;• 기타 요구사항"
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    💡 구체적으로 작성할수록 신청률이 높아집니다
                  </p>
                </div>
              </div>
            )}

            {/* 에러 메시지 */}
            {formError && (
              <div className="mt-4 p-4 bg-red-50 border border-red-300 text-red-600 text-sm rounded-lg">
                {formError}
              </div>
            )}
          </form>

          {/* 하단 버튼 */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-between">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              취소
            </button>
            <div className="flex gap-3">
              {activeTab > 0 && (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab - 1)}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  이전
                </button>
              )}
              {activeTab < config.tabs.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab + 1)}
                  className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  다음
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="px-8 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "처리 중..." : (initialData ? "수정 완료" : "작성 완료")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImprovedRecruitPostModal;
