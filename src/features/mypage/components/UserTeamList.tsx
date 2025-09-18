// src/features/myPage/components/UserTeamsList.tsx

import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { getUserTeamsApi } from "@/features/auth/api/userApi";
import type { TeamSummary } from "@/types/team";

// 현재는 내부적으로 useAuthStore를 사용하므로 userId prop이 필요하지 않습니다.
interface UserTeamsListProps {}

const UserTeamsList: React.FC<UserTeamsListProps> = () => {
  const { user } = useAuthStore(); // 현재 Zustand 스토어에서 로그인한 사용자 정보를 가져옵니다.

  const [teams, setTeams] = useState<TeamSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 현재 user 정보가 있을 때만 데이터를 불러옵니다
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchTeams = async () => {
      setIsLoading(true);
      setError(null);
      try {
        // 현재 스토어에서 가져온 user.id를 사용합니다
        const data = await getUserTeamsApi(user.id);

        // 백엔드에서 받은 실제 데이터만 사용
        setTeams(data || []);
      } catch (err) {
        // API 호출 실패 시 에러 처리
        console.error("팀 목록 조회 실패:", err);
        setError("팀 목록을 불러오는데 실패했습니다.");
        setTeams([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, [user]); // 현재 user 정보가 바뀔 때마다 다시 불러옵니다

  if (isLoading) {
    return (
      <div className="py-8 text-center text-gray-500">
        내 팀 목록을 불러오는 중...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="py-8 text-center text-gray-500">로그인이 필요합니다</div>
    );
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }

  if (teams.length === 0) {
    return (
      <div className="py-8 text-center text-gray-500">
        소속된 팀이 없습니다.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold border-b pb-2">내 팀 목록</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {teams.map((team) => (
          <Link
            to={`/teams/${team.id}`}
            key={team.id}
            className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-center space-x-4">
              <img
                src={team.logoUrl || "/default-team-logo.png"}
                alt={`${team.name} 로고`}
                className="w-16 h-16 rounded-full object-cover bg-gray-200"
              />
              <div className="flex-grow">
                <p className="font-bold text-lg">{team.name}</p>
                <p className="text-sm text-gray-600">{team.region}</p>
                <p className="text-sm text-blue-600 font-semibold mt-1">
                  {team.roleInTeam}
                </p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default UserTeamsList;
