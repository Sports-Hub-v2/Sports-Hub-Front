import AdminLayout from "../components/AdminLayout";

const reportMetrics = [
  {
    label: "대기 신고",
    value: "4",
    delta: "SLA 12h",
    deltaTone: "metric-negative",
    note: "긴급 1",
  },
  {
    label: "오늘 처리",
    value: "18",
    delta: "+5",
    deltaTone: "metric-positive",
    note: "목표 20",
  },
  {
    label: "자동 분류",
    value: "82%",
    delta: "+6%",
    deltaTone: "metric-positive",
    note: "정확도",
  },
];

const reportQueue = [
  {
    id: "R-9821",
    type: "폭언",
    target: "매치 M-20412",
    severity: "긴급",
    status: "배정 대기",
    receivedAt: "11:42",
  },
  {
    id: "R-9819",
    type: "부정 행위",
    target: "팀 T-334",
    severity: "높음",
    status: "검토 중",
    receivedAt: "10:58",
  },
  {
    id: "R-9815",
    type: "스팸",
    target: "게시물 P-774",
    severity: "보통",
    status: "대기",
    receivedAt: "09:31",
  },
  {
    id: "R-9809",
    type: "불참 신고",
    target: "플레이어 U-1231",
    severity: "낮음",
    status: "완료",
    receivedAt: "08:47",
  },
];

const timeline = [
  {
    id: "TL-01",
    time: "11:30",
    title: "신고 자동 분류",
    description: "폭언 신고 → 긴급",
  },
  {
    id: "TL-02",
    time: "10:40",
    title: "현장 대응 보고",
    description: "부정 행위 증빙 수집",
  },
  {
    id: "TL-03",
    time: "09:50",
    title: "팀 리더 피드백",
    description: "재발 방지 계획 수신",
  },
];

const autoRules = [
  {
    title: "노쇼 자동 제재",
    highlight: "경고 1회",
    meta: "노쇼 2회시 1주 활동 제한",
    items: ["매칭 자체 환불 안내", "팀 리더 알림", "CSR 티켓 생성"],
  },
  {
    title: "폭언 신고",
    highlight: "전담자 알림",
    meta: "카테고리: 즉시 대응",
    items: ["녹취 업로드 요청", "40분 내 1차 답변", "사후 교육 안내"],
  },
  {
    title: "부정 행위",
    highlight: "AI 분류",
    meta: "정확도 87%",
    items: ["영상 증거 수집", "팀 포인트 제재", "재심 24시간"],
  },
];

const ReportsPage = () => {
  return (
    <AdminLayout activePage="reports">
      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">신고 요약</h2>
          <span className="section-meta">SLA 12시간 기준</span>
        </div>
        <div className="metric-grid">
          {reportMetrics.map((metric) => (
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
          <h2 className="section-title">처리 큐</h2>
          <div className="section-actions">
            <button type="button" className="section-btn">
              담당자 배정
            </button>
            <button type="button" className="section-btn primary">
              SLA 초과 항목
            </button>
          </div>
        </div>
        <div className="card table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>유형</th>
                <th>대상</th>
                <th>심각도</th>
                <th>상태</th>
                <th>접수</th>
              </tr>
            </thead>
            <tbody>
              {reportQueue.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.type}</td>
                  <td>{item.target}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        item.severity === "긴급"
                          ? "danger"
                          : item.severity === "높음"
                          ? "warning"
                          : item.severity === "보통"
                          ? "neutral"
                          : "positive"
                      }`}
                    >
                      {item.severity}
                    </span>
                  </td>
                  <td>{item.status}</td>
                  <td>{item.receivedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">처리 타임라인</h2>
          <span className="section-meta">최근 3개 이벤트</span>
        </div>
        <div className="card simple-card">
          <ul className="card-list">
            {timeline.map((event) => (
              <li key={event.id}>
                <strong>{event.time}</strong> · {event.title} — {event.description}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">자동화 규칙</h2>
          <span className="section-meta">업데이트 2024-03-12</span>
        </div>
        <div className="grid-3">
          {autoRules.map((rule) => (
            <div key={rule.title} className="card simple-card">
              <h3 className="card-title">{rule.title}</h3>
              <p className="card-highlight">{rule.highlight}</p>
              <p className="card-meta">{rule.meta}</p>
              <ul className="card-list">
                {rule.items.map((item) => (
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

export default ReportsPage;
