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
import MercenaryMatchDayCard from "@/components/common/MercenaryMatchDayCard";
import MatchDayStyleFilter from "@/components/common/MatchDayStyleFilter";
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

  // 매치데이 스타일에서는 알림/즐겨찾기 기능을 사용하지 않음

  const handleApply = async (postId: number) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }

    if (!user.profileId) {
      alert("프로필 정보가 없습니다. 마이페이지에서 프로필을 생성/연동해 주세요.");
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
        {/* 매치데이 스타일 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">
            모집 중인 용병
          </h1>

          {/* 매치데이 스타일 필터 */}
          <MatchDayStyleFilter
            onSearch={(query) => setSearch(query)}
            searchValue={search}
          />

          {/* 글쓰기 버튼 */}
          {user && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleOpenCreateModal}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                ✏️ 용병 모집글 작성
              </button>
            </div>
          )}
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

        {/* 매치데이 스타일 카드 그리드 */}
        {sortedPosts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedPosts.map((post) => (
              <MercenaryMatchDayCard
                key={post.id}
                post={post}
                onClick={() => handleExpand(post.id)}
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
