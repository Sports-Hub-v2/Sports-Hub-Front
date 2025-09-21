import AdminLayout from "../components/AdminLayout";

type MetricTone = "positive" | "neutral" | "negative" | "warning" | "critical";


const kpiCards = [
  { label: "일일 활성 사용자", value: "12,480명", delta: "+8.2%", tone: "positive" as MetricTone },
  { label: "매칭 성사율", value: "78%", delta: "+2.4%", tone: "positive" as MetricTone },
  { label: "신규 가입", value: "246명", delta: "+12명", tone: "neutral" as MetricTone },
  { label: "CS 처리율", value: "92%", delta: "-3%", tone: "negative" as MetricTone },
];

const dashboardAlerts = [
  { label: "보안 경보", value: "1건", status: { text: "주의", tone: "critical" as MetricTone }, detail: "이상 로그인 차단" },
  { label: "서비스 장애", value: "0건", status: { text: "정상", tone: "positive" as MetricTone }, detail: "발견 없음" },
  { label: "고객 CS", value: "7건", status: { text: "처리 중", tone: "warning" as MetricTone }, detail: "우선 순위 확인" },
];

const dashboardTasks = [
  { title: "신규 팀 승인", owner: "운영1팀", due: "오늘 12시", status: { text: "대기", tone: "warning" as MetricTone } },
  { title: "매칭 취소 요청", owner: "운영2팀", due: "오늘 15시", status: { text: "확인 중", tone: "neutral" as MetricTone } },
  { title: "주간 리포트 검토", owner: "운영리드", due: "내일", status: { text: "준비", tone: "positive" as MetricTone } },
];

const userSummary = [
  { label: "전체 회원", value: "18,240명" },
  { label: "활성 회원", value: "15,872명" },
  { label: "검토 대상", value: "124명" },
  { label: "정지 회원", value: "41명" },
];

const userRows = [
  {
    id: "U-10432",
    name: "김도윤",
    email: "doyun.kim@example.com",
    region: "서울 강남",
    role: "일반",
    joinedAt: "2024-02-11",
    status: { text: "활성", tone: "positive" as MetricTone },
  },
  {
    id: "U-10401",
    name: "박서연",
    email: "seoyeon.park@example.com",
    region: "부산 해운대",
    role: "팀 리더",
    joinedAt: "2024-01-30",
    status: { text: "활성", tone: "positive" as MetricTone },
  },
  {
    id: "U-10388",
    name: "이현우",
    email: "hyunwoo.lee@example.com",
    region: "대전 유성",
    role: "일반",
    joinedAt: "2024-01-18",
    status: { text: "검토", tone: "warning" as MetricTone },
  },
  {
    id: "U-10372",
    name: "최민서",
    email: "minseo.choi@example.com",
    region: "인천 연수",
    role: "심판",
    joinedAt: "2023-12-22",
    status: { text: "정지", tone: "negative" as MetricTone },
  },
];

const userActivities = [
  { time: "09:15", description: "FC 비스트 팀 리더 권한 변경" },
  { time: "08:40", description: "신고 회원 (U-10372) 조치 완료" },
  { time: "어제", description: "신규 등급 정책 배포" },
];

const applicationSummary = [
  { label: "오늘 접수", value: "32건" },
  { label: "승인 대기", value: "18건" },
  { label: "승인 완료", value: "9건" },
  { label: "반려", value: "5건" },
];

const applicationRows = [
  {
    id: "A-2401",
    applicant: "문영빈",
    type: "팀 가입",
    target: "FC 네오",
    submittedAt: "2024-03-14 10:22",
    status: { text: "대기", tone: "warning" as MetricTone },
  },
  {
    id: "A-2394",
    applicant: "정하린",
    type: "매칭 신청",
    target: "4/2 토요 매치",
    submittedAt: "2024-03-14 09:05",
    status: { text: "검토 중", tone: "neutral" as MetricTone },
  },
  {
    id: "A-2388",
    applicant: "오지후",
    type: "팀 등록",
    target: "FC 솔라",
    submittedAt: "2024-03-13 18:42",
    status: { text: "승인", tone: "positive" as MetricTone },
  },
  {
    id: "A-2384",
    applicant: "배가윤",
    type: "팀 가입",
    target: "FC 프리즘",
    submittedAt: "2024-03-13 16:20",
    status: { text: "반려", tone: "negative" as MetricTone },
  },
];

const postSummary = [
  { label: "게시 중", value: "412건" },
  { label: "승인 대기", value: "17건" },
  { label: "신고 접수", value: "6건" },
  { label: "보류", value: "3건" },
];

