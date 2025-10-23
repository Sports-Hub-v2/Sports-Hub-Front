export type AdminLogActionType =
  | 'WARNING'    // 경고
  | 'BAN'        // 정지
  | 'UNBAN'      // 정지 해제
  | 'NOTE'       // 메모
  | 'APPROVE'    // 승인
  | 'REJECT'     // 거부
  | 'EDIT'       // 정보 수정
  | 'INFO'       // 정보성 기록
  | 'VERIFICATION' // 인증 처리
  | 'REWARD';    // 포상/혜택

export type AdminLogTargetType = 'USER' | 'TEAM';

export type AdminLogSeverity = 'LOW' | 'MEDIUM' | 'HIGH';

export interface AdminLogNote {
  id: number;
  adminId: number;
  adminName: string;
  content: string;
  createdAt: string;
}

export interface AdminLogMetadata {
  duration?: string;           // 제재 기간 (예: "7일", "30일")
  reason?: string;             // 상세 사유
  severity?: AdminLogSeverity; // 중요도
  relatedId?: number;          // 관련 ID (신고 ID, 게시글 ID 등)
  relatedType?: string;        // 관련 타입
  previousValue?: string;      // 수정 전 값
  newValue?: string;           // 수정 후 값
  expiresAt?: string;          // 만료일 (정지 해제일 등)
  tags?: string[];             // 태그
}

export interface AdminLog {
  id: number;
  targetType: AdminLogTargetType;
  targetId: number;
  targetName?: string;         // 대상 이름 (표시용)
  adminId: number;
  adminName: string;
  actionType: AdminLogActionType;
  title: string;
  content: string;
  createdAt: string;
  metadata?: AdminLogMetadata;
  notes?: AdminLogNote[];      // 관리자 메모/비고 (추가식)
}

// Mock 데이터 - 유저용
export const mockUserAdminLogs: AdminLog[] = [
  {
    id: 1,
    targetType: 'USER',
    targetId: 12345,
    targetName: '김철수',
    adminId: 1001,
    adminName: '관리자A',
    actionType: 'WARNING',
    title: '노쇼 경고 조치',
    content: '3회 연속 노쇼로 인한 경고 처리. 다음 노쇼 시 7일 정지 예정입니다. 조기축구 커뮤니티의 신뢰를 위해 약속 시간을 꼭 지켜주시기 바랍니다.',
    createdAt: '2025-10-20T14:30:00',
    metadata: {
      severity: 'MEDIUM',
      reason: '3회 연속 노쇼',
      relatedType: 'NO_SHOW',
      tags: ['노쇼', '경고']
    }
  },
  {
    id: 2,
    targetType: 'USER',
    targetId: 12345,
    targetName: '김철수',
    adminId: 1002,
    adminName: '관리자B',
    actionType: 'NOTE',
    title: '우수 회원 후보',
    content: '성실한 참여와 긍정적인 피드백을 많이 받고 있습니다. 다음 달 우수 회원 선정 시 고려 예정입니다.',
    createdAt: '2025-10-15T09:20:00',
    metadata: {
      severity: 'LOW',
      tags: ['우수회원', '긍정평가']
    }
  },
  {
    id: 3,
    targetType: 'USER',
    targetId: 12345,
    targetName: '김철수',
    adminId: 1001,
    adminName: '관리자A',
    actionType: 'BAN',
    title: '7일 활동 정지',
    content: '부적절한 언어 사용 및 욕설로 인한 7일 정지 처분입니다. 신고 접수 3건이 확인되었습니다.',
    createdAt: '2025-09-28T16:45:00',
    metadata: {
      duration: '7일',
      severity: 'HIGH',
      reason: '부적절한 언어 사용',
      expiresAt: '2025-10-05T16:45:00',
      relatedType: 'REPORT',
      tags: ['정지', '욕설']
    }
  },
  {
    id: 4,
    targetType: 'USER',
    targetId: 12345,
    targetName: '김철수',
    adminId: 1001,
    adminName: '관리자A',
    actionType: 'UNBAN',
    title: '정지 해제',
    content: '7일 정지 기간이 만료되어 정상적으로 활동이 재개됩니다.',
    createdAt: '2025-10-05T16:50:00',
    metadata: {
      severity: 'LOW',
      relatedId: 3,
      relatedType: 'BAN',
      tags: ['정지해제']
    }
  },
  {
    id: 5,
    targetType: 'USER',
    targetId: 12345,
    targetName: '김철수',
    adminId: 1002,
    adminName: '관리자B',
    actionType: 'EDIT',
    title: '프로필 정보 수정',
    content: '사용자 요청으로 전화번호 정보를 수정했습니다.',
    createdAt: '2025-09-15T11:20:00',
    metadata: {
      severity: 'LOW',
      previousValue: '010-1234-5678',
      newValue: '010-9876-5432',
      tags: ['정보수정']
    }
  },
  {
    id: 6,
    targetType: 'USER',
    targetId: 12345,
    targetName: '김철수',
    adminId: 1001,
    adminName: '관리자A',
    actionType: 'VERIFICATION',
    title: '본인 인증 완료',
    content: '신분증 확인을 통해 본인 인증이 완료되었습니다.',
    createdAt: '2025-09-01T10:00:00',
    metadata: {
      severity: 'LOW',
      tags: ['인증']
    }
  }
];

