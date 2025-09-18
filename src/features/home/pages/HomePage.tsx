// src/features/home/pages/HomePage.tsx
import { useEffect, useState } from "react";
import HomeSectionFilterWrapper from "@/features/home/components/HomeSectionFilterWrapper";
import { fetchRecruitPosts } from "@/features/mercenary/api/recruitApi"; // API 함수 경로 확인
import { useRecruitStore } from "@/stores/useRecruitStore";
import { PostType, RecruitCategory } from "@/types/recruitPost";
 

export default function HomePage() {
  const loadPosts = useRecruitStore((s) => s.loadPosts);
  const allPostsFromStore = useRecruitStore((s) => s.posts);

  const [mercenaryPosts, setMercenaryPosts] = useState<PostType[]>([]);
  const [teamPosts, setTeamPosts] = useState<PostType[]>([]);
  const [matchPosts, setMatchPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Helper function to convert enum value to lowercase string for URL path
  const categoryEnumToPathString = (categoryEnum: RecruitCategory): string => {
    return categoryEnum.toString().toLowerCase();
  };

  useEffect(() => {
    const loadHomepageData = async () => {
      setIsLoading(true);
      try {
        // TeamPage와 같은 방식으로 데이터 로드
        await Promise.all([
          loadPosts(RecruitCategory.MERCENARY),
          loadPosts(RecruitCategory.TEAM),
          loadPosts(RecruitCategory.MATCH),
        ]);
      } catch (error) {
        console.error("Error loading homepage data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomepageData();
  }, [loadPosts]);

  // 스토어 데이터가 변경될 때만 상태 업데이트 (샘플 데이터 포함)
  useEffect(() => {
    // 스토어에서 카테고리별로 필터링
    const storeTeams = allPostsFromStore.filter(
      (p) => p.category === RecruitCategory.TEAM
    );
    const storeMatches = allPostsFromStore.filter(
      (p) => p.category === RecruitCategory.MATCH
    );
    const storeMercenaries = allPostsFromStore.filter(
      (p) => p.category === RecruitCategory.MERCENARY
    );

    // 팀은 이제 백엔드 데이터만 사용, 경기만 샘플 데이터와 병합
    const allTeams = [...storeTeams]; // 팀은 백엔드 데이터만 사용
    const allMatches = [...storeMatches];
    const allMercenaries = [...storeMercenaries]; // 샘플 데이터 제외

    setTeamPosts(allTeams.slice(0, 10));
    setMatchPosts(allMatches.slice(0, 10));
    setMercenaryPosts(allMercenaries.slice(0, 10));
  }, [allPostsFromStore]);

  if (isLoading) {
    return (
      <div className="text-center py-20">데이터를 불러오는 중입니다...</div>
    );
  }

  return (
    <div className="flex flex-col gap-12 max-w-screen-xl mx-auto px-4 pt-4">
      <section className="bg-slate-100 py-10 text-center rounded-lg">
        <h1 className="text-3xl font-bold">⚽ 조기축구 인원 모집 플랫폼</h1>
        <p className="mt-2 text-slate-600">용병, 팀, 경기를 한눈에!</p>
      </section>

      <HomeSectionFilterWrapper
        title="🔥 용병 모집"
        category={RecruitCategory.MERCENARY}
        allPosts={mercenaryPosts}
        basePath={`/${categoryEnumToPathString(RecruitCategory.MERCENARY)}`}
      />

      <div className="border-t border-gray-200" />

      <HomeSectionFilterWrapper
        title="🛡️ 팀 모집"
        category={RecruitCategory.TEAM}
        allPosts={teamPosts}
        basePath={`/${categoryEnumToPathString(RecruitCategory.TEAM)}`}
      />

      <div className="border-t border-gray-200" />

      <HomeSectionFilterWrapper
        title="🏟️ 경기 모집"
        category={RecruitCategory.MATCH}
        allPosts={matchPosts}
        basePath={`/${categoryEnumToPathString(RecruitCategory.MATCH)}`}
      />
    </div>
  );
}
