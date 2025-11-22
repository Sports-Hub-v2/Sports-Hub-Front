// src/features/team-manage/pages/TeamManageDetailPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  getTeamDetailApi,
  getTeamMembersApi,
  addTeamMemberApi,
  updateMemberRoleApi,
  removeMemberApi,
  updateTeamApi
} from '@/features/team/api/teamApi';
import type { Team, TeamMember } from '@/types/team';
import { useAuthStore } from '@/stores/useAuthStore';

const TeamManageDetailPage: React.FC = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const user = useAuthStore((s) => s.user);

  const [team, setTeam] = useState<Team | null>(null);
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 팀원 추가 모달 상태
  const [isAddMemberModalOpen, setIsAddMemberModalOpen] = useState(false);
  const [newMemberProfileId, setNewMemberProfileId] = useState('');
  const [newMemberRole, setNewMemberRole] = useState('MEMBER');

  // 팀 정보 수정 모달 상태
  const [isEditTeamModalOpen, setIsEditTeamModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({
    teamName: '',
    region: '',
    subRegion: '',
    description: '',
    logoUrl: '',
    homeGround: '',
    skillLevel: ''
  });

  // 팀 정보 및 멤버 목록 불러오기
  const fetchTeamData = async () => {
    if (!teamId) {
      setError("잘못된 접근입니다.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const [teamData, membersData] = await Promise.all([
        getTeamDetailApi(teamId),
        getTeamMembersApi(teamId)
      ]);
      setTeam(teamData);
      setMembers(membersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : '팀 정보 로드 실패');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamData();
  }, [teamId]);

  // 주장 여부 확인
  const isCaptain = team && user && team.captainProfileId === user.profileId;

  // 팀원 추가
  const handleAddMember = async () => {
    if (!teamId || !newMemberProfileId) {
      alert('프로필 ID를 입력해주세요.');
      return;
    }

    try {
      await addTeamMemberApi(teamId, Number(newMemberProfileId), newMemberRole);
      alert('팀원이 추가되었습니다.');
      setIsAddMemberModalOpen(false);
      setNewMemberProfileId('');
      setNewMemberRole('MEMBER');
      fetchTeamData();
    } catch (err) {
      alert(err instanceof Error ? err.message : '팀원 추가 실패');
    }
  };

  // 팀장 위임
  const handleTransferCaptain = async (profileId: number, memberName: string) => {
    if (!teamId) return;

    if (!confirm(`${memberName} 님에게 팀장을 위임하시겠습니까?\n위임 후 본인은 일반 팀원이 됩니다.`)) return;

    try {
      // 새로운 팀장을 CAPTAIN으로 변경
      await updateMemberRoleApi(teamId, profileId, 'CAPTAIN');

      // 현재 팀장(본인)을 MEMBER로 변경
      if (user?.profileId) {
        await updateMemberRoleApi(teamId, user.profileId, 'MEMBER');
      }

      alert('팀장이 위임되었습니다.');
      fetchTeamData();
    } catch (err) {
      alert(err instanceof Error ? err.message : '팀장 위임 실패');
    }
  };

  // 팀원 삭제
  const handleRemoveMember = async (profileId: number, memberName: string) => {
    if (!teamId) return;

    if (!confirm(`${memberName} 님을 팀에서 내보내시겠습니까?`)) return;

    try {
      await removeMemberApi(teamId, profileId);
      alert('팀원이 제거되었습니다.');
      fetchTeamData();
    } catch (err) {
      alert(err instanceof Error ? err.message : '팀원 제거 실패');
    }
  };

  // 팀 정보 수정 모달 열기
  const openEditTeamModal = () => {
    if (team) {
      setEditFormData({
        teamName: team.teamName || '',
        region: team.region || '',
        subRegion: team.subRegion || '',
        description: team.description || '',
        logoUrl: team.logoUrl || '',
        homeGround: team.homeGround || '',
        skillLevel: team.skillLevel || ''
      });
      setIsEditTeamModalOpen(true);
    }
  };

  // 팀 정보 수정 제출
  const handleUpdateTeam = async () => {
    if (!teamId) return;

    try {
      await updateTeamApi(teamId, editFormData);
      alert('팀 정보가 수정되었습니다.');
      setIsEditTeamModalOpen(false);
      fetchTeamData();
    } catch (err) {
      alert(err instanceof Error ? err.message : '팀 정보 수정 실패');
    }
  };

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
      {/* 팀 정보 */}
      <div className="p-6 bg-white shadow-md rounded-lg">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
          <img
            src={team.logoUrl || '/images/default-team-logo.png'}
            alt={`${team.teamName} 로고`}
            className="w-32 h-32 rounded-full object-cover bg-gray-200 border-4 border-white shadow-lg"
          />
          <div className="flex-grow">
            <h1 className="text-4xl font-bold">{team.teamName}</h1>
            <p className="text-lg text-gray-500 mt-1">
              {team.region} {team.subRegion || ''}
            </p>
            <p className="text-md text-gray-700 mt-4">{team.description}</p>
            <div className="flex gap-4 mt-4 text-sm text-gray-600">
              <span>🏆 {team.totalWins}승 {team.totalDraws}무 {team.totalLosses}패</span>
              <span>👥 {team.totalMembers}명</span>
              {team.verified && <span className="text-green-600">✅ 인증됨</span>}
            </div>
          </div>
          {isCaptain && (
            <div>
              <button
                onClick={openEditTeamModal}
                className="bg-gray-700 text-white px-4 py-2 rounded-md hover:bg-black"
              >
                정보 수정
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 팀원 관리 */}
      <div className="p-6 bg-white shadow-md rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">팀원 관리</h2>
          {isCaptain && (
            <button
              onClick={() => setIsAddMemberModalOpen(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              + 팀원 추가
            </button>
          )}
        </div>

        {/* 팀원 목록 */}
        {members.length === 0 ? (
          <p className="text-gray-500 text-center py-8">등록된 팀원이 없습니다.</p>
        ) : (
          <div className="space-y-3">
            {members.map((member) => (
              <div
                key={member.profileId}
                className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-semibold text-lg">{member.name}</p>
                    <p className="text-sm text-gray-500">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${
                        member.role === 'CAPTAIN' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {member.role === 'CAPTAIN' ? '👑 팀장' : '⚽ 팀원'}
                      </span>
                    </p>
                  </div>
                </div>

                {isCaptain && member.role !== 'CAPTAIN' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleTransferCaptain(member.profileId, member.name)}
                      className="px-3 py-1 text-sm bg-yellow-100 hover:bg-yellow-200 text-yellow-800 rounded"
                    >
                      팀장 위임
                    </button>
                    <button
                      onClick={() => handleRemoveMember(member.profileId, member.name)}
                      className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded"
                    >
                      내보내기
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 팀원 추가 모달 */}
      {isAddMemberModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-2xl font-bold mb-4">팀원 추가</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">프로필 ID</label>
                <input
                  type="number"
                  value={newMemberProfileId}
                  onChange={(e) => setNewMemberProfileId(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="추가할 사용자의 프로필 ID"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">역할</label>
                <select
                  value={newMemberRole}
                  onChange={(e) => setNewMemberRole(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="MEMBER">팀원</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">* 팀장은 팀 생성 시 자동으로 지정됩니다</p>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setIsAddMemberModalOpen(false);
                  setNewMemberProfileId('');
                  setNewMemberRole('MEMBER');
                }}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleAddMember}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                추가
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 팀 정보 수정 모달 */}
      {isEditTeamModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full p-6 max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold mb-4">팀 정보 수정</h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">팀 이름 *</label>
                <input
                  type="text"
                  value={editFormData.teamName}
                  onChange={(e) => setEditFormData({ ...editFormData, teamName: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="팀 이름"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">지역</label>
                  <input
                    type="text"
                    value={editFormData.region}
                    onChange={(e) => setEditFormData({ ...editFormData, region: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="서울특별시"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">세부 지역</label>
                  <input
                    type="text"
                    value={editFormData.subRegion}
                    onChange={(e) => setEditFormData({ ...editFormData, subRegion: e.target.value })}
                    className="w-full px-3 py-2 border rounded-lg"
                    placeholder="강남구"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">팀 소개</label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  rows={4}
                  placeholder="팀에 대한 설명을 입력하세요"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">홈 구장</label>
                <input
                  type="text"
                  value={editFormData.homeGround}
                  onChange={(e) => setEditFormData({ ...editFormData, homeGround: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="홈 구장 이름"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">실력 수준</label>
                <select
                  value={editFormData.skillLevel}
                  onChange={(e) => setEditFormData({ ...editFormData, skillLevel: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                >
                  <option value="">선택 안함</option>
                  <option value="BEGINNER">초급</option>
                  <option value="INTERMEDIATE">중급</option>
                  <option value="ADVANCED">고급</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">로고 URL</label>
                <input
                  type="text"
                  value={editFormData.logoUrl}
                  onChange={(e) => setEditFormData({ ...editFormData, logoUrl: e.target.value })}
                  className="w-full px-3 py-2 border rounded-lg"
                  placeholder="https://example.com/logo.png"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => setIsEditTeamModalOpen(false)}
                className="flex-1 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                취소
              </button>
              <button
                onClick={handleUpdateTeam}
                className="flex-1 px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-black"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeamManageDetailPage;