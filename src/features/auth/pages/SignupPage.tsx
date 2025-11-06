// src/features/auth/pages/SignupPage.tsx

  import React, { useState } from 'react';
  import { Link, useNavigate } from 'react-router-dom';
  import { signupApi } from '@/features/auth/api/authApi';
  import { UserSignUpRequestDto } from '@/types/user';
  import { REGIONS, REGION_DETAIL_MAP } from '@/constants/regions';

  const SignupPage = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<UserSignUpRequestDto>({
      userid: '',
      password: '',
      name: '',
      email: '',
      birthDate: '',
      region: '',
      subRegion: '',
      preferredPosition: '',
      skillLevel: '',
      isExPlayer: false,
      phoneNumber: '',
    });

    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type } = e.target;
      if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData((prev) => ({ ...prev, [name]: checked }));
      } else if (name === 'region') {
        // region 변경 시 subRegion 초기화
        setFormData((prev) => ({ ...prev, region: value, subRegion: '' }));
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
    const skillLevelOptions = [
      { value: "BEGINNER", label: "초급" },
      { value: "INTERMEDIATE", label: "중급" },
      { value: "ADVANCED", label: "고급" },
      { value: "PROFESSIONAL", label: "프로" },
    ];

    // region에 따른 subRegion 옵션
    const subRegionOptions = formData.region && REGION_DETAIL_MAP[formData.region]
      ? REGION_DETAIL_MAP[formData.region]
      : [];

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-2xl">
          <Link to="/" className="flex justify-center">
            <h2 className="mt-6 text-center text-4xl font-extrabold text-gray-900">
              ⚽ Sports Hub 회원가입
            </h2>
          </Link>
          <p className="mt-2 text-center text-sm text-gray-600">
            조기축구 매칭 플랫폼에 오신 것을 환영합니다
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-2xl">
          <div className="bg-white py-10 px-6 shadow-2xl rounded-2xl sm:px-12 border border-gray-100">
            <form className="space-y-8" onSubmit={handleSubmit}>

              {/* 기본 정보 섹션 */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="bg-indigo-100 text-indigo-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">1</span>
                    기본 정보
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="userid" className="block text-sm font-semibold text-gray-700">
                      아이디 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="userid"
                      name="userid"
                      type="text"
                      required
                      value={formData.userid}
                      onChange={handleChange}
                      placeholder="4자 이상"
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="name" className="block text-sm font-semibold text-gray-700">
                      이름 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700">
                      이메일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="example@email.com"
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-semibold text-gray-700">
                      비밀번호 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="8자 이상"
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="birthDate" className="block text-sm font-semibold text-gray-700">
                      생년월일
                    </label>
                    <input
                      id="birthDate"
                      name="birthDate"
                      type="date"
                      value={formData.birthDate}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>

                  <div>
                    <label htmlFor="phoneNumber" className="block text-sm font-semibold text-gray-700">
                      전화번호
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      placeholder="010-1234-5678"
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    />
                  </div>
                </div>
              </div>

              {/* 축구 정보 섹션 */}
              <div className="space-y-6">
                <div className="border-b border-gray-200 pb-3">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <span className="bg-green-100 text-green-600 rounded-full w-8 h-8 flex items-center justify-center mr-3 text-sm font-bold">2</span>
                    축구 정보
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label htmlFor="region" className="block text-sm font-semibold text-gray-700">
                      활동 지역
                    </label>
                    <select
                      id="region"
                      name="region"
                      value={formData.region}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    >
                      <option value="">선택</option>
                      {REGIONS.filter(r => r !== "전체 지역").map((r) => (
                        <option key={r} value={r}>{r}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="subRegion" className="block text-sm font-semibold text-gray-700">
                      세부 지역
                    </label>
                    <select
                      id="subRegion"
                      name="subRegion"
                      value={formData.subRegion}
                      onChange={handleChange}
                      disabled={!formData.region || subRegionOptions.length === 0}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition disabled:bg-gray-100         
  disabled:cursor-not-allowed"
                    >
                      <option value="">선택</option>
                      {subRegionOptions.map((sr) => (
                        <option key={sr} value={sr}>{sr}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label htmlFor="preferredPosition" className="block text-sm font-semibold text-gray-700">
                      선호 포지션
                    </label>
                    <select
                      id="preferredPosition"
                      name="preferredPosition"
                      value={formData.preferredPosition}
                      onChange={handleChange}
                      className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                    >
                      <option value="">선택</option>
                      {positionOptions.map((p) => (
                        <option key={p} value={p}>{p}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3">
                      실력 수준
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {skillLevelOptions.map((option) => (
                        <label
                          key={option.value}
                          className={`flex items-center justify-center px-4 py-3 border-2 rounded-lg cursor-pointer transition ${
                            formData.skillLevel === option.value
                              ? 'border-indigo-600 bg-indigo-50 text-indigo-700 font-semibold'
                              : 'border-gray-300 hover:border-gray-400'
                          }`}
                        >
                          <input
                            type="radio"
                            name="skillLevel"
                            value={option.value}
                            checked={formData.skillLevel === option.value}
                            onChange={handleChange}
                            className="sr-only"
                          />
                          <span className="text-sm">{option.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex items-center bg-gray-50 px-4 py-3 rounded-lg">
                  <input
                    id="isExPlayer"
                    name="isExPlayer"
                    type="checkbox"
                    checked={!!formData.isExPlayer}
                    onChange={handleChange}
                    className="h-5 w-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <label htmlFor="isExPlayer" className="ml-3 block text-sm font-medium text-gray-700">
                    ⭐ 선수 출신입니다
                  </label>
                </div>
              </div>

              {error && (
                <div className="rounded-lg bg-red-50 p-4 border border-red-200">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 
  10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-semibold text-red-800">회원가입 실패</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <ul className="list-disc pl-5 space-y-1">
                          {error.split('\n').map((errMsg, idx) => (
                            <li key={idx}>{errMsg}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-4 px-4 border border-transparent rounded-lg shadow-lg text-base font-semibold text-white bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-700 
  hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition transform hover:scale-105"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      처리 중...
                    </span>
                  ) : (
                    '가입하기'
                  )}
                </button>
              </div>
            </form>

            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-gray-500 font-medium">또는</span>
                </div>
              </div>
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-600">
                  이미 계정이 있다면{' '}
                  <Link to="/login" className="font-semibold text-indigo-600 hover:text-indigo-500 underline">
                    로그인
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  export default SignupPage;