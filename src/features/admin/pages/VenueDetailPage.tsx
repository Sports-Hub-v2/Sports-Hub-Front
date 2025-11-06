import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  MapPin, ArrowLeft, Edit2, Calendar, Users, Trophy, Star,
  Clock, CheckCircle, AlertCircle, Phone, Mail, Navigation,
  ImageIcon, Wifi, ParkingCircle, Droplets, Lightbulb, ShoppingCart,
  Save, X
} from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

interface VenueDetail {
  id: string;
  name: string;
  address: string;
  detailAddress: string;
  capacity: number;
  type: 'indoor' | 'outdoor';
  surface: string;
  facilities: string[];
  totalMatches: number;
  upcomingMatches: number;
  rating: number;
  contact: {
    phone: string;
    email: string;
    manager: string;
  };
  operatingHours: {
    weekday: string;
    weekend: string;
  };
  pricing: {
    weekday: number;
    weekend: number;
  };
  images?: string[];
  description: string;
  recentMatches: Array<{
    id: string;
    date: string;
    time: string;
    homeTeam: string;
    awayTeam: string;
    status: string;
  }>;
}

const VenueDetailPage: React.FC = () => {
  const { venueId } = useParams<{ venueId: string }>();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'info' | 'matches' | 'statistics'>('info');

  // 목업 데이터
  const mockVenue: VenueDetail = {
    id: venueId || '1',
    name: '강남 스포츠타운 A구장',
    address: '서울시 강남구 테헤란로 123',
    detailAddress: '스포츠타운 빌딩 B1',
    capacity: 50,
    type: 'outdoor',
    surface: '인조잔디',
    facilities: ['주차장', '샤워실', '조명', '매점', '락커룸', '무료 Wi-Fi'],
    totalMatches: 145,
    upcomingMatches: 3,
    rating: 4.5,
    contact: {
      phone: '02-1234-5678',
      email: 'venue@example.com',
      manager: '김경기'
    },
    operatingHours: {
      weekday: '06:00 - 23:00',
      weekend: '06:00 - 24:00'
    },
    pricing: {
      weekday: 150000,
      weekend: 200000
    },
    description: '강남 중심가에 위치한 프리미엄 축구장입니다. 최고 품질의 인조잔디와 완벽한 조명 시설을 갖추고 있습니다.',
    recentMatches: [
      { id: 'm1', date: '2025-10-24', time: '19:00', homeTeam: 'FC 청담', awayTeam: '삼성 FC', status: 'completed' },
      { id: 'm2', date: '2025-10-25', time: '14:00', homeTeam: '역삼 유나이티드', awayTeam: '논현 FC', status: 'scheduled' },
      { id: 'm3', date: '2025-10-26', time: '10:00', homeTeam: '강남 워리어스', awayTeam: '선릉 FC', status: 'scheduled' },
    ]
  };

  const facilityIcons: Record<string, any> = {
    '주차장': ParkingCircle,
    '샤워실': Droplets,
    '조명': Lightbulb,
    '매점': ShoppingCart,
    '락커룸': Users,
    '무료 Wi-Fi': Wifi,
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/admin/venues')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{mockVenue.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-gray-500" />
                <p className="text-sm text-gray-600">{mockVenue.address}</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {isEditing ? (
              <>
                <Save className="w-4 h-4" />
                저장
              </>
            ) : (
              <>
                <Edit2 className="w-4 h-4" />
                수정
              </>
            )}
          </button>
        </div>

        {/* 기본 정보 카드 */}
        <div className="grid grid-cols-5 gap-4">
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">경기장 타입</span>
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-xl font-bold text-gray-900">
              {mockVenue.type === 'indoor' ? '실내' : '실외'}
            </div>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">수용인원</span>
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-xl font-bold text-gray-900">{mockVenue.capacity}명</div>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">총 경기수</span>
              <Trophy className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-xl font-bold text-gray-900">{mockVenue.totalMatches}회</div>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">예정 경기</span>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-xl font-bold text-gray-900">{mockVenue.upcomingMatches}건</div>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">평점</span>
              <Star className="w-5 h-5 text-yellow-600" />
            </div>
            <div className="text-xl font-bold text-gray-900">⭐ {mockVenue.rating}</div>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b bg-white rounded-t-lg">
          <div className="flex gap-1 px-6">
            {[
              { id: 'info', label: '기본 정보' },
              { id: 'matches', label: '경기 이력' },
              { id: 'statistics', label: '통계' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 border-b-2 font-medium transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="space-y-6">
          {activeTab === 'info' && (
            <>
              <div className="grid grid-cols-2 gap-6">
                {/* 위치 및 시설 정보 */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">위치 및 시설</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">경기장명</span>
                      <span className="font-medium text-gray-900">{mockVenue.name}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">주소</span>
                      <span className="font-medium text-gray-900">{mockVenue.address}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">상세 주소</span>
                      <span className="font-medium text-gray-900">{mockVenue.detailAddress}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">바닥재</span>
                      <span className="font-medium text-gray-900">{mockVenue.surface}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">평점</span>
                      <span className="font-medium text-yellow-600 flex items-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-600" />
                        {mockVenue.rating}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 연락처 정보 */}
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">연락처 정보</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Phone className="w-5 h-5 text-blue-600" />
                      <div>
                        <div className="text-xs text-gray-600 mb-1">전화번호</div>
                        <div className="font-medium text-gray-900">{mockVenue.contact.phone}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Mail className="w-5 h-5 text-green-600" />
                      <div>
                        <div className="text-xs text-gray-600 mb-1">이메일</div>
                        <div className="font-medium text-gray-900">{mockVenue.contact.email}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600" />
                      <div>
                        <div className="text-xs text-gray-600 mb-1">담당자</div>
                        <div className="font-medium text-gray-900">{mockVenue.contact.manager}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 운영 시간 및 요금 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    운영 시간
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">평일</span>
                      <span className="font-medium text-gray-900">{mockVenue.operatingHours.weekday}</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">주말</span>
                      <span className="font-medium text-gray-900">{mockVenue.operatingHours.weekend}</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-lg p-6 border border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-orange-600" />
                    대관료 (2시간 기준)
                  </h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-2 border-b border-gray-100">
                      <span className="text-sm text-gray-600">평일</span>
                      <span className="font-medium text-gray-900">{mockVenue.pricing.weekday.toLocaleString()}원</span>
                    </div>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-600">주말</span>
                      <span className="font-medium text-gray-900">{mockVenue.pricing.weekend.toLocaleString()}원</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 편의시설 */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-4">편의시설</h3>
                <div className="grid grid-cols-3 gap-3">
                  {mockVenue.facilities.map(facility => {
                    const Icon = facilityIcons[facility] || CheckCircle;
                    return (
                      <div key={facility} className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                        <Icon className="w-5 h-5 text-blue-600" />
                        <span className="text-sm font-medium text-gray-900">{facility}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 설명 */}
              <div className="bg-white rounded-lg p-6 border border-gray-200">
                <h3 className="text-lg font-bold text-gray-900 mb-3">경기장 소개</h3>
                <p className="text-gray-700 leading-relaxed">{mockVenue.description}</p>
              </div>
            </>
          )}

          {activeTab === 'matches' && (
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">최근 경기</h3>
              </div>
              <div className="divide-y divide-gray-200">
                {mockVenue.recentMatches.map(match => (
                  <div key={match.id} className="p-5 hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="text-center">
                          <div className="text-sm text-gray-600">{match.date}</div>
                          <div className="text-xs text-gray-500">{match.time}</div>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium text-gray-900">{match.homeTeam}</span>
                          <span className="text-gray-400">vs</span>
                          <span className="font-medium text-gray-900">{match.awayTeam}</span>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        match.status === 'completed'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}>
                        {match.status === 'completed' ? '완료' : '예정'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'statistics' && (
            <div className="bg-white rounded-lg p-12 border border-gray-200 text-center">
              <Trophy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">통계 정보</h3>
              <p className="text-sm text-gray-500">경기장 통계는 추후 제공될 예정입니다</p>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default VenueDetailPage;
