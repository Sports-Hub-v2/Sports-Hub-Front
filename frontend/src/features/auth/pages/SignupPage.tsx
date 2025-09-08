// src/features/auth/pages/SignupPage.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signupApi } from '@/features/auth/api/authApi';
import { UserSignUpRequestDto } from '@/types/user';
import { REGIONS } from '@/constants/regions';

const SignupPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<UserSignUpRequestDto>({
    userid: '',
    password: '',
    name: '',
    email: '',
    isExPlayer: false,
    region: '',
    preferredPosition: '',
    phoneNumber: '',
  });

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    if (!formData.userid || !formData.password || !formData.name || !formData.email) {
      setError('아이디, 비밀번호, 이름, 이메일은 필수입니다.');
      setIsLoading(false);
      return;
    }

    try {
      await signupApi({ ...formData });
      alert('회원가입이 완료되었습니다. 로그인 페이지로 이동합니다.');
      navigate('/login');
    } catch (err: any) {
      if (err.response && err.response.data) {
        if (err.response.data.errors) {
          const backendErrors = err.response.data.errors;
          const errorMessages = Object.values(backendErrors).join('\n');
          setError(errorMessages);
        } else if (err.response.data.message) {
          setError(err.response.data.message);
        } else {
          setError('회원가입 중 오류가 발생했습니다. 서버 응답을 확인해 주세요.');
        }
      } else {
        setError('회원가입 중 네트워크 오류 또는 알 수 없는 오류가 발생했습니다.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const positionOptions = ["GK", "DF", "MF", "FW", "무관"];

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">회원가입</h2>
        </Link>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="userid" className="block text-sm font-medium text-gray-700">아이디 <span className="text-red-500">*</span></label>
              <div className="mt-1"><input id="userid" name="userid" type="text" required value={formData.userid} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" /></div>
            </div>
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">이름 <span className="text-red-500">*</span></label>
              <div className="mt-1"><input id="name" name="name" type="text" required value={formData.name} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" /></div>
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일 <span className="text-red-500">*</span></label>
              <div className="mt-1"><input id="email" name="email" type="email" required value={formData.email} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" /></div>
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">비밀번호 <span className="text-red-500">*</span></label>
              <div className="mt-1"><input id="password" name="password" type="password" required value={formData.password} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" /></div>
            </div>
            <div>
              <label htmlFor="region" className="block text-sm font-medium text-gray-700">활동 지역</label>
              <div className="mt-1">
                <select id="region" name="region" value={formData.region} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="">선택</option>
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label htmlFor="preferredPosition" className="block text-sm font-medium text-gray-700">선호 포지션</label>
              <div className="mt-1">
                <select id="preferredPosition" name="preferredPosition" value={formData.preferredPosition} onChange={handleChange} className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm">
                  <option value="">선택</option>
                  {positionOptions.map((p) => (
                    <option key={p} value={p}>{p}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center">
              <input id="isExPlayer" name="isExPlayer" type="checkbox" checked={!!formData.isExPlayer} onChange={handleChange} className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
              <label htmlFor="isExPlayer" className="ml-2 block text-sm text-gray-700">선수 출신</label>
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">전화번호 (선택)</label>
              <div className="mt-1"><input id="phoneNumber" name="phoneNumber" type="tel" value={formData.phoneNumber} onChange={handleChange} placeholder="010-1234-5678" className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" /></div>
            </div>

            {error && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">회원가입 실패</h3>
                    <div className="mt-2 text-sm text-red-700">
                      <ul role="list" className="list-disc pl-5 space-y-1">{error.split('\n').map((errMsg, idx) => <li key={idx}>{errMsg}</li>)}</ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div>
              <button type="submit" disabled={isLoading} className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                {isLoading ? '처리 중...' : '가입하기'}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-300" /></div>
              <div className="relative flex justify-center text-sm"><span className="px-2 bg-white text-gray-500">또는</span></div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-sm text-gray-600">이미 계정이 있다면{' '}<Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">로그인</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

