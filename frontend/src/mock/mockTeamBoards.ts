// ✅ mock/mockTeamBoards.ts
export type TeamPost = {
  id: number
  title: string
  authorId: string
  created_at: string
  content: string
  tag: "공지" | "자유" | "전술" | "질문"
  image?: string
  likes?: number
  comments?: CommentType[]
}

export type CommentType = {
  author: string
  content: string
  created_at: string
  replies?: CommentType[]
}

export const mockTeamBoards: Record<string, TeamPost[]> = {
  "1": [
    {
      id: 1,
      title: "이번 주말 경기 공지",
      authorId: "u1",
      created_at: "2025-05-01",
      content: "이번 주말 경기는 오후 3시에 시작합니다. 꼭 30분 전까지 도착해주세요.",
      tag: "공지",
      likes: 3,
      comments: [
        {
          author: "선수1",
          content: "넵 감독님, 확인했습니다!",
          created_at: "2025-05-01",
          replies: [
            {
              author: "감독님",
              content: "고마워요. 꼭 지켜주세요!",
              created_at: "2025-05-01"
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "새로운 포메이션 제안",
      authorId: "u2",
      created_at: "2025-04-28",
      content: "3-4-3 전술로 가보는 건 어떨까요?",
      tag: "전술",
      likes: 5,
      comments: [
        {
          author: "감독님",
          content: "좋은 전략입니다. 연습해보죠.",
          created_at: "2025-04-28"
        },
        {
          author: "선수1",
          content: "포메이션 바꾸는 건 찬성입니다!",
          created_at: "2025-04-29"
        }
      ]
    }
  ],
  "2": [
    {
      id: 1,
      title: "수비수 모집 관련",
      authorId: "u3",
      created_at: "2025-05-02",
      content: "현재 수비 포지션이 부족합니다. 주변에 관심있는 분 계시면 알려주세요.",
      tag: "공지",
      likes: 2,
      comments: []
    },
    {
      id: 2,
      title: "유니폼 추가 구매 문의",
      authorId: "u4",
      created_at: "2025-04-29",
      content: "혹시 유니폼 추가 구매 가능한가요?",
      tag: "질문",
      likes: 0,
      comments: [
        {
          author: "팀장",
          content: "조만간 단체로 주문할 예정이에요. 필요하신 분은 말씀해주세요.",
          created_at: "2025-04-30",
          replies: [
            {
              author: "마포선수",
              content: "저요! 추가해주세요~",
              created_at: "2025-04-30"
            }
          ]
        }
      ]
    }
  ]
}
