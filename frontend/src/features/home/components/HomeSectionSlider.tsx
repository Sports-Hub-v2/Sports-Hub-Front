// src/features/home/components/HomeSectionSlider.tsx
import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { PostType, RecruitCategory } from "@/types/recruitPost"; // RecruitCategory Enum 임포트
import SummaryCard from "@/components/common/SummaryCard";
import { useAuthStore } from "@/stores/useAuthStore";

type Props = {
  title: string;
  category: RecruitCategory; // Enum 타입으로 받음
  posts: PostType[];
  basePath: string; // 예: "/mercenary", "/team", "/match" (소문자)
};

// Helper function to convert RecruitCategory Enum value to a lowercase string path
const categoryEnumToPathString = (categoryEnum: RecruitCategory): string => {
  return categoryEnum.toString().toLowerCase();
};

const HomeSectionSlider = ({ title, category, posts, basePath }: Props) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 5); // 약간의 여유를 둠
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 5); // 약간의 여유
    }
  };

  useEffect(() => {
    const currentRef = scrollRef.current;
    if (currentRef) {
      checkScrollButtons(); // 초기 상태 및 posts 변경 시 버튼 상태 업데이트
      currentRef.addEventListener('scroll', checkScrollButtons, { passive: true });
    }
    return () => {
      if (currentRef) {
        currentRef.removeEventListener('scroll', checkScrollButtons);
      }
    };
  }, [posts]); // posts 배열이 변경될 때 (내용이 로드되거나 필터링될 때) 버튼 상태 재확인

  const scroll = (offset: number) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: offset, behavior: "smooth" });
      setTimeout(checkScrollButtons, 300); // 'smooth' 스크롤 시간을 고려한 지연
    }
  };

  // 섹션 제목 클릭 시 이동할 경로 (소문자)
  const categoryPagePath = `/${categoryEnumToPathString(category)}`;

  return (
    <section className="space-y-4 px-4">
      <div className="flex justify-between items-center">
        <h2
          className="text-2xl font-bold cursor-pointer hover:underline"
          onClick={() => navigate(categoryPagePath)}
        >
          {title}
        </h2>
        {posts && posts.length > 0 && (
          // ▼▼▼ 3. '글쓰기'와 '더보기' 버튼을 함께 묶어줍니다. ▼▼▼
          <div className="flex items-center space-x-4">
            {/* 로그인한 사용자에게만 '글쓰기' 버튼이 보입니다. */}
            {user && (
              <Link 
                to={`${basePath}?action=create`} 
                className="text-sm bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition-colors"
              >
                + 글쓰기
              </Link>
            )}
            <Link to={categoryPagePath} className="text-sm text-blue-600 hover:underline">
              더보기
            </Link>
          </div>
        )}
      </div>

      {(!posts || posts.length === 0) ? (
        <p className="text-gray-500 py-8 text-center">해당 카테고리의 모집글이 없습니다.</p>
      ) : (
        <div className="relative">
          <button
            onClick={() => scroll(-350)}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border rounded-full shadow-md p-2 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="이전 슬라이드"
            disabled={!canScrollLeft}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
            </svg>
          </button>
          <div
            ref={scrollRef}
            className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory scrollbar-hide py-4 px-10" // 버튼 공간 확보를 위한 패딩
          >
            {posts.map((post) => (
              <div key={post.id} className="shrink-0 w-64 snap-start">
                {/* basePath는 HomePage에서 이미 소문자로 전달됨 (예: "/mercenary") */}
                <Link to={`${basePath}?id=${post.id}`} className="block hover:shadow-lg transition-shadow duration-200 rounded-md overflow-hidden">
                  <SummaryCard {...post} />
                </Link>
              </div>
            ))}
          </div>
          <button
            onClick={() => scroll(350)}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white border rounded-full shadow-md p-2 disabled:opacity-30 disabled:cursor-not-allowed"
            aria-label="다음 슬라이드"
            disabled={!canScrollRight}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default HomeSectionSlider;