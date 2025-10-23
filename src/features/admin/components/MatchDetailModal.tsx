import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, Calendar, MapPin, Users, Clock, Edit2, Save, CheckCircle,
  XCircle, AlertTriangle, Flag, Trophy, Activity, MessageSquare,
  User, Shield, FileText, BarChart3, UserX, StickyNote, ExternalLink
} from 'lucide-react';

interface Team {
  id?: number;
  name: string;
  score?: number;
  logo?: string;
}

interface Player {
  id: number;
  name: string;
  position: string;
  number?: number;
  goals?: number;
  assists?: number;
  yellowCards?: number;
  redCards?: number;
}

interface Match {
  id: string;
  venue: string;
  time: string;
  date?: string;
  home: Team;
  away: Team;
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  notes?: string[];
  referee?: string;
  attendance?: number;
  weather?: string;
  homePlayers?: Player[];
  awayPlayers?: Player[];
}

interface MatchDetailModalProps {
  match: Match | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate?: (matchId: string, data: any) => void;
  onCancel?: (matchId: string, reason: string) => void;
}

const MatchDetailModal: React.FC<MatchDetailModalProps> = ({
  match,
  isOpen,
  onClose,
  onUpdate,
  onCancel
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'lineups' | 'stats' | 'management'>('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [matchNotes, setMatchNotes] = useState<string[]>(match?.notes || []);
  const [newNote, setNewNote] = useState('');
  const [editData, setEditData] = useState({
    homeScore: 0,
    awayScore: 0,
    status: 'scheduled',
    notes: ''
  });

  if (!isOpen || !match) return null;

  const handleTeamClick = (teamId?: number) => {
    if (teamId) {
      navigate(`/admin/teams/${teamId}`);
      onClose();
    }
  };

  const handlePlayerClick = (playerId: number) => {
    navigate(`/admin/users/${playerId}`);
    onClose();
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      setMatchNotes([...matchNotes, newNote.trim()]);
      setNewNote('');
    }
  };

  const getStatusBadge = (status: string) => {
    const configs = {
      scheduled: { color: 'bg-blue-100 text-blue-700 border-blue-300', icon: Clock, label: '예정' },
      in_progress: { color: 'bg-green-100 text-green-700 border-green-300', icon: Activity, label: '진행중' },
      completed: { color: 'bg-gray-100 text-gray-700 border-gray-300', icon: CheckCircle, label: '완료' },
      cancelled: { color: 'bg-red-100 text-red-700 border-red-300', icon: XCircle, label: '취소' }
    };
    const config = configs[status as keyof typeof configs] || configs.scheduled;
    const Icon = config.icon;

    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border ${config.color}`}>
        <Icon className="w-4 h-4" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* 헤더 */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-5 flex justify-between items-start rounded-t-xl">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-6 h-6" />
              <h2 className="text-2xl font-bold">경기 상세 정보</h2>
              {getStatusBadge(match.status)}
            </div>
            <div className="flex items-center gap-4 text-sm text-blue-100">
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4" />
                <span>{match.date || '2025-10-24'}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4" />
                <span>{match.time}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" />
                <span>{match.venue}</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 스코어보드 */}
        <div className="bg-gradient-to-b from-gray-50 to-white p-6 border-b">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {/* 팀 1 */}
            <div className="flex-1 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Flag className="w-10 h-10 text-blue-600" />
              </div>
              <button
                onClick={() => handleTeamClick(match.home.id)}
                className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 justify-center mx-auto group"
              >
                {match.home.name}
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>

            {/* 점수 */}
            <div className="px-8">
              <div className="flex items-center gap-4">
                <div className="text-5xl font-bold text-gray-900">
                  {match.home.score ?? '-'}
                </div>
                <div className="text-2xl font-semibold text-gray-400">:</div>
                <div className="text-5xl font-bold text-gray-900">
                  {match.away.score ?? '-'}
                </div>
              </div>
            </div>

            {/* 팀 2 */}
            <div className="flex-1 text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <Flag className="w-10 h-10 text-red-600" />
              </div>
              <button
                onClick={() => handleTeamClick(match.away.id)}
                className="text-xl font-bold text-gray-900 hover:text-blue-600 transition-colors flex items-center gap-2 justify-center mx-auto group"
              >
                {match.away.name}
                <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            </div>
          </div>

          {/* 경기 ID */}
          <div className="text-center mt-4">
            <span className="text-sm text-gray-500">경기 ID: <span className="font-mono font-semibold">{match.id}</span></span>
          </div>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b bg-white sticky top-[88px] z-10">
          <div className="flex gap-1 px-6">
            {[
              { id: 'overview', label: '개요', icon: FileText },
              { id: 'lineups', label: '라인업', icon: Users },
              { id: 'stats', label: '통계', icon: BarChart3 },
              { id: 'management', label: '관리', icon: Shield }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* 경기 기본 정보 */}
              <div className="grid grid-cols-3 gap-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    경기장 정보
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">경기장</span>
                      <span className="font-medium text-gray-900">{match.venue}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">날씨</span>
                      <span className="font-medium text-gray-900">{match.weather || '맑음 ☀️'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">관중</span>
                      <span className="font-medium text-gray-900">{match.attendance || '-'}명</span>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Users className="w-5 h-5 text-blue-600" />
                    참가 정보
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">{match.home.name}</span>
                      <span className="font-medium text-gray-900">{match.homePlayers?.length || 0}명</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">{match.away.name}</span>
                      <span className="font-medium text-gray-900">{match.awayPlayers?.length || 0}명</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">총 인원</span>
                      <span className="font-medium text-gray-900">{(match.homePlayers?.length || 0) + (match.awayPlayers?.length || 0)}명</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    경기 시간
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">날짜</span>
                      <span className="font-medium text-gray-900">{match.date}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">킥오프</span>
                      <span className="font-medium text-gray-900">{match.time}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">상태</span>
                      <span className="font-medium text-gray-900">
                        {match.status === 'scheduled' ? '⏰ 예정' :
                         match.status === 'completed' ? '✅ 완료' :
                         match.status === 'cancelled' ? '❌ 취소' : '🟢 진행중'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 경기 노트 */}
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-yellow-600" />
                  경기 노트
                </h4>
                {matchNotes.length > 0 ? (
                  <ul className="space-y-2 mb-3">
                    {matchNotes.map((note, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-700">
                        <span className="text-yellow-600 mt-0.5">•</span>
                        {note}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500 mb-3">노트가 없습니다.</p>
                )}
              </div>

              {/* 팀 정보 카드 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-5 border-2 border-blue-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900 text-lg">{match.home.name}</h4>
                    <button
                      onClick={() => handleTeamClick(match.home.id)}
                      className="px-3 py-1.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-1"
                    >
                      팀 상세보기
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">참가 인원</span>
                      <span className="font-medium text-gray-900">{match.homePlayers?.length || 0}명</span>
                    </div>
                    {match.status === 'completed' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">득점</span>
                          <span className="font-bold text-blue-600 text-lg">{match.home.score || 0}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-white rounded-lg p-5 border-2 border-red-200">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-bold text-gray-900 text-lg">{match.away.name}</h4>
                    <button
                      onClick={() => handleTeamClick(match.away.id)}
                      className="px-3 py-1.5 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center gap-1"
                    >
                      팀 상세보기
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">참가 인원</span>
                      <span className="font-medium text-gray-900">{match.awayPlayers?.length || 0}명</span>
                    </div>
                    {match.status === 'completed' && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-gray-600">득점</span>
                          <span className="font-bold text-red-600 text-lg">{match.away.score || 0}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'lineups' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                {/* 팀 1 라인업 */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Flag className="w-5 h-5 text-blue-600" />
                    {match.home.name}
                  </h4>
                  <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                    {match.homePlayers && match.homePlayers.length > 0 ? (
                      <div className="space-y-2">
                        {match.homePlayers.map(player => (
                          <button
                            key={player.id}
                            onClick={() => handlePlayerClick(player.id)}
                            className="w-full flex items-center justify-between p-2 bg-white rounded hover:bg-blue-50 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {player.number || '?'}
                              </span>
                              <div className="text-left">
                                <div className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-1">
                                  {player.name}
                                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-xs text-gray-500">{player.position}</div>
                              </div>
                            </div>
                            {match.status === 'completed' && (player.goals || player.assists) && (
                              <div className="flex items-center gap-2 text-xs">
                                {player.goals ? <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">⚽ {player.goals}</span> : null}
                                {player.assists ? <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">🎯 {player.assists}</span> : null}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">라인업 정보가 없습니다</p>
                    )}
                  </div>
                </div>

                {/* 팀 2 라인업 */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <Flag className="w-5 h-5 text-red-600" />
                    {match.away.name}
                  </h4>
                  <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                    {match.awayPlayers && match.awayPlayers.length > 0 ? (
                      <div className="space-y-2">
                        {match.awayPlayers.map(player => (
                          <button
                            key={player.id}
                            onClick={() => handlePlayerClick(player.id)}
                            className="w-full flex items-center justify-between p-2 bg-white rounded hover:bg-red-50 transition-colors cursor-pointer group"
                          >
                            <div className="flex items-center gap-2">
                              <span className="w-8 h-8 bg-red-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                {player.number || '?'}
                              </span>
                              <div className="text-left">
                                <div className="font-medium text-gray-900 group-hover:text-red-600 transition-colors flex items-center gap-1">
                                  {player.name}
                                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                                <div className="text-xs text-gray-500">{player.position}</div>
                              </div>
                            </div>
                            {match.status === 'completed' && (player.goals || player.assists) && (
                              <div className="flex items-center gap-2 text-xs">
                                {player.goals ? <span className="bg-green-100 text-green-700 px-2 py-0.5 rounded">⚽ {player.goals}</span> : null}
                                {player.assists ? <span className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded">🎯 {player.assists}</span> : null}
                              </div>
                            )}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500 py-8">라인업 정보가 없습니다</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <div className="bg-gray-50 rounded-lg p-6 border border-gray-200 text-center">
                <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h4 className="font-semibold text-gray-900 mb-2">경기 통계</h4>
                <p className="text-sm text-gray-500">경기 통계는 경기 종료 후 제공됩니다</p>
              </div>
            </div>
          )}

          {activeTab === 'management' && (
            <div className="space-y-6">
              {/* 경기 결과 입력 */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Edit2 className="w-5 h-5 text-blue-600" />
                  경기 결과 입력
                </h4>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {match.home.name} 득점
                    </label>
                    <input
                      type="number"
                      min="0"
                      defaultValue={match.home.score || 0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      {match.away.name} 득점
                    </label>
                    <input
                      type="number"
                      min="0"
                      defaultValue={match.away.score || 0}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      경기 상태
                    </label>
                    <select
                      defaultValue={match.status}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="scheduled">예정</option>
                      <option value="in_progress">진행중</option>
                      <option value="completed">완료</option>
                      <option value="cancelled">취소</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      관중 수
                    </label>
                    <input
                      type="number"
                      min="0"
                      defaultValue={match.attendance || 0}
                      placeholder="관중 수 입력"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      날씨
                    </label>
                    <input
                      type="text"
                      defaultValue={match.weather || ''}
                      placeholder="날씨 정보"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
                  <Save className="w-4 h-4" />
                  결과 저장
                </button>
              </div>

              {/* 관리자 메모 추가 */}
              <div className="bg-purple-50 rounded-lg p-5 border border-purple-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <StickyNote className="w-5 h-5 text-purple-600" />
                  관리자 메모 추가
                </h4>
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  placeholder="경기 관련 메모를 입력하세요...&#10;&#10;예시:&#10;- 경기장 시설 점검 필요&#10;- 날씨로 인한 지연 발생&#10;- 특이사항 기록"
                  className="w-full px-4 py-3 border border-purple-300 bg-white text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none text-sm mb-3"
                  rows={4}
                  maxLength={500}
                />
                <div className="flex items-center justify-between">
                  <span className="text-xs text-purple-600">{newNote.length}/500</span>
                  <button
                    onClick={handleAddNote}
                    disabled={!newNote.trim()}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <StickyNote className="w-4 h-4" />
                    메모 추가
                  </button>
                </div>
              </div>

              {/* 노쇼 관리 */}
              <div className="bg-orange-50 rounded-lg p-5 border border-orange-200">
                <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                  <UserX className="w-5 h-5 text-orange-600" />
                  노쇼 관리
                </h4>
                <p className="text-sm text-orange-700 mb-4">
                  참가 신청 후 불참한 사용자를 관리합니다. 노쇼로 처리된 사용자는 매너온도가 감소합니다.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors font-medium text-sm">
                    <UserX className="w-4 h-4" />
                    {match.home.name} 노쇼 처리
                  </button>
                  <button className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-orange-300 text-orange-700 rounded-lg hover:bg-orange-100 transition-colors font-medium text-sm">
                    <UserX className="w-4 h-4" />
                    {match.away.name} 노쇼 처리
                  </button>
                </div>
              </div>

              {/* 경기 취소 */}
              <div className="bg-red-50 rounded-lg p-5 border border-red-200">
                <h4 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-red-600" />
                  경기 취소
                </h4>
                <p className="text-sm text-red-700 mb-4">
                  이 경기를 취소하시겠습니까? 취소 후에는 되돌릴 수 없습니다.
                </p>
                <div className="mb-3">
                  <label className="block text-sm font-medium text-red-900 mb-2">
                    취소 사유
                  </label>
                  <textarea
                    placeholder="취소 사유를 입력하세요 (필수)"
                    className="w-full px-3 py-2 border border-red-300 bg-white rounded-lg focus:ring-2 focus:ring-red-500 resize-none text-sm"
                    rows={3}
                  />
                </div>
                <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm">
                  <XCircle className="w-4 h-4" />
                  경기 취소
                </button>
              </div>
            </div>
          )}
        </div>

        {/* 푸터 */}
        <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3 rounded-b-xl">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default MatchDetailModal;
