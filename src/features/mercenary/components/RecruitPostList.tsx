// src/features/mercenary/components/RecruitPostList.tsx

import React from 'react';
import { PostType } from '@/types/recruitPost';
import SummaryCard from '@/components/common/SummaryCard'; // SummaryCard의 실제 경로 확인

interface RecruitPostListProps {
  posts: PostType[];
  onDelete: (postId: number) => void; // 삭제 기능이 필요할 경우를 대비해 여전히 받음
}

const RecruitPostList: React.FC<RecruitPostListProps> = ({ posts, }) => {
  if (!posts || posts.length === 0) {
    return <p className="text-gray-600">등록된 게시물이 없습니다.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {posts.map((post) => (
        // SummaryCard는 라우팅 기능만 담당하므로 onDelete를 직접 넘기지 않습니다.
        // 만약 SummaryCard 내부에 삭제 버튼이 필요하다면 SummaryCard의 Props를 수정해야 합니다.
        <SummaryCard key={post.id} {...post} />
      ))}
    </div>
  );
};

export default RecruitPostList;