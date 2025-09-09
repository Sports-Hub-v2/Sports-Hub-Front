// src/features/mercenary/pages/MercenaryPage.tsx

import { useEffect, useState, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRecruitStore } from "@/stores/useRecruitStore";
import {
  RecruitPostCreationRequestDto,
  RecruitCategory,
  PostType,
} from "@/types/recruitPost";
import {
  createRecruitPostApi,
  updateRecruitPostApi,
  deleteRecruitPostApi,
} from "../api/recruitApi";

import MercenaryCardModal from "../components/MercenaryCardModal";
import MercenaryDetailCard from "../components/MercenaryDetailCard";
import ImprovedMercenaryCard from "../components/ImprovedMercenaryCard";
import SkeletonCard from "@/components/common/SkeletonCard";
import UserProfileModal from "@/components/common/UserProfileModal";
import { applyToPostApi } from "../api/recruitApi";

const MercenaryPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const user = useAuthStore((s) => s.user);
  const allPostsFromStore = useRecruitStore((s) => s.posts);
  const loadPosts = useRecruitStore((s) => s.loadPosts);

  const focusedId = useMemo(
    () => new URLSearchParams(location.search).get("id"),
    [location.search]
  );

  // 모달 관련 상태를 하나로 통합하고 명확하게 관리.
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostType | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUserIdForProfile, setSelectedUserIdForProfile] = useState<
    number | string | null
  >(null);

  // 핸들러 추가
  const handleNotificationToggle = (postId: number, enabled: boolean) => {
    console.log(`알림 ${enabled ? "활성화" : "비활성화"}:`, postId);
  };

  const handleFavoriteToggle = (postId: number, favorited: boolean) => {
    console.log(`즐겨찾기 ${favorited ? "추가" : "제거"}:`, postId);
  };

  const handleApply = async (postId: number) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    const message = prompt(
      "신청 메시지를 입력하세요:",
      "안녕하세요! 용병으로 참여하고 싶습니다. 포지션은 미드필더이고, 5년 경력입니다."
    );
    if (message === null) return; // 취소한 경우

    try {
      await applyToPostApi(postId, { message });
      alert("신청이 완료되었습니다!");
    } catch (error) {
      console.error("신청 중 오류:", error);
      alert(
        error instanceof Error ? error.message : "신청 중 오류가 발생했습니다."
      );
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        await loadPosts(RecruitCategory.MERCENARY);
      } catch (error) {
        console.error("Error loading mercenary posts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPosts();
  }, [loadPosts]);

  useEffect(() => {
    if (searchParams.get("action") === "create" && user) {
      handleOpenCreateModal();
      searchParams.delete("action");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, user]);

  const filteredPosts = useMemo(() => {
    if (!allPostsFromStore) return [];

    let postsToFilter = allPostsFromStore;

    if (search) {
      postsToFilter = postsToFilter.filter(
        (p) =>
          p.title.toLowerCase().includes(search.toLowerCase()) ||
          p.region.toLowerCase().includes(search.toLowerCase()) ||
          p.content.toLowerCase().includes(search.toLowerCase())
      );
    }
    return postsToFilter;
  }, [allPostsFromStore, search]);

  // '생성/수정/닫기' 관련 핸들러 함수들을 정리.

  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (post: PostType) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingPost(null);
  };

  // 생성과 수정을 모두 처리하는 통합 핸들러 'handleSavePost'
  const handleSavePost = async (formData: RecruitPostCreationRequestDto) => {
    try {
      if (editingPost) {
        // 수정 모드
        console.log(
          "수정 모드 - postId:",
          editingPost.id,
          "formData:",
          formData
        );
        await updateRecruitPostApi(editingPost.id, formData);
        alert("게시글이 성공적으로 수정되었습니다.");
      } else {
        // 생성 모드
        console.log("생성 모드 - formData:", formData);
        await createRecruitPostApi(formData);
        alert("게시글이 성공적으로 등록되었습니다.");
      }
      handleCloseModal();
      await loadPosts(RecruitCategory.MERCENARY);
    } catch (error) {
      alert("처리 중 오류가 발생했습니다.");
      console.error("Save post failed:", error);
    }
  };

  const handleDelete = async (postId: number) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await deleteRecruitPostApi(postId);
        alert("게시글이 삭제되었습니다.");
        if (String(postId) === focusedId) {
          navigate("/mercenary", { replace: true });
        }
        await loadPosts(RecruitCategory.MERCENARY);
      } catch (error) {
        console.error("Error deleting post:", error);
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  const sortedPosts = useMemo(() => {
    if (!filteredPosts) return [];
    if (focusedId) {
      const focusedItem = filteredPosts.find((p) => String(p.id) === focusedId);
      if (focusedItem) {
        return [
          focusedItem,
          ...filteredPosts.filter((p) => String(p.id) !== focusedId),
        ];
      }
    }
    return filteredPosts;
  }, [filteredPosts, focusedId]);

  const handleExpand = (postId: string | number) =>
    navigate(`/mercenary?id=${postId}`);
  const handleCloseDetail = () => navigate("/mercenary", { replace: true });
  const openUserProfileModal = (userId: number | string) =>
    setSelectedUserIdForProfile(userId);
  const closeUserProfileModal = () => setSelectedUserIdForProfile(null);

  if (isLoading && allPostsFromStore.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* 로딩 중 스켈레톤 UI */}
        <div className="mb-6">
          <div className="h-8 bg-gray-200 rounded w-48 mb-4 animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <SkeletonCard count={8} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* 헤더 섹션 - 2번째 이미지 스타일 */}
        <div className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <span className="text-white text-lg">🛡️</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">팀 모집 목록</h1>
          </div>

          {/* 검색창과 버튼들 */}
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* 검색창 */}
            <div className="flex-1 relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="팀 이름 또는 지역으로 검색"
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* 오른쪽 버튼들 */}
            <div className="flex items-center gap-3">
              <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
                전체 지역
              </button>
              <button className="px-4 py-2 text-red-500 hover:text-red-600">
                초기화
              </button>
              {user && (
                <button
                  onClick={handleOpenCreateModal}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  ✏️ 팀 모집 글쓰기
                </button>
              )}
            </div>
          </div>
        </div>

        {/* 필터 태그들 */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm">
              전체 <span className="ml-1">{sortedPosts.length}</span>
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
              모집중{" "}
              <span className="ml-1">
                {sortedPosts.filter((p) => p.status === "RECRUITING").length}
              </span>
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
              오늘 경기{" "}
              <span className="ml-1">
                {
                  sortedPosts.filter((p) => {
                    const today = new Date().toISOString().split("T")[0];
                    return p.gameDate === today;
                  }).length
                }
              </span>
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
              긴급 모집{" "}
              <span className="ml-1">
                {
                  sortedPosts.filter((p) => {
                    if (!p.gameDate) return false;
                    const gameDate = new Date(p.gameDate);
                    const today = new Date();
                    const diffDays = Math.ceil(
                      (gameDate.getTime() - today.getTime()) /
                        (1000 * 60 * 60 * 24)
                    );
                    return diffDays <= 2;
                  }).length
                }
              </span>
            </button>
            <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200">
              내 지역{" "}
              <span className="ml-1">
                {
                  sortedPosts.filter(
                    (p) => user && p.region && p.region.includes("서울") // 예시로 서울 지역
                  ).length
                }
              </span>
            </button>
            <button className="px-3 py-2 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200 flex items-center gap-1">
              🔽 필터
            </button>
          </div>
        </div>

        {/* 모달 렌더링 */}
        {isModalOpen && (
          <MercenaryCardModal
            category="mercenary"
            onClose={handleCloseModal}
            onSubmit={handleSavePost}
            initialData={editingPost}
          />
        )}
        {/* 빈 상태 메시지 */}
        {!isLoading && sortedPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">⚽</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {search
                ? "검색 결과가 없습니다"
                : "등록된 용병 모집글이 없습니다"}
            </h3>
            <p className="text-gray-600 mb-6">
              {search
                ? "다른 검색어나 필터를 시도해보세요"
                : "첫 번째 모집글을 작성해보세요!"}
            </p>
            {user && (
              <button
                onClick={handleOpenCreateModal}
                className="px-6 py-3 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:from-blue-600 hover:to-green-600 transition-all transform hover:scale-105"
              >
                모집글 작성하기
              </button>
            )}
          </div>
        )}

        {/* 카드 그리드 - 개선된 카드 사용 */}
        {sortedPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedPosts.map((post) => (
              <ImprovedMercenaryCard
                key={post.id}
                post={post}
                onClick={() => handleExpand(post.id)}
                onNotificationToggle={handleNotificationToggle}
                onFavoriteToggle={handleFavoriteToggle}
                onApply={handleApply}
              />
            ))}
          </div>
        )}

        {/* 확장된 카드 모달 */}
        {focusedId && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              {sortedPosts
                .filter((post) => String(post.id) === focusedId)
                .map((post) => (
                  <MercenaryDetailCard
                    key={post.id}
                    post={post}
                    isExpanded={true}
                    onExpand={() => {}}
                    onClose={handleCloseDetail}
                    onEdit={user ? () => handleOpenEditModal(post) : undefined}
                    onDelete={
                      user?.id === post.authorId
                        ? () => handleDelete(post.id)
                        : undefined
                    }
                    onAuthorNameClick={() => {
                      if (post.authorId !== null) {
                        openUserProfileModal(post.authorId);
                      }
                    }}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {selectedUserIdForProfile !== null && (
        <UserProfileModal
          userId={selectedUserIdForProfile}
          onClose={closeUserProfileModal}
        />
      )}
    </div>
  );
};

export default MercenaryPage;
