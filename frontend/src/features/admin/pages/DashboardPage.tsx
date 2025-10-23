import AdminLayout from "../components/AdminLayout";

const overviewMetrics = [
  {
    label: "진행 중 경기",
    value: "3",
    pill: "LIVE",
    pillClass: "metric-pill metric-live",
    delta: "+1 경기",
    deltaTone: "metric-positive",
    note: "지난주 대비",
  },
  {
    label: "매칭 완료율",
    value: "92%",
    pill: "Today",
    pillClass: "metric-pill",
    delta: "목표 90%",
    deltaTone: "metric-neutral",
    note: "12시 기준",
  },
  {
    label: "대기 중 신고",
    value: "4",
    pill: "High",
    pillClass: "metric-pill metric-alert",
    delta: "+2 건",
    deltaTone: "metric-negative",
    note: "2시간 전 대비",
  },
  {
    label: "서비스 상태",
    value: "정상",
    pill: "Status",
    pillClass: "metric-pill",
    delta: "99.8% 가용성",
    deltaTone: "metric-positive",
    note: "API 평균 182ms",
  },
];

const liveMatches = [
  {
    id: "M-20412",
    home: { name: "FC 서울", score: 2 },
    away: { name: "부산 SC", score: 1 },
    league: "수도권 리그",
    time: "72'",
    status: "live",
  },
  {
    id: "M-20408",
    home: { name: "인천 유나이티드", score: 1 },
    away: { name: "대구 레인저스", score: 1 },
    league: "전국 컵",
    time: "HT",
    status: "live",
  },
  {
    id: "M-20420",
    home: { name: "울산 시티", score: null },
    away: { name: "광주 플렉스", score: null },
    league: "주말 친선",
    time: "19:30",
    status: "scheduled",
  },
];

const activityFeed = [
  {
    id: "A-01",
    type: "신고",
    severity: "severity-high",
    title: "강남 매치 M-20412 폭언 신고",
    meta: "즉시 확인 필요 · 배정 대기",
    time: "5분 전",
  },
  {
    id: "A-02",
    type: "매치",
    severity: "severity-medium",
    title: "FC 서울 vs 부산 SC 득점 이벤트",
    meta: "김민우 68' 헤더 골",
    time: "12분 전",
  },
  {
    id: "A-03",
    type: "시스템",
    severity: "severity-low",
    title: "알림 서비스 딜레이 해소",
    meta: "지연 8분 → 정상화",
    time: "25분 전",
  },
];

const reportQueue = [
  {
    id: "R-9821",
    type: "폭언",
    target: "매치 M-20412",
    status: { label: "긴급", tone: "danger" },
    assignee: "-",
    receivedAt: "11:42",
  },
  {
    id: "R-9819",
    type: "부정 행위",
    target: "팀 T-334",
    status: { label: "검토 중", tone: "warning" },
    assignee: "김지원",
    receivedAt: "10:58",
  },
  {
    id: "R-9815",
    type: "스팸",
    target: "게시물 P-774",
    status: { label: "대기", tone: "neutral" },
    assignee: "박민서",
    receivedAt: "09:31",
  },
  {
    id: "R-9809",
    type: "불참 신고",
    target: "플레이어 U-1231",
    status: { label: "완료", tone: "positive" },
    assignee: "손예린",
    receivedAt: "08:47",
  },
];

const memberHighlights = [
  {
    title: "가입 추이",
    highlight: "신규 128명",
    meta: "전일 대비 +12%",
    items: ["입문 리그 · 64명", "클럽 리그 · 48명", "기업 리그 · 16명"],
  },
  {
    title: "활동 지표",
    highlight: "DAU 3,842",
    meta: "리텐션 42%",
    items: ["평균 매칭 완료 1.7회", "노쇼 경고 3명", "정지 계정 0명"],
  },
  {
    title: "문의 처리",
    highlight: "24건",
    meta: "평균 응답 2.4시간",
    items: ["계정 · 11건", "결제 · 8건", "기타 · 5건"],
  },
];

const DashboardPage = () => {
  return (
    <AdminLayout activePage="dashboard">
      <section id="overview" className="admin-section">
        <div className="section-header">
          <h2 className="section-title">핵심 지표</h2>
          <span className="section-meta">10분마다 새로고침</span>
        </div>
        <div className="metric-grid">
          {overviewMetrics.map((metric) => (
            <div key={metric.label} className="metric-card">
              <div className="metric-top">
                <span className="metric-label">{metric.label}</span>
                <span className={metric.pillClass}>{metric.pill}</span>
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

      <section id="matches" className="admin-section">
        <div className="section-header">
          <h2 className="section-title">실시간 경기</h2>
          <div className="section-actions">
            <button type="button" className="section-btn">
              전체 일정
            </button>
            <button type="button" className="section-btn primary">
              새 매치 등록
            </button>
          </div>
        </div>
        <div className="grid-2">
          <div className="card live-matches">
            <div className="card-header">
              <h3 className="card-title">오늘 경기</h3>
              <span className="card-meta">LIVE 3 · 예정 2</span>
            </div>
            <ul className="live-list">
              {liveMatches.map((match) => (
                <li key={match.id} className={`live-item status-${match.status}`}>
                  <div className="live-team">
                    <span className="team-name">{match.home.name}</span>
                    <span className="team-score">{match.home.score ?? "-"}</span>
                  </div>
                  <span className="live-vs">vs</span>
                  <div className="live-team">
                    <span className="team-name">{match.away.name}</span>
                    <span className="team-score">{match.away.score ?? "-"}</span>
                  </div>
                  <div className="live-meta">
                    <span className="live-time">{match.time}</span>
                    <span className="live-league">{match.league}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="card live-activity">
            <div className="card-header">
              <h3 className="card-title">운영 알림</h3>
              <span className="card-meta">최근 30분</span>
            </div>
            <ul className="activity-list">
              {activityFeed.map((item) => (
                <li key={item.id} className={`activity-item ${item.severity}`}>
                  <span className="activity-badge">{item.type}</span>
                  <div className="activity-body">
                    <div className="activity-title">{item.title}</div>
                    <div className="activity-meta">{item.meta}</div>
                  </div>
                  <time className="activity-time">{item.time}</time>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="reports" className="admin-section">
        <div className="section-header">
          <h2 className="section-title">신고 처리 큐</h2>
          <span className="section-meta">SLA 12시간 · 현재 {reportQueue.length}건</span>
        </div>
        <div className="card table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>유형</th>
                <th>대상</th>
                <th>상태</th>
                <th>배정 담당자</th>
                <th>접수 시간</th>
              </tr>
            </thead>
            <tbody>
              {reportQueue.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.type}</td>
                  <td>{report.target}</td>
                  <td>
                    <span className={`status-pill ${report.status.tone}`}>{report.status.label}</span>
                  </td>
                  <td>{report.assignee}</td>
                  <td>{report.receivedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="members" className="admin-section">
        <div className="section-header">
          <h2 className="section-title">회원 현황</h2>
          <div className="section-actions">
            <button type="button" className="section-btn">
              CSV 내보내기
            </button>
            <button type="button" className="section-btn">
              세그먼트 관리
            </button>
          </div>
        </div>
        <div className="grid-3">
          {memberHighlights.map((card) => (
            <div key={card.title} className="card simple-card">
              <h3 className="card-title">{card.title}</h3>
              <p className="card-highlight">{card.highlight}</p>
              <p className="card-meta">{card.meta}</p>
              <ul className="card-list">
                {card.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
};

export default DashboardPage;
