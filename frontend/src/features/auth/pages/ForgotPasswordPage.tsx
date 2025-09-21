// src/features/auth/pages/ForgotPasswordPage.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "@/lib/axiosInstance";

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null); setError(null); setLoading(true);
    try {
      await axiosInstance.post("/api/auth/password/forgot", { email });
      setMessage("비밀번호 재설정 메일을 전송했습니다 (구현 상태에 따라 달라질 수 있습니다).");
    } catch (err: any) {
      if (err?.response?.status === 404 || err?.response?.status === 501) {
        setMessage("현재 비밀번호 찾기 API가 준비 중입니다. 관리자에게 문의해주세요.");
      } else {
        setError("요청 처리 중 오류가 발생했습니다.");
      }
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">비밀번호 찾기</h2>
      </div>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form className="space-y-6" onSubmit={onSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">이메일</label>
              <input id="email" type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} className="mt-1 w-full border rounded px-3 py-2" />
            </div>
            {message && <div className="text-sm text-green-600">{message}</div>}
            {error && <div className="text-sm text-red-600">{error}</div>}
            <button type="submit" disabled={loading} className="w-full py-2 bg-blue-600 text-white rounded">{loading ? '요청 중...' : '메일 보내기'}</button>
          </form>
          <div className="mt-4 text-center">
            <Link to="/login" className="text-sm text-blue-600">로그인으로 돌아가기</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;

