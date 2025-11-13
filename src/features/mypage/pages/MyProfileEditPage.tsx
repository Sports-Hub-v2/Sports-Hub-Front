// src/features/mypage/pages/MyProfileEditPage.tsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import axiosInstance from '@/lib/axiosInstance';
import { UserResponseDto, UserProfileUpdateDto } from '@/types/user';
import { REGIONS } from '@/constants/regions';

// Real API caller for profile update
const updateUserProfileApi = async (data: UserProfileUpdateDto): Promise<UserResponseDto> => {
  const { user } = useAuthStore.getState();
  const profileId = user?.profileId;
  if (!profileId) throw new Error('프로필 ID가 없습니다. 로그인 후 다시 시도하세요.');

  const body: any = { ...data };
  if (typeof body.isExPlayer === 'boolean') body.isExPlayer = String(body.isExPlayer);
  delete body.password;

  const res = await axiosInstance.patch(`http://localhost:8082/api/users/profiles/${profileId}`, body, {
    headers: { 'Content-Type': 'application/json' },
  });

  // Merge response profile back to store user shape
  const prof = res.data as any;
  const current = useAuthStore.getState().user as any;
  const updated: UserResponseDto = {
    ...(current || {}),
    id: current?.id ?? 0,
    userid: current?.userid ?? '',
    email: current?.email ?? '',
    name: prof?.name ?? current?.name,
    region: prof?.region ?? current?.region,
    preferredPosition: prof?.preferredPosition ?? current?.preferredPosition,
    isExPlayer: typeof prof?.isExPlayer === 'string' ? prof.isExPlayer.toLowerCase() === 'true' : (current?.isExPlayer as any),
    phoneNumber: prof?.phoneNumber ?? current?.phoneNumber,
    activityStartDate: prof?.activityStartDate ?? current?.activityStartDate,
    activityEndDate: prof?.activityEndDate ?? current?.activityEndDate,
    birthDate: prof?.birthDate ?? current?.birthDate,
    createdAt: current?.createdAt,
    updatedAt: new Date().toISOString(),
    role: current?.role ?? 'USER',
  } as UserResponseDto;
  return updated;
};

