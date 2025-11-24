import React, { useState, useEffect } from "react";
import {
  X,
  Calendar,
  MapPin,
  Users,
  Clock,
  Shield,
  Trophy,
  Info,
  Image,
} from "lucide-react";
import { useAuthStore } from "@/stores/useAuthStore";
import { PostType, RecruitPostCreationRequestDto } from "@/types/recruitPost";

interface ImprovedTeamRecruitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (postData: RecruitPostCreationRequestDto) => void;
  initialData?: PostType | null;
}

export const ImprovedTeamRecruitModal: React.FC<ImprovedTeamRecruitModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
}) => {
  const { user } = useAuthStore();
  const [activeTab, setActiveTab] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    region: "",
    subRegion: "",
    thumbnailUrl: "",
    teamName: "",
    teamLevel: "중급",
    activityDay: "",
    activityTime: "",
    fieldLocation: "",
    requiredPersonnel: "" as number | "",
    ageGroup: "",
    preferredPositions: "",
  });

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        title: initialData.title || "",
        content: initialData.content || "",
        region: initialData.region || "",
        subRegion: initialData.subRegion || "",
        thumbnailUrl: initialData.thumbnailUrl || "",
        teamName: initialData.teamName || "",
        teamLevel: initialData.skillLevel || "중급",
        activityDay: initialData.activityDays || "",
        activityTime: initialData.activityTime || "",
        fieldLocation: initialData.fieldLocation || "",
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
        fieldLocation: "",
        requiredPersonnel: "",
        ageGroup: "",
        preferredPositions: "",
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const tabs = ["기본 정보", "팀 정보", "활동 조건"];
  const isEditMode = !!initialData;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!user) {
      alert("로그인이 필요합니다.");
      setIsLoading(false);
      return;
    }

    const dto: RecruitPostCreationRequestDto = {
      teamId: 1,
      writerProfileId: user.profileId || 1,
      title: formData.title.trim(),
      content: formData.content.trim(),
      region: formData.region,
      subRegion: formData.subRegion.trim() || undefined,
      imageUrl: formData.thumbnailUrl.trim() || undefined,
      matchDate: undefined,
      category: "TEAM",
      targetType: "TEAM_TO_MERCENARY",
      status: "RECRUITING",
      requiredPersonnel: formData.requiredPersonnel ? Number(formData.requiredPersonnel) : undefined,
      preferredPositions: formData.preferredPositions.trim() || undefined,
      ageGroup: formData.ageGroup.trim() || undefined,
      skillLevel: formData.teamLevel || undefined,
      fieldLocation: formData.fieldLocation.trim() || undefined,
      activityDays: formData.activityDay.trim() || undefined,
      activityTime: formData.activityTime.trim() || undefined,
    };

    try {
      await onSubmit(dto);
      onClose();
    } catch (error) {
      console.error("팀 모집글 작성 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

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
                <h2 className="text-2xl font-bold flex items-center gap-2">
                  <Shield className="w-7 h-7" />
                  {isEditMode ? "팀원 모집글 수정" : "팀원 모집글 작성"}
                </h2>
                <p className="text-gray-300 mt-1">
                  우리 팀과 함께할 새로운 팀원을 찾아보세요
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
                  type="button"
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
                    placeholder="예: [강남FC] 미드필더 1명 모집합니다"
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
                      <option value="서울">서울</option>
                      <option value="경기">경기</option>
                      <option value="인천">인천</option>
                      <option value="부산">부산</option>
                      <option value="대구">대구</option>
                      <option value="광주">광주</option>
                      <option value="대전">대전</option>
                      <option value="울산">울산</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      세부 지역
                    </label>
                    <input
                      type="text"
                      value={formData.subRegion}
                      onChange={(e) =>
                        setFormData({ ...formData, subRegion: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      placeholder="예: 강남구"
                    />
                  </div>
                </div>

                {/* 상세 내용 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Info className="inline w-4 h-4 mr-1" />
                    상세 내용 <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={formData.content}
                    onChange={(e) =>
                      setFormData({ ...formData, content: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    rows={6}
                    placeholder="팀 소개, 활동 내용, 팀 분위기 등을 자세히 알려주세요"
                    required
                  />
                </div>
              </div>
            )}

            {/* 팀 정보 탭 */}
            {activeTab === 1 && (
              <div className="space-y-6">
                {/* 팀 이름 / 팀 레벨 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Shield className="inline w-4 h-4 mr-1" />
                      팀 이름
                    </label>
                    <input
                      type="text"
                      value={formData.teamName}
                      onChange={(e) =>
                        setFormData({ ...formData, teamName: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      placeholder="예: 강남FC"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Trophy className="inline w-4 h-4 mr-1" />
                      팀 레벨
                    </label>
                    <select
                      value={formData.teamLevel}
                      onChange={(e) =>
                        setFormData({ ...formData, teamLevel: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                    >
                      <option value="입문">입문</option>
                      <option value="초급">초급</option>
                      <option value="중급">중급</option>
                      <option value="고급">고급</option>
                      <option value="세미프로">세미프로</option>
                    </select>
                  </div>
                </div>

                {/* 활동 구장 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPin className="inline w-4 h-4 mr-1" />
                    주 활동 구장
                  </label>
                  <input
                    type="text"
                    value={formData.fieldLocation}
                    onChange={(e) =>
                      setFormData({ ...formData, fieldLocation: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="예: 강남구민운동장, 삼성역 풋살장"
                  />
                </div>

                {/* 모집 인원 / 연령대 / 포지션 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Users className="inline w-4 h-4 mr-1" />
                      모집 인원
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.requiredPersonnel}
                      onChange={(e) =>
                        setFormData({ ...formData, requiredPersonnel: e.target.value ? Number(e.target.value) : "" })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      placeholder="명"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      연령대
                    </label>
                    <input
                      type="text"
                      value={formData.ageGroup}
                      onChange={(e) =>
                        setFormData({ ...formData, ageGroup: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      placeholder="예: 20대, 30-40대"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      모집 포지션
                    </label>
                    <input
                      type="text"
                      value={formData.preferredPositions}
                      onChange={(e) =>
                        setFormData({ ...formData, preferredPositions: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      placeholder="예: 미드필더, 전체"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* 활동 조건 탭 */}
            {activeTab === 2 && (
              <div className="space-y-6">
                {/* 활동 요일 / 시간 */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="inline w-4 h-4 mr-1" />
                      주 활동 요일
                    </label>
                    <input
                      type="text"
                      value={formData.activityDay}
                      onChange={(e) =>
                        setFormData({ ...formData, activityDay: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      placeholder="예: 주말, 평일 저녁"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Clock className="inline w-4 h-4 mr-1" />
                      주 활동 시간
                    </label>
                    <input
                      type="text"
                      value={formData.activityTime}
                      onChange={(e) =>
                        setFormData({ ...formData, activityTime: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-indigo-600"
                      placeholder="예: 19:00~21:00"
                    />
                  </div>
                </div>

                {/* 대표 이미지 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <Image className="inline w-4 h-4 mr-1" />
                    대표 이미지
                  </label>
                  <input
                    type="url"
                    value={formData.thumbnailUrl}
                    onChange={(e) =>
                      setFormData({ ...formData, thumbnailUrl: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                    placeholder="이미지 URL을 입력하세요 (선택사항)"
                  />
                  {formData.thumbnailUrl && (
                    <div className="mt-4 rounded-lg overflow-hidden border border-gray-200">
                      <img
                        src={formData.thumbnailUrl}
                        alt="미리보기"
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    </div>
                  )}
                </div>
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
                  disabled={isLoading}
                  className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
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
                  disabled={isLoading}
                  className="px-8 py-3 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                >
                  {isLoading ? "등록 중..." : (isEditMode ? "수정 완료" : "작성 완료")}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
