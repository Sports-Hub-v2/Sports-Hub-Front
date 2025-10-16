// src/features/admin/components/RecentInquiries.tsx

import { useState } from "react";
import { MessageCircle, Clock, AlertCircle, CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import InquiryDetailModal from "./InquiryDetailModal";

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

const mockInquiries: Inquiry[] = [
  {
    id: "1",
    userId: "1",
    userName: "김민수",
    userEmail: "minsu.kim@example.com",
    subject: "경기 일정 변경 요청",
    message: "다음 주 토요일 경기를 일요일로 변경할 수 있을까요?",
    status: "pending",
    createdAt: "2024-10-04T10:30:00",
    category: "match",
  },
  {
    id: "2",
    userId: "2",
    userName: "이지은",
    userEmail: "jieun.lee@example.com",
    subject: "팀 가입 승인 문의",
    message: "팀 가입 신청한지 3일이 지났는데 아직 승인이 안됐습니다.",
    status: "in-progress",
    createdAt: "2024-10-03T15:20:00",
    category: "team",
  },
  {
    id: "3",
    userId: "5",
    userName: "정현우",
    userEmail: "hyunwoo.jung@example.com",
    subject: "계정 정지 해제 요청",
    message: "계정이 정지되었는데 이유를 알 수 있을까요?",
    status: "resolved",
    createdAt: "2024-10-02T09:15:00",
    category: "account",
  },
  {
    id: "4",
    userId: "3",
    userName: "박준호",
    userEmail: "junho.park@example.com",
    subject: "결제 오류 문의",
    message: "경기 참가비 결제가 안됩니다. 확인 부탁드립니다.",
    status: "pending",
    createdAt: "2024-10-01T14:45:00",
    category: "payment",
  },
  {
    id: "5",
    userId: "4",
    userName: "최서연",
    userEmail: "seoyeon.choi@example.com",
    subject: "심판 평가 시스템 개선 제안",
    message: "심판 평가 항목에 추가할 내용이 있어 제안드립니다.",
    status: "in-progress",
    createdAt: "2024-09-30T11:00:00",
    category: "other",
  },
];

interface RecentInquiriesProps {
  limit?: number;
}

const RecentInquiries = ({ limit = 5 }: RecentInquiriesProps) => {
  const navigate = useNavigate();
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const displayedInquiries = mockInquiries.slice(0, limit);

  const handleInquiryClick = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedInquiry(null);
  };

  const handleStatusChange = (inquiryId: string, newStatus: Inquiry['status']) => {
    console.log('문의 상태 변경:', inquiryId, newStatus);
    // TODO: 실제 API 호출
  };

  const handleReply = (inquiryId: string, reply: string) => {
    console.log('답변 전송:', inquiryId, reply);
    // TODO: 실제 API 호출
  };

  const getStatusBadge = (status: Inquiry["status"]) => {
    const styles = {
      pending: {
        bg: "var(--fotmob-yellow-bg)",
        color: "var(--fotmob-yellow)",
        icon: <Clock size={14} />,
        text: "대기중",
      },
      "in-progress": {
        bg: "var(--fotmob-blue-bg)",
        color: "var(--fotmob-blue)",
        icon: <AlertCircle size={14} />,
        text: "처리중",
      },
      resolved: {
        bg: "var(--fotmob-green-bg)",
        color: "var(--fotmob-green)",
        icon: <CheckCircle size={14} />,
        text: "완료",
      },
    };

    const style = styles[status];

    return (
      <span
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          padding: "4px 10px",
          borderRadius: "12px",
          fontSize: "12px",
          fontWeight: 500,
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
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 60) return `${diffMins}분 전`;
    if (diffHours < 24) return `${diffHours}시간 전`;
    if (diffDays < 7) return `${diffDays}일 전`;
    return date.toLocaleDateString("ko-KR");
  };

  return (
    <div style={{ marginTop: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h3 style={{ fontSize: "18px", fontWeight: 600 }}>
          <MessageCircle size={20} style={{ display: "inline", marginRight: "8px", verticalAlign: "middle" }} />
          최근 문의 내역
        </h3>
        <span style={{ fontSize: "13px", color: "var(--admin-text-secondary)" }}>
          총 {mockInquiries.length}건
        </span>
      </div>

      <div style={{ display: "grid", gap: "12px" }}>
        {displayedInquiries.map((inquiry) => (
          <div
            key={inquiry.id}
            onClick={() => handleInquiryClick(inquiry)}
            style={{
              background: "var(--admin-bg-secondary)",
              border: "1px solid var(--admin-border)",
              borderRadius: "12px",
              padding: "16px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--fotmob-blue)";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "var(--admin-border)";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500 }}>{inquiry.userName}</span>
                  <span style={{ fontSize: "11px", color: "var(--admin-text-secondary)" }}>
                    {inquiry.userEmail}
                  </span>
                </div>
                <h4 style={{ fontSize: "14px", fontWeight: 600, marginBottom: "6px" }}>
                  {inquiry.subject}
                </h4>
                <p style={{
                  fontSize: "13px",
                  color: "var(--admin-text-secondary)",
                  marginBottom: "8px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}>
                  {inquiry.message}
                </p>
              </div>
              {getStatusBadge(inquiry.status)}
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontSize: "11px",
                  padding: "2px 8px",
                  background: "var(--admin-bg-tertiary)",
                  borderRadius: "6px",
                  color: "var(--admin-text-secondary)",
                }}
              >
                {getCategoryLabel(inquiry.category)}
              </span>
              <span style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>
                <Clock size={12} style={{ display: "inline", marginRight: "4px", verticalAlign: "middle" }} />
                {formatDate(inquiry.createdAt)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {mockInquiries.length > limit && (
        <button
          className="btn-fotmob btn-secondary"
          style={{ width: "100%", marginTop: "12px" }}
          onClick={() => navigate('/admin/users')}
        >
          전체 문의 보기 ({mockInquiries.length}건)
        </button>
      )}

      <InquiryDetailModal
        inquiry={selectedInquiry}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onStatusChange={handleStatusChange}
        onReply={handleReply}
      />
    </div>
  );
};

export default RecentInquiries;
