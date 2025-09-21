import React, { useState } from 'react';

// 임시 타입 정의
interface Team {
  id: number;
  teamName: string;
  captain: string;
  region: string;
  memberCount: number;
  createdAt: string;
  lastActivity: string;
  status: 'active' | 'inactive';
}

const TeamsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [regionFilter, setRegionFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock 데이터 (team, team_member 테이블 기반)
  const mockTeams: Team[] = [
    {
      id: 4001,
      teamName: 'FC 강남 유나이티드',
      captain: '김철수',
      region: '서울 강남구',
      memberCount: 15,
      createdAt: '2024-01-20',
      lastActivity: '2024-09-20',
      status: 'active'
    },
    {
      id: 4002,
      teamName: '서초 FC',
      captain: '박영희',
      region: '서울 서초구',
      memberCount: 12,
      createdAt: '2024-02-15',
      lastActivity: '2024-09-18',
      status: 'active'
    },
    {
      id: 4003,
      teamName: '성남 드림팀',
      captain: '이민수',
      region: '경기 성남시',
      memberCount: 3,
      createdAt: '2024-03-10',
      lastActivity: '2024-08-15',
      status: 'inactive'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="status-badge status-active">활성</span>;
      case 'inactive':
        return <span className="status-badge status-inactive">비활성</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const handleDissolveTeam = (teamId: number, teamName: string) => {
    if (confirm(`정말로 "${teamName}" 팀을 해체하시겠습니까? 이 작업은 되돌릴 수 없습니다.`)) {
      alert(`팀 ${teamId} 해체 처리됨`);
    }
  };

  const handleActivateTeam = (teamId: number) => {
    alert(`팀 ${teamId} 활성화됨`);
  };

  return (
    <div className="teams-list">
      <div className="page-header">
        <h1 className="page-title">🏆 팀 관리</h1>
        <p className="page-subtitle">team, team_member 테이블 기반 팀 관리</p>
      </div>
      
      {/* 통계 요약 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">89</div>
          <div className="stat-label">전체 팀</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">76</div>
          <div className="stat-label">활성 팀</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">13</div>
          <div className="stat-label">비활성 팀</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">456</div>
          <div className="stat-label">전체 멤버</div>
        </div>
      </div>
      
      {/* 검색 및 필터 */}
      <div className="toolbar">
        <div className="filters">
          <input
            type="text"
            className="search-box"
            placeholder="팀명, 팀장 이름 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={regionFilter}
            onChange={(e) => setRegionFilter(e.target.value)}
          >
            <option value="all">전체 지역</option>
            <option value="서울">서울</option>
            <option value="경기">경기</option>
            <option value="인천">인천</option>
          </select>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">전체 상태</option>
            <option value="active">활성</option>
            <option value="inactive">비활성 (30일)</option>
          </select>
        </div>
        <div className="toolbar-actions">
          <button className="btn btn-danger">비활성 팀 정리</button>
          <button className="btn btn-secondary">팀 통계</button>
        </div>
      </div>
      
      {/* 팀 목록 */}
      <div className="content-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>팀ID</th>
              <th>팀명</th>
              <th>팀장</th>
              <th>지역</th>
              <th>멤버 수</th>
              <th>생성일</th>
              <th>마지막 활동</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {mockTeams.map((team) => (
              <tr key={team.id}>
                <td>{team.id}</td>
                <td>{team.teamName}</td>
                <td>{team.captain}</td>
                <td>{team.region}</td>
                <td>{team.memberCount}명</td>
                <td>{team.createdAt}</td>
                <td>{team.lastActivity}</td>
                <td>{getStatusBadge(team.status)}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-secondary">상세</button>
                    <button className="btn btn-primary">멤버</button>
                    {team.status === 'inactive' ? (
                      <>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDissolveTeam(team.id, team.teamName)}
                        >
                          해체
                        </button>
                        <button 
                          className="btn btn-success"
                          onClick={() => handleActivateTeam(team.id)}
                        >
                          활성화
                        </button>
                      </>
                    ) : (
                      <button className="btn btn-primary">공지</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        <div className="pagination">
          <button className="page-btn">이전</button>
          <button className="page-btn active">1</button>
          <button className="page-btn">2</button>
          <button className="page-btn">3</button>
          <button className="page-btn">다음</button>
        </div>
      </div>
    </div>
  );
};

export default TeamsList;
