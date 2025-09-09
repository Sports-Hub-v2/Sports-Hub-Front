// src/features/mercenary/components/NewPostModal.tsx

import { useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import {
  RecruitPostCreationRequestDto,
  RecruitCategory,
  RecruitTargetType,
  ParticipantType,
} from "@/types/recruitPost";

interface Props {
  category: "mercenary" | "team" | "match";
  onClose: () => void;
  onSubmit: (postData: RecruitPostCreationRequestDto) => void;
}

const NewPostModal = ({ category, onClose, onSubmit }: Props) => {
  const user = useAuthStore((s) => s.user);

  // 입력 필드 상태
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [region, setRegion] = useState("");
  const [subRegion, setSubRegion] = useState("");
  const [gameDate, setGameDate] = useState("");
  const [gameTime, setGameTime] = useState("");
  const [requiredPersonnel, setRequiredPersonnel] = useState("");
  const [targetType, setTargetType] = useState<"USER" | "TEAM">("USER");
  const [cost, setCost] = useState("");
  const [fieldLocation, setFieldLocation] = useState("");
  const [preferredPositions, setPreferredPositions] = useState("");
  
  // 추가 옵션들
  const [parkingAvailable, setParkingAvailable] = useState(false);
  const [showerFacilities, setShowerFacilities] = useState(false);
  
  // UI 상태
  const [activeTab, setActiveTab] = useState<"basic" | "detail">("basic");

  // 시간대별 특성 표시
  const getTimeCharacteristics = (timeStr: string) => {
    if (!timeStr) return null;
    try {
      const [hour] = timeStr.split(":");
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
      requiredPersonnel: requiredPersonnel ? Number(requiredPersonnel) : undefined,
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
        <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-6 rounded-t-xl">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">⚽ 모집글 작성</h2>
              <p className="text-blue-100 mt-1">
                {category === "mercenary" ? "용병 모집" : 
                 category === "team" ? "팀 모집" : "경기 모집"}
              </p>
            </div>
            <button 
              onClick={onClose}
              className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
            >
              ✕
            </button>
          </div>
        </div>

        {/* 탭 메뉴 */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("basic")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "basic" 
                ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            📝 기본 정보
          </button>
          <button
            onClick={() => setActiveTab("detail")}
            className={`flex-1 py-3 px-4 text-sm font-medium transition-colors ${
              activeTab === "detail" 
                ? "border-b-2 border-blue-500 text-blue-600 bg-blue-50" 
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            ⚙️ 상세 설정
          </button>
        </div>

        {/* 컨텐츠 영역 */}
        <div className="p-6">
          {activeTab === "basic" ? (
            <div className="space-y-4">
              {/* 모집 유형 선택 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📋 모집 유형 *
                </label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setTargetType("USER")}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      targetType === "USER" 
                        ? "border-blue-500 bg-blue-50 text-blue-700" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-lg">🏃‍♂️</div>
                    <div className="text-sm font-medium">개인 찾는 팀</div>
                    <div className="text-xs text-gray-500">팀에서 개인 모집</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTargetType("TEAM")}
                    className={`flex-1 p-3 rounded-lg border-2 transition-all ${
                      targetType === "TEAM" 
                        ? "border-blue-500 bg-blue-50 text-blue-700" 
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="text-lg">🤝</div>
                    <div className="text-sm font-medium">팀 찾는 개인</div>
                    <div className="text-xs text-gray-500">개인이 팀 찾기</div>
                  </button>
                </div>
              </div>

              {/* 제목 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📝 제목 *
                </label>
                <input
                  type="text"
                  placeholder="예: 강남역 조기축구 용병 모집 (오전 7시)"
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
                  <input
                    type="text"
                    placeholder="예: 강남구"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={region}
                    onChange={(e) => setRegion(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    📍 상세 지역
                  </label>
                  <input
                    type="text"
                    placeholder="예: 역삼동"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={subRegion}
                    onChange={(e) => setSubRegion(e.target.value)}
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
                    min={new Date().toISOString().split('T')[0]}
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
                      {timeCharacteristics.icon} {timeCharacteristics.label} • {timeCharacteristics.desc}
                    </div>
                  )}
                </div>
              </div>

              {/* 모집 인원 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  👥 모집 인원
                </label>
                <input
                  type="number"
                  placeholder="예: 2"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={requiredPersonnel}
                  onChange={(e) => setRequiredPersonnel(e.target.value)}
                  min="1"
                  max="20"
                />
              </div>

              {/* 내용 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  📄 상세 내용 *
                </label>
                <textarea
                  placeholder={`경기에 대한 상세 정보를 적어주세요.

예시:
• 레벨: 초급자 환영
• 구장: 인조잔디 풋살장
• 준비사항: 개인 축구화, 물
• 연락처: 카카오톡 @username`}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={6}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-4">
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

              {/* 선호 포지션 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  ⚽ 선호/모집 포지션
                </label>
                <input
                  type="text"
                  placeholder="예: 미드필더, 수비수 / 또는 포지션 무관"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={preferredPositions}
                  onChange={(e) => setPreferredPositions(e.target.value)}
                />
              </div>

              {/* 편의시설 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  🏢 편의시설
                </label>
                <div className="space-y-3">
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
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
                        <div className="text-sm text-gray-500">구장 내 주차공간 이용 가능</div>
                      </div>
                    </div>
                  </label>
                  
                  <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
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
                        <div className="text-sm text-gray-500">경기 후 샤워 가능</div>
                      </div>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
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
                📝 모집글 등록
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewPostModal;
