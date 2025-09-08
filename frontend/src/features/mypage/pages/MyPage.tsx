// src/features/mypage/pages/MyPage.tsx

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserResponseDto } from '@/types/user';
// import { deleteMyAccountApi } from '@/features/auth/api/authApi'; // 실제 탈퇴 API 함수 경로

const MyPage = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout } = useAuthStore();
  const [myInfo, setMyInfo] = useState<UserResponseDto | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoggedIn || !user) {
      navigate('/login');
      return;
    }
    // useAuthStore의 user 객체를 UserResponseDto 타입으로 간주
    setMyInfo(user as UserResponseDto); // 타입 단언의 정확성 확인 필요
    setIsLoading(false);
  }, [user, isLoggedIn, navigate]);

  const handleEditProfile = () => {
    navigate('/mypage/edit'); // 프로필 수정 페이지로 이동
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('정말로 회원 탈퇴를 하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      try {
        // await deleteMyAccountApi(); // 실제 탈퇴 API 호출
        alert('회원 탈퇴가 처리되었습니다. 메인 페이지로 이동합니다.');
        logout();
        navigate('/');
      } catch (err) {
        console.error("Error deleting account:", err);
        setError('회원 탈퇴 중 오류가 발생했습니다. 다시 시도해주세요.');
      }
    }
  };

  if (isLoading) {
    return <div className="text-center py-20 pt-24">내 정보를 불러오는 중입니다...</div>;
  }

  if (error) {
    return <div className="text-center py-20 pt-24 text-red-500">오류: {error}</div>;
  }

  if (!myInfo) {
    return <div className="text-center py-20 pt-24">사용자 정보를 찾을 수 없습니다.</div>;
  }

  // 날짜 포맷팅 함수 (간단 예시)
  const formatDate = (dateString?: string) => {
    if (!dateString) return '정보 없음';
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-24"> {/* 반응형 패딩 및 상단 패딩 */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden">
        <div className="p-6 md:p-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center border-b pb-4">마이페이지</h1>

          {/* 기본 정보 섹션 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">기본 정보</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 text-sm">
              <div className="sm:col-span-1">
                <dt className="font-medium text-gray-500">이름</dt>
                <dd className="mt-1 text-gray-900">{myInfo.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="font-medium text-gray-500">아이디</dt>
                <dd className="mt-1 text-gray-900">{myInfo.userid}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="font-medium text-gray-500">이메일</dt>
                <dd className="mt-1 text-gray-900">{myInfo.email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="font-medium text-gray-500">역할</dt>
                <dd className="mt-1 text-gray-900">{myInfo.role || '정보 없음'}</dd>
              </div>
              {myInfo.phoneNumber && (
                <div className="sm:col-span-1">
                  <dt className="font-medium text-gray-500">전화번호</dt>
                  <dd className="mt-1 text-gray-900">{myInfo.phoneNumber}</dd>
                </div>
              )}
              {myInfo.birthDate && (
                <div className="sm:col-span-1">
                  <dt className="font-medium text-gray-500">생년월일</dt>
                  <dd className="mt-1 text-gray-900">{formatDate(myInfo.birthDate)}</dd>
                </div>
              )}
            </dl>
          </section>

          {/* 활동 정보 섹션 */}
          <section className="mb-10">
            <h2 className="text-xl font-semibold text-gray-700 mb-6">활동 정보</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 text-sm">
              {myInfo.region && (
                <div className="sm:col-span-1">
                  <dt className="font-medium text-gray-500">주 활동 지역</dt>
                  <dd className="mt-1 text-gray-900">{myInfo.region}</dd>
                </div>
              )}
              {myInfo.preferredPosition && (
                <div className="sm:col-span-1">
                  <dt className="font-medium text-gray-500">선호 포지션</dt>
                  <dd className="mt-1 text-gray-900">{myInfo.preferredPosition}</dd>
                </div>
              )}
              {myInfo.isExPlayer !== undefined && (
                <div className="sm:col-span-1">
                  <dt className="font-medium text-gray-500">선수 출신 여부</dt>
                  <dd className="mt-1 text-gray-900">{myInfo.isExPlayer ? '예' : '아니오'}</dd>
                </div>
              )}
              {myInfo.activityStartDate && (
                <div className="sm:col-span-1">
                  <dt className="font-medium text-gray-500">활동 시작일</dt>
                  <dd className="mt-1 text-gray-900">{formatDate(myInfo.activityStartDate)}</dd>
                </div>
              )}
              {myInfo.activityEndDate && (
                <div className="sm:col-span-1">
                  <dt className="font-medium text-gray-500">활동 종료일</dt>
                  <dd className="mt-1 text-gray-900">{formatDate(myInfo.activityEndDate)}</dd>
                </div>
              )}
            </dl>
          </section>
          
          {/* 가입 정보 섹션 */}
          <section className="mb-10">
             <h2 className="text-xl font-semibold text-gray-700 mb-6">계정 정보</h2>
             <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6 text-sm">
                {myInfo.createdAt && (
                    <div className="sm:col-span-1">
                        <dt className="font-medium text-gray-500">가입일</dt>
                        <dd className="mt-1 text-gray-900">{formatDate(myInfo.createdAt)}</dd>
                    </div>
                )}
                {myInfo.updatedAt && (
                    <div className="sm:col-span-1">
                        <dt className="font-medium text-gray-500">최근 정보 수정일</dt>
                        <dd className="mt-1 text-gray-900">{formatDate(myInfo.updatedAt)}</dd>
                    </div>
                )}
             </dl>
          </section>


          {/* 계정 관리 섹션 */}
          <section>
            <h2 className="text-xl font-semibold text-gray-700 mb-6">계정 관리</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-start">
              <button
                onClick={handleEditProfile}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-150"
              >
                프로필 정보 수정
              </button>
              <button
                onClick={() => alert("비밀번호 변경 기능은 준비 중입니다.")}
                className="w-full sm:w-auto bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded transition-colors duration-150"
              >
                비밀번호 변경
              </button>
              <button
                onClick={handleDeleteAccount}
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded transition-colors duration-150 sm:ml-auto" // sm 이상에서 오른쪽 정렬
              >
                회원 탈퇴
              </button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MyPage;