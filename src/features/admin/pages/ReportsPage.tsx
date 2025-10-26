import { useState } from "react";
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Users,
  Filter,
  Download,
  RefreshCw,
  Settings
} from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import ReportDetailModal from "../components/ReportDetailModal";
import AssignStaffModal from "../components/AssignStaffModal";

interface ReportMetric {
  label: string;
  value: string;
  delta: string;
  deltaTone: string;
  note: string;
  icon?: React.ElementType;
}

const reportMetrics: ReportMetric[] = [
  {
    label: "대기 신고",
    value: "4",
    delta: "SLA 12h",
    deltaTone: "metric-negative",
    note: "긴급 1",
    icon: AlertTriangle,
  },
  {
    label: "오늘 처리",
    value: "18",
    delta: "+5",
    deltaTone: "metric-positive",
    note: "목표 20",
    icon: CheckCircle,
  },
  {
    label: "자동 분류",
    value: "82%",
    delta: "+6%",
    deltaTone: "metric-positive",
    note: "정확도",
    icon: TrendingUp,
  },
];

interface ReportedUser {
  id: string;
  name: string;
  profileImage?: string;
  joinDate: string;
  matchCount: number;
  mannerScore: number;
  noShowCount: number;
  warningCount: number;
}

interface SanctionHistory {
  id: string;
  type: "경고" | "정지" | "영구정지";
  reason: string;
  startDate: string;
  endDate?: string;
  duration?: string;
  processor: string;
}

interface ReportItem {
  id: string;
  type: string;
  target: string;
  severity: string;
  status: string;
  receivedAt: string;
  reporter?: string;
  reporterUserId?: string;
  description?: string;
  evidence?: string[];
  assignee?: string;
  reportedUser?: ReportedUser;
  sanctionHistory?: SanctionHistory[];
}

