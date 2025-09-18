// src/features/team/pages/TeamPage.tsx

import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRecruitStore } from "@/stores/useRecruitStore";
import {
  RecruitCategory,
  RecruitPostCreationRequestDto,
} from "@/types/recruitPost";
import MercenaryDetailCard from "@/features/mercenary/components/MercenaryDetailCard"; // 공용 상세 카드 사용
import TeamRecruitModal from "@/features/team/components/TeamRecruitModal";
import TeamRecruitCard from "@/components/common/TeamRecruitCard";
import MatchDayStyleFilter from "@/components/common/MatchDayStyleFilter";
import RegionSelectModal from "@/components/common/RegionSelectModal";

const TeamPage = () => {
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
        await loadPosts(RecruitCategory.TEAM); // TEAM 카테고리 로드
      } catch (error) {
        console.error("Error loading team posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [loadPosts]);

  const filteredPosts = useMemo(() => {
    // TEAM 카테고리만 선별
    const teamOnly = (allPostsFromStore || []).filter(
      (p) => p.category === RecruitCategory.TEAM
    );

    return teamOnly
      .filter((p) => {
        const titleMatch = p.title.toLowerCase().includes(search.toLowerCase());
        const regionMatchInMain = (p.region || "")
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
    // TODO: 실제 API 호출과 게시글 생성 후 스토어 업데이트
    console.log("팀 모집글 생성:", postData);
    loadPosts(RecruitCategory.TEAM);
    setModalOpen(false);
  };

  const handleTeamApply = (post: any) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      return;
    }

    const message = prompt("팀 가입 신청 메시지를 입력해주세요:");
    if (message) {
      // TODO: 실제 API 호출
      console.log(`팀 "${post.title}"에 가입 신청:`, message);
      alert("팀 가입 신청이 완료되었습니다.");
    }
  };

  const handleDelete = async (postId: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await removePost(postId);
        if (String(postId) === focusedId) {
          navigate("/team", { replace: true }); // 팀 페이지 경로로 지정
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
    navigate(`/team?id=${postId}`); // 팀 페이지 경로로 지정
  const handleClose = () => navigate("/team", { replace: true }); // 팀 페이지 경로로 지정

  if (isLoading && allPostsFromStore.length === 0) {
    return (
      <div className="text-center py-20 pt-24">
        팀 모집 목록을 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 페이지 헤더 */}
      <div className="bg-white shadow-sm border-b border-gray-200 pt-16">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">모집 중인 팀</h1>
              <p className="text-gray-500 mt-1">함께할 팀을 찾아보세요</p>
            </div>
            {user && (
              <button
                onClick={() => setModalOpen(true)}
                className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-colors"
              >
                + 팀 만들기
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 필터 */}
      <MatchDayStyleFilter
        searchValue={search}
        selectedRegion={selectedRegion}
        onSearch={(value) => setSearch(value)}
        onRegionChange={(region) => setSelectedRegion(region)}
      />

      {isModalOpen && (
        <TeamRecruitModal
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
        {/* 확장 카드 표시 */}
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
            <div className="text-gray-400 text-6xl mb-4">🛈</div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {search || selectedRegion !== "전체 지역"
                ? "검색 결과가 없습니다"
                : "등록된 팀이 없습니다"}
            </h3>
            <p className="text-gray-500">
              {search || selectedRegion !== "전체 지역"
                ? "다른 조건으로 검색해보세요"
                : "첫 번째 팀을 만들어보세요!"}
            </p>
          </div>
        )}

        {/* 팀 카드 그리드 */}
        {sortedPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedPosts
              .filter((post) => String(post.id) !== focusedId)
              .map((post) => (
                <TeamRecruitCard
                  key={post.id}
                  post={post}
                  onApply={() => handleTeamApply(post)}
                  onClick={() => handleExpand(post.id)}
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamPage;

