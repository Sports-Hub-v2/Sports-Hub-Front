import { useState, type ReactNode } from "react";
import { NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";

import { adminNavLinks } from "../config/navigation";
import type { AdminPageId } from "../types";
import "../styles/admin.css";

interface AdminLayoutProps {
  activePage: AdminPageId;
  children: ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ activePage, children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pageMeta = adminNavLinks.find((item) => item.id === activePage) ?? adminNavLinks[0];

  return (
    <div className="admin-layout-fotmob">
      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div 
          className="mobile-overlay"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar-fotmob ${sidebarOpen ? "" : "collapsed"} ${mobileMenuOpen ? "mobile-open" : ""}`}>
        <div className="sidebar-header-fotmob">
          <div className="sidebar-logo">
            <div className="logo-icon">SH</div>
            {sidebarOpen && <span className="logo-text">Sports Hub</span>}
          </div>
          <button
            type="button"
            className="sidebar-toggle desktop-only"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-label={sidebarOpen ? "사이드바 접기" : "사이드바 열기"}
          >
            <Menu size={20} />
          </button>
          <button
            type="button"
            className="sidebar-toggle mobile-only"
            onClick={() => setMobileMenuOpen(false)}
            aria-label="메뉴 닫기"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="sidebar-nav-fotmob">
          {adminNavLinks.map((link) => {
            const Icon = link.icon;
            return (
              <NavLink
                key={link.id}
                to={link.path}
                className={({ isActive }) => `nav-item-fotmob ${isActive ? "active" : ""}`}
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="nav-item-content">
                  <Icon size={20} className="nav-icon" />
                  {sidebarOpen && (
                    <>
                      <span className="nav-label">{link.label}</span>
                      {link.badge && (
                        <span className={`nav-badge badge-${link.badge.tone}`}>
                          {link.badge.label}
                        </span>
                      )}
                    </>
                  )}
                </div>
                {!sidebarOpen && link.badge && (
                  <span className="nav-badge-dot" />
                )}
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="admin-main-fotmob">
        <header className="admin-header-fotmob">
          <button
            type="button"
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="메뉴 열기"
          >
            <Menu size={24} />
          </button>
          <div className="header-content">
            <h1 className="page-title">{pageMeta.title}</h1>
            <p className="page-subtitle">{pageMeta.subtitle}</p>
          </div>
        </header>

        <div className="admin-content-fotmob">
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
