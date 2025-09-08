// src/features/mypage/pages/MyProfileEditPage.tsx

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { UserResponseDto, UserProfileUpdateDto } from '@/types/user'; // UserProfileUpdateDto 임포트
import { REGIONS } from '@/constants/regions'; // 실제 REGIONS 상수 경로로 수정 필요

// --- 실제 API 함수로 교체 필요 ---
// 임시 API 함수 (userApi.ts 또는 authApi.ts 등에 실제 구현 필요)
const updateUserProfileApi = async (data: UserProfileUpdateDto): Promise<UserResponseDto> => {
  console.log(`[MyProfileEditPage] updateUserProfileApi called with data:`, data);
  // 실제 구현: axiosInstance.put('/api/users/me', data) 등
  // 백엔드 UserController의 updateMyInfo는 현재 인증된 사용자의 정보를 업데이트합니다.

  // --- 백엔드 API 호출 예시 (axiosInstance 사용, 실제 구현 시 주석 해제) ---
  /*
  try {
    const response = await axiosInstance.put<UserResponseDto>(`/api/users/me`, data);
    return response.data;
  } catch (error) {
    console.error("Error in updateUserProfileApi:", error);
    throw error; // 오류를 다시 throw하여 호출한 곳에서 처리
  }
  */
  // --- 백엔드 API 호출 예시 끝 ---


  // --- 임시 목업 응답 (실제 API 연동 후 제거) ---
  const storedUser = localStorage.getItem("user");
  if (storedUser && storedUser !== "undefined") {
    const currentUser = JSON.parse(storedUser) as UserResponseDto;
    const updatedUserFromMock = { 
      ...currentUser, 
      ...data, 
      password: undefined, // 응답에는 비밀번호가 없음
      updatedAt: new Date().toISOString() 
    };
    localStorage.setItem("user", JSON.stringify(updatedUserFromMock)); // 스토리지 업데이트 (예시)
    return updatedUserFromMock;
  }
  throw new Error("프로필 업데이트에 실패했습니다 (mocked).");
  // --- 임시 목업 응답 끝 ---
};
// --- 실제 API 함수로 교체 필요 끝 ---


