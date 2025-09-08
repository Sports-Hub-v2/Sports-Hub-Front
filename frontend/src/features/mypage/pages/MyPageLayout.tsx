// src/features/myPage/pages/MyPageLayout.tsx

import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';

const MyPageLayout: React.FC = () => {
  const getNavLinkClass = ({ isActive }: { isActive: boolean }) => {
    const base = "block w-full text-left px-4 py-3 rounded-md transition-colors";
    return isActive ? `${base} bg-blue-500 text-white font-semibold` : `${base} hover:bg-gray-100`;
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 pt-24">
      <h1 className="text-3xl font-bold mb-8">마이페이지</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <aside className="md:col-span-1">
          <nav className="space-y-2">
            <NavLink to="/mypage" end className={getNavLinkClass}>기본 정보</NavLink>
            <NavLink to="/mypage/teams" className={getNavLinkClass}>내 팀 목록</NavLink>
            <NavLink to="/mypage/posts" className={getNavLinkClass}>내 글 목록</NavLink>
            <NavLink to="/mypage/applications" className={getNavLinkClass}>신청 내역</NavLink>
          </nav>
        </aside>

        <main className="md:col-span-3 bg-white p-6 rounded-lg shadow-md">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MyPageLayout;
