import AdminLayout from "../components/AdminLayout";

const systemMetrics = [
  {
    label: "API 응답 시간",
    value: "182ms",
    delta: "-12%",
    deltaTone: "metric-positive",
    note: "1시간 전 대비",
  },
  {
    label: "오류율",
    value: "0.21%",
    delta: "+0.05%",
    deltaTone: "metric-negative",
    note: "관심 필요",
  },
  {
    label: "서비스 가용성",
    value: "99.8%",
    delta: "목표 99.9%",
    deltaTone: "metric-neutral",
    note: "지난 24시간",
  },
  {
    label: "배포 상태",
    value: "v1.4.3",
    delta: "패치 2건 예정",
    deltaTone: "metric-neutral",
    note: "다음 윈도우 03-18",
  },
];

const services = [
  {
    name: "Auth Service",
    status: "정상",
    detail: "Avg 121ms · 오류 0.01%",
  },
  {
    name: "Match Service",
    status: "모니터링",
    detail: "Avg 210ms · 오류 0.18%",
  },
  {
    name: "Notification",
    status: "주의",
    detail: "지연 8분 → 복구",
  },
];

const incidentTimeline = [
  {
    id: "INC-77",
    time: "11:20",
    summary: "알림 지연 발생",
    action: "큐 재처리 후 정상화",
  },
  {
    id: "INC-76",
    time: "09:05",
    summary: "매칭 API 타임아웃",
    action: "DB 인덱스 점검 진행",
  },
  {
    id: "INC-75",
    time: "어제 22:40",
    summary: "배포 완료",
    action: "v1.4.3 프로덕션 반영",
  },
];

const maintenance = [
  {
    title: "DB 리인덱싱",
    window: "03-18 02:00",
    impact: "읽기 전용 전환 10분",
  },
  {
    title: "알림 서비스 개편",
    window: "03-19 01:00",
    impact: "API 5분 중단",
  },
];

const SystemPage = () => {
  return (
    <AdminLayout activePage="system">
      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">시스템 지표</h2>
          <span className="section-meta">실시간 동기화</span>
        </div>
        <div className="metric-grid">
          {systemMetrics.map((metric) => (
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
          <h2 className="section-title">서비스 상태</h2>
          <span className="section-meta">주요 마이크로서비스</span>
        </div>
        <div className="grid-3">
          {services.map((service) => (
            <div key={service.name} className="card simple-card">
              <h3 className="card-title">{service.name}</h3>
              <p className="card-highlight">{service.status}</p>
              <p className="card-meta">{service.detail}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">인시던트 타임라인</h2>
          <div className="section-actions">
            <button type="button" className="section-btn">
              보고서 다운로드
            </button>
            <button type="button" className="section-btn primary">
              포스트모템 작성
            </button>
          </div>
        </div>
        <div className="card simple-card">
          <ul className="card-list">
            {incidentTimeline.map((item) => (
              <li key={item.id}>
                <strong>{item.time}</strong> · {item.summary} — {item.action}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">예정된 점검</h2>
          <span className="section-meta">사전 공지 필요</span>
        </div>
        <div className="grid-2">
          {maintenance.map((task) => (
            <div key={task.title} className="card simple-card">
              <h3 className="card-title">{task.title}</h3>
              <p className="card-highlight">{task.window}</p>
              <p className="card-meta">{task.impact}</p>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
};

export default SystemPage;
