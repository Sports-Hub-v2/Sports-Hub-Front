import AdminLayout from "../components/AdminLayout";

const approvalFlow = [
  "1단계 · 신고 자동 분류",
  "2단계 · 운영자 검토",
  "3단계 · 팀 리더 피드백",
  "4단계 · 결과 안내",
];

const roles = [
  {
    name: "운영 관리자",
    permissions: ["신고 배정", "공지 게시", "팀 승인"],
  },
  {
    name: "현장 운영",
    permissions: ["매치 등록", "용병 승인", "팀 지원"],
  },
  {
    name: "시스템 관리자",
    permissions: ["배포 승인", "모니터링 설정", "API 키 관리"],
  },
];

const automations = [
  {
    title: "신고 SLA 경고",
    highlight: "12시간",
    meta: "초과 시 슬랙 알림",
    list: ["긴급 신고는 6시간", "자동 재배정", "담당자 리마인드"],
  },
  {
    title: "용병 승인",
    highlight: "AI 추천",
    meta: "검증 점수 80점 이상",
    list: ["프로필 자동 검사", "경기력 로그 분석", "거절 사유 템플릿"],
  },
  {
    title: "공지 예약",
    highlight: "캘린더 연동",
    meta: "경기 일정 자동 반영",
    list: ["중복 일정 감지", "템플릿 추천", "게시 후 슬랙 공유"],
  },
];

const integrations = [
  {
    id: "INT-01",
    service: "Slack",
    scope: "알림 채널",
    status: "연결",
  },
  {
    id: "INT-02",
    service: "Notion",
    scope: "포스트모템",
    status: "연결",
  },
  {
    id: "INT-03",
    service: "Datadog",
    scope: "APM",
    status: "연결 대기",
  },
];

const SettingsPage = () => {
  return (
    <AdminLayout activePage="settings">
      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">승인 단계</h2>
          <div className="section-actions">
            <button type="button" className="section-btn">
              히스토리 보기
            </button>
            <button type="button" className="section-btn primary">
              단계 수정
            </button>
          </div>
        </div>
        <div className="card simple-card">
          <ul className="card-list">
            {approvalFlow.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">역할 & 권한</h2>
          <span className="section-meta">최근 업데이트 2024-03-12</span>
        </div>
        <div className="grid-3">
          {roles.map((role) => (
            <div key={role.name} className="card simple-card">
              <h3 className="card-title">{role.name}</h3>
              <ul className="card-list">
                {role.permissions.map((permission) => (
                  <li key={permission}>{permission}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">자동화 규칙</h2>
          <span className="section-meta">운영 효율화</span>
        </div>
        <div className="grid-3">
          {automations.map((rule) => (
            <div key={rule.title} className="card simple-card">
              <h3 className="card-title">{rule.title}</h3>
              <p className="card-highlight">{rule.highlight}</p>
              <p className="card-meta">{rule.meta}</p>
              <ul className="card-list">
                {rule.list.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">외부 연동</h2>
          <span className="section-meta">API 키 관리</span>
        </div>
        <div className="card table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>서비스</th>
                <th>사용 범위</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {integrations.map((integration) => (
                <tr key={integration.id}>
                  <td>{integration.id}</td>
                  <td>{integration.service}</td>
                  <td>{integration.scope}</td>
                  <td>
                    <span className={`status-pill ${integration.status === "연결" ? "positive" : "warning"}`}>
                      {integration.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AdminLayout>
  );
};

export default SettingsPage;