const postRows = [
  {
    id: "P-7841",
    title: "4/2 토요 매치 - 용인 보정 체육공원",
    owner: "FC 네오",
    createdAt: "2024-03-13",
    status: { text: "승인 대기", tone: "warning" as MetricTone },
  },
  {
    id: "P-7836",
    title: "여성 풋살 클럽 신규 멤버 모집",
    owner: "SSS Ladies",
    createdAt: "2024-03-12",
    status: { text: "게시 중", tone: "positive" as MetricTone },
  },
  {
    id: "P-7830",
    title: "주중 야간 매치 (화/목) 함께 하실 분",
    owner: "Night Owls",
    createdAt: "2024-03-11",
    status: { text: "신고 접수", tone: "critical" as MetricTone },
  },
];

const teamSummary = [
  { label: "등록 팀", value: "286팀" },
  { label: "활성 팀", value: "241팀" },
  { label: "신규 요청", value: "8건" },
  { label: "휴면 전환", value: "5팀" },
];

const teamRows = [
  {
    id: "T-4012",
    name: "FC 네오",
    region: "서울",
    members: 18,
    leader: "김도윤",
    updatedAt: "2024-03-14",
    status: { text: "활성", tone: "positive" as MetricTone },
  },
  {
    id: "T-3988",
    name: "광안리 서퍼즈",
    region: "부산",
    members: 14,
    leader: "박서연",
    updatedAt: "2024-03-13",
    status: { text: "점검", tone: "warning" as MetricTone },
  },
  {
    id: "T-3924",
    name: "Night Owls",
    region: "경기",
    members: 19,
    leader: "최민서",
    updatedAt: "2024-03-11",
    status: { text: "휴면", tone: "neutral" as MetricTone },
  },
];

const notifications = [
  { type: "시스템", message: "결제 모듈 2회 지연 감지", time: "10분 전", status: { text: "중요", tone: "critical" as MetricTone } },
  { type: "운영", message: "신고 접수 (게시글 P-7830)", time: "35분 전", status: { text: "주의", tone: "warning" as MetricTone } },
  { type: "운영", message: "FC 네오 팀 승인 완료", time: "1시간 전", status: { text: "완료", tone: "positive" as MetricTone } },
  { type: "시스템", message: "백오피스 배포 v1.4 완료", time: "2시간 전", status: { text: "공지", tone: "neutral" as MetricTone } },
];

const reports = [
  { id: "R-229", target: "게시글 P-7830", reason: "부적절한 언어", status: { text: "조치 완료", tone: "positive" as MetricTone }, updatedAt: "2024-03-14" },
  { id: "R-228", target: "회원 U-10372", reason: "허위 매칭", status: { text: "조치 진행", tone: "warning" as MetricTone }, updatedAt: "2024-03-13" },
  { id: "R-227", target: "팀 T-3924", reason: "불성실 참여", status: { text: "모니터링", tone: "neutral" as MetricTone }, updatedAt: "2024-03-12" },
];

const systemMetrics = [
  { label: "API 평균 응답", value: "182ms", note: "-12%", tone: "positive" as MetricTone },
  { label: "오류율", value: "0.21%", note: "+0.05%", tone: "warning" as MetricTone },
  { label: "DB 연결", value: "정상", note: "12/12", tone: "positive" as MetricTone },
  { label: "배포 상태", value: "v1.4.3", note: "안정", tone: "neutral" as MetricTone },
];

const analyticsHighlights = [
  { label: "주간 예약 증가", value: "+18%", detail: "전주 대비" },
  { label: "재방문율", value: "42%", detail: "최근 30일" },
  { label: "평균 매칭 시간", value: "3.4일", detail: "요청 → 확정" },
];

