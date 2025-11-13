// src/stores/useAuthStore.ts

import { create } from "zustand";
import type { UserResponseDto } from "@/types/user";

interface StoreUser {
  id: number;
  profileId?: number; // 異붽?
  name: string;
  userid: string;
  email?: string;
  region?: string;
  preferredPosition?: string;
  role?: string;
  isExPlayer?: boolean;
  phoneNumber?: string;
  activityStartDate?: string;
  activityEndDate?: string;
  birthDate?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface AuthState {
  token: string | null;
  user: StoreUser | null;
  isLoggedIn: boolean;
  keepLoggedIn: boolean;
  login: (token: string, userData: UserResponseDto) => void;
  logout: () => void;
  setKeepLoggedIn: (on: boolean) => void;
  restoreSession: () => Promise<void>;
}

const storedToken = localStorage.getItem("token");
const storedUserJson = localStorage.getItem("user");
let parsedUser: StoreUser | null = null;

if (storedUserJson && storedUserJson !== "undefined") {
  try {
    const tempParsedUser = JSON.parse(storedUserJson);
    if (
      tempParsedUser &&
      typeof tempParsedUser.id === "number" &&
      typeof tempParsedUser.userid === "string"
    ) {
      parsedUser = tempParsedUser as StoreUser;
    } else {
      localStorage.removeItem("user");
    }
  } catch (e) {
    console.error(
      "Failed to parse user from localStorage during store initialization",
      e
    );
    localStorage.removeItem("user");
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  token: storedToken ?? null,
  user: parsedUser,
  isLoggedIn: !!storedToken && !!parsedUser,
  keepLoggedIn: localStorage.getItem("keepLoggedIn") === "true",

  login: (token, userData) => {
    const userToStore: StoreUser = {
      id: userData.id,
      name: userData.name,
      userid: userData.userid,
      email: userData.email,
      region: userData.region,
      preferredPosition: userData.preferredPosition,
      role: userData.role,
      isExPlayer: userData.isExPlayer,
      phoneNumber: userData.phoneNumber,
      activityStartDate: userData.activityStartDate,
      activityEndDate: userData.activityEndDate,
      birthDate: userData.birthDate,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt,
    };
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(userToStore));
    set({ token, user: userToStore, isLoggedIn: true });

    // Fetch profile by accountId to attach profileId and name
    const accountId = userToStore.id;
    fetch(`http://localhost:8082/api/users/profiles/by-account/${accountId}`)
      .then(async (res) => (res.ok ? ((await res.json()) as any) : null))
      .then((prof) => {
        if (prof && typeof prof.id === "number") {
          const current = JSON.parse(localStorage.getItem("user") || "null") as any;
          const nextUser = {
            ...(current ?? userToStore),
            profileId: prof.id,
            name: prof.name || userToStore.name,  // 프로필에서 실제 이름 가져오기
            region: prof.region,
            preferredPosition: prof.preferredPosition,
            phoneNumber: prof.phoneNumber
          };
          localStorage.setItem("user", JSON.stringify(nextUser));
          set({ user: nextUser });
        }
      })
      .catch(() => {});
  },

  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("refreshToken");
    set({ token: null, user: null, isLoggedIn: false });
  },

  setKeepLoggedIn: (on: boolean) => {
    localStorage.setItem("keepLoggedIn", on ? "true" : "false");
    set({ keepLoggedIn: on });
  },

  restoreSession: async () => {
    const hasToken = !!localStorage.getItem("token");
    const keep = localStorage.getItem("keepLoggedIn") === "true";
    const refresh = localStorage.getItem("refreshToken");
    if (hasToken || !keep || !refresh) return;
    try {
      const res = await fetch("/api/auth/token/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refresh }),
      });
      if (!res.ok) return;
      const data = await res.json();
      const accessToken = data?.accessToken as string | undefined;
      const refreshToken = data?.refreshToken as string | undefined;
      if (!accessToken) return;
      localStorage.setItem("token", accessToken);
      if (refreshToken) localStorage.setItem("refreshToken", refreshToken);
      // derive minimal user from JWT
      const parts = accessToken.split(".");
      if (parts.length !== 3) return;
      const payload = parts[1];
      if (!payload) return;
      const json = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
      const claims = JSON.parse(json || "{}");
      const userToStore: StoreUser = {
        id: Number((claims as any).accountId ?? 0),
        name:
          typeof (claims as any).email === "string" && (claims as any).email.includes("@")
            ? ((claims as any).email as string).split("@")[0]
            : "user",
        userid: ((claims as any).userid as string) ?? "",
        email: ((claims as any).email as string) ?? "",
        role: ((claims as any).role as string) ?? "USER",
      } as StoreUser;
      set({ token: accessToken, user: userToStore, isLoggedIn: true });

      // Attach profileId and name in background
      try {
        const res2 = await fetch(`http://localhost:8082/api/users/profiles/by-account/${userToStore.id}`);
        if (res2.ok) {
          const prof: any = await res2.json();
          if (prof && typeof prof.id === "number") {
            const nextUser = {
              ...userToStore,
              profileId: prof.id,
              name: prof.name || userToStore.name,
              region: prof.region,
              preferredPosition: prof.preferredPosition,
              phoneNumber: prof.phoneNumber
            } as StoreUser;
            localStorage.setItem("user", JSON.stringify(nextUser));
            set({ user: nextUser });
          }
        }
      } catch {}
    } catch (e) {
      // ignore
    }
  },
}));

// Ensure profileId is present in store/localStorage after reload
if (typeof window !== 'undefined') {
  (async () => {
    try {
      const raw = localStorage.getItem('user');
      const u = raw ? (JSON.parse(raw) as any) : null;
      if (u && !u.profileId && typeof u.id === 'number') {
        const res = await fetch(`http://localhost:8082/api/users/profiles/by-account/${u.id}`);
        if (res.ok) {
          const prof: any = await res.json();
          if (prof && typeof prof.id === 'number') {
            const nextUser = {
              ...u,
              profileId: prof.id,
              name: prof.name || u.name,
              region: prof.region,
              preferredPosition: prof.preferredPosition,
              phoneNumber: prof.phoneNumber
            };
            localStorage.setItem('user', JSON.stringify(nextUser));
            // Zustand direct set
            (useAuthStore as any).setState({ user: nextUser });
          }
        }
      }
    } catch {}
  })();
}
