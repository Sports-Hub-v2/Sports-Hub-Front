import { FormEvent, KeyboardEvent, useState } from "react";

import AdminLayout from "../components/AdminLayout";

type TeamStatus = "normal" | "watch" | "problem";
type MatchResult = "승" | "패" | "무";
type MonitoringCategory = "report" | "inactive" | "contact";
type TeamActionType = "status" | "memo" | "contact";

interface MetricCard {
  id: string;
  label: string;
  value: string;
  delta: string;
  deltaTone: "metric-positive" | "metric-negative" | "metric-neutral";
  note: string;
}

interface MetricDetail {
  title: string;
  description: string;
  items: Array<{ label: string; value: string }>;
  actions: string[];
}

interface HighlightCard {
  id: string;
  title: string;
  highlight: string;
  meta: string;
  summary: string;
  focusPoints: string[];
  recommendations: string[];
}

interface Team {
  id: string;
  name: string;
  status: TeamStatus;
  issue: string;
  lastActivity: string;
  contact: string;
  notes: string[];
  recentMatches: Array<{ id: string; opponent: string; result: MatchResult; score: string; context: string }>;
}

interface ReportTicket {
  id: string;
  teamId: string;
  type: string;
  target: string;
  sla: string;
  owner: string;
}

interface DormantTicket {
  id: string;
  teamId: string;
  gap: string;
  lastMatch: string;
  followUp: string;
}

interface ContactTicket {
  id: string;
  teamId: string;
  gap: string;
  lastAttempt: string;
  note: string;
}

interface ActionField {
  key: string;
  label: string;
  type: "text" | "textarea" | "select" | "date" | "datetime-local";
  options?: Array<{ label: string; value: string }>;
  placeholder?: string;
  readOnly?: boolean;
}

interface ActionTemplate {
  title: string;
  description: string;
  steps: string[];
  fields: ActionField[];
  submitLabel: string;
  successMessage: string;
  createDefault: (team: Team) => Record<string, string>;
}

interface TeamActionContext {
  label: string;
  description: string;
}

interface TeamActionModalState {
  type: "teamAction";
  action: TeamActionType;
  team: Team;
  context?: TeamActionContext;
  values: Record<string, string>;
  mode: "form" | "success";
}

type ModalState =
  | { type: "metric"; payload: MetricDetail }
  | { type: "highlight"; payload: HighlightCard }
  | TeamActionModalState
  | null;

interface AdminActionCard {
  type: TeamActionType;
  title: string;
  description: string;
  steps: string[];
  cta: string;
}

const metricCards: MetricCard[] = [
  {
    id: "teamActivation",
    label: "총 팀 / 활성 팀",
    value: "128 / 94",
    delta: "활성률 73%",
    deltaTone: "metric-positive",
    note: "전주 대비 +6팀",
  },
  {
    id: "weeklyMatches",
    label: "이번 주 매치",
    value: "37경기",
    delta: "예정 18 · 완료 15 · 취소 4",
    deltaTone: "metric-neutral",
    note: "월~일 일정 기준",
  },
  {
    id: "attendance",
    label: "전체 출석률",
    value: "88%",
    delta: "노쇼 12% (경고)",
    deltaTone: "metric-negative",
    note: "최근 7일 평균",
  },
  {
    id: "reports",
    label: "신고 건수",
    value: "12건",
    delta: "미처리 5 · 처리중 3",
    deltaTone: "metric-negative",
    note: "SLA 평균 7.4시간",
  },
];

