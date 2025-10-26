import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  X,
  AlertCircle,
  User,
  Calendar,
  MessageSquare,
  Shield,
  TrendingUp,
  Activity,
  AlertTriangle,
  Clock,
  Ban,
  XCircle,
  CheckCircle,
  ExternalLink
} from "lucide-react";

// 피신고자 프로필 인터페이스
interface ReportedUser {
  id: string;
  name: string;
  profileImage?: string;
  joinDate: string;
  matchCount: number;
  mannerScore: number;
  noShowCount: number;
  warningCount: number;
}

// 제재 이력 인터페이스
interface SanctionHistory {
  id: string;
  type: "경고" | "정지" | "영구정지";
  reason: string;
  startDate: string;
  endDate?: string;
  duration?: string;
  processor: string;
  reportId?: string; // 연결된 신고 ID
}

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
    reporterUserId?: string;
    description?: string;
    evidence?: string[];
    reportedUser?: ReportedUser;
    sanctionHistory?: SanctionHistory[];
  } | null;
}

const ReportDetailModal: React.FC<ReportDetailModalProps> = ({ isOpen, onClose, report }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"details" | "profile" | "history" | "action">("details");
  const [sanctionType, setSanctionType] = useState<"경고" | "정지" | "영구정지">("경고");
  const [sanctionDuration, setSanctionDuration] = useState<string>("7");
  const [sanctionReason, setSanctionReason] = useState<string>("");

  if (!isOpen || !report) return null;

  const handleUserClick = (userId: string) => {
    navigate(`/admin/users/${userId}`);
    onClose();
  };

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

  const getMannerScoreColor = (score: number) => {
    if (score >= 40) return "#10b981";
    if (score >= 30) return "#f59e0b";
    return "#ef4444";
  };

  const handleApplySanction = () => {
    const sanctionData = {
      reportId: report.id,
      userId: report.reportedUser?.id,
      type: sanctionType,
      duration: sanctionType === "정지" ? sanctionDuration : undefined,
      reason: sanctionReason,
      timestamp: new Date().toISOString()
    };

    console.log("제재 적용:", sanctionData);
    alert(`${sanctionType} 조치가 적용되었습니다.\n사유: ${sanctionReason}`);
    onClose();
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
          maxWidth: "900px",
          maxHeight: "85vh",
          overflow: "hidden",
          boxShadow: "0 20px 60px rgba(0, 0, 0, 0.5)",
          display: "flex",
          flexDirection: "column",
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
              {report.id} • {report.type}
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

        {/* Tabs */}
        <div style={{ borderBottom: "1px solid var(--admin-border)", display: "flex", padding: "0 24px" }}>
          {[
            { id: "details", label: "신고 내용", icon: MessageSquare },
            { id: "profile", label: "피신고자 정보", icon: User },
            { id: "history", label: "제재 이력", icon: Shield },
            { id: "action", label: "제재 조치", icon: AlertTriangle },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                style={{
                  padding: "12px 20px",
                  background: "transparent",
                  border: "none",
                  borderBottom: activeTab === tab.id ? "2px solid var(--admin-primary)" : "2px solid transparent",
                  color: activeTab === tab.id ? "var(--admin-primary)" : "var(--admin-text-secondary)",
                  cursor: "pointer",
                  fontSize: "14px",
                  fontWeight: "500",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                }}
              >
                <Icon size={16} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: "24px" }}>
          {/* 신고 내용 탭 */}
          {activeTab === "details" && (
            <div>
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
                {report.reporterUserId ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUserClick(report.reporterUserId!);
                    }}
                    style={{
                      background: "var(--admin-bg-tertiary)",
                      border: "1px solid var(--admin-primary)",
                      padding: "8px 12px",
                      fontSize: "14px",
                      color: "var(--admin-primary)",
                      cursor: "pointer",
                      borderRadius: "6px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      fontWeight: "500",
                      transition: "all 0.2s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "var(--admin-primary)";
                      e.currentTarget.style.color = "white";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "var(--admin-bg-tertiary)";
                      e.currentTarget.style.color = "var(--admin-primary)";
                    }}
                  >
                    {report.reporter || "익명"}
                    <ExternalLink size={14} />
                  </button>
                ) : (
                  <div style={{ fontSize: "14px", color: "var(--admin-text)" }}>
                    {report.reporter || "익명"}
                  </div>
                )}
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
                        📎 {item}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 피신고자 정보 탭 */}
          {activeTab === "profile" && report.reportedUser && (
            <div>
              {/* 프로필 카드 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserClick(report.reportedUser!.id);
                }}
                style={{
                  width: "100%",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: "12px",
                  padding: "24px",
                  marginBottom: "24px",
                  color: "white",
                  cursor: "pointer",
                  transition: "transform 0.2s",
                  border: "none",
                  textAlign: "left",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                  <div
                    style={{
                      width: "64px",
                      height: "64px",
                      borderRadius: "50%",
                      background: "rgba(255, 255, 255, 0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "24px",
                      fontWeight: "600",
                    }}
                  >
                    {report.reportedUser.profileImage ? (
                      <img src={report.reportedUser.profileImage} alt="" style={{ width: "100%", height: "100%", borderRadius: "50%" }} />
                    ) : (
                      report.reportedUser.name.charAt(0)
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <h3 style={{ fontSize: "20px", fontWeight: "600", margin: "0 0 4px 0" }}>
                        {report.reportedUser.name}
                      </h3>
                      <ExternalLink size={18} style={{ opacity: 0.8 }} />
                    </div>
                    <p style={{ fontSize: "14px", opacity: 0.9, margin: 0 }}>
                      ID: {report.reportedUser.id}
                    </p>
                  </div>
                </div>

                {/* 매너 온도 */}
                <div style={{ marginBottom: "12px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ fontSize: "13px", opacity: 0.9 }}>매너 온도</span>
                    <span style={{ fontSize: "16px", fontWeight: "600" }}>
                      {report.reportedUser.mannerScore}°C
                    </span>
                  </div>
                  <div style={{ height: "6px", background: "rgba(255, 255, 255, 0.2)", borderRadius: "3px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${(report.reportedUser.mannerScore / 50) * 100}%`,
                        height: "100%",
                        background: getMannerScoreColor(report.reportedUser.mannerScore),
                        borderRadius: "3px",
                        transition: "width 0.3s",
                      }}
                    />
                  </div>
                </div>
              </button>

              {/* 통계 정보 */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px", marginBottom: "24px" }}>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserClick(report.reportedUser!.id);
                  }}
                  style={{
                    padding: "16px",
                    background: "var(--admin-bg-tertiary)",
                    borderRadius: "12px",
                    border: "1px solid var(--admin-border)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--admin-primary)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--admin-border)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <Activity size={16} style={{ color: "var(--admin-primary)" }} />
                    <span style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>경기 참여</span>
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "600", color: "var(--admin-text)" }}>
                    {report.reportedUser.matchCount}회
                  </div>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserClick(report.reportedUser!.id);
                  }}
                  style={{
                    padding: "16px",
                    background: "var(--admin-bg-tertiary)",
                    borderRadius: "12px",
                    border: "1px solid var(--admin-border)",
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--admin-success)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--admin-border)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <Calendar size={16} style={{ color: "var(--admin-success)" }} />
                    <span style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>가입일</span>
                  </div>
                  <div style={{ fontSize: "16px", fontWeight: "600", color: "var(--admin-text)" }}>
                    {report.reportedUser.joinDate}
                  </div>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserClick(report.reportedUser!.id);
                  }}
                  style={{
                    padding: "16px",
                    background: report.reportedUser.noShowCount > 0 ? "rgba(239, 68, 68, 0.1)" : "var(--admin-bg-tertiary)",
                    borderRadius: "12px",
                    border: `1px solid ${report.reportedUser.noShowCount > 0 ? "var(--admin-danger)" : "var(--admin-border)"}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--admin-danger)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = report.reportedUser.noShowCount > 0 ? "var(--admin-danger)" : "var(--admin-border)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <XCircle size={16} style={{ color: "var(--admin-danger)" }} />
                    <span style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>노쇼 기록</span>
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "600", color: report.reportedUser.noShowCount > 0 ? "var(--admin-danger)" : "var(--admin-text)" }}>
                    {report.reportedUser.noShowCount}회
                  </div>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUserClick(report.reportedUser!.id);
                  }}
                  style={{
                    padding: "16px",
                    background: report.reportedUser.warningCount > 0 ? "rgba(245, 158, 11, 0.1)" : "var(--admin-bg-tertiary)",
                    borderRadius: "12px",
                    border: `1px solid ${report.reportedUser.warningCount > 0 ? "var(--admin-warning)" : "var(--admin-border)"}`,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    textAlign: "left",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "var(--admin-warning)";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = report.reportedUser.warningCount > 0 ? "var(--admin-warning)" : "var(--admin-border)";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
                    <AlertTriangle size={16} style={{ color: "var(--admin-warning)" }} />
                    <span style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>경고 누적</span>
                  </div>
                  <div style={{ fontSize: "24px", fontWeight: "600", color: report.reportedUser.warningCount > 0 ? "var(--admin-warning)" : "var(--admin-text)" }}>
                    {report.reportedUser.warningCount}회
                  </div>
                </button>
              </div>

              {/* 사용자 상세 보기 버튼 */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleUserClick(report.reportedUser!.id);
                }}
                style={{
                  width: "100%",
                  padding: "16px",
                  background: "linear-gradient(135deg, var(--admin-primary) 0%, #5b7ce8 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  transition: "all 0.2s",
                  boxShadow: "0 4px 12px rgba(59, 130, 246, 0.3)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = "0 6px 16px rgba(59, 130, 246, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 12px rgba(59, 130, 246, 0.3)";
                }}
              >
                <User size={18} />
                사용자 상세 정보 보기
                <ExternalLink size={16} />
              </button>
            </div>
          )}

          {/* 제재 이력 탭 */}
          {activeTab === "history" && (
            <div>
              {report.sanctionHistory && report.sanctionHistory.length > 0 ? (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {report.sanctionHistory.map((sanction, index) => (
                    <button
                      type="button"
                      key={sanction.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (sanction.reportId) {
                          // 해당 제재와 연결된 신고로 이동
                          alert(`신고 ${sanction.reportId}로 이동 (백엔드 연결 후 구현)`);
                        } else {
                          // 제재 상세 정보 표시
                          alert("제재 상세 정보 확인 (백엔드 연결 후 구현)");
                        }
                      }}
                      style={{
                        width: "100%",
                        padding: "16px",
                        background: "var(--admin-bg-tertiary)",
                        borderRadius: "12px",
                        border: `2px solid ${
                          sanction.type === "영구정지" ? "var(--admin-danger)" :
                          sanction.type === "정지" ? "var(--admin-warning)" :
                          "var(--admin-text-secondary)"
                        }`,
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.2s",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateX(4px)";
                        e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.1)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateX(0)";
                        e.currentTarget.style.boxShadow = "none";
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                          {sanction.type === "영구정지" && <Ban size={20} style={{ color: "var(--admin-danger)" }} />}
                          {sanction.type === "정지" && <Clock size={20} style={{ color: "var(--admin-warning)" }} />}
                          {sanction.type === "경고" && <AlertTriangle size={20} style={{ color: "var(--admin-text-secondary)" }} />}
                          <span
                            style={{
                              fontSize: "16px",
                              fontWeight: "600",
                              color: sanction.type === "영구정지" ? "var(--admin-danger)" :
                                     sanction.type === "정지" ? "var(--admin-warning)" :
                                     "var(--admin-text)",
                            }}
                          >
                            {sanction.type}
                          </span>
                        </div>
                        <span style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>
                          #{report.sanctionHistory.length - index}
                        </span>
                      </div>

                      <div style={{ marginBottom: "8px" }}>
                        <span style={{ fontSize: "13px", color: "var(--admin-text-secondary)" }}>사유:</span>
                        <p style={{ fontSize: "14px", color: "var(--admin-text)", margin: "4px 0 0 0" }}>
                          {sanction.reason}
                        </p>
                      </div>

                      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", fontSize: "13px" }}>
                        <div>
                          <span style={{ color: "var(--admin-text-secondary)" }}>처리일:</span>
                          <div style={{ color: "var(--admin-text)", fontWeight: "500" }}>{sanction.startDate}</div>
                        </div>
                        {sanction.duration && (
                          <div>
                            <span style={{ color: "var(--admin-text-secondary)" }}>기간:</span>
                            <div style={{ color: "var(--admin-text)", fontWeight: "500" }}>{sanction.duration}</div>
                          </div>
                        )}
                        {sanction.endDate && (
                          <div>
                            <span style={{ color: "var(--admin-text-secondary)" }}>종료일:</span>
                            <div style={{ color: "var(--admin-text)", fontWeight: "500" }}>{sanction.endDate}</div>
                          </div>
                        )}
                        <div>
                          <span style={{ color: "var(--admin-text-secondary)" }}>처리자:</span>
                          <div style={{ color: "var(--admin-text)", fontWeight: "500" }}>{sanction.processor}</div>
                        </div>
                      </div>
                      {sanction.reportId && (
                        <div style={{
                          marginTop: "12px",
                          paddingTop: "12px",
                          borderTop: "1px solid var(--admin-border)",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          fontSize: "12px",
                          color: "var(--admin-primary)",
                          fontWeight: "500"
                        }}>
                          <ExternalLink size={14} />
                          연결된 신고: {sanction.reportId}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <div
                  style={{
                    padding: "60px 20px",
                    textAlign: "center",
                    background: "var(--admin-bg-tertiary)",
                    borderRadius: "12px",
                  }}
                >
                  <CheckCircle size={48} style={{ color: "var(--admin-success)", margin: "0 auto 16px" }} />
                  <h3 style={{ fontSize: "16px", fontWeight: "600", color: "var(--admin-text)", margin: "0 0 8px 0" }}>
                    제재 이력 없음
                  </h3>
                  <p style={{ fontSize: "14px", color: "var(--admin-text-secondary)", margin: 0 }}>
                    이 사용자는 과거 제재를 받은 적이 없습니다.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* 제재 조치 탭 */}
          {activeTab === "action" && (
            <div>
              <div
                style={{
                  padding: "16px",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid var(--admin-danger)",
                  borderRadius: "12px",
                  marginBottom: "24px",
                }}
              >
                <div style={{ display: "flex", gap: "12px" }}>
                  <AlertTriangle size={20} style={{ color: "var(--admin-danger)", flexShrink: 0 }} />
                  <div>
                    <h4 style={{ fontSize: "14px", fontWeight: "600", color: "var(--admin-danger)", margin: "0 0 4px 0" }}>
                      제재 조치 안내
                    </h4>
                    <p style={{ fontSize: "13px", color: "var(--admin-text-secondary)", margin: 0, lineHeight: "1.5" }}>
                      제재 조치는 신중하게 결정되어야 합니다. 적용 후에는 취소가 어려우므로 사유와 증거를 충분히 검토해주세요.
                    </p>
                  </div>
                </div>
              </div>

              {/* 제재 유형 선택 */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--admin-text)", display: "block", marginBottom: "12px" }}>
                  제재 유형 *
                </label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
                  {[
                    { value: "경고", label: "경고", desc: "1회 경고 부여", icon: AlertTriangle, color: "var(--admin-text-secondary)" },
                    { value: "정지", label: "활동 정지", desc: "기간 제한", icon: Clock, color: "var(--admin-warning)" },
                    { value: "영구정지", label: "영구 정지", desc: "계정 영구 정지", icon: Ban, color: "var(--admin-danger)" },
                  ].map((option) => {
                    const Icon = option.icon;
                    return (
                      <button
                        key={option.value}
                        onClick={() => setSanctionType(option.value as any)}
                        style={{
                          padding: "16px",
                          background: sanctionType === option.value ? `${option.color}15` : "var(--admin-bg-tertiary)",
                          border: `2px solid ${sanctionType === option.value ? option.color : "var(--admin-border)"}`,
                          borderRadius: "12px",
                          cursor: "pointer",
                          transition: "all 0.2s",
                          textAlign: "left",
                        }}
                      >
                        <Icon
                          size={20}
                          style={{
                            color: sanctionType === option.value ? option.color : "var(--admin-text-secondary)",
                            marginBottom: "8px",
                          }}
                        />
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: "600",
                            color: sanctionType === option.value ? option.color : "var(--admin-text)",
                            marginBottom: "4px",
                          }}
                        >
                          {option.label}
                        </div>
                        <div style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>
                          {option.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 정지 기간 (정지 선택 시만 표시) */}
              {sanctionType === "정지" && (
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--admin-text)", display: "block", marginBottom: "12px" }}>
                    정지 기간 *
                  </label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "8px" }}>
                    {["3", "7", "14", "30"].map((days) => (
                      <button
                        key={days}
                        onClick={() => setSanctionDuration(days)}
                        style={{
                          padding: "12px",
                          background: sanctionDuration === days ? "var(--admin-primary)" : "var(--admin-bg-tertiary)",
                          color: sanctionDuration === days ? "white" : "var(--admin-text)",
                          border: `1px solid ${sanctionDuration === days ? "var(--admin-primary)" : "var(--admin-border)"}`,
                          borderRadius: "8px",
                          cursor: "pointer",
                          fontSize: "14px",
                          fontWeight: "500",
                          transition: "all 0.2s",
                        }}
                      >
                        {days}일
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={sanctionDuration}
                    onChange={(e) => setSanctionDuration(e.target.value)}
                    placeholder="직접 입력 (일 단위)"
                    style={{
                      width: "100%",
                      padding: "12px",
                      background: "var(--admin-bg-tertiary)",
                      border: "1px solid var(--admin-border)",
                      borderRadius: "8px",
                      fontSize: "14px",
                      color: "var(--admin-text)",
                      marginTop: "8px",
                    }}
                  />
                </div>
              )}

              {/* 제재 사유 */}
              <div style={{ marginBottom: "24px" }}>
                <label style={{ fontSize: "13px", fontWeight: "600", color: "var(--admin-text)", display: "block", marginBottom: "12px" }}>
                  제재 사유 *
                </label>
                <textarea
                  value={sanctionReason}
                  onChange={(e) => setSanctionReason(e.target.value)}
                  placeholder="제재 사유를 상세히 작성해주세요. 이 내용은 사용자에게 전달됩니다.&#10;&#10;예시:&#10;- 경기 중 상대방에게 욕설 및 폭언 사용&#10;- 여러 사용자의 신고 접수&#10;- 커뮤니티 가이드라인 위반"
                  style={{
                    width: "100%",
                    minHeight: "120px",
                    padding: "12px",
                    background: "var(--admin-bg-tertiary)",
                    border: "1px solid var(--admin-border)",
                    borderRadius: "8px",
                    fontSize: "14px",
                    color: "var(--admin-text)",
                    lineHeight: "1.6",
                    resize: "vertical",
                    fontFamily: "inherit",
                  }}
                />
                <div style={{ fontSize: "12px", color: "var(--admin-text-secondary)", marginTop: "8px" }}>
                  {sanctionReason.length} / 500자
                </div>
              </div>

              {/* 적용 버튼 */}
              <button
                onClick={handleApplySanction}
                disabled={!sanctionReason.trim()}
                style={{
                  width: "100%",
                  padding: "14px",
                  background: sanctionReason.trim() ? "var(--admin-danger)" : "var(--admin-bg-tertiary)",
                  color: sanctionReason.trim() ? "white" : "var(--admin-text-secondary)",
                  border: "none",
                  borderRadius: "8px",
                  fontSize: "15px",
                  fontWeight: "600",
                  cursor: sanctionReason.trim() ? "pointer" : "not-allowed",
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (sanctionReason.trim()) {
                    e.currentTarget.style.background = "#dc2626";
                  }
                }}
                onMouseLeave={(e) => {
                  if (sanctionReason.trim()) {
                    e.currentTarget.style.background = "var(--admin-danger)";
                  }
                }}
              >
                제재 적용하기
              </button>
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
          {activeTab !== "action" && (
            <button
              onClick={() => setActiveTab("action")}
              className="section-btn primary"
            >
              <AlertTriangle size={16} style={{ marginRight: "6px" }} />
              제재 조치
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportDetailModal;
