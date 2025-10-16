import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Edit, Ban, Trash2, AlertCircle, CheckCircle,
  Clock, MapPin, Mail, Phone, Calendar, Activity,
  Shield, Users, FileText, Bell, TrendingUp, Award,
  Download, Send, Eye, Check, X, AlertTriangle, Star,
  Share2, MessageCircle, BarChart3, Target, Zap, CreditCard, PartyPopper
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

// 임시 타입 정의
interface UserDetail {
  id: number;
  name: string;
  email: string;
  phone?: string;
  profileImage?: string;
  region: string;
  subRegion?: string;
  role: 'USER' | 'CAPTAIN' | 'ADMIN';
  status: 'ACTIVE' | 'INACTIVE' | 'BANNED';
  verified: boolean;
  joinDate: string;
  lastActive: string;
  
  stats: {
    teamsJoined: number;
    postsCreated: number;
    commentsCreated: number; // 작성한 댓글 수
    applicationsSubmitted: number;
    applicationsReceived: number;
    approvalRate: number;
    responseRate: number;
    avgResponseTime: number;
    activityScore: number;
    matchesPlayed: number; // 조기축구 경기 참여 횟수
    winRate: number; // 승률
    punctuality: number; // 약속 시간 준수율
  };
  
  recentForm: Array<{
    date: string;
    type: 'POST' | 'APPLICATION' | 'MATCH' | 'TEAM_JOIN' | 'MERCENARY';
    result: 'SUCCESS' | 'PENDING' | 'REJECTED' | 'WIN' | 'DRAW' | 'LOSS';
  }>;
  
  // 활동 타임라인
  activityTimeline: Array<{
    id: number;
    date: string;
    time: string;
    type: string;
    title: string;
    description: string;
    status?: string;
  }>;
  
  // 팀 이력
  teamHistory: Array<{
    id: number;
    teamName: string;
    role: string;
    joinDate: string;
    leaveDate?: string;
    status: string;
    matchesPlayed: number;
    contributions: string;
  }>;
  
  // 결제 내역
  payments: Array<{
    id: number;
    date: string;
    type: string;
    description: string;
    amount: number;
    method: string;
    status: string;
    orderId: string;
  }>;

  // 이벤트 참여 내역
  eventHistory: Array<{
    id: number;
    eventName: string;
    eventType: string;
    participationDate: string;
    reward?: string;
    status: string;
    description: string;
  }>;

  // 신청 내역
  applications: {
    sent: Array<{
      id: number;
      postTitle: string;
      postType: string;
      targetTeam: string;
      submitDate: string;
      status: string;
      message: string;
    }>;
    received: Array<{
      id: number;
      applicantName: string;
      postTitle: string;
      postType: string;
      submitDate: string;
      status: string;
      message: string;
      responseDate?: string;
    }>;
  };

  // 작성글과 댓글
  posts: {
    written: Array<{
      id: number;
      title: string;
      type: 'TEAM' | 'MERCENARY' | 'MATCH';
      content: string;
      createdDate: string;
      status: 'ACTIVE' | 'CLOSED' | 'DELETED';
      views: number;
      applicants: number;
    }>;
    comments: Array<{
      id: number;
      postTitle: string;
      postId: number;
      content: string;
      createdDate: string;
      likes: number;
    }>;
  };
  
  preferredPosition?: string;
  skillLevel?: string;
  height?: string;
  weight?: string;
  birthDate?: string;
  marketValue?: string;

  // 경기별 평점
  matchRatings: Array<{
    date: string;
    opponent: string;
    rating: number;
    goals: number;
    assists: number;
  }>;

  // 조기축구 특화 지표
  morningStats: {
    noShowCount: number; // 노쇼 횟수
    mannerTemperature: number; // 매너 온도 (0-100)
    morningParticipationRate: number; // 아침 참여율 (%)
    consecutiveAttendance: number; // 연속 출석 일수
    preferredTimeSlots: string[]; // 선호 시간대
  };

  // 설문 기반 평가 (경기 후 동료 평가)
  surveyStats: {
    totalSurveys: number; // 총 평가 받은 횟수
    surveyParticipation: number; // 설문 참여율 (%)

    // 평가 항목 (5점 만점, 소수점 1자리)
    teamwork: number; // 팀워크
    communication: number; // 의사소통
    skillLevel: number; // 실력 수준
    sportsmanship: number; // 스포츠맨십
    punctuality: number; // 시간 준수
    attitude: number; // 태도/매너

    // 정성적 피드백 (가장 많이 받은 태그 top 5)
    topTags: string[];
  };

  admin: {
    ipAddress: string;
    device: string;
    lastLoginLocation: string;
    reportCount: number;
    warningCount: number;
    banHistory: Array<{
      date: string;
      reason: string;
      duration: string;
      adminName: string;
      liftedDate?: string;
    }>;
    notes: string;
  };
}

