// src/features/match/pages/MatchPage.tsx

import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRecruitStore } from "@/stores/useRecruitStore";
import {
  RecruitCategory,
  RecruitPostCreationRequestDto,
} from "@/types/recruitPost";
import MercenaryDetailCard from "@/features/mercenary/components/MercenaryDetailCard"; // 또는 MatchDetailCard
import MatchRecruitModal from "@/features/match/components/MatchRecruitModal";
import MatchDayStyleCard from "@/components/common/MatchDayStyleCard";
import MatchDayStyleFilter from "@/components/common/MatchDayStyleFilter";
// mock 데이터 제거
// 공용 컴포넌트 경로 사용
import RegionSelectTrigger from "@/components/common/RegionSelectTrigger";
import RegionSelectModal from "@/components/common/RegionSelectModal";

const MatchPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuthStore((s) => s.user);
  const allPostsFromStore = useRecruitStore((s) => s.posts);
  const loadPosts = useRecruitStore((s) => s.loadPosts);
  const removePost = useRecruitStore((s) => s.removePost);

  const focusedId = useMemo(
    () => new URLSearchParams(location.search).get("id"),
    [location.search]
  );

  const [isModalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("전체 지역");
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        await loadPosts(RecruitCategory.MATCH); // MATCH 카테고리 로드
      } catch (error) {
        console.error("Error loading match posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [loadPosts]);

  const filteredPosts = useMemo(() => {
    // 샘플 데이터와 실제 데이터 병합 (데모용)
    const allPosts = [...(allPostsFromStore || [])];

    return allPosts
      .filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(search.toLowerCase());
        const regionMatchInMain = p.region
          .toLowerCase()
          .includes(search.toLowerCase());
        const subRegionMatch = p.subRegion
          ? p.subRegion.toLowerCase().includes(search.toLowerCase())
          : false;
        return (
          search === "" || titleMatch || regionMatchInMain || subRegionMatch
        );
      })
      .filter(
        (p) =>
          selectedRegion === "전체" ||
          selectedRegion === "전체 지역" ||
          p.region === selectedRegion ||
          (p.subRegion && p.subRegion.includes(selectedRegion))
      );
  }, [allPostsFromStore, search, selectedRegion]);

  const handleCreate = (postData: RecruitPostCreationRequestDto) => {
    // TODO: 실제 API 호출로 게시글 생성 후 스토어 업데이트
    console.log("새 게시글 생성:", postData);
    loadPosts(RecruitCategory.MATCH);
    setModalOpen(false);
  };

  const handleMatchApply = (post: any) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const message = prompt("경기 참가 신청 메시지를 입력해주세요:");
    if (message) {
      // TODO: 실제 API 호출
      console.log(`경기 "${post.title}"에 참가 신청:`, message);
      alert("경기 참가 신청이 완료되었습니다!");
    }
  };

  const handleDelete = async (postId: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await removePost(postId);
        if (String(postId) === focusedId) {
          navigate("/match", { replace: true }); // 경기 페이지 경로로 수정
        }
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const sortedPosts = useMemo(() => {
    if (focusedId) {
      const focused = filteredPosts.find((p) => String(p.id) === focusedId);
      if (focused) {
        return [
          focused,
          ...filteredPosts.filter((p) => String(p.id) !== focusedId),
        ];
      }
    }
    return filteredPosts;
  }, [filteredPosts, focusedId]);

  const handleExpand = (postId: string | number) =>
    navigate(`/match?id=${postId}`); // 경기 페이지 경로로 수정
  const handleClose = () => navigate("/match", { replace: true }); // 경기 페이지 경로로 수정

  if (isLoading && allPostsFromStore.length === 0) {
    return (
      <div className="text-center py-20 pt-24">
        경기 목록을 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 매치데이 스타일 헤더 */}
      <div className="bg-white shadow-sm border-b border-gray-200 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                모집 중인 경기
              </h1>
              <p className="text-gray-500 mt-1">함께할 경기를 찾아보세요</p>
            </div>
            {user && (
              <button
                onClick={() => setModalOpen(true)}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
              >
                + 경기 만들기
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 매치데이 스타일 필터 */}
      <MatchDayStyleFilter
        searchValue={search}
        selectedRegion={selectedRegion}
        onSearch={(value) => setSearch(value)}
        onRegionChange={(region) => setSelectedRegion(region)}
      />

      {isModalOpen && (
        <MatchRecruitModal
          isOpen={isModalOpen}
          onClose={() => setModalOpen(false)}
          onSubmit={handleCreate}
        />
      )}

      {isRegionModalOpen && (
        <RegionSelectModal
          onSelect={(region) => {
            setSelectedRegion(region);
            setIsRegionModalOpen(false);
          }}
          onClose={() => setIsRegionModalOpen(false)}
        />
      )}

      {/* 메인 콘텐츠 영역 */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* 확장된 카드 표시 */}
        {focusedId && sortedPosts.length > 0 && (
          <div className="mb-8">
            {sortedPosts
              .filter((post) => String(post.id) === focusedId)
              .map((post) => (
                <MercenaryDetailCard
                  key={post.id}
                  post={post}
                  isExpanded={true}
                  onExpand={() => handleExpand(post.id)}
                  onClose={handleClose}
                  onDelete={
                    user &&
                    user.id &&
                    post.authorId &&
                    user.id === post.authorId
                      ? () => handleDelete(post.id)
                      : undefined
                  }
                />
              ))}
          </div>
        )}

        {/* 빈 상태 */}
        {sortedPosts.length === 0 && !isLoading && (
          <div className="text-center py-20">
            <div className="text-gray-400 text-6xl mb-4">🏟️</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {search || selectedRegion !== "전체 지역"
                ? "검색 결과가 없습니다"
                : "등록된 경기가 없습니다"}
            </h3>
            <p className="text-gray-500">
              {search || selectedRegion !== "전체 지역"
                ? "다른 조건으로 검색해보세요."
                : "첫 번째 경기를 만들어보세요!"}
            </p>
          </div>
        )}

        {/* 경기 카드 그리드 - 매치데이 스타일 */}
        {sortedPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedPosts
              .filter((post) => String(post.id) !== focusedId)
              .map((post) => (
                <MatchDayStyleCard
                  key={post.id}
                  post={post}
                  cardType="match"
                  onApply={() => handleMatchApply(post)}
                  onClick={() => handleExpand(post.id)}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchPage;
