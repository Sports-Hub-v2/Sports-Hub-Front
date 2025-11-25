import React, { useState } from "react";
import {
  X,
  Calendar,
  MapPin,
  Users,
  Clock,
  Info,
} from "lucide-react";
import {
  PostType,
  RecruitPostCreationRequestDto,
} from "../../../types/recruitPost";

interface ImprovedMercenaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: RecruitPostCreationRequestDto) => void;
  initialData?: PostType | null;
  category?: string;
}

export const ImprovedMercenaryModal: React.FC<ImprovedMercenaryModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const [activeTab, setActiveTab] = useState(0);
  const [formData, setFormData] = useState({
    targetType: (initialData?.targetType as "USER" | "TEAM") || "USER",
    title: initialData?.title || "",
    content: initialData?.content || "",
    region: initialData?.region || "",
    subRegion: initialData?.subRegion || "",
    gameDate: initialData?.gameDate || "",
    gameTime: initialData?.gameTime || "",
    requiredPersonnel: initialData?.requiredPersonnel || 10,
    preferredPositions: initialData?.preferredPositions || "",
    ageGroup: initialData?.ageGroup || "",
    skillLevel: initialData?.skillLevel || "",
  });

  if (!isOpen) return null;

  const tabs = ["기본 정보", "상세 정보"];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 백엔드 DTO에 맞게 데이터 변환
    const submitData: RecruitPostCreationRequestDto = {
      category: "MERCENARY",
      targetType: formData.targetType,
      title: formData.title,
      content: formData.content,
      region: formData.region,
      subRegion: formData.subRegion,
      gameDate: formData.gameDate,
      gameTime: formData.gameTime,
      requiredPersonnel: formData.requiredPersonnel,
      preferredPositions: formData.preferredPositions,
      ageGroup: formData.ageGroup,
      skillLevel: formData.skillLevel,
      teamId: 1, // TODO: 실제 사용자 팀 ID로 변경
      writerProfileId: 1, // TODO: 실제 사용자 프로필 ID로 변경
    };

    onSubmit(submitData);
  };

  const isEditMode = !!initialData;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
          {/* 헤더 */}
          <div className="sticky top-0 z-10 bg-slate-900 text-white p-6 border-b border-slate-700">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold">
                  {isEditMode ? "모집글 수정" : "새 모집글 작성"}
                </h2>
                <p className="text-gray-300 mt-1">
                  조기축구 팀원을 모집해보세요
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
              {tabs.map((tab, index) => (
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
          <form
            onSubmit={handleSubmit}
            className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]"
          >
            {/* 기본 정보 탭 */}
            {activeTab === 0 && (
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    모집 유형
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, targetType: "USER" })
                      }
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.targetType === "USER"
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-3xl mb-2">🏃‍♂️</div>
                      <div className="font-semibold">개인 용병 모집</div>
                      <div className="text-sm text-gray-500 mt-1">
                        우리 팀에 합류할 용병을 찾습니다
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        setFormData({ ...formData, targetType: "TEAM" })
                      }
                      className={`p-4 rounded-xl border-2 transition-all ${
                        formData.targetType === "TEAM"
                          ? "border-indigo-500 bg-indigo-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="text-3xl mb-2">🤝</div>
                      <div className="font-semibold">용병 지원</div>
                      <div className="text-sm text-gray-500 mt-1">
                        팀을 찾는 개인 용병입니다
                      </div>
                    </button>
                  </div>
                </div>

                {/* 제목 입력 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    제목 <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600 transition-all"
                    placeholder={
                      formData.targetType === "USER"
                        ? "예: [강남구] 조기축구 용병 모집 - 미드필더"
                        : "예: [개인] 조기축구 용병 지원 - 미드필더"
                    }
                    required
                  />
                </div>

                {/* 지역 선택 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MapPin className="inline w-4 h-4 mr-1" />
                      지역 <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={formData.region}
                      onChange={(e) =>
                        setFormData({ ...formData, region: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      required
                    >
                      <option value="">지역 선택</option>
                      <option value="서울특별시">서울특별시</option>
                      <option value="경기도">경기도</option>
                      <option value="인천광역시">인천광역시</option>
                      <option value="부산광역시">부산광역시</option>
                      <option value="대구광역시">대구광역시</option>
                      <option value="광주광역시">광주광역시</option>
                      <option value="대전광역시">대전광역시</option>
                      <option value="울산광역시">울산광역시</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      상세 지역
                    </label>
                    <input
                      type="text"
                      value={formData.subRegion}
                      onChange={(e) =>
                        setFormData({ ...formData, subRegion: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      placeholder="예: 강남구, 분당구"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 상세 정보 탭 */}
            {activeTab === 1 && (
              <div className="space-y-6">
                {/* 경기 일정 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      {formData.targetType === "USER"
                        ? "경기 날짜"
                        : "활동 가능 날짜"}{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      value={formData.gameDate}
                      onChange={(e) =>
                        setFormData({ ...formData, gameDate: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline w-4 h-4 mr-1" />
                      {formData.targetType === "USER"
                        ? "경기 시간"
                        : "활동 가능 시간"}
                    </label>
                    <input
                      type="time"
                      value={formData.gameTime}
                      onChange={(e) =>
                        setFormData({ ...formData, gameTime: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    />
                  </div>
                </div>

                {/* 인원 및 포지션 설정 */}
                {formData.targetType === "USER" ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="inline w-4 h-4 mr-1" />
                      모집 인원 <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="number"
                      value={formData.requiredPersonnel}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          requiredPersonnel: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      min="1"
                      max="30"
                      required
                    />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        주 포지션
                      </label>
                      <select
                        value={formData.preferredPositions}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            preferredPositions: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      >
                        <option value="">포지션 선택</option>
                        <option value="골키퍼">골키퍼 (GK)</option>
                        <option value="수비수">수비수 (DF)</option>
                        <option value="미드필더">미드필더 (MF)</option>
                        <option value="공격수">공격수 (FW)</option>
                        <option value="어디든">어디든 가능</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        실력 수준
                      </label>
                      <select
                        value={formData.skillLevel}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            skillLevel: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      >
                        <option value="">실력 선택</option>
                        <option value="초급">초급 (취미 수준)</option>
                        <option value="중급">중급 (동호회 수준)</option>
                        <option value="상급">상급 (클럽 수준)</option>
                        <option value="세미프로">세미프로</option>
                      </select>
                    </div>
                  </div>
                )}

                {/* 상세 내용 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Info className="inline w-4 h-4 mr-1" />
                    상세 내용
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    rows={6}
                    placeholder={
                      formData.targetType === "USER"
                        ? "경기 장소, 준비물, 팀 분위기 등을 자세히 알려주세요"
                        : "축구 경력, 선호하는 팀 스타일, 가능한 시간대 등을 알려주세요"
                    }
                  />
                </div>
              </div>
            )}

          </form>

          {/* 하단 버튼 */}
          <div className="sticky bottom-0 bg-gray-50 border-t border-gray-200 p-4 flex justify-between">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
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
              {activeTab < tabs.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setActiveTab(activeTab + 1)}
                  className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  다음
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  className="px-8 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {isEditMode ? "수정 완료" : "작성 완료"}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
