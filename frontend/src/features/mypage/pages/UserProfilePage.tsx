// src/features/myPage/pages/UserProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchPublicUserProfileApi } from '@/features/auth/api/userApi';
import type { PublicUserProfileResponseDto } from '@/types/user';

// 1. 소속팀 목록을 보여주는 컴포넌트를 임포트합니다.
import UserTeamsList from '../components/UserTeamList';

const UserProfilePage: React.FC = () => {
  // 2. URL 파라미터에서 userId를 가져옵니다. (예: /profile/123 -> userId는 "123")
  const { userId } = useParams<{ userId: string }>();

  const [profile, setProfile] = useState<PublicUserProfileResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) return;

    const loadProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const profileData = await fetchPublicUserProfileApi(userId);
        setProfile(profileData);
      } catch (err) {
        setError('프로필 정보를 불러오는 데 실패했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [userId]);

  if (isLoading) {
    return <div className="text-center py-20 pt-24">프로필을 불러오는 중...</div>;
  }

  if (error || !profile) {
    return <div className="text-center py-20 pt-24 text-red-500">{error || '사용자를 찾을 수 없습니다.'}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-24 space-y-8">
      {/* 기본 프로필 정보 섹션 */}
      <section className="p-6 bg-white shadow-md rounded-lg">
        <h1 className="text-3xl font-bold">{profile.name}</h1>
        <p className="text-gray-600">@{profile.userid}</p>
        {/* 필요하다면 여기에 더 많은 기본 정보(지역, 포지션 등)를 표시할 수 있습니다. */}
      </section>

      {/* 탭 또는 컨텐츠 섹션 */}
      <section>
        {/* 3. UserTeamsList 컴포넌트를 렌더링합니다. 현재는 로그인한 사용자의 팀만 보여줍니다. */}
        <UserTeamsList />
      </section>

      <section>
        {/* 앞으로 여기에 '작성한 글', '신청 내역' 컴포넌트가 추가될 수 있습니다. */}
      </section>
    </div>
  );
};

export default UserProfilePage;