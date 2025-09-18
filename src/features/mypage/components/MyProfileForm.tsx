// src/features/mypage/components/MyProfileForm.tsx

import { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { updateMyProfileApi } from "@/features/auth/api/userApi";
import { User } from "@/types/user";

const MyProfileForm = () => {
  const [profile, setProfile] = useState<User | null>(null);
  const [editableProfile, setEditableProfile] = useState<User | null>(null); // 수정 가능한 프로필 상태 추가
  const [isEditing, setIsEditing] = useState(false); // 수정 모드 상태 추가
  const { token, user: authUser, login } = useAuthStore(); // login 함수도 가져옴

  // ⛳ 내 정보 불러오기
  useEffect(() => {
    const fetchProfile = async () => {
      console.log("[MyProfileForm] fetchProfile 시작");
      try {
        console.log("/api/users/me 요청 보냄!");
        const data = { id: 1, name: '임시 사용자', userid: 'temp' } as User; // 임시 데이터
        setProfile(data);
        setEditableProfile(data); // 수정 가능한 프로필에도 초기값 설정
        console.log("불러온 사용자 정보:", data);
      } catch (error) {
        console.error("프로필 불러오기 실패:", error);
      }
      console.log("[MyProfileForm] fetchProfile 끝");
    };

    if (token !== null && token !== "") {
      fetchProfile();
    }
  }, [token]);

  // 입력 필드 변경 핸들러
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditableProfile((prev) => (prev ? { ...prev, [name]: value } : null));
  };

  // 수정 모드 활성화
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 수정 취소
  const handleCancelClick = () => {
    setIsEditing(false);
    setEditableProfile(profile); // 원래 프로필로 되돌리기
  };

  // 프로필 저장 (수정 완료)
  const handleSaveClick = async () => {
    if (!editableProfile) return;

    try {
      console.log("프로필 수정 요청 보냄:", editableProfile);
      const updatedUser = await updateMyProfileApi(editableProfile.id, { // updateMyProfile 함수 사용
        name: editableProfile.name,
        region: editableProfile.region,
        preferredPosition: editableProfile.preferredPosition,
        // 비밀번호는 여기서 수정하지 않으므로 포함하지 않음
      });
      setProfile(updatedUser); // 원본 프로필 업데이트
      setIsEditing(false); // 보기 모드로 전환
      // Zustand store의 user 정보도 업데이트 (선택 사항이지만 일관성을 위해 추천)
      if (authUser && token) {
        login(token, { ...authUser, ...updatedUser });
      }
      console.log("프로필 수정 성공:", updatedUser);
    } catch (error) {
      console.error("프로필 수정 실패:", error);
      alert("프로필 수정에 실패했습니다.");
    }
  };

  if (!profile) return <p>내 정보를 불러오는 중입니다...</p>;

  return (
    <div className="bg-white p-6 rounded shadow max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">내 정보</h2>
      <div className="grid grid-cols-1 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">이름</label>
          <input
            type="text"
            name="name" // name 속성 추가
            value={editableProfile?.name || ""}
            onChange={handleChange}
            disabled={!isEditing} // isEditing 상태에 따라 disabled 설정
            className="mt-1 block w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">아이디</label>
          <input
            type="text"
            name="userid" // name 속성 추가
            value={editableProfile?.userid || ""}
            disabled // 아이디는 수정 불가
            className="mt-1 block w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">지역</label>
          <input
            type="text"
            name="region" // name 속성 추가
            value={editableProfile?.region || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 block w-full border px-3 py-2 rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">선호 포지션</label>
          <input
            type="text"
            name="preferredPosition" // name 속성 추가
            value={editableProfile?.preferredPosition || ""}
            onChange={handleChange}
            disabled={!isEditing}
            className="mt-1 block w-full border px-3 py-2 rounded"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end space-x-3">
        {!isEditing ? (
          <button
            onClick={handleEditClick}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            수정
          </button>
        ) : (
          <>
            <button
              onClick={handleCancelClick}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition"
            >
              취소
            </button>
            <button
              onClick={handleSaveClick}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
            >
              저장
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MyProfileForm;