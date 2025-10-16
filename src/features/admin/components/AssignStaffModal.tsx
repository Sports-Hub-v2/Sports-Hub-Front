import { useState } from "react";
import { X, Users, Search } from "lucide-react";

interface AssignStaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAssign: (staffName: string, reportIds: string[]) => void;
  selectedReports?: string[];
}

const mockStaff = [
  { id: "1", name: "김지원", role: "신고 처리 담당", available: true, current: 3 },
  { id: "2", name: "박민서", role: "신고 처리 담당", available: true, current: 5 },
  { id: "3", name: "손예린", role: "신고 처리 담당", available: true, current: 2 },
  { id: "4", name: "이준호", role: "시니어 담당", available: false, current: 8 },
  { id: "5", name: "정서연", role: "신고 처리 담당", available: true, current: 4 },
];

const AssignStaffModal: React.FC<AssignStaffModalProps> = ({
  isOpen,
  onClose,
  onAssign,
  selectedReports = []
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStaff, setSelectedStaff] = useState<string>("");

  if (!isOpen) return null;

  const filteredStaff = mockStaff.filter(staff =>
    staff.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    staff.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAssign = () => {
    if (!selectedStaff) {
      alert("담당자를 선택해주세요.");
      return;
    }

    const staff = mockStaff.find(s => s.id === selectedStaff);
    if (staff) {
      onAssign(staff.name, selectedReports);
      onClose();
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
          maxWidth: "500px",
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
              담당자 배정
            </h2>
            <p style={{ fontSize: "14px", color: "var(--admin-text-secondary)", margin: 0 }}>
              {selectedReports.length > 0
                ? `${selectedReports.length}건의 신고에 담당자를 배정합니다.`
                : "담당자를 선택해주세요."}
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

        {/* Search */}
        <div style={{ padding: "20px 24px 0" }}>
          <div
            style={{
              position: "relative",
              marginBottom: "20px",
            }}
          >
            <Search
              size={18}
              style={{
                position: "absolute",
                left: "12px",
                top: "50%",
                transform: "translateY(-50%)",
                color: "var(--admin-text-secondary)",
              }}
            />
            <input
              type="text"
              placeholder="담당자 검색..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                width: "100%",
                padding: "10px 12px 10px 40px",
                background: "var(--admin-bg-tertiary)",
                border: "1px solid var(--admin-border)",
                borderRadius: "8px",
                color: "var(--admin-text)",
                fontSize: "14px",
                outline: "none",
              }}
            />
          </div>
        </div>

        {/* Staff List */}
        <div style={{ padding: "0 24px 24px", maxHeight: "400px", overflow: "auto" }}>
          {filteredStaff.length === 0 ? (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "var(--admin-text-secondary)",
                fontSize: "14px",
              }}
            >
              검색 결과가 없습니다.
            </div>
          ) : (
            filteredStaff.map((staff) => (
              <div
                key={staff.id}
                onClick={() => staff.available && setSelectedStaff(staff.id)}
                style={{
                  padding: "16px",
                  background: selectedStaff === staff.id
                    ? "var(--admin-bg-tertiary)"
                    : "transparent",
                  border: `1px solid ${selectedStaff === staff.id
                    ? "var(--admin-primary)"
                    : "var(--admin-border)"}`,
                  borderRadius: "8px",
                  marginBottom: "8px",
                  cursor: staff.available ? "pointer" : "not-allowed",
                  opacity: staff.available ? 1 : 0.5,
                  transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  if (staff.available) {
                    e.currentTarget.style.borderColor = "var(--admin-primary)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (staff.available && selectedStaff !== staff.id) {
                    e.currentTarget.style.borderColor = "var(--admin-border)";
                  }
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "15px", fontWeight: "600", color: "var(--admin-text)", marginBottom: "4px" }}>
                      {staff.name}
                    </div>
                    <div style={{ fontSize: "13px", color: "var(--admin-text-secondary)" }}>
                      {staff.role}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div
                      style={{
                        fontSize: "12px",
                        padding: "4px 8px",
                        borderRadius: "6px",
                        background: staff.available
                          ? "rgba(0, 220, 100, 0.2)"
                          : "rgba(255, 59, 48, 0.2)",
                        color: staff.available
                          ? "var(--admin-success)"
                          : "var(--admin-danger)",
                        marginBottom: "4px",
                      }}
                    >
                      {staff.available ? "활동 중" : "부재 중"}
                    </div>
                    <div style={{ fontSize: "12px", color: "var(--admin-text-secondary)" }}>
                      현재 {staff.current}건 처리 중
                    </div>
                  </div>
                </div>
              </div>
            ))
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
          <button onClick={onClose} className="section-btn">
            취소
          </button>
          <button
            onClick={handleAssign}
            className="section-btn primary"
            disabled={!selectedStaff}
            style={{
              opacity: selectedStaff ? 1 : 0.5,
              cursor: selectedStaff ? "pointer" : "not-allowed",
            }}
          >
            배정하기
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignStaffModal;
