import { useMemo, useState, type MouseEvent } from "react";
import type { LucideIcon } from "lucide-react";
import {
  LayoutDashboard,
  Users,
  ClipboardList,
  Users2,
  ClipboardCheck,
  Megaphone,
  ShieldCheck,
  ServerCog,
  BarChart3,
} from "lucide-react";
import "../styles/admin.css";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

interface AdminNavItem {
  id: string;
  label: string;
  description: string;
  icon: LucideIcon;
  badge?: string;
  status?: "ready" | "planned";
}

const defaultNavItems: AdminNavItem[] = [
  {
    id: "dashboard",
    label: "운영 대시보드",
    description: "핵심 지표와 오늘의 운영 현황",
    icon: LayoutDashboard,
    badge: "v1",
    status: "ready",
  },
  {
    id: "users",
    label: "회원 관리",
    description: "회원 현황, 권한, 활동 로그",
    icon: Users,
    badge: "주요",
    status: "ready",
  },
  {
    id: "applications",
    label: "가입 · 매칭 신청",
    description: "지원서 검토와 처리 프로세스",
    icon: ClipboardList,
    badge: "핵심",
    status: "ready",
  },
  {
    id: "posts",
    label: "모집글 관리",
    description: "콘텐츠 모니터링과 품질 관리",
    icon: ClipboardCheck,
    status: "ready",
  },
  {
    id: "teams",
    label: "팀 관리",
    description: "팀 등록, 활동 현황, 멤버 구성",
    icon: Users2,
    status: "ready",
  },
  {
    id: "notifications",
    label: "알림 센터",
    description: "시스템 · 운영 알림 모니터링",
    icon: Megaphone,
    status: "ready",
  },
  {
    id: "reports",
    label: "신고 처리",
    description: "신고 접수와 조치 이력",
    icon: ShieldCheck,
    status: "planned",
  },
  {
    id: "system",
    label: "시스템 모니터링",
    description: "서비스 가용성과 성능 지표",
    icon: ServerCog,
    status: "planned",
  },
  {
    id: "analytics",
    label: "지표 분석",
    description: "운영 리포트와 추세 분석",
    icon: BarChart3,
    status: "planned",
  },
];

const AdminLayout: React.FC<AdminLayoutProps> = ({
  children,
  title = "운영 관리자 콘솔",
  subtitle = "서비스 상태와 주요 데이터를 한눈에 조망합니다.",
}) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const menuItems = useMemo(() => defaultNavItems, []);
  const [activeItem, setActiveItem] = useState(menuItems[0]?.id ?? "dashboard");

  const handleNavigate = (item: AdminNavItem) => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    setActiveItem(item.id);

    const target = document.getElementById(item.id);
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const toggleLabel = sidebarCollapsed ? "열기" : "접기";

  return (
    <div className="admin-layout">
      <aside className={`admin-sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="sidebar-header">
          <div className="sidebar-title">{sidebarCollapsed ? "SH" : "SportsHub Admin"}</div>
          <button
            type="button"
            className="sidebar-toggle"
            aria-label="사이드바 접기"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          >
            {toggleLabel}
          </button>
        </div>

        <nav className="sidebar-nav">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeItem === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                className={`nav-item ${isActive ? "active" : ""}`}
                onClick={handleNavigate(item)}
              >
                <span className="nav-icon" aria-hidden>
                  <Icon size={18} />
                </span>
                {!sidebarCollapsed && (
                  <span className="nav-meta">
                    <span className="nav-label">{item.label}</span>
                    <span className="nav-description">{item.description}</span>
                    {item.badge && (
                      <span className={`nav-badge nav-badge-${item.status ?? "ready"}`}>{item.badge}</span>
                    )}
                  </span>
                )}
              </a>
            );
          })}
        </nav>
      </aside>

      <main className="admin-main">
        <header className="admin-header">
          <div className="header-left">
            <p className="header-eyebrow">Sports Hub Operation Center</p>
            <h1 className="header-title">{title}</h1>
            <p className="header-subtitle">{subtitle}</p>
          </div>
          <div className="header-right">
            <div className="header-status">
              <span className="status-dot status-online" aria-hidden />
              <span>서비스 정상 운영 중</span>
            </div>
            <button type="button" className="notification-btn">
              오늘의 알림 4건
            </button>
          </div>
        </header>

        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
};

export default AdminLayout;
