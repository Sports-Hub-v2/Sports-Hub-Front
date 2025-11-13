// src/features/mercenary/components/MercenaryCardModal.tsx

import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { RecruitPostCreationRequestDto, PostType } from "@/types/recruitPost";
import { REGION_DETAIL_MAP } from "@/constants/regions";
import AutocompleteInput from "@/components/common/AutocompleteInput";
import RegionSelectModal from "@/components/common/RegionSelectModal";

interface Props {
  category: "mercenary" | "team" | "match";
  onClose: () => void;
  onSubmit: (postData: RecruitPostCreationRequestDto) => void;
  initialData?: PostType | null; // 수정 모드를 위한 초기 데이터
}

const MercenaryCardModal = ({
  category,
  onClose,
  onSubmit,
  initialData,
}: Props) => {
  const user = useAuthStore((s) => s.user);
  const isEditMode = !!initialData;

  // 입력 필드 상태 (수정 모드 시 초기값 설정)
  const [title, setTitle] = useState(initialData?.title || "");
  const [content, setContent] = useState(initialData?.content || "");
  const [region, setRegion] = useState(initialData?.region || "");
  const [subRegion, setSubRegion] = useState(initialData?.subRegion || "");
  const [gameDate, setGameDate] = useState(
    initialData?.gameDate ? initialData.gameDate.split("T")[0] : ""
  );
  const [gameTime, setGameTime] = useState(initialData?.gameTime || "");
  const [requiredPersonnel, setRequiredPersonnel] = useState(
    initialData?.requiredPersonnel ? String(initialData.requiredPersonnel) : ""
  );
  const [targetType, setTargetType] = useState<"USER" | "TEAM">(() => {
    if (initialData?.targetType) {
      return initialData.targetType as "USER" | "TEAM";
    }
    // 팀과 경기 모집은 항상 USER 타입 (새로운 멤버나 상대팀을 찾음)
    return category === "mercenary" ? "USER" : "USER";
  });
  const [cost, setCost] = useState(
    initialData?.cost ? String(initialData.cost) : ""
  );
  const [fieldLocation, setFieldLocation] = useState(
    initialData?.fieldLocation || ""
  );
  const [preferredPositions, setPreferredPositions] = useState(
    initialData?.preferredPositions || ""
  );

  // 추가 옵션들
  const [parkingAvailable, setParkingAvailable] = useState(
    initialData?.parkingAvailable || false
  );
  const [showerFacilities, setShowerFacilities] = useState(
    initialData?.showerFacilities || false
  );

  // UI 상태
  const [isDetailExpanded, setIsDetailExpanded] = useState(false);
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

  // 선택된 지역에 따른 상세 지역 목록
  const getSubRegionSuggestions = (selectedRegion: string): string[] => {
    return REGION_DETAIL_MAP[selectedRegion] || [];
  };

  // 시간대별 특성 표시
  const getTimeCharacteristics = (timeStr: string) => {
    if (!timeStr) return null;
    try {
      const [hour] = timeStr.split(":");
      if (!hour) return null;
      const hourNum = parseInt(hour);

      if (hourNum >= 5 && hourNum <= 6) {
        return { label: "새벽", icon: "🌙", desc: "조용한 분위기" };
      } else if (hourNum >= 6 && hourNum <= 8) {
        return { label: "아침", icon: "🌅", desc: "상쾌한 시작" };
      } else if (hourNum >= 8 && hourNum <= 10) {
        return { label: "오전", icon: "☀️", desc: "활기찬 경기" };
      } else if (hourNum >= 10 && hourNum <= 12) {
        return { label: "늦은오전", icon: "🕐", desc: "여유로운 시간" };
      } else if (hourNum >= 14 && hourNum <= 17) {
        return { label: "오후", icon: "🌤️", desc: "따뜻한 햇살" };
      } else if (hourNum >= 18 && hourNum <= 20) {
        return { label: "저녁", icon: "🌆", desc: "퇴근 후 운동" };
      } else if (hourNum >= 20 || hourNum <= 4) {
        return { label: "야간", icon: "🌃", desc: "나이트 게임" };
      }
      return { label: "일반", icon: "🕐", desc: "자유 시간" };
    } catch {
      return null;
    }
  };

  // ✅ 등록 버튼 클릭 핸들러
  const handleSubmit = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!title || !content || !region) {
      alert("필수 필드(제목, 내용, 지역)를 모두 입력해주세요.");
      return;
    }

    if (gameDate && gameTime) {
      const gameDateTime = new Date(`${gameDate}T${gameTime}`);
      const now = new Date();
      if (gameDateTime <= now) {
        alert("경기 시간은 현재 시간보다 이후로 설정해주세요.");
        return;
      }
    }

    // 백엔드 PostCreateRequest 구조에 맞춘 데이터 구성
    const postData: RecruitPostCreationRequestDto = {
      teamId: 1, // TODO: 실제 사용자의 팀 ID 또는 기본값
      writerProfileId: user.profileId || 1, // 현재 사용자의 프로필 ID
      title,
      content,
      region,
      subRegion: subRegion || undefined,
      matchDate: gameDate || undefined,
      gameTime: gameTime || undefined,
      requiredPersonnel: requiredPersonnel
        ? Number(requiredPersonnel)
        : undefined,
      category: category.toUpperCase(), // "MERCENARY", "TEAM", "MATCH"
      targetType,
      status: "RECRUITING",
      cost: cost ? Number(cost) : undefined,
      fieldLocation: fieldLocation || undefined,
      preferredPositions: preferredPositions || undefined,
      parkingAvailable,
      showerFacilities,
    };

    onSubmit(postData); // 백엔드 API로 전달
    onClose(); // 모달 닫기
  };

  const timeCharacteristics = getTimeCharacteristics(gameTime);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="bg-blue-900 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">
                ⚽ {isEditMode ? "모집글 수정" : "모집글 작성"}
              </h2>
              <p className="text-blue-200 mt-1">
                {category === "mercenary"
                  ? "용병 카드 모달"
                  : category === "team"
                  ? "팀 모집"
                  : "경기 모집"}
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-red-500 hover:text-red-600 hover:bg-red-100 rounded-full p-2 transition-colors text-2xl font-bold"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="p-6 space-y-6">
          {/* 기본 정보 섹션 */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 border-b pb-2">
              📝 기본 정보
            </h3>

            {/* 모집 유형 선택 (용병 모집만) */}
            {category === "mercenary" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📋 모집 유형 *
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetType("USER")}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      targetType === "USER"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">🏃‍♂️</div>
                    <div className="text-sm font-bold">개인 용병 모집</div>
                    <div className="text-xs text-gray-500 mt-1">
                      우리 팀에 합류할 용병을 찾습니다
                    </div>
                    <div className="text-xs text-blue-600 mt-1">
                      • 팀 정보 및 경기 일정 제공
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType("TEAM")}
                    className={`flex-1 p-4 rounded-lg border-2 transition-all ${
                      targetType === "TEAM"
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-2xl mb-2">🤝</div>
                    <div className="text-sm font-bold">용병 지원</div>
                    <div className="text-xs text-gray-500 mt-1">
                      용병으로 참여할 팀을 찾습니다
                    </div>
                    <div className="text-xs text-green-600 mt-1">
                      • 개인 실력 및 가능 시간 어필
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* 제목 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📝 제목 *
              </label>
              <input
                type="text"
                placeholder={
                  category === "mercenary"
                    ? targetType === "USER"
                      ? "예: [강남구] 조기축구 용병 모집 - 오전 7시"
                      : "예: [개인] 조기축구 용병 지원 - 미드필더"
                    : category === "team"
                    ? "예: [강남구] 조기축구팀 신규 멤버 모집"
                    : "예: [강남구] 토요일 오전 풋살 상대팀 구합니다"
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            {/* 지역 정보 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📍 지역 *
                </label>
                <button
                  type="button"
                  onClick={() => setIsRegionModalOpen(true)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 text-left focus:ring-2 focus:ring-blue-500 focus:border-transparent hover:bg-gray-50 transition-colors"
                >
                  {region || "지역을 선택하세요"}
                </button>
              </div>
              <div>
                <AutocompleteInput
                  label="📍 상세 지역"
                  value={subRegion}
                  onChange={(value) => setSubRegion(value)}
                  suggestions={getSubRegionSuggestions(region)}
                  placeholder={
                    region
                      ? `${region}의 구/시를 입력하세요`
                      : "먼저 지역을 선택하세요"
                  }
                />
              </div>
            </div>

            {/* 일시 설정 */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📅 경기 날짜
                </label>
                <input
                  type="date"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={gameDate}
                  onChange={(e) => setGameDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  🕐 경기 시간
                </label>
                <div className="relative">
                  <input
                    type="time"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={gameTime}
                    onChange={(e) => setGameTime(e.target.value)}
                  />
                  {timeCharacteristics && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm">
                      {timeCharacteristics.icon}
                    </div>
                  )}
                </div>
                {timeCharacteristics && (
                  <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                    {timeCharacteristics.icon} {timeCharacteristics.label} •{" "}
                    {timeCharacteristics.desc}
                  </div>
                )}
              </div>
            </div>

            {/* 모집 인원 */}
            {(category === "mercenary" && targetType === "USER") ||
            category === "team" ||
            category === "match" ? (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👥 {category === "match" ? "참가 인원" : "모집 인원"}
                </label>
                <input
                  type="number"
                  placeholder={
                    category === "match" ? "예: 11명 (한 팀 기준)" : "예: 2명"
                  }
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={requiredPersonnel}
                  onChange={(e) => setRequiredPersonnel(e.target.value)}
                  min="1"
                  max="20"
                />
                <div className="text-xs text-gray-500 mt-1">
                  💡{" "}
                  {category === "match"
                    ? "한 팀당 참가 인원 수를 입력하세요"
                    : category === "team"
                    ? "필요한 신규 멤버 수를 입력하세요"
                    : "필요한 용병 수를 입력하세요"}
                </div>
              </div>
            ) : null}

            {/* 개인 정보 (용병 지원용) */}
            {targetType === "TEAM" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    ⚽ 주 포지션
                  </label>
                  <input
                    type="text"
                    placeholder="예: 미드필더, 수비수, 포지션 무관"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={preferredPositions}
                    onChange={(e) => setPreferredPositions(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📊 실력 수준
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={fieldLocation} // 임시로 fieldLocation 사용
                    onChange={(e) => setFieldLocation(e.target.value)}
                  >
                    <option value="">실력 수준을 선택하세요</option>
                    <option value="초급">초급 (축구 경험 1년 미만)</option>
                    <option value="초중급">초중급 (축구 경험 1-3년)</option>
                    <option value="중급">중급 (축구 경험 3-5년)</option>
                    <option value="중고급">중고급 (축구 경험 5-10년)</option>
                    <option value="고급">고급 (10년 이상, 리그 경험)</option>
                  </select>
                </div>
              </div>
            )}

            {/* 내용 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                📄 상세 내용 *
              </label>
              <textarea
                placeholder={
                  category === "mercenary"
                    ? targetType === "USER"
                      ? `팀 정보와 경기 상세 내용을 적어주세요.

팀 모집 예시:
• 팀명: 강남 FC
• 팀 레벨: 초중급 (경험자 환영)
• 구장: 강남 스포츠센터 인조잔디
• 경기 스타일: 패스 위주의 안정적인 플레이
• 준비사항: 개인 축구화, 물
• 연락처: 카카오톡 @teamleader`
                      : `개인 실력과 용병 지원 정보를 적어주세요.

용병 지원 예시:
• 축구 경력: 3년 (고등학교 축구부)
• 주 포지션: 공격형 미드필더, 우윙 (포지션 무관도 가능)
• 플레이 스타일: 빠른 스피드와 정확한 패스
• 실력 수준: 초중급~중급
• 가능 시간: 주말 오전, 평일 저녁 7시 이후
• 연락처: 카카오톡 @playerid`
                    : category === "team"
                    ? `팀 정보와 신규 멤버 모집 상세 내용을 적어주세요.

팀 모집 예시:
• 팀명: 강남 FC
• 창단년도: 2020년
• 팀 레벨: 초중급 (초보자도 환영)
• 정기 훈련: 매주 토요일 오전 10시
• 훈련 장소: 강남 스포츠센터
• 팀 분위기: 친목 위주, 실력 향상 목표
• 회비: 월 10만원 (훈련비, 유니폼 포함)
• 연락처: 카카오톡 @teamcaptain`
                    : `경기 모집 상세 내용을 적어주세요.

경기 모집 예시:
• 경기 형식: 11vs11 정식 경기
• 구장: 강남 스포츠센터 천연잔디
• 경기 시간: 90분 (전후반 각 45분)
• 상대팀 수준: 초중급 ~ 중급
• 심판: 공인 심판 (별도 비용)
• 참가비: 팀당 20만원 (구장비 포함)
• 준비사항: 공식 유니폼, 축구화
• 연락처: 카카오톡 @matchmaker`
                }
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={8}
              />
            </div>
          </div>

          {/* 상세 설정 섹션 (접히는 방식) */}
          <div className="border-t pt-4">
            <button
              type="button"
              onClick={() => setIsDetailExpanded(!isDetailExpanded)}
              className="w-full flex justify-between items-center text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors"
            >
              <span>⚙️ 상세 설정</span>
              <span
                className={`transform transition-transform ${
                  isDetailExpanded ? "rotate-180" : ""
                }`}
              >
                ⌄
              </span>
            </button>

            {isDetailExpanded && (
              <div className="mt-4 space-y-4 p-4 bg-gray-50 rounded-lg">
                {/* 상세 위치 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    🏟️ 구장 위치
                  </label>
                  <input
                    type="text"
                    placeholder="예: 강남스포츠센터 풋살장 A코트"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={fieldLocation}
                    onChange={(e) => setFieldLocation(e.target.value)}
                  />
                </div>

                {/* 참가비 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    💰 참가비 (원)
                  </label>
                  <input
                    type="number"
                    placeholder="예: 10000"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={cost}
                    onChange={(e) => setCost(e.target.value)}
                    min="0"
                    step="1000"
                  />
                </div>

                {/* 포지션 정보 (타입별로 다르게) */}
                {targetType === "USER" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      ⚽ 모집 포지션
                    </label>
                    <input
                      type="text"
                      placeholder="예: 미드필더, 수비수 / 또는 포지션 무관"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={preferredPositions}
                      onChange={(e) => setPreferredPositions(e.target.value)}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      💡 필요한 포지션을 명시하면 더 적합한 용병을 찾을 수
                      있어요
                    </div>
                  </div>
                )}

                {targetType === "TEAM" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      🎯 가능 지역
                    </label>
                    <input
                      type="text"
                      placeholder="예: 강남구, 서초구 인근 / 또는 지역 무관"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      value={preferredPositions}
                      onChange={(e) => setPreferredPositions(e.target.value)}
                    />
                    <div className="text-xs text-gray-500 mt-1">
                      💡 용병으로 뛸 수 있는 지역을 입력하세요
                    </div>
                  </div>
                )}

                {/* 편의시설 */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">
                    🏢 편의시설
                  </label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer bg-white">
                      <input
                        type="checkbox"
                        checked={parkingAvailable}
                        onChange={(e) => setParkingAvailable(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🅿️</span>
                        <div>
                          <div className="font-medium">주차 가능</div>
                          <div className="text-sm text-gray-500">
                            구장 내 주차공간 이용 가능
                          </div>
                        </div>
                      </div>
                    </label>

                    <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer bg-white">
                      <input
                        type="checkbox"
                        checked={showerFacilities}
                        onChange={(e) => setShowerFacilities(e.target.checked)}
                        className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                      />
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🚿</span>
                        <div>
                          <div className="font-medium">샤워시설</div>
                          <div className="text-sm text-gray-500">
                            경기 후 샤워 가능
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* 하단 버튼 */}
        <div className="bg-gray-50 px-6 py-4 rounded-b-xl">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-500">
              * 표시는 필수 입력 항목입니다
            </div>
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleSubmit}
                className="px-8 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all transform hover:scale-105 shadow-lg"
              >
                {isEditMode ? "📝 모집글 수정" : "📝 모집글 등록"}
              </button>
            </div>
          </div>
        </div>

        {/* 지역 선택 모달 */}
        {isRegionModalOpen && (
          <RegionSelectModal
            onSelect={(selectedRegion) => {
              setRegion(selectedRegion);
              setSubRegion(""); // 지역 변경 시 상세지역 초기화
              setIsRegionModalOpen(false);
            }}
            onClose={() => setIsRegionModalOpen(false)}
          />
        )}
      </div>
    </div>
  );
};

export default MercenaryCardModal;
