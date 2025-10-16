import { X, AlertCircle, User, Calendar, MessageSquare } from "lucide-react";

interface ReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: {
    id: string;
    type: string;
    target: string;
    severity: string;
    status: string;
    receivedAt: string;
    reporter?: string;
    description?: string;
    evidence?: string[];
  } | null;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ isOpen, onClose, report }) => {
  if (!isOpen || !report) return null;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "긴급":
        return "var(--admin-danger)";
      case "높음":
        return "var(--admin-warning)";
      case "보통":
        return "var(--admin-text-secondary)";
      default:
        return "var(--admin-success)";
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 0, 0, 0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: "var(--admin-bg-secondary)",
          borderRadius: "16px",
          border: "1px solid var(--admin-border)",
          width: "90%",
          maxWidth: "600px",
          maxHeight: "80vh",
          overflow: "auto",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px",
            borderBottom: "1px solid var(--admin-border)",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <h2 style={{ fontSize: "20px", fontWeight: "600", color: "var(--admin-text)", margin: "0 0 8px 0" }}>
              신고 상세 정보
            </h2>
            <p style={{ fontSize: "14px", color: "var(--admin-text-secondary)", margin: 0 }}>
              {report.id}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              background: "transparent",
              border: "none",
              color: "var(--admin-text-secondary)",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "8px",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--admin-bg-tertiary)";
              e.currentTarget.style.color = "var(--admin-text)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.color = "var(--admin-text-secondary)";
            }}
          >
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div style={{ padding: "24px" }}>
          {/* Basic Info */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "16px",
              marginBottom: "24px",
            }}
          >
            <div>
              <label style={{ fontSize: "12px", color: "var(--admin-text-secondary)", display: "block", marginBottom: "8px" }}>
                신고 유형
              </label>
              <div style={{ fontSize: "14px", color: "var(--admin-text)", fontWeight: "500" }}>
                {report.type}
              </div>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "var(--admin-text-secondary)", display: "block", marginBottom: "8px" }}>
                심각도
              </label>
              <span
                style={{
                  display: "inline-block",
                  padding: "4px 12px",
                  borderRadius: "6px",
                  fontSize: "12px",
                  fontWeight: "600",
                  background: `${getSeverityColor(report.severity)}20`,
                  color: getSeverityColor(report.severity),
                }}
              >
                {report.severity}
              </span>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "var(--admin-text-secondary)", display: "block", marginBottom: "8px" }}>
                <Calendar size={14} style={{ display: "inline", marginRight: "4px" }} />
                접수 시간
              </label>
              <div style={{ fontSize: "14px", color: "var(--admin-text)" }}>
                {report.receivedAt}
              </div>
            </div>
            <div>
              <label style={{ fontSize: "12px", color: "var(--admin-text-secondary)", display: "block", marginBottom: "8px" }}>
                처리 상태
              </label>
              <div style={{ fontSize: "14px", color: "var(--admin-text)", fontWeight: "500" }}>
                {report.status}
              </div>
            </div>
          </div>

          {/* Target */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "12px", color: "var(--admin-text-secondary)", display: "block", marginBottom: "8px" }}>
              신고 대상
            </label>
            <div
              style={{
                padding: "12px 16px",
                background: "var(--admin-bg-tertiary)",
                borderRadius: "8px",
                fontSize: "14px",
                color: "var(--admin-text)",
              }}
            >
              {report.target}
            </div>
          </div>

          {/* Reporter */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "12px", color: "var(--admin-text-secondary)", display: "block", marginBottom: "8px" }}>
              <User size={14} style={{ display: "inline", marginRight: "4px" }} />
              신고자
            </label>
            <div style={{ fontSize: "14px", color: "var(--admin-text)" }}>
              {report.reporter || "익명"}
            </div>
          </div>

          {/* Description */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontSize: "12px", color: "var(--admin-text-secondary)", display: "block", marginBottom: "8px" }}>
              <MessageSquare size={14} style={{ display: "inline", marginRight: "4px" }} />
              신고 내용
            </label>
            <div
              style={{
                padding: "16px",
                background: "var(--admin-bg-tertiary)",
                borderRadius: "8px",
                fontSize: "14px",
                color: "var(--admin-text)",
                lineHeight: "1.6",
                minHeight: "80px",
              }}
            >
              {report.description || "상세 내용이 없습니다."}
            </div>
          </div>

          {/* Evidence */}
          {report.evidence && report.evidence.length > 0 && (
            <div style={{ marginBottom: "24px" }}>
              <label style={{ fontSize: "12px", color: "var(--admin-text-secondary)", display: "block", marginBottom: "8px" }}>
                증거 자료
              </label>
              <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {report.evidence.map((item, index) => (
                  <div
                    key={index}
                    style={{
                      padding: "8px 12px",
                      background: "var(--admin-bg-tertiary)",
                      borderRadius: "6px",
                      fontSize: "13px",
                      color: "var(--admin-primary)",
                      cursor: "pointer",
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "20px 24px",
            borderTop: "1px solid var(--admin-border)",
            display: "flex",
            gap: "12px",
            justifyContent: "flex-end",
          }}
        >
          <button
            onClick={onClose}
            className="section-btn"
          >
            닫기
          </button>
          <button
            onClick={() => {
              console.log("신고 처리:", report.id);
              alert("신고 처리 기능은 백엔드 연결 후 구현됩니다.");
            }}
            className="section-btn primary"
          >
            처리하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
