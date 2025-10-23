import React, { useState } from 'react';
import { X, Send, MessageCircle, Mail, AlertCircle, Users, User, Crown } from 'lucide-react';

interface MessageTeamModalProps {
  team: {
    id: number;
    name: string;
    stats?: {
      totalMembers: number;
    };
    admin?: {
      captainName: string;
    };
  };
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: MessageData) => void;
}

interface MessageData {
  subject: string;
  message: string;
  recipients: 'all' | 'captain' | 'members';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  sendEmail: boolean;
}

const MessageTeamModal: React.FC<MessageTeamModalProps> = ({
  team,
  isOpen,
  onClose,
  onSend
}) => {
  const [formData, setFormData] = useState<MessageData>({
    subject: '',
    message: '',
    recipients: 'all',
    priority: 'normal',
    sendEmail: true
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.subject.trim()) {
      newErrors.subject = '제목을 입력해주세요';
    }

    if (!formData.message.trim()) {
      newErrors.message = '메시지 내용을 입력해주세요';
    }

    if (formData.message.length < 10) {
      newErrors.message = '메시지는 최소 10자 이상 입력해주세요';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) {
      return;
    }

    onSend(formData);
  };

  // 수신 대상에 따른 설명
  const getRecipientInfo = () => {
    const totalMembers = team.stats?.totalMembers || 0;
    switch (formData.recipients) {
      case 'all':
        return { count: totalMembers, description: '팀장 및 모든 팀원' };
      case 'captain':
        return { count: 1, description: '팀장만' };
      case 'members':
        return { count: totalMembers - 1, description: '팀원만 (팀장 제외)' };
    }
  };

  const recipientInfo = getRecipientInfo();

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-blue-600" />
              팀 메시지 보내기
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              팀 전체 또는 특정 구성원에게 메시지를 전송합니다
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 팀 정보 */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Users className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-blue-900 mb-1">대상 팀</p>
                <div className="space-y-1 text-sm text-blue-800">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{team.name}</span>
                  </div>
                  {team.admin?.captainName && (
                    <div className="flex items-center gap-2">
                      <Crown className="w-4 h-4" />
                      <span>팀장: {team.admin.captainName}</span>
                    </div>
                  )}
                  {team.stats?.totalMembers && (
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>총 {team.stats.totalMembers}명</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* 수신 대상 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              수신 대상 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { value: 'all', label: '전체', icon: Users, description: '팀장 + 모든 팀원' },
                { value: 'captain', label: '팀장만', icon: Crown, description: '팀장에게만' },
                { value: 'members', label: '팀원만', icon: User, description: '팀장 제외' }
              ].map((option) => {
                const Icon = option.icon;
                return (
                  <label
                    key={option.value}
                    className={`flex flex-col items-center px-3 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                      formData.recipients === option.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="recipients"
                      value={option.value}
                      checked={formData.recipients === option.value}
                      onChange={(e) => setFormData({ ...formData, recipients: e.target.value as any })}
                      className="sr-only"
                    />
                    <Icon className="w-5 h-5 mb-1" />
                    <span className="text-sm font-medium">{option.label}</span>
                    <span className="text-xs text-gray-500 mt-0.5">{option.description}</span>
                  </label>
                );
              })}
            </div>
            <div className="mt-2 text-sm text-gray-600 flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>약 {recipientInfo.count}명에게 전송됩니다 ({recipientInfo.description})</span>
            </div>
          </div>

          {/* 중요도 선택 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              중요도 <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-4 gap-2">
              {[
                { value: 'low', label: '낮음', color: 'gray' },
                { value: 'normal', label: '보통', color: 'blue' },
                { value: 'high', label: '높음', color: 'orange' },
                { value: 'urgent', label: '긴급', color: 'red' }
              ].map((option) => (
                <label
                  key={option.value}
                  className={`flex items-center justify-center px-3 py-2 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.priority === option.value
                      ? `border-${option.color}-500 bg-${option.color}-50 text-${option.color}-700`
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="radio"
                    name="priority"
                    value={option.value}
                    checked={formData.priority === option.value}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="sr-only"
                  />
                  <span className="text-sm font-medium">{option.label}</span>
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
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.subject ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="예: 이번 주 경기 일정 안내"
              maxLength={100}
            />
            {errors.subject && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.subject}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">{formData.subject.length}/100</p>
          </div>

          {/* 메시지 내용 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              메시지 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={8}
              placeholder="팀에게 전달할 메시지를 입력하세요...

예시:
- 경기 일정 및 참석 여부 확인
- 팀 훈련 및 모임 안내
- 팀 규칙 및 정책 변경 공지
- 팀 활동 관련 중요 공지사항"
              maxLength={1000}
            />
            {errors.message && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {errors.message}
              </p>
            )}
            <p className="mt-1 text-xs text-gray-500">{formData.message.length}/1000</p>
          </div>

          {/* 전송 옵션 */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <p className="text-sm font-medium text-gray-700 mb-3">전송 옵션</p>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.sendEmail}
                  onChange={(e) => setFormData({ ...formData, sendEmail: e.target.checked })}
                  className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-gray-600" />
                  <span className="text-sm text-gray-700">이메일로 전송</span>
                </div>
              </label>
            </div>
          </div>

          {/* 안내 메시지 */}
          {formData.priority === 'urgent' && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-800">
                  긴급 메시지는 즉시 전송되며, 모든 수신자에게 최우선으로 표시됩니다.
                </p>
              </div>
            </div>
          )}

          {formData.recipients === 'all' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600 flex-shrink-0" />
                <p className="text-sm text-blue-800">
                  전체 팀원에게 메시지가 전송됩니다. 중요한 내용인지 다시 한번 확인해주세요.
                </p>
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
              <Send className="w-4 h-4" />
              메시지 전송
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MessageTeamModal;
