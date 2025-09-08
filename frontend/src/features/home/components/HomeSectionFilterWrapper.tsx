// src/features/home/components/HomeSectionFilterWrapper.tsx
import { useState } from "react";
import HomeSectionSlider from "./HomeSectionSlider";
import RegionSelectTrigger from "./RegionSelectTrigger";
import RegionSelectModal from "./RegionSelectModal";
import { PostType, RecruitCategory } from "@/types/recruitPost";

type Props = {
  title: string;
  category: RecruitCategory;
  allPosts: PostType[];
  basePath: string;
};

const HomeSectionFilterWrapper = ({ title, category, allPosts, basePath }: Props) => {
  const [search, setSearch] = useState("");
  const [region, setRegion] = useState("전체 지역");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // HomePage에서 이미 해당 카테고리 데이터만 allPosts로 전달하므로,
  // category 필터는 사실상 필요 없지만, 만약 allPosts에 모든 카테고리 데이터가 섞여 있다면 이 필터는 유효합니다.
  // 현재 HomePage.tsx는 각 카테고리별 데이터를 별도로 allPosts에 전달하고 있으므로,
  // const postsForThisCategory = allPosts; 로 바로 사용해도 무방합니다.
  const postsForThisCategory = allPosts.filter(p => p.category === category);


  const filtered = postsForThisCategory
    .filter((p) => {
      const titleMatch = p.title.toLowerCase().includes(search.toLowerCase());
      const regionMatch = p.region.toLowerCase().includes(search.toLowerCase());
      // PostType에 subRegion이 optional string이므로, subRegion이 있을 때만 검색에 포함
      const subRegionMatch = p.subRegion ? p.subRegion.toLowerCase().includes(search.toLowerCase()) : false;
      return search === "" || titleMatch || regionMatch || subRegionMatch;
    })
    .filter((p) => region === "전체 지역" || p.region === region || (p.subRegion && p.subRegion.includes(region)));


  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 px-4">
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