import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Filter, MoreVertical, MapPin, Calendar, Activity, Users, Trophy, TrendingUp, Shield, Edit, Trash2, Eye, Ban, X } from "lucide-react";
import AdminLayout from "../components/AdminLayout";
import MockDataBanner from "../components/MockDataBanner";
import { fetchTeamsApi } from "../api/adminApi";

interface Team {
  id: string;
  name: string;
  logo?: string;
  region: string;
  subRegion?: string;
  foundedDate: string;
  homeGround?: string;
  teamLevel: string;
  status: "active" | "inactive" | "disbanded";
  verified: boolean;
  stats: {
    totalMatches: number;
    wins: number;
    draws: number;
    losses: number;
    winRate: number;
    totalMembers: number;
  };
  captain: {
    name: string;
    id: string;
  };
}

const mockTeams: Team[] = [
  {
    id: "10001",
    name: "강남 유나이티드 FC",
    region: "서울",
    subRegion: "강남구",
    foundedDate: "2023-03-15",
    homeGround: "강남 스포츠파크",
    teamLevel: "중급",
    status: "active",
    verified: true,
    stats: {
      totalMatches: 45,
      wins: 28,
      draws: 10,
      losses: 7,
      winRate: 62,
      totalMembers: 18,
    },
    captain: {
      name: "김철수",
      id: "12345",
    },
  },
  {
    id: "10002",
    name: "판교 스타즈",
    region: "경기",
    subRegion: "성남시",
    foundedDate: "2023-06-20",
    homeGround: "판교 종합운동장",
    teamLevel: "고급",
    status: "active",
    verified: true,
    stats: {
      totalMatches: 38,
      wins: 25,
      draws: 8,
      losses: 5,
      winRate: 66,
      totalMembers: 20,
    },
    captain: {
      name: "이영희",
      id: "12346",
    },
  },
  {
    id: "10003",
    name: "새벽FC",
    region: "서울",
    subRegion: "마포구",
    foundedDate: "2024-01-10",
    homeGround: "마포 체육관",
    teamLevel: "초급",
    status: "active",
    verified: false,
    stats: {
      totalMatches: 12,
      wins: 5,
      draws: 3,
      losses: 4,
      winRate: 42,
      totalMembers: 12,
    },
    captain: {
      name: "박민수",
      id: "12347",
    },
  },
  {
    id: "10004",
    name: "홍대 킥오프",
    region: "서울",
    subRegion: "서대문구",
    foundedDate: "2023-09-01",
    homeGround: "홍대 운동장",
    teamLevel: "중급",
    status: "inactive",
    verified: false,
    stats: {
      totalMatches: 22,
      wins: 10,
      draws: 5,
      losses: 7,
      winRate: 45,
      totalMembers: 15,
    },
    captain: {
      name: "정지훈",
      id: "12348",
    },
  },
  {
    id: "10005",
    name: "인천 파이터스",
    region: "인천",
    subRegion: "연수구",
    foundedDate: "2023-05-15",
    homeGround: "인천 종합운동장",
    teamLevel: "고급",
    status: "disbanded",
    verified: false,
    stats: {
      totalMatches: 30,
      wins: 8,
      draws: 5,
      losses: 17,
      winRate: 27,
      totalMembers: 10,
    },
    captain: {
      name: "최수진",
      id: "12349",
    },
  },
  {
    id: "10006",
    name: "서초 FC",
    region: "서울",
    subRegion: "서초구",
    foundedDate: new Date().toISOString().split('T')[0],
    homeGround: "서초 체육공원",
    teamLevel: "초급",
    status: "active",
    verified: false,
    stats: {
      totalMatches: 0,
      wins: 0,
      draws: 0,
      losses: 0,
      winRate: 0,
      totalMembers: 8,
    },
    captain: {
      name: "안지훈",
      id: "12350",
    },
  },
  {
    id: "10007",
    name: "부산 드래곤즈",
    region: "부산",
    subRegion: "해운대구",
    foundedDate: "2024-02-15",
    homeGround: "해운대 체육관",
    teamLevel: "중급",
    status: "active",
    verified: true,
    stats: {
      totalMatches: 28,
      wins: 18,
      draws: 5,
      losses: 5,
      winRate: 64,
      totalMembers: 16,
    },
    captain: {
      name: "강민수",
      id: "12351",
    },
  },
];

