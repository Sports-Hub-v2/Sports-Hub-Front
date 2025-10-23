import React from 'react';
import {
  AlertTriangle, Ban, FileText, CheckCircle, XCircle,
  Edit, Info, Shield, Award, Clock
} from 'lucide-react';
import type { AdminLog, AdminLogActionType } from '../types/adminLog';

interface AdminLogTimelineProps {
  logs: AdminLog[];
  maxItems?: number;
  showEmpty?: boolean;
  onLogClick?: (log: AdminLog) => void;
}

const AdminLogTimeline: React.FC<AdminLogTimelineProps> = ({
  logs,
  maxItems,
  showEmpty = true,
  onLogClick
}) => {
  const displayLogs = maxItems ? logs.slice(0, maxItems) : logs;

  // 액션 타입별 설정
  const getActionConfig = (actionType: AdminLogActionType) => {
    const configs = {
      WARNING: {
        icon: AlertTriangle,
        color: 'bg-yellow-100 text-yellow-700 border-yellow-300',
        label: '경고',
        emoji: '⚠️'
      },
      BAN: {
        icon: Ban,
        color: 'bg-red-100 text-red-700 border-red-300',
        label: '정지',
        emoji: '🚫'
      },
      UNBAN: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-700 border-green-300',
        label: '정지 해제',
        emoji: '✅'
      },
      NOTE: {
        icon: FileText,
        color: 'bg-gray-100 text-gray-700 border-gray-300',
        label: '메모',
        emoji: '📝'
      },
      APPROVE: {
        icon: CheckCircle,
        color: 'bg-green-100 text-green-700 border-green-300',
        label: '승인',
        emoji: '✅'
      },
      REJECT: {
        icon: XCircle,
        color: 'bg-red-100 text-red-700 border-red-300',
        label: '거부',
        emoji: '❌'
      },
      EDIT: {
        icon: Edit,
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        label: '수정',
        emoji: '✏️'
      },
      INFO: {
        icon: Info,
        color: 'bg-blue-100 text-blue-700 border-blue-300',
        label: '정보',
        emoji: 'ℹ️'
      },
      VERIFICATION: {
        icon: Shield,
        color: 'bg-purple-100 text-purple-700 border-purple-300',
        label: '인증',
        emoji: '🛡️'
      },
      REWARD: {
        icon: Award,
        color: 'bg-green-100 text-green-700 border-green-300',
        label: '포상',
        emoji: '🏆'
      }
    };
    return configs[actionType] || configs.NOTE;
  };

  // 날짜 포맷팅
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    // 상대 시간 표시
    let relativeTime = '';
    if (diffMins < 1) {
      relativeTime = '방금 전';
    } else if (diffMins < 60) {
      relativeTime = `${diffMins}분 전`;
    } else if (diffHours < 24) {
      relativeTime = `${diffHours}시간 전`;
    } else if (diffDays < 7) {
      relativeTime = `${diffDays}일 전`;
    } else {
      relativeTime = date.toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    }

    const fullDate = date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    return { relativeTime, fullDate };
  };

  if (logs.length === 0 && showEmpty) {
    return (
      <div className="text-center py-12 text-gray-500">
        <FileText className="w-12 h-12 mx-auto mb-3 text-gray-400" />
        <p className="text-sm">아직 관리 기록이 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {displayLogs.map((log, index) => {
        const config = getActionConfig(log.actionType);
        const { relativeTime, fullDate } = formatDateTime(log.createdAt);
        const Icon = config.icon;

        return (
          <div
            key={log.id}
            className={`relative pl-8 pb-4 ${
              index !== displayLogs.length - 1 ? 'border-l-2 border-gray-200 ml-5' : 'ml-5'
            }`}
          >
            {/* 타임라인 아이콘 */}
            <div className={`absolute -left-5 top-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${config.color}`}>
              <Icon className="w-5 h-5" />
            </div>

            {/* 로그 카드 */}
            <div
              className={`bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all ${
                onLogClick ? 'cursor-pointer hover:border-blue-300' : ''
              }`}
              onClick={() => onLogClick && onLogClick(log)}
            >
              {/* 헤더 */}
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-semibold border ${config.color}`}>
                    {config.emoji} {config.label}
                  </span>
                  {log.metadata?.severity && (
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        log.metadata.severity === 'HIGH'
                          ? 'bg-red-50 text-red-700'
                          : log.metadata.severity === 'MEDIUM'
                          ? 'bg-orange-50 text-orange-700'
                          : 'bg-gray-50 text-gray-600'
                      }`}
                    >
                      {log.metadata.severity === 'HIGH'
                        ? '높음'
                        : log.metadata.severity === 'MEDIUM'
                        ? '보통'
                        : '낮음'}
                    </span>
                  )}
                </div>
                <div className="text-xs text-gray-500 flex items-center gap-1" title={fullDate}>
                  <Clock className="w-3 h-3" />
                  {relativeTime}
                </div>
              </div>

              {/* 제목 */}
              <h4 className="font-semibold text-gray-900 mb-1">{log.title}</h4>

              {/* 내용 */}
              <p className="text-sm text-gray-700 mb-3 whitespace-pre-wrap">{log.content}</p>

              {/* 메타데이터 */}
              <div className="space-y-2">
                {/* 관리자 정보 */}
                <div className="flex items-center gap-4 text-xs text-gray-600">
                  <span className="font-medium">관리자: {log.adminName}</span>
                  {log.metadata?.duration && (
                    <span className="text-orange-600 font-medium">기간: {log.metadata.duration}</span>
                  )}
                </div>

                {/* 수정 정보 */}
                {log.metadata?.previousValue && log.metadata?.newValue && (
                  <div className="bg-gray-50 p-2 rounded text-xs">
                    <div className="text-gray-600">
                      <span className="font-medium">변경 전:</span> {log.metadata.previousValue}
                    </div>
                    <div className="text-gray-900">
                      <span className="font-medium">변경 후:</span> {log.metadata.newValue}
                    </div>
                  </div>
                )}

                {/* 만료일 */}
                {log.metadata?.expiresAt && (
                  <div className="text-xs text-red-600">
                    만료일: {new Date(log.metadata.expiresAt).toLocaleString('ko-KR')}
                  </div>
                )}

                {/* 태그 */}
                {log.metadata?.tags && log.metadata.tags.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {log.metadata.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}

      {/* 더보기 표시 */}
      {maxItems && logs.length > maxItems && (
        <div className="text-center pt-2">
          <p className="text-sm text-gray-500">
            그 외 {logs.length - maxItems}개의 기록이 더 있습니다
          </p>
        </div>
      )}
    </div>
  );
};

export default AdminLogTimeline;
