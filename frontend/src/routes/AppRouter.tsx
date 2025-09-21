// src/routes/AppRouter.tsx

import { BrowserRouter, Routes, Route } from "react-router-dom";

// Layout
import Layout from "@/components/layout/AppLayout";

// Main Pages
import HomePage from "@/features/home/pages/HomePage";
import MercenaryPage from "@/features/mercenary/pages/MercenaryPage";
import TeamPage from "@/features/team/pages/TeamPage";
import MatchPage from "@/features/match/pages/MatchPage";

// Auth Pages
import LoginPage from "@/features/auth/pages/LoginPage";
import SignupPage from "@/features/auth/pages/SignupPage";
import OAuthCallback from "@/features/auth/pages/OAuthCallback";
import ForgotPasswordPage from "@/features/auth/pages/ForgotPasswordPage";
import AdminWorkspace from "@/features/admin/pages/AdminWorkspace";

// Team Detail Page
import TeamDetailPage from "@/features/team/pages/TeamDetailPage";
// Team-Manage Pages
import TeamManagePage from "@/features/team-manage/pages/TeamManagePage";

// MyPage (Nested)
import MyPageLayout from "@/features/mypage/pages/MyPageLayout";
import MyProfileInfo from "@/features/mypage/components/MyProfileInfo";
import UserTeamList from "@/features/mypage/components/UserTeamList";
import MyPost from "@/features/mypage/components/MyPost";
import MyApplicationPage from "@/features/mypage/components/MyApplicationPage";
import MyNotifications from "@/features/mypage/components/MyNotifications";
import MercenaryApplyPage from "@/features/mercenary/pages/MercenaryApplyPage.tsx";

// Fallback Page
const NotFound = () => (
  <div className="text-xl p-8 pt-24">404 | Page Not Found</div>
);

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* 루트 레이아웃 하위에 들어가는 경로들 정의 */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="mercenary" element={<MercenaryPage />} />
          <Route path="mercenary/apply/:id" element={<MercenaryApplyPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="match" element={<MatchPage />} />
          <Route path="teams/:id" element={<TeamDetailPage />} />
          <Route path="team-manage" element={<TeamManagePage />} />

          {/* 마이페이지 (중첩) */}
          <Route path="mypage" element={<MyPageLayout />}>
            <Route index element={<MyProfileInfo />} />
            <Route path="notifications" element={<MyNotifications />} />
            <Route path="teams" element={<UserTeamList />} />
            <Route path="posts" element={<MyPost />} />
            <Route path="applications" element={<MyApplicationPage />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* 관리자 프리뷰 */}
        <Route path="/admin-preview" element={<AdminWorkspace />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
