// src/features/auth/api/authApi.ts

import axiosInstance from "@/lib/axiosInstance";
import type {
  UserSignUpRequestDto,
  UserLoginRequestDto,
  AuthResponseDto,
  UserResponseDto,
} from "@/types/user";

const API_BASE_URL = "/api/auth";

// Sign up: create account then profile
export const signupApi = async (
  userData: UserSignUpRequestDto
): Promise<any> => {
  // 1) Create account using /api/auth/register
  const registerRes = await axiosInstance.post(
    `${API_BASE_URL}/register`,
    {
      email: userData.email,
      password: userData.password,
      userid: (userData as any).userid ?? undefined,
    },
    { headers: { "Content-Type": "application/json" } }
  );

  // registerRes.data contains { account: {...}, tokens: {...} }
  const account = registerRes.data.account as { id: number };

  // 2) Create profile
  const profileBody: any = {
    accountId: account.id,
      name: userData.name,
      region: userData.region ?? undefined,
      subRegion: userData.subRegion ?? undefined,
      preferredPosition: userData.preferredPosition ?? undefined,
      skillLevel: userData.skillLevel ?? undefined,
      isExPlayer: userData.isExPlayer ?? false,
      phoneNumber: userData.phoneNumber ?? undefined,
      birthDate: userData.birthDate ?? undefined,
      height: userData.height ? parseInt(String(userData.height)) : undefined,
      weight: userData.weight ? parseInt(String(userData.weight)) : undefined,
  };
  Object.keys(profileBody).forEach(
    (k) => profileBody[k] === undefined && delete profileBody[k]
  );

  const USER_API_URL = import.meta.env.VITE_USER_API_URL || 'http://localhost:8082';
  await axiosInstance.post(`${USER_API_URL}/api/users/profiles`, profileBody, {
    headers: { "Content-Type": "application/json" },
  });

  return { accountId: account.id };
};

// Decode JWT payload (best-effort)
const decodeJwt = (token: string): any => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return {};
    const payload = parts[1];
    if (!payload) throw new Error("Invalid token");
    const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
    return JSON.parse(json);
  } catch {
    return {};
  }
};

// Login and map to AuthResponseDto
export const loginApi = async (
  credentials: UserLoginRequestDto,
  opts?: { persistRefresh?: boolean }
): Promise<AuthResponseDto & { refreshToken?: string }> => {
  const body = {
    loginId: credentials.loginId,
    password: credentials.password,
  } as const;

  const res = await axiosInstance.post(`${API_BASE_URL}/login`, body, {
    headers: { "Content-Type": "application/json" },
  });

  const { accessToken, refreshToken, account } = (res.data as any) || {};
  if (!accessToken) throw new Error("로그인 실패: 토큰 없음");

  // 백엔드 응답의 account 객체 사용
  const user: UserResponseDto = {
    id: account?.id ?? 0,
    name: account?.userid ?? "user",  // name은 프로필에서 가져옴 (일단 userid 표시)
    userid: account?.userid ?? "",
    email: account?.email ?? "",
    role: account?.role ?? "USER",
  } as UserResponseDto;

  if (opts?.persistRefresh) {
    if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
  } else {
    localStorage.removeItem("refreshToken");
  }

  return { token: accessToken, user, refreshToken } as AuthResponseDto & {
    refreshToken?: string;
  };
};
