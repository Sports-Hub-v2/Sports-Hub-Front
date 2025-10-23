import AdminLayout from "../components/AdminLayout";

const liveMatches = [
  {
    id: "M-20412",
    league: "수도권 리그",
    status: "72'",
    venue: "탄천 종합운동장",
    home: { name: "FC 서울", score: 2 },
    away: { name: "부산 SC", score: 1 },
    highlights: ["68' 김민우 헤더 골", "55' GK 선방"],
  },
  {
    id: "M-20408",
    league: "전국 컵",
    status: "HT",
    venue: "잠실 보조 경기장",
    home: { name: "인천 유나이티드", score: 1 },
    away: { name: "대구 레인저스", score: 1 },
    highlights: ["23' 박지훈 중거리슛", "12' 선제 실점"],
  },
];

const upcomingMatches = [
  {
    id: "M-20420",
    league: "주말 친선",
    kickoff: "오늘 19:30",
    home: "울산 시티",
    away: "광주 플렉스",
    checklist: ["심판 배정 완료", "경기장 체크인 80%"],
  },
  {
    id: "M-20422",
    league: "기업 리그",
    kickoff: "오늘 21:00",
    home: "판교 밸류",
    away: "위워크 유나이티드",
    checklist: ["숙소 확정", "중계 스트림 준비"],
  },
  {
    id: "M-20425",
    league: "수도권 리그",
    kickoff: "내일 14:00",
    home: "성남 드래곤즈",
    away: "은평 FC",
    checklist: ["부상자 보고서 필요", "영상 장비 확인"],
  },
];

const matchStats = [
  {
    label: "오늘 경기",
    value: "6 경기",
    detail: "LIVE 3 · 예정 2 · 완료 1",
  },
  {
    label: "평균 득점",
    value: "2.8 골",
    detail: "지난주 대비 +0.4",
  },
  {
    label: "매칭 성공률",
    value: "92%",
    detail: "목표 90%",
  },
];

const officiatingQueue = [
  {
    id: "ASSIGN-19",
    task: "심판 교체",
    match: "M-20422",
    due: "18:30 이전",
    status: "대기",
  },
  {
    id: "ASSIGN-20",
    task: "경기장 점검",
    match: "M-20420",
    due: "17:00",
    status: "진행 중",
  },
  {
    id: "ASSIGN-21",
    task: "응급 키트 확인",
    match: "M-20425",
    due: "내일 11:00",
    status: "대기",
  },
];

const MatchesPage = () => {
  return (
    <AdminLayout activePage="matches">
      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">경기 요약</h2>
          <span className="section-meta">필드 운영 지표</span>
        </div>
        <div className="metric-grid">
          {matchStats.map((item) => (
            <div key={item.label} className="metric-card">
              <div className="metric-top">
                <span className="metric-label">{item.label}</span>
              </div>
              <strong className="metric-value">{item.value}</strong>
              <div className="metric-footer">
                <span className="metric-note">{item.detail}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">LIVE 경기 모니터링</h2>
          <div className="section-actions">
            <button type="button" className="section-btn">
              실시간 스트림 보기
            </button>
            <button type="button" className="section-btn primary">
              경기 상황 공유
            </button>
          </div>
        </div>
        <div className="grid-2">
          {liveMatches.map((match) => (
            <div key={match.id} className="card">
              <div className="card-header">
                <h3 className="card-title">{match.league}</h3>
                <span className="card-meta">{match.status}</span>
              </div>
              <div className="live-item status-live">
                <div className="live-team">
                  <span className="team-name">{match.home.name}</span>
                  <span className="team-score">{match.home.score}</span>
                </div>
                <span className="live-vs">vs</span>
                <div className="live-team">
                  <span className="team-name">{match.away.name}</span>
                  <span className="team-score">{match.away.score}</span>
                </div>
                <div className="live-meta">
                  <span>{match.venue}</span>
                  <span>{match.id}</span>
                </div>
              </div>
              <ul className="card-list">
                {match.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">다가오는 일정</h2>
          <span className="section-meta">체크리스트 기반 준비 현황</span>
        </div>
        <div className="grid-3">
          {upcomingMatches.map((match) => (
            <div key={match.id} className="card simple-card">
              <h3 className="card-title">{match.home} vs {match.away}</h3>
              <p className="card-highlight">{match.kickoff}</p>
              <p className="card-meta">{match.league}</p>
              <ul className="card-list">
                {match.checklist.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">현장 운영 태스크</h2>
          <span className="section-meta">담당자 배정 필요</span>
        </div>
        <div className="card table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>업무</th>
                <th>매치</th>
                <th>마감</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {officiatingQueue.map((task) => (
                <tr key={task.id}>
                  <td>{task.id}</td>
                  <td>{task.task}</td>
                  <td>{task.match}</td>
                  <td>{task.due}</td>
                  <td>
                    <span className={`status-pill ${task.status === "진행 중" ? "warning" : "neutral"}`}>
                      {task.status}
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

export default MatchesPage;
