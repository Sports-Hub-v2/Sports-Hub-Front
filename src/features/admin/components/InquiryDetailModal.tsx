// src/features/admin/components/InquiryDetailModal.tsx

import { useState } from 'react';
import { X, User, Mail, Clock, Tag, CheckCircle, AlertCircle, Send } from 'lucide-react';

interface Inquiry {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  subject: string;
  message: string;
  status: "pending" | "resolved" | "in-progress";
  createdAt: string;
  category: "account" | "payment" | "match" | "team" | "other";
}

interface InquiryDetailModalProps {
  inquiry: Inquiry | null;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (inquiryId: string, newStatus: Inquiry['status']) => void;
  onReply: (inquiryId: string, reply: string) => void;
}

const InquiryDetailModal = ({ inquiry, isOpen, onClose, onStatusChange, onReply }: InquiryDetailModalProps) => {
  const [reply, setReply] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Inquiry['status'] | ''>('');

  if (!isOpen || !inquiry) return null;

  const handleStatusChange = (newStatus: Inquiry['status']) => {
    setSelectedStatus(newStatus);
    onStatusChange(inquiry.id, newStatus);
  };

  const handleReplySubmit = () => {
    if (reply.trim()) {
      onReply(inquiry.id, reply);
      setReply('');
      alert('답변이 전송되었습니다. (목업)');
    }
  };

  const getStatusBadge = (status: Inquiry["status"]) => {
    const styles = {
      pending: {
        bg: "var(--fotmob-yellow-bg)",
        color: "var(--fotmob-yellow)",
        icon: <Clock size={16} />,
        text: "대기중",
      },
      "in-progress": {
        bg: "var(--fotmob-blue-bg)",
        color: "var(--fotmob-blue)",
        icon: <AlertCircle size={16} />,
        text: "처리중",
      },
      resolved: {
        bg: "var(--fotmob-green-bg)",
        color: "var(--fotmob-green)",
        icon: <CheckCircle size={16} />,
        text: "완료",
      },
    };

    const style = styles[status];

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "6px",
          padding: "6px 12px",
          borderRadius: "8px",
          fontSize: "14px",
          fontWeight: 600,
          background: style.bg,
          color: style.color,
        }}
      >
        {style.icon}
        {style.text}
      </span>
    );
  };

  const getCategoryLabel = (category: Inquiry["category"]) => {
    const labels = {
      account: "계정",
      payment: "결제",
      match: "경기",
      team: "팀",
      other: "기타",
    };
    return labels[category];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: 'var(--admin-bg-primary)',
          borderRadius: '16px',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid var(--admin-border)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            background: 'linear-gradient(135deg, var(--fotmob-blue) 0%, var(--fotmob-purple) 100%)',
            borderRadius: '16px 16px 0 0'
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: 'white', margin: 0 }}>
                문의 상세
              </h2>
              {getStatusBadge(selectedStatus || inquiry.status)}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'rgba(255, 255, 255, 0.9)', fontSize: '13px' }}>
              <Clock size={14} />
              <span>{formatDate(inquiry.createdAt)}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              border: 'none',
              borderRadius: '8px',
              padding: '8px',
              cursor: 'pointer',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)'}
          >
            <X size={20} />
          </button>
        </div>

        {/* 내용 */}
        <div style={{ padding: '24px' }}>
          {/* 사용자 정보 */}
          <div
            style={{
              background: 'var(--admin-bg-secondary)',
              borderRadius: '12px',
              padding: '16px',
              marginBottom: '20px',
              border: '1px solid var(--admin-border)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, var(--fotmob-blue) 0%, var(--fotmob-purple) 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '20px',
                  fontWeight: 700
                }}
              >
                {inquiry.userName.charAt(0)}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <User size={16} style={{ color: 'var(--admin-text-secondary)' }} />
                  <span style={{ fontSize: '16px', fontWeight: 600, color: 'var(--admin-text)' }}>
                    {inquiry.userName}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={14} style={{ color: 'var(--admin-text-secondary)' }} />
                  <span style={{ fontSize: '14px', color: 'var(--admin-text-secondary)' }}>
                    {inquiry.userEmail}
                  </span>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Tag size={14} style={{ color: 'var(--admin-text-secondary)' }} />
                <span
                  style={{
                    fontSize: '12px',
                    padding: '4px 10px',
                    background: 'var(--admin-bg-tertiary)',
                    borderRadius: '6px',
                    color: 'var(--admin-text-secondary)',
                    fontWeight: 500
                  }}
                >
                  {getCategoryLabel(inquiry.category)}
                </span>
              </div>
            </div>
          </div>

          {/* 제목 */}
          <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'var(--admin-text)', marginBottom: '4px' }}>
              {inquiry.subject}
            </h3>
          </div>

          {/* 문의 내용 */}
          <div
            style={{
              background: 'var(--admin-bg-secondary)',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '20px',
              border: '1px solid var(--admin-border)',
              minHeight: '120px',
              lineHeight: '1.6'
            }}
          >
            <p style={{ fontSize: '15px', color: 'var(--admin-text)', margin: 0, whiteSpace: 'pre-wrap' }}>
              {inquiry.message}
            </p>
          </div>

          {/* 상태 변경 */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '8px' }}>
              처리 상태 변경
            </label>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => handleStatusChange('pending')}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: `2px solid ${(selectedStatus || inquiry.status) === 'pending' ? 'var(--fotmob-yellow)' : 'var(--admin-border)'}`,
                  background: (selectedStatus || inquiry.status) === 'pending' ? 'var(--fotmob-yellow-bg)' : 'var(--admin-bg-secondary)',
                  color: (selectedStatus || inquiry.status) === 'pending' ? 'var(--fotmob-yellow)' : 'var(--admin-text)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <Clock size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                대기중
              </button>
              <button
                onClick={() => handleStatusChange('in-progress')}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: `2px solid ${(selectedStatus || inquiry.status) === 'in-progress' ? 'var(--fotmob-blue)' : 'var(--admin-border)'}`,
                  background: (selectedStatus || inquiry.status) === 'in-progress' ? 'var(--fotmob-blue-bg)' : 'var(--admin-bg-secondary)',
                  color: (selectedStatus || inquiry.status) === 'in-progress' ? 'var(--fotmob-blue)' : 'var(--admin-text)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <AlertCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                처리중
              </button>
              <button
                onClick={() => handleStatusChange('resolved')}
                style={{
                  flex: 1,
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: `2px solid ${(selectedStatus || inquiry.status) === 'resolved' ? 'var(--fotmob-green)' : 'var(--admin-border)'}`,
                  background: (selectedStatus || inquiry.status) === 'resolved' ? 'var(--fotmob-green-bg)' : 'var(--admin-bg-secondary)',
                  color: (selectedStatus || inquiry.status) === 'resolved' ? 'var(--fotmob-green)' : 'var(--admin-text)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                <CheckCircle size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
                완료
              </button>
            </div>
          </div>

          {/* 답변 작성 */}
          <div>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 600, color: 'var(--admin-text)', marginBottom: '8px' }}>
              답변 작성
            </label>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              placeholder="문의에 대한 답변을 작성해주세요..."
              style={{
                width: '100%',
                minHeight: '120px',
                padding: '12px',
                borderRadius: '8px',
                border: '1px solid var(--admin-border)',
                background: 'var(--admin-bg-secondary)',
                color: 'var(--admin-text)',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                marginBottom: '12px'
              }}
            />
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={onClose}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: '1px solid var(--admin-border)',
                  background: 'var(--admin-bg-secondary)',
                  color: 'var(--admin-text)',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                닫기
              </button>
              <button
                onClick={handleReplySubmit}
                disabled={!reply.trim()}
                style={{
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  background: reply.trim() ? 'linear-gradient(135deg, var(--fotmob-blue) 0%, var(--fotmob-purple) 100%)' : 'var(--admin-border)',
                  color: 'white',
                  fontSize: '14px',
                  fontWeight: 600,
                  cursor: reply.trim() ? 'pointer' : 'not-allowed',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <Send size={16} />
                답변 전송
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InquiryDetailModal;
