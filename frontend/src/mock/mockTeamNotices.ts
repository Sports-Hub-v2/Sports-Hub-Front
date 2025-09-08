// src/mock/mockTeamNotices.ts
export type TeamNotice = {
  id: number
  title: string
  content: string
  created_at: string
}

export const mockTeamNotices: Record<string, TeamNotice[]> = {
    "1": [ // FC 강서
      { id: 1, title: "⚠️ 4월 28일 훈련 시간 변경", content: "오후 5시 → 오후 6시", created_at: "2025-04-20" },
      { id: 2, title: "📅 다음 경기 일정 공지 예정", content: "5월 첫째 주로 예정", created_at: "2025-04-21" },
    ],
    "2": [ // 마포 유나이티드
      { id: 1, title: "⛔ 체육관 보수 공사 안내", content: "5월 3일은 사용 불가합니다.", created_at: "2025-04-22" },
      { id: 2, title: "⚽ 연습 경기 신청하세요", content: "금요일 밤 9시경 상대팀 찾는 중", created_at: "2025-04-23" },
    ]
  }
  