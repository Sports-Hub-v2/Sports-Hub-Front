import React from "react";

interface SkeletonCardProps {
  count?: number;
}

const SkeletonCard: React.FC<SkeletonCardProps> = ({ count = 1 }) => {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-white rounded-xl shadow-md overflow-hidden"
        >
          {/* 이미지 스켈레톤 */}
          <div className="h-48 bg-gray-200" />

          {/* 컨텐츠 스켈레톤 */}
          <div className="p-4 space-y-3">
            {/* 상단 태그들 */}
            <div className="flex justify-between items-center">
              <div className="h-4 bg-gray-200 rounded w-24" />
              <div className="h-4 bg-gray-200 rounded w-16" />
            </div>

            {/* 제목 */}
            <div className="h-6 bg-gray-200 rounded w-3/4" />

            {/* 지역 정보 */}
            <div className="h-4 bg-gray-200 rounded w-1/2" />

            {/* 프로그레스 바 */}
            <div className="space-y-1">
              <div className="flex justify-between">
                <div className="h-3 bg-gray-200 rounded w-16" />
                <div className="h-3 bg-gray-200 rounded w-8" />
              </div>
              <div className="h-2 bg-gray-200 rounded-full" />
            </div>

            {/* 하단 정보 */}
            <div className="flex justify-between items-center pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gray-200 rounded-full" />
                <div className="h-4 bg-gray-200 rounded w-20" />
              </div>
              <div className="h-3 bg-gray-200 rounded w-12" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
};

export default SkeletonCard;
