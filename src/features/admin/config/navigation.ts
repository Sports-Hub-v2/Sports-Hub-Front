import {
  LayoutGrid,
  Calendar,
  Users,
  Shield,
  Trophy,
  FileText,
  Settings,
  BarChart3,
} from "lucide-react";

import type { AdminNavEntry, AdminNavLink, SidebarMetric } from "../types";

export const adminNavEntries: AdminNavEntry[] = [
  {
    type: "link",
    id: "dashboard",
    label: "대시보드",
    description: "전체 현황",
    icon: LayoutGrid,
    path: "/admin",
    title: "대시보드",
    subtitle: "오늘의 주요 지표와 실시간 현황을 확인합니다",
  },
  {
    type: "link", 
    id: "users",
    label: "사용자",
    description: "회원 관리",
    icon: Users,
    path: "/admin/users",
    badge: { label: "128", tone: "info" },
    title: "사용자 관리",
    subtitle: "회원 정보와 활동 내역을 관리합니다",
  },
  {
    type: "link",
    id: "teams", 
    label: "팀",
    description: "팀 관리",
    icon: Shield,
    path: "/admin/teams",
    badge: { label: "94", tone: "success" },
    title: "팀 관리",
    subtitle: "등록된 팀과 매치 현황을 관리합니다",
  },
  {
    type: "link",
    id: "matches",
    label: "경기",
    description: "일정 관리",
    icon: Calendar,
    path: "/admin/matches",
    badge: { label: "6", tone: "alert" },
    title: "경기 관리",
    subtitle: "오늘의 경기와 전체 일정을 확인합니다",
  },
  {
    type: "link",
    id: "reports",
    label: "신고 관리",
    description: "신고 처리",
    icon: Shield,
    path: "/admin/reports",
    title: "신고 관리",
    subtitle: "회원 신고 및 제재 사항을 관리합니다",
  },
  {
    type: "link",
    id: "contents",
    label: "콘텐츠",
    description: "게시물 관리",
    icon: FileText,
    path: "/admin/contents",
    badge: { label: "3", tone: "warning" },
    title: "콘텐츠 관리",
    subtitle: "공지사항과 게시물을 관리합니다",
  },
  {
    type: "link",
    id: "settings",
    label: "설정",
    description: "시스템 설정",
    icon: Settings,
    path: "/admin/settings",
    title: "설정",
    subtitle: "시스템 설정과 관리자 권한을 관리합니다",
  },
];

export const adminNavLinks: AdminNavLink[] = adminNavEntries.filter(
  (entry): entry is AdminNavLink => entry.type === "link",
);

export const sidebarMetrics: SidebarMetric[] = [
  { label: "오늘 경기", value: "6" },
  { label: "활성 사용자", value: "3.8K" },
  { label: "신규 가입", value: "+128", tone: "success" },
];
