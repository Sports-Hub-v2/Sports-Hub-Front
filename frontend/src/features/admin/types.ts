import type { LucideIcon } from "lucide-react";

export type AdminPageId =
  | "dashboard"
  | "matches"
  | "members"
  | "teams"
  | "content"
  | "reports"
  | "system"
  | "settings";

type NavTone = "default" | "info" | "warning" | "alert";

export interface AdminNavBadge {
  label: string;
  tone?: NavTone;
}

export interface AdminNavSection {
  type: "section";
  id: string;
  label: string;
}

export interface AdminNavLink {
  type: "link";
  id: AdminPageId;
  label: string;
  description: string;
  icon: LucideIcon;
  path: string;
  badge?: AdminNavBadge;
  title: string;
  subtitle: string;
}

export type AdminNavEntry = AdminNavSection | AdminNavLink;

export interface SidebarMetric {
  label: string;
  value: string;
  tone?: "neutral" | "warning" | "info";
}
