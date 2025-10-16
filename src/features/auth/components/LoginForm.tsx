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
      setError("이메일/아이디와 비밀번호를 모두 입력해 주세요.");
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
          setError("이메일/아이디 또는 비밀번호가 올바르지 않습니다.");
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
            이메일 또는 아이디
          </label>
          <input
            id="emailOrId"
            name="emailOrId"
            className="shadow-sm appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            type="text"
            value={emailOrId}
            onChange={(e) => setEmailOrId(e.target.value)}
            placeholder="you@example.com 또는 아이디"
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
            {isLoading ? "로그인 중.." : "로그인"}
          </button>
          <p className="text-center text-sm text-gray-600">
            아직 계정이 없나요?{" "}
            <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
              회원가입
            </Link>
          </p>
        </div>
      </form>
      <p className="text-center text-xs text-gray-500">&copy;{new Date().getFullYear()} Sport-Hub</p>
    </div>
  );
};

export default LoginForm;

