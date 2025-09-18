import React, { useState } from "react";
import { Filter, Search, MapPin, Calendar, Users, Plus } from "lucide-react";

interface FilterOption {
  id: string;
  label: string;
  count?: number;
  active?: boolean;
}

interface ImprovedFilterProps {
  onFilterChange?: (filters: any) => void;
  onSearch?: (query: string) => void;
  onNewPost?: () => void;
  showNewPostButton?: boolean;
}

const ImprovedFilter: React.FC<ImprovedFilterProps> = ({
  onFilterChange,
  onSearch,
  onNewPost,
  showNewPostButton = true,
}) => {
  const [activeFilters, setActiveFilters] = useState<string[]>(["all"]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false);

  const quickFilters: FilterOption[] = [
    { id: "all", label: "전체", count: 24, active: true },
    { id: "recruiting", label: "모집중", count: 18 },
    { id: "today", label: "오늘 경기", count: 3 },
    { id: "urgent", label: "긴급 모집", count: 5 },
    { id: "my_region", label: "내 지역", count: 12 },
    { id: "free", label: "무료", count: 7 },
  ];

  const handleQuickFilter = (filterId: string) => {
    let newFilters;
    if (filterId === "all") {
      newFilters = ["all"];
    } else {
      newFilters = activeFilters.includes("all")
        ? [filterId]
        : activeFilters.includes(filterId)
        ? activeFilters.filter((f) => f !== filterId)
        : [...activeFilters.filter((f) => f !== "all"), filterId];
    }

    setActiveFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    onSearch?.(query);
  };

  return (
    <>
      {/* 메인 필터 바 */}
      <div className="sticky top-0 z-20 bg-white shadow-sm border-b">
        {/* 검색 바 */}
        <div className="p-4">
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="지역, 팀명, 포지션으로 검색..."
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* 빠른 필터 */}
        <div className="px-4 pb-4">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {quickFilters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => handleQuickFilter(filter.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                  activeFilters.includes(filter.id)
                    ? "bg-blue-500 text-white shadow-md"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>{filter.label}</span>
                {filter.count && (
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      activeFilters.includes(filter.id)
                        ? "bg-white/20 text-white"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {filter.count}
                  </span>
                )}
              </button>
            ))}

            {/* 고급 필터 토글 */}
            <button
              onClick={() => setShowAdvancedFilter(!showAdvancedFilter)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap transition-all ${
                showAdvancedFilter
                  ? "bg-green-500 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              <Filter className="w-4 h-4" />
              <span>필터</span>
            </button>
          </div>
        </div>

        {/* 고급 필터 (접히는 섹션) */}
        {showAdvancedFilter && (
          <div className="px-4 pb-4 border-t bg-gray-50">
            <div className="pt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* 지역 필터 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline w-4 h-4 mr-1" />
                  지역
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">전체 지역</option>
                  <option value="seoul">서울특별시</option>
                  <option value="gyeonggi">경기도</option>
                  <option value="incheon">인천광역시</option>
                </select>
              </div>

              {/* 날짜 필터 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline w-4 h-4 mr-1" />
                  경기 날짜
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">전체 날짜</option>
                  <option value="today">오늘</option>
                  <option value="tomorrow">내일</option>
                  <option value="week">이번 주</option>
                  <option value="month">이번 달</option>
                </select>
              </div>

              {/* 인원 필터 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Users className="inline w-4 h-4 mr-1" />
                  모집 인원
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">전체</option>
                  <option value="1-5">1-5명</option>
                  <option value="6-10">6-10명</option>
                  <option value="11+">11명 이상</option>
                </select>
              </div>
            </div>

            {/* 필터 적용/초기화 버튼 */}
            <div className="flex gap-2 mt-4">
              <button className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-colors">
                필터 적용
              </button>
              <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                초기화
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 모바일 FAB 버튼 */}
      {showNewPostButton && (
        <div className="lg:hidden fixed bottom-6 right-6 z-30">
          <button
            onClick={onNewPost}
            className="w-14 h-14 bg-gradient-to-r from-blue-500 to-green-500 rounded-full shadow-lg flex items-center justify-center text-white hover:shadow-xl transition-all transform hover:scale-110 active:scale-95"
          >
            <Plus className="w-6 h-6" />
          </button>
        </div>
      )}
    </>
  );
};

export default ImprovedFilter;


