import React, { useState } from 'react';

// 임시 타입 정의
interface Application {
  id: number;
  applicant: string;
  postTitle: string;
  description: string;
  applicationDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

const ApplicationsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock 데이터 (recruit_application 테이블 기반)
  const mockApplications: Application[] = [
    {
      id: 3001,
      applicant: '최민규',
      postTitle: '주말 풋살 하실 분 모집합니다!',
      description: '안녕하세요! 풋살 경험 3년차입니다. 열심히...',
      applicationDate: '2024-09-22 14:30',
      status: 'pending'
    },
    {
      id: 3002,
      applicant: '정수영',
      postTitle: 'FC 강남 vs ? 친선경기 상대팀 구합니다',
      description: '저희 팀 FC 서초입니다. 11명 풀로 가능하고...',
      applicationDate: '2024-09-22 16:15',
      status: 'approved'
    },
    {
      id: 3003,
      applicant: '한도윤',
      postTitle: '🏆 성남FC 아마추어 리그 참가팀 모집',
      description: '리그 경험 많습니다. 토너먼트 우승 경력도...',
      applicationDate: '2024-09-21 19:20',
      status: 'rejected'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="status-badge status-pending">보류</span>;
      case 'approved':
        return <span className="status-badge status-approved">수락</span>;
      case 'rejected':
        return <span className="status-badge status-rejected">거절</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const handleApprove = (applicationId: number) => {
    alert(`신청서 ${applicationId} 승인됨`);
  };

  const handleReject = (applicationId: number) => {
    if (confirm('정말로 이 신청서를 거절하시겠습니까?')) {
      alert(`신청서 ${applicationId} 거절됨`);
    }
  };

  return (
    <div className="applications-list">
      <div className="page-header">
        <h1 className="page-title">📝 신청서 관리</h1>
        <p className="page-subtitle">recruit_application 테이블 기반 신청서 처리</p>
      </div>
      
      {/* 통계 요약 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">234</div>
          <div className="stat-label">전체 신청서</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">45</div>
          <div className="stat-label">처리 대기</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">180</div>
          <div className="stat-label">승인됨</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">77%</div>
          <div className="stat-label">승인률</div>
        </div>
      </div>
      
      {/* 검색 및 필터 */}
      <div className="toolbar">
        <div className="filters">
          <input
            type="text"
            className="search-box"
            placeholder="신청자, 모집글 제목 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">전체 상태</option>
            <option value="pending">보류</option>
            <option value="approved">수락</option>
            <option value="rejected">거절</option>
          </select>
          <input type="date" className="filter-select" placeholder="신청일 시작" />
          <input type="date" className="filter-select" placeholder="신청일 종료" />
        </div>
        <div className="toolbar-actions">
          <button className="btn btn-success">일괄 승인</button>
          <button className="btn btn-danger">일괄 거절</button>
        </div>
      </div>
      
      {/* 신청서 목록 */}
      <div className="content-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>신청ID</th>
              <th>신청자</th>
              <th>모집글</th>
              <th>신청 메시지</th>
              <th>신청일</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {mockApplications.map((application) => (
              <tr key={application.id}>
                <td><input type="checkbox" /></td>
                <td>{application.id}</td>
                <td>{application.applicant}</td>
                <td>{application.postTitle}</td>
                <td>
                  <div style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {application.description}
                  </div>
                </td>
                <td>{application.applicationDate}</td>
                <td>{getStatusBadge(application.status)}</td>
                <td>
                  <div className="action-buttons">
                    {application.status === 'pending' ? (
                      <>
                        <button 
                          className="btn btn-success"
                          onClick={() => handleApprove(application.id)}
                        >
                          승인
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleReject(application.id)}
                        >
                          거절
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-secondary">상세</button>
                        {application.status === 'rejected' && (
                          <button className="btn btn-primary">재검토</button>
                        )}
                      </>
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

export default ApplicationsList;
