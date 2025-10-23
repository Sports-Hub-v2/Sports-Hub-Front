import AdminLayout from "../components/AdminLayout";

const contentMetrics = [
  {
    label: "공지",
    value: "12",
    delta: "게시 9",
    deltaTone: "metric-neutral",
    note: "검수 3",
  },
  {
    label: "게시물",
    value: "48",
    delta: "검수 6",
    deltaTone: "metric-negative",
    note: "대기 5",
  },
  {
    label: "배너",
    value: "6",
    delta: "진행 2",
    deltaTone: "metric-positive",
    note: "예약 1",
  },
];

const pendingReviews = [
  {
    id: "CNT-320",
    type: "게시물",
    title: "주간 MVP 리뷰",
    author: "coach_lee",
    status: "검수 중",
    updatedAt: "어제 22:14",
  },
  {
    id: "CNT-318",
    type: "공지",
    title: "4월 리그 일정 안내",
    author: "운영팀",
    status: "게시",
    updatedAt: "오늘 09:20",
  },
  {
    id: "CNT-315",
    type: "배너",
    title: "스폰서 이벤트 안내",
    author: "marketing",
    status: "초안",
    updatedAt: "어제 18:02",
  },
];

const templateShortcuts = [
  {
    title: "공지 템플릿",
    highlight: "8개",
    meta: "최근 업데이트 3월 10일",
    actions: ["리그 일정", "점검 안내", "이벤트"]
  },
  {
    title: "신고 답변",
    highlight: "5개",
    meta: "담당자 배정 자동화",
    actions: ["폭언", "부정 행위", "노쇼"]
  },
  {
    title: "홍보 배너",
    highlight: "6개",
    meta: "A/B 테스트 진행",
    actions: ["스폰서", "리그 모집", "용병 모집"]
  },
];

const ContentPage = () => {
  return (
    <AdminLayout activePage="content">
      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">콘텐츠 현황</h2>
          <div className="section-actions">
            <button type="button" className="section-btn">
              템플릿 관리
            </button>
            <button type="button" className="section-btn primary">
              새 공지 작성
            </button>
          </div>
        </div>
        <div className="metric-grid">
          {contentMetrics.map((metric) => (
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
          <h2 className="section-title">검수 대기 목록</h2>
          <span className="section-meta">자동화 규칙: 긴급 공지 우선</span>
        </div>
        <div className="card table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>유형</th>
                <th>제목</th>
                <th>작성자</th>
                <th>상태</th>
                <th>업데이트</th>
              </tr>
            </thead>
            <tbody>
              {pendingReviews.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.type}</td>
                  <td>{item.title}</td>
                  <td>{item.author}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        item.status === "검수 중"
                          ? "warning"
                          : item.status === "게시"
                          ? "positive"
                          : "neutral"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{item.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">템플릿 & 워크플로우</h2>
          <span className="section-meta">빠른 액션</span>
        </div>
        <div className="grid-3">
          {templateShortcuts.map((template) => (
            <div key={template.title} className="card simple-card">
              <h3 className="card-title">{template.title}</h3>
              <p className="card-highlight">{template.highlight}</p>
              <p className="card-meta">{template.meta}</p>
              <div className="quick-actions">
                {template.actions.map((action) => (
                  <button key={action} type="button" className="quick-btn">
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </AdminLayout>
  );
};

export default ContentPage;

