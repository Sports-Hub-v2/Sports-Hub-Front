import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";

const todaySchedule = [
  {
    id: "M-20412",
    venue: "탄천 종합운동장",
    time: "14:00",
    home: { name: "FC 서울" },
    away: { name: "부산 SC" },
    notes: ["경기장 확정", "인원 확인 완료"],
  },
  {
    id: "M-20408",
    venue: "잠실 보조경기장",
    time: "16:30",
    home: { name: "인천 유나이티드" },
    away: { name: "대구 레인저스" },
    notes: ["주차 공간 협의 필요", "우천 시 실내구장 대체"],
  },
];

const upcomingMatches = [
  {
    id: "M-20420",
    venue: "반포 한강공원",
    kickoff: "오늘 19:00",
    home: "울산 시티",
    away: "광주 플렉스",
    checklist: ["경기장 예약 확정", "팀원 참석 확인 완료"],
  },
  {
    id: "M-20422",
    venue: "서울숲 축구장",
    kickoff: "오늘 21:00",
    home: "판교 밸류",
    away: "위워크 유나이티드",
    checklist: ["경기 공 확인", "조명 시설 점검"],
  },
  {
    id: "M-20425",
    venue: "양재천 체육공원",
    kickoff: "내일 14:00",
    home: "성남 드래곤즈",
    away: "은평 FC",
    checklist: ["날씨 확인 필요", "대체 경기장 예비"],
  },
];

const matchStats = [
  {
    label: "오늘 경기",
    value: "8 경기",
    detail: "확정 5 · 대기 3",
  },
  {
    label: "경기장 이용률",
    value: "87%",
    detail: "이번 주 평균",
  },
  {
    label: "매칭 성공률",
    value: "92%",
    detail: "목표 90%",
  },
];

const completedMatches = [
  {
    id: "M-20401",
    venue: "탄천 종합운동장",
    time: "06:00",
    home: { name: "강남 FC", score: 3 },
    away: { name: "서초 유나이티드", score: 2 },
    status: "완료",
    result: "강남 FC 승리",
  },
  {
    id: "M-20402",
    venue: "올림픽공원 축구장",
    time: "07:30",
    home: { name: "송파 드래곤즈", score: 1 },
    away: { name: "강동 FC", score: 1 },
    status: "완료",
    result: "무승부",
  },
  {
    id: "M-20403",
    venue: "잠실 보조경기장",
    time: "08:00",
    home: { name: "광진 FC", score: 0 },
    away: { name: "성동 유나이티드", score: 2 },
    status: "완료",
    result: "성동 유나이티드 승리",
  },
];

const venueManagementQueue = [
  {
    id: "VENUE-19",
    task: "경기장 예약 확인",
    match: "M-20422",
    due: "18:30 이전",
    status: "대기",
  },
  {
    id: "VENUE-20",
    task: "경기장 시설 점검",
    match: "M-20420",
    due: "17:00",
    status: "진행 중",
  },
  {
    id: "VENUE-21",
    task: "우천 대비 대체구장",
    match: "M-20425",
    due: "내일 11:00",
    status: "대기",
  },
];

const MatchesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const filterState = location.state as { filter?: string; date?: string; description?: string } | null;

  const clearFilter = () => {
    navigate('/admin/matches', { replace: true, state: {} });
  };

  const isFilterActive = filterState?.filter === 'today-completed';

  return (
    <AdminLayout activePage="matches">
      {/* Filter Banner */}
      {isFilterActive && (
        <div
          style={{
            background: "linear-gradient(135deg, var(--admin-primary) 0%, #0066ff 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 12px rgba(0, 123, 255, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "20px" }}>📊</span>
            <div>
              <div style={{ color: "white", fontWeight: "600", fontSize: "15px" }}>
                필터 적용 중: {filterState?.description}
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "13px", marginTop: "2px" }}>
                날짜: {filterState?.date}
              </div>
            </div>
          </div>
          <button
            onClick={clearFilter}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "8px",
              color: "white",
              padding: "8px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            }}
          >
            <X size={16} />
            필터 해제
          </button>
        </div>
      )}

      {/* Show only completed matches when filter is active */}
      {isFilterActive ? (
        <section className="admin-section">
          <div className="section-header">
            <h2 className="section-title">오늘 완료된 경기</h2>
            <span className="section-meta">{completedMatches.length}건의 경기 결과</span>
          </div>
          <div className="grid-2">
            {completedMatches.map((match) => (
              <div key={match.id} className="card">
                <div className="card-header">
                  <h3 className="card-title">{match.venue}</h3>
                  <span className="card-meta">{match.time}</span>
                </div>
                <div className="live-item status-completed" style={{ background: "var(--admin-bg-tertiary)" }}>
                  <div className="live-team">
                    <span className="team-name">{match.home.name}</span>
                    <span style={{ fontSize: "24px", fontWeight: "700", color: "var(--admin-text)", marginLeft: "12px" }}>
                      {match.home.score}
                    </span>
                  </div>
                  <span className="live-vs">:</span>
                  <div className="live-team">
                    <span style={{ fontSize: "24px", fontWeight: "700", color: "var(--admin-text)", marginRight: "12px" }}>
                      {match.away.score}
                    </span>
                    <span className="team-name">{match.away.name}</span>
                  </div>
                  <div className="live-meta">
                    <span style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>{match.id}</span>
                  </div>
                </div>
                <div style={{
                  marginTop: "12px",
                  padding: "12px",
                  background: "var(--admin-bg-secondary)",
                  borderRadius: "8px",
                  textAlign: "center"
                }}>
                  <span style={{
                    fontSize: "14px",
                    fontWeight: "600",
                    color: match.result.includes("무승부") ? "var(--admin-warning)" : "var(--admin-success)"
                  }}>
                    {match.result}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <>
          <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">경기 요약</h2>
          <span className="section-meta">매칭 및 경기장 이용 현황</span>
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
          <h2 className="section-title">오늘 예정 경기</h2>
          <div className="section-actions">
            <button type="button" className="section-btn">
              경기장 지도 보기
            </button>
            <button type="button" className="section-btn primary">
              새 매치 등록
            </button>
          </div>
        </div>
        <div className="grid-2">
          {todaySchedule.map((match) => (
            <div key={match.id} className="card">
              <div className="card-header">
                <h3 className="card-title">{match.venue}</h3>
                <span className="card-meta">{match.time}</span>
              </div>
              <div className="live-item status-scheduled">
                <div className="live-team">
                  <span className="team-name">{match.home.name}</span>
                </div>
                <span className="live-vs">vs</span>
                <div className="live-team">
                  <span className="team-name">{match.away.name}</span>
                </div>
                <div className="live-meta">
                  <span style={{ fontSize: '12px', color: 'var(--admin-text-secondary)' }}>{match.id}</span>
                </div>
              </div>
              <ul className="card-list">
                {match.notes.map((note) => (
                  <li key={note}>{note}</li>
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
              <p className="card-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                📍 {match.venue}
              </p>
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
          <h2 className="section-title">경기장 관리 태스크</h2>
          <span className="section-meta">경기장 예약 및 시설 관리</span>
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
              {venueManagementQueue.map((task) => (
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
        </>
      )}
    </AdminLayout>
  );
};

export default MatchesPage;
