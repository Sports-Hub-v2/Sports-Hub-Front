import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Edit, Ban, Trash2, AlertCircle, CheckCircle,
  Clock, MapPin, Mail, Phone, Calendar, Activity,
  Shield, Users, FileText, Bell, TrendingUp, Award,
  Download, Send, Eye, Check, X, AlertTriangle, Star,
  Share2, MessageCircle, BarChart3, Target, Zap, Trophy,
  Shirt, Home, Flag
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

// 팀 상세 타입 정의
interface TeamMember {
  id: number;
  name: string;
  position: string;
  joinDate: string;
  matchesPlayed: number;
  goals: number;
  assists: number;
  role: 'CAPTAIN' | 'MEMBER';
  status: 'ACTIVE' | 'INACTIVE';
}

interface TeamDetail {
  id: number;
  name: string;
  logo?: string;
  region: string;
  subRegion?: string;
  foundedDate: string;
  homeGround?: string;
  teamLevel: string;
  status: 'ACTIVE' | 'INACTIVE' | 'DISBANDED';
  verified: boolean;

  stats: {
    totalMatches: number;
    wins: number;
    draws: number;
    losses: number;
    winRate: number;
    totalMembers: number;
    avgAge: number;
    goalsScored: number;
    goalsConceded: number;
  };

  recentForm: Array<{
    date: string;
    opponent: string;
    result: 'WIN' | 'DRAW' | 'LOSS';
    score: string;
  }>;

  members: TeamMember[];

  upcomingMatches: Array<{
    id: number;
    date: string;
    time: string;
    opponent: string;
    location: string;
    type: string;
  }>;

  recentMatches: Array<{
    id: number;
    date: string;
    opponent: string;
    result: 'WIN' | 'DRAW' | 'LOSS';
    score: string;
    goalsScored: number;
    goalsConceded: number;
  }>;

  activityTimeline: Array<{
    id: number;
    date: string;
    time: string;
    type: string;
    title: string;
    description: string;
  }>;

  admin: {
    captainName: string;
    captainId: number;
    createdBy: string;
    reportCount: number;
    warningCount: number;
    notes: string;
  };
}

