import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp,
  TrendingDown,
  Activity,
  Users,
  AlertCircle,
  CheckCircle,
  Clock,
  Calendar,
  Download
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import ReportDetailModal from "../components/ReportDetailModal";

interface MetricData {
  label: string;
  value: string;
  pill: string;
  pillClass: string;
  delta: string;
  deltaTone: string;
  note: string;
  icon?: React.ElementType;
}

const overviewMetrics: MetricData[] = [
  {
    label: "총 회원 수",
    value: "8,427",
    pill: "TOTAL",
    pillClass: "metric-pill",
    delta: "+128 명",
    deltaTone: "metric-positive",
    note: "오늘 신규 가입",
    icon: Users,
  },
  {
    label: "오늘 접속 회원",
    value: "3,842",
    pill: "TODAY",
    pillClass: "metric-pill metric-live",
    delta: "+247 명",
    deltaTone: "metric-positive",
    note: "전일 대비",
    icon: Activity,
  },
  {
    label: "총 매칭 수",
    value: "1,234",
    pill: "MATCHES",
    pillClass: "metric-pill",
    delta: "+45 건",
    deltaTone: "metric-positive",
    note: "이번 주",
    icon: Calendar,
  },
  {
    label: "등록 팀 수",
    value: "94",
    pill: "TEAMS",
    pillClass: "metric-pill",
    delta: "+6 팀",
    deltaTone: "metric-positive",
    note: "이번 달",
    icon: Users,
  },
  {
    label: "오늘 예정 경기",
    value: "8",
    pill: "TODAY",
    pillClass: "metric-pill",
    delta: "+3 건",
    deltaTone: "metric-positive",
    note: "어제보다",
    icon: Calendar,
  },
  {
    label: "대기 중 신고",
    value: "4",
    pill: "URGENT",
    pillClass: "metric-pill metric-alert",
    delta: "+2 건",
    deltaTone: "metric-negative",
    note: "긴급 1건 포함",
    icon: AlertCircle,
  },
];

const todayMatches = [
  {
    id: "M-20412",
    home: { name: "FC 서울", score: null },
    away: { name: "부산 SC", score: null },
    location: "탄천 종합운동장",
    time: "14:00",
    status: "scheduled",
  },
  {
    id: "M-20408",
    home: { name: "인천 유나이티드", score: null },
    away: { name: "대구 레인저스", score: null },
    location: "잠실 보조경기장",
    time: "16:30",
    status: "scheduled",
  },
  {
    id: "M-20420",
    home: { name: "울산 시티", score: null },
    away: { name: "광주 플렉스", score: null },
    location: "반포 한강공원",
    time: "19:00",
    status: "scheduled",
  },
  {
    id: "M-20421",
    home: { name: "수원 FC", score: null },
    away: { name: "경기 유나이티드", score: null },
    location: "월드컵공원 축구장",
    time: "20:00",
    status: "scheduled",
  },
  {
    id: "M-20422",
    home: { name: "제주 드림", score: null },
    away: { name: "강원 FC", score: null },
    location: "서울숲 축구장",
    time: "21:00",
    status: "scheduled",
  },
  {
    id: "M-20423",
    home: { name: "대전 시티즌", score: null },
    away: { name: "청주 FC", score: null },
    location: "양재천 체육공원",
    time: "17:00",
    status: "scheduled",
  },
  {
    id: "M-20424",
    home: { name: "전주 유나이티드", score: null },
    away: { name: "광주 FC", score: null },
    location: "올림픽공원 축구장",
    time: "18:30",
    status: "scheduled",
  },
  {
    id: "M-20425",
    home: { name: "안산 그리너스", score: null },
    away: { name: "성남 FC", score: null },
    location: "뚝섬 한강공원",
    time: "15:00",
    status: "scheduled",
  },
];

const pendingTasks = [
  {
    id: "TASK-01",
    category: "신고",
    title: "신고 처리 대기",
    count: 4,
    urgent: 1,
    color: "red",
    link: "/admin/reports"
  },
  {
    id: "TASK-02",
    category: "팀",
    title: "팀 승인 대기",
    count: 2,
    urgent: 0,
    color: "blue",
    link: "/admin/teams"
  },
  {
    id: "TASK-03",
    category: "용병",
    title: "용병 신청 검토",
    count: 8,
    urgent: 0,
    color: "green",
    link: "/admin/applications"
  },
  {
    id: "TASK-04",
    category: "게시물",
    title: "게시물 검수",
    count: 3,
    urgent: 0,
    color: "purple",
    link: "/admin/content"
  }
];

