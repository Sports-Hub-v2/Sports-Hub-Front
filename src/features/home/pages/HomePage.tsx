// src/features/home/pages/HomePage.tsx
import { useEffect, useState } from "react";
import HomeSectionFilterWrapper from "@/features/home/components/HomeSectionFilterWrapper";
import { fetchRecruitPosts } from "@/features/mercenary/api/recruitApi"; // API 함수 경로 확인
import { PostType, RecruitCategory } from "@/types/recruitPost";

export default function HomePage() {
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
        const mercenaryDataPromise = fetchRecruitPosts(RecruitCategory.MERCENARY, 0, 10);
        const teamDataPromise = fetchRecruitPosts(RecruitCategory.TEAM, 0, 10);
        const matchDataPromise = fetchRecruitPosts(RecruitCategory.MATCH, 0, 10);

        const [mercenaries, teams, matches] = await Promise.all([
          mercenaryDataPromise,
          teamDataPromise,
          matchDataPromise,
        ]);

        setMercenaryPosts(mercenaries);
        setTeamPosts(teams);
        setMatchPosts(matches);
      } catch (error) {
        console.error("Error loading homepage data:", error);
        setMercenaryPosts([]);
        setTeamPosts([]);
        setMatchPosts([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadHomepageData();
  }, []);

  if (isLoading) {
    return <div className="text-center py-20">데이터를 불러오는 중입니다...</div>;
  }

  return (
    <div className="flex flex-col gap-12 max-w-screen-xl mx-auto px-4 pt-4">
      <section className="bg-slate-100 py-10 text-center rounded-lg">
        <h1 className="text-3xl font-bold">
          ⚽ 조기축구 인원 모집 플랫폼
        </h1>
        <p className="mt-2 text-slate-600">
          용병, 팀, 경기를 한눈에!
        </p>
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