const TeamDetailPage = () => {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'squad' | 'matches' | 'activity' | 'security'>('overview');
  const [team, setTeam] = useState<TeamDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDissolveModal, setShowDissolveModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);

  useEffect(() => {
    fetchTeamDetail();
  }, [teamId]);

  // URL state에서 모달 열기 설정 확인
  useEffect(() => {
    if (location.state) {
      const state = location.state as any;
      if (state.openEditModal) {
        setShowEditModal(true);
        // state 제거 (뒤로가기 시 다시 열리지 않도록)
        navigate(location.pathname, { replace: true, state: {} });
      }
      if (state.openDissolveModal) {
        setShowDissolveModal(true);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state]);

  const fetchTeamDetail = async () => {
    setLoading(true);
    setTimeout(() => {
      setTeam({
        id: 10001,
        name: '강남 유나이티드 FC',
        region: '서울',
        subRegion: '강남구',
        foundedDate: '2023-03-15',
        homeGround: '강남 스포츠파크',
        teamLevel: '중급',
        status: 'ACTIVE',
        verified: true,
        stats: {
          totalMatches: 45,
          wins: 28,
          draws: 10,
          losses: 7,
          winRate: 62,
          totalMembers: 18,
          avgAge: 28,
          goalsScored: 98,
          goalsConceded: 52
        },
        recentForm: [
          { date: '2025-10-01', opponent: '판교 스타즈', result: 'WIN', score: '3-1' },
          { date: '2025-09-28', opponent: '새벽FC', result: 'WIN', score: '2-0' },
          { date: '2025-09-24', opponent: '홍대 킥오프', result: 'DRAW', score: '1-1' },
          { date: '2025-09-20', opponent: '인천 파이터스', result: 'LOSS', score: '0-2' },
          { date: '2025-09-15', opponent: '분당 블루스', result: 'WIN', score: '4-2' }
        ],
        members: [
          { id: 12345, name: '김철수', position: 'MF', joinDate: '2024-09-10', matchesPlayed: 32, goals: 8, assists: 12, role: 'CAPTAIN', status: 'ACTIVE' },
          { id: 12346, name: '이영희', position: 'FW', joinDate: '2024-10-05', matchesPlayed: 28, goals: 15, assists: 7, role: 'MEMBER', status: 'ACTIVE' },
          { id: 12347, name: '박민수', position: 'DF', joinDate: '2024-08-20', matchesPlayed: 30, goals: 2, assists: 3, role: 'MEMBER', status: 'ACTIVE' },
          { id: 12348, name: '정지훈', position: 'GK', joinDate: '2023-03-15', matchesPlayed: 40, goals: 0, assists: 0, role: 'MEMBER', status: 'ACTIVE' },
          { id: 12349, name: '최수진', position: 'MF', joinDate: '2024-11-12', matchesPlayed: 25, goals: 6, assists: 9, role: 'MEMBER', status: 'ACTIVE' },
          { id: 12350, name: '강동원', position: 'FW', joinDate: '2024-07-03', matchesPlayed: 22, goals: 11, assists: 5, role: 'MEMBER', status: 'ACTIVE' },
        ],
        upcomingMatches: [
          { id: 1, date: '2025-10-05', time: '10:00', opponent: '서초 레전드', location: '강남 스포츠파크', type: '친선경기' },
          { id: 2, date: '2025-10-08', time: '19:00', opponent: '판교FC', location: '판교 종합운동장', type: '정기경기' },
          { id: 3, date: '2025-10-12', time: '14:00', opponent: '분당 블루스', location: '강남 스포츠파크', type: '친선경기' }
        ],
        recentMatches: [
          { id: 1, date: '2025-10-01', opponent: '판교 스타즈', result: 'WIN', score: '3-1', goalsScored: 3, goalsConceded: 1 },
          { id: 2, date: '2025-09-28', opponent: '새벽FC', result: 'WIN', score: '2-0', goalsScored: 2, goalsConceded: 0 },
          { id: 3, date: '2025-09-24', opponent: '홍대 킥오프', result: 'DRAW', score: '1-1', goalsScored: 1, goalsConceded: 1 },
          { id: 4, date: '2025-09-20', opponent: '인천 파이터스', result: 'LOSS', score: '0-2', goalsScored: 0, goalsConceded: 2 },
          { id: 5, date: '2025-09-15', opponent: '분당 블루스', result: 'WIN', score: '4-2', goalsScored: 4, goalsConceded: 2 }
        ],
        activityTimeline: [
          { id: 1, date: '2025-10-02', time: '14:30', type: 'MEMBER_JOIN', title: '신규 멤버 가입', description: '홍길동님이 팀에 합류했습니다' },
          { id: 2, date: '2025-10-01', time: '10:30', type: 'MATCH_WIN', title: '경기 승리', description: 'vs 판교 스타즈 (3-1)' },
          { id: 3, date: '2025-09-30', time: '18:00', type: 'PRACTICE', title: '정기 훈련', description: '주간 팀 훈련 실시' },
          { id: 4, date: '2025-09-28', time: '09:00', type: 'MATCH_WIN', title: '경기 승리', description: 'vs 새벽FC (2-0)' }
        ],
        admin: {
          captainName: '김철수',
          captainId: 12345,
          createdBy: '관리자A',
          reportCount: 0,
          warningCount: 0,
          notes: '성실하고 활발한 활동. 신뢰도 높음.'
        }
      });
      setLoading(false);
    }, 500);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleEditSave = (editedData: any) => {
    console.log('팀 정보 수정:', editedData);
    if (team) {
      setTeam({
        ...team,
        ...editedData
      });
    }
    setShowEditModal(false);
    alert('팀 정보가 수정되었습니다. (목업)');
  };

  const handleDissolve = () => {
    setShowDissolveModal(true);
  };

  const handleDissolveSubmit = (dissolveData: any) => {
    console.log('팀 해체:', dissolveData);
    if (team) {
      setTeam({
        ...team,
        status: 'DISBANDED'
      });
    }
    setShowDissolveModal(false);
    alert('팀이 해체되었습니다. (목업)');
  };

  const handleDelete = () => {
    if (window.confirm('이 팀을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      console.log('삭제:', teamId);
      navigate('/admin/data-management');
    }
  };

  const handleMemberClick = (memberId: number) => {
    navigate(`/admin/users/${memberId}`);
  };

  if (loading) {
    return (
      <AdminLayout activePage="teams">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!team) {
    return (
      <AdminLayout activePage="teams">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">팀을 찾을 수 없습니다.</p>
            <button
              onClick={() => navigate('/admin/teams')}
              className="mt-4 text-blue-600 hover:text-blue-700"
            >
              목록으로 돌아가기
            </button>
          </div>
        </div>
      </AdminLayout>
    );
  }

  const getStatusBadge = () => {
    const statusConfig = {
      ACTIVE: { color: 'bg-green-100 text-green-700', icon: '⚡', text: '활동중' },
      INACTIVE: { color: 'bg-gray-100 text-gray-700', icon: '💤', text: '비활성' },
      DISBANDED: { color: 'bg-red-100 text-red-700', icon: '🚫', text: '해체' }
    };
    const config = statusConfig[team.status];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <span>{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const getFormIcon = (result: string) => {
    if (result === 'WIN') return 'W';
    if (result === 'DRAW') return 'D';
    return 'L';
  };

  const getFormColor = (result: string) => {
    if (result === 'WIN') return 'bg-green-500 text-white';
    if (result === 'DRAW') return 'bg-gray-400 text-white';
    return 'bg-red-500 text-white';
  };

  return (
    <AdminLayout activePage="teams">
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/admin/teams')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>팀 목록으로</span>
            </button>

            <div className="flex items-center gap-2">
              {/* FotMob 스타일 액션 버튼들 */}
              <button
                onClick={() => alert('팔로우 기능 (목업)')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Star className="w-4 h-4" />
                팔로우
              </button>
              <button
                onClick={() => alert('공유 기능 (목업)')}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <Share2 className="w-4 h-4" />
                공유
              </button>
              <button
                onClick={() => setShowMessageModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
              >
                <MessageCircle className="w-4 h-4" />
                메시지
              </button>
              <div className="border-l h-8 mx-2"></div>
              <button
                onClick={handleEdit}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Edit className="w-4 h-4" />
                편집
              </button>
              <button
                onClick={handleDissolve}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                <Ban className="w-4 h-4" />
                해체
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                <Trash2 className="w-4 h-4" />
                삭제
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 팀 프로필 헤더 - FotMob 스타일 (조기축구 테마) */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 border-b shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start gap-6">
            {/* 팀 로고 */}
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-blue-600 text-3xl font-bold shadow-lg border-4 border-white">
              <Shield className="w-16 h-16" />
            </div>

            {/* 기본 정보 */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{team.name}</h1>
                <span className="text-blue-100">#{team.id}</span>
                {getStatusBadge()}
                {team.verified && (
                  <span className="inline-flex items-center gap-1 bg-white text-blue-600 px-2 py-1 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    인증 팀
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-white mb-4">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {team.region} {team.subRegion}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  창단: {new Date(team.foundedDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Home className="w-4 h-4" />
                  홈구장: {team.homeGround || '-'}
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  팀 레벨: {team.teamLevel}
                </div>
                <div className="flex items-center gap-2">
                  <Trophy className="w-4 h-4" />
                  승률: {team.stats.winRate}%
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  팀원: {team.stats.totalMembers}명
                </div>
              </div>

              {/* FotMob 스타일 최근 경기 폼 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-white font-medium">최근 5경기:</span>
                <div className="flex gap-1">
                  {team.recentForm.map((form, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${getFormColor(form.result)}`}
                      title={`${form.date} - vs ${form.opponent} (${form.score})`}
                    >
                      {getFormIcon(form.result)}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* 핵심 통계 카드 - 조기축구 특화 */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white p-4 rounded-lg text-center shadow-md">
                <div className="text-3xl font-bold text-green-600">{team.stats.wins}</div>
                <div className="text-xs text-gray-600 mt-1">승리</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-md">
                <div className="text-3xl font-bold text-gray-600">{team.stats.draws}</div>
                <div className="text-xs text-gray-600 mt-1">무승부</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-md">
                <div className="text-3xl font-bold text-red-600">{team.stats.losses}</div>
                <div className="text-xs text-gray-600 mt-1">패배</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 탭 네비게이션 */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4">
          <nav className="flex gap-8">
            {[
              { id: 'overview', label: '개요', icon: Activity },
              { id: 'stats', label: '팀 통계', icon: BarChart3 },
              { id: 'squad', label: '스쿼드', icon: Users },
              { id: 'matches', label: '경기 일정', icon: Calendar },
              { id: 'activity', label: '활동 기록', icon: TrendingUp },
              { id: 'security', label: '관리/제재', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* 탭 컨텐츠 */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* 조기축구 팀 통계 그리드 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <StatCard
                icon={Trophy}
                label="총 경기"
                value={team.stats.totalMatches}
                color="blue"
              />
              <StatCard
                icon={Target}
                label="승률"
                value={`${team.stats.winRate}%`}
                color="green"
              />
              <StatCard
                icon={Users}
                label="팀원 수"
                value={team.stats.totalMembers}
                color="purple"
              />
              <StatCard
                icon={Flag}
                label="평균 연령"
                value={`${team.stats.avgAge}세`}
                color="orange"
              />
            </div>

            {/* 팀 정보 카드 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">⚽ 팀 정보</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">홈구장</span>
                    <span className="font-semibold">{team.homeGround || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">팀 레벨</span>
                    <span className="font-semibold text-blue-600">{team.teamLevel}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">활동 지역</span>
                    <span className="font-semibold">{team.region} {team.subRegion}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">총 경기 수</span>
                    <span className="font-semibold text-green-600">{team.stats.totalMatches}경기</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">팀장</span>
                    <button
                      onClick={() => handleMemberClick(team.admin.captainId)}
                      className="font-semibold text-blue-600 hover:text-blue-700 underline"
                    >
                      {team.admin.captainName}
                    </button>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">📊 득실 기록</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">득점</span>
                      <span className="text-sm font-bold text-green-600">{team.stats.goalsScored}골</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-green-500"
                        style={{ width: `${(team.stats.goalsScored / (team.stats.goalsScored + team.stats.goalsConceded)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">실점</span>
                      <span className="text-sm font-bold text-red-600">{team.stats.goalsConceded}골</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="h-3 rounded-full bg-red-500"
                        style={{ width: `${(team.stats.goalsConceded / (team.stats.goalsScored + team.stats.goalsConceded)) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div className="pt-4 border-t">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        +{team.stats.goalsScored - team.stats.goalsConceded}
                      </div>
                      <div className="text-sm text-gray-600">골 득실</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 전적 분석 */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">📈 전적 분석</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-3xl font-bold text-green-600">{team.stats.wins}</div>
                  <div className="text-sm text-gray-600 mt-1">승리</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((team.stats.wins / team.stats.totalMatches) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl font-bold text-gray-600">{team.stats.draws}</div>
                  <div className="text-sm text-gray-600 mt-1">무승부</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((team.stats.draws / team.stats.totalMatches) * 100).toFixed(1)}%
                  </div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-3xl font-bold text-red-600">{team.stats.losses}</div>
                  <div className="text-sm text-gray-600 mt-1">패배</div>
                  <div className="text-xs text-gray-500 mt-1">
                    {((team.stats.losses / team.stats.totalMatches) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* 최근 경기 결과 */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Trophy className="w-5 h-5 text-green-600" />
                최근 경기 결과
              </h3>
              <div className="space-y-3">
                {team.recentMatches.map((match) => (
                  <div key={match.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 w-24 text-sm text-gray-600">
                      {new Date(match.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">vs {match.opponent}</div>
                      <div className="text-sm text-gray-500">
                        득점: {match.goalsScored} | 실점: {match.goalsConceded}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-xl font-bold text-gray-900">{match.score}</div>
                      <div className={`w-16 h-16 rounded-full flex items-center justify-center text-lg font-bold ${getFormColor(match.result)}`}>
                        {getFormIcon(match.result)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 득점/실점 차트 */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">⚽ 득점/실점 분석</h3>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-green-600">{team.stats.goalsScored}</div>
                    <div className="text-sm text-gray-600">총 득점</div>
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    경기당 평균: {(team.stats.goalsScored / team.stats.totalMatches).toFixed(2)}골
                  </div>
                </div>
                <div>
                  <div className="text-center mb-4">
                    <div className="text-4xl font-bold text-red-600">{team.stats.goalsConceded}</div>
                    <div className="text-sm text-gray-600">총 실점</div>
                  </div>
                  <div className="text-sm text-gray-600 text-center">
                    경기당 평균: {(team.stats.goalsConceded / team.stats.totalMatches).toFixed(2)}골
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'squad' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">👥 팀 스쿼드 ({team.members.length}명)</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">이름</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">포지션</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">가입일</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">경기</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">득점</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">도움</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">역할</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">상태</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {team.members.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50 cursor-pointer" onClick={() => handleMemberClick(member.id)}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-bold mr-3">
                              {member.name.charAt(0)}
                            </div>
                            <div className="font-medium text-blue-600 hover:text-blue-700">{member.name}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {member.position}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(member.joinDate).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-semibold">
                          {member.matchesPlayed}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-semibold">
                          {member.goals}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 font-semibold">
                          {member.assists}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {member.role === 'CAPTAIN' ? (
                            <span className="px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                              👑 팀장
                            </span>
                          ) : (
                            <span className="text-sm text-gray-500">멤버</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            member.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {member.status === 'ACTIVE' ? '활동중' : '비활성'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* 득점 순위 */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">⚽ 득점 순위</h3>
              <div className="space-y-3">
                {[...team.members]
                  .sort((a, b) => b.goals - a.goals)
                  .slice(0, 5)
                  .map((member, index) => (
                    <div key={member.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer" onClick={() => handleMemberClick(member.id)}>
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-blue-600 hover:text-blue-700">{member.name}</div>
                        <div className="text-sm text-gray-500">{member.position}</div>
                      </div>
                      <div className="text-2xl font-bold text-green-600">{member.goals}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'matches' && (
          <div className="space-y-6">
            {/* 다가오는 경기 */}
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold">📅 예정된 경기</h3>
              </div>
              <div className="divide-y">
                {team.upcomingMatches.map((match) => (
                  <div key={match.id} className="p-6 hover:bg-gray-50 transition-colors">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-semibold rounded">
                            {match.type}
                          </span>
                          <span className="text-sm text-gray-600">
                            {new Date(match.date).toLocaleDateString('ko-KR', { month: 'long', day: 'numeric' })} {match.time}
                          </span>
                        </div>
                        <div className="text-xl font-bold text-gray-900 mb-1">
                          {team.name} vs {match.opponent}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <MapPin className="w-4 h-4" />
                          {match.location}
                        </div>
                      </div>
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                        상세보기
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
          <div className="bg-white rounded-lg border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">🕒 팀 활동 타임라인</h3>
            </div>
            <div className="p-6 space-y-4">
              {team.activityTimeline.map((act) => {
                const getActivityIcon = (type: string) => {
                  const icons: any = {
                    MEMBER_JOIN: Users,
                    MEMBER_LEAVE: Users,
                    MATCH_WIN: Trophy,
                    MATCH_DRAW: Activity,
                    MATCH_LOSS: Activity,
                    PRACTICE: Target
                  };
                  const Icon = icons[type] || Activity;
                  return <Icon className="w-5 h-5" />;
                };

                const getActivityColor = (type: string) => {
                  if (['MEMBER_JOIN', 'MATCH_WIN'].includes(type)) return 'bg-green-100 text-green-700';
                  if (['PRACTICE', 'MATCH_DRAW'].includes(type)) return 'bg-blue-100 text-blue-700';
                  if (['MEMBER_LEAVE', 'MATCH_LOSS'].includes(type)) return 'bg-red-100 text-red-700';
                  return 'bg-gray-100 text-gray-700';
                };

                return (
                  <div key={act.id} className="flex gap-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getActivityColor(act.type)}`}>
                      {getActivityIcon(act.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <h4 className="font-medium">{act.title}</h4>
                        <span className="text-sm text-gray-500">{act.date} {act.time}</span>
                      </div>
                      <p className="text-sm text-gray-600">{act.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">👤 팀 관리 정보</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">팀장</span>
                  <button
                    onClick={() => handleMemberClick(team.admin.captainId)}
                    className="font-medium text-blue-600 hover:text-blue-700 underline"
                  >
                    {team.admin.captainName}
                  </button>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">생성자</span>
                  <span className="font-medium">{team.admin.createdBy}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">창단일</span>
                  <span className="font-medium">{new Date(team.foundedDate).toLocaleDateString()}</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">⚠️ 제재 정보</h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{team.admin.reportCount}</div>
                  <div className="text-sm text-gray-600">신고 접수</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{team.admin.warningCount}</div>
                  <div className="text-sm text-gray-600">경고 횟수</div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">📝 관리자 메모</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                {team.admin.notes || '메모 없음'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 팀 편집 모달 */}
      {showEditModal && team && (
        <EditTeamModal
          team={team}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
        />
      )}

      {/* 팀 해체 모달 */}
      {showDissolveModal && team && (
        <DissolveTeamModal
          team={team}
          onClose={() => setShowDissolveModal(false)}
          onSubmit={handleDissolveSubmit}
        />
      )}

      {/* 팀 메시지 모달 */}
      {showMessageModal && team && (
        <MessageTeamModal
          team={team}
          onClose={() => setShowMessageModal(false)}
          onSend={(message: string) => {
            console.log('팀 메시지 전송:', message);
            alert('팀에 메시지를 보냈습니다. (목업)');
            setShowMessageModal(false);
          }}
        />
      )}
    </div>
    </AdminLayout>
  );
};

// 팀 편집 모달
const EditTeamModal = ({ team, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({
    name: team.name,
    region: team.region,
    subRegion: team.subRegion || '',
    foundedDate: team.foundedDate || '',
    homeGround: team.homeGround || '',
    teamLevel: team.teamLevel,
    status: team.status,
    verified: team.verified
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">팀 정보 편집</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">팀 이름 <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">지역 <span className="text-red-500">*</span></label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="예: 서울, 경기, 인천"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">세부 지역</label>
              <input
                type="text"
                value={formData.subRegion}
                onChange={(e) => setFormData({ ...formData, subRegion: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="예: 강남구, 분당구"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">창단일</label>
            <input
              type="date"
              value={formData.foundedDate}
              onChange={(e) => setFormData({ ...formData, foundedDate: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">홈구장</label>
            <input
              type="text"
              value={formData.homeGround}
              onChange={(e) => setFormData({ ...formData, homeGround: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="예: 강남 스포츠파크"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">팀 레벨</label>
              <select
                value={formData.teamLevel}
                onChange={(e) => setFormData({ ...formData, teamLevel: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="입문">입문</option>
                <option value="초급">초급</option>
                <option value="중급">중급</option>
                <option value="고급">고급</option>
                <option value="세미프로">세미프로</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">팀 상태</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ACTIVE">활동중</option>
                <option value="INACTIVE">비활성</option>
                <option value="DISBANDED">해체</option>
              </select>
            </div>
          </div>

          <div className="flex items-center pt-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.verified}
                onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                className="w-4 h-4 text-blue-600 rounded"
              />
              <span className="text-sm font-medium text-gray-700">인증된 팀</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 팀 해체 모달
const DissolveTeamModal = ({ team, onClose, onSubmit }: any) => {
  const [formData, setFormData] = useState({
    reason: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      teamId: team.id,
      reason: formData.reason,
      notes: formData.notes,
      date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="bg-yellow-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            팀 해체
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>{team.name}</strong> 팀을 해체하려고 합니다. 해체 사유를 입력해주세요.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              해체 사유 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
              rows={3}
              placeholder="예: 팀원 부족, 활동 중단 등"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              관리자 메모 (선택)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-yellow-500"
              rows={2}
              placeholder="내부 관리용 메모"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 flex items-center gap-2"
            >
              <Ban className="w-4 h-4" />
              해체 실행
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 팀 메시지 모달
const MessageTeamModal = ({ team, onClose, onSend }: any) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    recipients: 'all' // 'all', 'captain', 'members'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSend(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            팀 메시지 보내기
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>{team.name}</strong> 팀에 메시지를 보냅니다.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              수신 대상 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.recipients}
              onChange={(e) => setFormData({ ...formData, recipients: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="all">전체 팀원</option>
              <option value="captain">팀장만</option>
              <option value="members">일반 멤버만</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              제목 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              placeholder="메시지 제목을 입력하세요"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              메시지 내용 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows={6}
              placeholder="팀에게 전달할 메시지를 입력하세요..."
              required
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              메시지 전송
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 통계 카드 컴포넌트
const StatCard = ({ icon: Icon, label, value, color }: any) => {
  const colorClasses: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200'
  };

  return (
    <div className="bg-white rounded-lg border-2 border-gray-100 p-6 hover:shadow-md transition-shadow">
      <div className={`w-12 h-12 rounded-lg border-2 ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </div>
  );
};

export default TeamDetailPage;
