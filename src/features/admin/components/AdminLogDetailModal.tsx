import React, { useState, useEffect } from 'react';
import { X, Clock, User, Tag, Calendar, AlertTriangle, FileText, Plus, StickyNote } from 'lucide-react';
import type { AdminLog } from '../types/adminLog';

interface AdminLogDetailModalProps {
  log: AdminLog | null;
  isOpen: boolean;
  onClose: () => void;
  onAddNote?: (logId: number, note: string) => void;
}

const AdminLogDetailModal: React.FC<AdminLogDetailModalProps> = ({
  log,
  isOpen,
  onClose,
  onAddNote
}) => {
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    if (log) {
      setNoteText('');
      setIsAddingNote(false);
    }
  }, [log]);

  if (!isOpen || !log) return null;

  const handleAddNote = () => {
    if (onAddNote && noteText.trim()) {
      onAddNote(log.id, noteText.trim());
      setNoteText('');
      setIsAddingNote(false);
    }
  };

  // 액션 타입별 설정
  const getActionConfig = (actionType: string) => {
    const configs = {
      WARNING: { color: 'bg-yellow-100 text-yellow-700 border-yellow-300', emoji: '⚠️', label: '경고' },
      BAN: { color: 'bg-red-100 text-red-700 border-red-300', emoji: '🚫', label: '정지' },
      UNBAN: { color: 'bg-green-100 text-green-700 border-green-300', emoji: '✅', label: '정지 해제' },
      NOTE: { color: 'bg-gray-100 text-gray-700 border-gray-300', emoji: '📝', label: '메모' },
      APPROVE: { color: 'bg-green-100 text-green-700 border-green-300', emoji: '✅', label: '승인' },
      REJECT: { color: 'bg-red-100 text-red-700 border-red-300', emoji: '❌', label: '거부' },
      EDIT: { color: 'bg-blue-100 text-blue-700 border-blue-300', emoji: '✏️', label: '수정' },
      INFO: { color: 'bg-blue-100 text-blue-700 border-blue-300', emoji: 'ℹ️', label: '정보' },
      VERIFICATION: { color: 'bg-purple-100 text-purple-700 border-purple-300', emoji: '🛡️', label: '인증' },
      REWARD: { color: 'bg-green-100 text-green-700 border-green-300', emoji: '🏆', label: '포상' }
    };
    return configs[actionType as keyof typeof configs] || configs.NOTE;
  };

  const config = getActionConfig(log.actionType);

  // 날짜 포맷팅
  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-xl">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${config.color}`}>
              {config.emoji} {config.label}
            </span>
            {log.metadata?.severity && (
              <span
                className={`px-3 py-1 rounded text-xs font-medium ${
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
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 본문 */}
        <div className="p-6 space-y-6">
          {/* 제목 */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{log.title}</h2>
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                <span>{formatDateTime(log.createdAt)}</span>
              </div>
              <div className="flex items-center gap-1">
                <User className="w-4 h-4" />
                <span>처리자: {log.adminName}</span>
              </div>
            </div>
          </div>

          {/* 내용 */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-start gap-2 mb-2">
              <FileText className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
              <h3 className="font-semibold text-gray-900">상세 내용</h3>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap leading-relaxed pl-7">{log.content}</p>
          </div>

          {/* 메타데이터 */}
          {log.metadata && (
            <div className="space-y-4">
              {/* 제재 사유 */}
              {log.metadata.reason && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-red-900 mb-1">제재 사유</h4>
                      <p className="text-red-700">{log.metadata.reason}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* 정지 기간 */}
              {log.metadata.duration && (
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-orange-600" />
                    <div>
                      <span className="font-semibold text-orange-900">정지 기간: </span>
                      <span className="text-orange-700 font-medium">{log.metadata.duration}</span>
                    </div>
                  </div>
                  {log.metadata.expiresAt && (
                    <div className="mt-2 text-sm text-orange-700">
                      만료일: {formatDateTime(log.metadata.expiresAt)}
                    </div>
                  )}
                </div>
              )}

              {/* 수정 내역 */}
              {log.metadata.previousValue && log.metadata.newValue && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-900 mb-3">변경 내역</h4>
                  <div className="space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-blue-700 min-w-20">변경 전:</span>
                      <span className="text-sm text-blue-600 line-through">{log.metadata.previousValue}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-sm font-medium text-blue-700 min-w-20">변경 후:</span>
                      <span className="text-sm text-blue-900 font-semibold">{log.metadata.newValue}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* 태그 */}
              {log.metadata.tags && log.metadata.tags.length > 0 && (
                <div className="flex items-start gap-2">
                  <Tag className="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" />
                  <div className="flex flex-wrap gap-2">
                    {log.metadata.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 관련 정보 */}
              {(log.metadata.relatedId || log.metadata.relatedType) && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">관련 정보</h4>
                  <div className="text-sm text-gray-700 space-y-1">
                    {log.metadata.relatedType && (
                      <div>타입: {log.metadata.relatedType}</div>
                    )}
                    {log.metadata.relatedId && (
                      <div>ID: {log.metadata.relatedId}</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 대상 정보 */}
          <div className="border-t pt-4">
            <div className="text-sm text-gray-600">
              <div>대상 구분: <span className="font-medium text-gray-900">{log.targetType === 'USER' ? '사용자' : '팀'}</span></div>
              {log.targetName && (
                <div>대상 이름: <span className="font-medium text-gray-900">{log.targetName}</span></div>
              )}
              <div>기록 ID: <span className="font-medium text-gray-900">#{log.id}</span></div>
            </div>
          </div>

          {/* 관리자 메모/비고 */}
          <div className="border-t pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <StickyNote className="w-5 h-5 text-purple-600" />
                <h3 className="font-semibold text-gray-900">관리자 메모 / 비고</h3>
                {log.notes && log.notes.length > 0 && (
                  <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                    {log.notes.length}개
                  </span>
                )}
              </div>
              {!isAddingNote && onAddNote && (
                <button
                  onClick={() => setIsAddingNote(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
                >
                  <Plus className="w-4 h-4" />
                  메모 추가
                </button>
              )}
            </div>

            {/* 메모 추가 입력란 */}
            {isAddingNote && (
              <div className="mb-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
                <textarea
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="이 관리 기록에 대한 추가 메모나 비고를 입력하세요...&#10;&#10;예시:&#10;- 사용자와 통화 완료 (2025-10-24 15:30)&#10;- 재발 시 즉시 7일 정지 처리 예정&#10;- 다음 검토일: 2025-11-01"
                  className="w-full px-4 py-3 border border-purple-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-sm"
                  rows={5}
                  maxLength={1000}
                  autoFocus
                />
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-purple-600">{noteText.length}/1000</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setNoteText('');
                        setIsAddingNote(false);
                      }}
                      className="px-4 py-2 text-sm bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleAddNote}
                      disabled={!noteText.trim()}
                      className="flex items-center gap-1.5 px-4 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-4 h-4" />
                      추가
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* 메모 리스트 (히스토리) */}
            <div className="space-y-3">
              {log.notes && log.notes.length > 0 ? (
                log.notes.slice().reverse().map((note, index) => (
                  <div
                    key={note.id}
                    className="bg-purple-50 border border-purple-200 rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-purple-600" />
                        <span className="text-sm font-semibold text-purple-900">{note.adminName}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-purple-600">
                        <Clock className="w-3.5 h-3.5" />
                        <time>
                          {new Date(note.createdAt).toLocaleString('ko-KR', {
                            year: 'numeric',
                            month: '2-digit',
                            day: '2-digit',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </time>
                      </div>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap text-sm leading-relaxed pl-6">
                      {note.content}
                    </p>
                    {index === 0 && (
                      <div className="mt-2 pl-6">
                        <span className="inline-flex items-center px-2 py-0.5 bg-purple-200 text-purple-800 rounded text-xs font-medium">
                          최신
                        </span>
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                  <p className="text-gray-500 text-sm">메모가 없습니다. 메모 추가 버튼을 눌러 메모를 작성할 수 있습니다.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 푸터 */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end rounded-b-xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogDetailModal;