const metricDetails: Record<string, MetricDetail> = {
  teamActivation: {
    title: "팀 운영 현황",
    description: "등록 팀 대비 실제 활동 팀 비율을 요약했습니다.",
    items: [
      { label: "총 등록 팀", value: "128팀" },
      { label: "이번 주 활동 팀", value: "94팀" },
      { label: "휴면 팀", value: "12팀" },
    ],
    actions: [
      "휴면 팀 재활성 메시지 발송",
      "활성 팀 주간 리포트 공유",
      "신규 팀 온보딩 체크리스트 점검",
    ],
  },
  weeklyMatches: {
    title: "주간 매치 일정",
    description: "예정·완료·취소 매치 현황입니다.",
    items: [
      { label: "예정 매치", value: "18경기" },
      { label: "완료 매치", value: "15경기" },
      { label: "취소 매치", value: "4경기 (우천 2 포함)" },
    ],
    actions: [
      "취소 매치 참가자에게 대체 일정 추천",
      "완료 매치 후기 및 출석 점검",
      "예정 매치 노쇼 리스크 사전 안내",
    ],
  },
  attendance: {
    title: "출석률 현황",
    description: "최근 7일 기준 출석률과 노쇼 비율입니다.",
    items: [
      { label: "평균 출석률", value: "88%" },
      { label: "노쇼 비율", value: "12%" },
      { label: "관심 필요 팀", value: "5팀" },
    ],
    actions: [
      "노쇼 누적 팀 상담 일정 잡기",
      "자동 리마인더 설정 확인",
      "우수 출석 팀 리워드 발송",
    ],
  },
  reports: {
    title: "신고 처리 대기",
    description: "접수된 신고와 담당자 배정 현황입니다.",
    items: [
      { label: "미처리 신고", value: "5건" },
      { label: "처리 중", value: "3건" },
      { label: "평균 처리 시간", value: "7.4시간" },
    ],
    actions: [
      "긴급 신고 우선 배정",
      "SLA 임박 건 콜백",
      "처리 결과 커뮤니케이션",
    ],
  },
};
const highlightCards: HighlightCard[] = [
  {
    id: "core",
    title: "핵심 팀",
    highlight: "새벽FC",
    meta: "주 4회 모임 · 평점 4.8",
    summary: "새벽 시간대 정규 픽업을 운영하며 높은 출석률을 유지하는 팀입니다.",
    focusPoints: ["상시 용병풀 12명", "평균 출석 18명"],
    recommendations: [
      "새벽 시간 신규 참가자 매칭 유지",
      "핵심 멤버 인터뷰 콘텐츠 제작",
      "상시 용병풀 알림 실험",
    ],
  },
  {
    id: "watch",
    title: "관심 필요한 팀",
    highlight: "한강 펜타",
    meta: "노쇼 3회 · 출석 72%",
    summary: "최근 2주간 노쇼가 누적되어 추가 관리가 필요한 팀입니다.",
    focusPoints: ["노쇼 경고 발송 완료", "장비 보충 요청 대기"],
    recommendations: [
      "주장과 컨디션 점검 미팅 진행",
      "자동 리마인더 메시지 재설정",
      "장비 보충 계획 공유",
    ],
  },
  {
    id: "region",
    title: "지역 모임 현황",
    highlight: "서울 동부권",
    meta: "활동 인원 186명 · 주간 18매치",
    summary: "망우·구리 일대 공원을 중심으로 활발하게 진행 중인 주말 픽업 모임입니다.",
    focusPoints: ["신규 참가자 42명", "장비 대여 요청 4건"],
    recommendations: [
      "구장 예약 충돌 재확인",
      "장비 대여 재고 확보",
      "지역 리더 온보딩 세션 진행",
    ],
  },
];

