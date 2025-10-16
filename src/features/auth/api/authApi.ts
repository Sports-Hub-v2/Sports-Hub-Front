﻿// src/features/auth/api/authApi.ts

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
  // 1) Create account (userid optional)
  const accountRes = await axiosInstance.post(
    `${API_BASE_URL}/accounts`,
    {
      email: userData.email,
      password: userData.password,
      role: "USER",
      userid: (userData as any).userid ?? undefined,
    },
    { headers: { "Content-Type": "application/json" } }
  );
  const account = accountRes.data as { id: number };

  // 2) Create profile
  const profileBody: any = {
    accountId: account.id,
    name: userData.name,
    region: userData.region ?? undefined,
    preferredPosition: userData.preferredPosition ?? undefined,
    isExPlayer:
      typeof userData.isExPlayer === "boolean"
        ? String(userData.isExPlayer)
        : undefined,
    phoneNumber: userData.phoneNumber ?? undefined,
  };
  Object.keys(profileBody).forEach(
    (k) => profileBody[k] === undefined && delete profileBody[k]
  );

  await axiosInstance.post(`/api/users/profiles`, profileBody, {
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

  const { accessToken, refreshToken } = (res.data as any) || {};
  if (!accessToken) throw new Error("로그인 실패: 토큰 없음");

  const claims = decodeJwt(accessToken);
  const user: UserResponseDto = {
    id: Number(claims.accountId ?? 0),
    name:
      typeof claims.email === "string" && (claims.email as string).includes("@")
        ? (claims.email as string).split("@")[0]
        : "user",
    userid: (claims.userid as string) ?? "",
    email: (claims.email as string) ?? "",
    role: (claims.role as string) ?? "USER",
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
