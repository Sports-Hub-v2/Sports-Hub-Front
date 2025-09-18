// src/features/myPage/components/MyReceivedApplications.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { getProfileByAccountIdApi } from '@/features/auth/api/userApi';
import { getReceivedApplicationsApi, acceptApplicationApi, rejectApplicationApi } from '@/features/application/api/applicationApi';
import type { ReceivedApplication } from '@/types/application';
import { ApplicationStatus } from '@/types/recruitPost';

const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  const statusMap = {
    [ApplicationStatus.PENDING]: { text: '대기중', className: 'bg-yellow-100 text-yellow-800' },
    [ApplicationStatus.ACCEPTED]: { text: '수락됨', className: 'bg-green-100 text-green-800' },
    [ApplicationStatus.REJECTED]: { text: '거절됨', className: 'bg-red-100 text-red-800' },
  };
  const { text, className } = statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>{text}</span>;
};

const MyReceivedApplications: React.FC = () => {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<ReceivedApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [profileId, setProfileId] = useState<number | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) { setIsLoading(false); return; }
      try {
        const profile = await getProfileByAccountIdApi(user.id);
        setProfileId(profile.id);
      } catch (error) {
        console.error('프로필 조회 실패:', error);
        setIsLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const fetchReceivedApplications = useCallback(async () => {
    if (!profileId) return;
    setIsLoading(true);
    try {
      const data = await getReceivedApplicationsApi(profileId);
      setApplications(data);
    } catch (error) {
      console.error('받은 신청 조회 실패:', error);
    } finally {
      setIsLoading(false);
    }
  }, [profileId]);

  useEffect(() => {
    if (profileId) fetchReceivedApplications();
  }, [profileId, fetchReceivedApplications]);

  const handleAccept = async (applicationId: number, postId: number) => {
    if (!window.confirm('정말 이 신청을 수락하시겠습니까?')) return;
    try {
      const message = await acceptApplicationApi(applicationId, postId);
      alert(message);
      fetchReceivedApplications(); // 목록 새로고침
    } catch (err) {
      alert(err instanceof Error ? err.message : '오류 발생');
    }
  };

  const handleReject = async (applicationId: number, postId: number) => {
    if (!window.confirm('정말 이 신청을 거절하시겠습니까?')) return;
    try {
      const message = await rejectApplicationApi(applicationId, postId);
      alert(message);
      fetchReceivedApplications();
    } catch (err) {
      alert(err instanceof Error ? err.message : '오류 발생');
    }
  };

  if (isLoading) return <div className="py-8 text-center">받은 신청을 불러오는 중...</div>;
  if (!user) return <div className="py-8 text-center text-gray-500">로그인이 필요합니다.</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold border-b pb-2">받은 신청 목록</h3>
      {applications.length === 0 ? (
        <p className="py-8 text-center text-gray-500">받은 신청이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {applications.map((app) => (
            <li key={app.applicationId} className="py-4 flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">
                  <Link to={`/recruit-posts/${app.postId}`} className="font-semibold text-blue-600 hover:underline">{app.postTitle}</Link>
                  <span> 글에 대한 신청</span>
                </p>
                <p className="font-semibold text-gray-800 mt-1">{app.applicantName}님의 신청</p>
                {app.message && <p className="text-sm text-gray-600 mt-1">메시지: {app.message}</p>}
                <p className="text-xs text-gray-400 mt-1">신청일: {new Date(app.appliedAt).toLocaleDateString('ko-KR')}</p>
              </div>
              <div className="flex items-center space-x-2">
                <StatusBadge status={app.status} />
                {app.status === ApplicationStatus.PENDING && (
                  <>
                    <button onClick={() => handleAccept(app.applicationId, app.postId)} className="text-sm bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600">수락</button>
                    <button onClick={() => handleReject(app.applicationId, app.postId)} className="text-sm bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600">거절</button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyReceivedApplications;