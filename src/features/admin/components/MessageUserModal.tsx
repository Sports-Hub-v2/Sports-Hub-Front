import React, { useState } from 'react';
import { X, Send, MessageCircle, Mail, AlertCircle, User } from 'lucide-react';

interface MessageUserModalProps {
  user: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  isOpen: boolean;
  onClose: () => void;
  onSend: (data: MessageData) => void;
}

interface MessageData {
  subject: string;
  message: string;
  priority: 'low' | 'normal' | 'high' | 'urgent';
  sendEmail: boolean;
}

const MessageUserModal: React.FC<MessageUserModalProps> = ({
  user,
  isOpen,
  onClose,
  onSend
}) => {
  const [formData, setFormData] = useState<MessageData>({
    subject: '',
    message: '',
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

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center rounded-t-xl">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <MessageCircle className="w-6 h-6 text-green-600" />
              사용자 메시지 보내기
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              개별 사용자에게 직접 메시지를 전송합니다
            </p>
          </div>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* 수신자 정보 */}
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold text-green-900 mb-1">수신자</p>
                <div className="space-y-1 text-sm text-green-800">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    <span>{user.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  {user.phone && (
                    <div className="flex items-center gap-2">
                      <span>📱</span>
                      <span>{user.phone}</span>
                    </div>
                  )}
                </div>
              </div>
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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.subject ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="예: 계정 보안 강화 안내"
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
              className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 ${
                errors.message ? 'border-red-500' : 'border-gray-300'
              }`}
              rows={8}
              placeholder="사용자에게 전달할 메시지를 입력하세요...

예시:
- 정책 위반 경고 및 조치 사항
- 계정 보안 강화 권고사항
- 서비스 개선 안내
- 이벤트 및 혜택 안내"
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
                  className="w-4 h-4 text-green-600 rounded focus:ring-green-500"
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
                  긴급 메시지는 즉시 전송되며, 사용자에게 최우선으로 표시됩니다.
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
              className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium flex items-center gap-2"
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

export default MessageUserModal;