const MyProfileEditPage = () => {
  const navigate = useNavigate();
  const { user: authUserInStore, token, login: updateUserInStoreState } = useAuthStore();
  
  const [formData, setFormData] = useState<Partial<UserProfileUpdateDto>>({
    // 초기값은 빈 문자열 또는 undefined로 설정하여 controlled component 경고 방지
    name: '',
    email: '',
    password: '', // 새 비밀번호 입력용
    isExPlayer: false,
    region: '',
    preferredPosition: '',
    phoneNumber: '',
    activityStartDate: undefined, // 또는 ''
    activityEndDate: undefined,   // 또는 ''
    birthDate: undefined,         // 또는 ''
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!token || !authUserInStore) {
      navigate('/login');
      return;
    }
    const loadCurrentProfile = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 스토어의 사용자 정보를 초기 폼 데이터로 사용
        const currentUserInfo = authUserInStore;
        
        setFormData({
          name: currentUserInfo.name,
          email: currentUserInfo.email,
          password: '', // 새 비밀번호 필드는 항상 비워둠
          isExPlayer: currentUserInfo.isExPlayer,
          region: currentUserInfo.region,
          preferredPosition: currentUserInfo.preferredPosition,
          phoneNumber: currentUserInfo.phoneNumber,
          activityStartDate: currentUserInfo.activityStartDate ? currentUserInfo.activityStartDate.split('T')[0] : undefined,
          activityEndDate: currentUserInfo.activityEndDate ? currentUserInfo.activityEndDate.split('T')[0] : undefined,
          birthDate: currentUserInfo.birthDate ? currentUserInfo.birthDate.split('T')[0] : undefined,
        });
      } catch (err) {
        console.error("Error initializing profile form:", err);
        setError("프로필 정보를 불러오는데 실패했습니다. 다시 시도해주세요.");
      } finally {
        setIsLoading(false);
      }
    };
    loadCurrentProfile();
  }, [authUserInStore, token, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setError(null);
    setSuccessMessage(null);

    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev: Partial<UserProfileUpdateDto>) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev: Partial<UserProfileUpdateDto>) => ({ ...prev, [name]: value === '' ? undefined : value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const updatePayload: UserProfileUpdateDto = {};

    // 변경된 값 또는 값이 있는 필드만 페이로드에 포함
    if (formData.name !== authUserInStore?.name) updatePayload.name = formData.name;
    if (formData.email !== authUserInStore?.email) updatePayload.email = formData.email; // 이메일 변경 허용 시

    if (formData.password && formData.password.length > 0) {
      if (formData.password.length < 8) {
        setError("새 비밀번호는 8자 이상이어야 합니다.");
        setIsSubmitting(false);
        return;
      }
      updatePayload.password = formData.password;
    }

    if (formData.isExPlayer !== authUserInStore?.isExPlayer) updatePayload.isExPlayer = formData.isExPlayer;
    if (formData.region !== authUserInStore?.region) updatePayload.region = formData.region || undefined; // 빈 문자열이면 undefined
    if (formData.preferredPosition !== authUserInStore?.preferredPosition) updatePayload.preferredPosition = formData.preferredPosition || undefined;
    if (formData.phoneNumber !== authUserInStore?.phoneNumber) updatePayload.phoneNumber = formData.phoneNumber || undefined;
    
    // 날짜 필드는 YYYY-MM-DD 형식으로 전송
    const formatDateForApi = (dateStr: string | undefined) => dateStr || undefined;

    if (formatDateForApi(formData.activityStartDate) !== authUserInStore?.activityStartDate?.split('T')[0]) updatePayload.activityStartDate = formatDateForApi(formData.activityStartDate);
    if (formatDateForApi(formData.activityEndDate) !== authUserInStore?.activityEndDate?.split('T')[0]) updatePayload.activityEndDate = formatDateForApi(formData.activityEndDate);
    if (formatDateForApi(formData.birthDate) !== authUserInStore?.birthDate?.split('T')[0]) updatePayload.birthDate = formatDateForApi(formData.birthDate);

    // 변경된 내용이 없으면 API 호출 방지
    if (Object.keys(updatePayload).length === 0) {
        setSuccessMessage("변경 사항이 없습니다.");
        setIsSubmitting(false);
        return;
    }

    try {
      console.log("[MyProfileEditPage] Submitting profile update:", JSON.stringify(updatePayload, null, 2));
      const updatedUserResponse = await updateUserProfileApi(updatePayload);

      if (token) {
        updateUserInStoreState(token, updatedUserResponse);
      }
      setSuccessMessage('프로필이 성공적으로 업데이트되었습니다.');
      // 업데이트된 정보로 formData 다시 설정 (서버 응답 기준으로)
      setFormData({
        name: updatedUserResponse.name,
        email: updatedUserResponse.email,
        password: '',
        isExPlayer: updatedUserResponse.isExPlayer,
        region: updatedUserResponse.region,
        preferredPosition: updatedUserResponse.preferredPosition,
        phoneNumber: updatedUserResponse.phoneNumber,
        activityStartDate: updatedUserResponse.activityStartDate ? updatedUserResponse.activityStartDate.split('T')[0] : undefined,
        activityEndDate: updatedUserResponse.activityEndDate ? updatedUserResponse.activityEndDate.split('T')[0] : undefined,
        birthDate: updatedUserResponse.birthDate ? updatedUserResponse.birthDate.split('T')[0] : undefined,
      });

    } catch (err: any) {
      console.error("Profile update failed (handleSubmit):", err);
      if (err.response && err.response.data) {
        if (err.response.data.errors && Object.keys(err.response.data.errors).length > 0) {
          const backendErrors = err.response.data.errors;
          const errorMessages = Object.values(backendErrors).join('\n');
          setError(errorMessages);
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('프로필 업데이트 중 오류가 발생했습니다. 입력 값을 확인해주세요.');
        }
      } else {
        setError('프로필 업데이트 중 네트워크 오류 또는 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const positionOptions = ["골키퍼(GK)", "수비수(DF)", "미드필더(MF)", "공격수(FW)", "무관"];


  if (isLoading && Object.keys(formData).filter(k => k !== 'password').length === 0) { // password 제외하고 formData 비었으면 로딩
    return <div className="text-center py-20 pt-24">프로필 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <div className="mb-8">
            <h1 className="text-center text-2xl font-bold text-gray-900">
              프로필 정보 수정
            </h1>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="rounded-md bg-red-50 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">오류 발생</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul role="list" className="list-disc pl-5 space-y-1">
                        {error.split('\n').map((errMsg, idx) => <li key={idx}>{errMsg}</li>)}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {successMessage && (
              <div className="rounded-md bg-green-50 p-4 my-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-green-800">{successMessage}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
              <input type="text" name="name" id="name" autoComplete="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일 (변경 시 확인 필요)</label>
              <input type="email" name="email" id="email" autoComplete="email" value={formData.email || ''} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">새 비밀번호 (변경 시에만 입력)</label>
              <input type="password" name="password" id="password" value={formData.password || ''} onChange={handleChange} placeholder="8자 이상, 변경하지 않으려면 비워두세요" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
            </div>
            <div className="flex items-center">
              <input id="isExPlayer" name="isExPlayer" type="checkbox" checked={!!formData.isExPlayer} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="isExPlayer" className="ml-3 block text-sm font-medium text-gray-900">선수 출신 여부</label>
            </div>
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">주 활동 지역</label>
              <select id="region" name="region" value={formData.region || ''} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option value="">지역 선택 안함</option>
                {REGIONS.map((regionName) => (<option key={regionName} value={regionName}>{regionName}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="preferredPosition" className="block text-sm font-medium text-gray-700">선호 포지션</label>
              <select id="preferredPosition" name="preferredPosition" value={formData.preferredPosition || ''} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                <option value="">포지션 선택 안함</option>
                {positionOptions.map((pos) => (<option key={pos} value={pos}>{pos}</option>))}
              </select>
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">전화번호</label>
              <input type="tel" name="phoneNumber" id="phoneNumber" autoComplete="tel" value={formData.phoneNumber || ''} onChange={handleChange} placeholder="010-1234-5678" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
            </div>
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">생년월일</label>
              <input type="date" name="birthDate" id="birthDate" value={formData.birthDate || ''} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
            </div>
            <div>
              <label htmlFor="activityStartDate" className="block text-sm font-medium text-gray-700">활동 시작일</label>
              <input type="date" name="activityStartDate" id="activityStartDate" value={formData.activityStartDate || ''} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
            </div>
            <div>
              <label htmlFor="activityEndDate" className="block text-sm font-medium text-gray-700">활동 종료일 (선택)</label>
              <input type="date" name="activityEndDate" id="activityEndDate" value={formData.activityEndDate || ''} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
            </div>
            
            <div className="flex justify-end gap-3 pt-5">
              <button type="button" onClick={() => navigate('/mypage')} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                취소
              </button>
              <button type="submit" disabled={isSubmitting || isLoading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                {isSubmitting ? '저장 중...' : '저장하기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfileEditPage;