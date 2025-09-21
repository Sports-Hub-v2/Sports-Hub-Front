import React from 'react';

const AdminDashboard: React.FC = () => {
  return (
    <div className="admin-dashboard">
      <div className="page-header">
        <h1 className="page-title">📊 관리자 대시보드</h1>
        <p className="page-subtitle">Sports-hub 서비스 전체 현황 및 주요 지표</p>
      </div>
      
      {/* 핵심 지표 */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-number">1,240</div>
          <div className="stat-label">활성 사용자</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">45</div>
          <div className="stat-label">오늘 신규 가입</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">87%</div>
          <div className="stat-label">매칭 성공률</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">99.9%</div>
          <div className="stat-label">서비스 가용성</div>
        </div>
      </div>
      
      <div className="dashboard-content">
        {/* 긴급 처리 필요 */}
        <div className="content-card alert-widget">
          <div className="card-header">
            <h3>🚨 긴급 처리 필요</h3>
          </div>
          <div className="card-body">
            <div className="task-item">
              <span className="task-urgent">서비스 장애:</span>
              <span className="task-count">1건</span>
            </div>
            <div className="task-item">
              <span className="task-urgent">긴급 신고:</span>
              <span className="task-count">0건</span>
            </div>
            <div className="task-item">
              <span className="task-normal">보안 위협:</span>
              <span className="task-count">0건</span>
            </div>
          </div>
        </div>
        
        {/* 오늘의 업무 */}
        <div className="content-card tasks-widget">
          <div className="card-header">
            <h3>✅ 오늘의 업무</h3>
          </div>
          <div className="card-body">
            <div className="task-item">
              <span className="task-normal">신고 처리:</span>
              <span className="task-count">12건</span>
            </div>
            <div className="task-item">
              <span className="task-normal">모집글 검토:</span>
              <span className="task-count">8건</span>
            </div>
            <div className="task-item">
              <span className="task-normal">휴면계정 정리:</span>
              <span className="task-count">15건</span>
            </div>
            <div className="task-item">
              <span className="task-normal">CS 문의 답변:</span>
              <span className="task-count">23건</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
