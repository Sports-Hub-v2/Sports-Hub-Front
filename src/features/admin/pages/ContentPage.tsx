import { useLocation, useNavigate } from "react-router-dom";
import { X, Search, Filter, Eye, Edit2, Trash2, CheckCircle, Clock, FileText, MessageSquare, AlertTriangle, Ban, Shield } from "lucide-react";
import { useState } from "react";
import AdminLayout from "../components/AdminLayout";
import ContentDetailModal from "../components/ContentDetailModal";

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
    content: "이번 주 MVP는 누구일까요? 여러분의 의견을 들려주세요!",
    author: "coach_lee",
    authorId: "U-7001",
    status: "검수 중",
    createdAt: "어제 22:14",
    updatedAt: "어제 22:14",
    views: 45,
    likes: 8,
    shares: 2,
    tags: ["MVP", "리뷰"],
    editHistory: [
      { id: "EH-016", editor: "coach_lee", editorId: "U-7001", action: "게시물 작성", changes: "MVP 리뷰 게시물 작성", timestamp: "어제 22:14", type: "create" as const }
    ],
    managementHistory: [
      { id: "MH-022", action: "검수 대기", description: "관리자 검수를 기다리고 있습니다", timestamp: "어제 22:15", admin: "시스템", type: "review" as const }
    ],
    comments: []
  },
  {
    id: "CNT-318",
    type: "공지",
    title: "4월 경기 일정 안내",
    content: "4월 경기 일정을 안내드립니다. 자세한 일정은 본문을 참고해주세요.",
    author: "운영팀",
    authorId: "ADMIN-001",
    status: "게시",
    createdAt: "오늘 09:20",
    updatedAt: "오늘 09:20",
    views: 234,
    likes: 45,
    shares: 12,
    tags: ["공지", "일정"],
    editHistory: [
      { id: "EH-017", editor: "관리자 김민수", editorId: "ADMIN-001", action: "공지 작성", changes: "4월 일정 공지 작성", timestamp: "오늘 09:20", type: "create" as const }
    ],
    managementHistory: [
      { id: "MH-023", action: "승인 및 게시", description: "공지사항이 즉시 게시되었습니다", timestamp: "오늘 09:21", admin: "관리자 김민수", adminId: "ADMIN-001", type: "approve" as const }
    ],
    comments: []
  },
  {
    id: "CNT-315",
    type: "배너",
    title: "스폰서 이벤트 안내",
    content: "신규 스폰서 이벤트를 진행합니다!",
    author: "marketing",
    authorId: "ADMIN-005",
    status: "초안",
    createdAt: "어제 18:02",
    updatedAt: "어제 18:02",
    views: 12,
    likes: 3,
    shares: 1,
    tags: ["배너", "이벤트"],
    editHistory: [
      { id: "EH-018", editor: "마케팅팀", editorId: "ADMIN-005", action: "배너 초안", changes: "이벤트 배너 초안 작성", timestamp: "어제 18:02", type: "create" as const }
    ],
    managementHistory: [
      { id: "MH-024", action: "초안 저장", description: "배너 초안이 저장되었습니다", timestamp: "어제 18:03", admin: "시스템", type: "review" as const }
    ],
    comments: []
  },
];

