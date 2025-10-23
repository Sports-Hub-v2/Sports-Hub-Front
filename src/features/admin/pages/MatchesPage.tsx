import { useLocation, useNavigate } from "react-router-dom";
import { X, Search, Calendar, Filter, ChevronDown } from "lucide-react";
import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import MatchDetailModal from "../components/MatchDetailModal";

const todaySchedule = [
  {
    id: "M-20412",
    venue: "탄천 종합운동장",
    time: "14:00",
    date: "2025-10-24",
    home: { id: 1, name: "FC 서울" },
    away: { id: 2, name: "부산 SC" },
    status: "scheduled" as const,
    notes: ["경기장 확정", "인원 확인 완료"],
    referee: "김철수",
    weather: "맑음 ☀️",
  },
  {
    id: "M-20408",
    venue: "잠실 보조경기장",
    time: "16:30",
    date: "2025-10-24",
    home: { id: 3, name: "인천 유나이티드" },
    away: { id: 4, name: "대구 레인저스" },
    status: "scheduled" as const,
    notes: ["주차 공간 협의 필요", "우천 시 실내구장 대체"],
    referee: "박영희",
    weather: "흐림 ☁️",
  },
];

const upcomingMatches = [
  {
    id: "M-20420",
    venue: "반포 한강공원",
    time: "19:00",
    date: "2025-10-24",
    home: { id: 5, name: "울산 시티" },
    away: { id: 6, name: "광주 플렉스" },
    status: "scheduled" as const,
    notes: ["경기장 예약 확정", "팀원 참석 확인 완료"],
    referee: "이민수",
  },
  {
    id: "M-20422",
    venue: "서울숲 축구장",
    time: "21:00",
    date: "2025-10-24",
    home: { id: 7, name: "판교 밸류" },
    away: { id: 8, name: "위워크 유나이티드" },
    status: "scheduled" as const,
    notes: ["경기 공 확인", "조명 시설 점검"],
    referee: "정수진",
  },
  {
    id: "M-20425",
    venue: "양재천 체육공원",
    time: "14:00",
    date: "2025-10-25",
    home: { id: 9, name: "성남 드래곤즈" },
    away: { id: 10, name: "은평 FC" },
    status: "scheduled" as const,
    notes: ["날씨 확인 필요", "대체 경기장 예비"],
    referee: "최영호",
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
    date: "2025-10-24",
    home: { id: 11, name: "강남 FC", score: 3 },
    away: { id: 12, name: "서초 유나이티드", score: 2 },
    status: "completed" as const,
    result: "강남 FC 승리",
    referee: "홍길동",
    attendance: 150,
    weather: "맑음 ☀️",
  },
  {
    id: "M-20402",
    venue: "올림픽공원 축구장",
    time: "07:30",
    date: "2025-10-24",
    home: { id: 13, name: "송파 드래곤즈", score: 1 },
    away: { id: 14, name: "강동 FC", score: 1 },
    status: "completed" as const,
    result: "무승부",
    referee: "김영수",
    attendance: 120,
    weather: "맑음 ☀️",
  },
  {
    id: "M-20403",
    venue: "잠실 보조경기장",
    time: "08:00",
    date: "2025-10-24",
    home: { id: 15, name: "광진 FC", score: 0 },
    away: { id: 16, name: "성동 유나이티드", score: 2 },
    status: "completed" as const,
    result: "성동 유나이티드 승리",
    referee: "이상민",
    attendance: 80,
    weather: "흐림 ☁️",
  },
];

