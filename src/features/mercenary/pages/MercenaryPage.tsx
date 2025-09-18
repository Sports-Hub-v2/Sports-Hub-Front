// src/features/mercenary/pages/MercenaryPage.tsx

import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRecruitStore } from "@/stores/useRecruitStore";
import type { PostType, RecruitPostCreationRequestDto } from "@/types/recruitPost";
import { RecruitCategory } from "@/types/recruitPost";
import { getProfileByAccountIdApi } from "@/features/auth/api/userApi";

import MercenaryCardModal from "@/features/mercenary/components/MercenaryCardModal";
import MercenaryDetailCard from "@/features/mercenary/components/MercenaryDetailCard";
import MercenaryMatchDayCard from "@/components/common/MercenaryMatchDayCard";
import MatchDayStyleFilter from "@/components/common/MatchDayStyleFilter";
import SkeletonCard from "@/components/common/SkeletonCard";
import UserProfileModal from "@/components/common/UserProfileModal";
import { applyToPostApi } from "@/features/mercenary/api/recruitApi";

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

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPost, setEditingPost] = useState<PostType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedUserIdForProfile, setSelectedUserIdForProfile] = useState<number | string | null>(null);

  const handleApply = async (postId: number) => {
    if (!user) {
      alert("로그인이 필요합니다.");
      navigate("/login");
      return;
    }
    // 프로필 ID 확보 (없으면 계정 ID로 조회)
    let profileId = user.profileId;
    if (!profileId) {
      try {
        const prof = await getProfileByAccountIdApi(user.id);
        profileId = (prof as any).id;
        (useAuthStore as any).setState({ user: { ...user, profileId } });
      } catch {
        alert("프로필 정보가 필요합니다. 마이페이지에서 프로필을 생성/연동해주세요.");
        return;
      }
    }

    const message = prompt(
      "신청 메시지를 입력해주세요",
      "안녕하세요. 용병으로 참여하고 싶습니다. 포지션은 미드필더, 5년 경력입니다."
    );
    if (message === null) return;

    try {
      await applyToPostApi(postId, { message });
      alert("신청이 완료되었습니다.");
    } catch (error) {
      console.error("신청 오류:", error);
      alert(error instanceof Error ? error.message : "신청 처리 중 오류가 발생했습니다.");
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
      setIsModalOpen(true);
      setEditingPost(null);
      searchParams.delete("action");
      setSearchParams(searchParams, { replace: true });
    }
  }, [searchParams, user, setSearchParams]);

  const filteredPosts = useMemo(() => {
    const onlyMercenary = (allPostsFromStore || []).filter(
      (p) => p.category === RecruitCategory.MERCENARY
    );
    if (!search) return onlyMercenary;
    const q = search.toLowerCase();
    return onlyMercenary.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        (p.region || "").toLowerCase().includes(q) ||
        (p.content || "").toLowerCase().includes(q)
    );
  }, [allPostsFromStore, search]);

  const sortedPosts = useMemo(() => {
    if (focusedId) {
      const focused = filteredPosts.find((p) => String(p.id) === focusedId);
      if (focused) {
        return [focused, ...filteredPosts.filter((p) => String(p.id) !== focusedId)];
      }
    }
    return filteredPosts;
  }, [filteredPosts, focusedId]);

  const handleOpenCreateModal = () => {
    setEditingPost(null);
    setIsModalOpen(true);
  };
  const handleCloseModal = () => setIsModalOpen(false);
  const handleOpenEditModal = (post: PostType) => {
    setEditingPost(post);
    setIsModalOpen(true);
  };
  const handleDelete = async (_id: number) => {
    /* 구현되지 않음: 서버 연동 삭제 */
  };

  const handleExpand = (postId: number | string) => navigate(`/mercenary?id=${postId}`);
  const handleCloseDetail = () => navigate("/mercenary", { replace: true });
  const openUserProfileModal = (id: number | string) => setSelectedUserIdForProfile(id);
  const closeUserProfileModal = () => setSelectedUserIdForProfile(null);

  if (isLoading && allPostsFromStore.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
        {/* 로딩 스켈레톤 UI */}
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
        {/* 페이지 헤더 */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">모집 중인 용병</h1>

          {/* 필터 */}
          <MatchDayStyleFilter onSearch={(q) => setSearch(q)} searchValue={search} />

          {/* 글쓰기 버튼 */}
          {user && (
            <div className="flex justify-end mt-4">
              <button
                onClick={handleOpenCreateModal}
                className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
              >
                ✍️ 용병 모집글 작성
              </button>
            </div>
          )}
        </div>

        {/* 모달 */}
        {isModalOpen && (
          <MercenaryCardModal
            category="mercenary"
            onClose={handleCloseModal}
            onSubmit={() => setIsModalOpen(false)}
            initialData={editingPost}
          />
        )}

        {/* 빈 상태 메시지 */}
        {!isLoading && sortedPosts.length === 0 && (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛈</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              {search ? "검색 결과가 없습니다" : "등록된 용병 모집글이 없습니다"}
            </h3>
            <p className="text-gray-600 mb-6">
              {search ? "다른 검색어나 필터로 시도해보세요" : "첫 번째 모집글을 작성해보세요!"}
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

        {/* 카드 그리드 */}
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

        {/* 상세 모달 */}
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
                    onDelete={user?.id === post.authorId ? () => handleDelete(post.id) : undefined}
                    onAuthorNameClick={() => {
                      if (post.authorId !== null) openUserProfileModal(post.authorId);
                    }}
                  />
                ))}
            </div>
          </div>
        )}
      </div>

      {selectedUserIdForProfile !== null && (
        <UserProfileModal userId={selectedUserIdForProfile} onClose={closeUserProfileModal} />
      )}
    </div>
  );
};

export default MercenaryPage;

