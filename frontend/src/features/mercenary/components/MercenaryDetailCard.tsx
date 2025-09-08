// src/features/mercenary/components/MercenaryDetailCard.tsx

import React from 'react';
import type { PostType } from "@/types/recruitPost";
import { RecruitStatus } from "@/types/recruitPost";
import { useAuthStore } from '@/stores/useAuthStore';
import { useNavigate } from 'react-router-dom';

interface MercenaryDetailCardProps {
  post: PostType;
  isExpanded: boolean;
  onClose?: () => void;
  onExpand?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onAuthorNameClick?: () => void;
}

const getStatusDisplayForDetail = (statusValue: PostType["status"]): React.ReactNode => {
  let styleClass = "font-semibold ";
  let statusText = statusValue as string;

  if (statusValue === RecruitStatus.RECRUITING) {
    styleClass += "text-green-600";
    statusText = "모집중";
  } else if (statusValue === RecruitStatus.COMPLETED) {
    styleClass += "text-blue-600";
    statusText = "모집완료";
  } else if (statusValue === RecruitStatus.IN_PROGRESS) {
    styleClass += "text-yellow-600";
    statusText = "진행/경기중";
  } else if (statusValue === RecruitStatus.CANCELLED) {
     styleClass += "text-red-600";
     statusText = "모집취소";
  } else if (statusValue === RecruitStatus.FINISHED) {
     styleClass += "text-gray-600";
     statusText = "종료";
  } else {
    styleClass += "text-gray-700";
  }
  return <span className={styleClass}>{statusText}</span>;
};

const MercenaryDetailCard: React.FC<MercenaryDetailCardProps> = ({ post, isExpanded, onClose, onExpand, onEdit, onDelete, onAuthorNameClick }) => {
  const { user } = useAuthStore();
  const navigate = useNavigate(); // 라우팅에 사용
  const isTeamToIndividual = post.fromParticipant === 'TEAM';
  const flowLabel = isTeamToIndividual ? "팀 → 개인" : "개인 → 팀";
  const dateLabel = isTeamToIndividual ? '경기 날짜' : '활동 가능 날짜';
  const timeLabel = isTeamToIndividual ? '경기 시간' : '활동 가능 시간';
  const positionLabel = isTeamToIndividual ? '모집 포지션' : '선호 포지션';

  const formattedDate = post.gameDate ? post.gameDate.toString().split("T")[0] : "날짜 미정";
  const formattedTime = post.gameTime || "시간 미정";

  // ✅ 수정된 부분
  const handleApply = () => {
    navigate(`/mercenary/apply/${post.id}`); // 신청 페이지로 이동
  };
  /*
  const handleApply = async () => {
    const message = prompt("작성자에게 전달할 간단한 메시지를 입력하세요 (선택사항):");
    if (message === null) return;

    try {
      const responseMessage = await applyToPostApi(post.id, { message });
      alert(responseMessage);
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("알 수 없는 오류가 발생했습니다.");
      }
    }
  }; */

  // 요약 카드 (펼치기 전)
  if (!isExpanded) {
    return (
      <div
        className="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transform hover:scale-105 transition-transform duration-200 ease-in-out h-full flex flex-col"
        onClick={onExpand}
      >
        <div className="relative w-full h-32">
          {post.thumbnailUrl ? (
            <img src={post.thumbnailUrl} alt={post.title} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
               <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-12 h-12"><path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.158 0a.075.075 0 0 1 .15 0A.075.075 0 0 1 12.908 8.25h.008a.075.075 0 0 1 0 .15A.075.075 0 0 1 12.908 8.4h-.008a.075.075 0 0 1-.15 0A.075.075 0 0 1 12.75 8.25h.008Z" /></svg>
            </div>
          )}
          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 shadow">
            {flowLabel}
          </div>
        </div>
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="text-sm font-semibold mt-1 mb-1 text-gray-800 truncate">{post.title}</h3>
          <div className="text-xs text-gray-500 mt-auto space-y-0.5">
            <p>지역: {post.region}{post.subRegion ? ` ${post.subRegion}` : ''}</p>
            <p>일시: {formattedDate}</p>
            {post.authorName && <p>작성자: {post.authorName}</p>}
            {post.status && <p>상태: {getStatusDisplayForDetail(post.status)}</p>}
          </div>
        </div>
      </div>
    );
  }

  // 상세 카드 (펼친 후)
  return (
    <div className="bg-white shadow-xl rounded-lg p-6 col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4">
      <div className="flex justify-between items-start mb-4">
        <div>
          <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded-full mr-2">
            {flowLabel}
          </span>
          <h2 className="text-2xl font-bold text-gray-800 inline">{post.title}</h2>
        </div>
        {onClose && <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-3xl leading-none">&times;</button>}
      </div>
      
      {post.thumbnailUrl && (
          <img src={post.thumbnailUrl} alt={post.title} className="w-full h-64 object-cover rounded-md mb-4" />
      )}
      
      <div className="text-sm text-gray-700 space-y-2">
        <p><strong>지역:</strong> {post.region}{post.subRegion ? `, ${post.subRegion}` : ''}</p>
        <p><strong>{dateLabel}:</strong> {formattedDate}</p>
        <p><strong>{timeLabel}:</strong> {formattedTime}</p>
        
        {isTeamToIndividual && (
          <>
            {post.requiredPersonnel != null && <p><strong>필요 인원:</strong> {post.requiredPersonnel}명</p>}
            {post.ageGroup && <p><strong>모집 연령대:</strong> {post.ageGroup}</p>}
          </>
        )}
        
        {post.preferredPositions && <p><strong>{positionLabel}:</strong> {post.preferredPositions}</p>}
        {post.authorName && (
          <p>
            <strong>작성자:</strong>{' '}
            <span 
              className={`text-blue-600 ${onAuthorNameClick ? 'hover:underline cursor-pointer' : ''}`}
              onClick={(e) => { if (onAuthorNameClick) { e.stopPropagation(); onAuthorNameClick(); } }}
            >
              {post.authorName}
            </span>
          </p>
        )}
        {post.status && <p><strong>상태:</strong> {getStatusDisplayForDetail(post.status)}</p>}
        <p className="mt-2 whitespace-pre-wrap"><strong>상세 내용:</strong><br/>{post.content}</p>
      </div>

      <div className="mt-6 text-right space-x-2">
        {/* 신청하기 버튼 */}
        {user && user.id !== post.authorId && post.status === 'RECRUITING' && (
          <button onClick={(e) => { e.stopPropagation(); handleApply(); }} className="bg-green-500 ...">
            신청하기
          </button>
        )}
        
        {/* 수정 버튼 */}
        {onEdit && (
            <button 
                onClick={(e) => { e.stopPropagation(); onEdit(); }} 
                className="bg-gray-500 hover:bg-gray-600 text-white text-sm px-4 py-2 rounded"
            >
                수정
            </button>
        )}
        {/* 삭제 버튼 */}
        {onDelete && (
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }} 
            className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded"
          >
            삭제
          </button>
        )}
      </div>
    </div>
  );
};

export default MercenaryDetailCard;