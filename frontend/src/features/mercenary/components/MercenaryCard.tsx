// src/components/mercenary/MercenaryCard.tsx

import type { PostType } from "@/types/recruitPost";

type Props = {
  post: PostType;
  onClick: () => void;
};

const MercenaryCard = ({ post, onClick }: Props) => {
  // ▼▼▼ 'fromParticipant'를 사용해 모집 유형을 더 명확하게 표시합니다. ▼▼▼
  const flowLabel = post.fromParticipant === 'TEAM' ? "팀 → 개인" : "개인 → 팀";

  return (
    <div
      onClick={onClick}
      className="cursor-pointer border rounded-lg shadow hover:shadow-md transition bg-white overflow-hidden"
    >
      <img src={post.thumbnailUrl || '/path/to/default/image.jpg'} alt={post.title} className="h-40 w-full object-cover bg-gray-200" />
      <div className="p-4 space-y-1">
        <div className="text-sm text-gray-500">[{flowLabel}]</div>
        <h3 className="text-lg font-semibold truncate">{post.title}</h3>
        {/* ▼▼▼ 요약 카드에서는 날짜만 간결하게 표시합니다. ▼▼▼ */}
        <p className="text-sm text-gray-600">{post.region} ・ {post.gameDate}</p>
        <p className="text-sm text-gray-500">작성자: {post.authorName}</p>
      </div>
    </div>
  );
};

export default MercenaryCard;