const teams: Team[] = [
  {
    id: "team-a",
    name: "새벽FC",
    status: "normal",
    issue: "안정 운영",
    lastActivity: "03-14 새벽 · vs 용산 모닝킥 5-3 승",
    contact: "010-1234-5678 / 슬랙 실시간 응답",
    notes: ["노쇼 없음", "상시 용병풀 운영"],
    recentMatches: [
      { id: "M-3122", opponent: "용산 모닝킥", result: "승", score: "5-3", context: "평일 새벽 픽업" },
      { id: "M-3115", opponent: "홍대 유나이티드", result: "승", score: "4-2", context: "초보 케어 세션" },
    ],
  },
  {
    id: "team-b",
    name: "한강 펜타",
    status: "watch",
    issue: "최근 노쇼 3건",
    lastActivity: "03-12 저녁 · vs 잠실 킥오프 2-4 패",
    contact: "010-9876-4321 / 카카오톡 7일 미응답",
    notes: ["노쇼 경고 메시지 발송", "장비 3개 추가 요청 대기"],
    recentMatches: [
      { id: "M-3098", opponent: "잠실 킥오프", result: "패", score: "2-4", context: "평일 저녁 픽업" },
      { id: "M-3087", opponent: "왕십리 나잇볼", result: "승", score: "3-1", context: "주말 야간 매치" },
    ],
  },
  {
    id: "team-c",
    name: "주말비기너스",
    status: "problem",
    issue: "용병 참가비 분쟁 진행 중",
    lastActivity: "03-11 오전 · vs 사직 루키즈 2-1 승",
    contact: "010-5555-1111 / 전화 연결 가능",
    notes: ["환불 분쟁 대응 중", "공동 픽업 제안 협의 예정"],
    recentMatches: [
      { id: "M-3089", opponent: "사직 루키즈", result: "승", score: "2-1", context: "입문자 매치" },
      { id: "M-3070", opponent: "광안 초이스", result: "승", score: "3-0", context: "주말 정기" },
    ],
  },
  {
    id: "team-d",
    name: "판교 스타즈",
    status: "watch",
    issue: "21일간 매치 없음",
    lastActivity: "08-31 오후 · vs 분당 시티 1-2 패",
    contact: "010-2001-0001 / 카카오톡 회신 대기",
    notes: ["재활성 메시지 발송 예정", "코치 지원 문의 접수"],
    recentMatches: [
      { id: "M-2901", opponent: "분당 시티", result: "패", score: "1-2", context: "주말 오후 픽업" },
      { id: "M-2887", opponent: "서현 드리블러스", result: "무", score: "1-1", context: "친선전" },
    ],
  },
];

const reportTickets: ReportTicket[] = [
  { id: "R-9821", teamId: "team-b", type: "노쇼 신고", target: "매치 M-20412", sla: "잔여 2시간", owner: "배정 대기" },
  { id: "R-9819", teamId: "team-c", type: "분쟁 조정", target: "팀 team-c", sla: "잔여 5시간", owner: "김지원" },
  { id: "R-9818", teamId: "team-d", type: "폭언 신고", target: "플레이어 U-884", sla: "잔여 8시간", owner: "박민서" },
];

const inactiveTickets: DormantTicket[] = [
  { id: "I-1201", teamId: "team-d", gap: "21일 경과", lastMatch: "8월 31일", followUp: "재활성화 메시지 발송 예정" },
  { id: "I-1202", teamId: "team-b", gap: "14일 경과", lastMatch: "9월 7일", followUp: "코치 배정 검토" },
  { id: "I-1203", teamId: "team-c", gap: "10일 경과", lastMatch: "9월 10일", followUp: "참가 의사 확인 전화 필요" },
];

const contactTickets: ContactTicket[] = [
  { id: "C-771", teamId: "team-b", gap: "7일 미응답", lastAttempt: "9월 19일 문자", note: "전화 3회 실패" },
  { id: "C-772", teamId: "team-c", gap: "5일 미응답", lastAttempt: "9월 21일 카톡", note: "분쟁 안내 답변 대기" },
  { id: "C-773", teamId: "team-d", gap: "6일 미응답", lastAttempt: "9월 20일 이메일", note: "대체 주장 확인 필요" },
];

const riskSignals = [
  { label: "3주 이상 매치 없음", detail: "재활성화 안내 문자를 발송하세요." },
  { label: "노쇼 신고 3건 이상", detail: "팀 상태를 자동으로 '주의' 단계로 전환합니다." },
  { label: "주장 연락 1주 이상 두절", detail: "대체 주장 지정 및 연락 경로 점검이 필요합니다." },
  { label: "팀 내 분쟁 신고", detail: "중재 담당자를 배정하고 합의 진행 상황을 기록하세요." },
];

const toDateValue = () => new Date().toISOString().slice(0, 10);
const toDateTimeValue = () => new Date(Date.now() + 60 * 60 * 1000).toISOString().slice(0, 16);

