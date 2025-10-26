import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X, FileText, User, Eye, MessageSquare, History, Edit2, Trash2,
  CheckCircle, Clock, AlertTriangle, ThumbsUp, Share2, Flag,
  TrendingUp, Calendar, ExternalLink
} from 'lucide-react';

interface EditHistory {
  id: string;
  editor: string;
  editorId?: string;
  action: string;
  changes: string;
  timestamp: string;
  type?: 'create' | 'edit' | 'status' | 'delete';
}

interface ManagementHistory {
  id: string;
  action: string;
  description: string;
  timestamp: string;
  admin: string;
  adminId?: string;
  type?: 'approve' | 'reject' | 'review' | 'report' | 'delete' | 'restore';
}

interface Comment {
  id: string;
  author: string;
  authorId: string;
  content: string;
  timestamp: string;
  likes: number;
  isReported: boolean;
}

interface Content {
  id: string;
  type: string;
  title: string;
  content?: string;
  author: string;
  authorId?: string;
  status: string;
  createdAt: string;
  updatedAt?: string;
  views?: number;
  likes?: number;
  shares?: number;
  reportCount?: number;
  editHistory?: EditHistory[];
  managementHistory?: ManagementHistory[];
  comments?: Comment[];
  tags?: string[];
}

interface ContentDetailModalProps {
  content: Content | null;
  isOpen: boolean;
  onClose: () => void;
}

