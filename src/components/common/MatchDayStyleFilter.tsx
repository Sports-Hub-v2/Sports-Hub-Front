// src/components/common/MatchDayStyleFilter.tsx
// 매치데이 완전 동일 스타일의 필터 컴포넌트

import React, { useState } from "react";
import { MapPin, Search } from "lucide-react";

interface MatchDayStyleFilterProps {
  onSearch?: (value: string) => void;
  onRegionChange?: (region: string) => void;
  onAgeChange?: (ageRange: string) => void;
  onSkillChange?: (skill: string) => void;
  searchValue?: string;
  selectedRegion?: string;
}

const MatchDayStyleFilter: React.FC<MatchDayStyleFilterProps> = ({
  onSearch,
  onRegionChange,
  onAgeChange,
  onSkillChange,
  searchValue = "",
  selectedRegion = "전체",
}) => {
  const [localSearch, setLocalSearch] = useState(searchValue);
  const [showAdvanced, setShowAdvanced] = useState(false);

  // 지역 옵션
  const regions = [
    "전체",
    "서울",
    "경기",
    "인천",
    "부산",
    "대구",
    "광주",
    "대전",
    "울산",
  ];

  // 실력 수준 옵션
  const skillLevels = ["모든 수준", "초급", "중급", "고급", "전문가"];

  // 연령대 옵션
  const ageGroups = ["모든 연령", "20대", "30대", "40대", "50대+"];

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch?.(localSearch);
  };

  return (
    <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
      {/* 메인 필터 바 */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* 검색 입력 */}
          <form onSubmit={handleSearchSubmit} className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={localSearch}
                onChange={(e) => {
                  setLocalSearch(e.target.value);
                  onSearch?.(e.target.value);
                }}
                placeholder="팀명이나 지역으로 검색해보세요"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </form>

          {/* 지역 선택 */}
          <div className="flex gap-3">
            <select
              value={selectedRegion}
              onChange={(e) => onRegionChange?.(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[120px]"
            >
              {regions.map((region) => (
                <option key={region} value={region}>
                  {region}
                </option>
              ))}
            </select>

            {/* 연령대 선택 */}
            <select
              onChange={(e) => onAgeChange?.(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[120px]"
            >
              {ageGroups.map((age) => (
                <option key={age} value={age}>
                  {age}
                </option>
              ))}
            </select>

            {/* 실력 수준 선택 */}
            <select
              onChange={(e) => onSkillChange?.(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[120px]"
            >
              {skillLevels.map((skill) => (
                <option key={skill} value={skill}>
                  {skill}
                </option>
              ))}
            </select>

            {/* 검색 버튼 */}
            <button
              type="submit"
              onClick={handleSearchSubmit}
              className="px-6 py-3 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
            >
              검색하기
            </button>
          </div>
        </div>

        {/* 고급 필터 토글 (숨겨진 기능) */}
        {showAdvanced && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  연령대
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="20"
                    max="60"
                    defaultValue="40"
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <span className="text-sm text-gray-500 min-w-[60px]">
                    20-40
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchDayStyleFilter;

