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
  const [gameDate, setGameDate] = useState("");
  const [requiredPersonnel, setRequiredPersonnel] = useState("");

  // ✅ 등록 버튼 클릭 핸들러
  const handleSubmit = () => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    if (!title || !content || !region) {
      alert("모든 필드를 입력해주세요.");
      return;
    }

    // 백엔드 PostCreateRequest 구조에 맞춘 데이터 구성
    const postData: RecruitPostCreationRequestDto = {
      teamId: 1, // TODO: 실제 사용자의 팀 ID 또는 기본값
      writerProfileId: user.profileId || 1, // 현재 사용자의 프로필 ID
      title,
      content,
      region,
      matchDate: gameDate || undefined, // 경기 날짜
      category: category.toUpperCase(), // "MERCENARY", "TEAM", "MATCH"
      targetType: "USER",
      status: "RECRUITING",
    };

    onSubmit(postData); // 백엔드 API로 전달
    onClose(); // 모달 닫기
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded w-[400px]">
        <h2 className="text-xl font-semibold mb-4">✏️ 모집글 작성</h2>

        <input
          type="text"
          placeholder="제목 (예: 강남역 조기축구 용병 모집)"
          className="w-full border p-2 mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          placeholder="내용 (경기 시간, 위치, 레벨 등 상세 정보)"
          className="w-full border p-2 mb-3"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={4}
        />

        <input
          type="text"
          placeholder="지역 (예: 강남구, 마포구)"
          className="w-full border p-2 mb-3"
          value={region}
          onChange={(e) => setRegion(e.target.value)}
        />

        <input
          type="date"
          placeholder="경기 날짜"
          className="w-full border p-2 mb-3"
          value={gameDate}
          onChange={(e) => setGameDate(e.target.value)}
        />

        <input
          type="number"
          placeholder="모집 인원 (명)"
          className="w-full border p-2 mb-3"
          value={requiredPersonnel}
          onChange={(e) => setRequiredPersonnel(e.target.value)}
          min="1"
          max="20"
        />

        <div className="flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">
            취소
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewPostModal;
