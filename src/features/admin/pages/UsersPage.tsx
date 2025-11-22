import { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Search, Filter, MoreVertical, Mail, Phone, Calendar, MapPin, Activity, Shield, TrendingUp, TrendingDown, Edit, Trash2, Eye, Ban, MessageSquare, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import RecentInquiries from "../components/RecentInquiries";
import { fetchUsersApi } from "../api/adminApi";

interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  profileImage?: string;
  joinDate: string;
  lastActive: string;
  location: string;
  status: "active" | "inactive" | "suspended";
  role: "player" | "captain" | "referee";
  stats: {
    matchesPlayed: number;
    winRate: number;
    attendance: number;
    rating: number;
  };
  teams: string[];
}

const mockUsers: User[] = [
  {
    id: "1",
    name: "김민수",
    email: "minsu.kim@example.com",
    phone: "010-1234-5678",
    joinDate: "2024-01-15",
    lastActive: "2시간 전",
    location: "서울 강남구",
    status: "active",
    role: "captain",
    stats: {
      matchesPlayed: 48,
      winRate: 65,
      attendance: 92,
      rating: 4.8,
    },
    teams: ["새벽FC", "강남 유나이티드"],
  },
  {
    id: "2",
    name: "이지은",
    email: "jieun.lee@example.com",
    phone: "010-9876-5432",
    joinDate: "2024-02-20",
    lastActive: "1일 전",
    location: "서울 마포구",
    status: "active",
    role: "player",
    stats: {
      matchesPlayed: 32,
      winRate: 58,
      attendance: 88,
      rating: 4.6,
    },
    teams: ["홍대 킥오프"],
  },
  {
    id: "3",
    name: "박준호",
    email: "junho.park@example.com",
    phone: "010-5555-1234",
    joinDate: "2023-11-10",
    lastActive: "5일 전",
    location: "경기 성남시",
    status: "inactive",
    role: "player",
    stats: {
      matchesPlayed: 15,
      winRate: 47,
      attendance: 73,
      rating: 4.2,
    },
    teams: ["판교 스타즈"],
  },
  {
    id: "4",
    name: "최서연",
    email: "seoyeon.choi@example.com",
    phone: "010-3333-7777",
    joinDate: "2024-03-01",
    lastActive: "방금 전",
    location: "서울 송파구",
    status: "active",
    role: "referee",
    stats: {
      matchesPlayed: 25,
      winRate: 0,
      attendance: 96,
      rating: 4.9,
    },
    teams: [],
  },
  {
    id: "5",
    name: "정현우",
    email: "hyunwoo.jung@example.com",
    phone: "010-2222-8888",
    joinDate: "2024-01-25",
    lastActive: "3주 전",
    location: "인천 연수구",
    status: "suspended",
    role: "player",
    stats: {
      matchesPlayed: 20,
      winRate: 35,
      attendance: 65,
      rating: 3.8,
    },
    teams: ["인천 유나이티드"],
  },
  {
    id: "6",
    name: "신예진",
    email: "yejin.shin@example.com",
    phone: "010-4444-5555",
    joinDate: new Date().toISOString().split('T')[0],
    lastActive: "30분 전",
    location: "서울 강남구",
    status: "active",
    role: "player",
    stats: {
      matchesPlayed: 0,
      winRate: 0,
      attendance: 0,
      rating: 0,
    },
    teams: [],
  },
  {
    id: "7",
    name: "한승우",
    email: "seungwoo.han@example.com",
    phone: "010-6666-7777",
    joinDate: new Date().toISOString().split('T')[0],
    lastActive: "방금 전",
    location: "서울 서초구",
    status: "active",
    role: "player",
    stats: {
      matchesPlayed: 0,
      winRate: 0,
      attendance: 0,
      rating: 0,
    },
    teams: [],
  },
  {
    id: "8",
    name: "오민지",
    email: "minji.oh@example.com",
    phone: "010-8888-9999",
    joinDate: "2024-03-15",
    lastActive: "3시간 전",
    location: "서울 마포구",
    status: "active",
    role: "player",
    stats: {
      matchesPlayed: 5,
      winRate: 60,
      attendance: 75,
      rating: 4.3,
    },
    teams: [],
  },
];

const UsersPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const filterState = location.state as { filter?: string; date?: string; description?: string } | null;
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive" | "suspended">("all");
  const [selectedRole, setSelectedRole] = useState<"all" | "player" | "captain" | "referee">("all");
  const [selectedLocation, setSelectedLocation] = useState<string>("all");
  const [joinDateFilter, setJoinDateFilter] = useState<"all" | "today" | "yesterday" | "week" | "month" | "quarter" | "year">("all");
  const [activityFilter, setActivityFilter] = useState<"all" | "today" | "recent" | "week" | "inactive">("all");
  const [matchesFilter, setMatchesFilter] = useState<"all" | "none" | "beginner" | "intermediate" | "veteran">("all");
  const [attendanceFilter, setAttendanceFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [teamFilter, setTeamFilter] = useState<"all" | "has-team" | "no-team">("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Quick filter preset
  const [quickFilter, setQuickFilter] = useState<string | null>(null);

  // Backend data state
  const [backendUsers, setBackendUsers] = useState<any[]>([]);
  const [isLoadingBackend, setIsLoadingBackend] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [useBackendData, setUseBackendData] = useState(false); // 토글 상태

  // Fetch backend users on mount
  useEffect(() => {
    const loadBackendUsers = async () => {
      setIsLoadingBackend(true);
      setBackendError(null);
      try {
        const data = await fetchUsersApi(0, 100);
        console.log('Backend users data:', data);

        // 백엔드 Profile 데이터를 프론트엔드 User 형식으로 매핑
        const mappedUsers = (data.content || data || []).map((profile: any) => ({
          id: profile.id?.toString() || '',
          name: profile.name || '',
          email: profile.email || profile.account?.email || '',
          phone: profile.phoneNumber || profile.phone || '',
          phoneNumber: profile.phoneNumber || profile.phone || '',
          profileImage: profile.profileImageUrl || profile.profileImage,
          joinDate: profile.createdAt || profile.joinDate || new Date().toISOString(),
          lastActive: profile.lastActiveAt ? calculateTimeAgo(profile.lastActiveAt) : '알 수 없음',
          location: profile.region && profile.subRegion
            ? `${profile.region} ${profile.subRegion}`
            : profile.region || profile.location || '',
          region: profile.region || '',
          status: (profile.status || profile.accountStatus || 'ACTIVE').toLowerCase() as "active" | "inactive" | "suspended",
          role: profile.role || 'player', // 기본값: player
          stats: {
            matchesPlayed: profile.totalMatchesPlayed || profile.stats?.matchesPlayed || 0,
            winRate: profile.winRate || profile.stats?.winRate || 0,
            attendance: profile.attendanceRate || profile.stats?.attendance || 0,
            rating: profile.mannerTemperature ? Number((profile.mannerTemperature / 20).toFixed(1)) :
                    profile.stats?.rating || 0,
          },
          teams: profile.teams || [],
        }));

        setBackendUsers(mappedUsers);
        // 백엔드 데이터를 성공적으로 가져오면 자동으로 백엔드 데이터 모드로 전환
        if (mappedUsers.length > 0) {
          setUseBackendData(true);
        }
      } catch (error) {
        console.error('Failed to fetch backend users:', error);
        setBackendError(error instanceof Error ? error.message : 'Failed to fetch users');
      } finally {
        setIsLoadingBackend(false);
      }
    };

    // 시간 차이 계산 헬퍼 함수
    const calculateTimeAgo = (lastActiveAt: string) => {
      const now = new Date();
      const lastActive = new Date(lastActiveAt);
      const diffMs = now.getTime() - lastActive.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffMins < 1) return '방금 전';
      if (diffMins < 60) return `${diffMins}분 전`;
      if (diffHours < 24) return `${diffHours}시간 전`;
      return `${diffDays}일 전`;
    };

    loadBackendUsers();
  }, []);

  // 데이터 소스 선택: 토글 상태에 따라 백엔드 데이터 또는 목업 데이터 사용
  const sourceUsers = useBackendData && backendUsers.length > 0 ? backendUsers : mockUsers;

  const filteredUsers = sourceUsers.filter((user) => {
    const matchesSearch = user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone?.includes(searchTerm) ||
                         user.phoneNumber?.includes(searchTerm);
    const matchesStatus = selectedStatus === "all" || user.status === selectedStatus;
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    const matchesLocation = selectedLocation === "all" ||
                           user.location?.includes(selectedLocation) ||
                           user.region?.includes(selectedLocation);

    // Join date filter
    let matchesJoinDate = true;
    if (joinDateFilter !== "all") {
      const joinDate = new Date(user.joinDate);
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const diffTime = Math.abs(now.getTime() - joinDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (joinDateFilter === "today" && joinDate < today) matchesJoinDate = false;
      if (joinDateFilter === "yesterday" && (joinDate < yesterday || joinDate >= today)) matchesJoinDate = false;
      if (joinDateFilter === "week" && diffDays > 7) matchesJoinDate = false;
      if (joinDateFilter === "month" && diffDays > 30) matchesJoinDate = false;
      if (joinDateFilter === "quarter" && diffDays > 90) matchesJoinDate = false;
      if (joinDateFilter === "year" && diffDays > 365) matchesJoinDate = false;
    }

    // Activity filter
    let matchesActivity = true;
    if (activityFilter !== "all") {
      if (activityFilter === "today" && !user.lastActive.includes("전") && !user.lastActive.includes("방금")) matchesActivity = false;
      if (activityFilter === "recent" && !user.lastActive.includes("시간") && !user.lastActive.includes("분") && !user.lastActive.includes("방금")) matchesActivity = false;
      if (activityFilter === "week" && user.lastActive.includes("주") && parseInt(user.lastActive) > 1) matchesActivity = false;
      if (activityFilter === "inactive" && !user.lastActive.includes("주") && !user.lastActive.includes("일")) matchesActivity = false;
    }

    // Matches played filter
    let matchesGames = true;
    if (matchesFilter !== "all") {
      if (matchesFilter === "none" && user.stats.matchesPlayed > 0) matchesGames = false;
      if (matchesFilter === "beginner" && (user.stats.matchesPlayed < 1 || user.stats.matchesPlayed > 20)) matchesGames = false;
      if (matchesFilter === "intermediate" && (user.stats.matchesPlayed < 21 || user.stats.matchesPlayed > 50)) matchesGames = false;
      if (matchesFilter === "veteran" && user.stats.matchesPlayed <= 50) matchesGames = false;
    }

    // Attendance filter
    let matchesAttendance = true;
    if (attendanceFilter !== "all") {
      if (attendanceFilter === "high" && user.stats.attendance < 90) matchesAttendance = false;
      if (attendanceFilter === "medium" && (user.stats.attendance < 70 || user.stats.attendance >= 90)) matchesAttendance = false;
      if (attendanceFilter === "low" && user.stats.attendance >= 70) matchesAttendance = false;
    }

    // Team filter
    let matchesTeam = true;
    if (teamFilter !== "all") {
      if (teamFilter === "has-team" && user.teams.length === 0) matchesTeam = false;
      if (teamFilter === "no-team" && user.teams.length > 0) matchesTeam = false;
    }

    return matchesSearch && matchesStatus && matchesRole && matchesLocation &&
           matchesJoinDate && matchesActivity && matchesGames && matchesAttendance && matchesTeam;
  });

  const stats = {
    total: sourceUsers.length,
    active: sourceUsers.filter(u => u.status === "active").length,
    inactive: sourceUsers.filter(u => u.status === "inactive").length,
    suspended: sourceUsers.filter(u => u.status === "suspended").length,
    newToday: useBackendData ? sourceUsers.filter(u => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const createdAt = new Date(u.createdAt);
      return createdAt >= today;
    }).length : 12,
    activeToday: useBackendData ? Math.floor(sourceUsers.length * 0.45) : 3842,
  };

  // Handle dashboard filter on mount
  useEffect(() => {
    if (filterState?.filter === 'today-joined') {
      setJoinDateFilter('today');
      setQuickFilter('new-users');
      setShowAdvancedFilters(true); // Auto-open advanced filters
    }
  }, [filterState]);

  // Auto-open advanced filters when quick filter is applied
  useEffect(() => {
    if (quickFilter) {
      setShowAdvancedFilters(true);
    }
  }, [quickFilter]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyQuickFilter = (filter: string) => {
    // Reset all filters first
    resetAllFilters();

    setQuickFilter(filter);

    switch(filter) {
      case 'new-users':
        setJoinDateFilter('today');
        break;
      case 'active-today':
        setActivityFilter('today');
        break;
      case 'inactive':
        setActivityFilter('inactive');
        break;
      case 'no-team':
        setTeamFilter('no-team');
        break;
      case 'high-attendance':
        setAttendanceFilter('high');
        break;
      case 'suspended':
        setSelectedStatus('suspended');
        break;
    }
  };

  const resetAllFilters = () => {
    setSelectedRole("all");
    setSelectedLocation("all");
    setJoinDateFilter("all");
    setActivityFilter("all");
    setMatchesFilter("all");
    setAttendanceFilter("all");
    setTeamFilter("all");
    setSelectedStatus("all");
    setSearchTerm("");
    setQuickFilter(null);
  };

  const handleAction = (action: string, userId: string, userName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOpenMenuId(null);

    switch (action) {
      case "view":
        navigate(`/admin/users/${userId}`);
        break;
      case "edit":
        // 상세 페이지로 이동 후 편집 모달을 열도록 state 전달
        navigate(`/admin/users/${userId}`, { state: { openEditModal: true } });
        break;
      case "message":
        // 상세 페이지로 이동 후 메시지 기능 실행
        navigate(`/admin/users/${userId}`, { state: { openMessage: true } });
        break;
      case "suspend":
        // 상세 페이지로 이동 후 정지 모달을 열도록 state 전달
        navigate(`/admin/users/${userId}`, { state: { openBanModal: true } });
        break;
      case "delete":
        if (confirm(`${userName} 사용자를 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
          alert(`${userName} 사용자가 삭제되었습니다. (목업 - 실제로는 API 호출 필요)`);
          // TODO: 실제 삭제 API 호출 후 목록 새로고침
        }
        break;
    }
  };

  const clearFilter = () => {
    resetAllFilters();
    navigate('/admin/users', { replace: true, state: {} });
  };

  const displayUsers = filteredUsers;
  const activeFiltersCount = [
    joinDateFilter !== "all",
    activityFilter !== "all",
    matchesFilter !== "all",
    attendanceFilter !== "all",
    teamFilter !== "all",
    selectedStatus !== "all",
    selectedRole !== "all",
    selectedLocation !== "all",
  ].filter(Boolean).length;

  return (
    <AdminLayout activePage="users">
      {/* Backend Data Connection Status */}
      <div style={{
        background: isLoadingBackend ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' :
                   backendError ? 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' :
                   useBackendData ? 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' :
                   'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(79, 172, 254, 0.3)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '24px' }}>
            {isLoadingBackend ? '⏳' : backendError ? '⚠️' : useBackendData ? '🔌' : '🎨'}
          </span>
          <div>
            <div style={{ fontWeight: '600', fontSize: '14px' }}>
              {isLoadingBackend ? '백엔드 데이터 로딩 중...' :
               backendError ? '백엔드 연결 오류' :
               useBackendData ? `실제 데이터 표시 중 (${backendUsers.length}명)` :
               `목업 데이터 표시 중 (${mockUsers.length}명)`}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              {isLoadingBackend ? 'API 호출 중입니다...' :
               backendError ? `오류: ${backendError}` :
               useBackendData ? `백엔드 API에서 ${backendUsers.length}개의 프로필 데이터를 가져왔습니다` :
               '프론트엔드 목업 데이터를 표시하고 있습니다'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* 데이터 소스 토글 */}
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: backendError ? 'not-allowed' : 'pointer',
            opacity: backendError ? 0.5 : 1
          }}>
            <span style={{ fontSize: '12px', fontWeight: '500' }}>실제 데이터</span>
            <div style={{
              position: 'relative',
              width: '44px',
              height: '24px',
              background: useBackendData ? 'rgba(255, 255, 255, 0.3)' : 'rgba(0, 0, 0, 0.2)',
              borderRadius: '12px',
              transition: 'background 0.3s',
              border: '2px solid rgba(255, 255, 255, 0.4)'
            }}>
              <input
                type="checkbox"
                checked={useBackendData}
                onChange={(e) => !backendError && setUseBackendData(e.target.checked)}
                disabled={backendError}
                style={{
                  position: 'absolute',
                  opacity: 0,
                  width: '100%',
                  height: '100%',
                  cursor: backendError ? 'not-allowed' : 'pointer'
                }}
              />
              <div style={{
                position: 'absolute',
                top: '2px',
                left: useBackendData ? '22px' : '2px',
                width: '16px',
                height: '16px',
                background: 'white',
                borderRadius: '50%',
                transition: 'left 0.3s',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
              }} />
            </div>
          </label>
        </div>
      </div>

      {/* Quick Filter Buttons */}
      <div style={{
        display: "flex",
        gap: "8px",
        marginBottom: "20px",
        flexWrap: "wrap",
      }}>
        <button
          onClick={() => applyQuickFilter('new-users')}
          className={quickFilter === 'new-users' ? 'quick-filter-btn active' : 'quick-filter-btn'}
          style={{
            padding: "8px 16px",
            background: quickFilter === 'new-users' ? "var(--admin-primary)" : "var(--admin-bg-tertiary)",
            border: `1px solid ${quickFilter === 'new-users' ? "var(--admin-primary)" : "var(--admin-border)"}`,
            borderRadius: "20px",
            color: quickFilter === 'new-users' ? "white" : "var(--admin-text)",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (quickFilter !== 'new-users') {
              e.currentTarget.style.background = "var(--admin-bg-secondary)";
              e.currentTarget.style.borderColor = "var(--admin-primary)";
            }
          }}
          onMouseLeave={(e) => {
            if (quickFilter !== 'new-users') {
              e.currentTarget.style.background = "var(--admin-bg-tertiary)";
              e.currentTarget.style.borderColor = "var(--admin-border)";
            }
          }}
        >
          🆕 신규 회원
        </button>
        <button
          onClick={() => applyQuickFilter('active-today')}
          className={quickFilter === 'active-today' ? 'quick-filter-btn active' : 'quick-filter-btn'}
          style={{
            padding: "8px 16px",
            background: quickFilter === 'active-today' ? "var(--admin-primary)" : "var(--admin-bg-tertiary)",
            border: `1px solid ${quickFilter === 'active-today' ? "var(--admin-primary)" : "var(--admin-border)"}`,
            borderRadius: "20px",
            color: quickFilter === 'active-today' ? "white" : "var(--admin-text)",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (quickFilter !== 'active-today') {
              e.currentTarget.style.background = "var(--admin-bg-secondary)";
              e.currentTarget.style.borderColor = "var(--admin-primary)";
            }
          }}
          onMouseLeave={(e) => {
            if (quickFilter !== 'active-today') {
              e.currentTarget.style.background = "var(--admin-bg-tertiary)";
              e.currentTarget.style.borderColor = "var(--admin-border)";
            }
          }}
        >
          ⚡ 오늘 활동
        </button>
        <button
          onClick={() => applyQuickFilter('inactive')}
          className={quickFilter === 'inactive' ? 'quick-filter-btn active' : 'quick-filter-btn'}
          style={{
            padding: "8px 16px",
            background: quickFilter === 'inactive' ? "var(--admin-primary)" : "var(--admin-bg-tertiary)",
            border: `1px solid ${quickFilter === 'inactive' ? "var(--admin-primary)" : "var(--admin-border)"}`,
            borderRadius: "20px",
            color: quickFilter === 'inactive' ? "white" : "var(--admin-text)",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (quickFilter !== 'inactive') {
              e.currentTarget.style.background = "var(--admin-bg-secondary)";
              e.currentTarget.style.borderColor = "var(--admin-primary)";
            }
          }}
          onMouseLeave={(e) => {
            if (quickFilter !== 'inactive') {
              e.currentTarget.style.background = "var(--admin-bg-tertiary)";
              e.currentTarget.style.borderColor = "var(--admin-border)";
            }
          }}
        >
          💤 비활동 회원
        </button>
        <button
          onClick={() => applyQuickFilter('no-team')}
          className={quickFilter === 'no-team' ? 'quick-filter-btn active' : 'quick-filter-btn'}
          style={{
            padding: "8px 16px",
            background: quickFilter === 'no-team' ? "var(--admin-primary)" : "var(--admin-bg-tertiary)",
            border: `1px solid ${quickFilter === 'no-team' ? "var(--admin-primary)" : "var(--admin-border)"}`,
            borderRadius: "20px",
            color: quickFilter === 'no-team' ? "white" : "var(--admin-text)",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (quickFilter !== 'no-team') {
              e.currentTarget.style.background = "var(--admin-bg-secondary)";
              e.currentTarget.style.borderColor = "var(--admin-primary)";
            }
          }}
          onMouseLeave={(e) => {
            if (quickFilter !== 'no-team') {
              e.currentTarget.style.background = "var(--admin-bg-tertiary)";
              e.currentTarget.style.borderColor = "var(--admin-border)";
            }
          }}
        >
          🔍 팀 미소속
        </button>
        <button
          onClick={() => applyQuickFilter('high-attendance')}
          className={quickFilter === 'high-attendance' ? 'quick-filter-btn active' : 'quick-filter-btn'}
          style={{
            padding: "8px 16px",
            background: quickFilter === 'high-attendance' ? "var(--admin-primary)" : "var(--admin-bg-tertiary)",
            border: `1px solid ${quickFilter === 'high-attendance' ? "var(--admin-primary)" : "var(--admin-border)"}`,
            borderRadius: "20px",
            color: quickFilter === 'high-attendance' ? "white" : "var(--admin-text)",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (quickFilter !== 'high-attendance') {
              e.currentTarget.style.background = "var(--admin-bg-secondary)";
              e.currentTarget.style.borderColor = "var(--admin-primary)";
            }
          }}
          onMouseLeave={(e) => {
            if (quickFilter !== 'high-attendance') {
              e.currentTarget.style.background = "var(--admin-bg-tertiary)";
              e.currentTarget.style.borderColor = "var(--admin-border)";
            }
          }}
        >
          ⭐ 높은 출석률
        </button>
        <button
          onClick={() => applyQuickFilter('suspended')}
          className={quickFilter === 'suspended' ? 'quick-filter-btn active' : 'quick-filter-btn'}
          style={{
            padding: "8px 16px",
            background: quickFilter === 'suspended' ? "var(--admin-primary)" : "var(--admin-bg-tertiary)",
            border: `1px solid ${quickFilter === 'suspended' ? "var(--admin-primary)" : "var(--admin-border)"}`,
            borderRadius: "20px",
            color: quickFilter === 'suspended' ? "white" : "var(--admin-text)",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (quickFilter !== 'suspended') {
              e.currentTarget.style.background = "var(--admin-bg-secondary)";
              e.currentTarget.style.borderColor = "var(--admin-primary)";
            }
          }}
          onMouseLeave={(e) => {
            if (quickFilter !== 'suspended') {
              e.currentTarget.style.background = "var(--admin-bg-tertiary)";
              e.currentTarget.style.borderColor = "var(--admin-border)";
            }
          }}
        >
          🚫 정지된 계정
        </button>
        {activeFiltersCount > 0 && (
          <button
            onClick={resetAllFilters}
            style={{
              padding: "8px 16px",
              background: "transparent",
              border: "1px solid var(--admin-border)",
              borderRadius: "20px",
              color: "var(--admin-text-secondary)",
              fontSize: "13px",
              fontWeight: "500",
              cursor: "pointer",
              transition: "all 0.2s",
              display: "flex",
              alignItems: "center",
              gap: "6px",
            }}
          >
            <X size={14} />
            모두 초기화 ({activeFiltersCount})
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">전체 사용자</span>
          <span className="stat-value">{stats.total.toLocaleString()}</span>
          <span className="stat-change positive">
            <TrendingUp size={16} />
            +{stats.newToday} 오늘
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">활성 사용자</span>
          <span className="stat-value">{stats.active.toLocaleString()}</span>
          <span className="stat-change positive">
            {Math.round((stats.active / stats.total) * 100)}% 활성률
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">일일 활성 사용자</span>
          <span className="stat-value">{stats.activeToday.toLocaleString()}</span>
          <span className="stat-change positive">
            <TrendingUp size={16} />
            +5.3%
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">정지 계정</span>
          <span className="stat-value">{stats.suspended}</span>
          <span className="stat-change negative">
            <Shield size={16} />
            {stats.suspended} 제재 중
          </span>
        </div>
      </div>

      {/* Search and Filter Bar */}
      <div className="data-table-container">
        <div className="table-header">
          <div style={{ display: "flex", gap: "12px", flex: 1 }}>
            <div style={{ position: "relative", flex: 1, maxWidth: "400px" }}>
              <Search 
                size={20} 
                style={{ 
                  position: "absolute", 
                  left: "12px", 
                  top: "50%", 
                  transform: "translateY(-50%)",
                  color: "var(--admin-text-secondary)"
                }} 
              />
              <input
                type="text"
                placeholder="이름, 이메일로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 40px",
                  background: "var(--admin-bg-tertiary)",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "8px",
                  color: "var(--admin-text)",
                  fontSize: "14px",
                }}
              />
            </div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              style={{
                padding: "8px 16px",
                background: "var(--admin-bg-tertiary)",
                border: "1px solid var(--admin-border)",
                borderRadius: "8px",
                color: "var(--admin-text)",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              <option value="all">전체 상태</option>
              <option value="active">활성</option>
              <option value="inactive">비활성</option>
              <option value="suspended">정지</option>
            </select>
          </div>
          <div className="table-actions">
            <button
              className="btn-fotmob btn-secondary"
              onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
            >
              <Filter size={16} style={{ marginRight: "4px" }} />
              {showAdvancedFilters ? "필터 숨기기" : "고급 필터"}
            </button>
            <button className="btn-fotmob btn-primary">
              + 사용자 추가
            </button>
          </div>
        </div>

        {/* Filter Results Count */}
        {activeFiltersCount > 0 && (
          <div style={{
            marginTop: "12px",
            padding: "12px 16px",
            background: "var(--admin-bg-tertiary)",
            borderRadius: "8px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "14px",
          }}>
            <span style={{ color: "var(--admin-text)" }}>
              <strong>{displayUsers.length}</strong>명의 사용자가 검색되었습니다
              <span style={{ color: "var(--admin-text-secondary)", marginLeft: "8px" }}>
                (전체 {mockUsers.length}명 중)
              </span>
            </span>
            <span style={{ color: "var(--admin-text-secondary)", fontSize: "13px" }}>
              {activeFiltersCount}개 필터 적용 중
            </span>
          </div>
        )}

        {/* Advanced Filters */}
        {showAdvancedFilters && (
          <div style={{
            padding: "20px",
            background: "var(--admin-bg-tertiary)",
            borderRadius: "12px",
            marginTop: "16px",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "16px",
          }}>
            <div>
              <label style={{
                display: "block",
                fontSize: "13px",
                color: "var(--admin-text-secondary)",
                marginBottom: "8px",
                fontWeight: 500,
              }}>
                가입 일자
              </label>
              <select
                value={joinDateFilter}
                onChange={(e) => setJoinDateFilter(e.target.value as any)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "var(--admin-bg-secondary)",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "8px",
                  color: "var(--admin-text)",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="all">전체 기간</option>
                <option value="today">오늘</option>
                <option value="yesterday">어제</option>
                <option value="week">최근 7일</option>
                <option value="month">최근 30일</option>
                <option value="quarter">최근 90일</option>
                <option value="year">최근 1년</option>
              </select>
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "13px",
                color: "var(--admin-text-secondary)",
                marginBottom: "8px",
                fontWeight: 500,
              }}>
                활동 시기
              </label>
              <select
                value={activityFilter}
                onChange={(e) => setActivityFilter(e.target.value as any)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "var(--admin-bg-secondary)",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "8px",
                  color: "var(--admin-text)",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="all">전체</option>
                <option value="today">오늘 활동</option>
                <option value="recent">최근 활동 (시간 단위)</option>
                <option value="week">일주일 이내</option>
                <option value="inactive">비활동 (주 단위)</option>
              </select>
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "13px",
                color: "var(--admin-text-secondary)",
                marginBottom: "8px",
                fontWeight: 500,
              }}>
                경기 참여
              </label>
              <select
                value={matchesFilter}
                onChange={(e) => setMatchesFilter(e.target.value as any)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "var(--admin-bg-secondary)",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "8px",
                  color: "var(--admin-text)",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="all">전체</option>
                <option value="none">참여 없음 (0경기)</option>
                <option value="beginner">초급 (1-20경기)</option>
                <option value="intermediate">중급 (21-50경기)</option>
                <option value="veteran">베테랑 (50경기+)</option>
              </select>
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "13px",
                color: "var(--admin-text-secondary)",
                marginBottom: "8px",
                fontWeight: 500,
              }}>
                출석률
              </label>
              <select
                value={attendanceFilter}
                onChange={(e) => setAttendanceFilter(e.target.value as any)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "var(--admin-bg-secondary)",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "8px",
                  color: "var(--admin-text)",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="all">전체</option>
                <option value="high">높음 (90%+)</option>
                <option value="medium">보통 (70-89%)</option>
                <option value="low">낮음 (70% 미만)</option>
              </select>
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "13px",
                color: "var(--admin-text-secondary)",
                marginBottom: "8px",
                fontWeight: 500,
              }}>
                팀 소속
              </label>
              <select
                value={teamFilter}
                onChange={(e) => setTeamFilter(e.target.value as any)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "var(--admin-bg-secondary)",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "8px",
                  color: "var(--admin-text)",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="all">전체</option>
                <option value="has-team">팀 있음</option>
                <option value="no-team">팀 없음</option>
              </select>
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "13px",
                color: "var(--admin-text-secondary)",
                marginBottom: "8px",
                fontWeight: 500,
              }}>
                역할
              </label>
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as any)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "var(--admin-bg-secondary)",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "8px",
                  color: "var(--admin-text)",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="all">전체 역할</option>
                <option value="player">선수</option>
                <option value="captain">주장</option>
                <option value="referee">심판</option>
              </select>
            </div>

            <div>
              <label style={{
                display: "block",
                fontSize: "13px",
                color: "var(--admin-text-secondary)",
                marginBottom: "8px",
                fontWeight: 500,
              }}>
                지역
              </label>
              <select
                value={selectedLocation}
                onChange={(e) => setSelectedLocation(e.target.value)}
                style={{
                  width: "100%",
                  padding: "8px 12px",
                  background: "var(--admin-bg-secondary)",
                  border: "1px solid var(--admin-border)",
                  borderRadius: "8px",
                  color: "var(--admin-text)",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                <option value="all">전체 지역</option>
                <option value="서울">서울</option>
                <option value="경기">경기</option>
                <option value="인천">인천</option>
                <option value="부산">부산</option>
                <option value="대구">대구</option>
                <option value="광주">광주</option>
              </select>
            </div>

            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                onClick={resetAllFilters}
                className="btn-fotmob btn-secondary"
                style={{ width: "100%" }}
              >
                필터 초기화
              </button>
            </div>
          </div>
        )}

        <table className="data-table">
          <thead>
            <tr>
              <th>사용자</th>
              <th>연락처</th>
              <th>활동</th>
              <th>통계</th>
              <th>상태</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {displayUsers.map((user) => (
              <tr 
                key={user.id} 
                onClick={() => navigate(`/admin/users/${user.id}`)} 
                style={{ cursor: "pointer" }}
              >
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className="user-avatar">
                      {user.name.substring(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500 }}>{user.name}</div>
                      <div style={{ fontSize: "13px", color: "var(--admin-text-secondary)" }}>
                        {user.role === "captain" && <Shield size={12} style={{ display: "inline", marginRight: "4px" }} />}
                        {user.role === "captain" ? "주장" : user.role === "referee" ? "심판" : "선수"}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: "13px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <Mail size={14} style={{ color: "var(--admin-text-secondary)" }} />
                      {user.email}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Phone size={14} style={{ color: "var(--admin-text-secondary)" }} />
                      {user.phone}
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: "13px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <Calendar size={14} style={{ color: "var(--admin-text-secondary)" }} />
                      가입: {user.joinDate}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Activity size={14} style={{ color: "var(--admin-text-secondary)" }} />
                      최근: {user.lastActive}
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px" }}>
                    <div>
                      <div style={{ color: "var(--admin-text-secondary)", marginBottom: "2px" }}>경기</div>
                      <div style={{ fontWeight: 600 }}>{user.stats.matchesPlayed}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--admin-text-secondary)", marginBottom: "2px" }}>승률</div>
                      <div style={{ fontWeight: 600 }}>{user.stats.winRate}%</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--admin-text-secondary)", marginBottom: "2px" }}>출석</div>
                      <div style={{ fontWeight: 600 }}>{user.stats.attendance}%</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--admin-text-secondary)", marginBottom: "2px" }}>평점</div>
                      <div style={{ fontWeight: 600 }}>⭐ {user.stats.rating}</div>
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-pill status-${user.status}`}>
                    {user.status === "active" ? "활성" : user.status === "inactive" ? "비활성" : "정지"}
                  </span>
                </td>
                <td>
                  <div style={{ position: "relative" }}>
                    <button
                      style={{
                        background: "transparent",
                        border: "none",
                        color: "var(--admin-text-secondary)",
                        cursor: "pointer",
                        padding: "4px",
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(openMenuId === user.id ? null : user.id);
                      }}
                    >
                      <MoreVertical size={20} />
                    </button>
                    {openMenuId === user.id && (
                      <div
                        ref={menuRef}
                        style={{
                          position: "absolute",
                          right: "0",
                          top: "100%",
                          background: "var(--admin-bg-secondary)",
                          border: "1px solid var(--admin-border)",
                          borderRadius: "8px",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                          minWidth: "160px",
                          zIndex: 1000,
                          padding: "4px",
                          marginTop: "4px",
                        }}
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction("view", user.id, user.name);
                          }}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            background: "transparent",
                            border: "none",
                            color: "var(--admin-text)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "14px",
                            borderRadius: "6px",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "var(--admin-bg-tertiary)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <Eye size={16} />
                          자세히 보기
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction("edit", user.id, user.name);
                          }}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            background: "transparent",
                            border: "none",
                            color: "var(--admin-text)",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "14px",
                            borderRadius: "6px",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "var(--admin-bg-tertiary)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <Edit size={16} />
                          수정
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction("message", user.id, user.name);
                          }}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            background: "transparent",
                            border: "none",
                            color: "#3b82f6",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "14px",
                            borderRadius: "6px",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "var(--admin-bg-tertiary)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <MessageSquare size={16} />
                          메시지 보내기
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction("suspend", user.id, user.name);
                          }}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            background: "transparent",
                            border: "none",
                            color: "#f59e0b",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "14px",
                            borderRadius: "6px",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "var(--admin-bg-tertiary)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <Ban size={16} />
                          정지
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction("delete", user.id, user.name);
                          }}
                          style={{
                            width: "100%",
                            padding: "8px 12px",
                            background: "transparent",
                            border: "none",
                            color: "#ef4444",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            fontSize: "14px",
                            borderRadius: "6px",
                            transition: "background 0.2s",
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.background = "var(--admin-bg-tertiary)"}
                          onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
                        >
                          <Trash2 size={16} />
                          삭제
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Inquiries Section */}
      <RecentInquiries limit={5} />

      {/* User Detail Modal */}
      {selectedUser && (
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
            zIndex: 1000,
          }}
          onClick={() => setSelectedUser(null)}
        >
          <div 
            style={{
              background: "var(--admin-bg-secondary)",
              borderRadius: "16px",
              padding: "32px",
              maxWidth: "600px",
              width: "90%",
              maxHeight: "80vh",
              overflow: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "24px" }}>
              <div style={{ width: "80px", height: "80px" }} className="user-avatar">
                {selectedUser.name.substring(0, 2)}
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: "24px", marginBottom: "8px" }}>{selectedUser.name}</h2>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <span className={`status-pill status-${selectedUser.status}`}>
                    {selectedUser.status === "active" ? "활성" : selectedUser.status === "inactive" ? "비활성" : "정지"}
                  </span>
                  <span style={{ color: "var(--admin-text-secondary)" }}>
                    {selectedUser.role === "captain" ? "주장" : selectedUser.role === "referee" ? "심판" : "선수"}
                  </span>
                </div>
              </div>
            </div>

            <div style={{ display: "grid", gap: "20px" }}>
              <div>
                <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "var(--admin-text-secondary)" }}>연락처 정보</h3>
                <div style={{ display: "grid", gap: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Mail size={16} style={{ color: "var(--admin-text-secondary)" }} />
                    {selectedUser.email}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <Phone size={16} style={{ color: "var(--admin-text-secondary)" }} />
                    {selectedUser.phone}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <MapPin size={16} style={{ color: "var(--admin-text-secondary)" }} />
                    {selectedUser.location}
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "var(--admin-text-secondary)" }}>활동 통계</h3>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                  <div style={{ background: "var(--admin-bg-tertiary)", padding: "12px", borderRadius: "8px" }}>
                    <div style={{ fontSize: "12px", color: "var(--admin-text-secondary)", marginBottom: "4px" }}>경기 수</div>
                    <div style={{ fontSize: "20px", fontWeight: 600 }}>{selectedUser.stats.matchesPlayed}</div>
                  </div>
                  <div style={{ background: "var(--admin-bg-tertiary)", padding: "12px", borderRadius: "8px" }}>
                    <div style={{ fontSize: "12px", color: "var(--admin-text-secondary)", marginBottom: "4px" }}>승률</div>
                    <div style={{ fontSize: "20px", fontWeight: 600 }}>{selectedUser.stats.winRate}%</div>
                  </div>
                  <div style={{ background: "var(--admin-bg-tertiary)", padding: "12px", borderRadius: "8px" }}>
                    <div style={{ fontSize: "12px", color: "var(--admin-text-secondary)", marginBottom: "4px" }}>출석률</div>
                    <div style={{ fontSize: "20px", fontWeight: 600 }}>{selectedUser.stats.attendance}%</div>
                  </div>
                  <div style={{ background: "var(--admin-bg-tertiary)", padding: "12px", borderRadius: "8px" }}>
                    <div style={{ fontSize: "12px", color: "var(--admin-text-secondary)", marginBottom: "4px" }}>평점</div>
                    <div style={{ fontSize: "20px", fontWeight: 600 }}>⭐ {selectedUser.stats.rating}</div>
                  </div>
                </div>
              </div>

              {selectedUser.teams.length > 0 && (
                <div>
                  <h3 style={{ fontSize: "16px", marginBottom: "12px", color: "var(--admin-text-secondary)" }}>소속 팀</h3>
                  <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                    {selectedUser.teams.map((team) => (
                      <span 
                        key={team}
                        style={{
                          padding: "6px 12px",
                          background: "var(--admin-bg-tertiary)",
                          borderRadius: "16px",
                          fontSize: "14px",
                        }}
                      >
                        {team}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div style={{ display: "flex", gap: "12px", marginTop: "12px" }}>
                <button className="btn-fotmob btn-primary" style={{ flex: 1 }}>
                  메시지 보내기
                </button>
                <button className="btn-fotmob btn-secondary" style={{ flex: 1 }}>
                  활동 내역 보기
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default UsersPage;