const todayPosts = [
  {
    id: "POST-401",
    type: "팀 게시물",
    title: "강남 FC 주간 훈련 일정 안내",
    content: "이번 주 훈련 일정을 안내드립니다.\n\n월요일: 오후 7시 - 기초 체력 훈련\n화요일: 오후 7시 - 전술 훈련\n수요일: 휴식\n목요일: 오후 7시 - 미니 게임\n금요일: 오후 7시 - 슈팅 및 패스 연습\n\n모든 훈련은 탄천 종합운동장에서 진행됩니다. 많은 참여 부탁드립니다!",
    author: "강남FC_관리자",
    authorId: "U-1001",
    status: "게시됨",
    createdAt: "오늘 08:30",
    updatedAt: "오늘 09:15",
    views: 124,
    likes: 23,
    shares: 5,
    reportCount: 0,
    tags: ["훈련", "일정", "공지"],
    editHistory: [
      {
        id: "EH-001",
        editor: "강남FC_관리자",
        editorId: "U-1001",
        action: "게시물 작성",
        changes: "초기 게시물 작성",
        timestamp: "오늘 08:30",
        type: "create" as const,
        contentSnapshot: "이번 주 훈련 일정을 안내드립니다.\n\n월요일: 오후 7시 - 기초 체력 훈련\n화요일: 오후 7시 - 전술 훈련\n수요일: 휴식\n목요일: 오후 7시 - 미니 게임\n금요일: 오후 6시 - 슈팅 및 패스 연습\n\n모든 훈련은 탄천 종합운동장에서 진행됩니다. 많은 참여 부탁드립니다!"
      },
      {
        id: "EH-002",
        editor: "강남FC_관리자",
        editorId: "U-1001",
        action: "내용 수정",
        changes: "금요일 훈련 시간을 오후 6시에서 7시로 변경",
        timestamp: "오늘 09:15",
        type: "edit" as const,
        contentSnapshot: "이번 주 훈련 일정을 안내드립니다.\n\n월요일: 오후 7시 - 기초 체력 훈련\n화요일: 오후 7시 - 전술 훈련\n수요일: 휴식\n목요일: 오후 7시 - 미니 게임\n금요일: 오후 7시 - 슈팅 및 패스 연습\n\n모든 훈련은 탄천 종합운동장에서 진행됩니다. 많은 참여 부탁드립니다!"
      }
    ],
    managementHistory: [
      { id: "MH-001", action: "자동 검수", description: "AI 자동 검수 시스템을 통과했습니다", timestamp: "오늘 08:31", admin: "시스템", type: "review" as const },
      { id: "MH-002", action: "승인 및 게시", description: "관리자가 게시물을 검토하고 승인했습니다", timestamp: "오늘 08:32", admin: "관리자 김민수", adminId: "ADMIN-001", type: "approve" as const }
    ],
    comments: [
      { id: "C-001", author: "김철수", authorId: "U-1002", content: "이번 주도 열심히 참여하겠습니다!", timestamp: "오늘 08:45", likes: 5, isReported: false },
      { id: "C-002", author: "이영희", authorId: "U-1003", content: "목요일은 참석 어려울 것 같아요 ㅠㅠ", timestamp: "오늘 09:00", likes: 2, isReported: false },
      { id: "C-003", author: "박민수", authorId: "U-1004", content: "금요일 시간 변경 감사합니다!", timestamp: "오늘 09:20", likes: 3, isReported: false }
    ]
  },
  {
    id: "POST-402",
    type: "용병 모집",
    title: "내일 아침 6시 경기 용병 1명 구합니다",
    content: "안녕하세요! 내일(금요일) 아침 6시 탄천 종합운동장에서 경기가 있는데 용병 1명을 구합니다.\n\n포지션: 미드필더 또는 공격수\n레벨: 중급 이상\n비용: 2만원\n\n관심 있으신 분은 댓글이나 쪽지 부탁드립니다!",
    author: "축구왕김씨",
    authorId: "U-2001",
    status: "게시됨",
    createdAt: "오늘 09:15",
    views: 89,
    likes: 12,
    shares: 3,
    tags: ["용병", "모집", "미드필더"],
    editHistory: [
      {
        id: "EH-003",
        editor: "축구왕김씨",
        editorId: "U-2001",
        action: "게시물 작성",
        changes: "용병 모집 게시물 작성",
        timestamp: "오늘 09:15",
        type: "create" as const,
        contentSnapshot: "안녕하세요! 내일(금요일) 아침 6시 탄천 종합운동장에서 경기가 있는데 용병 1명을 구합니다.\n\n포지션: 미드필더 또는 공격수\n레벨: 중급 이상\n비용: 2만원\n\n관심 있으신 분은 댓글이나 쪽지 부탁드립니다!"
      }
    ],
    managementHistory: [
      { id: "MH-003", action: "자동 검수", description: "스팸 필터 통과", timestamp: "오늘 09:16", admin: "시스템", type: "review" as const },
      { id: "MH-004", action: "승인", description: "용병 모집 게시물이 승인되었습니다", timestamp: "오늘 09:17", admin: "관리자 이영희", adminId: "ADMIN-002", type: "approve" as const }
    ],
    comments: [
      { id: "C-004", author: "이준호", authorId: "U-2002", content: "저 참여 가능합니다! 쪽지 보냈어요", timestamp: "오늘 09:30", likes: 1, isReported: false },
      { id: "C-005", author: "최민수", authorId: "U-2003", content: "시간이 너무 이르네요 ㅠㅠ", timestamp: "오늘 09:45", likes: 0, isReported: false }
    ]
  },
  {
    id: "POST-403",
    type: "공지사항",
    title: "4월 정기 점검 안내",
    content: "안녕하세요, Sports Hub 운영팀입니다.\n\n4월 정기 시스템 점검을 아래와 같이 실시합니다.\n\n일시: 2025년 4월 10일 (목) 02:00 ~ 06:00\n내용:\n- 서버 안정화 작업\n- 데이터베이스 최적화\n- 보안 패치 적용\n\n점검 시간 동안 서비스 이용이 일시적으로 중단될 수 있습니다.\n양해 부탁드립니다.\n\n감사합니다.",
    author: "운영팀",
    authorId: "ADMIN-001",
    status: "게시됨",
    createdAt: "오늘 10:00",
    views: 342,
    likes: 45,
    shares: 12,
    tags: ["공지", "점검", "시스템"],
    editHistory: [
      {
        id: "EH-004",
        editor: "관리자 김민수",
        editorId: "ADMIN-001",
        action: "공지사항 작성",
        changes: "정기 점검 공지사항 작성",
        timestamp: "오늘 10:00",
        type: "create" as const,
        contentSnapshot: "안녕하세요, Sports Hub 운영팀입니다.\n\n4월 정기 시스템 점검을 아래와 같이 실시합니다.\n\n일시: 2025년 4월 10일 (목) 02:00 ~ 06:00\n내용:\n- 서버 안정화 작업\n- 데이터베이스 최적화\n- 보안 패치 적용\n\n점검 시간 동안 서비스 이용이 일시적으로 중단될 수 있습니다.\n양해 부탁드립니다.\n\n감사합니다."
      }
    ],
    managementHistory: [
      { id: "MH-005", action: "공지 등록", description: "시스템 점검 공지사항이 등록되었습니다", timestamp: "오늘 10:00", admin: "관리자 김민수", adminId: "ADMIN-001", type: "approve" as const },
      { id: "MH-006", action: "우선순위 설정", description: "긴급 공지로 설정되어 상단에 고정되었습니다", timestamp: "오늘 10:01", admin: "관리자 김민수", adminId: "ADMIN-001", type: "review" as const }
    ],
    comments: [
      { id: "C-006", author: "박성민", authorId: "U-3001", content: "점검 시간을 좀 더 짧게 할 수 없나요?", timestamp: "오늘 10:15", likes: 3, isReported: false },
      { id: "C-007", author: "정우진", authorId: "U-3002", content: "새벽 시간이라 괜찮을 것 같아요", timestamp: "오늘 10:30", likes: 7, isReported: false }
    ]
  },
  {
    id: "POST-404",
    type: "팀 모집",
    title: "주말 경기 상대팀 찾습니다",
    content: "안녕하세요, 성동FC입니다.\n\n이번 주 토요일 오후 3시에 경기 가능한 상대팀을 찾습니다.\n\n우리 팀 레벨: 중상급\n선호 경기장: 서울 동부 지역\n인원: 11 vs 11 풀 매치\n\n관심 있으신 팀은 댓글 남겨주세요!",
    author: "성동FC",
    authorId: "T-001",
    status: "검수 중",
    createdAt: "오늘 11:20",
    views: 56,
    likes: 8,
    shares: 2,
    reportCount: 1,
    tags: ["팀모집", "상대팀", "주말경기"],
    editHistory: [
      {
        id: "EH-005",
        editor: "성동FC",
        editorId: "T-001",
        action: "게시물 작성",
        changes: "상대팀 모집 게시물 작성",
        timestamp: "오늘 11:20",
        type: "create" as const,
        contentSnapshot: "안녕하세요, 성동FC입니다.\n\n이번 주 토요일 오후 3시에 경기 가능한 상대팀을 찾습니다.\n\n우리 팀 레벨: 중상급\n선호 경기장: 서울 동부 지역\n인원: 11 vs 11 풀 매치\n\n관심 있으신 팀은 댓글 남겨주세요!"
      }
    ],
    managementHistory: [
      { id: "MH-007", action: "자동 검수", description: "AI 시스템 검수 완료", timestamp: "오늘 11:21", admin: "시스템", type: "review" as const },
      { id: "MH-008", action: "승인", description: "팀 모집 게시물이 승인되었습니다", timestamp: "오늘 11:22", admin: "관리자 박철수", adminId: "ADMIN-003", type: "approve" as const },
      { id: "MH-009", action: "신고 접수", description: "사용자로부터 스팸 의심 신고가 접수되었습니다", timestamp: "오늘 11:51", admin: "시스템", type: "report" as const },
      { id: "MH-010", action: "검토 대기", description: "신고 내용 검토를 위해 검수 대기 상태로 변경되었습니다", timestamp: "오늘 11:52", admin: "관리자 이영희", adminId: "ADMIN-002", type: "review" as const }
    ],
    comments: [
      { id: "C-008", author: "광진FC", authorId: "T-002", content: "저희 팀 가능합니다!", timestamp: "오늘 11:35", likes: 2, isReported: false },
      { id: "C-009", author: "신고자", authorId: "U-9999", content: "이 게시물은 스팸입니다 [신고됨]", timestamp: "오늘 11:50", likes: 0, isReported: true }
    ]
  },
  {
    id: "POST-405",
    type: "후기",
    title: "지난 주말 경기 후기 - 강남 FC vs 서초 유나이티드",
    content: "지난 주말 경기 정말 재미있었습니다!\n\n최종 스코어는 3:2로 강남 FC의 승리였는데요, 경기 내용이 정말 박진감 넘쳤습니다.\n\n전반전에는 서초가 2:0으로 앞서갔지만, 후반전에 강남이 3골을 연속으로 터뜨리며 역전승을 거뒀습니다.\n\n특히 홍길동 선수의 2골이 인상적이었어요. 양 팀 모두 수고하셨습니다!\n\n다음 경기도 기대됩니다 ^^",
    author: "축구매니아",
    authorId: "U-5001",
    status: "게시됨",
    createdAt: "오늘 12:45",
    views: 178,
    likes: 34,
    shares: 8,
    tags: ["후기", "경기", "강남FC", "서초유나이티드"],
    editHistory: [
      {
        id: "EH-006",
        editor: "축구매니아",
        editorId: "U-5001",
        action: "후기 작성",
        changes: "경기 후기 게시물 작성",
        timestamp: "오늘 12:45",
        type: "create" as const,
        contentSnapshot: "지난 주말 경기 정말 재미있었습니다!\n\n최종 스코어는 3:2로 강남 FC의 승리였는데요, 경기 내용이 정말 박진감 넘쳤습니다.\n\n전반전에는 서초가 2:0으로 앞서갔지만, 후반전에 강남이 3골을 연속으로 터뜨리며 역전승을 거뒀습니다.\n\n특히 홍걸동 선수의 2골이 인상적이었어요. 양 팀 모두 수고하셨습니다!\n\n다음 경기도 기대됩니다 ^^"
      },
      {
        id: "EH-007",
        editor: "축구매니아",
        editorId: "U-5001",
        action: "오타 수정",
        changes: "홍걸동 → 홍길동으로 오타 수정",
        timestamp: "오늘 12:50",
        type: "edit" as const,
        contentSnapshot: "지난 주말 경기 정말 재미있었습니다!\n\n최종 스코어는 3:2로 강남 FC의 승리였는데요, 경기 내용이 정말 박진감 넘쳤습니다.\n\n전반전에는 서초가 2:0으로 앞서갔지만, 후반전에 강남이 3골을 연속으로 터뜨리며 역전승을 거뒀습니다.\n\n특히 홍길동 선수의 2골이 인상적이었어요. 양 팀 모두 수고하셨습니다!\n\n다음 경기도 기대됩니다 ^^"
      }
    ],
    managementHistory: [
      { id: "MH-011", action: "자동 검수", description: "콘텐츠 품질 검사 통과", timestamp: "오늘 12:46", admin: "시스템", type: "review" as const },
      { id: "MH-012", action: "승인 및 게시", description: "양질의 콘텐츠로 판단되어 즉시 승인되었습니다", timestamp: "오늘 12:47", admin: "관리자 최수진", adminId: "ADMIN-004", type: "approve" as const },
      { id: "MH-013", action: "추천 등록", description: "추천 게시물로 선정되어 메인 피드에 노출됩니다", timestamp: "오늘 13:00", admin: "관리자 최수진", adminId: "ADMIN-004", type: "review" as const }
    ],
    comments: [
      { id: "C-010", author: "강남FC_관리자", authorId: "U-1001", content: "응원 감사합니다! 다음 경기도 열심히 하겠습니다!", timestamp: "오늘 13:00", likes: 12, isReported: false },
      { id: "C-011", author: "서초유나이티드", authorId: "T-003", content: "아쉬운 패배였지만 좋은 경기였어요", timestamp: "오늘 13:15", likes: 9, isReported: false },
      { id: "C-012", author: "홍길동", authorId: "U-301", content: "감사합니다! 운이 좋았어요 ㅎㅎ", timestamp: "오늘 13:30", likes: 15, isReported: false }
    ]
  },
];

