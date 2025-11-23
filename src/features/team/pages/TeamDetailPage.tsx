// src/features/team/pages/TeamDetailPage.tsx

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { getTeamDetailApi } from "@/features/team/api/teamApi";
import type { Team, TeamMember } from "@/types/team";
import {
  Users,
  MapPin,
  Calendar,
  Trophy,
  Star,
  Settings,
  UserPlus,
  UserMinus,
  Crown,
  ArrowLeft,
  Megaphone,
  Activity,
} from "lucide-react";
import axiosInstance from "@/lib/axiosInstance";
import UserProfileModal from "@/components/common/UserProfileModal";

const TeamDetailPage: React.FC = () => {
  const { id: teamId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"info" | "members" | "matches" | "records" | "stats" | "notices">(
    "info"
  );

  // 현재 사용자의 팀 멤버십 상태
  const [userMembership, setUserMembership] = useState<TeamMember | null>(null);
  const [isJoining, setIsJoining] = useState(false);

  // 선택된 멤버의 프로필 ID (모달용)
  const [selectedProfileId, setSelectedProfileId] = useState<number | null>(null);

  useEffect(() => {
    if (!teamId) return;

    const fetchTeamData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 팀 정보 조회
        const teamData = await getTeamDetailApi(teamId);
        setTeam(teamData);

        // 팀 멤버 조회
        const membersResponse = await axiosInstance.get(
          `${import.meta.env.VITE_TEAM_API_URL || 'http://localhost:8083'}/api/teams/${teamId}/members`
        );
        setMembers(membersResponse.data || []);

        // 현재 사용자의 멤버십 확인
        if (user) {
          const userMember = membersResponse.data?.find(
            (member: TeamMember) => member.id.profileId === user.profileId
          );
          setUserMembership(userMember || null);
        }
      } catch (err) {
        console.error("팀 데이터 조회 실패:", err);
        setError("팀 정보를 불러오는데 실패했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamData();
  }, [teamId, user]);

  const handleJoinTeam = async () => {
    if (!user || !teamId || isJoining) return;
    if (!user.profileId) {
      alert("프로필 정보가 없습니다. 마이페이지에서 프로필을 생성/연동해 주세요.");
      return;
    }

    setIsJoining(true);
    try {
      const response = await axiosInstance.post(
        `${import.meta.env.VITE_TEAM_API_URL || 'http://localhost:8083'}/api/teams/${teamId}/members`,
        {
          profileId: user.profileId,
          roleInTeam: "MEMBER",
        }
      );

      setUserMembership(response.data);
      // 멤버 목록 새로고침
      const membersResponse = await axiosInstance.get(
        `${import.meta.env.VITE_TEAM_API_URL || 'http://localhost:8083'}/api/teams/${teamId}/members`
      );
      setMembers(membersResponse.data || []);
    } catch (err) {
      console.error("팀 가입 실패:", err);
      alert("팀 가입에 실패했습니다.");
    } finally {
      setIsJoining(false);
    }
  };

  const handleLeaveTeam = async () => {
    if (!user || !teamId || !userMembership) return;
    if (!user.profileId) {
      alert("프로필 정보가 없습니다. 마이페이지에서 프로필을 생성/연동해 주세요.");
      return;
    }

    if (!confirm("정말로 팀을 탈퇴하시겠습니까?")) return;

    try {
      await axiosInstance.delete(`${import.meta.env.VITE_TEAM_API_URL || 'http://localhost:8083'}/api/teams/${teamId}/members/${user.profileId}`);
      setUserMembership(null);
      // 멤버 목록 새로고침
      const membersResponse = await axiosInstance.get(
        `${import.meta.env.VITE_TEAM_API_URL || 'http://localhost:8083'}/api/teams/${teamId}/members`
      );
      setMembers(membersResponse.data || []);
    } catch (err) {
      console.error("팀 탈퇴 실패:", err);
      alert("팀 탈퇴에 실패했습니다.");
    }
  };

  const getSkillLevelColor = (level: string | null) => {
    switch (level) {
      case "BEGINNER":
        return "bg-green-100 text-green-800";
      case "INTERMEDIATE":
        return "bg-blue-100 text-blue-800";
      case "ADVANCED":
        return "bg-purple-100 text-purple-800";
      case "PROFESSIONAL":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getActivityTypeColor = (type: string | null) => {
    switch (type) {
      case "REGULAR":
        return "bg-blue-100 text-blue-800";
      case "WEEKEND":
        return "bg-green-100 text-green-800";
      case "CASUAL":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getSkillLevelKorean = (level: string | null) => {
    switch (level) {
      case "BEGINNER":
        return "초급";
      case "INTERMEDIATE":
        return "중급";
      case "ADVANCED":
        return "고급";
      case "PROFESSIONAL":
        return "프로";
      default:
        return level;
    }
  };

  const getActivityTypeKorean = (type: string | null) => {
    switch (type) {
      case "REGULAR":
        return "정기 활동";
      case "WEEKEND":
        return "주말 활동";
      case "CASUAL":
        return "자유 활동";
      default:
        return type;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">팀 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  if (error || !team) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {error || "팀을 찾을 수 없습니다"}
          </h3>
          <button
            onClick={() => navigate(-1)}
            className="text-blue-600 hover:underline"
          >
            뒤로 가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-5 h-5" />
            뒤로 가기
          </button>

          <div className="flex items-start gap-6">
            {/* 팀 로고 */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white shadow-lg relative overflow-hidden">
              {team.logoUrl ? (
                <img
                  src={team.logoUrl}
                  alt={`${team.teamName} 로고`}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <svg
                    className="w-12 h-12 text-white opacity-90"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>
                  <span className="text-xs font-semibold mt-1">
                    {team.teamName?.charAt(0) || "T"}
                  </span>
                </div>
              )}
            </div>

            {/* 팀 기본 정보 */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-gray-900">
                  {team.teamName}
                </h1>
                <div className="flex items-center gap-2">
                  {team.skillLevel && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getSkillLevelColor(
                        team.skillLevel
                      )}`}
                    >
                      {getSkillLevelKorean(team.skillLevel)}
                    </span>
                  )}
                  {team.activityType && (
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getActivityTypeColor(
                        team.activityType
                      )}`}
                    >
                      {getActivityTypeKorean(team.activityType)}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-gray-600 mb-3">
                {team.region && (
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    <span>{team.region}</span>
                  </div>
                )}
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4" />
                  <span>
                    {members.length}
                    {team.maxMembers ? `/${team.maxMembers}` : ""} 명
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(team.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              {team.description && (
                <p className="text-gray-700 mb-4">{team.description}</p>
              )}

              {/* 액션 버튼들 */}
              <div className="flex items-center gap-3">
                {user && !userMembership && (
                  <button
                    onClick={handleJoinTeam}
                    disabled={isJoining}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                  >
                    <UserPlus className="w-4 h-4" />
                    {isJoining ? "가입 중..." : "팀 가입"}
                  </button>
                )}

                {userMembership && (
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-2 bg-green-100 text-green-800 rounded-lg">
                      {userMembership.roleInTeam === "CAPTAIN" && (
                        <Crown className="w-4 h-4" />
                      )}
                      <span className="font-medium">
                        {userMembership.roleInTeam}
                      </span>
                    </div>

                    {userMembership.roleInTeam === "CAPTAIN" && (
                      <button className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
                        <Settings className="w-4 h-4" />팀 관리
                      </button>
                    )}

                    {userMembership.roleInTeam !== "CAPTAIN" && (
                      <button
                        onClick={handleLeaveTeam}
                        className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <UserMinus className="w-4 h-4" />팀 탈퇴
                      </button>
                    )}
                  </div>
                )}

                {!user && (
                  <button
                    onClick={() => navigate("/login")}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <UserPlus className="w-4 h-4" />
                    로그인 후 가입
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab("info")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "info"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />팀 정보
              </div>
            </button>
            <button
              onClick={() => setActiveTab("members")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "members"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                멤버 ({members.length})
              </div>
            </button>
            <button
              onClick={() => setActiveTab("matches")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "matches"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                경기 일정
              </div>
            </button>
            <button
              onClick={() => setActiveTab("records")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "records"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Trophy className="w-4 h-4" />
                경기 기록
              </div>
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "stats"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                팀 통계
              </div>
            </button>
            <button
              onClick={() => setActiveTab("notices")}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === "notices"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <div className="flex items-center gap-2">
                <Megaphone className="w-4 h-4" />
                공지사항
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* 탭 콘텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === "info" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* 팀 상세 정보 */}
            <div className="lg:col-span-2 space-y-6">
              {/* 팀 소개 */}
              {team.description && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span>📝</span>
                    팀 소개
                  </h3>
                  <p className="text-gray-700 leading-relaxed whitespace-pre-line">
                    {team.description}
                  </p>
                </div>
              )}

              {/* 팀 상세 정보 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span>ℹ️</span>
                  팀 상세 정보
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {team.homeGround && (
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🏟️</div>
                      <div className="flex-1">
                        <dt className="text-sm font-medium text-gray-500 mb-1">
                          주요 활동 구장
                        </dt>
                        <dd className="text-sm text-gray-900 font-medium">
                          {team.homeGround}
                        </dd>
                      </div>
                    </div>
                  )}

                  {team.ageGroup && (
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">👥</div>
                      <div className="flex-1">
                        <dt className="text-sm font-medium text-gray-500 mb-1">
                          연령대
                        </dt>
                        <dd className="text-sm text-gray-900 font-medium">
                          {team.ageGroup}
                        </dd>
                      </div>
                    </div>
                  )}

                  {team.rivalTeams && (
                    <div className="flex items-start gap-3">
                      <div className="text-2xl">🔥</div>
                      <div className="flex-1">
                        <dt className="text-sm font-medium text-gray-500 mb-1">
                          라이벌 팀
                        </dt>
                        <dd className="text-sm text-gray-900 font-medium">
                          {team.rivalTeams}
                        </dd>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* 시즌 전적 요약 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  <span>2025 시즌 전적</span>
                </h3>
                <div className="grid grid-cols-4 gap-3 mb-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">15</div>
                    <div className="text-xs text-gray-600">경기</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">9</div>
                    <div className="text-xs text-gray-600">승</div>
                  </div>
                  <div className="text-center p-3 bg-gray-50 rounded-lg">
                    <div className="text-2xl font-bold text-gray-600">3</div>
                    <div className="text-xs text-gray-600">무</div>
                  </div>
                  <div className="text-center p-3 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">3</div>
                    <div className="text-xs text-gray-600">패</div>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <div className="text-sm font-medium text-gray-700">승률</div>
                  <div className="text-xl font-bold text-blue-600">60%</div>
                </div>
                <button
                  onClick={() => setActiveTab("stats")}
                  className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  상세 통계 보기 →
                </button>
              </div>
            </div>

            {/* 팀 통계 */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                  팀 통계
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      총 멤버
                    </span>
                    <span className="font-semibold text-lg text-gray-900">{members.length}명</span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Crown className="w-4 h-4 text-yellow-500" />
                      주장
                    </span>
                    <span className="font-semibold text-lg text-gray-900">
                      {members.filter((m) => m.roleInTeam === "CAPTAIN").length}명
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3 border-b border-gray-100">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Star className="w-4 h-4" />
                      일반 멤버
                    </span>
                    <span className="font-semibold text-lg text-gray-900">
                      {members.filter((m) => m.roleInTeam === "MEMBER").length}명
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-3">
                    <span className="text-gray-600 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-green-500" />
                      활동 멤버
                    </span>
                    <span className="font-semibold text-lg text-green-600">
                      {members.filter((m) => m.isActive).length}명
                    </span>
                  </div>
                </div>
              </div>

              {/* 최근 가입 멤버 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-500" />
                  최근 가입 멤버
                </h3>
                <div className="space-y-3">
                  {members
                    .sort((a, b) => new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime())
                    .slice(0, 5)
                    .map((member) => (
                      <div
                        key={`${member.id.teamId}-${member.id.profileId}`}
                        className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                        onClick={() => setSelectedProfileId(member.id.profileId)}
                      >
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-semibold">
                          {member.profileName?.charAt(0) || "?"}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-900 truncate">
                            {member.profileName || `멤버 ${member.id.profileId}`}
                          </div>
                          <div className="text-xs text-gray-500">
                            {new Date(member.joinedAt).toLocaleDateString("ko-KR", {
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                        </div>
                        {member.roleInTeam === "CAPTAIN" && (
                          <Crown className="w-4 h-4 text-yellow-500" />
                        )}
                      </div>
                    ))}
                </div>
              </div>

              {/* 최근 전적 */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-purple-500" />
                  최근 5경기
                </h3>
                <div className="space-y-3">
                  {/* 샘플 데이터 - 실제로는 API에서 가져와야 함 */}
                  {[
                    { id: 1, opponent: "인천 유나이티드", result: "승", score: "3-1" },
                    { id: 2, opponent: "대전 시티즌", result: "무", score: "2-2" },
                    { id: 3, opponent: "부산 아이파크", result: "승", score: "4-2" },
                    { id: 4, opponent: "광주 FC", result: "패", score: "1-3" },
                    { id: 5, opponent: "울산 현대", result: "승", score: "2-0" },
                  ].map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-2 rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-2">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                          match.result === '승' ? 'bg-blue-500' : match.result === '무' ? 'bg-gray-400' : 'bg-red-500'
                        }`}>
                          {match.result}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{match.opponent}</div>
                        </div>
                      </div>
                      <div className="text-sm font-bold text-gray-700">{match.score}</div>
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setActiveTab("records")}
                  className="mt-4 w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium"
                >
                  전체 기록 보기 →
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === "members" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">팀 멤버</h3>
            </div>
            <div className="p-6">
              {members.length === 0 ? (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">아직 멤버가 없습니다.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {members.map((member) => (
                    <div
                      key={`${member.id.teamId}-${member.id.profileId}`}
                      className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                      onClick={() => setSelectedProfileId(member.id.profileId)}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                        {member.profileName?.charAt(0) || "?"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">
                            {member.profileName ||
                              `멤버 ${member.id.profileId}`}
                          </span>
                          {member.roleInTeam === "CAPTAIN" && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{member.roleInTeam}</span>
                          {member.profileRegion && (
                            <>
                              <span>•</span>
                              <span>{member.profileRegion}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "matches" && (
          <div className="space-y-6">
            {/* 예정된 경기 */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">예정된 경기</h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {/* 샘플 데이터 - 실제로는 API에서 가져와야 함 */}
                  {[
                    { id: 1, opponent: "FC 서울", date: "2025-11-20", time: "14:00", location: "강남구민운동장", type: "친선경기" },
                    { id: 2, opponent: "수원 블루윙즈", date: "2025-11-27", time: "16:00", location: "수원월드컵경기장", type: "리그전" },
                  ].map((match) => (
                    <div key={match.id} className="p-4 border border-gray-200 rounded-lg hover:border-blue-300 transition-colors">
                      <div className="flex items-center justify-between mb-3">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full">
                          {match.type}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(match.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric', weekday: 'short' })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-600">우리 팀</div>
                            <div className="text-lg font-bold text-blue-600">{team?.teamName}</div>
                          </div>
                          <div className="text-2xl font-bold text-gray-400">VS</div>
                          <div className="text-center">
                            <div className="text-sm font-medium text-gray-600">상대 팀</div>
                            <div className="text-lg font-bold text-red-600">{match.opponent}</div>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600 mt-3 pt-3 border-t">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {match.time}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {match.location}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "records" && (
          <div className="space-y-6">
            {/* 최근 경기 결과 */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">최근 경기 결과</h3>
              </div>
              <div className="p-6">
                <div className="space-y-3">
                  {/* 샘플 데이터 - 실제로는 API에서 가져와야 함 */}
                  {[
                    { id: 1, opponent: "인천 유나이티드", date: "2025-11-13", result: "승", score: "3-1", type: "친선경기" },
                    { id: 2, opponent: "대전 시티즌", date: "2025-11-10", result: "무", score: "2-2", type: "리그전" },
                    { id: 3, opponent: "부산 아이파크", date: "2025-11-06", result: "승", score: "4-2", type: "친선경기" },
                    { id: 4, opponent: "광주 FC", date: "2025-11-03", result: "패", score: "1-3", type: "리그전" },
                    { id: 5, opponent: "울산 현대", date: "2025-10-30", result: "승", score: "2-0", type: "친선경기" },
                  ].map((match) => (
                    <div key={match.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-white ${
                          match.result === '승' ? 'bg-blue-500' : match.result === '무' ? 'bg-gray-400' : 'bg-red-500'
                        }`}>
                          {match.result}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-gray-900">vs {match.opponent}</div>
                          <div className="text-sm text-gray-500 flex items-center gap-2">
                            <span>{match.type}</span>
                            <span>•</span>
                            <span>{new Date(match.date).toLocaleDateString('ko-KR')}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-xl font-bold text-gray-900">{match.score}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-6">
            {/* 시즌 통계 */}
            <div className="bg-white rounded-xl shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">2025 시즌 통계</h3>
              </div>
              <div className="p-6">
                {/* 전적 요약 */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-3xl font-bold text-blue-600">15</div>
                    <div className="text-sm text-gray-600 mt-1">총 경기</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-3xl font-bold text-green-600">9</div>
                    <div className="text-sm text-gray-600 mt-1">승</div>
                  </div>
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-3xl font-bold text-gray-600">3</div>
                    <div className="text-sm text-gray-600 mt-1">무</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-3xl font-bold text-red-600">3</div>
                    <div className="text-sm text-gray-600 mt-1">패</div>
                  </div>
                </div>

                {/* 승률 및 득실 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">승률</div>
                    <div className="flex items-end gap-2 mb-2">
                      <div className="text-3xl font-bold text-blue-600">60%</div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="bg-blue-600 h-3 rounded-full" style={{ width: '60%' }}></div>
                    </div>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="text-sm text-gray-600 mb-2">득실차</div>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">32</div>
                        <div className="text-xs text-gray-500">득점</div>
                      </div>
                      <div className="text-xl text-gray-400">-</div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-red-600">18</div>
                        <div className="text-xs text-gray-500">실점</div>
                      </div>
                      <div className="text-center ml-auto">
                        <div className="text-2xl font-bold text-blue-600">+14</div>
                        <div className="text-xs text-gray-500">득실차</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 평균 득실 */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-700 font-medium mb-1">경기당 평균 득점</div>
                    <div className="text-2xl font-bold text-green-600">2.13</div>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-sm text-red-700 font-medium mb-1">경기당 평균 실점</div>
                    <div className="text-2xl font-bold text-red-600">1.20</div>
                  </div>
                </div>

                {/* 연속 기록 */}
                <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Trophy className="w-5 h-5 text-yellow-600" />
                    <div className="text-sm font-semibold text-yellow-900">현재 기록</div>
                  </div>
                  <div className="text-lg font-bold text-yellow-800">3연승 진행 중 🔥</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "notices" && (
          <div className="bg-white rounded-xl shadow-sm">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">공지사항</h3>
            </div>
            <div className="p-6">
              <div className="text-center py-12">
                <Megaphone className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">아직 공지사항이 없습니다.</p>
                {userMembership?.roleInTeam === "CAPTAIN" && (
                  <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                    첫 공지사항 작성하기
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 멤버 프로필 모달 */}
      {selectedProfileId && (
        <UserProfileModal
          userId={selectedProfileId}
          onClose={() => setSelectedProfileId(null)}
        />
      )}
    </div>
  );
};

export default TeamDetailPage;