const getStatusLabel = (status: TeamStatus) => {
  switch (status) {
    case "problem":
      return "문제";
    case "watch":
      return "주의";
    default:
      return "정상";
  }
};

const statusOptions: Array<{ label: string; value: TeamStatus }> = [
  { label: "정상", value: "normal" },
  { label: "주의", value: "watch" },
  { label: "문제", value: "problem" },
];

const teamActionOrder: TeamActionType[] = ["status", "memo", "contact"];

const actionTemplates: Record<TeamActionType, ActionTemplate> = {
  status: {
    title: "팀 상태 변경",
    description: "상태 전환과 사유를 기록합니다.",
    steps: ["현재 상태·로그 확인", "새 상태 선택", "변경 사유 입력"],
    fields: [
      { key: "currentStatus", label: "현재 상태", type: "text", readOnly: true },
      { key: "nextStatus", label: "변경할 상태", type: "select", options: statusOptions },
      { key: "effectiveDate", label: "적용 일자", type: "date" },
      { key: "reason", label: "변경 사유", type: "textarea", placeholder: "변경 배경과 후속 조치를 입력하세요." },
    ],
    submitLabel: "상태 변경 기록",
    successMessage: "상태 변경 요청이 저장되었습니다.",
    createDefault: (team) => ({
      currentStatus: getStatusLabel(team.status),
      nextStatus: team.status,
      effectiveDate: toDateValue(),
      reason: "",
    }),
  },
  memo: {
    title: "운영 메모",
    description: "팀 상황을 공유하는 운영 메모를 남깁니다.",
    steps: ["메모 제목 작성", "상세 내용 정리", "공유 범위 지정"],
    fields: [
      { key: "title", label: "메모 제목", type: "text", placeholder: "예) 한강 펜타 노쇼 대응" },
      {
        key: "visibility",
        label: "공유 범위",
        type: "select",
        options: [
          { label: "운영팀 전체", value: "all" },
          { label: "담당자만", value: "owner" },
        ],
      },
      { key: "body", label: "상세 내용", type: "textarea", placeholder: "주요 이슈와 후속 조치를 기록하세요." },
      { key: "tags", label: "태그", type: "text", placeholder: "예) #노쇼,#분쟁" },
    ],
    submitLabel: "메모 저장",
    successMessage: "운영 메모가 히스토리에 반영되었습니다.",
    createDefault: (team) => ({
      title: `${team.name} 운영 메모`,
      visibility: "all",
      body: "",
      tags: "",
    }),
  },
  contact: {
    title: "연락 시도",
    description: "주장 연락 채널을 통해 후속 조치를 진행합니다.",
    steps: ["연락 채널 선택", "연락 시도 시간 기록", "응답 여부 정리"],
    fields: [
      {
        key: "channel",
        label: "연락 채널",
        type: "select",
        options: [
          { label: "전화", value: "phone" },
          { label: "카카오톡", value: "messenger" },
        ],
      },
      { key: "scheduledAt", label: "연락 예정 시각", type: "datetime-local" },
      {
        key: "outcome",
        label: "응답 상태",
        type: "select",
        options: [
          { label: "대기", value: "pending" },
          { label: "응답 완료", value: "done" },
          { label: "재시도 필요", value: "retry" },
        ],
      },
      { key: "notes", label: "메모", type: "textarea", placeholder: "연락 내용과 후속 조치를 기록하세요." },
    ],
    submitLabel: "연락 시도 기록",
    successMessage: "연락 기록이 저장되었습니다.",
    createDefault: () => ({
      channel: "phone",
      scheduledAt: toDateTimeValue(),
      outcome: "pending",
      notes: "",
    }),
  },
};