const templateShortcuts = [
  {
    title: "공지 템플릿",
    highlight: "8개",
    meta: "최근 업데이트 3월 10일",
    actions: ["경기 일정", "점검 안내", "이벤트"]
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
    actions: ["스폰서", "팀 모집", "용병 모집"]
  },
];

// 유저 간 메시지 목록
const userMessages = [
  {
    id: "MSG-101",
    from: "김철수",
    fromId: 12345,
    to: "박영희",
    toId: 12346,
    subject: "경기 시간 변경 요청",
    preview: "안녕하세요, 다음 주 경기 시간을 오후 2시에서 4시로 변경 가능할까요?",
    content: "안녕하세요, 다음 주 경기 시간을 오후 2시에서 4시로 변경 가능할까요? 팀원 중 한 명이 오후 2시에 다른 일정이 생겨서 참석이 어렵다고 합니다. 가능하시다면 회신 부탁드립니다.",
    sentAt: "10분 전",
    status: "정상",
    isRead: false,
    hasAttachment: false,
    reportCount: 0,
  },
  {
    id: "MSG-102",
    from: "이민수",
    fromId: 12347,
    to: "최지훈",
    toId: 12348,
    subject: "용병 문의",
    preview: "이번 주말 경기에 용병으로 참여 가능하신가요?",
    content: "안녕하세요! 이번 주 토요일 오전 10시 경기에 용병 한 분이 필요한데 참여 가능하신가요? 위치는 공격수입니다.",
    sentAt: "1시간 전",
    status: "정상",
    isRead: true,
    hasAttachment: false,
    reportCount: 0,
  },
  {
    id: "MSG-103",
    from: "정욱진",
    fromId: 12349,
    to: "강민호",
    toId: 12350,
    subject: "경기 후 회식 장소",
    preview: "다음 경기 후에 회식하는데 어디가 좋을까요?",
    content: "형님, 다음 경기 끝나고 회식하기로 했잖아요. 어디서 할까요? 저는 삼겹살이나 치킨이 좋은데 의견 주세요!",
    sentAt: "3시간 전",
    status: "정상",
    isRead: true,
    hasAttachment: false,
    reportCount: 0,
  },
  {
    id: "MSG-104",
    from: "박상철",
    fromId: 12351,
    to: "윤태영",
    toId: 12352,
    subject: "팀 합류 문의",
    preview: "귀 팀에 합류하고 싶습니다. 어떻게 신청하나요?",
    content: "안녕하세요, 귀 팀 경기를 몇 번 봤는데 정말 멋있더라고요. 저도 합류하고 싶은데 어떻게 신청하면 될까요? 포지션은 미드필더이고 경력은 5년 정도입니다.",
    sentAt: "어제 22:30",
    status: "정상",
    isRead: true,
    hasAttachment: false,
    reportCount: 0,
  },
  {
    id: "MSG-105",
    from: "김도현",
    fromId: 12353,
    to: "이승훈",
    toId: 12354,
    subject: "Re: 경기 결과 이의 제기",
    preview: "심판 판정에 문제가 있었던 것 같습니다. 영상 확인 부탁드립니다.",
    content: "안녕하세요. 지난 경기에서 오프사이드 판정에 이의가 있어 연락드립니다. 당시 영상을 보면 명백히 온사이드였는데 오프사이드로 판정되었습니다. 확인 부탁드립니다.",
    sentAt: "어제 20:15",
    status: "검토 필요",
    isRead: false,
    hasAttachment: true,
    reportCount: 1,
  },
  {
    id: "MSG-106",
    from: "최현우",
    fromId: 12355,
    to: "정재원",
    toId: 12356,
    subject: "경기 장소 확인",
    preview: "다음 경기 장소가 어디인지 확인해주실 수 있나요?",
    content: "안녕하세요, 다음 주 일요일 경기 장소를 확인하고 싶습니다. 공지에는 나와있지 않아서 문의드립니다.",
    sentAt: "2일 전",
    status: "정상",
    isRead: true,
    hasAttachment: false,
    reportCount: 0,
  },
  {
    id: "MSG-107",
    from: "배성민",
    fromId: 12357,
    to: "송준혁",
    toId: 12358,
    subject: "!!!긴급!!! 돈 좀 빌려주세요",
    preview: "급하게 돈이 필요합니다. 50만원만 빌려주실 수 있나요?",
    content: "안녕하세요. 갑자기 급한 일이 생겨서 연락드립니다. 50만원만 급하게 빌려주실 수 있을까요? 다음 주에 꼭 갚겠습니다. 계좌번호 알려주시면 감사하겠습니다.",
    sentAt: "3일 전",
    status: "의심",
    isRead: true,
    hasAttachment: false,
    reportCount: 3,
  },
  {
    id: "MSG-108",
    from: "한승우",
    fromId: 12359,
    to: "조민재",
    toId: 12360,
    subject: "욕설 및 협박",
    preview: "너 다음에 경기에서 만나면 가만 안 둔다",
    content: "[내용 숨김 - 부적절한 내용 포함]",
    sentAt: "4일 전",
    status: "차단됨",
    isRead: false,
    hasAttachment: false,
    reportCount: 5,
  },
];

