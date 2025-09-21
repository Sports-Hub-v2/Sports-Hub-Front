import React, { useState } from 'react';

// 임시 타입 정의 (실제로는 types 디렉토리에서 import)
interface User {
  id: number;
  name: string;
  email: string;
  region: string;
  preferredPosition: string;
  joinedAt: string;
  status: 'active' | 'inactive' | 'suspended';
}

const UsersList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [regionFilter, setRegionFilter] = useState('all');

  // Mock 데이터 (실제로는 API에서 가져올 예정)
  const mockUsers: User[] = [
    {
      id: 1001,
      name: '김철수',
      email: 'kimcs@example.com',
      region: '서울 강남구',
      preferredPosition: 'MF',
      joinedAt: '2024-01-15',
      status: 'active'
    },
    {
      id: 1002,
      name: '박영희',
      email: 'parkyh@example.com',
      region: '경기 성남시',
      preferredPosition: 'DF',
      joinedAt: '2024-01-20',
      status: 'active'
    },
    {
      id: 1003,
      name: '이민수',
      email: 'leems@example.com',
      region: '서울 마포구',
      preferredPosition: 'FW',
      joinedAt: '2024-02-01',
      status: 'inactive'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <span className="status-badge status-active">활성</span>;
      case 'inactive':
        return <span className="status-badge status-inactive">휴면</span>;
      case 'suspended':
        return <span className="status-badge status-suspended">정지</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  return (
    <div className="users-list">
      <div className="page-header">
        <h1 className="page-title">👥 회원 관리</h1>
        <p className="page-subtitle">users, profiles 테이블 기반 회원 정보 관리</p>
      </div>
      
      {/* 검색 및 필터 */}
      <div className="toolbar">
        <div className="filters">
          <input
            type="text"
            className="search-box"
            placeholder="이름, 이메일, 사용자ID 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">전체 상태</option>
            <option value="active">활성</option>
            <option value="inactive">휴면</option>
            <option value="suspended">정지</option>
          </select>
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
        </div>
        <div className="toolbar-actions">
          <button className="btn btn-primary">회원 추가</button>
          <button className="btn btn-secondary">엑셀 내보내기</button>
        </div>
      </div>
      
      {/* 회원 목록 테이블 */}
      <div className="content-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>이름</th>
              <th>이메일</th>
              <th>지역</th>
              <th>포지션</th>
              <th>가입일</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {mockUsers.map((user) => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.region}</td>
                <td>{user.preferredPosition}</td>
                <td>{user.joinedAt}</td>
                <td>{getStatusBadge(user.status)}</td>
                <td>
                  <div className="action-buttons">
                    <button className="btn btn-secondary">상세</button>
                    <button className="btn btn-primary">수정</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* 페이지네이션 */}
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

export default UsersList;