const MyProfileEditPage: React.FC = () => {
  const navigate = useNavigate();
  const { user: authUserInStore, token, login: updateUserInStoreState } = useAuthStore();

  const [formData, setFormData] = useState<Partial<UserProfileUpdateDto>>({
    name: '',
    email: '',
    password: '',
    isExPlayer: false,
    region: '',
    preferredPosition: '',
    phoneNumber: '',
    activityStartDate: undefined,
    activityEndDate: undefined,
    birthDate: undefined,
    height: undefined,
    weight: undefined,
    bio: '',
    profileImageUrl: '',
    dominantFoot: '',
    careerYears: undefined,
    playStyle: '',
    instagramUrl: '',
    facebookUrl: '',
    preferredTimeSlots: '',
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
        const current = authUserInStore;
        setFormData({
          name: current.name,
          email: current.email,
          password: '',
          isExPlayer: current.isExPlayer,
          region: current.region,
          preferredPosition: current.preferredPosition,
          phoneNumber: current.phoneNumber,
          activityStartDate: current.activityStartDate ? current.activityStartDate.split('T')[0] : undefined,
          activityEndDate: current.activityEndDate ? current.activityEndDate.split('T')[0] : undefined,
          birthDate: current.birthDate ? current.birthDate.split('T')[0] : undefined,
          height: current.height,
          weight: current.weight,
          bio: current.bio,
          profileImageUrl: current.profileImageUrl,
          dominantFoot: current.dominantFoot,
          careerYears: current.careerYears,
          playStyle: current.playStyle,
          instagramUrl: current.instagramUrl,
          facebookUrl: current.facebookUrl,
          preferredTimeSlots: current.preferredTimeSlots,
        });
      } catch (e) {
        setError('프로필 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.');
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
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value === '' ? undefined : value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccessMessage(null);

    const updatePayload: UserProfileUpdateDto = {} as any;

    if (formData.name !== authUserInStore?.name) updatePayload.name = formData.name;
    if (formData.email !== authUserInStore?.email) updatePayload.email = formData.email;

    if (formData.password && formData.password.length > 0) {
      if (formData.password.length < 8) {
        setError('비밀번호는 8자 이상이어야 합니다.');
        setIsSubmitting(false);
        return;
      }
      updatePayload.password = formData.password;
    }

    if (formData.isExPlayer !== authUserInStore?.isExPlayer) updatePayload.isExPlayer = formData.isExPlayer;
    if (formData.region !== authUserInStore?.region) updatePayload.region = formData.region || undefined;
    if (formData.preferredPosition !== authUserInStore?.preferredPosition) updatePayload.preferredPosition = formData.preferredPosition || undefined;
    if (formData.phoneNumber !== authUserInStore?.phoneNumber) updatePayload.phoneNumber = formData.phoneNumber || undefined;

    const pick = (v?: string) => v || undefined;
    if (pick(formData.activityStartDate) !== authUserInStore?.activityStartDate?.split('T')[0]) updatePayload.activityStartDate = pick(formData.activityStartDate);
    if (pick(formData.activityEndDate) !== authUserInStore?.activityEndDate?.split('T')[0]) updatePayload.activityEndDate = pick(formData.activityEndDate);
    if (pick(formData.birthDate) !== authUserInStore?.birthDate?.split('T')[0]) updatePayload.birthDate = pick(formData.birthDate);

    // 새로운 필드 체크
    if (formData.height !== authUserInStore?.height) updatePayload.height = formData.height;
    if (formData.weight !== authUserInStore?.weight) updatePayload.weight = formData.weight;
    if (formData.bio !== authUserInStore?.bio) updatePayload.bio = formData.bio || undefined;
    if (formData.profileImageUrl !== authUserInStore?.profileImageUrl) updatePayload.profileImageUrl = formData.profileImageUrl || undefined;
    if (formData.dominantFoot !== authUserInStore?.dominantFoot) updatePayload.dominantFoot = formData.dominantFoot || undefined;
    if (formData.careerYears !== authUserInStore?.careerYears) updatePayload.careerYears = formData.careerYears;
    if (formData.playStyle !== authUserInStore?.playStyle) updatePayload.playStyle = formData.playStyle || undefined;
    if (formData.instagramUrl !== authUserInStore?.instagramUrl) updatePayload.instagramUrl = formData.instagramUrl || undefined;
    if (formData.facebookUrl !== authUserInStore?.facebookUrl) updatePayload.facebookUrl = formData.facebookUrl || undefined;
    if (formData.preferredTimeSlots !== authUserInStore?.preferredTimeSlots) updatePayload.preferredTimeSlots = formData.preferredTimeSlots || undefined;

    if (Object.keys(updatePayload).length === 0) {
      setSuccessMessage('변경된 사항이 없습니다.');
      setIsSubmitting(false);
      return;
    }

    try {
      const updatedUserResponse = await updateUserProfileApi(updatePayload);
      if (token) updateUserInStoreState(token, updatedUserResponse);
      setSuccessMessage('프로필이 성공적으로 업데이트되었습니다.');
    } catch (e: any) {
      setError(e?.response?.data?.message || '프로필 업데이트 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const positionOptions = ['GK', 'DF', 'MF', 'FW', '기타'];
  const dominantFootOptions = [
    { value: '', label: '선택 안함' },
    { value: 'RIGHT', label: '오른발' },
    { value: 'LEFT', label: '왼발' },
    { value: 'BOTH', label: '양발' },
  ];
  const playStyleOptions = [
    { value: '', label: '선택 안함' },
    { value: 'OFFENSIVE', label: '공격적' },
    { value: 'DEFENSIVE', label: '수비적' },
    { value: 'BALANCED', label: '밸런스' },
    { value: 'TECHNICAL', label: '기술형' },
    { value: 'PHYSICAL', label: '피지컬형' },
  ];
  const timeSlotOptions = [
    { value: '', label: '선택 안함' },
    { value: 'WEEKDAY_MORNING', label: '평일 오전' },
    { value: 'WEEKDAY_AFTERNOON', label: '평일 오후' },
    { value: 'WEEKDAY_EVENING', label: '평일 저녁' },
    { value: 'WEEKEND_MORNING', label: '주말 오전' },
    { value: 'WEEKEND_AFTERNOON', label: '주말 오후' },
    { value: 'WEEKEND_EVENING', label: '주말 저녁' },
  ];

  if (isLoading) {
    return <div className="text-center py-20 pt-24">프로필 정보를 불러오는 중입니다...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8 pt-24">
      <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-lg sm:px-10">
          <div className="mb-8">
            <h1 className="text-center text-2xl font-bold text-gray-900">프로필 정보 수정</h1>
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

            <div className="grid grid-cols-1 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름</label>
                <input type="text" name="name" id="name" autoComplete="name" value={formData.name || ''} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일 (변경 시 확인 필요)</label>
                <input type="email" name="email" id="email" autoComplete="email" value={formData.email || ''} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
              </div>
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">새 비밀번호 (변경할 때만 입력)</label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  value={formData.password || ''}
                  onChange={handleChange}
                  placeholder="8자 이상, 변경하지 않으면 비워두세요"
                  className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"
                />
              </div>
              <div className="flex items-center">
                <input id="isExPlayer" name="isExPlayer" type="checkbox" checked={!!formData.isExPlayer} onChange={handleChange} className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
                <label htmlFor="isExPlayer" className="ml-3 block text-sm font-medium text-gray-900">선수 출신 여부</label>
              </div>
              <div>
                <label htmlFor="region" className="block text-sm font-medium text-gray-700">활동 지역</label>
                <select id="region" name="region" value={formData.region || ''} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option value="">지역 선택</option>
                  {REGIONS.map((regionName) => (<option key={regionName} value={regionName}>{regionName}</option>))}
                </select>
              </div>
              <div>
                <label htmlFor="preferredPosition" className="block text-sm font-medium text-gray-700">선호 포지션</label>
                <select id="preferredPosition" name="preferredPosition" value={formData.preferredPosition || ''} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  <option value="">포지션 선택</option>
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
                <label htmlFor="activityEndDate" className="block text-sm font-medium text-gray-700">활동 종료일(선택)</label>
                <input type="date" name="activityEndDate" id="activityEndDate" value={formData.activityEndDate || ''} onChange={handleChange} className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
              </div>

              {/* 신체 정보 섹션 */}
              <div className="col-span-full border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">신체 정보</h3>
              </div>
              <div>
                <label htmlFor="height" className="block text-sm font-medium text-gray-700">키 (cm)</label>
                <input type="number" name="height" id="height" value={formData.height || ''} onChange={handleChange} placeholder="예: 175" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
              </div>
              <div>
                <label htmlFor="weight" className="block text-sm font-medium text-gray-700">몸무게 (kg)</label>
                <input type="number" name="weight" id="weight" value={formData.weight || ''} onChange={handleChange} placeholder="예: 70" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
              </div>

              {/* 축구 정보 섹션 */}
              <div className="col-span-full border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">축구 정보</h3>
              </div>
              <div>
                <label htmlFor="dominantFoot" className="block text-sm font-medium text-gray-700">주발</label>
                <select id="dominantFoot" name="dominantFoot" value={formData.dominantFoot || ''} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  {dominantFootOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              </div>
              <div>
                <label htmlFor="careerYears" className="block text-sm font-medium text-gray-700">축구 경력 (년)</label>
                <input type="number" name="careerYears" id="careerYears" value={formData.careerYears || ''} onChange={handleChange} placeholder="예: 5" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
              </div>
              <div>
                <label htmlFor="playStyle" className="block text-sm font-medium text-gray-700">플레이 스타일</label>
                <select id="playStyle" name="playStyle" value={formData.playStyle || ''} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  {playStyleOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              </div>
              <div>
                <label htmlFor="preferredTimeSlots" className="block text-sm font-medium text-gray-700">선호 시간대</label>
                <select id="preferredTimeSlots" name="preferredTimeSlots" value={formData.preferredTimeSlots || ''} onChange={handleChange} className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                  {timeSlotOptions.map((opt) => (<option key={opt.value} value={opt.value}>{opt.label}</option>))}
                </select>
              </div>

              {/* 자기소개 */}
              <div className="col-span-full">
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">자기소개</label>
                <textarea name="bio" id="bio" rows={4} value={formData.bio || ''} onChange={handleChange} placeholder="자신을 소개해주세요..." className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
              </div>

              {/* SNS 정보 섹션 */}
              <div className="col-span-full border-t pt-6 mt-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">SNS 정보</h3>
              </div>
              <div>
                <label htmlFor="instagramUrl" className="block text-sm font-medium text-gray-700">인스타그램</label>
                <input type="url" name="instagramUrl" id="instagramUrl" value={formData.instagramUrl || ''} onChange={handleChange} placeholder="https://instagram.com/username" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
              </div>
              <div>
                <label htmlFor="facebookUrl" className="block text-sm font-medium text-gray-700">페이스북</label>
                <input type="url" name="facebookUrl" id="facebookUrl" value={formData.facebookUrl || ''} onChange={handleChange} placeholder="https://facebook.com/username" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
              </div>

              {/* 프로필 이미지 */}
              <div className="col-span-full">
                <label htmlFor="profileImageUrl" className="block text-sm font-medium text-gray-700">프로필 이미지 URL</label>
                <input type="url" name="profileImageUrl" id="profileImageUrl" value={formData.profileImageUrl || ''} onChange={handleChange} placeholder="https://example.com/image.jpg" className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md p-2"/>
                {formData.profileImageUrl && (
                  <div className="mt-2">
                    <img src={formData.profileImageUrl} alt="프로필 미리보기" className="w-24 h-24 rounded-full object-cover border-2 border-gray-300" onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-5 col-span-full">
                <button type="button" onClick={() => navigate('/mypage')} className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  취소
                </button>
                <button type="submit" disabled={isSubmitting || isLoading} className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                  {isSubmitting ? '저장 중...' : '저장하기'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MyProfileEditPage;

