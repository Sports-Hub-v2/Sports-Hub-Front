import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import type { AdminLogActionType, AdminLogSeverity, AdminLogTargetType } from '../types/adminLog';

interface AdminLogModalProps {
  targetType: AdminLogTargetType;
  targetId: number;
  targetName: string;
  onClose: () => void;
  onSave: (data: AdminLogFormData) => void;
}

export interface AdminLogFormData {
  actionType: AdminLogActionType;
  title: string;
  content: string;
  severity?: AdminLogSeverity;
  duration?: string;
  reason?: string;
  tags?: string;
}

const AdminLogModal: React.FC<AdminLogModalProps> = ({
  targetType,
  targetId,
  targetName,
  onClose,
  onSave
}) => {
  const [formData, setFormData] = useState<AdminLogFormData>({
    actionType: 'NOTE',
    title: '',
    content: '',
    severity: 'LOW',
    duration: '',
    reason: '',
    tags: ''
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // 액션 타입 옵션
  const actionTypeOptions: { value: AdminLogActionType; label: string; emoji: string }[] = [
    { value: 'NOTE', label: '메모', emoji: '📝' },
    { value: 'WARNING', label: '경고', emoji: '⚠️' },
    { value: 'BAN', label: '정지', emoji: '🚫' },
    { value: 'UNBAN', label: '정지 해제', emoji: '✅' },
    { value: 'APPROVE', label: '승인', emoji: '✅' },
    { value: 'REJECT', label: '거부', emoji: '❌' },
    { value: 'EDIT', label: '정보 수정', emoji: '✏️' },
    { value: 'INFO', label: '정보성 기록', emoji: 'ℹ️' },
    { value: 'VERIFICATION', label: '인증 처리', emoji: '🛡️' },
    { value: 'REWARD', label: '포상/혜택', emoji: '🏆' }
  ];

  // 중요도 옵션
  const severityOptions: { value: AdminLogSeverity; label: string }[] = [
    { value: 'LOW', label: '낮음' },
    { value: 'MEDIUM', label: '보통' },
    { value: 'HIGH', label: '높음' }
  ];

  // 정지 기간 옵션
  const durationOptions = [
    '1일', '3일', '7일', '14일', '30일', '영구'
  ];

  // 유효성 검사
  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.title.trim()) {
      newErrors.title = '제목을 입력해주세요';
    }

    if (!formData.content.trim()) {
      newErrors.content = '내용을 입력해주세요';
    }

    if ((formData.actionType === 'BAN' || formData.actionType === 'WARNING') && !formData.reason?.trim()) {
      newErrors.reason = '제재 사유를 입력해주세요';
    }

    if (formData.actionType === 'BAN' && !formData.duration) {
      newErrors.duration = '정지 기간을 선택해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 폼 제출
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSave(formData);
  };

  // 액션 타입에 따라 추가 필드 표시 여부 결정
  const showReasonField = formData.actionType === 'BAN' || formData.actionType === 'WARNING';
  const showDurationField = formData.actionType === 'BAN';

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold">관리 기록 추가</h2>
            <p className="text-sm text-gray-600 mt-1">
              {targetType === 'USER' ? '사용자' : '팀'}: <span className="font-semibold">{targetName}</span>
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 액션 타입 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              액션 타입 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.actionType}
              onChange={(e) => setFormData({ ...formData, actionType: e.target.value as AdminLogActionType })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {actionTypeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.emoji} {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* 중요도 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              중요도 <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-3">
              {severityOptions.map((option) => (
                <label
                  key={option.value}
                  className={`flex-1 flex items-center justify-center px-4 py-2 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.severity === option.value
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="severity"
                    value={option.value}
                    checked={formData.severity === option.value}
                    onChange={(e) => setFormData({ ...formData, severity: e.target.value as AdminLogSeverity })}
                    className="sr-only"
                  />
                  <span className="font-medium">{option.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="예: 노쇼 경고 조치"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.title}
              </p>
            )}
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.content ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={5}
              placeholder="상세한 내용을 입력해주세요..."
            />
            {errors.content && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.content}
              </p>
            )}
          </div>

          {/* 제재 사유 (경고/정지인 경우만) */}
          {showReasonField && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                제재 사유 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.reason || ''}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.reason ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="예: 3회 연속 노쇼"
              />
              {errors.reason && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.reason}
                </p>
              )}
            </div>
          )}

          {/* 정지 기간 (정지인 경우만) */}
          {showDurationField && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                정지 기간 <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                  errors.duration ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">선택하세요</option>
                {durationOptions.map((duration) => (
                  <option key={duration} value={duration}>
                    {duration}
                  </option>
                ))}
              </select>
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4" />
                  {errors.duration}
                </p>
              )}
            </div>
          )}

          {/* 태그 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              태그 (쉼표로 구분)
            </label>
            <input
              type="text"
              value={formData.tags || ''}
              onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="예: 노쇼, 경고, 긴급"
            />
            <p className="mt-1 text-xs text-gray-500">
              쉼표(,)로 구분하여 여러 개의 태그를 입력할 수 있습니다
            </p>
          </div>

          {/* 안내 메시지 */}
          {formData.actionType === 'BAN' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-red-800">
                  <p className="font-medium mb-1">정지 처분 안내</p>
                  <p>
                    정지 처분은 신중하게 결정해야 합니다. 정지 기간 동안 사용자는 모든 활동이 제한됩니다.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* 버튼 */}
          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLogModal;