const AdminWorkspace = () => {
  return (
    <AdminLayout>
      <div className="admin-sections">
        <section id="dashboard" className="admin-section">
          <div className="section-header">
            <h2 className="section-title">운영 대시보드</h2>
            <p className="section-subtitle">서비스 핵심 지표와 오늘의 우선 순위를 요약합니다.</p>
          </div>

          <div className="metric-grid">
            {kpiCards.map((card) => (
              <div key={card.label} className="metric-card">
                <span className="metric-label">{card.label}</span>
                <strong className="metric-value">{card.value}</strong>
                <span className={`metric-delta metric-${card.tone}`}>{card.delta}</span>
              </div>
            ))}
          </div>

          <div className="section-grid two-column">
            <div className="card">
              <div className="card-header">
                <h3 className="card-title">시스템 알림</h3>
                <span className="card-meta">실시간 모니터링</span>
              </div>
              <ul className="divide-list">
                {dashboardAlerts.map((alert) => (
                  <li key={alert.label} className="divide-item">
                    <div>
                      <span className="item-title">{alert.label}</span>
                      <p className="item-subtitle">{alert.detail}</p>
                    </div>
                    <div className="item-side">
                      <span className="item-value">{alert.value}</span>
                      <span className={`status-chip status-${alert.status.tone}`}>{alert.status.text}</span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">오늘의 운영 업무</h3>
                <span className="card-meta">우선 순위 정렬</span>
              </div>
              <ul className="timeline">
                {dashboardTasks.map((task) => (
                  <li key={task.title} className="timeline-item">
                    <div>
                      <span className="item-title">{task.title}</span>
                      <p className="item-subtitle">담당 {task.owner} · 마감 {task.due}</p>
                    </div>
                    <span className={`status-chip status-${task.status.tone}`}>{task.status.text}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="users" className="admin-section">
          <div className="section-header">
            <h2 className="section-title">회원 관리</h2>
            <p className="section-subtitle">회원 현황, 위험 계정, 최근 활동을 점검합니다.</p>
          </div>

          <div className="metric-grid compact">
            {userSummary.map((card) => (
              <div key={card.label} className="metric-card">
                <span className="metric-label">{card.label}</span>
                <strong className="metric-value">{card.value}</strong>
              </div>
            ))}
          </div>

          <div className="toolbar">
            <div className="filters">
              <input className="search-box" placeholder="이름, 이메일, 회원 ID 검색" />
              <select className="filter-select">
                <option>상태 전체</option>
                <option>활성</option>
                <option>검토</option>
                <option>정지</option>
              </select>
              <select className="filter-select">
                <option>권한 전체</option>
                <option>일반</option>
                <option>팀 리더</option>
                <option>운영자</option>
              </select>
            </div>
            <div className="toolbar-actions">
              <button className="btn btn-secondary" type="button">CSV 내보내기</button>
              <button className="btn btn-primary" type="button">새 회원 등록</button>
            </div>
          </div>

          <div className="section-grid two-column">
            <div className="card table-card">
              <div className="card-header">
                <h3 className="card-title">회원 목록</h3>
                <span className="card-meta">최근 24시간 업데이트</span>
              </div>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>회원</th>
                    <th>지역</th>
                    <th>권한</th>
                    <th>가입일</th>
                    <th>상태</th>
                  </tr>
                </thead>
                <tbody>
                  {userRows.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>
                        <div className="table-primary">{user.name}</div>
                        <div className="table-secondary">{user.email}</div>
                      </td>
                      <td>{user.region}</td>
                      <td>{user.role}</td>
                      <td>{user.joinedAt}</td>
                      <td>
                        <span className={`status-chip status-${user.status.tone}`}>{user.status.text}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="card">
              <div className="card-header">
                <h3 className="card-title">최근 조치 로그</h3>
                <span className="card-meta">지난 24시간</span>
              </div>
              <ul className="timeline">
                {userActivities.map((activity) => (
                  <li key={activity.description} className="timeline-item">
                    <div>
                      <span className="item-title">{activity.description}</span>
                      <p className="item-subtitle">{activity.time}</p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section id="applications" className="admin-section">
          <div className="section-header">
            <h2 className="section-title">가입 · 매칭 신청</h2>
            <p className="section-subtitle">처리 대기 건과 우선 검토 항목을 정리합니다.</p>
          </div>

          <div className="metric-grid compact">
            {applicationSummary.map((card) => (
              <div key={card.label} className="metric-card">
                <span className="metric-label">{card.label}</span>
                <strong className="metric-value">{card.value}</strong>
              </div>
            ))}
          </div>

          <div className="card table-card">
            <div className="card-header">
              <h3 className="card-title">신청 내역</h3>
              <span className="card-meta">승인 SLA 24시간</span>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>신청자</th>
                  <th>구분</th>
                  <th>대상</th>
                  <th>접수일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {applicationRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>{row.applicant}</td>
                    <td>{row.type}</td>
                    <td>{row.target}</td>
                    <td>{row.submittedAt}</td>
                    <td>
                      <span className={`status-chip status-${row.status.tone}`}>{row.status.text}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="posts" className="admin-section">
          <div className="section-header">
            <h2 className="section-title">모집글 관리</h2>
            <p className="section-subtitle">콘텐츠 품질과 신고 건을 우선 점검합니다.</p>
          </div>

          <div className="metric-grid compact">
            {postSummary.map((card) => (
              <div key={card.label} className="metric-card">
                <span className="metric-label">{card.label}</span>
                <strong className="metric-value">{card.value}</strong>
              </div>
            ))}
          </div>

          <div className="card table-card">
            <div className="card-header">
              <h3 className="card-title">게시글 상태</h3>
              <span className="card-meta">신고 접수 순</span>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>제목</th>
                  <th>작성 팀</th>
                  <th>등록일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {postRows.map((row) => (
                  <tr key={row.id}>
                    <td>{row.id}</td>
                    <td>
                      <div className="table-primary">{row.title}</div>
                      <div className="table-secondary">{row.owner}</div>
                    </td>
                    <td>{row.owner}</td>
                    <td>{row.createdAt}</td>
                    <td>
                      <span className={`status-chip status-${row.status.tone}`}>{row.status.text}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="teams" className="admin-section">
          <div className="section-header">
            <h2 className="section-title">팀 관리</h2>
            <p className="section-subtitle">팀 등록 상태와 활동 현황을 모니터링합니다.</p>
          </div>

          <div className="metric-grid compact">
            {teamSummary.map((card) => (
              <div key={card.label} className="metric-card">
                <span className="metric-label">{card.label}</span>
                <strong className="metric-value">{card.value}</strong>
              </div>
            ))}
          </div>

          <div className="card table-card">
            <div className="card-header">
              <h3 className="card-title">팀 목록</h3>
              <span className="card-meta">변경사항 최신순</span>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>팀명</th>
                  <th>지역</th>
                  <th>멤버 수</th>
                  <th>대표자</th>
                  <th>업데이트</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {teamRows.map((team) => (
                  <tr key={team.id}>
                    <td>{team.id}</td>
                    <td>{team.name}</td>
                    <td>{team.region}</td>
                    <td>{team.members}</td>
                    <td>{team.leader}</td>
                    <td>{team.updatedAt}</td>
                    <td>
                      <span className={`status-chip status-${team.status.tone}`}>{team.status.text}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="notifications" className="admin-section">
          <div className="section-header">
            <h2 className="section-title">알림 센터</h2>
            <p className="section-subtitle">시스템과 운영 이벤트를 중앙에서 관리합니다.</p>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">실시간 알림</h3>
              <span className="card-meta">가중치 우선순</span>
            </div>
            <ul className="timeline">
              {notifications.map((alert) => (
                <li key={`${alert.type}-${alert.message}`} className="timeline-item">
                  <div>
                    <span className="item-title">[{alert.type}] {alert.message}</span>
                    <p className="item-subtitle">{alert.time}</p>
                  </div>
                  <span className={`status-chip status-${alert.status.tone}`}>{alert.status.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section id="reports" className="admin-section">
          <div className="section-header">
            <h2 className="section-title">신고 처리</h2>
            <p className="section-subtitle">신고 접수 현황과 조치 내역을 확인합니다.</p>
          </div>

          <div className="card table-card">
            <div className="card-header">
              <h3 className="card-title">신고 목록</h3>
              <span className="card-meta">응답 SLA 12시간</span>
            </div>
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>대상</th>
                  <th>사유</th>
                  <th>상태</th>
                  <th>업데이트</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.id}>
                    <td>{report.id}</td>
                    <td>{report.target}</td>
                    <td>{report.reason}</td>
                    <td>
                      <span className={`status-chip status-${report.status.tone}`}>{report.status.text}</span>
                    </td>
                    <td>{report.updatedAt}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="system" className="admin-section">
          <div className="section-header">
            <h2 className="section-title">시스템 모니터링</h2>
            <p className="section-subtitle">가용성, 배포, 확장성 지표를 확인합니다.</p>
          </div>

          <div className="metric-grid compact">
            {systemMetrics.map((metric) => (
              <div key={metric.label} className="metric-card">
                <span className="metric-label">{metric.label}</span>
                <strong className="metric-value">{metric.value}</strong>
                <span className={`metric-delta metric-${metric.tone}`}>{metric.note}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="analytics" className="admin-section">
          <div className="section-header">
            <h2 className="section-title">지표 분석</h2>
            <p className="section-subtitle">주요 성장 지표와 사용자 행동을 요약합니다.</p>
          </div>

          <div className="metric-grid compact">
            {analyticsHighlights.map((item) => (
              <div key={item.label} className="metric-card">
                <span className="metric-label">{item.label}</span>
                <strong className="metric-value">{item.value}</strong>
                <span className="metric-note">{item.detail}</span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
};

export default AdminWorkspace;
