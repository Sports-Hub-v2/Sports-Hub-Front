import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Search, Plus, Clock, Calendar, Users, ChevronRight } from 'lucide-react';
import AdminLayout from '../components/AdminLayout';

interface Venue {
  id: string;
  name: string;
  address: string;
  capacity: number;
  type: 'indoor' | 'outdoor';
  surface: string;
  facilities: string[];
  totalMatches: number;
  upcomingMatches: number;
  rating: number;
  image?: string;
}

const VenuesPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'indoor' | 'outdoor'>('all');

  // 목업 데이터
  const mockVenues: Venue[] = [
    {
      id: '1',
      name: '강남 스포츠타운 A구장',
      address: '서울시 강남구 테헤란로 123',
      capacity: 50,
      type: 'outdoor',
      surface: '인조잔디',
      facilities: ['주차장', '샤워실', '조명'],
      totalMatches: 145,
      upcomingMatches: 3,
      rating: 4.5,
    },
    {
      id: '2',
      name: '송파 풋살파크',
      address: '서울시 송파구 올림픽로 456',
      capacity: 30,
      type: 'indoor',
      surface: '우레탄',
      facilities: ['주차장', '샤워실', '락커룸', '매점'],
      totalMatches: 89,
      upcomingMatches: 2,
      rating: 4.7,
    },
    {
      id: '3',
      name: '서초 축구장',
      address: '서울시 서초구 서초대로 789',
      capacity: 40,
      type: 'outdoor',
      surface: '천연잔디',
      facilities: ['주차장', '샤워실'],
      totalMatches: 67,
      upcomingMatches: 1,
      rating: 4.2,
    },
    {
      id: '4',
      name: '잠실 체육공원',
      address: '서울시 송파구 올림픽로 1',
      capacity: 60,
      type: 'outdoor',
      surface: '인조잔디',
      facilities: ['주차장', '샤워실', '조명', '매점'],
      totalMatches: 203,
      upcomingMatches: 5,
      rating: 4.8,
    },
  ];

  const filteredVenues = mockVenues.filter(venue => {
    const matchesSearch = venue.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         venue.address.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = filterType === 'all' || venue.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleVenueClick = (venueId: string) => {
    navigate(`/admin/venues/${venueId}`);
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">경기장 관리</h1>
            <p className="text-sm text-gray-500 mt-1">등록된 경기장 정보를 관리합니다</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="w-4 h-4" />
            경기장 추가
          </button>
        </div>

        {/* 통계 카드 */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">총 경기장</span>
              <MapPin className="w-5 h-5 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">{mockVenues.length}</div>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">실내 경기장</span>
              <MapPin className="w-5 h-5 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {mockVenues.filter(v => v.type === 'indoor').length}
            </div>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">실외 경기장</span>
              <MapPin className="w-5 h-5 text-orange-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {mockVenues.filter(v => v.type === 'outdoor').length}
            </div>
          </div>
          <div className="bg-white rounded-lg p-5 border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">예정 경기</span>
              <Calendar className="w-5 h-5 text-purple-600" />
            </div>
            <div className="text-2xl font-bold text-gray-900">
              {mockVenues.reduce((sum, v) => sum + v.upcomingMatches, 0)}
            </div>
          </div>
        </div>

        {/* 필터 및 검색 */}
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="경기장 이름 또는 주소로 검색..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setFilterType('all')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'all'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                전체
              </button>
              <button
                onClick={() => setFilterType('indoor')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'indoor'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                실내
              </button>
              <button
                onClick={() => setFilterType('outdoor')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  filterType === 'outdoor'
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                실외
              </button>
            </div>
          </div>
        </div>

        {/* 경기장 목록 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredVenues.map(venue => (
            <div
              key={venue.id}
              onClick={() => handleVenueClick(venue.id)}
              className="bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all cursor-pointer"
            >
              <div className="p-5">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-900">{venue.name}</h3>
                      <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        venue.type === 'indoor'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-orange-100 text-orange-700'
                      }`}>
                        {venue.type === 'indoor' ? '실내' : '실외'}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{venue.address}</span>
                    </div>
                  </div>
                  <ChevronRight className="w-5 h-5 text-gray-400" />
                </div>

                <div className="grid grid-cols-3 gap-3 mb-3">
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-600 mb-1">수용인원</div>
                    <div className="text-sm font-bold text-gray-900">{venue.capacity}명</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-600 mb-1">총 경기수</div>
                    <div className="text-sm font-bold text-gray-900">{venue.totalMatches}회</div>
                  </div>
                  <div className="text-center p-2 bg-gray-50 rounded">
                    <div className="text-xs text-gray-600 mb-1">평점</div>
                    <div className="text-sm font-bold text-gray-900">⭐ {venue.rating}</div>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <span className="font-medium text-gray-700">{venue.surface}</span>
                    <span>•</span>
                    <span>{venue.facilities.join(', ')}</span>
                  </div>
                  {venue.upcomingMatches > 0 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                      예정 {venue.upcomingMatches}건
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredVenues.length === 0 && (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
            <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">검색 결과가 없습니다</h3>
            <p className="text-sm text-gray-500">다른 검색어를 입력해보세요</p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default VenuesPage;