// Mock 데이터 - 팀용
export const mockTeamAdminLogs: AdminLog[] = [
  {
    id: 101,
    targetType: 'TEAM',
    targetId: 10001,
    targetName: '강남 유나이티드 FC',
    adminId: 1001,
    adminName: '관리자A',
    actionType: 'VERIFICATION',
    title: '팀 인증 승인',
    content: '홈구장 확인 및 팀 활동 실적 검토 후 공식 인증 팀으로 승인되었습니다.',
    createdAt: '2025-10-18T14:00:00',
    metadata: {
      severity: 'LOW',
      tags: ['인증', '승인']
    }
  },
  {
    id: 102,
    targetType: 'TEAM',
    targetId: 10001,
    targetName: '강남 유나이티드 FC',
    adminId: 1002,
    adminName: '관리자B',
    actionType: 'NOTE',
    title: '우수 팀 선정 예정',
    content: '성실한 활동과 높은 매너 점수로 다음 분기 우수 팀 선정 예정입니다. 홍보 배너 게재 계획 중입니다.',
    createdAt: '2025-10-10T11:30:00',
    metadata: {
      severity: 'LOW',
      tags: ['우수팀', '긍정평가']
    }
  },
  {
    id: 103,
    targetType: 'TEAM',
    targetId: 10001,
    targetName: '강남 유나이티드 FC',
    adminId: 1001,
    adminName: '관리자A',
    actionType: 'WARNING',
    title: '경기 노쇼 경고',
    content: '약속된 친선 경기에 불참한 사례가 확인되었습니다. 재발 시 팀 활동에 제재가 있을 수 있습니다.',
    createdAt: '2025-09-25T15:20:00',
    metadata: {
      severity: 'MEDIUM',
      reason: '경기 노쇼',
      relatedType: 'MATCH_NO_SHOW',
      tags: ['경고', '노쇼']
    }
  },
  {
    id: 104,
    targetType: 'TEAM',
    targetId: 10001,
    targetName: '강남 유나이티드 FC',
    adminId: 1002,
    adminName: '관리자B',
    actionType: 'EDIT',
    title: '팀 정보 수정',
    content: '팀장 요청으로 홈구장 정보를 수정했습니다.',
    createdAt: '2025-09-20T10:15:00',
    metadata: {
      severity: 'LOW',
      previousValue: '강남 구민운동장',
      newValue: '강남 스포츠파크',
      tags: ['정보수정']
    }
  },
  {
    id: 105,
    targetType: 'TEAM',
    targetId: 10001,
    targetName: '강남 유나이티드 FC',
    adminId: 1001,
    adminName: '관리자A',
    actionType: 'REWARD',
    title: '이벤트 당첨 - 경기 용품 지원',
    content: '조기축구 활성화 이벤트 당첨! 축구공 5개 및 훈련용 조끼 세트가 지급됩니다.',
    createdAt: '2025-08-30T14:00:00',
    metadata: {
      severity: 'LOW',
      tags: ['이벤트', '혜택']
    }
  }
];
