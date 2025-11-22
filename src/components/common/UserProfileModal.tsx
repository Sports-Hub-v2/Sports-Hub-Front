// src/components/common/UserProfileModal.tsx

import React, { useEffect, useState } from 'react';
import type { PublicUserProfileResponseDto } from '@/types/user';
import { fetchPublicUserProfileApi } from '@/features/auth/api/userApi';

interface UserProfileModalProps {
  userId: number | string | null;
  onClose: () => void;
}

const UserProfileModal: React.FC<UserProfileModalProps> = ({ userId, onClose }) => {
  const [profile, setProfile] = useState<PublicUserProfileResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId !== null && userId !== undefined && userId !== '') {
      const fetchProfile = async () => {
        setIsLoading(true);
        setError(null);
        setProfile(null);
        try {
          const data = await fetchPublicUserProfileApi(userId);
          setProfile(data);
        } catch (err) {
          console.error("Failed to fetch user profile in modal:", err);
          setError("프로필 정보를 불러오는 데 실패했습니다.");
        } finally {
          setIsLoading(false);
        }
      };
      fetchProfile();
    } else {
      setProfile(null);
      setIsLoading(false);
    }
  }, [userId]);

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // 나이 계산
  const calculateAge = (birthDate?: string) => {
    if (!birthDate) return null;
    const birth = new Date(birthDate);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  // 활동 기간 계산
  const calculateActivityPeriod = (startDate?: string) => {
    if (!startDate) return null;
    const start = new Date(startDate);
    const today = new Date();
    const months = (today.getFullYear() - start.getFullYear()) * 12 + (today.getMonth() - start.getMonth());
    const years = Math.floor(months / 12);
    const remainingMonths = months % 12;

    if (years > 0 && remainingMonths > 0) {
      return `${years}년 ${remainingMonths}개월`;
    } else if (years > 0) {
      return `${years}년`;
    } else {
      return `${remainingMonths}개월`;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center p-4"
      onClick={handleBackdropClick}
    >
      <div
        className="bg-white w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white">
          <div className="flex justify-between items-start">
            <h2 className="text-2xl font-bold">선수 프로필</h2>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-3xl leading-none"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {isLoading && (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
              <p className="text-gray-500 mt-4">프로필 정보를 불러오는 중...</p>
            </div>
          )}

          {error && (
            <div className="text-center py-12">
              <p className="text-red-500 bg-red-100 p-4 rounded-lg">{error}</p>
            </div>
          )}

          {profile && !isLoading && !error && (
            <div className="space-y-6">
              {/* 기본 정보 */}
              <div className="flex items-start gap-6">
                <div className="flex-shrink-0">
                  {profile.profileImageUrl ? (
                    <img
                      src={profile.profileImageUrl}
                      alt={profile.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white text-3xl font-bold">
                      {profile.name.charAt(0)}
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{profile.name}</h3>
                  <p className="text-gray-600 mb-2">@{profile.userid}</p>
                  {profile.isExPlayer && (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                      ⭐ 선수 출신
                    </span>
                  )}
                </div>
              </div>

              {/* 자기소개 */}
              {profile.bio && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-700 mb-2">자기소개</h4>
                  <p className="text-gray-800 leading-relaxed">{profile.bio}</p>
                </div>
              )}

              {/* 신체 정보 & 기본 정보 */}
              <div className="grid grid-cols-2 gap-4">
                {calculateAge(profile.birthDate) && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <p className="text-xs text-blue-600 font-medium mb-1">나이</p>
                    <p className="text-lg font-bold text-blue-900">{calculateAge(profile.birthDate)}세</p>
                  </div>
                )}
                {profile.height && (
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <p className="text-xs text-purple-600 font-medium mb-1">키</p>
                    <p className="text-lg font-bold text-purple-900">{profile.height}cm</p>
                  </div>
                )}
                {profile.weight && (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                    <p className="text-xs text-green-600 font-medium mb-1">몸무게</p>
                    <p className="text-lg font-bold text-green-900">{profile.weight}kg</p>
                  </div>
                )}
                {profile.careerYears && (
                  <div className="bg-orange-50 p-4 rounded-lg border border-orange-100">
                    <p className="text-xs text-orange-600 font-medium mb-1">축구 경력</p>
                    <p className="text-lg font-bold text-orange-900">{profile.careerYears}년</p>
                  </div>
                )}
              </div>

              {/* 축구 정보 */}
              <div className="border-t pt-6">
                <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <span>⚽</span>
                  <span>축구 정보</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {profile.preferredPosition && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">📍</span>
                      <div>
                        <p className="text-xs text-gray-600">선호 포지션</p>
                        <p className="font-semibold text-gray-900">{profile.preferredPosition}</p>
                      </div>
                    </div>
                  )}
                  {profile.skillLevel && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">⭐</span>
                      <div>
                        <p className="text-xs text-gray-600">실력 수준</p>
                        <p className="font-semibold text-gray-900">{profile.skillLevel}</p>
                      </div>
                    </div>
                  )}
                  {profile.dominantFoot && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">👟</span>
                      <div>
                        <p className="text-xs text-gray-600">주발</p>
                        <p className="font-semibold text-gray-900">
                          {profile.dominantFoot === 'RIGHT' ? '오른발' : profile.dominantFoot === 'LEFT' ? '왼발' : '양발'}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.playStyle && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">🎯</span>
                      <div>
                        <p className="text-xs text-gray-600">플레이 스타일</p>
                        <p className="font-semibold text-gray-900">{profile.playStyle}</p>
                      </div>
                    </div>
                  )}
                  {profile.region && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">🗺️</span>
                      <div>
                        <p className="text-xs text-gray-600">주 활동 지역</p>
                        <p className="font-semibold text-gray-900">
                          {profile.region}
                          {profile.subRegion && ` · ${profile.subRegion}`}
                        </p>
                      </div>
                    </div>
                  )}
                  {profile.phoneNumber && (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <span className="text-2xl">📞</span>
                      <div>
                        <p className="text-xs text-gray-600">연락처</p>
                        <p className="font-semibold text-gray-900">{profile.phoneNumber}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 활동 정보 */}
              {(profile.preferredTimeSlots || profile.activityStartDate || profile.birthDate) && (
                <div className="border-t pt-6">
                  <h4 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📅</span>
                    <span>활동 정보</span>
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {profile.preferredTimeSlots && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">🕐</span>
                        <div>
                          <p className="text-xs text-gray-600">선호 시간대</p>
                          <p className="font-semibold text-gray-900">{profile.preferredTimeSlots}</p>
                        </div>
                      </div>
                    )}
                    {calculateActivityPeriod(profile.activityStartDate) && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">📊</span>
                        <div>
                          <p className="text-xs text-gray-600">Sports Hub 활동 기간</p>
                          <p className="font-semibold text-gray-900">{calculateActivityPeriod(profile.activityStartDate)}</p>
                        </div>
                      </div>
                    )}
                    {profile.activityStartDate && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">🎯</span>
                        <div>
                          <p className="text-xs text-gray-600">가입일</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(profile.activityStartDate).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                    {profile.birthDate && !calculateAge(profile.birthDate) && (
                      <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <span className="text-2xl">🎂</span>
                        <div>
                          <p className="text-xs text-gray-600">생년월일</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(profile.birthDate).toLocaleDateString('ko-KR', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                            })}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="bg-gray-50 px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