const TeamsPage = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<"all" | "active" | "inactive" | "disbanded">("all");
  const [selectedRegion, setSelectedRegion] = useState<string>("all");
  const [foundedDateFilter, setFoundedDateFilter] = useState<"all" | "today" | "yesterday" | "week" | "month" | "quarter" | "year">("all");
  const [memberCountFilter, setMemberCountFilter] = useState<"all" | "low" | "medium" | "high">("all");
  const [matchesFilter, setMatchesFilter] = useState<"all" | "none" | "beginner" | "intermediate" | "veteran">("all");
  const [winRateFilter, setWinRateFilter] = useState<"all" | "high" | "medium" | "low">("all");
  const [teamLevelFilter, setTeamLevelFilter] = useState<"all" | "초급" | "중급" | "고급">("all");
  const [verifiedFilter, setVerifiedFilter] = useState<"all" | "verified" | "unverified">("all");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Quick filter preset
  const [quickFilter, setQuickFilter] = useState<string | null>(null);

  // Backend data state
  const [backendTeams, setBackendTeams] = useState<any[]>([]);
  const [isLoadingBackend, setIsLoadingBackend] = useState(false);
  const [backendError, setBackendError] = useState<string | null>(null);
  const [useBackendData, setUseBackendData] = useState(false);

  // Fetch backend teams on mount
  useEffect(() => {
    const loadBackendTeams = async () => {
      setIsLoadingBackend(true);
      setBackendError(null);
      try {
        const data = await fetchTeamsApi(0, 100);
        console.log('Backend teams data:', data);

        // Transform backend data to match frontend interface
        const teams = (data.content || data || []).map((team: any) => ({
          id: String(team.id),
          name: team.name || team.teamName || '',
          logo: team.logo || team.logoUrl,
          region: team.region || '',
          subRegion: team.subRegion || team.subregion,
          foundedDate: team.foundedDate || team.createdAt || '',
          homeGround: team.homeGround || '',
          teamLevel: team.teamLevel || team.skillLevel || 'INTERMEDIATE',
          status: team.status || 'active',
          verified: team.verified || false,
          stats: {
            totalMatches: team.stats?.totalMatches || 0,
            wins: team.stats?.wins || 0,
            draws: team.stats?.draws || 0,
            losses: team.stats?.losses || 0,
            winRate: team.stats?.winRate || 0,
            totalMembers: team.stats?.totalMembers || team.maxMembers || 0,
          },
          captain: {
            name: team.captain?.name || team.captainName || '미정',
            id: team.captain?.id || String(team.captainProfileId || ''),
          },
        }));

        console.log('Transformed teams:', teams);
        setBackendTeams(teams);
        if (teams.length > 0) {
          setUseBackendData(true);
          console.log('Using backend data, team count:', teams.length);
        }
      } catch (error) {
        console.error('Failed to fetch backend teams:', error);
        setBackendError(error instanceof Error ? error.message : 'Failed to fetch teams');
      } finally {
        setIsLoadingBackend(false);
      }
    };
    loadBackendTeams();
  }, []);

  const sourceTeams = useBackendData && backendTeams.length > 0 ? backendTeams : mockTeams;

  const filteredTeams = sourceTeams.filter((team) => {
    // 안전한 필드 접근
    const teamName = team.name || '';
    const teamRegion = team.region || '';
    const teamStatus = team.status || 'active';

    const matchesSearch = teamName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         teamRegion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === "all" || teamStatus === selectedStatus;
    const matchesRegion = selectedRegion === "all" || teamRegion.includes(selectedRegion);

    // Founded date filter
    let matchesFoundedDate = true;
    if (foundedDateFilter !== "all" && team.foundedDate) {
      try {
        const foundedDate = new Date(team.foundedDate);
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);

        const diffTime = Math.abs(now.getTime() - foundedDate.getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (foundedDateFilter === "today" && foundedDate < today) matchesFoundedDate = false;
        if (foundedDateFilter === "yesterday" && (foundedDate < yesterday || foundedDate >= today)) matchesFoundedDate = false;
        if (foundedDateFilter === "week" && diffDays > 7) matchesFoundedDate = false;
        if (foundedDateFilter === "month" && diffDays > 30) matchesFoundedDate = false;
        if (foundedDateFilter === "quarter" && diffDays > 90) matchesFoundedDate = false;
        if (foundedDateFilter === "year" && diffDays > 365) matchesFoundedDate = false;
      } catch (e) {
        matchesFoundedDate = true; // 날짜 파싱 실패 시 필터링하지 않음
      }
    }

    // Member count filter
    let matchesMemberCount = true;
    if (memberCountFilter !== "all" && team.stats) {
      const totalMembers = team.stats.totalMembers || 0;
      if (memberCountFilter === "low" && totalMembers >= 11) matchesMemberCount = false;
      if (memberCountFilter === "medium" && (totalMembers < 11 || totalMembers > 18)) matchesMemberCount = false;
      if (memberCountFilter === "high" && totalMembers <= 18) matchesMemberCount = false;
    }

    // Matches played filter
    let matchesMatches = true;
    if (matchesFilter !== "all" && team.stats) {
      const totalMatches = team.stats.totalMatches || 0;
      if (matchesFilter === "none" && totalMatches > 0) matchesMatches = false;
      if (matchesFilter === "beginner" && (totalMatches < 1 || totalMatches > 20)) matchesMatches = false;
      if (matchesFilter === "intermediate" && (totalMatches < 21 || totalMatches > 40)) matchesMatches = false;
      if (matchesFilter === "veteran" && totalMatches <= 40) matchesMatches = false;
    }

    // Win rate filter
    let matchesWinRate = true;
    if (winRateFilter !== "all" && team.stats) {
      const winRate = team.stats.winRate || 0;
      if (winRateFilter === "high" && winRate < 60) matchesWinRate = false;
      if (winRateFilter === "medium" && (winRate < 40 || winRate >= 60)) matchesWinRate = false;
      if (winRateFilter === "low" && winRate >= 40) matchesWinRate = false;
    }

    // Team level filter
    let matchesTeamLevel = true;
    if (teamLevelFilter !== "all" && team.teamLevel) {
      if (team.teamLevel !== teamLevelFilter) matchesTeamLevel = false;
    }

    // Verified filter
    let matchesVerified = true;
    if (verifiedFilter !== "all") {
      const isVerified = team.verified || false;
      if (verifiedFilter === "verified" && !isVerified) matchesVerified = false;
      if (verifiedFilter === "unverified" && isVerified) matchesVerified = false;
    }

    return matchesSearch && matchesStatus && matchesRegion && matchesFoundedDate &&
           matchesMemberCount && matchesMatches && matchesWinRate && matchesTeamLevel && matchesVerified;
  });

  const stats = {
    total: sourceTeams.length,
    active: sourceTeams.filter(t => (t.status || 'active') === "active").length,
    inactive: sourceTeams.filter(t => (t.status || '') === "inactive").length,
    disbanded: sourceTeams.filter(t => (t.status || '') === "disbanded").length,
    totalMatches: sourceTeams.reduce((sum, t) => sum + ((t.stats?.totalMatches) || 0), 0),
    totalMembers: sourceTeams.reduce((sum, t) => sum + ((t.stats?.totalMembers) || 0), 0),
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Auto-open advanced filters when quick filter is applied
  useEffect(() => {
    if (quickFilter) {
      setShowAdvancedFilters(true);
    }
  }, [quickFilter]);

  const applyQuickFilter = (filter: string) => {
    // Reset all filters first
    resetAllFilters();

    setQuickFilter(filter);

    switch(filter) {
      case 'new-teams':
        setFoundedDateFilter('month');
        break;
      case 'active':
        setSelectedStatus('active');
        setMatchesFilter('intermediate');
        break;
      case 'recruiting':
        setMemberCountFilter('low');
        setSelectedStatus('active');
        break;
      case 'high-winrate':
        setWinRateFilter('high');
        break;
      case 'inactive':
        setSelectedStatus('inactive');
        break;
      case 'verified':
        setVerifiedFilter('verified');
        break;
    }
  };

  const resetAllFilters = () => {
    setSelectedStatus("all");
    setSelectedRegion("all");
    setFoundedDateFilter("all");
    setMemberCountFilter("all");
    setMatchesFilter("all");
    setWinRateFilter("all");
    setTeamLevelFilter("all");
    setVerifiedFilter("all");
    setSearchTerm("");
    setQuickFilter(null);
  };

  const activeFiltersCount = [
    foundedDateFilter !== "all",
    memberCountFilter !== "all",
    matchesFilter !== "all",
    winRateFilter !== "all",
    teamLevelFilter !== "all",
    verifiedFilter !== "all",
    selectedStatus !== "all",
    selectedRegion !== "all",
  ].filter(Boolean).length;

  const handleAction = (action: string, teamId: string, teamName: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setOpenMenuId(null);

    switch (action) {
      case "view":
        navigate(`/admin/teams/${teamId}`);
        break;
      case "edit":
        // 상세 페이지로 이동 후 편집 모달을 열도록 state 전달
        navigate(`/admin/teams/${teamId}`, { state: { openEditModal: true } });
        break;
      case "deactivate":
        // 상세 페이지로 이동 후 해체 모달을 열도록 state 전달
        navigate(`/admin/teams/${teamId}`, { state: { openDissolveModal: true } });
        break;
      case "delete":
        if (confirm(`${teamName} 팀을 정말 삭제하시겠습니까?\n이 작업은 되돌릴 수 없습니다.`)) {
          alert(`${teamName} 팀이 삭제되었습니다. (목업 - 실제로는 API 호출 필요)`);
          // TODO: 실제 삭제 API 호출 후 목록 새로고침
        }
        break;
    }
  };

  return (
    <AdminLayout activePage="teams">
      <MockDataBanner />

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
               useBackendData ? `실제 데이터 표시 중 (${backendTeams.length}개 팀)` :
               `목업 데이터 표시 중 (${mockTeams.length}개 팀)`}
            </div>
            <div style={{ fontSize: '12px', opacity: 0.9 }}>
              {isLoadingBackend ? 'API 호출 중입니다...' :
               backendError ? `오류: ${backendError}` :
               useBackendData ? `백엔드 API에서 ${backendTeams.length}개의 팀 데이터를 가져왔습니다` :
               '프론트엔드 목업 데이터를 표시하고 있습니다'}
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
          onClick={() => applyQuickFilter('new-teams')}
          style={{
            padding: "8px 16px",
            background: quickFilter === 'new-teams' ? "var(--admin-primary)" : "var(--admin-bg-tertiary)",
            border: `1px solid ${quickFilter === 'new-teams' ? "var(--admin-primary)" : "var(--admin-border)"}`,
            borderRadius: "20px",
            color: quickFilter === 'new-teams' ? "white" : "var(--admin-text)",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (quickFilter !== 'new-teams') {
              e.currentTarget.style.background = "var(--admin-bg-secondary)";
              e.currentTarget.style.borderColor = "var(--admin-primary)";
            }
          }}
          onMouseLeave={(e) => {
            if (quickFilter !== 'new-teams') {
              e.currentTarget.style.background = "var(--admin-bg-tertiary)";
              e.currentTarget.style.borderColor = "var(--admin-border)";
            }
          }}
        >
          🆕 신규 팀
        </button>
        <button
          onClick={() => applyQuickFilter('active')}
          style={{
            padding: "8px 16px",
            background: quickFilter === 'active' ? "var(--admin-primary)" : "var(--admin-bg-tertiary)",
            border: `1px solid ${quickFilter === 'active' ? "var(--admin-primary)" : "var(--admin-border)"}`,
            borderRadius: "20px",
            color: quickFilter === 'active' ? "white" : "var(--admin-text)",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (quickFilter !== 'active') {
              e.currentTarget.style.background = "var(--admin-bg-secondary)";
              e.currentTarget.style.borderColor = "var(--admin-primary)";
            }
          }}
          onMouseLeave={(e) => {
            if (quickFilter !== 'active') {
              e.currentTarget.style.background = "var(--admin-bg-tertiary)";
              e.currentTarget.style.borderColor = "var(--admin-border)";
            }
          }}
        >
          ⚡ 활성 팀
        </button>
        <button
          onClick={() => applyQuickFilter('recruiting')}
          style={{
            padding: "8px 16px",
            background: quickFilter === 'recruiting' ? "var(--admin-primary)" : "var(--admin-bg-tertiary)",
            border: `1px solid ${quickFilter === 'recruiting' ? "var(--admin-primary)" : "var(--admin-border)"}`,
            borderRadius: "20px",
            color: quickFilter === 'recruiting' ? "white" : "var(--admin-text)",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (quickFilter !== 'recruiting') {
              e.currentTarget.style.background = "var(--admin-bg-secondary)";
              e.currentTarget.style.borderColor = "var(--admin-primary)";
            }
          }}
          onMouseLeave={(e) => {
            if (quickFilter !== 'recruiting') {
              e.currentTarget.style.background = "var(--admin-bg-tertiary)";
              e.currentTarget.style.borderColor = "var(--admin-border)";
            }
          }}
        >
          👥 팀원 모집 중
        </button>
        <button
          onClick={() => applyQuickFilter('high-winrate')}
          style={{
            padding: "8px 16px",
            background: quickFilter === 'high-winrate' ? "var(--admin-primary)" : "var(--admin-bg-tertiary)",
            border: `1px solid ${quickFilter === 'high-winrate' ? "var(--admin-primary)" : "var(--admin-border)"}`,
            borderRadius: "20px",
            color: quickFilter === 'high-winrate' ? "white" : "var(--admin-text)",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (quickFilter !== 'high-winrate') {
              e.currentTarget.style.background = "var(--admin-bg-secondary)";
              e.currentTarget.style.borderColor = "var(--admin-primary)";
            }
          }}
          onMouseLeave={(e) => {
            if (quickFilter !== 'high-winrate') {
              e.currentTarget.style.background = "var(--admin-bg-tertiary)";
              e.currentTarget.style.borderColor = "var(--admin-border)";
            }
          }}
        >
          🏆 높은 승률
        </button>
        <button
          onClick={() => applyQuickFilter('inactive')}
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
          💤 비활성 팀
        </button>
        <button
          onClick={() => applyQuickFilter('verified')}
          style={{
            padding: "8px 16px",
            background: quickFilter === 'verified' ? "var(--admin-primary)" : "var(--admin-bg-tertiary)",
            border: `1px solid ${quickFilter === 'verified' ? "var(--admin-primary)" : "var(--admin-border)"}`,
            borderRadius: "20px",
            color: quickFilter === 'verified' ? "white" : "var(--admin-text)",
            fontSize: "13px",
            fontWeight: "500",
            cursor: "pointer",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            if (quickFilter !== 'verified') {
              e.currentTarget.style.background = "var(--admin-bg-secondary)";
              e.currentTarget.style.borderColor = "var(--admin-primary)";
            }
          }}
          onMouseLeave={(e) => {
            if (quickFilter !== 'verified') {
              e.currentTarget.style.background = "var(--admin-bg-tertiary)";
              e.currentTarget.style.borderColor = "var(--admin-border)";
            }
          }}
        >
          ✅ 인증된 팀
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
          <span className="stat-label">전체 팀</span>
          <span className="stat-value">{stats.total}</span>
          <span className="stat-change positive">
            <TrendingUp size={16} />
            활성 {stats.active}팀
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">총 팀원</span>
          <span className="stat-value">{stats.totalMembers}</span>
          <span className="stat-change positive">
            평균 {Math.round(stats.totalMembers / stats.total)}명/팀
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">총 경기</span>
          <span className="stat-value">{stats.totalMatches}</span>
          <span className="stat-change positive">
            <TrendingUp size={16} />
            이번 주 +12
          </span>
        </div>
        <div className="stat-card">
          <span className="stat-label">비활성/해체</span>
          <span className="stat-value">{stats.inactive + stats.disbanded}</span>
          <span className="stat-change negative">
            <Shield size={16} />
            관리 필요
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
                placeholder="팀명, 지역으로 검색..."
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
              <option value="disbanded">해체</option>
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
              + 팀 추가
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
              <strong>{filteredTeams.length}</strong>개 팀이 검색되었습니다
              <span style={{ color: "var(--admin-text-secondary)", marginLeft: "8px" }}>
                (전체 {mockTeams.length}팀 중)
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
                창단 일자
              </label>
              <select
                value={foundedDateFilter}
                onChange={(e) => setFoundedDateFilter(e.target.value as any)}
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
                팀원 수
              </label>
              <select
                value={memberCountFilter}
                onChange={(e) => setMemberCountFilter(e.target.value as any)}
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
                <option value="low">인원 부족 (10명 이하)</option>
                <option value="medium">적정 (11-18명)</option>
                <option value="high">많음 (19명 이상)</option>
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
                경기 수
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
                <option value="none">경기 없음 (0경기)</option>
                <option value="beginner">초급 (1-20경기)</option>
                <option value="intermediate">중급 (21-40경기)</option>
                <option value="veteran">베테랑 (40경기+)</option>
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
                승률
              </label>
              <select
                value={winRateFilter}
                onChange={(e) => setWinRateFilter(e.target.value as any)}
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
                <option value="high">높음 (60%+)</option>
                <option value="medium">보통 (40-59%)</option>
                <option value="low">낮음 (40% 미만)</option>
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
                팀 레벨
              </label>
              <select
                value={teamLevelFilter}
                onChange={(e) => setTeamLevelFilter(e.target.value as any)}
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
                <option value="초급">초급</option>
                <option value="중급">중급</option>
                <option value="고급">고급</option>
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
                value={selectedRegion}
                onChange={(e) => setSelectedRegion(e.target.value)}
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

            <div>
              <label style={{
                display: "block",
                fontSize: "13px",
                color: "var(--admin-text-secondary)",
                marginBottom: "8px",
                fontWeight: 500,
              }}>
                인증 상태
              </label>
              <select
                value={verifiedFilter}
                onChange={(e) => setVerifiedFilter(e.target.value as any)}
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
                <option value="verified">인증됨</option>
                <option value="unverified">미인증</option>
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
              <th>팀 정보</th>
              <th>활동 지역</th>
              <th>팀 통계</th>
              <th>팀원/주장</th>
              <th>상태</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {filteredTeams.map((team) => (
              <tr
                key={team.id}
                onClick={() => {
                  console.log('Clicking team:', team.id, team.name, 'useBackendData:', useBackendData);
                  navigate(`/admin/teams/${team.id}`);
                }}
                style={{ cursor: "pointer" }}
              >
                <td>
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <div className="user-avatar" style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
                      {team.name.substring(0, 2)}
                    </div>
                    <div>
                      <div style={{ fontWeight: 500, display: "flex", alignItems: "center", gap: "6px" }}>
                        {team.name}
                        {team.verified && <Shield size={14} style={{ color: "#3b82f6" }} />}
                      </div>
                      <div style={{ fontSize: "13px", color: "var(--admin-text-secondary)" }}>
                        {team.teamLevel} · 창단 {new Date(team.foundedDate).toLocaleDateString('ko-KR', { year: 'numeric', month: 'short' })}
                      </div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: "13px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <MapPin size={14} style={{ color: "var(--admin-text-secondary)" }} />
                      {team.region} {team.subRegion}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--admin-text-secondary)" }}>
                      <Activity size={14} />
                      {team.homeGround || "홈구장 미설정"}
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", fontSize: "13px" }}>
                    <div>
                      <div style={{ color: "var(--admin-text-secondary)", marginBottom: "2px" }}>경기</div>
                      <div style={{ fontWeight: 600 }}>{team.stats.totalMatches}</div>
                    </div>
                    <div>
                      <div style={{ color: "var(--admin-text-secondary)", marginBottom: "2px" }}>승률</div>
                      <div style={{ fontWeight: 600, color: team.stats.winRate >= 50 ? "#10b981" : "#ef4444" }}>
                        {team.stats.winRate}%
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "var(--admin-text-secondary)", marginBottom: "2px" }}>승/무/패</div>
                      <div style={{ fontWeight: 600, fontSize: "12px" }}>
                        {team.stats.wins}/{team.stats.draws}/{team.stats.losses}
                      </div>
                    </div>
                    <div>
                      <div style={{ color: "var(--admin-text-secondary)", marginBottom: "2px" }}>팀원</div>
                      <div style={{ fontWeight: 600 }}>{team.stats.totalMembers}명</div>
                    </div>
                  </div>
                </td>
                <td>
                  <div style={{ fontSize: "13px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                      <Users size={14} style={{ color: "var(--admin-text-secondary)" }} />
                      {team.stats.totalMembers}명
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                      <Shield size={14} style={{ color: "var(--admin-text-secondary)" }} />
                      주장: {team.captain.name}
                    </div>
                  </div>
                </td>
                <td>
                  <span className={`status-pill status-${team.status}`}>
                    {team.status === "active" ? "활성" : team.status === "inactive" ? "비활성" : "해체"}
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
                        setOpenMenuId(openMenuId === team.id ? null : team.id);
                      }}
                    >
                      <MoreVertical size={20} />
                    </button>
                    {openMenuId === team.id && (
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
                            handleAction("view", team.id, team.name);
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
                            handleAction("edit", team.id, team.name);
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
                            handleAction("deactivate", team.id, team.name);
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
                          비활성화
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAction("delete", team.id, team.name);
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
    </AdminLayout>
  );
};

export default TeamsPage;