const reportQueueData: ReportItem[] = [
  {
    id: "R-9821",
    type: "폭언",
    target: "매치 M-20412",
    severity: "긴급",
    status: "배정 대기",
    receivedAt: "11:42",
    reporter: "김철수",
    reporterUserId: "U-3001",
    description: "경기 중 상대 팀원에게 욕설 및 폭언을 사용했습니다. 여러 플레이어가 목격했습니다.",
    evidence: ["스크린샷 1.png", "채팅 로그.txt"],
    reportedUser: {
      id: "U-1523",
      name: "박지훈",
      joinDate: "2024-03-15",
      matchCount: 47,
      mannerScore: 28,
      noShowCount: 3,
      warningCount: 2,
    },
    sanctionHistory: [
      {
        id: "S-001",
        type: "경고",
        reason: "경기 중 부적절한 언행으로 인한 1차 경고",
        startDate: "2024-09-10",
        processor: "관리자 김민수",
      },
      {
        id: "S-002",
        type: "정지",
        reason: "노쇼 3회 누적으로 인한 활동 정지",
        startDate: "2024-08-05",
        endDate: "2024-08-12",
        duration: "7일",
        processor: "관리자 이영희",
      },
    ],
  },
  {
    id: "R-9819",
    type: "부정 행위",
    target: "팀 T-334",
    severity: "높음",
    status: "검토 중",
    receivedAt: "10:58",
    reporter: "이영희",
    reporterUserId: "U-3002",
    description: "해당 팀이 고의로 실력이 낮은 선수를 등록하여 등급을 조작하려는 시도가 있었습니다.",
    evidence: ["증거 영상.mp4", "프로필 비교.pdf"],
    assignee: "김지원",
    reportedUser: {
      id: "U-2341",
      name: "정민수",
      joinDate: "2023-11-20",
      matchCount: 124,
      mannerScore: 35,
      noShowCount: 1,
      warningCount: 1,
    },
    sanctionHistory: [
      {
        id: "S-003",
        type: "경고",
        reason: "매칭 시스템 악용 의심으로 인한 경고",
        startDate: "2024-07-22",
        processor: "관리자 박준호",
      },
    ],
  },
  {
    id: "R-9815",
    type: "스팸",
    target: "게시물 P-774",
    severity: "보통",
    status: "대기",
    receivedAt: "09:31",
    reporter: "박민준",
    reporterUserId: "U-3003",
    description: "게시판에 광고성 게시물을 반복적으로 작성하고 있습니다.",
    evidence: ["게시물 스크린샷.png"],
    assignee: "박민서",
    reportedUser: {
      id: "U-5672",
      name: "최준영",
      joinDate: "2025-09-05",
      matchCount: 8,
      mannerScore: 36,
      noShowCount: 0,
      warningCount: 0,
    },
    sanctionHistory: [],
  },
  {
    id: "R-9809",
    type: "불참 신고",
    target: "플레이어 U-1231",
    severity: "낮음",
    status: "완료",
    receivedAt: "08:47",
    reporter: "최지훈",
    reporterUserId: "U-3004",
    description: "약속된 매치에 사전 고지 없이 불참했습니다.",
    evidence: [],
    assignee: "손예린",
    reportedUser: {
      id: "U-1231",
      name: "윤서준",
      joinDate: "2024-05-10",
      matchCount: 62,
      mannerScore: 42,
      noShowCount: 1,
      warningCount: 0,
    },
    sanctionHistory: [],
  },
  {
    id: "R-9807",
    type: "폭언",
    target: "플레이어 U-893",
    severity: "높음",
    status: "대기",
    receivedAt: "08:22",
    reporter: "정수진",
    reporterUserId: "U-3005",
    description: "경기 후 상대방에게 심한 욕설을 했습니다.",
    evidence: ["음성 녹음.mp3"],
    reportedUser: {
      id: "U-893",
      name: "강태양",
      joinDate: "2023-08-14",
      matchCount: 156,
      mannerScore: 22,
      noShowCount: 7,
      warningCount: 4,
    },
    sanctionHistory: [
      {
        id: "S-004",
        type: "정지",
        reason: "폭언 및 비매너 행위로 인한 3차 제재",
        startDate: "2024-09-01",
        endDate: "2024-09-15",
        duration: "14일",
        processor: "관리자 김민수",
      },
      {
        id: "S-005",
        type: "경고",
        reason: "경기 중 부적절한 발언",
        startDate: "2024-06-12",
        processor: "관리자 이영희",
      },
      {
        id: "S-006",
        type: "정지",
        reason: "노쇼 5회 누적",
        startDate: "2024-04-03",
        endDate: "2024-04-10",
        duration: "7일",
        processor: "관리자 박준호",
      },
      {
        id: "S-007",
        type: "경고",
        reason: "팀원간 갈등 유발",
        startDate: "2024-01-20",
        processor: "관리자 김민수",
      },
    ],
  },
  {
    id: "R-9801",
    type: "부정 행위",
    target: "매치 M-20401",
    severity: "긴급",
    status: "배정 대기",
    receivedAt: "07:15",
    reporter: "강민호",
    reporterUserId: "U-3006",
    description: "고의적으로 경기 결과를 조작하려는 시도가 발견되었습니다.",
    evidence: ["영상 증거.mp4", "채팅 기록.txt"],
    reportedUser: {
      id: "U-7789",
      name: "이동현",
      joinDate: "2024-02-28",
      matchCount: 89,
      mannerScore: 18,
      noShowCount: 5,
      warningCount: 3,
    },
    sanctionHistory: [
      {
        id: "S-008",
        type: "정지",
        reason: "경기 결과 조작 시도",
        startDate: "2024-08-20",
        endDate: "2024-09-03",
        duration: "14일",
        processor: "관리자 이영희",
      },
      {
        id: "S-009",
        type: "경고",
        reason: "부정 행위 의심",
        startDate: "2024-06-05",
        processor: "관리자 박준호",
      },
      {
        id: "S-010",
        type: "경고",
        reason: "반복적인 노쇼",
        startDate: "2024-04-18",
        processor: "관리자 김민수",
      },
    ],
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
  const [reportQueue, setReportQueue] = useState<ReportItem[]>(reportQueueData);
  const [filterType, setFilterType] = useState<string>("all");
  const [filterSeverity, setFilterSeverity] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [lastUpdate, setLastUpdate] = useState<string>(new Date().toLocaleTimeString('ko-KR'));
  const [selectedReport, setSelectedReport] = useState<ReportItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedReports, setSelectedReports] = useState<string[]>([]);

  // 필터링된 신고 목록
  const filteredReports = reportQueue.filter(report => {
    if (filterType !== "all" && report.type !== filterType) return false;
    if (filterSeverity !== "all" && report.severity !== filterSeverity) return false;
    if (filterStatus !== "all" && report.status !== filterStatus) return false;
    return true;
  });

  const handleRefresh = () => {
    setLastUpdate(new Date().toLocaleTimeString('ko-KR'));
    console.log('신고 목록 새로고침:', new Date().toISOString());
    // 실제로는 API를 호출하여 데이터를 다시 가져옵니다
  };

  const handleAssignStaff = () => {
    if (selectedReports.length === 0) {
      // 선택된 신고가 없으면 모든 '배정 대기' 신고 선택
      const unassignedReports = reportQueue
        .filter(r => r.status === "배정 대기")
        .map(r => r.id);
      setSelectedReports(unassignedReports);
    }
    setIsAssignModalOpen(true);
  };

  const handleAssignComplete = (staffName: string, reportIds: string[]) => {
    // 신고에 담당자 배정
    setReportQueue(prevQueue =>
      prevQueue.map(report =>
        reportIds.includes(report.id)
          ? { ...report, assignee: staffName, status: "검토 중" }
          : report
      )
    );
    setSelectedReports([]);
    alert(`${staffName}님에게 ${reportIds.length}건의 신고가 배정되었습니다.`);
  };

  const handleFilterSLA = () => {
    console.log('SLA 초과 항목 필터링');
    setFilterStatus('배정 대기');
    setFilterSeverity('긴급');
  };

  const handleExport = () => {
    console.log('신고 목록 CSV 내보내기');

    // CSV 데이터 생성
    const headers = ['ID', '유형', '대상', '심각도', '상태', '접수시간', '담당자'];
    const csvData = [
      headers.join(','),
      ...filteredReports.map(report =>
        [
          report.id,
          report.type,
          report.target,
          report.severity,
          report.status,
          report.receivedAt,
          report.assignee || '미배정'
        ].join(',')
      )
    ].join('\n');

    // CSV 파일 다운로드
    const blob = new Blob(['\uFEFF' + csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `신고목록_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReportClick = (report: ReportItem) => {
    setSelectedReport(report);
    setIsDetailModalOpen(true);
  };

  const resetFilters = () => {
    setFilterType("all");
    setFilterSeverity("all");
    setFilterStatus("all");
  };

  return (
    <AdminLayout activePage="reports">
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
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            type="button"
            className="section-btn"
            onClick={handleExport}
          >
            <Download size={16} style={{ marginRight: '6px' }} />
            내보내기
          </button>
          <button
            type="button"
            className="section-btn primary"
            onClick={handleRefresh}
          >
            <RefreshCw size={16} style={{ marginRight: '6px' }} />
            새로고침
          </button>
        </div>
      </div>

      <section className="admin-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">신고 요약</h2>
            <span className="section-meta">SLA 12시간 기준</span>
          </div>
        </div>
        <div className="metric-grid">
          {reportMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <div key={metric.label} className="metric-card">
                <div className="metric-top">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {Icon && <Icon size={16} style={{ color: 'var(--admin-text-secondary)' }} />}
                    <span className="metric-label">{metric.label}</span>
                  </div>
                </div>
                <strong className="metric-value">{metric.value}</strong>
                <div className="metric-footer">
                  <span className={`metric-delta ${metric.deltaTone}`}>
                    {metric.deltaTone === 'metric-positive' && <TrendingUp size={14} style={{ display: 'inline', marginRight: '4px' }} />}
                    {metric.deltaTone === 'metric-negative' && <TrendingDown size={14} style={{ display: 'inline', marginRight: '4px' }} />}
                    {metric.delta}
                  </span>
                  <span className="metric-note">{metric.note}</span>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">처리 큐</h2>
            <span className="section-meta">
              총 {filteredReports.length}건 표시 (전체 {reportQueue.length}건)
              {reportQueue.filter(r => r.severity === '긴급').length > 0 && (
                <span style={{
                  marginLeft: '12px',
                  padding: '4px 8px',
                  background: 'rgba(255, 59, 48, 0.2)',
                  color: 'var(--admin-danger)',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '600'
                }}>
                  긴급 {reportQueue.filter(r => r.severity === '긴급').length}건
                </span>
              )}
            </span>
          </div>
          <div className="section-actions">
            <button
              type="button"
              className="section-btn"
              onClick={handleAssignStaff}
            >
              <Users size={16} style={{ marginRight: '6px' }} />
              담당자 배정
            </button>
            <button
              type="button"
              className="section-btn primary"
              onClick={handleFilterSLA}
            >
              <Filter size={16} style={{ marginRight: '6px' }} />
              SLA 초과 항목
            </button>
          </div>
        </div>

        {/* 필터 바 */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '16px',
          padding: '16px',
          background: 'var(--admin-bg-secondary)',
          borderRadius: '8px',
          border: '1px solid var(--admin-border)'
        }}>
          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', color: 'var(--admin-text-secondary)', display: 'block', marginBottom: '6px' }}>
              유형
            </label>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--admin-bg-tertiary)',
                border: '1px solid var(--admin-border)',
                borderRadius: '6px',
                color: 'var(--admin-text)',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="all">전체</option>
              <option value="폭언">폭언</option>
              <option value="부정 행위">부정 행위</option>
              <option value="스팸">스팸</option>
              <option value="불참 신고">불참 신고</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', color: 'var(--admin-text-secondary)', display: 'block', marginBottom: '6px' }}>
              심각도
            </label>
            <select
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--admin-bg-tertiary)',
                border: '1px solid var(--admin-border)',
                borderRadius: '6px',
                color: 'var(--admin-text)',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="all">전체</option>
              <option value="긴급">긴급</option>
              <option value="높음">높음</option>
              <option value="보통">보통</option>
              <option value="낮음">낮음</option>
            </select>
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: '12px', color: 'var(--admin-text-secondary)', display: 'block', marginBottom: '6px' }}>
              상태
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                background: 'var(--admin-bg-tertiary)',
                border: '1px solid var(--admin-border)',
                borderRadius: '6px',
                color: 'var(--admin-text)',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              <option value="all">전체</option>
              <option value="배정 대기">배정 대기</option>
              <option value="검토 중">검토 중</option>
              <option value="대기">대기</option>
              <option value="완료">완료</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'flex-end' }}>
            <button
              type="button"
              className="section-btn"
              onClick={resetFilters}
              style={{ whiteSpace: 'nowrap' }}
            >
              필터 초기화
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
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-secondary)' }}>
                    해당하는 신고가 없습니다.
                  </td>
                </tr>
              ) : (
                filteredReports.map((item) => (
                  <tr
                    key={item.id}
                    style={{ cursor: 'pointer' }}
                    onClick={() => handleReportClick(item)}
                    title="클릭하여 상세 보기"
                  >
                    <td style={{ fontWeight: '600', color: 'var(--admin-primary)' }}>{item.id}</td>
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
                    <td style={{ color: 'var(--admin-text-secondary)' }}>{item.status}</td>
                    <td style={{ color: 'var(--admin-text-secondary)' }}>{item.receivedAt}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">처리 타임라인</h2>
            <span className="section-meta">최근 활동 내역</span>
          </div>
          <button
            type="button"
            className="section-btn"
            onClick={() => console.log('전체 타임라인 보기')}
          >
            전체 보기
          </button>
        </div>
        <div className="card" style={{ background: 'var(--admin-bg-secondary)', border: '1px solid var(--admin-border)', borderRadius: '12px', padding: '20px' }}>
          <ul className="card-list">
            {timeline.map((event, index) => (
              <li
                key={event.id}
                style={{
                  padding: '16px 0',
                  borderTop: index > 0 ? '1px solid var(--admin-border)' : 'none',
                  display: 'flex',
                  gap: '16px',
                  cursor: 'pointer'
                }}
                onClick={() => console.log('타임라인 이벤트 상세:', event.id)}
                title="클릭하여 상세 보기"
              >
                <Clock size={16} style={{ color: 'var(--admin-text-secondary)', flexShrink: 0, marginTop: '2px' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '4px' }}>
                    <strong style={{ color: 'var(--admin-primary)' }}>{event.time}</strong>
                    <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--admin-text)' }}>{event.title}</span>
                  </div>
                  <p style={{ fontSize: '13px', color: 'var(--admin-text-secondary)', margin: 0 }}>{event.description}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <div>
            <h2 className="section-title">자동화 규칙</h2>
            <span className="section-meta">업데이트 2024-03-12</span>
          </div>
          <button
            type="button"
            className="section-btn"
            onClick={() => console.log('규칙 관리')}
          >
            <Settings size={16} style={{ marginRight: '6px' }} />
            규칙 관리
          </button>
        </div>
        <div className="grid-3">
          {autoRules.map((rule) => (
            <div
              key={rule.title}
              className="card simple-card"
              style={{ cursor: 'pointer' }}
              onClick={() => console.log('자동화 규칙 편집:', rule.title)}
              title="클릭하여 규칙 편집"
            >
              <h3 className="card-title">{rule.title}</h3>
              <p className="card-highlight">{rule.highlight}</p>
              <p className="card-meta">{rule.meta}</p>
              <ul className="card-list">
                {rule.items.map((item, index) => (
                  <li key={`${rule.title}-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* 모달들 */}
      <ReportDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        report={selectedReport}
      />

      <AssignStaffModal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        onAssign={handleAssignComplete}
        selectedReports={selectedReports}
      />
    </AdminLayout>
  );
};

export default ReportsPage;