const UserDetailPage = () => {
  const { userId } = useParams<{ userId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [activeTab, setActiveTab] = useState<'overview' | 'stats' | 'activity' | 'teams' | 'written-posts' | 'comments' | 'applications' | 'payments' | 'events' | 'security'>('overview');
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [user, setUser] = useState<UserDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [selectedComment, setSelectedComment] = useState<any>(null);

  useEffect(() => {
    // TODO: 실제 API 호출로 대체
    fetchUserDetail();
  }, [userId]);

  // URL state에서 모달 열기 설정 확인
  useEffect(() => {
    if (location.state) {
      const state = location.state as any;
      if (state.openEditModal) {
        setShowEditModal(true);
        // state 제거 (뒤로가기 시 다시 열리지 않도록)
        navigate(location.pathname, { replace: true, state: {} });
      }
      if (state.openBanModal) {
        setShowBanModal(true);
        navigate(location.pathname, { replace: true, state: {} });
      }
      if (state.openMessage) {
        setShowMessageModal(true);
        navigate(location.pathname, { replace: true, state: {} });
      }
    }
  }, [location.state]);

  const fetchUserDetail = async () => {
    setLoading(true);
    setTimeout(() => {
      setUser({
        id: 12345,
        name: '김철수',
        email: 'user@example.com',
        phone: '010-1234-5678',
        region: '서울',
        subRegion: '강남구',
        role: 'USER',
        status: 'ACTIVE',
        verified: true,
        joinDate: '2024-09-10T10:00:00',
        lastActive: '2025-10-02T14:30:00',
        stats: {
          teamsJoined: 3,
          postsCreated: 5,
          commentsCreated: 4,
          applicationsSubmitted: 28,
          applicationsReceived: 15,
          approvalRate: 75,
          responseRate: 88,
          avgResponseTime: 45,
          activityScore: 82,
          matchesPlayed: 47,
          winRate: 68,
          punctuality: 95
        },
        recentForm: [
          { date: '2025-10-01', type: 'MATCH', result: 'WIN' },
          { date: '2025-09-30', type: 'MATCH', result: 'WIN' },
          { date: '2025-09-29', type: 'MATCH', result: 'DRAW' },
          { date: '2025-09-28', type: 'MATCH', result: 'LOSS' },
          { date: '2025-09-27', type: 'MATCH', result: 'WIN' }
        ],
        activityTimeline: [
          {
            id: 1,
            date: '2025-10-02',
            time: '14:30',
            type: 'POST_CREATE',
            title: '용병 모집글 작성',
            description: '[강남구] 조기축구 용병 모집 (10/5 토요일)',
            status: 'SUCCESS'
          },
          {
            id: 2,
            date: '2025-10-01',
            time: '09:15',
            type: 'APPLICATION_APPROVE',
            title: '신청 승인',
            description: '홍대FC 팀원 신청 승인',
            status: 'SUCCESS'
          },
          {
            id: 3,
            date: '2025-09-30',
            time: '18:45',
            type: 'MATCH_ATTEND',
            title: '경기 참여',
            description: '새벽FC vs 강남 유나이티드 (승리)',
            status: 'SUCCESS'
          },
          {
            id: 4,
            date: '2025-09-29',
            time: '16:20',
            type: 'APPLICATION_SUBMIT',
            title: '용병 신청',
            description: '판교 스타즈 용병 신청',
            status: 'PENDING'
          },
          {
            id: 5,
            date: '2025-09-28',
            time: '11:30',
            type: 'POST_EDIT',
            title: '모집글 수정',
            description: '[서울 전역] 주말 풋살 멤버 모집',
            status: 'SUCCESS'
          }
        ],
        teamHistory: [
          {
            id: 1,
            teamName: '새벽FC',
            role: 'MEMBER',
            joinDate: '2025-09-27',
            status: 'ACTIVE',
            matchesPlayed: 8,
            contributions: '공격 포인트 12개, 출석률 95%'
          },
          {
            id: 2,
            teamName: '강남 유나이티드',
            role: 'CAPTAIN',
            joinDate: '2024-11-15',
            status: 'ACTIVE',
            matchesPlayed: 34,
            contributions: '팀장으로서 20회 경기 주최'
          },
          {
            id: 3,
            teamName: '홍대 킥오프',
            role: 'MEMBER',
            joinDate: '2024-09-10',
            leaveDate: '2025-08-20',
            status: 'LEFT',
            matchesPlayed: 15,
            contributions: '미드필더로 활약, 평점 4.3'
          }
        ],
        payments: [
          {
            id: 1,
            date: '2025-10-05',
            type: '팀 가입비',
            description: '새벽FC 정기 멤버 가입',
            amount: 50000,
            method: '카카오페이',
            status: 'COMPLETED',
            orderId: 'ORD-20251005-001'
          },
          {
            id: 2,
            date: '2025-09-20',
            type: '용병 참가비',
            description: '판교 스타즈 vs 인천FC 용병 참가',
            amount: 15000,
            method: '신용카드',
            status: 'COMPLETED',
            orderId: 'ORD-20250920-089'
          },
          {
            id: 3,
            date: '2025-09-15',
            type: '매치 대관비',
            description: '탄천 종합운동장 경기장 대관 분담금',
            amount: 8000,
            method: '계좌이체',
            status: 'COMPLETED',
            orderId: 'ORD-20250915-234'
          },
          {
            id: 4,
            date: '2025-08-28',
            type: '이벤트 참가비',
            description: '여름 조기축구 토너먼트 참가비',
            amount: 30000,
            method: '토스',
            status: 'COMPLETED',
            orderId: 'ORD-20250828-156'
          },
          {
            id: 5,
            date: '2025-08-10',
            type: '프리미엄 등록',
            description: '프리미엄 회원 1개월 (취소됨)',
            amount: 9900,
            method: '카카오페이',
            status: 'REFUNDED',
            orderId: 'ORD-20250810-422'
          }
        ],
        eventHistory: [
          {
            id: 1,
            eventName: '가을 조기축구 토너먼트 2025',
            eventType: '토너먼트',
            participationDate: '2025-10-01',
            reward: '우승 (MVP 수상)',
            status: 'COMPLETED',
            description: '16강 토너먼트에서 새벽FC 소속으로 우승, 개인 MVP 선정'
          },
          {
            id: 2,
            eventName: '신규 회원 추천 이벤트',
            eventType: '추천 이벤트',
            participationDate: '2025-09-15',
            reward: '5,000 포인트',
            status: 'REWARD_RECEIVED',
            description: '친구 3명 추천 달성'
          },
          {
            id: 3,
            eventName: '출석 체크 챌린지',
            eventType: '출석 이벤트',
            participationDate: '2025-09-01 ~ 2025-09-30',
            reward: '경기 참가비 50% 할인권',
            status: 'COMPLETED',
            description: '30일 연속 출석 달성'
          },
          {
            id: 4,
            eventName: '여름 조기축구 토너먼트',
            eventType: '토너먼트',
            participationDate: '2025-08-28',
            reward: '준우승',
            status: 'COMPLETED',
            description: '강남 유나이티드 소속으로 준우승'
          },
          {
            id: 5,
            eventName: '첫 경기 완료 이벤트',
            eventType: '신규 가입 이벤트',
            participationDate: '2024-09-15',
            reward: '무료 유니폼',
            status: 'REWARD_RECEIVED',
            description: '첫 조기축구 경기 참여 완료'
          }
        ],
        applications: {
          sent: [
            {
              id: 1,
              postTitle: '판교 스타즈 MF 용병 모집',
              postType: 'MERCENARY',
              targetTeam: '판교 스타즈',
              submitDate: '2025-09-29T16:20:00',
              status: 'PENDING',
              message: '안녕하세요. 주중 저녁 참여 가능합니다.'
            },
            {
              id: 2,
              postTitle: '인천FC 정기 멤버 모집',
              postType: 'TEAM',
              targetTeam: '인천FC',
              submitDate: '2025-09-20T10:30:00',
              status: 'REJECTED',
              message: '정기 멤버로 활동하고 싶습니다.'
            }
          ],
          received: [
            {
              id: 1,
              applicantName: '이영희',
              postTitle: '[강남구] 조기축구 용병 모집',
              postType: 'MERCENARY',
              submitDate: '2025-10-01T08:30:00',
              status: 'APPROVED',
              message: '조기축구 경험 3년차입니다.',
              responseDate: '2025-10-01T09:15:00'
            },
            {
              id: 2,
              applicantName: '박민수',
              postTitle: '강남 유나이티드 신규 멤버 모집',
              postType: 'TEAM',
              submitDate: '2025-09-25T19:20:00',
              status: 'PENDING',
              message: '팀에 합류하고 싶습니다.'
            }
          ]
        },
        posts: {
          written: [
            {
              id: 1,
              title: '[강남구] 조기축구 용병 모집 (10/5 토요일)',
              type: 'MERCENARY',
              content: '새벽 6시 탄천종합운동장에서 용병 모집합니다. MF 포지션 우대합니다.',
              createdDate: '2025-10-02T14:30:00',
              status: 'ACTIVE',
              views: 124,
              applicants: 8
            },
            {
              id: 2,
              title: '[서울 전역] 주말 풋살 멤버 모집',
              type: 'TEAM',
              content: '주말 아침마다 활동하는 풋살팀입니다. 정기 멤버 모집 중입니다.',
              createdDate: '2025-09-28T11:30:00',
              status: 'ACTIVE',
              views: 256,
              applicants: 15
            },
            {
              id: 3,
              title: '10/10 새벽FC vs 강남유나이티드 친선경기',
              type: 'MATCH',
              content: '친선 경기 일정 공지드립니다. 많은 참여 부탁드립니다.',
              createdDate: '2025-09-25T09:00:00',
              status: 'CLOSED',
              views: 89,
              applicants: 22
            },
            {
              id: 4,
              title: '[판교] 평일 저녁 용병 구합니다',
              type: 'MERCENARY',
              content: '수요일 저녁 7시 판교 풋살장에서 경기 예정입니다.',
              createdDate: '2025-09-20T16:45:00',
              status: 'CLOSED',
              views: 67,
              applicants: 4
            },
            {
              id: 5,
              title: '강남 유나이티드 정기 멤버 모집',
              type: 'TEAM',
              content: '매주 토요일 새벽 활동하는 팀입니다. 초보자도 환영합니다!',
              createdDate: '2025-09-15T10:20:00',
              status: 'ACTIVE',
              views: 341,
              applicants: 27
            }
          ],
          comments: [
            {
              id: 1,
              postTitle: '새벽 축구 시작하시는 분들께',
              postId: 101,
              content: '초보자도 충분히 즐길 수 있어요! 분위기가 정말 좋습니다.',
              createdDate: '2025-10-01T15:30:00',
              likes: 12
            },
            {
              id: 2,
              postTitle: '탄천 운동장 주차 정보',
              postId: 102,
              content: '새벽 시간에는 무료 주차 가능합니다. 참고하세요!',
              createdDate: '2025-09-28T08:45:00',
              likes: 8
            },
            {
              id: 3,
              postTitle: '용병 vs 정기멤버 장단점',
              postId: 103,
              content: '용병은 자유롭지만 정기멤버는 팀워크가 좋습니다. 둘 다 추천!',
              createdDate: '2025-09-25T14:20:00',
              likes: 15
            },
            {
              id: 4,
              postTitle: '조기축구 준비물 추천',
              postId: 104,
              content: '축구화, 물, 여벌 옷은 필수입니다. 겨울엔 장갑도 챙기세요.',
              createdDate: '2025-09-20T11:10:00',
              likes: 5
            }
          ]
        },
        preferredPosition: 'MF',
        skillLevel: 'INTERMEDIATE',
        height: '178cm',
        weight: '72kg',
        birthDate: '1995-03-15',
        marketValue: '신뢰도 높음',
        matchRatings: [
          { date: '2025-10-01', opponent: '판교FC', rating: 8.5, goals: 2, assists: 1 },
          { date: '2025-09-30', opponent: '강남유나이티드', rating: 7.8, goals: 1, assists: 0 },
          { date: '2025-09-29', opponent: '홍대킥오프', rating: 7.2, goals: 0, assists: 2 },
          { date: '2025-09-25', opponent: '새벽FC', rating: 8.0, goals: 1, assists: 1 },
          { date: '2025-09-22', opponent: '인천스타즈', rating: 7.5, goals: 0, assists: 1 },
        ],
        morningStats: {
          noShowCount: 1, // 노쇼 1회
          mannerTemperature: 87.5, // 매너 온도 87.5도
          morningParticipationRate: 92, // 아침 참여율 92%
          consecutiveAttendance: 12, // 연속 12일 출석
          preferredTimeSlots: ['06:00-07:00', '07:00-08:00'], // 새벽 6시~8시 선호
        },
        surveyStats: {
          totalSurveys: 32, // 총 32회 평가 받음
          surveyParticipation: 68, // 설문 참여율 68% (47경기 중 32회 평가받음)

          // 동료 평가 점수 (5점 만점)
          teamwork: 4.5,
          communication: 4.3,
          skillLevel: 4.2,
          sportsmanship: 4.7,
          punctuality: 4.8,
          attitude: 4.6,

          // 가장 많이 받은 피드백 태그
          topTags: [
            '시간 약속을 잘 지킴',
            '팀워크가 좋음',
            '긍정적인 태도',
            '페어플레이 정신',
            '의사소통이 원활함'
          ]
        },
        admin: {
          ipAddress: '123.456.789.012',
          device: 'Chrome 120 / Windows 11',
          lastLoginLocation: '서울시 강남구',
          reportCount: 0,
          warningCount: 1,
          banHistory: [
            {
              date: '2025-05-15',
              reason: '부적절한 언어 사용',
              duration: '7일',
              adminName: '관리자A',
              liftedDate: '2025-05-22'
            }
          ],
          notes: '활발한 활동. 응답률 우수.'
        }
      });
      setLoading(false);
    }, 500);
  };

  const handleEdit = () => {
    setShowEditModal(true);
  };

  const handleEditSave = (editedData: any) => {
    console.log('사용자 정보 수정:', editedData);
    // TODO: 실제 API 호출
    if (user) {
      setUser({
        ...user,
        ...editedData
      });
    }
    setShowEditModal(false);
    alert('사용자 정보가 수정되었습니다. (목업)');
  };

  const handleBan = () => {
    setShowBanModal(true);
  };

  const handleBanSubmit = (banData: any) => {
    console.log('사용자 정지:', banData);
    // TODO: 실제 API 호출
    if (user) {
      setUser({
        ...user,
        status: 'BANNED'
      });
    }
    setShowBanModal(false);
    alert('사용자가 정지되었습니다. (목업)');
  };

  const handleDelete = () => {
    if (window.confirm('이 사용자를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.')) {
      console.log('삭제:', userId);
      // TODO: 삭제 API 호출
      navigate('/admin/data-management');
    }
  };

  if (loading) {
    return (
      <AdminLayout activePage="users">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
        </div>
      </AdminLayout>
    );
  }

  if (!user) {
    return (
      <AdminLayout activePage="users">
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">사용자를 찾을 수 없습니다.</p>
            <button
              onClick={() => navigate('/admin/users')}
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
      ACTIVE: { color: 'bg-green-100 text-green-700', icon: '⚡', text: '활성' },
      INACTIVE: { color: 'bg-gray-100 text-gray-700', icon: '💤', text: '비활성' },
      BANNED: { color: 'bg-red-100 text-red-700', icon: '🚫', text: '정지' }
    };
    const config = statusConfig[user.status];
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <span>{config.icon}</span>
        {config.text}
      </span>
    );
  };

  const getRoleBadge = () => {
    const roleConfig = {
      USER: { color: 'bg-blue-100 text-blue-700', text: '일반' },
      CAPTAIN: { color: 'bg-purple-100 text-purple-700', text: '팀장' },
      ADMIN: { color: 'bg-red-100 text-red-700', text: '관리자' }
    };
    const config = roleConfig[user.role];
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded text-xs font-medium ${config.color}`}>
        {config.text}
      </span>
    );
  };

  const getActivityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFormIcon = (result: string) => {
    if (result === 'WIN') return 'W';
    if (result === 'DRAW') return 'D';
    if (result === 'LOSS') return 'L';
    if (result === 'SUCCESS') return '✓';
    if (result === 'PENDING') return '•';
    return '✕';
  };

  const getFormColor = (result: string) => {
    if (result === 'WIN') return 'bg-green-500 text-white';
    if (result === 'DRAW') return 'bg-gray-400 text-white';
    if (result === 'LOSS') return 'bg-red-500 text-white';
    if (result === 'SUCCESS') return 'bg-blue-500 text-white';
    if (result === 'PENDING') return 'bg-yellow-500 text-white';
    return 'bg-gray-500 text-white';
  };

  return (
    <AdminLayout activePage="users">
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate('/admin/users')}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>사용자 목록으로</span>
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
                onClick={handleBan}
                className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700"
              >
                <Ban className="w-4 h-4" />
                정지
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

      {/* 프로필 헤더 - FotMob 스타일 (조기축구 테마) */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 border-b shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-start gap-6">
            {/* 프로필 사진 */}
            <div className="w-24 h-24 rounded-full bg-white flex items-center justify-center text-green-600 text-3xl font-bold shadow-lg border-4 border-white">
              {user.name.charAt(0)}
            </div>

            {/* 기본 정보 */}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-bold text-white">{user.name}</h1>
                <span className="text-green-100">#{user.id}</span>
                {getRoleBadge()}
                {getStatusBadge()}
                {user.verified && (
                  <span className="inline-flex items-center gap-1 bg-white text-green-600 px-2 py-1 rounded-full text-xs font-medium">
                    <CheckCircle className="w-3 h-3" />
                    본인인증
                  </span>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-white mb-4">
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4" />
                  {user.email}
                </div>
                {user.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {user.phone}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  {user.region} {user.subRegion}
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  가입: {new Date(user.joinDate).toLocaleDateString()}
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  최근 활동: {new Date(user.lastActive).toLocaleString()}
                </div>
                {user.preferredPosition && (
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    선호 포지션: {user.preferredPosition} | {user.skillLevel}
                  </div>
                )}
              </div>

              {/* FotMob 스타일 최근 경기 폼 */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-white font-medium">최근 5경기:</span>
                <div className="flex gap-1">
                  {user.recentForm.map((form, index) => (
                    <div
                      key={index}
                      className={`w-8 h-8 rounded flex items-center justify-center text-xs font-bold ${getFormColor(form.result)}`}
                      title={`${form.date} - ${form.type} (${form.result})`}
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
                <div className="text-3xl font-bold text-green-600">{user.stats.matchesPlayed}</div>
                <div className="text-xs text-gray-600 mt-1">총 경기 수</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-md">
                <div className="text-3xl font-bold text-blue-600">{user.stats.winRate}%</div>
                <div className="text-xs text-gray-600 mt-1">승률</div>
              </div>
              <div className="bg-white p-4 rounded-lg text-center shadow-md">
                <div className="text-3xl font-bold text-purple-600">{user.stats.punctuality}%</div>
                <div className="text-xs text-gray-600 mt-1">시간 준수율</div>
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
              { id: 'stats', label: '통계 & 평점', icon: BarChart3 },
              { id: 'activity', label: '활동 타임라인', icon: TrendingUp },
              { id: 'teams', label: '팀 이력', icon: Users },
              { id: 'written-posts', label: '작성글', icon: FileText },
              { id: 'comments', label: '작성 댓글', icon: MessageCircle },
              { id: 'applications', label: '용병/팀원 신청', icon: Send },
              { id: 'payments', label: '결제 내역', icon: CreditCard },
              { id: 'events', label: '이벤트 참여', icon: PartyPopper },
              { id: 'security', label: '보안/제재', icon: Shield }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-4 py-4 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-green-600 text-green-600'
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
            {/* 조기축구 통계 그리드 - FotMob 스타일 */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <StatCard
                icon={Activity}
                label="참여 경기"
                value={user.stats.matchesPlayed}
                color="green"
                onClick={() => {
                  console.log('참여 경기 클릭 -> stats 탭으로 이동');
                  setActiveTab('stats');
                }}
              />
              <StatCard
                icon={Users}
                label="소속 팀"
                value={user.stats.teamsJoined}
                color="blue"
                onClick={() => {
                  console.log('소속 팀 클릭 -> teams 탭으로 이동');
                  setActiveTab('teams');
                }}
              />
              <StatCard
                icon={FileText}
                label="작성글"
                value={user.stats.postsCreated}
                color="purple"
                onClick={() => {
                  console.log('작성글 클릭 -> written-posts 탭으로 이동');
                  setActiveTab('written-posts');
                }}
              />
              <StatCard
                icon={MessageCircle}
                label="작성 댓글"
                value={user.stats.commentsCreated}
                color="blue"
                onClick={() => {
                  console.log('작성 댓글 클릭 -> comments 탭으로 이동');
                  setActiveTab('comments');
                }}
              />
              <StatCard
                icon={Award}
                label="용병 신청"
                value={user.stats.applicationsSubmitted}
                color="orange"
                onClick={() => {
                  console.log('용병 신청 클릭 -> applications 탭으로 이동');
                  setActiveTab('applications');
                }}
              />
            </div>

            {/* 조기축구 선수 능력치 - FotMob 레이더 차트 스타일 */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">⚽ 선수 신뢰도 지표</h3>
              <div className="space-y-4">
                <StatBar
                  label="승률"
                  value={user.stats.winRate}
                  max={100}
                  unit="%"
                  color="green"
                />
                <StatBar
                  label="시간 준수율"
                  value={user.stats.punctuality}
                  max={100}
                  unit="%"
                  color="blue"
                />
                <StatBar
                  label="신청 승인율"
                  value={user.stats.approvalRate}
                  max={100}
                  unit="%"
                  color="purple"
                />
                <StatBar
                  label="응답률"
                  value={user.stats.responseRate}
                  max={100}
                  unit="%"
                  color="orange"
                />
              </div>
            </div>

            {/* 조기축구 선수 프로필 카드 - FotMob Bio 스타일 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">⚽ 선수 정보</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">선호 포지션</span>
                    <span className="font-semibold text-green-600">{user.preferredPosition || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">실력 수준</span>
                    <span className="font-semibold">{user.skillLevel || '-'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">활동 지역</span>
                    <span className="font-semibold">{user.region} {user.subRegion}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">경기 참여</span>
                    <span className="font-semibold text-blue-600">{user.stats.matchesPlayed}경기</span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border p-6">
                <h3 className="text-lg font-semibold mb-4">📊 응답 속도</h3>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-blue-600">{user.stats.avgResponseTime}</span>
                  <span className="text-gray-600 text-lg">분</span>
                </div>
                <p className="text-sm text-gray-500">
                  평균 응답 시간이 빠를수록 신뢰도가 높습니다
                </p>
                <div className="mt-4 pt-4 border-t">
                  <div className="text-sm text-gray-600">
                    응답률: <span className="font-semibold text-green-600">{user.stats.responseRate}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            {/* 조기축구 특화 지표 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border p-6 text-center">
                <div className="text-4xl mb-2">🌡️</div>
                <div className="text-3xl font-bold text-green-600">{user.morningStats.mannerTemperature}°</div>
                <div className="text-sm text-gray-600 mt-1">매너 온도</div>
                <div className="text-xs text-gray-500 mt-1">높을수록 매너가 좋음</div>
              </div>
              <div className="bg-white rounded-lg border p-6 text-center">
                <div className="text-4xl mb-2">🔥</div>
                <div className="text-3xl font-bold text-orange-600">{user.morningStats.consecutiveAttendance}일</div>
                <div className="text-sm text-gray-600 mt-1">연속 출석</div>
                <div className="text-xs text-gray-500 mt-1">현재 연속 출석 일수</div>
              </div>
              <div className="bg-white rounded-lg border p-6 text-center">
                <div className="text-4xl mb-2">⏰</div>
                <div className="text-3xl font-bold text-blue-600">{user.morningStats.morningParticipationRate}%</div>
                <div className="text-sm text-gray-600 mt-1">아침 참여율</div>
                <div className="text-xs text-gray-500 mt-1">새벽 경기 참여 비율</div>
              </div>
              <div className="bg-white rounded-lg border p-6 text-center">
                <div className="text-4xl mb-2">{user.morningStats.noShowCount === 0 ? '✅' : '⚠️'}</div>
                <div className={`text-3xl font-bold ${user.morningStats.noShowCount === 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {user.morningStats.noShowCount}회
                </div>
                <div className="text-sm text-gray-600 mt-1">노쇼 기록</div>
                <div className="text-xs text-gray-500 mt-1">약속 불이행 횟수</div>
              </div>
            </div>

            {/* 선호 시간대 */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-600" />
                선호 경기 시간대
              </h3>
              <div className="flex gap-2 flex-wrap">
                {user.morningStats.preferredTimeSlots.map((slot, index) => (
                  <span key={index} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg font-medium">
                    🌅 {slot}
                  </span>
                ))}
              </div>
            </div>

            {/* 동료 평가 (설문 기반) */}
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Target className="w-5 h-5 text-green-600" />
                  동료 평가 (경기 후 설문)
                </h3>
                <div className="text-sm text-gray-600">
                  총 <span className="font-bold text-green-600">{user.surveyStats.totalSurveys}명</span> 평가
                  <span className="ml-2 text-xs text-gray-500">
                    (참여율 {user.surveyStats.surveyParticipation}%)
                  </span>
                </div>
              </div>
              <PlayerSurveyRatings surveyStats={user.surveyStats} />
            </div>

            {/* 경기별 평점 - FotMob 스타일 */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-blue-600" />
                최근 경기 평점
              </h3>
              <div className="space-y-3">
                {user.matchRatings.map((match, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="flex-shrink-0 w-20 text-sm text-gray-600">
                      {new Date(match.date).toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' })}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">vs {match.opponent}</div>
                      <div className="text-sm text-gray-500">
                        {match.goals > 0 && <span className="mr-3">⚽ {match.goals}골</span>}
                        {match.assists > 0 && <span>🎯 {match.assists}도움</span>}
                      </div>
                    </div>
                    <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${
                      match.rating >= 8.0 ? 'bg-green-500 text-white' :
                      match.rating >= 7.0 ? 'bg-blue-500 text-white' :
                      match.rating >= 6.0 ? 'bg-yellow-500 text-white' :
                      'bg-red-500 text-white'
                    }`}>
                      {match.rating.toFixed(1)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 평균 평점 요약 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border p-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {(user.matchRatings.reduce((sum, m) => sum + m.rating, 0) / user.matchRatings.length).toFixed(2)}
                </div>
                <div className="text-sm text-gray-600 mt-1">평균 평점</div>
              </div>
              <div className="bg-white rounded-lg border p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {user.matchRatings.reduce((sum, m) => sum + m.goals, 0)}
                </div>
                <div className="text-sm text-gray-600 mt-1">총 골</div>
              </div>
              <div className="bg-white rounded-lg border p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {user.matchRatings.reduce((sum, m) => sum + m.assists, 0)}
                </div>
                <div className="text-sm text-gray-600 mt-1">총 어시스트</div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'activity' && (
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b"><h3 className="text-lg font-semibold">🕒 조기축구 활동 타임라인</h3></div>
              <div className="p-6 space-y-4">
                {user.activityTimeline.map(act => {
                  const getActivityIcon = (type: string) => {
                    const icons: any = {
                      POST_CREATE: FileText, POST_EDIT: FileText,
                      APPLICATION_SUBMIT: Send, APPLICATION_APPROVE: Send, APPLICATION_REJECT: Send,
                      TEAM_JOIN: Users, TEAM_LEAVE: Users, MATCH_ATTEND: Activity
                    };
                    const Icon = icons[type] || Activity;
                    return <Icon className="w-5 h-5" />;
                  };

                  const getActivityColor = (type: string) => {
                    if (['POST_CREATE', 'APPLICATION_APPROVE', 'TEAM_JOIN', 'MATCH_ATTEND'].includes(type)) return 'bg-green-100 text-green-700';
                    if (['POST_EDIT', 'APPLICATION_SUBMIT'].includes(type)) return 'bg-blue-100 text-blue-700';
                    if (['APPLICATION_REJECT', 'TEAM_LEAVE'].includes(type)) return 'bg-red-100 text-red-700';
                    return 'bg-gray-100 text-gray-700';
                  };

                  const isClickable = ['POST_CREATE', 'POST_EDIT'].includes(act.type);

                  const handleClick = () => {
                    if (isClickable) {
                      setActiveTab('written-posts');
                      // 해당 글로 스크롤
                      setTimeout(() => {
                        const postElement = document.getElementById('post-1');
                        if (postElement) {
                          postElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
                          setSelectedPostId(1);
                          setTimeout(() => setSelectedPostId(null), 3000);
                        }
                      }, 100);
                    }
                  };

                  return (
                      <div
                        key={act.id}
                        className={`flex gap-4 ${isClickable ? 'cursor-pointer hover:bg-gray-100 p-3 rounded-lg -mx-3 transition-colors' : ''}`}
                        onClick={handleClick}
                      >
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${getActivityColor(act.type)}`}>
                          {getActivityIcon(act.type)}
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between mb-1">
                            <h4 className="font-medium flex items-center gap-2">
                              {act.title}
                              {isClickable && <span className="text-xs text-blue-600">→ 글 보기</span>}
                            </h4>
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

        {activeTab === 'teams' && (
            <div className="space-y-4">
              {user.teamHistory.map(team => (
                  <div key={team.id} className="bg-white rounded-lg border p-6">
                    <div className="flex justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3
                            className="text-xl font-bold text-blue-600 hover:text-blue-700 cursor-pointer underline"
                            onClick={() => navigate(`/admin/teams/${team.id}`)}
                          >
                            {team.teamName}
                          </h3>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${team.role === 'CAPTAIN' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                        {team.role === 'CAPTAIN' ? '팀장' : '멤버'}
                      </span>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${team.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                        {team.status === 'ACTIVE' ? '활동중' : '탈퇴'}
                      </span>
                        </div>
                        <div className="text-sm text-gray-600">
                          가입: {team.joinDate}
                          {team.leaveDate && <span className="ml-4">탈퇴: {team.leaveDate}</span>}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-blue-600">{team.matchesPlayed}</div>
                        <div className="text-xs text-gray-600">경기 참여</div>
                      </div>
                    </div>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm font-medium text-gray-700 mb-1">기여도</div>
                      <div className="text-sm text-gray-600">{team.contributions}</div>
                    </div>
                  </div>
              ))}
            </div>
        )}

        {activeTab === 'written-posts' && (
          <div className="space-y-6">
            {/* 작성글 섹션 */}
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-600" />
                  작성한 모집글 ({user.posts.written.length})
                </h3>
              </div>
              <div className="divide-y">
                {user.posts.written.map((post) => {
                  const getTypeLabel = (type: string) => {
                    const labels: any = {
                      TEAM: { text: '팀원모집', color: 'bg-blue-100 text-blue-700' },
                      MERCENARY: { text: '용병모집', color: 'bg-green-100 text-green-700' },
                      MATCH: { text: '경기공지', color: 'bg-purple-100 text-purple-700' }
                    };
                    return labels[type] || labels.TEAM;
                  };

                  const getStatusLabel = (status: string) => {
                    const labels: any = {
                      ACTIVE: { text: '모집중', color: 'bg-green-100 text-green-700' },
                      CLOSED: { text: '마감', color: 'bg-gray-100 text-gray-700' },
                      DELETED: { text: '삭제됨', color: 'bg-red-100 text-red-700' }
                    };
                    return labels[status] || labels.ACTIVE;
                  };

                  const typeLabel = getTypeLabel(post.type);
                  const statusLabel = getStatusLabel(post.status);

                  return (
                    <div
                      key={post.id}
                      id={`post-${post.id}`}
                      onClick={() => {
                        setSelectedPost(post);
                        setShowPostModal(true);
                      }}
                      className={`p-6 hover:bg-gray-100 transition-colors cursor-pointer ${
                        selectedPostId === post.id ? 'bg-yellow-50 border-l-4 border-l-green-500' : ''
                      }`}
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${typeLabel.color}`}>
                              {typeLabel.text}
                            </span>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${statusLabel.color}`}>
                              {statusLabel.text}
                            </span>
                          </div>
                          <h4 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                            {post.title}
                            <span className="text-xs text-blue-600">→ 상세보기</span>
                          </h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{post.content}</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span>📅 {new Date(post.createdDate).toLocaleString()}</span>
                            <span>👁 조회 {post.views}</span>
                            <span>✉️ 신청 {post.applicants}명</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'comments' && (
          <div className="space-y-6">
            {/* 댓글 섹션 */}
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                  작성한 댓글 ({user.posts.comments.length})
                </h3>
              </div>
              <div className="divide-y">
                {user.posts.comments.map((comment) => (
                  <div
                    key={comment.id}
                    id={`comment-${comment.id}`}
                    onClick={() => {
                      setSelectedComment(comment);
                      setShowCommentModal(true);
                    }}
                    className={`p-6 hover:bg-gray-100 transition-colors cursor-pointer ${
                      selectedPostId === comment.id ? 'bg-yellow-50 border-l-4 border-l-blue-500' : ''
                    }`}
                  >
                    <div className="mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        게시글: <span className="text-blue-600">{comment.postTitle}</span>
                      </span>
                    </div>
                    <p className="text-gray-900 mb-3 flex items-center gap-2">
                      {comment.content}
                      <span className="text-xs text-blue-600">→ 상세보기</span>
                    </p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>📅 {new Date(comment.createdDate).toLocaleString()}</span>
                      <span>❤️ {comment.likes} 좋아요</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b"><h3 className="text-lg font-semibold">📤 보낸 용병/팀원 신청 ({user.applications.sent.length})</h3></div>
                <div className="divide-y">
                  {user.applications.sent.map(app => {
                    const getStatusBadge = (status: string) => {
                      const config: any = {
                        PENDING: { color: 'bg-yellow-100 text-yellow-700', text: '대기중' },
                        APPROVED: { color: 'bg-green-100 text-green-700', text: '승인됨' },
                        REJECTED: { color: 'bg-red-100 text-red-700', text: '거절됨' }
                      };
                      const { color, text } = config[status];
                      return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{text}</span>;
                    };

                    return (
                        <div key={app.id} className="p-6">
                          <div className="flex justify-between mb-3">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">{app.postTitle}</h4>
                                {getStatusBadge(app.status)}
                              </div>
                              <div className="text-sm text-gray-600">
                                대상: {app.targetTeam} | 신청일: {new Date(app.submitDate).toLocaleString()}
                              </div>
                            </div>
                          </div>
                          <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">{app.message}</div>
                        </div>
                    );
                  })}
                </div>
              </div>

              <div className="bg-white rounded-lg border">
                <div className="p-6 border-b"><h3 className="text-lg font-semibold">📥 받은 용병/팀원 신청 ({user.applications.received.length})</h3></div>
                <div className="divide-y">
                  {user.applications.received.map(app => {
                    const getStatusBadge = (status: string) => {
                      const config: any = {
                        PENDING: { color: 'bg-yellow-100 text-yellow-700', text: '대기중' },
                        APPROVED: { color: 'bg-green-100 text-green-700', text: '승인됨' },
                        REJECTED: { color: 'bg-red-100 text-red-700', text: '거절됨' }
                      };
                      const { color, text } = config[status];
                      return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{text}</span>;
                    };

                    const handleApprove = (appId: number) => {
                      alert(`신청 #${appId} 승인 (목업)`);
                    };

                    const handleReject = (appId: number) => {
                      alert(`신청 #${appId} 거절 (목업)`);
                    };

                    return (
                        <div key={app.id} className="p-6">
                          <div className="flex justify-between mb-3">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="font-medium">{app.postTitle}</h4>
                                {getStatusBadge(app.status)}
                              </div>
                              <div className="text-sm text-gray-600">
                                신청자: {app.applicantName} | 신청일: {new Date(app.submitDate).toLocaleString()}
                                {app.responseDate && <span> | 처리일: {new Date(app.responseDate).toLocaleString()}</span>}
                              </div>
                            </div>
                            {app.status === 'PENDING' && (
                                <div className="flex gap-2">
                                  <button onClick={() => handleApprove(app.id)} className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 text-sm">
                                    승인
                                  </button>
                                  <button onClick={() => handleReject(app.id)} className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700 text-sm">
                                    거절
                                  </button>
                                </div>
                            )}
                          </div>
                          <div className="bg-gray-50 p-3 rounded text-sm text-gray-700">{app.message}</div>
                        </div>
                    );
                  })}
                </div>
              </div>
            </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* 결제 내역 요약 */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-lg border p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {user.payments.filter(p => p.status === 'COMPLETED').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">완료된 결제</div>
              </div>
              <div className="bg-white rounded-lg border p-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  ₩{user.payments.filter(p => p.status === 'COMPLETED').reduce((sum, p) => sum + p.amount, 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600 mt-1">총 결제 금액</div>
              </div>
              <div className="bg-white rounded-lg border p-6 text-center">
                <div className="text-3xl font-bold text-red-600">
                  {user.payments.filter(p => p.status === 'REFUNDED').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">환불 건수</div>
              </div>
            </div>

            {/* 결제 내역 테이블 */}
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  결제 내역 ({user.payments.length})
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        주문번호
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        날짜
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        유형
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        설명
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        금액
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        결제수단
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        상태
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {user.payments.map(payment => {
                      const getStatusBadge = (status: string) => {
                        const config: any = {
                          COMPLETED: { color: 'bg-green-100 text-green-700', text: '완료' },
                          PENDING: { color: 'bg-yellow-100 text-yellow-700', text: '대기중' },
                          REFUNDED: { color: 'bg-red-100 text-red-700', text: '환불됨' },
                          FAILED: { color: 'bg-gray-100 text-gray-700', text: '실패' }
                        };
                        const { color, text } = config[status] || config.PENDING;
                        return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{text}</span>;
                      };

                      return (
                        <tr key={payment.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-500">
                            {payment.orderId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {payment.type}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {payment.description}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                            ₩{payment.amount.toLocaleString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                            {payment.method}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {getStatusBadge(payment.status)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'events' && (
          <div className="space-y-6">
            {/* 이벤트 참여 요약 */}
            <div className="grid grid-cols-4 gap-4">
              <div className="bg-white rounded-lg border p-6 text-center">
                <div className="text-3xl font-bold text-purple-600">
                  {user.eventHistory.length}
                </div>
                <div className="text-sm text-gray-600 mt-1">총 참여 이벤트</div>
              </div>
              <div className="bg-white rounded-lg border p-6 text-center">
                <div className="text-3xl font-bold text-green-600">
                  {user.eventHistory.filter(e => e.status === 'COMPLETED').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">완료</div>
              </div>
              <div className="bg-white rounded-lg border p-6 text-center">
                <div className="text-3xl font-bold text-blue-600">
                  {user.eventHistory.filter(e => e.status === 'REWARD_RECEIVED').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">보상 수령</div>
              </div>
              <div className="bg-white rounded-lg border p-6 text-center">
                <div className="text-3xl font-bold text-orange-600">
                  {user.eventHistory.filter(e => e.eventType === '토너먼트').length}
                </div>
                <div className="text-sm text-gray-600 mt-1">토너먼트 참가</div>
              </div>
            </div>

            {/* 이벤트 참여 내역 */}
            <div className="bg-white rounded-lg border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <PartyPopper className="w-5 h-5 text-purple-600" />
                  이벤트 참여 내역 ({user.eventHistory.length})
                </h3>
              </div>
              <div className="divide-y">
                {user.eventHistory.map(event => {
                  const getEventIcon = (type: string) => {
                    if (type === '토너먼트') return '🏆';
                    if (type === '추천 이벤트') return '👥';
                    if (type === '출석 이벤트') return '✅';
                    if (type === '신규 가입 이벤트') return '🎉';
                    return '🎁';
                  };

                  const getStatusBadge = (status: string) => {
                    const config: any = {
                      COMPLETED: { color: 'bg-green-100 text-green-700', text: '완료' },
                      REWARD_RECEIVED: { color: 'bg-blue-100 text-blue-700', text: '보상 수령' },
                      IN_PROGRESS: { color: 'bg-yellow-100 text-yellow-700', text: '진행중' },
                      EXPIRED: { color: 'bg-gray-100 text-gray-700', text: '만료됨' }
                    };
                    const { color, text } = config[status] || config.COMPLETED;
                    return <span className={`px-2 py-1 rounded-full text-xs font-medium ${color}`}>{text}</span>;
                  };

                  return (
                    <div key={event.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-start gap-4">
                        <div className="text-4xl">{getEventIcon(event.eventType)}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">{event.eventName}</h4>
                            {getStatusBadge(event.status)}
                          </div>
                          <div className="grid grid-cols-3 gap-4 text-sm mb-3">
                            <div>
                              <span className="text-gray-500">유형:</span>{' '}
                              <span className="font-medium text-gray-900">{event.eventType}</span>
                            </div>
                            <div>
                              <span className="text-gray-500">참여일:</span>{' '}
                              <span className="font-medium text-gray-900">{event.participationDate}</span>
                            </div>
                            {event.reward && (
                              <div>
                                <span className="text-gray-500">보상:</span>{' '}
                                <span className="font-medium text-blue-600">{event.reward}</span>
                              </div>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                            {event.description}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            {/* 보안 정보 */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">접속 정보</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">IP 주소</span>
                  <span className="font-medium">{user.admin.ipAddress}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">디바이스</span>
                  <span className="font-medium">{user.admin.device}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">마지막 접속 위치</span>
                  <span className="font-medium">{user.admin.lastLoginLocation}</span>
                </div>
              </div>
            </div>

            {/* 제재 정보 */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">제재 정보</h3>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{user.admin.reportCount}</div>
                  <div className="text-sm text-gray-600">신고 접수</div>
                </div>
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <div className="text-2xl font-bold text-orange-600">{user.admin.warningCount}</div>
                  <div className="text-sm text-gray-600">경고 횟수</div>
                </div>
                <div className="text-center p-4 bg-red-50 rounded-lg">
                  <div className="text-2xl font-bold text-red-600">{user.admin.banHistory.length}</div>
                  <div className="text-sm text-gray-600">정지 이력</div>
                </div>
              </div>

              {user.admin.banHistory.length > 0 && (
                <div>
                  <h4 className="font-medium mb-3">정지 이력</h4>
                  <div className="space-y-3">
                    {user.admin.banHistory.map((ban, index) => (
                      <div key={index} className="border rounded-lg p-4">
                        <div className="flex justify-between mb-2">
                          <span className="font-medium text-red-600">정지 기간: {ban.duration}</span>
                          <span className="text-sm text-gray-600">{ban.date}</span>
                        </div>
                        <div className="text-sm text-gray-700 mb-1">사유: {ban.reason}</div>
                        <div className="text-sm text-gray-600">처리자: {ban.adminName}</div>
                        {ban.liftedDate && (
                          <div className="text-sm text-green-600 mt-2">해제일: {ban.liftedDate}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* 관리자 메모 */}
            <div className="bg-white rounded-lg border p-6">
              <h3 className="text-lg font-semibold mb-4">관리자 메모</h3>
              <div className="bg-gray-50 p-4 rounded-lg text-sm text-gray-700">
                {user.admin.notes || '메모 없음'}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 사용자 편집 모달 */}
      {showEditModal && user && (
        <EditUserModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={handleEditSave}
        />
      )}

      {/* 사용자 정지 모달 */}
      {showBanModal && user && (
        <BanUserModal
          user={user}
          onClose={() => setShowBanModal(false)}
          onSubmit={handleBanSubmit}
        />
      )}

      {/* 사용자 메시지 모달 */}
      {showMessageModal && user && (
        <MessageUserModal
          user={user}
          onClose={() => setShowMessageModal(false)}
          onSend={(message: string) => {
            console.log('사용자 메시지 전송:', message);
            alert('사용자에게 메시지를 보냈습니다. (목업)');
            setShowMessageModal(false);
          }}
        />
      )}

      {/* 작성글 상세 모달 */}
      {showPostModal && selectedPost && (
        <PostDetailModal
          post={selectedPost}
          onClose={() => {
            setShowPostModal(false);
            setSelectedPost(null);
          }}
        />
      )}

      {/* 댓글 상세 모달 */}
      {showCommentModal && selectedComment && (
        <CommentDetailModal
          comment={selectedComment}
          onClose={() => {
            setShowCommentModal(false);
            setSelectedComment(null);
          }}
        />
      )}
    </div>
    </AdminLayout>
  );
};

// 사용자 편집 모달 컴포넌트
const EditUserModal = ({ user, onClose, onSave }: any) => {
  const [formData, setFormData] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone || '',
    region: user.region,
    subRegion: user.subRegion || '',
    role: user.role,
    status: user.status,
    verified: user.verified,
    preferredPosition: user.preferredPosition || '',
    skillLevel: user.skillLevel || '',
    height: user.height || '',
    weight: user.weight || '',
    birthDate: user.birthDate || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold">사용자 정보 편집</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* 기본 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이름</label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">이메일</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">전화번호</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">권한</label>
              <select
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="USER">일반</option>
                <option value="CAPTAIN">팀장</option>
                <option value="ADMIN">관리자</option>
              </select>
            </div>
          </div>

          {/* 지역 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">지역</label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">세부 지역</label>
              <input
                type="text"
                value={formData.subRegion}
                onChange={(e) => setFormData({ ...formData, subRegion: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* 조기축구 정보 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">선호 포지션</label>
              <select
                value={formData.preferredPosition}
                onChange={(e) => setFormData({ ...formData, preferredPosition: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">선택 안함</option>
                <option value="GK">골키퍼</option>
                <option value="DF">수비수</option>
                <option value="MF">미드필더</option>
                <option value="FW">공격수</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">실력 수준</label>
              <select
                value={formData.skillLevel}
                onChange={(e) => setFormData({ ...formData, skillLevel: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="">선택 안함</option>
                <option value="BEGINNER">입문</option>
                <option value="INTERMEDIATE">중급</option>
                <option value="ADVANCED">고급</option>
              </select>
            </div>
          </div>

          {/* 신체 정보 */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">신장</label>
              <input
                type="text"
                value={formData.height}
                onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="178cm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">체중</label>
              <input
                type="text"
                value={formData.weight}
                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="72kg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">생년월일</label>
              <input
                type="date"
                value={formData.birthDate}
                onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* 계정 상태 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">계정 상태</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="ACTIVE">활성</option>
                <option value="INACTIVE">비활성</option>
                <option value="BANNED">정지</option>
              </select>
            </div>
            <div className="flex items-center pt-7">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.verified}
                  onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                  className="w-4 h-4 text-green-600 rounded"
                />
                <span className="text-sm font-medium text-gray-700">본인인증 완료</span>
              </label>
            </div>
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 사용자 정지 모달 컴포넌트
const BanUserModal = ({ user, onClose, onSubmit }: any) => {
  const [formData, setFormData] = useState({
    reason: '',
    duration: '7',
    customDuration: '',
    notes: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const duration = formData.duration === 'custom' ? formData.customDuration : formData.duration;
    onSubmit({
      userId: user.id,
      reason: formData.reason,
      duration: duration + '일',
      notes: formData.notes,
      date: new Date().toISOString().split('T')[0],
      adminName: '관리자' // 실제로는 로그인한 관리자 정보
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-lg w-full">
        <div className="bg-red-600 text-white px-6 py-4 rounded-t-xl flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <AlertTriangle className="w-6 h-6" />
            사용자 정지
          </h2>
          <button onClick={onClose} className="text-white hover:text-gray-200">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>{user.name}</strong> 사용자를 정지하려고 합니다. 정지 사유와 기간을 입력해주세요.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              정지 사유 <span className="text-red-500">*</span>
            </label>
            <textarea
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              rows={3}
              placeholder="예: 부적절한 언어 사용, 약속 불이행 등"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              정지 기간 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
              required
            >
              <option value="1">1일</option>
              <option value="3">3일</option>
              <option value="7">7일</option>
              <option value="14">14일</option>
              <option value="30">30일</option>
              <option value="permanent">영구 정지</option>
              <option value="custom">직접 입력</option>
            </select>
          </div>

          {formData.duration === 'custom' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                정지 일수
              </label>
              <input
                type="number"
                min="1"
                value={formData.customDuration}
                onChange={(e) => setFormData({ ...formData, customDuration: e.target.value })}
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
                placeholder="일수 입력"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              관리자 메모 (선택)
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-red-500"
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
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 flex items-center gap-2"
            >
              <Ban className="w-4 h-4" />
              정지 실행
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// 사용자 메시지 모달
const MessageUserModal = ({ user, onClose, onSend }: any) => {
  const [formData, setFormData] = useState({
    subject: '',
    message: '',
    priority: 'normal' // 'low', 'normal', 'high', 'urgent'
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
            <MessageCircle className="w-6 h-6 text-green-600" />
            사용자 메시지 보내기
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800">
              <strong>{user.name}</strong> ({user.email})님에게 메시지를 보냅니다.
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              중요도 <span className="text-red-500">*</span>
            </label>
            <select
              value={formData.priority}
              onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              required
            >
              <option value="low">낮음</option>
              <option value="normal">보통</option>
              <option value="high">높음</option>
              <option value="urgent">긴급</option>
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
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
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
              className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
              rows={8}
              placeholder="사용자에게 전달할 메시지를 입력하세요...&#10;&#10;예시:&#10;- 정책 위반 경고&#10;- 계정 관련 안내&#10;- 이벤트 알림 등"
              required
            />
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p className="text-xs text-blue-700">
              💡 메시지는 사용자의 이메일과 앱 알림으로 전송됩니다.
            </p>
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
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
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

// 동료 평가 (설문 기반) 컴포넌트
const PlayerSurveyRatings = ({ surveyStats }: any) => {
  const stats = [
    { label: '팀워크', value: surveyStats.teamwork, icon: '🤝', color: 'text-blue-600', bgColor: 'from-blue-400 to-blue-600' },
    { label: '의사소통', value: surveyStats.communication, icon: '💬', color: 'text-green-600', bgColor: 'from-green-400 to-green-600' },
    { label: '실력 수준', value: surveyStats.skillLevel, icon: '⚽', color: 'text-purple-600', bgColor: 'from-purple-400 to-purple-600' },
    { label: '스포츠맨십', value: surveyStats.sportsmanship, icon: '🏆', color: 'text-yellow-600', bgColor: 'from-yellow-400 to-yellow-600' },
    { label: '시간 준수', value: surveyStats.punctuality, icon: '⏰', color: 'text-orange-600', bgColor: 'from-orange-400 to-orange-600' },
    { label: '태도/매너', value: surveyStats.attitude, icon: '😊', color: 'text-pink-600', bgColor: 'from-pink-400 to-pink-600' }
  ];

  // 5점 만점을 100% 스케일로 변환
  const getPercentage = (value: number) => (value / 5) * 100;

  const getRatingColor = (value: number) => {
    if (value >= 4.5) return 'text-green-600';
    if (value >= 4.0) return 'text-blue-600';
    if (value >= 3.5) return 'text-yellow-600';
    if (value >= 3.0) return 'text-orange-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      {/* 평가 항목별 점수 (5점 만점) */}
      <div className="space-y-4">
        {stats.map((stat, index) => (
          <div key={index}>
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <span>{stat.icon}</span>
                {stat.label}
              </span>
              <span className={`text-sm font-bold ${getRatingColor(stat.value)}`}>
                {stat.value.toFixed(1)} / 5.0
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className={`h-3 rounded-full bg-gradient-to-r ${stat.bgColor}`}
                style={{ width: `${getPercentage(stat.value)}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* 평균 평점 요약 */}
      <div className="p-6 bg-gradient-to-br from-green-50 to-blue-50 rounded-lg">
        <div className="text-center mb-4">
          <div className="text-sm text-gray-600 mb-2">종합 평점</div>
          <div className="text-5xl font-bold text-green-600">
            {((surveyStats.teamwork + surveyStats.communication + surveyStats.skillLevel +
               surveyStats.sportsmanship + surveyStats.punctuality + surveyStats.attitude) / 6).toFixed(1)}
          </div>
          <div className="text-sm text-gray-500 mt-1">/ 5.0</div>
        </div>
        <div className="grid grid-cols-3 gap-4 text-center pt-4 border-t border-gray-300">
          {stats.slice(0, 3).map((stat, index) => (
            <div key={index}>
              <div className="text-2xl mb-1">{stat.icon}</div>
              <div className={`text-lg font-bold ${stat.color}`}>{stat.value.toFixed(1)}</div>
              <div className="text-xs text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* 정성적 피드백 태그 */}
      <div className="p-6 bg-gray-50 rounded-lg">
        <h4 className="text-sm font-semibold text-gray-700 mb-3">
          👍 가장 많이 받은 긍정 피드백
        </h4>
        <div className="flex flex-wrap gap-2">
          {surveyStats.topTags.map((tag: string, index: number) => (
            <span
              key={index}
              className="px-3 py-2 bg-white border border-green-200 text-green-700 rounded-full text-sm font-medium hover:bg-green-50 transition-colors"
            >
              ✨ {tag}
            </span>
          ))}
        </div>
        <div className="mt-4 text-xs text-gray-500">
          ℹ️ 이 평가는 경기 후 동료들의 선택적 설문 참여로 수집되었습니다.
        </div>
      </div>
    </div>
  );
};

// 통계 카드 컴포넌트
const StatCard = ({ icon: Icon, label, value, color, onClick }: any) => {
  const colorClasses: any = {
    blue: 'bg-blue-50 text-blue-600 border-blue-200',
    green: 'bg-green-50 text-green-600 border-green-200',
    purple: 'bg-purple-50 text-purple-600 border-purple-200',
    orange: 'bg-orange-50 text-orange-600 border-orange-200'
  };

  const handleClick = () => {
    console.log('StatCard clicked:', label, '-> navigating');
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-lg border-2 border-gray-100 p-6 hover:shadow-md transition-all cursor-pointer hover:border-green-200 hover:scale-105"
      style={{ minHeight: '150px' }}
    >
      <div className={`w-12 h-12 rounded-lg border-2 ${colorClasses[color]} flex items-center justify-center mb-3`}>
        <Icon className="w-6 h-6" />
      </div>
      <div className="text-2xl font-bold mb-1 text-gray-900">{value}</div>
      <div className="text-sm text-gray-600 font-medium">{label}</div>
    </div>
  );
};

// 통계 바 컴포넌트
const StatBar = ({ label, value, max, unit = '', color }: any) => {
  const percentage = (value / max) * 100;
  const colorClasses: any = {
    green: 'bg-green-500',
    blue: 'bg-blue-500',
    purple: 'bg-purple-500',
    orange: 'bg-orange-500'
  };

  return (
    <div>
      <div className="flex justify-between mb-2">
        <span className="text-sm font-medium text-gray-700">{label}</span>
        <span className="text-sm font-bold text-gray-900">{value}{unit}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full ${colorClasses[color]}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

// 작성글 상세 모달
const PostDetailModal = ({ post, onClose }: any) => {
  const getTypeLabel = (type: string) => {
    const labels: any = {
      TEAM: { text: '팀원모집', color: 'bg-blue-100 text-blue-700' },
      MERCENARY: { text: '용병모집', color: 'bg-green-100 text-green-700' },
      MATCH: { text: '경기공지', color: 'bg-purple-100 text-purple-700' }
    };
    return labels[type] || labels.TEAM;
  };

  const getStatusLabel = (status: string) => {
    const labels: any = {
      ACTIVE: { text: '모집중', color: 'bg-green-100 text-green-700' },
      CLOSED: { text: '마감', color: 'bg-gray-100 text-gray-700' },
      DELETED: { text: '삭제됨', color: 'bg-red-100 text-red-700' }
    };
    return labels[status] || labels.ACTIVE;
  };

  const typeLabel = getTypeLabel(post.type);
  const statusLabel = getStatusLabel(post.status);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FileText className="w-6 h-6 text-purple-600" />
            작성글 상세
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* 태그 */}
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded text-sm font-medium ${typeLabel.color}`}>
              {typeLabel.text}
            </span>
            <span className={`px-3 py-1 rounded text-sm font-medium ${statusLabel.color}`}>
              {statusLabel.text}
            </span>
          </div>

          {/* 제목 */}
          <div>
            <h3 className="text-2xl font-bold text-gray-900">{post.title}</h3>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{post.views}</div>
              <div className="text-xs text-gray-600">조회수</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{post.applicants}</div>
              <div className="text-xs text-gray-600">신청자</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-600">작성일</div>
              <div className="text-xs text-gray-700">{new Date(post.createdDate).toLocaleDateString()}</div>
            </div>
          </div>

          {/* 내용 */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-700 mb-2">글 내용</h4>
            <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">{post.content}</p>
          </div>

          {/* 작성 시간 */}
          <div className="text-sm text-gray-500 border-t pt-4">
            📅 작성일시: {new Date(post.createdDate).toLocaleString()}
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

// 댓글 상세 모달
const CommentDetailModal = ({ comment, onClose }: any) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <MessageCircle className="w-6 h-6 text-blue-600" />
            댓글 상세
          </h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* 원본 게시글 정보 */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm text-blue-700 font-medium mb-1">원본 게시글</div>
            <div className="text-lg font-semibold text-blue-900">{comment.postTitle}</div>
            <div className="text-xs text-blue-600 mt-1">게시글 ID: #{comment.postId}</div>
          </div>

          {/* 댓글 내용 */}
          <div className="border-t pt-4">
            <h4 className="font-semibold text-gray-700 mb-3">댓글 내용</h4>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-gray-900 leading-relaxed">{comment.content}</p>
            </div>
          </div>

          {/* 통계 */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-pink-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-pink-600">❤️ {comment.likes}</div>
              <div className="text-xs text-gray-600">좋아요</div>
            </div>
            <div className="p-4 bg-purple-50 rounded-lg text-center">
              <div className="text-sm text-gray-600">작성일</div>
              <div className="text-xs text-gray-700">{new Date(comment.createdDate).toLocaleDateString()}</div>
            </div>
          </div>

          {/* 작성 시간 */}
          <div className="text-sm text-gray-500 border-t pt-4">
            📅 작성일시: {new Date(comment.createdDate).toLocaleString()}
          </div>
        </div>

        <div className="border-t px-6 py-4 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserDetailPage;