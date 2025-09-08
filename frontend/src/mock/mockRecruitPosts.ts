//import type { RecruitPost } from "@/features/mercenary/api/recruitApi"
// ← 이렇게 해보기  // ✅ 절대경로로 import

export type PostType = {
  id: number
  category: "mercenary" | "team" | "match"
  target_type: "user" | "team"
  title: string
  region: string
  date: string
  time: string
  status: string
  thumbnail_url: string
  description: string
  created_at: string
  image: string
  from: string
  to: string
}

// ❗ 타입을 명시해줘야 타입 추론 오류가 안 납!
export const mockRecruitPosts: PostType[] = [
  {
    id: 1,
    category: "mercenary",
    target_type: "team",
    title: "주말에 함께할 팀 찾습니다!",
    region: "서울 강서구",
    date: "2025-04-20",
    time: "07:00",
    status: "open",
    thumbnail_url: "/images/user1.jpg",
    image: "/images/user1.jpg",
    from: "개인",
    to: "팀",
    description: "경험 많은 FW입니다. 일요일 사망 경기 선호합니다.",
    created_at: "2025-04-17T08:00:00Z"
  },
  {
    id: 2,
    category: "team",
    target_type: "user",
    title: "마포FC에서 팀원 목적합니다",
    region: "서울 마포구",
    date: "2025-04-21",
    time: "09:00",
    status: "open",
    thumbnail_url: "/images/team1.jpg",
    image: "/images/team1.jpg",
    from: "팀",
    to: "개인",
    description: "수비 가능한 분 환영합니다. 즐겁게 운동해요!",
    created_at: "2025-04-17T09:15:00Z"
  },
  {
    id: 3,
    category: "match",
    target_type: "team",
    title: "일요일 오후 팀 매칭 원합니다",
    region: "경기 고양시",
    date: "2025-04-27",
    time: "15:00",
    status: "open",
    thumbnail_url: "/images/match1.jpg",
    image: "/images/match1.jpg",
    from: "팀",
    to: "팀",
    description: "중급 팀과 친선 경기 원합니다. 푸사르 가능.",
    created_at: "2025-04-16T14:00:00Z"
  },
  {
    id: 4,
    category: "mercenary",
    target_type: "team",
    title: "공격수 포지션으로 경기 구해요!",
    region: "서울 강동구",
    date: "2025-04-23",
    time: "20:00",
    status: "open",
    thumbnail_url: "/images/user2.jpg",
    image: "/images/user2.jpg",
    from: "개인",
    to: "팀",
    description: "빠른고 위치 선정이 \뛰어난 공격수입니다. 강남 지역 선호.",
    created_at: "2025-04-17T14:00:00Z"
  },
  {
    id: 5,
    category: "mercenary",
    target_type: "team",
    title: "주중 야간 경기 참여 원합니다",
    region: "인천 남동구",
    date: "2025-04-24",
    time: "21:00",
    status: "open",
    thumbnail_url: "/images/user3.jpg",
    image: "/images/user3.jpg",
    from: "개인",
    to: "팀",
    description: "회사원이라 평일 밤 시간 가능합니다. 수비, 미드필더 포지션 가능.",
    created_at: "2025-04-17T15:30:00Z"
  },
  {
    id: 6,
    category: "mercenary",
    target_type: "user",
    title: "강서구 팀원 목적합니다",
    region: "서울 강서구",
    date: "2025-04-27",
    time: "18:00",
    status: "open",
    thumbnail_url: "/images/team2.jpg",
    image: "/images/team2.jpg",
    from: "팀",
    to: "개인",
    description: "주말 저녁 위주로 활동하는 팀입니다. 수비수 목지 중.",
    created_at: "2025-04-17T16:45:00Z"
  },
  {
    id: 7,
    category: "mercenary",
    target_type: "user",
    title: "강서구 팀원 목적합니다",
    region: "서울 강남구",
    date: "2025-04-27",
    time: "18:00",
    status: "open",
    thumbnail_url: "/images/team2.jpg",
    image: "/images/team2.jpg",
    from: "팀",
    to: "개인",
    description: "주말 저녁 위주로 활동하는 팀입니다. 공격수 목지 중.",
    created_at: "2025-04-17T16:45:00Z"
  }
]