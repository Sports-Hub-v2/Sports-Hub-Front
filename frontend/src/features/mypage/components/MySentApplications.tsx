import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '@/stores/useAuthStore';
import { getMyApplicationsByApplicantApi, cancelApplicationApi } from '@/features/application/api/applicationApi';
import { getProfileByAccountIdApi } from '@/features/auth/api/userApi';
import type { MyApplication } from '@/types/application';
import { ApplicationStatus } from '@/types/recruitPost';

const StatusBadge: React.FC<{ status: ApplicationStatus }> = ({ status }) => {
  const statusMap: Record<string, { text: string; className: string }> = {
    [ApplicationStatus.PENDING]: { text: '대기중', className: 'bg-yellow-100 text-yellow-800' },
    [ApplicationStatus.ACCEPTED]: { text: '수락됨', className: 'bg-green-100 text-green-800' },
    [ApplicationStatus.REJECTED]: { text: '거절됨', className: 'bg-red-100 text-red-800' },
  };
  const { text, className } = statusMap[status] || { text: status, className: 'bg-gray-100 text-gray-800' };
  return <span className={`px-2 py-1 text-xs font-medium rounded-full ${className}`}>{text}</span>;
};

const MySentApplications: React.FC = () => {
  const { user } = useAuthStore();
  const [applications, setApplications] = useState<MyApplication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchApplications = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const profile = await getProfileByAccountIdApi(user.id);
      const data = await getMyApplicationsByApplicantApi(profile.id);
      setApplications(data);
    } catch (err: any) { if (err?.response?.status === 404) { setApplications([]); setError(null); } else { setError(err instanceof Error ? err.message : "신청 내역 조회 실패"); } } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => { fetchApplications(); }, [fetchApplications]);

  const handleCancel = async (applicationId: number, postId: number) => {
    if (!window.confirm('해당 신청을 취소하시겠어요?')) return;
    try {
      await cancelApplicationApi(applicationId, postId);
      alert('신청이 취소되었습니다.');
      fetchApplications();
    } catch (err: any) { if (err?.response?.status === 404) { setApplications([]); setError(null); } else { setError(err instanceof Error ? err.message : "신청 내역 조회 실패"); } }
  };

  if (isLoading) return <div className="py-8 text-center text-gray-500">신청 내역을 불러오는 중...</div>;
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>;

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold border-b pb-2">내가 보낸 신청</h3>
      {applications.length === 0 ? (
        <p className="py-8 text-center text-gray-500">보낸 신청이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {applications.map((app) => (
            <li key={app.applicationId} className="py-4 flex items-center justify-between">
              <div>
                <Link to={`/recruit-posts/${app.postId}`} className="font-semibold text-blue-600 hover:underline">{app.postTitle || '모집글'}</Link>
                <p className="text-sm text-gray-600 mt-1">신청일 {new Date(app.appliedAt).toLocaleDateString()}</p>
                {app.status === ApplicationStatus.REJECTED && app.rejectionReason && (
                   <p className="text-sm text-red-500 mt-1">거절 사유: {app.rejectionReason}</p>
                )}
              </div>
              <div className="flex items-center space-x-4">
                <StatusBadge status={app.status} />
                {app.status === ApplicationStatus.PENDING && (
                  <button onClick={() => handleCancel(app.applicationId, app.postId)} className="text-sm text-red-500 hover:underline">신청 취소</button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MySentApplications;




