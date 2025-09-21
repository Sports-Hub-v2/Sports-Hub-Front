import React, { useState } from 'react';

// 임시 타입 정의
interface RecruitPost {
  id: number;
  title: string;
  writer: string;
  category: string;
  region: string;
  matchDate: string;
  applicants: number;
  maxApplicants: number;
  status: 'approved' | 'pending' | 'rejected';
}

const PostsList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Mock 데이터 (recruit_post 테이블 기반)
  const mockPosts: RecruitPost[] = [
    {
      id: 2001,
      title: '주말 풋살 하실 분 모집합니다!',
      writer: '김철수',
      category: '개인전',
      region: '서울 강남구',
      matchDate: '2024-09-25',
      applicants: 5,
      maxApplicants: 8,
      status: 'approved'
    },
    {
      id: 2002,
      title: 'FC 강남 vs ? 친선경기 상대팀 구합니다',
      writer: '박영희',
      category: '팀전',
      region: '서울 서초구',
      matchDate: '2024-09-28',
      applicants: 0,
      maxApplicants: 11,
      status: 'pending'
    },
    {
      id: 2003,
      title: '🏆 성남FC 아마추어 리그 참가팀 모집',
      writer: '이민수',
      category: '토너먼트',
      region: '경기 성남시',
      matchDate: '2024-10-05',
      applicants: 3,
      maxApplicants: 16,
      status: 'approved'
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return <span className="status-badge status-approved">승인됨</span>;
      case 'pending':
        return <span className="status-badge status-pending">검토 대기</span>;
      case 'rejected':
        return <span className="status-badge status-rejected">거절됨</span>;
      default:
        return <span className="status-badge">{status}</span>;
    }
  };

  const handleApprove = (postId: number) => {
    alert(`모집글 ${postId} 승인됨`);
  };

  const handleReject = (postId: number) => {
    if (confirm('정말로 이 모집글을 거절하시겠습니까?')) {
      alert(`모집글 ${postId} 거절됨`);
    }
  };

  const handleDelete = (postId: number) => {
    if (confirm('정말로 이 모집글을 삭제하시겠습니까?')) {
      alert(`모집글 ${postId} 삭제됨`);
    }
  };

  return (
    <div className="posts-list">
      <div className="page-header">
        <h1 className="page-title">⚽ 모집글 관리</h1>
        <p className="page-subtitle">recruit_post 테이블 기반 모집글 관리</p>
      </div>
      
      {/* 통계 요약 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">156</div>
          <div className="stat-label">전체 모집글</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">12</div>
          <div className="stat-label">검토 대기</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">3</div>
          <div className="stat-label">신고된 모집글</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">89%</div>
          <div className="stat-label">승인률</div>
        </div>
      </div>
      
      {/* 검색 및 필터 */}
      <div className="toolbar">
        <div className="filters">
          <input
            type="text"
            className="search-box"
            placeholder="제목, 내용, 작성자 검색..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="filter-select"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="all">전체 카테고리</option>
            <option value="개인전">개인전</option>
            <option value="팀전">팀전</option>
            <option value="토너먼트">토너먼트</option>
          </select>
          <select
            className="filter-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">전체 상태</option>
            <option value="approved">승인됨</option>
            <option value="pending">검토 대기</option>
            <option value="rejected">거절됨</option>
          </select>
        </div>
        <div className="toolbar-actions">
          <button className="btn btn-primary">일괄 승인</button>
          <button className="btn btn-danger">일괄 삭제</button>
        </div>
      </div>
      
      {/* 모집글 목록 */}
      <div className="content-card">
        <table className="admin-table">
          <thead>
            <tr>
              <th><input type="checkbox" /></th>
              <th>ID</th>
              <th>제목</th>
              <th>작성자</th>
              <th>카테고리</th>
              <th>지역</th>
              <th>경기일</th>
              <th>신청자</th>
              <th>상태</th>
              <th>관리</th>
            </tr>
          </thead>
          <tbody>
            {mockPosts.map((post) => (
              <tr key={post.id}>
                <td><input type="checkbox" /></td>
                <td>{post.id}</td>
                <td>{post.title}</td>
                <td>{post.writer}</td>
                <td>{post.category}</td>
                <td>{post.region}</td>
                <td>{post.matchDate}</td>
                <td>{post.applicants}/{post.maxApplicants}</td>
                <td>{getStatusBadge(post.status)}</td>
                <td>
                  <div className="action-buttons">
                    {post.status === 'pending' ? (
                      <>
                        <button 
                          className="btn btn-success"
                          onClick={() => handleApprove(post.id)}
                        >
                          승인
                        </button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleReject(post.id)}
                        >
                          거절
                        </button>
                      </>
                    ) : (
                      <>
                        <button className="btn btn-secondary">상세</button>
                        <button className="btn btn-primary">수정</button>
                        <button 
                          className="btn btn-danger"
                          onClick={() => handleDelete(post.id)}
                        >
                          삭제
                        </button>
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

export default PostsList;
