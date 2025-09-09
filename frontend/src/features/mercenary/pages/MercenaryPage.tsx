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
import RegionSelectTrigger from "@/components/common/RegionSelectTrigger";
import RegionSelectModal from "@/components/common/RegionSelectModal";
import UserProfileModal from "@/components/common/UserProfileModal";

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
  const [selectedRegion, setSelectedRegion] = useState("전체 지역");
  const [isRegionModalOpen, setIsRegionModalOpen] = useState(false);
  const [selectedUserIdForProfile, setSelectedUserIdForProfile] = useState<
    number | string | null
  >(null);

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
      postsToFilter = postsToFilter.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (selectedRegion !== "전체 지역") {
      postsToFilter = postsToFilter.filter((p) => p.region === selectedRegion);
    }
    return postsToFilter;
  }, [allPostsFromStore, search, selectedRegion]);

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
        await updateRecruitPostApi(editingPost.id, formData);
        alert("게시글이 성공적으로 수정되었습니다.");
      } else {
        // 생성 모드
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
      <div className="text-center py-20 pt-24">
        용병 목록을 불러오는 중입니다...
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pt-24">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-center sm:text-left">
          🔥 용병 목록
        </h1>
        {user && (
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors w-full sm:w-auto"
          >
            ✏️ 용병 모집 글쓰기
          </button>
        )}
      </div>

      {/* ▼▼▼ 모달 호출부를 수정된 상태와 핸들러에 맞게 정리합니다. ▼▼▼ */}
      {isModalOpen && (
        <MercenaryCardModal
          category="mercenary"
          onClose={handleCloseModal}
          onSubmit={handleSavePost}
          initialData={editingPost}
        />
      )}

      <div className="mb-6 p-4 bg-gray-50 rounded-lg shadow">
        <div className="flex flex-wrap items-center gap-2 sm:gap-4">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="제목 또는 지역으로 검색"
            className="border rounded px-3 py-2 w-full sm:w-auto sm:flex-grow text-sm"
          />
          <RegionSelectTrigger
            selected={selectedRegion}
            onClick={() => setIsRegionModalOpen(true)}
          />
          <button
            onClick={() => {
              setSearch("");
              setSelectedRegion("전체 지역");
            }}
            className="text-red-500 text-sm underline px-3 py-2 hover:bg-red-50 rounded"
          >
            초기화
          </button>
        </div>
      </div>
      {isRegionModalOpen && (
        <RegionSelectModal
          onSelect={(region) => {
            setSelectedRegion(region);
            setIsRegionModalOpen(false);
          }}
          onClose={() => setIsRegionModalOpen(false)}
        />
      )}

      {!isLoading && sortedPosts.length === 0 && (
        <p className="text-center text-gray-500 py-10">
          {search || selectedRegion !== "전체 지역"
            ? "검색 결과가 없습니다."
            : "등록된 용병 모집글이 없습니다."}
        </p>
      )}

      {sortedPosts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {sortedPosts.map((post) => (
            <MercenaryDetailCard
              key={post.id}
              post={post}
              isExpanded={String(post.id) === focusedId}
              onExpand={() => handleExpand(post.id)}
              onClose={handleCloseDetail}
              // ▼▼▼ 여기에 누락되었던 onEdit prop을 추가합니다. ▼▼▼
              onEdit={
                user // 임시로 로그인한 사용자는 모든 글 수정 가능
                  ? () => handleOpenEditModal(post)
                  : undefined
              }
              onDelete={
                user?.id === post.authorId
                  ? () => handleDelete(post.id)
                  : undefined
              }
              onAuthorNameClick={() => {
                // 함수가 실행되는 시점에 post.authorId가 null이 아닌지 확인합니다.
                if (post.authorId !== null) {
                  // 이 if 블록 안에서는 post.authorId가 number 타입임이 보장됩니다.
                  openUserProfileModal(post.authorId);
                }
              }}
            />
          ))}
        </div>
      )}

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
