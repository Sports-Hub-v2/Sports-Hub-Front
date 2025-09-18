// src/features/home/components/HomeSectionFilterWrapper.tsx
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import HomeSectionSlider from "./HomeSectionSlider";
import RegionSelectTrigger from "@/components/common/RegionSelectTrigger";
import RegionSelectModal from "@/components/common/RegionSelectModal";
import { PostType, RecruitCategory } from "@/types/recruitPost";
import { useAuthStore } from "@/stores/useAuthStore";

type Props = {
  title: string;
  category: RecruitCategory;
  allPosts: PostType[];
  basePath: string;
};

const HomeSectionFilterWrapper = ({
  title,
  category,
  allPosts,
  basePath,
}: Props) => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("전체 지역");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Helper function to convert enum value to lowercase string for URL path
  const categoryEnumToPathString = (categoryEnum: RecruitCategory): string => {
    return categoryEnum.toString().toLowerCase();
  };

  // 섹션 제목 클릭 시 이동할 경로 (소문자)
  const categoryPagePath = `/${categoryEnumToPathString(category)}`;

  // HomePage에서 이미 카테고리별로 분리된 데이터를 전달받으므로 추가 필터링 불필요
  const postsForThisCategory = allPosts;

  const filtered = postsForThisCategory
    .filter((p) => {
      if (search === "") return true;

      const titleMatch = p.title.toLowerCase().includes(search.toLowerCase());
      const contentMatch = p.content
        ? p.content.toLowerCase().includes(search.toLowerCase())
        : false;
      // location 필드를 사용 (백엔드에서 location으로 전달됨)
      const locationMatch = (p as any).location
        ? (p as any).location.toLowerCase().includes(search.toLowerCase())
        : false;
      const regionMatch = p.region
        ? p.region.toLowerCase().includes(search.toLowerCase())
        : false;
      const subRegionMatch = p.subRegion
        ? p.subRegion.toLowerCase().includes(search.toLowerCase())
        : false;

      return (
        titleMatch ||
        contentMatch ||
        locationMatch ||
        regionMatch ||
        subRegionMatch
      );
    })
    .filter((p) => {
      if (region === "전체 지역") return true;

      // location 필드를 주로 사용
      const locationIncludes = (p as any).location
        ? (p as any).location.includes(region)
        : false;
      const regionIncludes = p.region ? p.region.includes(region) : false;
      const subRegionIncludes = p.subRegion
        ? p.subRegion.includes(region)
        : false;

      return locationIncludes || regionIncludes || subRegionIncludes;
    });

  return (
    <div className="space-y-4">
      {/* 제목을 맨 위로 이동 */}
      <div className="px-4">
        <h2 
          className="text-2xl font-bold cursor-pointer hover:underline"
          onClick={() => navigate(categoryPagePath)}
        >
          {title}
        </h2>
      </div>

      {/* 필터와 버튼을 같은 줄에 배치 */}
      <div className="flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="제목 또는 지역 검색"
            className="border rounded px-3 py-1 w-48 text-sm"
          />
          <RegionSelectTrigger
            selected={region}
            onClick={() => setIsModalOpen(true)}
          />
          <button
            onClick={() => {
              setSearch("");
              setRegion("전체 지역");
            }}
            className="text-red-500 text-sm underline"
          >
            초기화
          </button>
        </div>

        {/* 글쓰기/더보기 버튼을 오른쪽에 배치 */}
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
      </div>

      {isModalOpen && (
        <RegionSelectModal
          onSelect={(selectedRegion) => {
            setRegion(selectedRegion);
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}

      <HomeSectionSlider
        title={title}
        category={category}
        posts={filtered}
        basePath={basePath}
      />
    </div>
  );
};

export default HomeSectionFilterWrapper;