const adminActionCards: AdminActionCard[] = teamActionOrder.map((action) => {
  const template = actionTemplates[action];
  return {
    type: action,
    title: template.title,
    description: template.description,
    steps: template.steps,
    cta: template.submitLabel,
  };
});
const TeamsPage = () => {
  const [selectedTeam, setSelectedTeam] = useState<Team>(teams[0]);
  const [modalState, setModalState] = useState<ModalState>(null);
  const [monitoringSelection, setMonitoringSelection] = useState<{ category: MonitoringCategory; key: string } | null>(null);

  const openMetricModal = (id: string) => {
    const detail = metricDetails[id];
    if (!detail) {
      return;
    }
    setModalState({ type: "metric", payload: detail });
  };

  const openHighlightModal = (card: HighlightCard) => {
    setModalState({ type: "highlight", payload: card });
  };

  const openActionModal = (
    action: TeamActionType,
    team: Team,
    context?: TeamActionContext,
    overrides?: Partial<Record<string, string>>,
  ) => {
    const template = actionTemplates[action];
    const defaults = template.createDefault(team);
    const values = overrides ? { ...defaults, ...overrides } : defaults;

    setModalState({
      type: "teamAction",
      action,
      team,
      context,
      values,
      mode: "form",
    });
  };

  const closeModal = () => setModalState(null);

  const handleFieldChange = (field: string, value: string) => {
    setModalState((prev) => {
      if (!prev || prev.type !== "teamAction") {
        return prev;
      }

      return {
        ...prev,
        values: { ...prev.values, [field]: value },
      };
    });
  };

  const handleActionSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setModalState((prev) => {
      if (!prev || prev.type !== "teamAction") {
        return prev;
      }

      return {
        ...prev,
        mode: "success",
      };
    });
  };

  const handleMonitoringClick = (
    category: MonitoringCategory,
    ticket: ReportTicket | DormantTicket | ContactTicket,
  ) => {
    const team = teams.find((item) => item.id === ticket.teamId);
    if (!team) {
      return;
    }

    setSelectedTeam(team);
    setMonitoringSelection({ category, key: ticket.id });

    if (category === "report") {
      const record = ticket as ReportTicket;
      openActionModal(
        "memo",
        team,
        {
          label: "신고 대기",
          description: `${team.name} · ${record.id} · 잔여 ${record.sla}`,
        },
        {
          title: `${record.id} 대응 메모`,
          body: `[${record.type}] ${team.name} 신고 처리 상황을 기록합니다.`,
          tags: "#신고,#대응",
        },
      );
      return;
    }

    if (category === "inactive") {
      const record = ticket as DormantTicket;
      openActionModal(
        "status",
        team,
        {
          label: "비활성 팀",
          description: `${team.name} · ${record.gap} · 마지막 매치 ${record.lastMatch}`,
        },
        {
          nextStatus: team.status === "problem" ? "problem" : "watch",
          reason: record.followUp,
        },
      );
      return;
    }

    const record = ticket as ContactTicket;
    openActionModal(
      "contact",
      team,
      {
        label: "연락 두절",
        description: `${team.name} · ${record.gap} · 마지막 시도 ${record.lastAttempt}`,
      },
      {
        notes: record.note,
      },
    );
  };

  const handleMonitoringKeyDown = (
    event: KeyboardEvent<HTMLLIElement>,
    category: MonitoringCategory,
    ticket: ReportTicket | DormantTicket | ContactTicket,
  ) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleMonitoringClick(category, ticket);
    }
  };

  const handleTeamRowClick = (team: Team) => {
    setSelectedTeam(team);
    setMonitoringSelection(null);
  };

  const adminActionHandleClick = (action: TeamActionType) => {
    setMonitoringSelection(null);
    openActionModal(action, selectedTeam);
  };

  const getFieldDisplayValue = (field: ActionField, value: string) => {
    if (field.type === "select" && field.options) {
      const match = field.options.find((option) => option.value === value);
      return match ? match.label : value || "-";
    }

    return value || "-";
  };

  return (
    <AdminLayout activePage="teams">
      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">팀 운영 지표</h2>
          <span className="section-meta">핵심 KPI를 빠르게 확인하세요</span>
        </div>
        <div className="metric-grid">
          {metricCards.map((card) => (
            <button
              key={card.id}
              type="button"
              className="metric-card clickable"
              onClick={() => openMetricModal(card.id)}
            >
              <div className="metric-top">
                <span className="metric-label">{card.label}</span>
              </div>
              <strong className="metric-value">{card.value}</strong>
              <div className="metric-footer">
                <span className={`metric-delta ${card.deltaTone}`}>{card.delta}</span>
                <span className="metric-note">{card.note}</span>
              </div>
            </button>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">문제 상황 모니터링</h2>
          <span className="section-meta">신고 · 비활성 · 연락 두절 집중 관리</span>
        </div>
        <div className="grid-3">
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">신고 대기</h3>
              <span className="card-meta">미처리 {reportTickets.length}건</span>
            </div>
            <ul className="card-list">
              {reportTickets.map((item) => (
                <li
                  key={item.id}
                  className={
                    monitoringSelection?.category === "report" && monitoringSelection.key === item.id
                      ? "monitoring-item active"
                      : "monitoring-item"
                  }
                  onClick={() => handleMonitoringClick("report", item)}
                  onKeyDown={(event) => handleMonitoringKeyDown(event, "report", item)}
                  role="button"
                  tabIndex={0}
                >
                  <strong>{item.id}</strong> · {item.type} ({item.target})
                  <br />
                  <span className="card-meta">잔여 {item.sla} · {item.owner}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">비활성 팀</h3>
              <span className="card-meta">3주 이상 휴면 팀</span>
            </div>
            <ul className="card-list">
              {inactiveTickets.map((item) => {
                const team = teams.find((value) => value.id === item.teamId);
                return (
                  <li
                    key={item.id}
                    className={
                      monitoringSelection?.category === "inactive" && monitoringSelection.key === item.id
                        ? "monitoring-item active"
                        : "monitoring-item"
                    }
                    onClick={() => handleMonitoringClick("inactive", item)}
                    onKeyDown={(event) => handleMonitoringKeyDown(event, "inactive", item)}
                    role="button"
                    tabIndex={0}
                  >
                    <strong>{team?.name ?? item.teamId}</strong> · {item.gap}
                    <br />
                    <span className="card-meta">마지막 매치 {item.lastMatch} · {item.followUp}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="card">
            <div className="card-header">
              <h3 className="card-title">연락 두절</h3>
              <span className="card-meta">주장 미응답 팀</span>
            </div>
            <ul className="card-list">
              {contactTickets.map((item) => {
                const team = teams.find((value) => value.id === item.teamId);
                return (
                  <li
                    key={item.id}
                    className={
                      monitoringSelection?.category === "contact" && monitoringSelection.key === item.id
                        ? "monitoring-item active"
                        : "monitoring-item"
                    }
                    onClick={() => handleMonitoringClick("contact", item)}
                    onKeyDown={(event) => handleMonitoringKeyDown(event, "contact", item)}
                    role="button"
                    tabIndex={0}
                  >
                    <strong>{team?.name ?? item.teamId}</strong> · {item.gap}
                    <br />
                    <span className="card-meta">마지막 시도 {item.lastAttempt} · {item.note}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">팀 스냅샷</h2>
          <span className="section-meta">주요 팀 흐름을 카드로 살펴보세요</span>
        </div>
        <div className="grid-3">
          {highlightCards.map((card) => (
            <button
              key={card.id}
              type="button"
              className="card simple-card highlight-card"
              onClick={() => openHighlightModal(card)}
            >
              <h3 className="card-title">{card.title}</h3>
              <p className="card-highlight">{card.highlight}</p>
              <p className="card-meta">{card.meta}</p>
              <p className="card-meta">{card.summary}</p>
              <strong className="detail-heading">포인트</strong>
              <ul className="card-list">
                {card.focusPoints.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
              <span className="card-link">자세히 보기</span>
            </button>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">관리자 액션</h2>
          <span className="section-meta">실행 단계를 미리 확인하고 조치하세요</span>
        </div>
        <div className="grid-3">
          {adminActionCards.map((card) => (
            <div key={card.type} className="card simple-card">
              <h3 className="card-title">{card.title}</h3>
              <p className="card-meta">{card.description}</p>
              <strong className="detail-heading">실행 단계</strong>
              <ul className="card-list">
                {card.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ul>
              <button type="button" className="section-btn" onClick={() => adminActionHandleClick(card.type)}>
                {card.cta}
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">위험 신호</h2>
          <span className="section-meta">미리 대응이 필요한 패턴</span>
        </div>
        <div className="card simple-card">
          <ul className="card-list">
            {riskSignals.map((item) => (
              <li key={item.label}>
                <strong>{item.label}</strong>: {item.detail}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">팀 상세</h2>
          <span className="section-meta">선택된 팀의 상황과 즉시 실행 가능한 조치</span>
        </div>
        <div className="team-overview-layout">
          <div className="card table-card table-clickable">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>팀</th>
                  <th>핵심 이슈</th>
                  <th>최근 활동</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team) => (
                  <tr
                    key={team.id}
                    className={team.id === selectedTeam.id ? "active" : ""}
                    onClick={() => handleTeamRowClick(team)}
                  >
                    <td>{team.name}</td>
                    <td>{team.issue}</td>
                    <td>{team.lastActivity}</td>
                    <td>{getStatusLabel(team.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="team-detail-panel">
            <div className="team-detail-header">
              <div>
                <h3>{selectedTeam.name}</h3>
                <p className="team-detail-meta">{selectedTeam.contact}</p>
              </div>
              <span className={`team-watch-chip ${selectedTeam.status}`}>{getStatusLabel(selectedTeam.status)}</span>
            </div>

            <ul className="card-list team-health-list">
              <li>
                <strong>핵심 이슈</strong>: {selectedTeam.issue}
              </li>
              <li>
                <strong>최근 활동</strong>: {selectedTeam.lastActivity}
              </li>
            </ul>

            <div className="team-detail-section">
              <h4>운영 메모</h4>
              <ul className="card-list">
                {selectedTeam.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </div>

            <div className="team-detail-section">
              <h4>최근 매치</h4>
              <table className="admin-table compact">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>상대</th>
                    <th>결과</th>
                    <th>비고</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedTeam.recentMatches.map((match) => (
                    <tr key={match.id}>
                      <td>{match.id}</td>
                      <td>{match.opponent}</td>
                      <td>
                        <span
                          className={`result-pill ${
                            match.result === "승"
                              ? "result-win"
                              : match.result === "무"
                              ? "result-draw"
                              : "result-loss"
                          }`}
                        >
                          {match.result} {match.score}
                        </span>
                      </td>
                      <td>{match.context}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="team-detail-actions">
              <h4>가능한 운영 액션</h4>
              <div className="team-action-list">
                {teamActionOrder.map((action) => {
                  const template = actionTemplates[action];
                  return (
                    <div key={action} className="team-action-card">
                      <h5>{template.title}</h5>
                      <p className="card-meta">{template.description}</p>
                      <strong className="detail-heading">실행 단계</strong>
                      <ul className="card-list">
                        {template.steps.map((step) => (
                          <li key={step}>{step}</li>
                        ))}
                      </ul>
                      <button type="button" className="btn-ghost" onClick={() => adminActionHandleClick(action)}>
                        실행하기
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {modalState && modalState.type === "metric" && (
        <div className="admin-modal-backdrop" role="presentation" onClick={closeModal}>
          <div className="admin-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            <div className="admin-modal-header">
              <h3>{modalState.payload.title}</h3>
              <button type="button" className="btn-close" aria-label="닫기" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="admin-modal-body">
              <p className="modal-summary">{modalState.payload.description}</p>
              <div className="modal-metrics">
                {modalState.payload.items.map((item) => (
                  <div key={item.label} className="modal-metric">
                    <span className="label">{item.label}</span>
                    <span className="value">{item.value}</span>
                  </div>
                ))}
              </div>
              <div className="modal-section">
                <h4>추천 액션</h4>
                <ul className="modal-list">
                  {modalState.payload.actions.map((action) => (
                    <li key={action}>{action}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="btn btn-primary" onClick={closeModal}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {modalState && modalState.type === "highlight" && (
        <div className="admin-modal-backdrop" role="presentation" onClick={closeModal}>
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="admin-modal-header">
              <h3>{modalState.payload.title}</h3>
              <button type="button" className="btn-close" aria-label="닫기" onClick={closeModal}>
                ×
              </button>
            </div>
            <div className="admin-modal-body">
              <p className="modal-summary">{modalState.payload.summary}</p>
              <div className="modal-section">
                <h4>핵심 포인트</h4>
                <ul className="modal-list">
                  {modalState.payload.focusPoints.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
              <div className="modal-section">
                <h4>추천 액션</h4>
                <ul className="modal-list">
                  {modalState.payload.recommendations.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="admin-modal-actions">
              <button type="button" className="btn btn-primary" onClick={closeModal}>
                확인
              </button>
            </div>
          </div>
        </div>
      )}

      {modalState && modalState.type === "teamAction" && (
        <div className="admin-modal-backdrop" role="presentation" onClick={closeModal}>
          <div className="admin-modal" role="dialog" aria-modal="true" onClick={(event) => event.stopPropagation()}>
            {(() => {
              const template = actionTemplates[modalState.action];

              return (
                <>
                  <div className="admin-modal-header">
                    <h3>
                      {template.title} · {modalState.team.name}
                    </h3>
                    <button type="button" className="btn-close" aria-label="닫기" onClick={closeModal}>
                      ×
                    </button>
                  </div>
                  <div className="admin-modal-body">
                    {modalState.context && (
                      <div className="modal-context">
                        <span className="context-label">{modalState.context.label}</span>
                        <p>{modalState.context.description}</p>
                      </div>
                    )}

                    {modalState.mode === "form" ? (
                      <form className="modal-form" onSubmit={handleActionSubmit}>
                        {template.fields.map((field) => {
                          const value = modalState.values[field.key] ?? "";

                          if (field.type === "select" && field.options) {
                            return (
                              <label key={field.key} className="modal-field">
                                <span className="modal-field-label">{field.label}</span>
                                <select
                                  value={value}
                                  onChange={(event) => handleFieldChange(field.key, event.target.value)}
                                  disabled={field.readOnly}
                                >
                                  {field.options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                      {option.label}
                                    </option>
                                  ))}
                                </select>
                              </label>
                            );
                          }

                          if (field.type === "textarea") {
                            return (
                              <label key={field.key} className="modal-field">
                                <span className="modal-field-label">{field.label}</span>
                                <textarea
                                  value={value}
                                  placeholder={field.placeholder}
                                  onChange={(event) => handleFieldChange(field.key, event.target.value)}
                                  readOnly={field.readOnly}
                                />
                              </label>
                            );
                          }

                          return (
                            <label key={field.key} className="modal-field">
                              <span className="modal-field-label">{field.label}</span>
                              <input
                                type={field.type === "text" ? "text" : field.type}
                                value={value}
                                placeholder={field.placeholder}
                                readOnly={field.readOnly}
                                onChange={(event) => handleFieldChange(field.key, event.target.value)}
                              />
                            </label>
                          );
                        })}
                        <button type="submit" className="btn btn-primary">
                          {template.submitLabel}
                        </button>
                      </form>
                    ) : (
                      <div className="modal-success">
                        <h4>{template.successMessage}</h4>
                        <ul className="modal-list">
                          {template.fields.map((field) => (
                            <li key={field.key}>
                              <strong>{field.label}:</strong> {getFieldDisplayValue(field, modalState.values[field.key])}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  <div className="admin-modal-actions">
                    <button type="button" className="btn btn-primary" onClick={closeModal}>
                      닫기
                 </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default TeamsPage;
alue: "5건" },
      { label: "처리 중", value: "3건" },
      { label: "평균 처리 시간", value: "7.4시간" },
    ],
    actions: [
      "긴급 신고 우선 배정",
      "SLA 임박 건 콜백",
      "처리 결과 커뮤니케이션",
    ],
  },
};

// TODO: remaining code to be appended