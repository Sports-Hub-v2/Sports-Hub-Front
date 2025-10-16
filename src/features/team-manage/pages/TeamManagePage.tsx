// src/features/team-manage/pages/TeamManagePage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { getUserTeamsApi } from '@/features/auth/api/userApi';
import { createTeamApi, TeamCreateRequestDto } from '@/features/team/api/teamApi';
import type { TeamSummary } from '@/types/team';
import CreateTeamModal from '../components/CreateTeamModal';

const TeamManagePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [myTeams, setMyTeams] = useState<TeamSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // '팀 생성' 모달의 열림/닫힘 상태를 관리하는 state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // 내 팀 목록을 불러오는 함수
  const fetchMyTeams = useCallback(async () => {
    if (!user) {
      alert('팀 관리를 위해서는 로그인이 필요합니다.');
      navigate('/login');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUserTeamsApi(user.id);
      setMyTeams(data);
    } catch (err) {
      setError('소속팀 목록을 불러오는 데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [user, navigate]);

  // 컴포넌트가 처음 렌더링될 때 팀 목록을 불러옵니다.
  useEffect(() => {
    fetchMyTeams();
  }, [fetchMyTeams]);

  // 팀 생성이 성공했을 때 모달로부터 호출될 함수
  const handleTeamCreated = async (teamData: TeamCreateRequestDto) => {
    try {
      await createTeamApi(teamData);
      alert('팀이 성공적으로 생성되었습니다!');
      setIsCreateModalOpen(false); // 모달 닫기
      fetchMyTeams(); // 팀 목록 새로고침
    } catch (error) {
      alert(error instanceof Error ? error.message : '팀 생성에 실패했습니다.');
    }
  };

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-4 py-8 pt-24 text-center">목록을 불러오는 중...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto px-4 py-8 pt-24 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-24 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">내 팀 관리</h1>
        <button 
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
          onClick={() => setIsCreateModalOpen(true)} // 버튼 클릭 시 모달 열기
        >
          + 새 팀 생성
        </button>
      </div>

      {/* 팀 생성 모달 렌더링 */}
      <CreateTeamModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleTeamCreated}
      />

      {myTeams.length === 0 ? (
        <div className="text-center py-12 bg-white shadow-md rounded-lg">
          <p className="text-gray-500">소속된 팀이 없습니다.</p>
          <p className="text-sm text-gray-400 mt-2">새로운 팀을 생성하여 팀 활동을 시작해보세요.</p>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg divide-y divide-gray-200">
          {myTeams.map(team => (
            <div key={team.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
              <div className="flex items-center space-x-4">
                <img 
                  src={team.logoUrl || '/images/default-team-logo.png'} // 기본 로고 이미지 경로
                  alt={`${team.name} 로고`}
                  className="w-12 h-12 rounded-full object-cover bg-gray-200"
                />
                <div>
                  <h2 className="text-lg font-semibold text-gray-800">{team.name}</h2>
                  <p className="text-sm text-gray-500">{team.region}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                  {team.roleInTeam}
                </span>
                {/* '팀장'일 경우에만 관리 버튼이 보이도록 합니다. */}
                {team.roleInTeam === 'CAPTAIN' && (
                  <Link 
                    to={`/team-manage/${team.id}`}
                    className="text-sm text-white bg-gray-700 hover:bg-black px-3 py-1 rounded-md transition-colors"
                  >
                    관리하기
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TeamManagePage;