// src/stores/useRecruitStore.ts

import { create } from "zustand"
import { PostType } from "@/types/recruitPost"
import { fetchRecruitPosts } from "@/features/mercenary/api/recruitApi" // 수정된 fetchRecruitPosts 임포트

interface RecruitState {
  posts: PostType[]
  // loadPosts 함수에 category와 pageable 정보를 추가
  loadPosts: (category: string, page?: number, size?: number) => Promise<void>
  createPost: (post: PostType) => void
  removePost: (id: number) => void
}

export const useRecruitStore = create<RecruitState>((set, get) => ({
  posts: [],

  // 게시글 리스트 로딩 함수 변경
  loadPosts: async (category: string, page: number = 0, size: number = 10) => {
    try {
      // fetchRecruitPosts에 카테고리 파라미터 전달
      // 백엔드가 Page 객체를 반환하므로, 데이터 구조에 맞게 처리
      const data = await fetchRecruitPosts(category, page, size)
      set({ posts: data })
    } catch (err) {
      console.error("용병 모집글 로드 실패:", err) //
      // 에러 처리: 사용자에게 메시지를 보여주거나, 빈 배열로 상태 업데이트 등
      set({ posts: [] });
    }
  },

  // 새 게시글 추가
  createPost: (post) => {
    set({ posts: [post, ...get().posts] })
  },

  // 게시글 삭제
  removePost: (id) => {
    set({ posts: get().posts.filter((p) => p.id !== id) })
  },
}))