// 전체 경기 목록 (과거, 현재, 미래 모두 포함)
const allMatches = [
  // 어제 완료된 경기들
  {
    id: "M-20301",
    venue: "한강공원 축구장",
    time: "06:00",
    date: "2025-10-23",
    home: { id: 17, name: "마포 FC", score: 2 },
    away: { id: 18, name: "용산 유나이티드", score: 1 },
    status: "completed" as const,
    referee: "박민수",
    attendance: 100,
    weather: "맑음 ☀️",
  },
  {
    id: "M-20302",
    venue: "여의도 공원",
    time: "07:00",
    date: "2025-10-23",
    home: { id: 19, name: "영등포 FC", score: 3 },
    away: { id: 20, name: "구로 FC", score: 3 },
    status: "completed" as const,
    referee: "이철수",
    attendance: 85,
    weather: "흐림 ☁️",
  },
  {
    id: "M-20303",
    venue: "월드컵공원",
    time: "14:00",
    date: "2025-10-23",
    home: { id: 10, name: "은평 FC", score: 1 },
    away: { id: 21, name: "서대문 FC", score: 0 },
    status: "completed" as const,
    referee: "김영희",
    attendance: 120,
    weather: "맑음 ☀️",
  },
  {
    id: "M-20304",
    venue: "서울숲 축구장",
    time: "16:00",
    date: "2025-10-23",
    home: { id: 22, name: "성동 FC", score: 2 },
    away: { id: 23, name: "동대문 FC", score: 2 },
    status: "completed" as const,
    referee: "정수진",
    attendance: 95,
    weather: "맑음 ☀️",
  },

  // 오늘 완료된 경기
  ...completedMatches,

  // 오늘 예정된 경기
  ...todaySchedule,

  // 오늘 및 향후 예정된 경기
  ...upcomingMatches,

  // 내일 예정된 경기들
  {
    id: "M-20501",
    venue: "강서 스포츠파크",
    time: "06:30",
    date: "2025-10-25",
    home: { id: 24, name: "강서 FC" },
    away: { id: 25, name: "양천 FC" },
    status: "scheduled" as const,
    notes: ["경기장 확정", "주차 공간 확보"],
    referee: "한지수",
    weather: "맑음 예상",
  },
  {
    id: "M-20502",
    venue: "목동 종합운동장",
    time: "08:00",
    date: "2025-10-25",
    home: { id: 26, name: "목동 유나이티드" },
    away: { id: 27, name: "신촌 FC" },
    status: "scheduled" as const,
    notes: ["경기장 예약 완료"],
    referee: "오민석",
    weather: "맑음 예상",
  },
  {
    id: "M-20503",
    venue: "관악 체육공원",
    time: "10:00",
    date: "2025-10-25",
    home: { id: 28, name: "관악 FC" },
    away: { id: 29, name: "동작 FC" },
    status: "scheduled" as const,
    notes: ["용품 준비 완료"],
    referee: "임성호",
    weather: "흐림 예상",
  },

  // 모레 예정된 경기들
  {
    id: "M-20601",
    venue: "노원 종합운동장",
    time: "07:00",
    date: "2025-10-26",
    home: { id: 30, name: "노원 FC" },
    away: { id: 31, name: "도봉 FC" },
    status: "scheduled" as const,
    notes: ["경기장 확정 대기"],
    referee: "미정",
    weather: "맑음 예상",
  },
  {
    id: "M-20602",
    venue: "중랑천 체육공원",
    time: "09:00",
    date: "2025-10-26",
    home: { id: 32, name: "중랑 FC" },
    away: { id: 33, name: "광진 유나이티드" },
    status: "scheduled" as const,
    notes: ["대체 경기장 준비"],
    referee: "미정",
    weather: "흐림 예상",
  },
  {
    id: "M-20603",
    venue: "강북 축구장",
    time: "14:00",
    date: "2025-10-26",
    home: { id: 34, name: "강북 FC" },
    away: { id: 35, name: "성북 FC" },
    status: "scheduled" as const,
    notes: ["심판 배정 대기"],
    referee: "미정",
    weather: "맑음 예상",
  },

  // 다음주 경기들
  {
    id: "M-20701",
    venue: "잠실 종합운동장",
    time: "10:00",
    date: "2025-10-27",
    home: { id: 13, name: "송파 FC" },
    away: { id: 36, name: "강남 유나이티드" },
    status: "scheduled" as const,
    notes: ["특별 경기"],
    referee: "미정",
    weather: "확인 필요",
  },
  {
    id: "M-20702",
    venue: "반포 한강공원",
    time: "15:00",
    date: "2025-10-28",
    home: { id: 12, name: "서초 FC" },
    away: { id: 37, name: "강남 드래곤즈" },
    status: "scheduled" as const,
    notes: ["우천 시 취소"],
    referee: "미정",
    weather: "확인 필요",
  },

  // 취소된 경기
  {
    id: "M-20199",
    venue: "양재천 축구장",
    time: "14:00",
    date: "2025-10-22",
    home: { id: 12, name: "서초 FC" },
    away: { id: 11, name: "강남 FC" },
    status: "cancelled" as const,
    notes: ["우천으로 인한 취소"],
    referee: "김철수",
    weather: "비 🌧️",
  },
];

const MatchesPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const filterState = location.state as { filter?: string; date?: string; description?: string } | null;

  const [selectedMatch, setSelectedMatch] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 전체 경기 필터 상태
  const [matchFilters, setMatchFilters] = useState({
    status: 'all', // all, scheduled, in_progress, completed, cancelled
    dateRange: 'all', // all, today, yesterday, tomorrow, week, custom
    dateFrom: '',
    dateTo: '',
    searchQuery: '',
  });

  const clearFilter = () => {
    navigate('/admin/matches', { replace: true, state: {} });
  };

  const isFilterActive = filterState?.filter === 'today-completed';

  const handleMatchClick = (match: any) => {
    setSelectedMatch(match);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedMatch(null);
  };

  // 날짜 범위 빠른 선택 핸들러
  const handleQuickDateSelect = (range: string) => {
    const today = new Date('2025-10-24');
    let dateFrom = '';
    let dateTo = '';

    switch (range) {
      case 'yesterday':
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        dateFrom = dateTo = yesterday.toISOString().split('T')[0];
        break;
      case 'today':
        dateFrom = dateTo = today.toISOString().split('T')[0];
        break;
      case 'tomorrow':
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        dateFrom = dateTo = tomorrow.toISOString().split('T')[0];
        break;
      case 'week':
        dateFrom = today.toISOString().split('T')[0];
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);
        dateTo = nextWeek.toISOString().split('T')[0];
        break;
      case 'all':
        dateFrom = dateTo = '';
        break;
    }

    setMatchFilters({
      ...matchFilters,
      dateRange: range,
      dateFrom,
      dateTo,
    });
  };

  // 필터링된 경기 목록
  const filteredMatches = allMatches.filter(match => {
    // 상태 필터
    if (matchFilters.status !== 'all' && match.status !== matchFilters.status) {
      return false;
    }

    // 날짜 필터
    if (matchFilters.dateFrom && match.date < matchFilters.dateFrom) {
      return false;
    }
    if (matchFilters.dateTo && match.date > matchFilters.dateTo) {
      return false;
    }

    // 검색어 필터
    if (matchFilters.searchQuery) {
      const query = matchFilters.searchQuery.toLowerCase();
      const matchText = `${match.home.name} ${match.away.name} ${match.venue} ${match.id}`.toLowerCase();
      if (!matchText.includes(query)) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    // 날짜 + 시간 기준 정렬
    const dateTimeA = `${a.date} ${a.time}`;
    const dateTimeB = `${b.date} ${b.time}`;
    return dateTimeB.localeCompare(dateTimeA); // 최신순
  });

  // 상태별 경기 수 계산
  const matchCounts = {
    all: allMatches.length,
    scheduled: allMatches.filter(m => m.status === 'scheduled').length,
    completed: allMatches.filter(m => m.status === 'completed').length,
    cancelled: allMatches.filter(m => m.status === 'cancelled').length,
  };

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
              <div
                key={match.id}
                className="card"
                onClick={() => handleMatchClick(match)}
                style={{ cursor: 'pointer' }}
              >
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
            <div
              key={match.id}
              className="card"
              onClick={() => handleMatchClick(match)}
              style={{ cursor: 'pointer' }}
            >
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
            <div
              key={match.id}
              className="card simple-card"
              onClick={() => handleMatchClick(match)}
              style={{ cursor: 'pointer' }}
            >
              <h3 className="card-title">{match.home.name} vs {match.away.name}</h3>
              <p className="card-highlight">{match.date} {match.time}</p>
              <p className="card-meta" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                📍 {match.venue}
              </p>
              <ul className="card-list">
                {match.notes?.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">오늘 완료된 경기</h2>
          <span className="section-meta">{completedMatches.length}건의 경기 결과</span>
        </div>
        <div className="grid-2">
          {completedMatches.map((match) => (
            <div
              key={match.id}
              className="card"
              onClick={() => handleMatchClick(match)}
              style={{ cursor: 'pointer' }}
            >
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

      {/* 전체 경기 관리 섹션 */}
      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">전체 경기 관리</h2>
          <span className="section-meta">총 {allMatches.length}개 경기 · 필터링 결과 {filteredMatches.length}개</span>
        </div>

        {/* 필터 영역 */}
        <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
          {/* 빠른 필터 버튼들 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Filter className="w-4 h-4" style={{ color: 'var(--admin-text-secondary)' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--admin-text)' }}>빠른 날짜 선택</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { value: 'all', label: '전체', icon: '📅' },
                { value: 'yesterday', label: '어제', icon: '⏮️' },
                { value: 'today', label: '오늘', icon: '📍' },
                { value: 'tomorrow', label: '내일', icon: '⏭️' },
                { value: 'week', label: '이번 주', icon: '📆' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => handleQuickDateSelect(option.value)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    matchFilters.dateRange === option.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span style={{ marginRight: '4px' }}>{option.icon}</span>
                  {option.label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Filter className="w-4 h-4" style={{ color: 'var(--admin-text-secondary)' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--admin-text)' }}>경기 상태</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { value: 'all', label: '전체', count: matchCounts.all, icon: '🏟️' },
                { value: 'scheduled', label: '예정', count: matchCounts.scheduled, icon: '⏰' },
                { value: 'completed', label: '완료', count: matchCounts.completed, icon: '✅' },
                { value: 'cancelled', label: '취소', count: matchCounts.cancelled, icon: '❌' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setMatchFilters({ ...matchFilters, status: option.value })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    matchFilters.status === option.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span style={{ marginRight: '4px' }}>{option.icon}</span>
                  {option.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    matchFilters.status === option.value
                      ? 'bg-white/20'
                      : 'bg-gray-200'
                  }`}>
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 검색 및 상세 필터 */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px' }}>
            {/* 검색 */}
            <div style={{ position: 'relative' }}>
              <Search className="w-4 h-4" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-secondary)' }} />
              <input
                type="text"
                placeholder="팀명, 경기장, 경기 ID 검색..."
                value={matchFilters.searchQuery}
                onChange={(e) => setMatchFilters({ ...matchFilters, searchQuery: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px 12px 10px 40px',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'var(--admin-bg)',
                  color: 'var(--admin-text)',
                }}
              />
            </div>

            {/* 시작 날짜 */}
            <div>
              <input
                type="date"
                value={matchFilters.dateFrom}
                onChange={(e) => setMatchFilters({ ...matchFilters, dateFrom: e.target.value, dateRange: 'custom' })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'var(--admin-bg)',
                  color: 'var(--admin-text)',
                }}
              />
            </div>

            {/* 종료 날짜 */}
            <div>
              <input
                type="date"
                value={matchFilters.dateTo}
                onChange={(e) => setMatchFilters({ ...matchFilters, dateTo: e.target.value, dateRange: 'custom' })}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'var(--admin-bg)',
                  color: 'var(--admin-text)',
                }}
              />
            </div>
          </div>

          {/* 필터 초기화 버튼 */}
          {(matchFilters.status !== 'all' || matchFilters.dateRange !== 'all' || matchFilters.searchQuery) && (
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setMatchFilters({
                  status: 'all',
                  dateRange: 'all',
                  dateFrom: '',
                  dateTo: '',
                  searchQuery: '',
                })}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <X className="w-4 h-4 inline mr-1" />
                필터 초기화
              </button>
            </div>
          )}
        </div>

        {/* 경기 목록 테이블 */}
        <div className="card table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>경기 ID</th>
                <th>날짜</th>
                <th>시간</th>
                <th>홈팀</th>
                <th>원정팀</th>
                <th>스코어</th>
                <th>경기장</th>
                <th>심판</th>
                <th>상태</th>
              </tr>
            </thead>
            <tbody>
              {filteredMatches.length > 0 ? (
                filteredMatches.map((match) => (
                  <tr
                    key={match.id}
                    onClick={() => handleMatchClick(match)}
                    style={{ cursor: 'pointer' }}
                    className="hover:bg-gray-50"
                  >
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: '600', color: 'var(--admin-primary)' }}>
                        {match.id}
                      </span>
                    </td>
                    <td>{match.date}</td>
                    <td>{match.time}</td>
                    <td style={{ fontWeight: '600' }}>{match.home.name}</td>
                    <td style={{ fontWeight: '600' }}>{match.away.name}</td>
                    <td>
                      {match.status === 'completed' ? (
                        <span style={{ fontWeight: '700', fontSize: '15px' }}>
                          {match.home.score} : {match.away.score}
                        </span>
                      ) : (
                        <span style={{ color: 'var(--admin-text-secondary)' }}>-</span>
                      )}
                    </td>
                    <td>{match.venue}</td>
                    <td>{match.referee || '미정'}</td>
                    <td>
                      <span className={`status-pill ${
                        match.status === 'scheduled' ? 'info' :
                        match.status === 'completed' ? 'success' :
                        match.status === 'cancelled' ? 'danger' :
                        'warning'
                      }`}>
                        {match.status === 'scheduled' ? '⏰ 예정' :
                         match.status === 'completed' ? '✅ 완료' :
                         match.status === 'cancelled' ? '❌ 취소' :
                         '🟢 진행중'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-secondary)' }}>
                    필터 조건에 맞는 경기가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
        </>
      )}

      {/* Match Detail Modal */}
      <MatchDetailModal
        match={selectedMatch}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </AdminLayout>
  );
};

export default MatchesPage;
