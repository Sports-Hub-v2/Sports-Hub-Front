// src/features/auth/components/LoginForm.tsx

import { useEffect, useState } from "react";
import { loginApi } from "../api/authApi";
import { useAuthStore } from "@/stores/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import type { UserLoginRequestDto, AuthResponseDto } from "@/types/user";

const LoginForm = () => {
  const [emailOrId, setEmailOrId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberEmail, setRememberEmail] = useState(false);
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const { login } = useAuthStore();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const enabled = localStorage.getItem("rememberEmailEnabled") === "true";
    const saved = localStorage.getItem("rememberEmail") ?? "";
    if (enabled && saved) {
      setEmailOrId(saved);
      setRememberEmail(true);
    }
    const keep = localStorage.getItem("keepLoggedIn") === "true";
    if (keep) setKeepLoggedIn(true);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    if (!emailOrId || !password) {
      setError("이메일과 비밀번호를 모두 입력해 주세요.");
      setIsLoading(false);
      return;
    }

    try {
      const credentials: UserLoginRequestDto = { loginId: emailOrId, password };
      const authResponse: AuthResponseDto = await loginApi(credentials, { persistRefresh: keepLoggedIn });
      const { token, user } = authResponse;
      login(token, user);
      if (rememberEmail) {
        localStorage.setItem("rememberEmailEnabled", "true");
        localStorage.setItem("rememberEmail", emailOrId);
      } else {
        localStorage.removeItem("rememberEmailEnabled");
        localStorage.removeItem("rememberEmail");
      }
      localStorage.setItem("keepLoggedIn", keepLoggedIn ? "true" : "false");
      navigate("/");
    } catch (err: any) {
      if (err?.response?.data) {
        const d = err.response.data;
        if (d.errors && Object.keys(d.errors).length > 0) {
          setError(Object.values(d.errors).join("\n"));
        } else if (d.message) {
          setError(d.message);
        } else {
          setError("이메일 또는 비밀번호가 올바르지 않습니다.");
        }
      } else {
        setError("로그인 중 오류가 발생했습니다. 네트워크를 확인해 주세요.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm p-4 md:p-0">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-lg px-8 pt-6 pb-8 mb-4">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-800">Sport-Hub 로그인</h1>
          <p className="text-gray-500 mt-2">계정으로 로그인하세요.</p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-100 border border-red-400 text-red-700 text-sm rounded-md" role="alert">
            <p className="font-bold">오류</p>
            {error.split("\n").map((msg, idx) => (
              <p key={idx}>{msg}</p>
            ))}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="emailOrId">
            이메일
          </label>
          <input
            id="emailOrId"
            name="emailOrId"
            className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="email"
            value={emailOrId}
            onChange={(e) => setEmailOrId(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-semibold mb-2" htmlFor="password">
            비밀번호
          </label>
          <input
            id="password"
            name="password"
            className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 mb-3 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="비밀번호를 입력하세요"
            required
          />
        </div>

        <div className="mb-3 flex items-center justify-between">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              checked={rememberEmail}
              onChange={(e) => setRememberEmail(e.target.checked)}
            />
            아이디 저장
          </label>
          <Link to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-500">
            비밀번호 찾기
          </Link>
        </div>

        <div className="mb-6">
          <label className="inline-flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              checked={keepLoggedIn}
              onChange={(e) => setKeepLoggedIn(e.target.checked)}
            />
            로그인 상태 유지
          </label>
        </div>

        <div className="flex flex-col items-center justify-between gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 transition-colors duration-150"
          >
            {isLoading ? "로그인 중..." : "로그인"}
          </button>
          <p className="text-center text-sm text-gray-600">
            아직 계정이 없나요?{" "}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              회원가입
            </Link>
          </p>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200" /></div>
            <div className="relative flex justify-center text-xs uppercase text-gray-500">
              <span className="px-2 bg-white">소셜 로그인</span>
            </div>
          </div>
          <div className="mt-6 grid grid-cols-1 gap-3">
            {/* Google */}
            <button
              type="button"
              aria-label="구글 계정으로 로그인"
              onClick={() => { window.location.href = "/oauth2/authorization/google"; }}
              className="w-full bg-white border border-gray-300 hover:shadow-sm text-[#3c4043] font-medium py-2 px-4 rounded flex items-center justify-center gap-3"
            >
              <span className="inline-flex">
                <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
                  <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303C33.492 32.951 29.062 36 24 36c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.843 1.154 7.961 3.039l5.657-5.657C34.676 6.053 29.574 4 24 4 12.954 4 4 12.954 4 24s8.954 20 20 20 20-8.954 20-20c0-1.341-.138-2.651-.389-3.917z"/>
                  <path fill="#FF3D00" d="M6.306 14.691l6.571 4.819C14.094 16.23 18.676 12 24 12c3.059 0 5.843 1.154 7.961 3.039l5.657-5.657C34.676 6.053 29.574 4 24 4c-7.797 0-14.426 4.419-17.694 10.691z"/>
                  <path fill="#4CAF50" d="M24 44c5.409 0 10.335-2.074 14.067-5.444l-6.483-5.487C29.515 34.964 26.866 36 24 36c-5.032 0-9.453-3.03-11.327-7.353l-6.55 5.046C9.356 39.556 16.178 44 24 44z"/>
                  <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-1.093 3.163-3.48 5.662-6.555 6.917l6.483 5.487C38.9 37.292 44 31.5 44 24c0-1.341-.138-2.651-.389-3.917z"/>
                </svg>
              </span>
              <span>Google로 계속하기</span>
            </button>

            {/* Naver */}
            <button
              type="button"
              aria-label="네이버 계정으로 로그인"
              onClick={() => { window.location.href = "/oauth2/authorization/naver"; }}
              className="w-full bg-[#03C75A] hover:brightness-105 text-white font-medium py-2 px-4 rounded flex items-center justify-center gap-3"
            >
              <span className="inline-flex">
                <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
                  <rect width="24" height="24" rx="4" fill="#03C75A"/>
                  <path fill="#fff" d="M6 6h3l5 7V6h4v12h-3l-5-7v7H6z"/>
                </svg>
              </span>
              <span>네이버로 계속하기</span>
            </button>
          </div>
        </div>
      </form>
      <p className="text-center text-xs text-gray-500">&copy;{new Date().getFullYear()} Sport-Hub</p>
    </div>
  );
};

export default LoginForm;
