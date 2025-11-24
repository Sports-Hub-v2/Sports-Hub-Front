// src/components/common/SummaryCard.tsx

import {
  PostType,
  RecruitCategory,
  RecruitTargetType,
  RecruitStatus
} from "@/types/recruitPost"; // 'import type'이 아닌 일반 import 사용

// 레이블 및 스타일 반환 헬퍼 함수
const getRecruitmentTypeInfo = (
  category: PostType["category"], // PostType의 category 타입을 직접 사용
  targetType: PostType["targetType"] // PostType의 targetType 타입을 직접 사용
): { label: string | null; bgColorClass: string; textColorClass: string } => {
  if (category === RecruitCategory.MATCH) { // Enum 값을 직접 비교
    return { label: null, bgColorClass: "", textColorClass: "" };
  }

  let label = "";
  let bgColorClass = "bg-gray-200";
  let textColorClass = "text-gray-700";

  if (category === RecruitCategory.MERCENARY || category === RecruitCategory.TEAM) {
    // targetType을 문자열로 비교
    const targetTypeStr = targetType as string;
    if (targetTypeStr === "TEAM_TO_MERCENARY") {
      label = category === RecruitCategory.MERCENARY ? "팀 → 용병" : "팀 → 팀원";
      bgColorClass = "bg-blue-100";
      textColorClass = "text-blue-700";
    } else if (targetTypeStr === "MERCENARY_TO_TEAM") {
      label = category === RecruitCategory.MERCENARY ? "용병 → 팀" : "개인 → 팀 합류";
      bgColorClass = "bg-green-100";
      textColorClass = "text-green-700";
    }
  }
  return { label, bgColorClass, textColorClass };
};

// 상태에 따른 텍스트 및 배경색/뱃지 스타일 반환 헬퍼 함수
const getStatusStyle = (status: PostType["status"]): { text: string; styleClass: string } => {
  // PostType의 status가 RecruitStatus Enum 타입이 아니라면, 문자열 값으로 비교
  // 만약 PostType.status가 RecruitStatus Enum 타입이라면 RecruitStatus.RECRUITING 등으로 직접 비교
  const statusString = status as string; // 필요시 타입 단언

  switch (statusString) {
    case RecruitStatus.RECRUITING: // Enum 값을 직접 비교
      return { text: "모집중", styleClass: "bg-green-500 text-white" };
    case RecruitStatus.COMPLETED:
      return { text: "모집완료", styleClass: "bg-blue-500 text-white" };
    case RecruitStatus.IN_PROGRESS:
      return { text: "진행/경기중", styleClass: "bg-yellow-500 text-white" };
    case RecruitStatus.CANCELLED:
      return { text: "모집취소", styleClass: "bg-red-500 text-white" };
    case RecruitStatus.FINISHED:
      return { text: "종료", styleClass: "bg-gray-500 text-white" };
    default:
      return { text: statusString, styleClass: "bg-gray-300 text-gray-700" };
  }
};

const SummaryCard = (props: PostType) => {
  const {
    title,
    category,
    targetType,
    region,
    subRegion,
    gameDate,
    gameTime,
    thumbnailUrl,
    authorName,
    status,
  } = props;

  const recruitmentTypeInfo = getRecruitmentTypeInfo(category, targetType);
  const statusInfo = getStatusStyle(status);

  const formattedDate = gameDate ? gameDate.toString().split("T")[0] : "날짜 미정";
  const formattedTime = gameTime || "시간 미정";

  return (
    <div className="bg-white shadow-lg rounded-lg overflow-hidden h-full flex flex-col group cursor-pointer transition-all duration-200 ease-in-out hover:shadow-xl">
      <div className="relative w-full h-40">
        {thumbnailUrl ? (
          <img src={thumbnailUrl} alt={title} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110" />
        ) : (
          <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.158 0a.075.075 0 0 1 .15 0A.075.075 0 0 1 12.908 8.25h.008a.075.075 0 0 1 0 .15A.075.075 0 0 1 12.908 8.4h-.008a.075.075 0 0 1-.15 0A.075.075 0 0 1 12.75 8.25h.008Z" /></svg>
            <span className="absolute text-xs">No Image</span>
          </div>
        )}
        {recruitmentTypeInfo.label && (
          <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold ${recruitmentTypeInfo.bgColorClass} ${recruitmentTypeInfo.textColorClass} shadow`}>
            {recruitmentTypeInfo.label}
          </div>
        )}
        <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-md text-xs font-semibold ${statusInfo.styleClass} shadow`}>
          {statusInfo.text}
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-base font-bold text-gray-800 mb-2 leading-snug group-hover:text-blue-700 transition-colors min-h-[2.5em] line-clamp-2">
          {title.length > 30 ? `${title.substring(0, 30)}...` : title}
        </h3>
        <div className="text-xs text-gray-500 mt-auto space-y-0.5">
          <p>지역: {region}{subRegion ? ` ${subRegion}` : ''}</p>
          <p>일시: {formattedDate} {formattedTime}</p>
          {authorName && <p>작성자: {authorName}</p>}
        </div>
      </div>
    </div>
  );
};

export default SummaryCard;