// 전체 콘텐츠 목록
const allContents = [
  ...todayPosts,
  {
    id: "POST-400",
    type: "팀 게시물",
    title: "서초 유나이티드 월간 MVP 투표",
    content: "3월 MVP 투표를 시작합니다!\n\n후보:\n1. 김철수 - 5골 2도움\n2. 이영희 - 4골 3도움\n3. 박민수 - 8경기 무실점\n\n댓글로 투표해주세요!",
    author: "서초유나이티드",
    authorId: "T-003",
    status: "게시됨",
    createdAt: "어제 20:30",
    updatedAt: "어제 20:30",
    views: 256,
    likes: 45,
    shares: 8,
    tags: ["투표", "MVP", "이벤트"],
    editHistory: [
      { id: "EH-008", editor: "서초유나이티드", editorId: "T-003", action: "투표 게시", changes: "월간 MVP 투표 게시물 작성", timestamp: "어제 20:30", type: "create" as const }
    ],
    managementHistory: [
      { id: "MH-014", action: "승인", description: "팀 내부 이벤트 게시물이 승인되었습니다", timestamp: "어제 20:31", admin: "관리자 김민수", adminId: "ADMIN-001", type: "approve" as const }
    ],
    comments: [
      { id: "C-013", author: "회원A", authorId: "U-4001", content: "김철수 선수 한 표!", timestamp: "어제 21:00", likes: 8, isReported: false },
      { id: "C-014", author: "회원B", authorId: "U-4002", content: "박민수 골키퍼님 최고!", timestamp: "어제 21:15", likes: 12, isReported: false }
    ]
  },
  {
    id: "POST-399",
    type: "용병 모집",
    title: "주말 저녁 7시 경기 용병 2명 구합니다",
    content: "주말 저녁 7시 탄천에서 경기 있는데 용병 2명 급구합니다! 포지션 상관없어요.",
    author: "광진FC",
    authorId: "T-004",
    status: "게시됨",
    createdAt: "어제 18:15",
    updatedAt: "어제 18:15",
    views: 178,
    likes: 15,
    shares: 4,
    tags: ["용병", "주말"],
    editHistory: [
      { id: "EH-009", editor: "광진FC", editorId: "T-004", action: "게시물 작성", changes: "용병 모집 게시물 작성", timestamp: "어제 18:15", type: "create" as const }
    ],
    managementHistory: [
      { id: "MH-015", action: "승인", description: "용병 모집 게시물 승인", timestamp: "어제 18:16", admin: "관리자 박철수", adminId: "ADMIN-003", type: "approve" as const }
    ],
    comments: []
  },
  {
    id: "POST-398",
    type: "후기",
    title: "첫 조기축구 경험 후기",
    content: "오늘 처음으로 조기축구를 해봤는데 너무 재미있었어요! 다음에 또 참여하고 싶습니다.",
    author: "축구초보",
    authorId: "U-6001",
    status: "검수 중",
    createdAt: "어제 16:45",
    updatedAt: "어제 16:45",
    views: 89,
    likes: 8,
    shares: 1,
    tags: ["후기", "첫경험"],
    editHistory: [
      { id: "EH-010", editor: "축구초보", editorId: "U-6001", action: "게시물 작성", changes: "첫 경험 후기 작성", timestamp: "어제 16:45", type: "create" as const }
    ],
    managementHistory: [
      { id: "MH-016", action: "검수 대기", description: "자동 검수 시스템에서 검토 중", timestamp: "어제 16:46", admin: "시스템", type: "review" as const }
    ],
    comments: []
  },
  {
    id: "CNT-319",
    type: "공지",
    title: "봄맞이 친선 대회 안내",
    content: "4월 15일 봄맞이 친선 대회를 개최합니다. 많은 참여 부탁드립니다!",
    author: "운영팀",
    authorId: "ADMIN-001",
    status: "게시됨",
    createdAt: "2일 전",
    updatedAt: "2일 전",
    views: 445,
    likes: 67,
    shares: 23,
    tags: ["공지", "대회", "이벤트"],
    editHistory: [
      { id: "EH-011", editor: "관리자 김민수", editorId: "ADMIN-001", action: "공지 작성", changes: "친선 대회 공지 작성", timestamp: "2일 전", type: "create" as const }
    ],
    managementHistory: [
      { id: "MH-017", action: "공지 등록", description: "친선 대회 공지가 등록되었습니다", timestamp: "2일 전", admin: "관리자 김민수", adminId: "ADMIN-001", type: "approve" as const }
    ],
    comments: []
  },
  {
    id: "POST-397",
    type: "팀 모집",
    title: "평일 저녁 정기 경기 상대팀 모집",
    content: "매주 화요일, 목요일 저녁 8시 정기 경기 상대팀을 찾습니다.",
    author: "성북FC",
    authorId: "T-005",
    status: "게시됨",
    createdAt: "2일 전",
    updatedAt: "2일 전",
    views: 167,
    likes: 12,
    shares: 5,
    tags: ["팀모집", "정기경기"],
    editHistory: [
      { id: "EH-012", editor: "성북FC", editorId: "T-005", action: "게시물 작성", changes: "상대팀 모집 게시물 작성", timestamp: "2일 전", type: "create" as const }
    ],
    managementHistory: [
      { id: "MH-018", action: "승인", description: "팀 모집 게시물 승인", timestamp: "2일 전", admin: "관리자 이영희", adminId: "ADMIN-002", type: "approve" as const }
    ],
    comments: []
  },
  {
    id: "POST-396",
    type: "팀 게시물",
    title: "강동 FC 신입 멤버 환영합니다",
    content: "새로 합류한 신입 멤버 여러분을 환영합니다! 앞으로 좋은 경기 함께 만들어가요!",
    author: "강동FC_관리자",
    authorId: "T-006",
    status: "게시됨",
    createdAt: "3일 전",
    updatedAt: "3일 전",
    views: 203,
    likes: 28,
    shares: 6,
    tags: ["환영", "신입"],
    editHistory: [
      { id: "EH-013", editor: "강동FC_관리자", editorId: "T-006", action: "게시물 작성", changes: "신입 환영 게시물 작성", timestamp: "3일 전", type: "create" as const }
    ],
    managementHistory: [
      { id: "MH-019", action: "승인", description: "팀 게시물 승인", timestamp: "3일 전", admin: "관리자 최수진", adminId: "ADMIN-004", type: "approve" as const }
    ],
    comments: []
  },
  {
    id: "CNT-317",
    type: "배너",
    title: "신규 스폰서 배너 - ABC 스포츠",
    content: "ABC 스포츠가 새로운 스폰서로 함께합니다!",
    author: "marketing",
    authorId: "ADMIN-005",
    status: "게시됨",
    createdAt: "3일 전",
    updatedAt: "3일 전",
    views: 1234,
    likes: 89,
    shares: 34,
    tags: ["배너", "스폰서"],
    editHistory: [
      { id: "EH-014", editor: "마케팅팀", editorId: "ADMIN-005", action: "배너 등록", changes: "신규 스폰서 배너 등록", timestamp: "3일 전", type: "create" as const }
    ],
    managementHistory: [
      { id: "MH-020", action: "승인", description: "스폰서 배너가 승인되었습니다", timestamp: "3일 전", admin: "관리자 김민수", adminId: "ADMIN-001", type: "approve" as const }
    ],
    comments: []
  },
  {
    id: "POST-395",
    type: "후기",
    title: "올해 첫 경기 승리 후기!",
    content: "올해 첫 경기에서 승리했습니다! 모두 수고하셨어요!",
    author: "축구왕김씨",
    authorId: "U-2001",
    status: "게시됨",
    createdAt: "4일 전",
    updatedAt: "4일 전",
    views: 312,
    likes: 45,
    shares: 12,
    tags: ["후기", "승리"],
    editHistory: [
      { id: "EH-015", editor: "축구왕김씨", editorId: "U-2001", action: "게시물 작성", changes: "승리 후기 작성", timestamp: "4일 전", type: "create" as const }
    ],
    managementHistory: [
      { id: "MH-021", action: "승인", description: "후기 게시물 승인", timestamp: "4일 전", admin: "관리자 박철수", adminId: "ADMIN-003", type: "approve" as const }
    ],
    comments: []
  },
];

const ContentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const filterState = location.state as { filter?: string; date?: string; description?: string } | null;

  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 메시지 관련 상태
  const [selectedMessage, setSelectedMessage] = useState<any>(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [messageFilter, setMessageFilter] = useState('all'); // all, 정상, 검토 필요, 의심, 차단됨

  // 필터 상태
  const [contentFilters, setContentFilters] = useState({
    type: 'all', // all, 공지, 게시물, 배너, 팀 게시물, 용병 모집, 팀 모집, 후기
    status: 'all', // all, 게시됨, 검수 중, 초안
    searchQuery: '',
    sortBy: 'newest' // newest, oldest, views
  });

  const clearFilter = () => {
    navigate('/admin/content', { replace: true, state: {} });
  };

  const isFilterActive = filterState?.filter === 'today-posts';

  const handleContentClick = (content: any) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };

  // 메시지 관련 핸들러
  const handleMessageClick = (message: any) => {
    setSelectedMessage(message);
    setIsMessageModalOpen(true);
  };

  const handleMessageModalClose = () => {
    setIsMessageModalOpen(false);
    setSelectedMessage(null);
  };

  const handleMessageAction = (action: string, messageId: string) => {
    console.log(`${action} action on message ${messageId}`);
    // TODO: 실제 API 호출
    alert(`${action} 처리되었습니다.`);
    handleMessageModalClose();
  };

  // 메시지 필터링
  const filteredMessages = userMessages.filter(msg => {
    if (messageFilter === 'all') return true;
    return msg.status === messageFilter;
  });

  // 필터링된 콘텐츠 목록
  const filteredContents = allContents.filter(content => {
    // 타입 필터
    if (contentFilters.type !== 'all' && content.type !== contentFilters.type) {
      return false;
    }

    // 상태 필터
    if (contentFilters.status !== 'all' && content.status !== contentFilters.status) {
      return false;
    }

    // 검색어 필터
    if (contentFilters.searchQuery) {
      const query = contentFilters.searchQuery.toLowerCase();
      const searchText = `${content.title} ${content.author} ${content.id}`.toLowerCase();
      if (!searchText.includes(query)) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (contentFilters.sortBy === 'views') {
      return (b.views || 0) - (a.views || 0);
    }
    // newest, oldest는 날짜 기반이지만 mock 데이터라 간단히 ID 기반으로
    return contentFilters.sortBy === 'newest'
      ? b.id.localeCompare(a.id)
      : a.id.localeCompare(b.id);
  });

  // 타입별 개수 계산
  const contentCounts = {
    all: allContents.length,
    공지: allContents.filter(c => c.type === '공지').length,
    게시물: allContents.filter(c => c.type.includes('게시물') || c.type.includes('모집') || c.type.includes('후기')).length,
    배너: allContents.filter(c => c.type === '배너').length,
  };

  return (
    <AdminLayout activePage="content">
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

      {/* Show only today's posts when filter is active */}
      {isFilterActive ? (
        <section className="admin-section">
          <div className="section-header">
            <h2 className="section-title">오늘 작성된 게시물</h2>
            <span className="section-meta">{todayPosts.length}건의 게시물</span>
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
                  <th>작성 시간</th>
                  <th>조회수</th>
                </tr>
              </thead>
              <tbody>
                {todayPosts.map((post) => (
                  <tr
                    key={post.id}
                    onClick={() => handleContentClick(post)}
                    style={{ cursor: 'pointer' }}
                    className="hover:bg-gray-50"
                  >
                    <td>{post.id}</td>
                    <td>{post.type}</td>
                    <td>{post.title}</td>
                    <td>{post.author}</td>
                    <td>
                      <span
                        className={`status-pill ${
                          post.status === "게시됨"
                            ? "positive"
                            : post.status === "검수 중"
                            ? "warning"
                            : "neutral"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td>{post.createdAt}</td>
                    <td>{post.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <>
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
                <tr
                  key={item.id}
                  onClick={() => handleContentClick(item)}
                  style={{ cursor: 'pointer' }}
                  className="hover:bg-gray-50"
                >
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

      {/* 전체 콘텐츠 관리 섹션 */}
      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">전체 콘텐츠 관리</h2>
          <span className="section-meta">총 {allContents.length}개 · 필터링 결과 {filteredContents.length}개</span>
        </div>

        {/* 필터 영역 */}
        <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
          {/* 타입 필터 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Filter className="w-4 h-4" style={{ color: 'var(--admin-text-secondary)' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--admin-text)' }}>콘텐츠 타입</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { value: 'all', label: '전체', count: contentCounts.all, icon: '📋' },
                { value: '공지', label: '공지', count: contentCounts.공지, icon: '📢' },
                { value: '게시물', label: '게시물', count: contentCounts.게시물, icon: '📝' },
                { value: '배너', label: '배너', count: contentCounts.배너, icon: '🎨' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setContentFilters({ ...contentFilters, type: option.value })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    contentFilters.type === option.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span style={{ marginRight: '4px' }}>{option.icon}</span>
                  {option.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    contentFilters.type === option.value
                      ? 'bg-white/20'
                      : 'bg-gray-200'
                  }`}>
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 상태 및 검색 필터 */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 200px 1fr', gap: '12px' }}>
            {/* 상태 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상태
              </label>
              <select
                value={contentFilters.status}
                onChange={(e) => setContentFilters({ ...contentFilters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체</option>
                <option value="게시됨">게시됨</option>
                <option value="검수 중">검수 중</option>
                <option value="초안">초안</option>
              </select>
            </div>

            {/* 정렬 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                정렬
              </label>
              <select
                value={contentFilters.sortBy}
                onChange={(e) => setContentFilters({ ...contentFilters, sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">최신순</option>
                <option value="oldest">오래된순</option>
                <option value="views">조회순</option>
              </select>
            </div>

            {/* 검색 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                검색
              </label>
              <div style={{ position: 'relative' }}>
                <Search className="w-4 h-4" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-secondary)' }} />
                <input
                  type="text"
                  placeholder="제목, 작성자, ID 검색..."
                  value={contentFilters.searchQuery}
                  onChange={(e) => setContentFilters({ ...contentFilters, searchQuery: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 40px',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'var(--admin-bg)',
                    color: 'var(--admin-text)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* 필터 초기화 버튼 */}
          {(contentFilters.type !== 'all' || contentFilters.status !== 'all' || contentFilters.searchQuery) && (
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setContentFilters({
                  type: 'all',
                  status: 'all',
                  searchQuery: '',
                  sortBy: 'newest'
                })}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <X className="w-4 h-4 inline mr-1" />
                필터 초기화
              </button>
            </div>
          )}
        </div>

        {/* 콘텐츠 목록 테이블 */}
        <div className="card table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>타입</th>
                <th>제목</th>
                <th>작성자</th>
                <th>상태</th>
                <th>작성일</th>
                <th>조회수</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredContents.length > 0 ? (
                filteredContents.map((content) => (
                  <tr
                    key={content.id}
                    onClick={() => handleContentClick(content)}
                    className="hover:bg-gray-50 cursor-pointer"
                  >
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: '600', color: 'var(--admin-primary)' }}>
                        {content.id}
                      </span>
                    </td>
                    <td>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {content.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: '500' }}>{content.title}</td>
                    <td>{content.author}</td>
                    <td>
                      <span className={`status-pill ${
                        content.status === '게시됨' ? 'positive' :
                        content.status === '검수 중' ? 'warning' :
                        'neutral'
                      }`}>
                        {content.status}
                      </span>
                    </td>
                    <td>{content.createdAt}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span>{content.views || 0}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => handleContentClick(content)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                          title="상세보기"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-secondary)' }}>
                    필터 조건에 맞는 콘텐츠가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* 유저 간 메시지 관리 섹션 */}
      <section className="admin-section">
        <div className="section-header">
          <div>
            <h2 className="section-title flex items-center gap-2">
              <MessageSquare className="w-6 h-6" />
              유저 간 메시지 모니터링
            </h2>
            <p className="section-meta">
              총 {userMessages.length}개 메시지 ·
              <span className="text-yellow-600 font-semibold"> 검토 필요 {userMessages.filter(m => m.status === '검토 필요').length}건</span> ·
              <span className="text-red-600 font-semibold"> 의심 {userMessages.filter(m => m.status === '의심').length}건</span> ·
              <span className="text-gray-600"> 차단됨 {userMessages.filter(m => m.status === '차단됨').length}건</span>
            </p>
          </div>
        </div>

        {/* 필터 */}
        <div className="bg-white rounded-lg p-4 mb-4 border border-gray-200">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-sm font-semibold text-gray-700">필터:</span>
            {['all', '정상', '검토 필요', '의심', '차단됨'].map((filter) => (
              <button
                key={filter}
                onClick={() => setMessageFilter(filter)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  messageFilter === filter
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter === 'all' ? '전체' : filter}
                {filter !== 'all' && (
                  <span className="ml-2 px-2 py-0.5 bg-white/30 rounded-full text-xs">
                    {userMessages.filter(m => m.status === filter).length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* 메시지 목록 */}
        <div className="card table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>발신자</th>
                <th>수신자</th>
                <th>제목</th>
                <th>발신 시간</th>
                <th>상태</th>
                <th>신고 횟수</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.length > 0 ? (
                filteredMessages.map((message) => (
                  <tr
                    key={message.id}
                    className={`hover:bg-gray-50 ${
                      message.status === '차단됨' ? 'bg-red-50' :
                      message.status === '의심' ? 'bg-yellow-50' :
                      message.status === '검토 필요' ? 'bg-orange-50' :
                      ''
                    }`}
                  >
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: '600', color: 'var(--admin-primary)' }}>
                        {message.id}
                      </span>
                    </td>
                    <td>
                      <div>
                        <div className="font-medium">{message.from}</div>
                        <div className="text-xs text-gray-500">ID: {message.fromId}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-medium">{message.to}</div>
                        <div className="text-xs text-gray-500">ID: {message.toId}</div>
                      </div>
                    </td>
                    <td>
                      <div>
                        <div className="font-medium">{message.subject}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{message.preview}</div>
                      </div>
                    </td>
                    <td>{message.sentAt}</td>
                    <td>
                      <span className={`status-pill ${
                        message.status === '정상' ? 'positive' :
                        message.status === '검토 필요' ? 'warning' :
                        message.status === '의심' ? 'alert' :
                        'negative'
                      }`}>
                        {message.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        {message.reportCount > 0 ? (
                          <>
                            <AlertTriangle className={`w-4 h-4 ${
                              message.reportCount >= 3 ? 'text-red-600' : 'text-yellow-600'
                            }`} />
                            <span className={`font-semibold ${
                              message.reportCount >= 3 ? 'text-red-600' : 'text-yellow-600'
                            }`}>
                              {message.reportCount}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </div>
                    </td>
                    <td>
                      <button
                        onClick={() => handleMessageClick(message)}
                        className="p-1.5 bg-purple-50 text-purple-600 rounded hover:bg-purple-100 transition-colors"
                        title="상세보기"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-secondary)' }}>
                    필터 조건에 맞는 메시지가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
        </>
      )}

      {/* 콘텐츠 상세 모달 */}
      <ContentDetailModal
        content={selectedContent}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />

      {/* 메시지 상세 모달 */}
      {isMessageModalOpen && selectedMessage && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* 헤더 */}
            <div className={`sticky top-0 px-6 py-5 flex justify-between items-start rounded-t-xl ${
              selectedMessage.status === '차단됨' ? 'bg-gradient-to-r from-red-600 to-red-700' :
              selectedMessage.status === '의심' ? 'bg-gradient-to-r from-yellow-600 to-yellow-700' :
              selectedMessage.status === '검토 필요' ? 'bg-gradient-to-r from-orange-600 to-orange-700' :
              'bg-gradient-to-r from-purple-600 to-purple-700'
            } text-white`}>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <MessageSquare className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">메시지 상세</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedMessage.status === '정상' ? 'bg-green-100 text-green-700' :
                    selectedMessage.status === '검토 필요' ? 'bg-orange-100 text-orange-700' :
                    selectedMessage.status === '의심' ? 'bg-red-100 text-red-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedMessage.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-white/90">
                  <span>ID: {selectedMessage.id}</span>
                  <span>발신: {selectedMessage.sentAt}</span>
                  {selectedMessage.reportCount > 0 && (
                    <span className="flex items-center gap-1 bg-red-500/30 px-2 py-1 rounded">
                      <AlertTriangle className="w-4 h-4" />
                      신고 {selectedMessage.reportCount}건
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={handleMessageModalClose}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 본문 */}
            <div className="p-6 space-y-6">
              {/* 발신자/수신자 정보 */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    발신자
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">이름</span>
                      <span className="font-medium text-gray-900">{selectedMessage.from}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">사용자 ID</span>
                      <button
                        onClick={() => navigate(`/admin/users/${selectedMessage.fromId}`)}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {selectedMessage.fromId}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                    <Shield className="w-4 h-4" />
                    수신자
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">이름</span>
                      <span className="font-medium text-gray-900">{selectedMessage.to}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">사용자 ID</span>
                      <button
                        onClick={() => navigate(`/admin/users/${selectedMessage.toId}`)}
                        className="font-medium text-green-600 hover:underline"
                      >
                        {selectedMessage.toId}
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* 제목 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-2">제목</h4>
                <p className="text-gray-800 font-medium">{selectedMessage.subject}</p>
              </div>

              {/* 메시지 내용 */}
              <div className="bg-white rounded-lg p-4 border-2 border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">메시지 내용</h4>
                <div className="bg-gray-50 rounded p-4">
                  <p className="text-gray-800 whitespace-pre-wrap leading-relaxed">
                    {selectedMessage.content}
                  </p>
                </div>
              </div>

              {/* 관리 액션 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">관리 액션</h4>
                <div className="grid grid-cols-2 gap-3">
                  {selectedMessage.status !== '정상' && (
                    <button
                      onClick={() => handleMessageAction('정상으로 변경', selectedMessage.id)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                    >
                      <CheckCircle className="w-4 h-4" />
                      정상으로 변경
                    </button>
                  )}
                  {selectedMessage.status !== '검토 필요' && (
                    <button
                      onClick={() => handleMessageAction('검토 필요로 표시', selectedMessage.id)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium text-sm"
                    >
                      <Clock className="w-4 h-4" />
                      검토 필요로 표시
                    </button>
                  )}
                  {selectedMessage.status !== '의심' && (
                    <button
                      onClick={() => handleMessageAction('의심으로 표시', selectedMessage.id)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm"
                    >
                      <AlertTriangle className="w-4 h-4" />
                      의심으로 표시
                    </button>
                  )}
                  {selectedMessage.status !== '차단됨' && (
                    <button
                      onClick={() => handleMessageAction('메시지 차단', selectedMessage.id)}
                      className="flex items-center justify-center gap-2 px-4 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm"
                    >
                      <Ban className="w-4 h-4" />
                      메시지 차단
                    </button>
                  )}
                  <button
                    onClick={() => handleMessageAction('발신자에게 경고', selectedMessage.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium text-sm"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    발신자에게 경고
                  </button>
                  <button
                    onClick={() => handleMessageAction('발신자 정지', selectedMessage.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium text-sm"
                  >
                    <Ban className="w-4 h-4" />
                    발신자 정지
                  </button>
                  <button
                    onClick={() => handleMessageAction('메시지 삭제', selectedMessage.id)}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    메시지 삭제
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(`${selectedMessage.subject}\n\n${selectedMessage.content}`);
                      alert('메시지가 클립보드에 복사되었습니다.');
                    }}
                    className="flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  >
                    <FileText className="w-4 h-4" />
                    내용 복사
                  </button>
                </div>
              </div>

              {/* 경고 메시지 */}
              {selectedMessage.status === '차단됨' && (
                <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Ban className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h5 className="font-semibold text-red-900 mb-1">차단된 메시지</h5>
                      <p className="text-sm text-red-700">
                        이 메시지는 부적절한 내용으로 인해 차단되었습니다. 발신자와 수신자 모두 이 메시지를 볼 수 없습니다.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 푸터 */}
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={handleMessageModalClose}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ContentPage;

