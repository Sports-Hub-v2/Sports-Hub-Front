// src/features/myPage/components/MyPost.tsx

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { getUserPostsApi } from '@/features/auth/api/userApi';
import type { PostType } from '@/types/recruitPost';

const MyPost: React.FC = () => {
  const { user } = useAuthStore();
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    const fetchPosts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getUserPostsApi(user.id);
        setPosts(data);
      } catch (err) {
        setError('작성한 글 목록을 불러오는 중 오류가 발생했습니다.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, [user]);

  if (isLoading) {
    return <div className="py-8 text-center text-gray-500">작성글 목록을 불러오는 중...</div>;
  }

  if (!user) {
    return <div className="py-8 text-center text-gray-500">로그인이 필요합니다</div>;
  }
  
  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }

  if (posts.length === 0) {
    return <div className="py-8 text-center text-gray-500">작성한 글이 없습니다.</div>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold border-b pb-2">작성글 목록</h3>
      <ul className="divide-y divide-gray-200">
        {posts.map((post) => (
          <li key={post.id} className="py-4">
            <Link to={`/${(post.category || '').toLowerCase()}?id=${post.id}`} className="block hover:bg-gray-50 p-2 rounded-md">
              <div className="flex justify-between items-center">
                <span className="font-semibold text-gray-800">{post.title}</span>
                <span className="text-xs text-gray-500">{new Date(post.createdAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-600 mt-1 truncate">{post.content}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyPost;


