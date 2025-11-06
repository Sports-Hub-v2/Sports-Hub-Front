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

// Admin Pages
import DashboardPage from "@/features/admin/pages/DashboardPage";
import MatchesPage from "@/features/admin/pages/MatchesPage";
import UsersPage from "@/features/admin/pages/UsersPage";
import TeamsPage from "@/features/admin/pages/TeamsPage";
import ContentPage from "@/features/admin/pages/ContentPage";
import ReportsPage from "@/features/admin/pages/ReportsPage";
import SystemPage from "@/features/admin/pages/SystemPage";
import UserDetailPage from "@/features/admin/pages/UserDetailPage";
import AdminTeamDetailPage from "@/features/admin/pages/TeamDetailPage";

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
        {/* Root layout routes */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="mercenary" element={<MercenaryPage />} />
          <Route path="mercenary/apply/:id" element={<MercenaryApplyPage />} />
          <Route path="team" element={<TeamPage />} />
          <Route path="match" element={<MatchPage />} />
          <Route path="teams/:id" element={<TeamDetailPage />} />
          <Route path="team-manage" element={<TeamManagePage />} />

          {/* MyPage nested routes */}
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

        {/* Admin pages */}
        <Route path="/admin-preview" element={<DashboardPage />} />
        <Route path="/admin" element={<DashboardPage />} />
        <Route path="/admin/users/:userId" element={<UserDetailPage />} />
        <Route path="/admin/teams/:teamId" element={<AdminTeamDetailPage />} />
        <Route path="/admin/matches" element={<MatchesPage />} />
        <Route path="/admin/users" element={<UsersPage />} />
        <Route path="/admin/teams" element={<TeamsPage />} />
        <Route path="/admin/content" element={<ContentPage />} />
        <Route path="/admin/reports" element={<ReportsPage />} />
        <Route path="/admin/system" element={<SystemPage />} />

        {/* Auth pages */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
