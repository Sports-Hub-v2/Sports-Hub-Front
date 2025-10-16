import AdminLayout from "../components/AdminLayout";

const memberMetrics = [
  {
    label: "총 회원",
    value: "15,234",
    delta: "+128",
    deltaTone: "metric-positive",
    note: "전일 대비",
  },
  {
    label: "DAU",
    value: "3,842",
    delta: "42% 리텐션",
    deltaTone: "metric-neutral",
    note: "7일 평균",
  },
  {
    label: "활성 팀",
    value: "218",
    delta: "+6",
    deltaTone: "metric-positive",
    note: "금일 등록",
  },
  {
    label: "노쇼 경고",
    value: "3",
    delta: "0 정지",
    deltaTone: "metric-neutral",
    note: "24시간",
  },
];

const segments = [
  {
    title: "핵심 이용자",
    highlight: "32%",
    meta: "월 4회 이상 참여",
    list: ["평균 매칭 완료 2.1회", "NPS 63", "신고율 0.2%"],
  },
  {
    title: "이탈 위험",
    highlight: "11%",
    meta: "최근 14일 미접속",
    list: ["재참여 캠페인 진행", "알림 클릭률 18%", "팀 활동 없음"],
  },
  {
    title: "신규 회원",
    highlight: "128명",
    meta: "24시간 가입",
    list: ["기업팀 16명", "친구 추천 22%", "프로필 작성 71%"],
  },
];

const supportTickets = [
  {
    id: "CS-1120",
    type: "계정",
    title: "이중 로그인 문의",
    priority: "중간",
    sla: "2.1시간",
    status: "답변 완료",
  },
  {
    id: "CS-1118",
    type: "결제",
    title: "기업팀 결제 취소",
    priority: "높음",
    sla: "1.4시간",
    status: "진행 중",
  },
  {
    id: "CS-1115",
    type: "기타",
    title: "팀명 변경 요청",
    priority: "낮음",
    sla: "3.8시간",
    status: "대기",
  },
];

const disciplineLog = [
  {
    id: "WARN-42",
    user: "player_u2031",
    reason: "매치 노쇼",
    action: "경고",
    date: "2024-03-14",
  },
  {
    id: "WARN-41",
    user: "coach_lee",
    reason: "부적절 언어",
    action: "임시 제재",
    date: "2024-03-13",
  },
];

const MembersPage = () => {
  return (
    <AdminLayout activePage="members">
      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">회원 지표</h2>
          <span className="section-meta">커뮤니티 운영 현황</span>
        </div>
        <div className="metric-grid">
          {memberMetrics.map((metric) => (
            <div key={metric.label} className="metric-card">
              <div className="metric-top">
                <span className="metric-label">{metric.label}</span>
              </div>
              <strong className="metric-value">{metric.value}</strong>
              <div className="metric-footer">
                <span className={`metric-delta ${metric.deltaTone}`}>{metric.delta}</span>
                <span className="metric-note">{metric.note}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">세그먼트별 현황</h2>
          <div className="section-actions">
            <button type="button" className="section-btn">
              세그먼트 관리
            </button>
            <button type="button" className="section-btn primary">
              캠페인 만들기
            </button>
          </div>
        </div>
        <div className="grid-3">
          {segments.map((segment) => (
            <div key={segment.title} className="card simple-card">
              <h3 className="card-title">{segment.title}</h3>
              <p className="card-highlight">{segment.highlight}</p>
              <p className="card-meta">{segment.meta}</p>
              <ul className="card-list">
                {segment.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">지원 문의</h2>
          <span className="section-meta">SLA 4시간 목표</span>
        </div>
        <div className="card table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>유형</th>
                <th>제목</th>
                <th>우선순위</th>
                <th>평균 처리</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {supportTickets.map((ticket) => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.type}</td>
                  <td>{ticket.title}</td>
                  <td>
                    <span className={`status-pill ${ticket.priority === "높음" ? "danger" : ticket.priority === "중간" ? "warning" : "neutral"}`}>
                      {ticket.priority}
                    </span>
                  </td>
                  <td>{ticket.sla}</td>
                  <td>{ticket.status}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">규정 위반 이력</h2>
          <span className="section-meta">최근 48시간</span>
        </div>
        <div className="card table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>회원</th>
                <th>사유</th>
                <th>조치</th>
                <th>일시</th>
              </tr>
            </thead>
            <tbody>
              {disciplineLog.map((log) => (
                <tr key={log.id}>
                  <td>{log.id}</td>
                  <td>{log.user}</td>
                  <td>{log.reason}</td>
                  <td>{log.action}</td>
                  <td>{log.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
};

export default MembersPage;