const todayStats = [
  {
    id: "STAT-01",
    label: "신규 가입",
    value: "128",
    delta: "+12%",
    icon: "👥",
    color: "blue"
  },
  {
    id: "STAT-02",
    label: "작성된 글",
    value: "45",
    delta: "+8건",
    icon: "📝",
    color: "green"
  },
  {
    id: "STAT-03",
    label: "완료된 경기",
    value: "12",
    delta: "진행 중 3건",
    icon: "⚽",
    color: "orange"
  },
  {
    id: "STAT-04",
    label: "결제 완료",
    value: "₩2.4M",
    delta: "23건",
    icon: "💰",
    color: "purple"
  }
];

interface ReportItem {
  id: string;
  type: string;
  target: string;
  status: { label: string; tone: string };
  assignee: string;
  receivedAt: string;
  severity?: string;
  reporter?: string;
  description?: string;
  evidence?: string[];
}

const reportQueue: ReportItem[] = [
  {
    id: "R-9821",
    type: "폭언",
    target: "매치 M-20412",
    status: { label: "긴급", tone: "danger" },
    assignee: "-",
    receivedAt: "11:42",
    severity: "긴급",
    reporter: "김철수",
    description: "경기 중 상대 팀원에게 욕설 및 폭언을 사용했습니다. 여러 플레이어가 목격했습니다.",
    evidence: ["스크린샷 1.png", "채팅 로그.txt"],
  },
  {
    id: "R-9819",
    type: "부정 행위",
    target: "팀 T-334",
    status: { label: "검토 중", tone: "warning" },
    assignee: "김지원",
    receivedAt: "10:58",
    severity: "높음",
    reporter: "이영희",
    description: "해당 팀이 고의로 실력이 낮은 선수를 등록하여 등급을 조작하려는 시도가 있었습니다.",
    evidence: ["증거 영상.mp4", "프로필 비교.pdf"],
  },
  {
    id: "R-9815",
    type: "스팸",
    target: "게시물 P-774",
    status: { label: "대기", tone: "neutral" },
    assignee: "박민서",
    receivedAt: "09:31",
    severity: "보통",
    reporter: "박민준",
    description: "게시판에 광고성 게시물을 반복적으로 작성하고 있습니다.",
    evidence: ["게시물 스크린샷.png"],
  },
  {
    id: "R-9809",
    type: "불참 신고",
    target: "플레이어 U-1231",
    status: { label: "완료", tone: "positive" },
    assignee: "손예린",
    receivedAt: "08:47",
    severity: "낮음",
    reporter: "최지훈",
    description: "약속된 매치에 사전 고지 없이 불참했습니다.",
    evidence: [],
  },
];

