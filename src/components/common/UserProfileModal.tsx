// src/components/common/UserProfileModal.tsx (또는 실제 경로)

import React, { useEffect, useState } from 'react';
import type { PublicUserProfileResponseDto } from '@/types/user'; // user.ts에 이 타입 정의 필요
import { fetchPublicUserProfileApi } from '@/features/auth/api/userApi'; // 실제 API 함수 경로로 수정 필요

interface UserProfileModalProps {
  userId: number | string | null; // ✅ 여기가 'number | string | null' 이어야 합니다!
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ userId, onClose }) => {
  const [profile, setProfile] = useState<PublicUserProfileResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // userId가 유효한 값일 때만 프로필 정보를 불러옵니다.
    if (userId !== null && userId !== undefined && userId !== '') {
      const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);
        setProfile(null); // 이전 프로필 정보가 있다면 초기화
        try {
          // console.log(`[UserProfileModal] Fetching profile for userId: ${userId}`);
          const data = await fetchPublicUserProfileApi(userId);
          setProfile(data);
        } catch (err) {
          console.error("Failed to fetch user profile in modal:", err);
          setError("프로필 정보를 불러오는 데 실패했습니다. 사용자가 없거나 문제가 발생했습니다.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    } else {
      // userId가 null이면 프로필 정보를 초기화하고 로딩 상태를 false로 설정합니다.
      setProfile(null);
      setIsLoading(false); // 명시적으로 로딩 상태 해제
    }
  }, [userId]); // userId가 변경될 때마다 프로필을 다시 로드합니다.

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // MercenaryPage.tsx에서 {selectedUserIdForProfile !== null && <UserProfileModal ... />} 와 같이
  // selectedUserIdForProfile이 null이 아닐 때만 이 컴포넌트를 렌더링하므로,
  // 여기서 userId가 null인 경우는 사실상 모달이 보이지 않는 상태가 됩니다.
  // 그럼에도 불구하고, 타입 정의는 null을 허용해야 상위 컴포넌트의 상태와 호환됩니다.

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center p-4 transition-opacity duration-300 ease-in-out"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white w-full max-w-lg rounded-xl shadow-2xl p-6 md:p-8 transform transition-all duration-300 ease-in-out scale-95 animate-modalShow"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-800">사용자 프로필</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-3xl font-light"
            aria-label="닫기"
          >
            &times;
          </button>
        </div>

        {isLoading && <div className="text-center py-8"><p className="text-gray-500">프로필 정보를 불러오는 중...</p></div>}
        {error && <div className="text-center py-8"><p className="text-red-500 bg-red-100 p-3 rounded-md">{error}</p></div>}
        
        {profile && !isLoading && !error && (
          <div className="space-y-4 text-sm">
            <div className="flex items-center space-x-4 p-3 bg-gray-50 rounded-md">
              <div>
                <p className="text-xl font-semibold text-gray-900">{profile.name}</p>
                <p className="text-gray-600">@{profile.userid}</p>
              </div>
            </div>
            {profile.region && ( <div className="p-3 border-t"> <p className="font-medium text-gray-500">주 활동 지역:</p> <p className="text-gray-800">{profile.region}</p> </div> )}
            {profile.preferredPosition && ( <div className="p-3 border-t"> <p className="font-medium text-gray-500">선호 포지션:</p> <p className="text-gray-800">{profile.preferredPosition}</p> </div> )}
            {profile.isExPlayer !== undefined && ( <div className="p-3 border-t"> <p className="font-medium text-gray-500">선수 출신:</p> <p className="text-gray-800">{profile.isExPlayer ? '예' : '아니오'}</p> </div> )}
          </div>
        )}

        <div className="mt-8 text-right">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 text-sm transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
      {/* global.css 등에 애니메이션 CSS 추가:
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleUp { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-modalShow { animation: scaleUp 0.3s forwards, fadeIn 0.3s forwards; }
      */}
    </div>
  );
};

export default UserProfileModal;