const ContentDetailModal: React.FC<ContentDetailModalProps> = ({
  content,
  isOpen,
  onClose
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'detail' | 'history' | 'management' | 'comments' | 'stats'>('detail');

  if (!isOpen || !content) return null;

  const handleUserClick = (userId?: string) => {
    if (userId) {
      navigate(`/admin/users/${userId}`);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* 헤더 */}
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-5 flex justify-between items-start rounded-t-xl z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <FileText className="w-6 h-6" />
              <h2 className="text-2xl font-bold">콘텐츠 상세</h2>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                content.status === '게시됨' ? 'bg-green-100 text-green-700' :
                content.status === '검수 중' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {content.status}
              </span>
              {content.reportCount && content.reportCount > 0 && (
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700 flex items-center gap-1">
                  <Flag className="w-4 h-4" />
                  신고 {content.reportCount}건
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-purple-100">
              <span className="px-2 py-1 bg-white/20 rounded">{content.type}</span>
              <span>ID: {content.id}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* 탭 네비게이션 */}
        <div className="border-b bg-white sticky top-[88px] z-10">
          <div className="flex gap-1 px-6 overflow-x-auto">
            {[
              { id: 'detail', label: '상세 정보', icon: FileText },
              { id: 'history', label: '수정 이력', icon: History },
              { id: 'management', label: '관리 이력', icon: Shield },
              { id: 'comments', label: '댓글', icon: MessageSquare },
              { id: 'stats', label: '통계', icon: TrendingUp }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-purple-600 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                  {tab.id === 'comments' && content.comments && (
                    <span className="px-2 py-0.5 bg-gray-200 rounded-full text-xs">
                      {content.comments.length}
                    </span>
                  )}
                  {tab.id === 'history' && content.editHistory && (
                    <span className="px-2 py-0.5 bg-gray-200 rounded-full text-xs">
                      {content.editHistory.length}
                    </span>
                  )}
                  {tab.id === 'management' && content.managementHistory && (
                    <span className="px-2 py-0.5 bg-gray-200 rounded-full text-xs">
                      {content.managementHistory.length}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* 탭 컨텐츠 */}
        <div className="p-6">
          {activeTab === 'detail' && (
            <div className="space-y-6">
              {/* 제목 */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 break-words">{content.title}</h3>
                {content.tags && content.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {content.tags.map((tag, index) => (
                      <span key={index} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* 작성자 정보 */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  <User className="w-5 h-5 text-blue-600" />
                  작성자 정보
                </h4>
                <div className="flex items-center justify-between">
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-600">작성자:</span>
                      <button
                        onClick={() => handleUserClick(content.authorId)}
                        className="font-medium text-blue-600 hover:text-blue-700 flex items-center gap-1 group"
                      >
                        {content.author}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">작성일:</span>
                      <span className="font-medium text-gray-900">{content.createdAt}</span>
                    </div>
                    {content.updatedAt && content.updatedAt !== content.createdAt && (
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">최종 수정:</span>
                        <span className="font-medium text-gray-900">{content.updatedAt}</span>
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleUserClick(content.authorId)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm flex items-center gap-2"
                  >
                    <User className="w-4 h-4" />
                    프로필 보기
                  </button>
                </div>
              </div>

              {/* 게시물 내용 */}
              {content.content && (
                <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <FileText className="w-5 h-5 text-purple-600" />
                    게시물 내용
                  </h4>
                  <div className="w-full overflow-x-auto">
                    <p className="text-gray-800 whitespace-pre-wrap leading-relaxed break-words">
                      {content.content}
                    </p>
                  </div>
                </div>
              )}

              {/* 통계 요약 */}
              <div className="grid grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-center">
                  <Eye className="w-6 h-6 text-blue-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-blue-600">{content.views || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">조회수</div>
                </div>
                <div className="bg-green-50 rounded-lg p-4 border border-green-200 text-center">
                  <ThumbsUp className="w-6 h-6 text-green-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-green-600">{content.likes || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">좋아요</div>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 border border-purple-200 text-center">
                  <MessageSquare className="w-6 h-6 text-purple-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-purple-600">{content.comments?.length || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">댓글</div>
                </div>
                <div className="bg-orange-50 rounded-lg p-4 border border-orange-200 text-center">
                  <Share2 className="w-6 h-6 text-orange-600 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-orange-600">{content.shares || 0}</div>
                  <div className="text-sm text-gray-600 mt-1">공유</div>
                </div>
              </div>

              {/* 관리 액션 */}
              <div className="bg-gray-50 rounded-lg p-5 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">관리 액션</h4>
                <div className="flex flex-wrap gap-3">
                  {content.status !== '게시됨' && (
                    <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
                      <CheckCircle className="w-4 h-4" />
                      승인 및 게시
                    </button>
                  )}
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                    <Edit2 className="w-4 h-4" />
                    수정
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm">
                    <Clock className="w-4 h-4" />
                    검수 대기로 변경
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm">
                    <Trash2 className="w-4 h-4" />
                    삭제
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'history' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <History className="w-6 h-6 text-purple-600" />
                  수정 이력
                </h3>
                <span className="text-sm text-gray-500">
                  총 {content.editHistory?.length || 0}개의 변경 사항
                </span>
              </div>

              {content.editHistory && content.editHistory.length > 0 ? (
                <div className="space-y-3">
                  {content.editHistory.map((history) => {
                    const getActionBadgeColor = (type?: string) => {
                      switch (type) {
                        case 'create': return 'bg-green-100 text-green-700 border-green-300';
                        case 'edit': return 'bg-blue-100 text-blue-700 border-blue-300';
                        case 'status': return 'bg-purple-100 text-purple-700 border-purple-300';
                        case 'delete': return 'bg-red-100 text-red-700 border-red-300';
                        default: return 'bg-gray-100 text-gray-700 border-gray-300';
                      }
                    };

                    const getActionIcon = (type?: string) => {
                      switch (type) {
                        case 'create': return '➕';
                        case 'edit': return '✏️';
                        case 'status': return '🔄';
                        case 'delete': return '🗑️';
                        default: return '📝';
                      }
                    };

                    return (
                      <div key={history.id} className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-purple-300 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <span className="text-xl">{getActionIcon(history.type)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getActionBadgeColor(history.type)}`}>
                                {history.action}
                              </span>
                              <span className="text-xs text-gray-500">{history.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2">{history.changes}</p>
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 text-gray-400" />
                              <button
                                onClick={() => handleUserClick(history.editorId)}
                                className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 group"
                              >
                                {history.editor}
                                {history.editorId && (
                                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">수정 이력이 없습니다</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'management' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Shield className="w-6 h-6 text-purple-600" />
                  관리 이력
                </h3>
                <span className="text-sm text-gray-500">
                  총 {content.managementHistory?.length || 0}개의 관리 활동
                </span>
              </div>

              {content.managementHistory && content.managementHistory.length > 0 ? (
                <div className="space-y-3">
                  {content.managementHistory.map((history) => {
                    const getActionBadgeColor = (type?: string) => {
                      switch (type) {
                        case 'approve': return 'bg-green-100 text-green-700 border-green-300';
                        case 'reject': return 'bg-red-100 text-red-700 border-red-300';
                        case 'review': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
                        case 'report': return 'bg-orange-100 text-orange-700 border-orange-300';
                        case 'delete': return 'bg-gray-100 text-gray-700 border-gray-300';
                        case 'restore': return 'bg-blue-100 text-blue-700 border-blue-300';
                        default: return 'bg-purple-100 text-purple-700 border-purple-300';
                      }
                    };

                    const getActionIcon = (type?: string) => {
                      switch (type) {
                        case 'approve': return '✅';
                        case 'reject': return '❌';
                        case 'review': return '🔍';
                        case 'report': return '🚨';
                        case 'delete': return '🗑️';
                        case 'restore': return '♻️';
                        default: return '⚙️';
                      }
                    };

                    return (
                      <div key={history.id} className="bg-white rounded-lg p-4 border-2 border-gray-200 hover:border-purple-300 transition-colors">
                        <div className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-0.5">
                            <span className="text-xl">{getActionIcon(history.type)}</span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getActionBadgeColor(history.type)}`}>
                                {history.action}
                              </span>
                              <span className="text-xs text-gray-500">{history.timestamp}</span>
                            </div>
                            <p className="text-sm text-gray-700 mb-2 break-words">{history.description}</p>
                            <div className="flex items-center gap-2">
                              <User className="w-3 h-3 text-gray-400" />
                              <button
                                onClick={() => handleUserClick(history.adminId)}
                                className="text-xs text-blue-600 font-medium hover:text-blue-700 flex items-center gap-1 group"
                              >
                                {history.admin}
                                {history.adminId && (
                                  <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                                )}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">관리 이력이 없습니다</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <MessageSquare className="w-6 h-6 text-purple-600" />
                  댓글
                </h3>
                <span className="text-sm text-gray-500">
                  총 {content.comments?.length || 0}개의 댓글
                </span>
              </div>

              {content.comments && content.comments.length > 0 ? (
                <div className="space-y-3">
                  {content.comments.map((comment) => (
                    <div
                      key={comment.id}
                      className={`bg-white rounded-lg p-4 border-2 ${
                        comment.isReported ? 'border-red-200 bg-red-50' : 'border-gray-200'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleUserClick(comment.authorId)}
                            className="font-semibold text-gray-900 hover:text-blue-600 flex items-center gap-1 group"
                          >
                            {comment.author}
                            <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </button>
                          <span className="text-xs text-gray-500">{comment.timestamp}</span>
                        </div>
                        {comment.isReported && (
                          <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs font-semibold flex items-center gap-1">
                            <Flag className="w-3 h-3" />
                            신고됨
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 mb-2 break-words">{comment.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <ThumbsUp className="w-3 h-3" />
                          <span>{comment.likes}</span>
                        </div>
                        <button className="text-blue-600 hover:text-blue-700">답글</button>
                        <button className="text-red-600 hover:text-red-700">삭제</button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                  <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500">댓글이 없습니다</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 mb-4">
                <TrendingUp className="w-6 h-6 text-purple-600" />
                통계 및 분석
              </h3>

              {/* 주요 지표 */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                  <Eye className="w-8 h-8 text-blue-600 mb-2" />
                  <div className="text-3xl font-bold text-blue-600 mb-1">{content.views || 0}</div>
                  <div className="text-sm text-blue-700 font-medium">조회수</div>
                  <div className="text-xs text-blue-600 mt-1">+12% 증가</div>
                </div>

                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                  <ThumbsUp className="w-8 h-8 text-green-600 mb-2" />
                  <div className="text-3xl font-bold text-green-600 mb-1">{content.likes || 0}</div>
                  <div className="text-sm text-green-700 font-medium">좋아요</div>
                  <div className="text-xs text-green-600 mt-1">+8% 증가</div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
                  <MessageSquare className="w-8 h-8 text-purple-600 mb-2" />
                  <div className="text-3xl font-bold text-purple-600 mb-1">{content.comments?.length || 0}</div>
                  <div className="text-sm text-purple-700 font-medium">댓글</div>
                  <div className="text-xs text-purple-600 mt-1">활발한 참여</div>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
                  <Share2 className="w-8 h-8 text-orange-600 mb-2" />
                  <div className="text-3xl font-bold text-orange-600 mb-1">{content.shares || 0}</div>
                  <div className="text-sm text-orange-700 font-medium">공유</div>
                  <div className="text-xs text-orange-600 mt-1">바이럴 효과</div>
                </div>
              </div>

              {/* 참여율 */}
              <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">참여율 분석</h4>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">좋아요율</span>
                      <span className="font-semibold text-green-600">
                        {content.views ? ((content.likes || 0) / content.views * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${content.views ? ((content.likes || 0) / content.views * 100) : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">댓글 참여율</span>
                      <span className="font-semibold text-purple-600">
                        {content.views ? ((content.comments?.length || 0) / content.views * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${content.views ? ((content.comments?.length || 0) / content.views * 100) : 0}%` }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">공유율</span>
                      <span className="font-semibold text-orange-600">
                        {content.views ? ((content.shares || 0) / content.views * 100).toFixed(1) : 0}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{ width: `${content.views ? ((content.shares || 0) / content.views * 100) : 0}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 시간대별 조회수 (mock) */}
              <div className="bg-white rounded-lg p-6 border-2 border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">시간대별 조회 패턴</h4>
                <div className="text-sm text-gray-500 text-center py-8">
                  시간대별 조회수 차트 (백엔드 연동 후 구현)
                </div>
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

export default ContentDetailModal;