const memberHighlights = [
  {
    title: "가입 추이",
    highlight: "신규 128명",
    meta: "전일 대비 +12%",
    items: ["일반 회원 · 64명", "팀 소속 · 48명", "기업팀 · 16명"],
  },
  {
    title: "활동 지표",
    highlight: "오늘 접속 3,842명",
    meta: "재방문율 42%",
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
  const navigate = useNavigate();
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString('ko-KR'));
  const [isAutoRefresh, setIsAutoRefresh] = useState<boolean>(true);
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  useEffect(() => {
    if (!isAutoRefresh) return;

    const interval = setInterval(() => {
      setLastUpdate(new Date().toLocaleTimeString('ko-KR'));
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [isAutoRefresh]);

  const handleRefresh = () => {
    setLastUpdate(new Date().toLocaleTimeString('ko-KR'));
    console.log('대시보드 새로고침:', new Date().toISOString());
  };

  const handleExportCSV = () => {
    console.log('CSV 내보내기 요청');

    // CSV 데이터 생성 (회원 현황)
    const headers = ['구분', '값', '메타', '항목'];
    const csvData = [
      headers.join(','),
      ...memberHighlights.flatMap(highlight =>
        highlight.items.map((item, idx) =>
          [
            idx === 0 ? highlight.title : '',
            idx === 0 ? highlight.highlight : '',
            idx === 0 ? highlight.meta : '',
            item
          ].join(',')
        )
      )
    ].join('\n');

    // CSV 파일 다운로드
    const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `회원현황_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNewMatch = () => {
    console.log('새 매치 등록 요청');
    alert('새 매치 등록 기능은 백엔드 연결 후 구현됩니다.');
    // TODO: Implement new match creation modal
  };

  const handleViewSchedule = () => {
    console.log('전체 일정 보기 요청');
    navigate('/admin/matches');
  };

  const handleViewAllReports = () => {
    navigate('/admin/reports');
  };

  const handleReportClick = (report: ReportItem) => {
    console.log('신고 상세 보기:', report.id);
    // 모달에 전달할 데이터 형식 맞추기
    const reportForModal = {
      id: report.id,
      type: report.type,
      target: report.target,
      severity: report.severity || report.status.label,
      status: report.status.label,
      receivedAt: report.receivedAt,
      reporter: report.reporter,
      description: report.description,
      evidence: report.evidence
    };
    setSelectedReport(reportForModal as any);
    setIsDetailModalOpen(true);
  };

  return (
    <AdminLayout activePage="dashboard">
      {/* 목업 데이터 표시 배너 */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>🎨</span>
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>프론트엔드 목업 데이터</div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>현재 표시되는 데이터는 설계/참고용 샘플 데이터입니다</div>
          </div>
        </div>
        <div style={{
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}>
          Mock Data
        </div>
      </div>

      {/* 페이지 상단 액션 바 */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px',
        padding: '16px 20px',
        background: 'var(--admin-bg-secondary)',
        borderRadius: '12px',
        border: '1px solid var(--admin-border)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={18} style={{ color: 'var(--admin-text-secondary)' }} />
          <span style={{ fontSize: '14px', color: 'var(--admin-text-secondary)' }}>
            마지막 업데이트: {lastUpdate}
          </span>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '14px',
            color: 'var(--admin-text-secondary)',
            cursor: 'pointer'
          }}>
            <input
              type="checkbox"
              checked={isAutoRefresh}
              onChange={(e) => setIsAutoRefresh(e.target.checked)}
              style={{ cursor: 'pointer' }}
            />
            자동 새로고침
          </label>
        </div>
        <button
          type="button"
          className="section-btn primary"
          onClick={handleRefresh}
        >
          새로고침
        </button>
      </div>

      {/* 주요 지표 - 최상단 */}
      <section id="overview" className="admin-section" style={{ marginBottom: '32px' }}>
        <div className="section-header" style={{ marginBottom: '20px' }}>
          <div>
            <h2 className="section-title" style={{ fontSize: '24px', marginBottom: '8px' }}>주요 지표</h2>
            <span className="section-meta" style={{ fontSize: '14px' }}>
              실시간 업데이트 · {lastUpdate}
            </span>
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
        }}>
          {overviewMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div
                key={metric.label}
                className="metric-card"
                style={{
                  background: 'var(--admin-bg-secondary)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '12px',
                  padding: '20px',
                  transition: 'all 0.2s',
                }}
              >
                <div className="metric-top" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '12px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {Icon && <Icon size={18} style={{ color: 'var(--admin-primary)' }} />}
                    <span className="metric-label" style={{
                      fontSize: '12px',
                      color: 'var(--admin-text-secondary)',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      fontWeight: '600'
                    }}>{metric.label}</span>
                  </div>
                  <span className={metric.pillClass} style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '10px',
                    fontWeight: '600',
                    background: 'var(--admin-bg-tertiary)',
                    color: 'var(--admin-text-secondary)',
                    textTransform: 'uppercase'
                  }}>{metric.pill}</span>
                </div>
                <strong className="metric-value" style={{
                  display: 'block',
                  fontSize: '32px',
                  fontWeight: '700',
                  color: 'var(--admin-text)',
                  marginBottom: '12px',
                  lineHeight: '1'
                }}>{metric.value}</strong>
                <div className="metric-footer" style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '8px',
                  paddingTop: '12px',
                  borderTop: '1px solid var(--admin-border)'
                }}>
                  <span className={`metric-delta ${metric.deltaTone}`} style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {metric.deltaTone === 'metric-positive' && <TrendingUp size={14} />}
                    {metric.deltaTone === 'metric-negative' && <TrendingDown size={14} />}
                    {metric.delta}
                  </span>
                  <span className="metric-note" style={{
                    fontSize: '11px',
                    color: 'var(--admin-text-secondary)'
                  }}>{metric.note}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="today-stats" className="admin-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">오늘의 통계</h2>
            <span className="section-meta">금일 활동 요약</span>
          </div>
        </div>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          {todayStats.map((stat) => {
            const handleStatClick = (id: string) => {
              const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

              switch(id) {
                case 'STAT-01': // 신규 가입
                  navigate('/admin/users', {
                    state: {
                      filter: 'today-joined',
                      date: today,
                      description: '오늘 신규 가입한 회원'
                    }
                  });
                  break;
                case 'STAT-02': // 작성된 글
                  navigate('/admin/content', {
                    state: {
                      filter: 'today-posts',
                      date: today,
                      description: '오늘 작성된 게시물'
                    }
                  });
                  break;
                case 'STAT-03': // 완료된 경기
                  navigate('/admin/matches', {
                    state: {
                      filter: 'today-completed',
                      date: today,
                      description: '오늘 완료된 경기'
                    }
                  });
                  break;
                case 'STAT-04': // 결제 완료
                  alert('결제 내역 페이지는 준비 중입니다.');
                  break;
                default:
                  break;
              }
            };

            const hasLink = stat.id !== 'STAT-04';

            return (
              <div
                key={stat.id}
                className="card"
                style={{
                  background: 'var(--admin-bg-secondary)',
                  border: '1px solid var(--admin-border)',
                  borderRadius: '12px',
                  padding: '20px',
                  textAlign: 'center',
                  cursor: hasLink ? 'pointer' : 'default',
                  transition: 'all 0.2s'
                }}
                onClick={() => handleStatClick(stat.id)}
                onMouseEnter={(e) => {
                  if (hasLink) {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (hasLink) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
                title={hasLink ? '클릭하여 필터링된 목록 보기' : ''}
              >
                <div style={{ fontSize: '32px', marginBottom: '8px' }}>
                  {stat.icon}
                </div>
                <div style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--admin-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px',
                  marginBottom: '8px'
                }}>
                  {stat.label}
                </div>
                <div style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: 'var(--admin-text)',
                  marginBottom: '4px'
                }}>
                  {stat.value}
                </div>
                <div style={{
                  fontSize: '12px',
                  color: 'var(--admin-text-secondary)'
                }}>
                  {stat.delta}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section id="matches" className="admin-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">오늘 경기 일정</h2>
            <span className="section-meta">오늘 예정된 경기 목록</span>
          </div>
          <div className="section-actions">
            <button
              type="button"
              className="section-btn"
              onClick={handleViewSchedule}
            >
              <Calendar size={16} style={{ marginRight: '6px' }} />
              전체 일정
            </button>
            <button
              type="button"
              className="section-btn primary"
              onClick={handleNewMatch}
            >
              새 매치 등록
            </button>
          </div>
        </div>
        <div className="card live-matches">
          <div className="card-header">
            <h3 className="card-title">오늘 경기</h3>
            <span className="card-meta">총 {todayMatches.length}건 예정</span>
          </div>
          <ul className="live-list">
            {todayMatches.map((match) => (
              <li
                key={match.id}
                className={`live-item status-${match.status}`}
                style={{ cursor: 'pointer' }}
                onClick={() => navigate('/admin/matches')}
                title="클릭하여 경기 페이지로 이동"
              >
                <div className="live-team">
                  <span className="team-name">{match.home.name}</span>
                  <span className="team-score" style={{ color: 'var(--admin-text-secondary)', fontSize: '14px' }}>vs</span>
                </div>
                <span className="live-vs"></span>
                <div className="live-team">
                  <span className="team-name">{match.away.name}</span>
                </div>
                <div className="live-meta">
                  <span className="live-time" style={{ color: 'var(--admin-text)', fontWeight: '600' }}>
                    {match.time}
                  </span>
                  <span className="live-league" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={12} />
                    {match.location}
                  </span>
                  <span style={{
                    fontSize: '11px',
                    color: 'var(--admin-text-secondary)',
                    marginTop: '2px'
                  }}>
                    {match.id}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section id="pending-tasks" className="admin-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">대기 중인 작업</h2>
            <span className="section-meta">관리자 확인이 필요한 항목</span>
          </div>
        </div>
        <div className="grid-2" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '16px' }}>
          {pendingTasks.map((task) => (
            <div
              key={task.id}
              className="card"
              style={{
                cursor: 'pointer',
                transition: 'all 0.2s',
                background: 'var(--admin-bg-secondary)',
                border: '1px solid var(--admin-border)',
                borderRadius: '12px',
                padding: '20px'
              }}
              onClick={() => navigate(task.link)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span style={{
                  fontSize: '12px',
                  fontWeight: '600',
                  color: 'var(--admin-text-secondary)',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {task.category}
                </span>
                {task.urgent > 0 && (
                  <span style={{
                    fontSize: '11px',
                    padding: '2px 8px',
                    background: 'rgba(255, 59, 48, 0.2)',
                    color: 'var(--admin-danger)',
                    borderRadius: '12px',
                    fontWeight: '600'
                  }}>
                    긴급 {task.urgent}
                  </span>
                )}
              </div>
              <h3 style={{
                fontSize: '16px',
                fontWeight: '600',
                color: 'var(--admin-text)',
                marginBottom: '8px'
              }}>
                {task.title}
              </h3>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{
                  fontSize: '32px',
                  fontWeight: '700',
                  color: task.color === 'red' ? 'var(--admin-danger)' :
                         task.color === 'blue' ? 'var(--admin-primary)' :
                         task.color === 'green' ? 'var(--admin-success)' :
                         'var(--admin-warning)'
                }}>
                  {task.count}
                </span>
                <span style={{ fontSize: '14px', color: 'var(--admin-text-secondary)' }}>건</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section id="reports" className="admin-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">신고 처리 큐</h2>
            <span className="section-meta">
              SLA 12시간 · 현재 {reportQueue.length}건
              {reportQueue.filter(r => r.status.tone === 'danger').length > 0 && (
                <span style={{
                  marginLeft: '12px',
                  padding: '4px 8px',
                  background: 'rgba(255, 59, 48, 0.2)',
                  color: 'var(--admin-danger)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  긴급 {reportQueue.filter(r => r.status.tone === 'danger').length}건
                </span>
              )}
            </span>
          </div>
          <button
            type="button"
            className="section-btn primary"
            onClick={handleViewAllReports}
          >
            모든 신고 보기
          </button>
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
                <tr
                  key={report.id}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleReportClick(report)}
                  title="클릭하여 상세 보기"
                >
                  <td style={{ fontWeight: '600', color: 'var(--admin-primary)' }}>{report.id}</td>
                  <td>{report.type}</td>
                  <td>{report.target}</td>
                  <td>
                    <span className={`status-pill ${report.status.tone}`}>{report.status.label}</span>
                  </td>
                  <td>
                    {report.assignee === '-' ? (
                      <span style={{ color: 'var(--admin-text-secondary)', fontStyle: 'italic' }}>미배정</span>
                    ) : (
                      report.assignee
                    )}
                  </td>
                  <td style={{ color: 'var(--admin-text-secondary)' }}>{report.receivedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section id="members" className="admin-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">회원 현황</h2>
            <span className="section-meta">실시간 회원 활동 지표</span>
          </div>
          <div className="section-actions">
            <button
              type="button"
              className="section-btn"
              onClick={handleExportCSV}
            >
              <Download size={16} style={{ marginRight: '6px' }} />
              CSV 내보내기
            </button>
          </div>
        </div>
        <div className="grid-3">
          {memberHighlights.map((card) => (
            <div
              key={card.title}
              className="card simple-card"
              style={{ cursor: 'pointer' }}
              onClick={() => console.log('회원 현황 상세 보기:', card.title)}
              title="클릭하여 상세 보기"
            >
              <h3 className="card-title">{card.title}</h3>
              <p className="card-highlight">{card.highlight}</p>
              <p className="card-meta">{card.meta}</p>
              <ul className="card-list">
                {card.items.map((item, index) => (
                  <li key={`${card.title}-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 신고 상세 모달 */}
      <ReportDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        report={selectedReport}
      />
    </AdminLayout>
  );
};

export default DashboardPage;
