// src/features/myPage/components/MyProfileInfo.tsx

import React, { useEffect, useState } from "react";
import { useAuthStore } from "@/stores/useAuthStore";
import { getProfileByAccountIdApi } from "@/features/auth/api/userApi";
import type { User } from "@/types/user";

const fmt = (v?: string | null | number) => (v !== null && v !== undefined && v !== '' ? v : "미입력");
const fmtDate = (v?: string | null) =>
  v ? new Date(v).toLocaleDateString("ko-KR") : "정보 없음";

const dominantFootLabel = (foot?: string) => {
  if (!foot) return "미입력";
  if (foot === 'RIGHT') return "오른발";
  if (foot === 'LEFT') return "왼발";
  if (foot === 'BOTH') return "양발";
  return foot;
};

const playStyleLabel = (style?: string) => {
  if (!style) return "미입력";
  const labels: Record<string, string> = {
    OFFENSIVE: "공격적",
    DEFENSIVE: "수비적",
    BALANCED: "밸런스",
    TECHNICAL: "기술형",
    PHYSICAL: "피지컬형",
  };
  return labels[style] || style;
};

const timeSlotLabel = (slot?: string) => {
  if (!slot) return "미입력";
  const labels: Record<string, string> = {
    WEEKDAY_MORNING: "평일 오전",
    WEEKDAY_AFTERNOON: "평일 오후",
    WEEKDAY_EVENING: "평일 저녁",
    WEEKEND_MORNING: "주말 오전",
    WEEKEND_AFTERNOON: "주말 오후",
    WEEKEND_EVENING: "주말 저녁",
  };
  return labels[slot] || slot;
};

const MyProfileInfo: React.FC = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const run = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      setIsLoading(true);
      setError(null);
      try {
        const data = await getProfileByAccountIdApi(user.id);
        setProfile(data);
      } catch (e: any) {
        if (e?.response?.status === 404) {
          setProfile(null);
        } else {
          setError("프로필을 불러오는 중 오류가 발생했습니다.");
        }
      } finally {
        setIsLoading(false);
      }
    };
    run();
  }, [user]);

  if (isLoading) {
    return <div className="text-center text-gray-500 py-8">정보를 불러오는 중...</div>;
  }
  if (error) {
    return <div className="text-center text-red-500 py-8">{error}</div>;
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500 mb-4">프로필 정보가 없습니다.</p>
        <p className="text-sm text-gray-400">상단의 프로필 수정 버튼을 클릭하여 정보를 입력해주세요.</p>
      </div>
    );
  }

  // 읽기 전용 프로필 표시
  return (
    <div className="space-y-8">
      {/* 기본 정보 */}
      <div>
        <h3 className="text-xl font-semibold border-b pb-2 mb-4">기본 정보</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <dt className="font-medium text-gray-500">이름</dt>
            <dd className="mt-1 text-gray-800">{fmt(profile.name)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">이메일</dt>
            <dd className="mt-1 text-gray-800">{fmt(user?.email)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">사용자 ID</dt>
            <dd className="mt-1 text-gray-800">{fmt(profile.userid)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">권한</dt>
            <dd className="mt-1 text-gray-800">{fmt(profile.role)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">전화번호</dt>
            <dd className="mt-1 text-gray-800">{fmt(profile.phoneNumber)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">생년월일</dt>
            <dd className="mt-1 text-gray-800">{fmtDate(profile.birthDate)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">선수 출신</dt>
            <dd className="mt-1 text-gray-800">{profile.isExPlayer ? "예" : "아니오"}</dd>
          </div>
        </dl>
      </div>

      {/* 활동 정보 */}
      <div>
        <h3 className="text-xl font-semibold border-b pb-2 mb-4">활동 정보</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <dt className="font-medium text-gray-500">활동 지역</dt>
            <dd className="mt-1 text-gray-800">{fmt(profile.region)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">선호 포지션</dt>
            <dd className="mt-1 text-gray-800">{fmt(profile.preferredPosition)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">활동 시작일</dt>
            <dd className="mt-1 text-gray-800">{fmtDate(profile.activityStartDate)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">활동 종료일</dt>
            <dd className="mt-1 text-gray-800">{fmtDate(profile.activityEndDate)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">선호 시간대</dt>
            <dd className="mt-1 text-gray-800">{timeSlotLabel(profile.preferredTimeSlots)}</dd>
          </div>
        </dl>
      </div>

      {/* 신체 정보 */}
      {(profile.height || profile.weight) && (
        <div>
          <h3 className="text-xl font-semibold border-b pb-2 mb-4">신체 정보</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="font-medium text-gray-500">키</dt>
              <dd className="mt-1 text-gray-800">{profile.height ? `${profile.height} cm` : "미입력"}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">몸무게</dt>
              <dd className="mt-1 text-gray-800">{profile.weight ? `${profile.weight} kg` : "미입력"}</dd>
            </div>
          </dl>
        </div>
      )}

      {/* 축구 정보 */}
      {(profile.dominantFoot || profile.careerYears || profile.playStyle) && (
        <div>
          <h3 className="text-xl font-semibold border-b pb-2 mb-4">축구 정보</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            <div>
              <dt className="font-medium text-gray-500">주발</dt>
              <dd className="mt-1 text-gray-800">{dominantFootLabel(profile.dominantFoot)}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">축구 경력</dt>
              <dd className="mt-1 text-gray-800">{profile.careerYears ? `${profile.careerYears}년` : "미입력"}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-500">플레이 스타일</dt>
              <dd className="mt-1 text-gray-800">{playStyleLabel(profile.playStyle)}</dd>
            </div>
          </dl>
        </div>
      )}

      {/* 자기소개 */}
      {profile.bio && (
        <div>
          <h3 className="text-xl font-semibold border-b pb-2 mb-4">자기소개</h3>
          <p className="text-sm text-gray-800 whitespace-pre-wrap">{profile.bio}</p>
        </div>
      )}

      {/* SNS 정보 */}
      {(profile.instagramUrl || profile.facebookUrl) && (
        <div>
          <h3 className="text-xl font-semibold border-b pb-2 mb-4">SNS</h3>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
            {profile.instagramUrl && (
              <div>
                <dt className="font-medium text-gray-500">인스타그램</dt>
                <dd className="mt-1">
                  <a href={profile.instagramUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {profile.instagramUrl}
                  </a>
                </dd>
              </div>
            )}
            {profile.facebookUrl && (
              <div>
                <dt className="font-medium text-gray-500">페이스북</dt>
                <dd className="mt-1">
                  <a href={profile.facebookUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {profile.facebookUrl}
                  </a>
                </dd>
              </div>
            )}
          </dl>
        </div>
      )}

      {/* 프로필 이미지 */}
      {profile.profileImageUrl && (
        <div>
          <h3 className="text-xl font-semibold border-b pb-2 mb-4">프로필 이미지</h3>
          <img src={profile.profileImageUrl} alt="프로필" className="w-32 h-32 rounded-full object-cover border-2 border-gray-300" />
        </div>
      )}

      {/* 메타 정보 */}
      <div>
        <h3 className="text-xl font-semibold border-b pb-2 mb-4">메타 정보</h3>
        <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 text-sm">
          <div>
            <dt className="font-medium text-gray-500">생성일</dt>
            <dd className="text-gray-800 mt-1">{fmtDate(profile.createdAt)}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">최근 수정일</dt>
            <dd className="text-gray-800 mt-1">{fmtDate(profile.updatedAt)}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default MyProfileInfo;
