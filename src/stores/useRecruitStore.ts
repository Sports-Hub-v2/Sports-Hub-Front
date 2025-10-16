// src/stores/useRecruitStore.ts

import { create } from "zustand"
import { PostType } from "@/types/recruitPost"
import { fetchRecruitPosts } from "@/features/mercenary/api/recruitApi"

interface RecruitState {
  posts: PostType[] // 모든 카테고리의 데이터를 저장
  postsByCategory: Record<string, PostType[]> // 카테고리별로 데이터 저장
  loadPosts: (category: string, page?: number, size?: number) => Promise<void>
  createPost: (post: PostType) => void
  removePost: (id: number) => void
}

export const useRecruitStore = create<RecruitState>((set, get) => ({
  posts: [],
  postsByCategory: {},

  // 게시글 리스트 로딩 함수 변경
  loadPosts: async (category: string, page: number = 0, size: number = 10) => {
    try {
      const data = await fetchRecruitPosts(category, page, size)
      
      // 카테고리별로 데이터 저장
      const currentPostsByCategory = get().postsByCategory
      const updatedPostsByCategory = {
        ...currentPostsByCategory,
        [category]: data
      }
      
      // 전체 posts 배열 업데이트 (모든 카테고리 합쳐서)
      const allPosts = Object.values(updatedPostsByCategory).flat()
      
      set({ 
        postsByCategory: updatedPostsByCategory,
        posts: allPosts 
      })
    } catch (err) {
      console.error(`${category} 모집글 로드 실패:`, err)
      // 에러 발생시 해당 카테고리만 빈 배열로 설정
      const currentPostsByCategory = get().postsByCategory
      const updatedPostsByCategory = {
        ...currentPostsByCategory,
        [category]: []
      }
      const allPosts = Object.values(updatedPostsByCategory).flat()
      
      set({ 
        postsByCategory: updatedPostsByCategory,
        posts: allPosts 
      })
    }
  },

  // 새 게시글 추가
  createPost: (post) => {
    const currentPosts = get().posts
    const currentPostsByCategory = get().postsByCategory
    const category = post.category
    
    // 해당 카테고리와 전체 배열에 추가
    const updatedCategoryPosts = [post, ...(currentPostsByCategory[category] || [])]
    const updatedPostsByCategory = {
      ...currentPostsByCategory,
      [category]: updatedCategoryPosts
    }
    
    set({ 
      posts: [post, ...currentPosts],
      postsByCategory: updatedPostsByCategory
    })
  },

  // 게시글 삭제
  removePost: (id) => {
    const currentPosts = get().posts
    const currentPostsByCategory = get().postsByCategory
    
    // 전체 배열에서 삭제
    const updatedPosts = currentPosts.filter((p) => p.id !== id)
    
    // 카테고리별 배열에서도 삭제
    const updatedPostsByCategory = Object.entries(currentPostsByCategory).reduce(
      (acc, [category, posts]) => ({
        ...acc,
        [category]: posts.filter((p) => p.id !== id)
      }), 
      {}
    )
    
    set({ 
      posts: updatedPosts,
      postsByCategory: updatedPostsByCategory
    })
  },
}))