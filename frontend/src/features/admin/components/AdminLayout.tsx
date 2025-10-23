import { useMemo, useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";

import { adminNavEntries, adminNavLinks, sidebarMetrics } from "../config/navigation";
import AdminFiltersContext, {
  type AdminFiltersContextValue,
  type AdminPeriodFilter,
} from "../context/AdminFiltersContext";
import type { AdminPageId } from "../types";
import "../styles/admin.css";

interface AdminLayoutProps {
  activePage: AdminPageId;
  children: ReactNode;
}

const periodLabels: Record<AdminPeriodFilter, string> = {
  today: "오늘",
  "7d": "7일",
  "30d": "30일",
};

const regionOptions = ["전체", "수도권", "영남", "호남", "충청", "강원"];
const leagueOptions = ["전체", "아마추어", "클럽", "기업"];

const AdminLayout: React.FC<AdminLayoutProps> = ({ activePage, children }) => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [period, setPeriod] = useState<AdminPeriodFilter>("today");
  const [region, setRegion] = useState<string>("전체");
  const [league, setLeague] = useState<string>("아마추어");

  const filters: AdminFiltersContextValue = useMemo(
    () => ({ period, setPeriod, region, setRegion, league, setLeague }),
    [period, region, league],
  );

  const pageMeta = adminNavLinks.find((item) => item.id === activePage) ?? adminNavLinks[0];

  return (
    <AdminFiltersContext.Provider value={filters}>
      <div className="admin-layout">
        <aside className={`admin-sidebar${sidebarCollapsed ? " collapsed" : ""}`}>
          <div className="sidebar-header">
            <div className="sidebar-title">{sidebarCollapsed ? "SH" : "SportsHub Admin"}</div>
            <button
              type="button"
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed((prev) => !prev)}
            >
              {sidebarCollapsed ? "열기" : "접기"}
            </button>
          </div>

          {!sidebarCollapsed && (
            <div className="sidebar-status">
              {sidebarMetrics.map((metric) => (
                <div key={metric.label} className="sidebar-kpi">
                  <span className="kpi-label">{metric.label}</span>
                  <span className={`kpi-value${metric.tone ? ` ${metric.tone}` : ""}`}>{metric.value}</span>
                </div>
              ))}
            </div>
          )}

          <nav className="sidebar-nav">
            {adminNavEntries.map((entry) => {
              if (entry.type === "section") {
                return (
                  <div key={entry.id} className="nav-section">
                    {sidebarCollapsed ? (
                      <span className="nav-section-collapsed" title={entry.label}>
                        •
                      </span>
                    ) : (
                      <span>{entry.label}</span>
                    )}
                  </div>
                );
              }

              const Icon = entry.icon;
              return (
                <NavLink
                  key={entry.id}
                  to={entry.path}
                  end={entry.id === "dashboard"}
                  className={({ isActive }) => `nav-item${isActive ? " active" : ""}`}
                  aria-label={sidebarCollapsed ? entry.label : undefined}
                >
                  <span className="nav-icon">
                    <Icon size={18} />
                  </span>
                  {!sidebarCollapsed && (
                    <span className="nav-meta">
                      <span className="nav-label-row">
                        <span className="nav-label">{entry.label}</span>
                        {entry.badge && (
                          <span className={`nav-badge nav-badge-${entry.badge.tone ?? "default"}`}>
                            {entry.badge.label}
                          </span>
                        )}
                      </span>
                      <span className="nav-description">{entry.description}</span>
                    </span>
                  )}
                  {sidebarCollapsed && entry.badge && (
                    <span className={`nav-badge nav-badge-compact nav-badge-${entry.badge.tone ?? "default"}`}>
                      {entry.badge.label}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </aside>

        <main className="admin-main">
          <header className="admin-header">
            <div className="header-left">
              <p className="header-eyebrow">SportsHub Operation Center</p>
              <h1 className="header-title">{pageMeta.title}</h1>
              <p className="header-subtitle">{pageMeta.subtitle}</p>
            </div>
            <div className="header-filters">
              <div className="filter-group period">
                <span className="filter-label">조회 기간</span>
                <div className="chip-group">
                  {(Object.keys(periodLabels) as AdminPeriodFilter[]).map((key) => (
                    <button
                      key={key}
                      type="button"
                      className={`chip${period === key ? " chip-active" : ""}`}
                      onClick={() => setPeriod(key)}
                    >
                      {periodLabels[key]}
                    </button>
                  ))}
                </div>
              </div>
              <div className="filter-divider" />
              <div className="filter-group">
                <label className="filter-label" htmlFor="admin-region-filter">
                  지역
                </label>
                <select
                  id="admin-region-filter"
                  className="filter-select"
                  value={region}
                  onChange={(event) => setRegion(event.target.value)}
                >
                  {regionOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
              <div className="filter-group">
                <label className="filter-label" htmlFor="admin-league-filter">
                  리그
                </label>
                <select
                  id="admin-league-filter"
                  className="filter-select"
                  value={league}
                  onChange={(event) => setLeague(event.target.value)}
                >
                  {leagueOptions.map((option) => (
                    <option key={option}>{option}</option>
                  ))}
                </select>
              </div>
            </div>
          </header>

          <div className="admin-content">{children}</div>
        </main>
      </div>
    </AdminFiltersContext.Provider>
  );
};

export default AdminLayout;
