// src/features/team-manage/pages/TeamManageDetailPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, } from 'react-router-dom';
import { getTeamDetailApi } from '@/features/team/api/teamApi';
import type { Team } from '@/types/team';

const TeamManageDetailPage: React.FC = () => {
  // 1. URL 파라미터에서 teamId를 가져옵니다.
  const { teamId } = useParams<{ teamId: string }>();
  
  const [team, setTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!teamId) {
      setError("잘못된 접근입니다.");
      setIsLoading(false);
      return;
    }

    const fetchTeamDetail = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTeamDetailApi(teamId);
        setTeam(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : '팀 정보 로드 실패');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeamDetail();
  }, [teamId]);

  if (isLoading) {
    return <div className="max-w-4xl mx-auto px-4 py-8 pt-24 text-center">팀 정보를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="max-w-4xl mx-auto px-4 py-8 pt-24 text-center text-red-500">{error}</div>;
  }
  
  if (!team) {
    return <div className="max-w-4xl mx-auto px-4 py-8 pt-24 text-center">팀 정보를 찾을 수 없습니다.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 pt-24 space-y-8">
      <div className="p-6 bg-white shadow-md rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img 
            src={team.logoUrl || '/images/default-team-logo.png'}
            alt={`${team.name} 로고`}
            className="w-32 h-32 rounded-full object-cover bg-gray-200 border-4 border-white shadow-lg"
          />
          <div className="flex-grow">
            <h1 className="text-4xl font-bold">{team.name}</h1>
            <p className="text-lg text-gray-500 mt-1">{team.region} {team.subRegion || ''}</p>
            <p className="text-md text-gray-700 mt-4">{team.description}</p>
          </div>
          <div>
            <button className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-black">정보 수정</button>
          </div>
        </div>
      </div>
      
      <div className="p-6 bg-white shadow-md rounded-lg">
        <h2 className="text-2xl font-semibold mb-4">팀원 관리</h2>
        {/* TODO: 여기에 팀원 목록을 불러와서 표시하고, 초대/방출하는 기능을 구현합니다. */}
        <p className="text-gray-500">팀원 관리 기능은 준비 중입니다.</p>
      </div>
    </div>
  );
};

export default TeamManageDetailPage;