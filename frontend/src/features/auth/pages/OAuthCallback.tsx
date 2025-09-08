// src/features/auth/pages/OAuthCallback.tsx

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import type { UserResponseDto } from '@/types/user';

const decodeJwt = (token: string): any => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return {};
    const payload = parts[1];
    const json = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(json);
  } catch {
    return {};
  }
};

const OAuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const accessToken = params.get('token');
    const refreshToken = params.get('refreshToken');
    if (!accessToken) {
      navigate('/login', { replace: true });
      return;
    }

    const claims = decodeJwt(accessToken);
    const user: UserResponseDto = {
      id: Number(claims.accountId ?? 0),
      name: (claims.email?.split('@')[0] as string) ?? '사용자',
      email: claims.email ?? '',
      userid: claims.email ?? '',
      role: claims.role ?? 'USER',
    } as UserResponseDto;

    if (refreshToken) {
      localStorage.setItem('refreshToken', refreshToken);
    }
    login(accessToken, user);
    navigate('/', { replace: true });
  }, [login, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center text-gray-700">
      소셜 로그인 처리 중...
    </div>
  );
};

export default OAuthCallback;

