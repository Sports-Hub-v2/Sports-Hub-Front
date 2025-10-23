import { useLocation, useNavigate } from "react-router-dom";
import { X, Search, Filter, Eye, Edit2, Trash2, CheckCircle, Clock, FileText } from "lucide-react";
import { useState } from "react";
import AdminLayout from "../components/AdminLayout";

const contentMetrics = [
  {
    label: "공지",
    value: "12",
    delta: "게시 9",
    deltaTone: "metric-neutral",
    note: "검수 3",
  },
  {
    label: "게시물",
    value: "48",
    delta: "검수 6",
    deltaTone: "metric-negative",
    note: "대기 5",
  },
  {
    label: "배너",
    value: "6",
    delta: "진행 2",
    deltaTone: "metric-positive",
    note: "예약 1",
  },
];

const pendingReviews = [
  {
    id: "CNT-320",
    type: "게시물",
    title: "주간 MVP 리뷰",
    author: "coach_lee",
    status: "검수 중",
    updatedAt: "어제 22:14",
  },
  {
    id: "CNT-318",
    type: "공지",
    title: "4월 경기 일정 안내",
    author: "운영팀",
    status: "게시",
    updatedAt: "오늘 09:20",
  },
  {
    id: "CNT-315",
    type: "배너",
    title: "스폰서 이벤트 안내",
    author: "marketing",
    status: "초안",
    updatedAt: "어제 18:02",
  },
];

const todayPosts = [
  {
    id: "POST-401",
    type: "팀 게시물",
    title: "강남 FC 주간 훈련 일정 안내",
    author: "강남FC_관리자",
    status: "게시됨",
    createdAt: "오늘 08:30",
    views: 124,
  },
  {
    id: "POST-402",
    type: "용병 모집",
    title: "내일 아침 6시 경기 용병 1명 구합니다",
    author: "축구왕김씨",
    status: "게시됨",
    createdAt: "오늘 09:15",
    views: 89,
  },
  {
    id: "POST-403",
    type: "공지사항",
    title: "4월 정기 점검 안내",
    author: "운영팀",
    status: "게시됨",
    createdAt: "오늘 10:00",
    views: 342,
  },
  {
    id: "POST-404",
    type: "팀 모집",
    title: "주말 경기 상대팀 찾습니다",
    author: "성동FC",
    status: "검수 중",
    createdAt: "오늘 11:20",
    views: 56,
  },
  {
    id: "POST-405",
    type: "후기",
    title: "지난 주말 경기 후기 - 강남 FC vs 서초 유나이티드",
    author: "축구매니아",
    status: "게시됨",
    createdAt: "오늘 12:45",
    views: 178,
  },
];

const templateShortcuts = [
  {
    title: "공지 템플릿",
    highlight: "8개",
    meta: "최근 업데이트 3월 10일",
    actions: ["경기 일정", "점검 안내", "이벤트"]
  },
  {
    title: "신고 답변",
    highlight: "5개",
    meta: "담당자 배정 자동화",
    actions: ["폭언", "부정 행위", "노쇼"]
  },
  {
    title: "홍보 배너",
    highlight: "6개",
    meta: "A/B 테스트 진행",
    actions: ["스폰서", "팀 모집", "용병 모집"]
  },
];

// 전체 콘텐츠 목록
const allContents = [
  ...todayPosts.map(p => ({ ...p, createdAt: p.createdAt, updatedAt: p.createdAt })),
  {
    id: "POST-400",
    type: "팀 게시물",
    title: "서초 유나이티드 월간 MVP 투표",
    author: "서초유나이티드",
    status: "게시됨",
    createdAt: "어제 20:30",
    updatedAt: "어제 20:30",
    views: 256,
  },
  {
    id: "POST-399",
    type: "용병 모집",
    title: "주말 저녁 7시 경기 용병 2명 구합니다",
    author: "광진FC",
    status: "게시됨",
    createdAt: "어제 18:15",
    updatedAt: "어제 18:15",
    views: 178,
  },
  {
    id: "POST-398",
    type: "후기",
    title: "첫 조기축구 경험 후기",
    author: "축구초보",
    status: "검수 중",
    createdAt: "어제 16:45",
    updatedAt: "어제 16:45",
    views: 89,
  },
  {
    id: "CNT-319",
    type: "공지",
    title: "봄맞이 친선 대회 안내",
    author: "운영팀",
    status: "게시됨",
    createdAt: "2일 전",
    updatedAt: "2일 전",
    views: 445,
  },
  {
    id: "POST-397",
    type: "팀 모집",
    title: "평일 저녁 정기 경기 상대팀 모집",
    author: "성북FC",
    status: "게시됨",
    createdAt: "2일 전",
    updatedAt: "2일 전",
    views: 167,
  },
  {
    id: "POST-396",
    type: "팀 게시물",
    title: "강동 FC 신입 멤버 환영합니다",
    author: "강동FC_관리자",
    status: "게시됨",
    createdAt: "3일 전",
    updatedAt: "3일 전",
    views: 203,
  },
  {
    id: "CNT-317",
    type: "배너",
    title: "신규 스폰서 배너 - ABC 스포츠",
    author: "marketing",
    status: "게시됨",
    createdAt: "3일 전",
    updatedAt: "3일 전",
    views: 1234,
  },
  {
    id: "POST-395",
    type: "후기",
    title: "올해 첫 경기 승리 후기!",
    author: "축구왕김씨",
    status: "게시됨",
    createdAt: "4일 전",
    updatedAt: "4일 전",
    views: 312,
  },
];

const ContentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const filterState = location.state as { filter?: string; date?: string; description?: string } | null;

  const [selectedContent, setSelectedContent] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 필터 상태
  const [contentFilters, setContentFilters] = useState({
    type: 'all', // all, 공지, 게시물, 배너, 팀 게시물, 용병 모집, 팀 모집, 후기
    status: 'all', // all, 게시됨, 검수 중, 초안
    searchQuery: '',
    sortBy: 'newest' // newest, oldest, views
  });

  const clearFilter = () => {
    navigate('/admin/content', { replace: true, state: {} });
  };

  const isFilterActive = filterState?.filter === 'today-posts';

  const handleContentClick = (content: any) => {
    setSelectedContent(content);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedContent(null);
  };

  // 필터링된 콘텐츠 목록
  const filteredContents = allContents.filter(content => {
    // 타입 필터
    if (contentFilters.type !== 'all' && content.type !== contentFilters.type) {
      return false;
    }

    // 상태 필터
    if (contentFilters.status !== 'all' && content.status !== contentFilters.status) {
      return false;
    }

    // 검색어 필터
    if (contentFilters.searchQuery) {
      const query = contentFilters.searchQuery.toLowerCase();
      const searchText = `${content.title} ${content.author} ${content.id}`.toLowerCase();
      if (!searchText.includes(query)) {
        return false;
      }
    }

    return true;
  }).sort((a, b) => {
    if (contentFilters.sortBy === 'views') {
      return (b.views || 0) - (a.views || 0);
    }
    // newest, oldest는 날짜 기반이지만 mock 데이터라 간단히 ID 기반으로
    return contentFilters.sortBy === 'newest'
      ? b.id.localeCompare(a.id)
      : a.id.localeCompare(b.id);
  });

  // 타입별 개수 계산
  const contentCounts = {
    all: allContents.length,
    공지: allContents.filter(c => c.type === '공지').length,
    게시물: allContents.filter(c => c.type.includes('게시물') || c.type.includes('모집') || c.type.includes('후기')).length,
    배너: allContents.filter(c => c.type === '배너').length,
  };

  return (
    <AdminLayout activePage="content">
      {/* Filter Banner */}
      {isFilterActive && (
        <div
          style={{
            background: "linear-gradient(135deg, var(--admin-primary) 0%, #0066ff 100%)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            borderRadius: "12px",
            padding: "16px 20px",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 4px 12px rgba(0, 123, 255, 0.15)",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ fontSize: "20px" }}>📊</span>
            <div>
              <div style={{ color: "white", fontWeight: "600", fontSize: "15px" }}>
                필터 적용 중: {filterState?.description}
              </div>
              <div style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: "13px", marginTop: "2px" }}>
                날짜: {filterState?.date}
              </div>
            </div>
          </div>
          <button
            onClick={clearFilter}
            style={{
              background: "rgba(255, 255, 255, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              borderRadius: "8px",
              color: "white",
              padding: "8px 16px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "14px",
              fontWeight: "500",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "rgba(255, 255, 255, 0.2)";
            }}
          >
            <X size={16} />
            필터 해제
          </button>
        </div>
      )}

      {/* Show only today's posts when filter is active */}
      {isFilterActive ? (
        <section className="admin-section">
          <div className="section-header">
            <h2 className="section-title">오늘 작성된 게시물</h2>
            <span className="section-meta">{todayPosts.length}건의 게시물</span>
          </div>
          <div className="card table-card">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>유형</th>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>상태</th>
                  <th>작성 시간</th>
                  <th>조회수</th>
                </tr>
              </thead>
              <tbody>
                {todayPosts.map((post) => (
                  <tr
                    key={post.id}
                    onClick={() => handleContentClick(post)}
                    style={{ cursor: 'pointer' }}
                    className="hover:bg-gray-50"
                  >
                    <td>{post.id}</td>
                    <td>{post.type}</td>
                    <td>{post.title}</td>
                    <td>{post.author}</td>
                    <td>
                      <span
                        className={`status-pill ${
                          post.status === "게시됨"
                            ? "positive"
                            : post.status === "검수 중"
                            ? "warning"
                            : "neutral"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td>{post.createdAt}</td>
                    <td>{post.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ) : (
        <>
          <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">콘텐츠 현황</h2>
          <div className="section-actions">
            <button type="button" className="section-btn">
              템플릿 관리
            </button>
            <button type="button" className="section-btn primary">
              새 공지 작성
            </button>
          </div>
        </div>
        <div className="metric-grid">
          {contentMetrics.map((metric) => (
            <div key={metric.label} className="metric-card">
              <div className="metric-top">
                <span className="metric-label">{metric.label}</span>
              </div>
              <strong className="metric-value">{metric.value}</strong>
              <div className="metric-footer">
                <span className={`metric-delta ${metric.deltaTone}`}>{metric.delta}</span>
                <span className="metric-note">{metric.note}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">검수 대기 목록</h2>
          <span className="section-meta">자동화 규칙: 긴급 공지 우선</span>
        </div>
        <div className="card table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>유형</th>
                <th>제목</th>
                <th>작성자</th>
                <th>상태</th>
                <th>업데이트</th>
              </tr>
            </thead>
            <tbody>
              {pendingReviews.map((item) => (
                <tr
                  key={item.id}
                  onClick={() => handleContentClick(item)}
                  style={{ cursor: 'pointer' }}
                  className="hover:bg-gray-50"
                >
                  <td>{item.id}</td>
                  <td>{item.type}</td>
                  <td>{item.title}</td>
                  <td>{item.author}</td>
                  <td>
                    <span
                      className={`status-pill ${
                        item.status === "검수 중"
                          ? "warning"
                          : item.status === "게시"
                          ? "positive"
                          : "neutral"
                      }`}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>{item.updatedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">템플릿 & 워크플로우</h2>
          <span className="section-meta">빠른 액션</span>
        </div>
        <div className="grid-3">
          {templateShortcuts.map((template) => (
            <div key={template.title} className="card simple-card">
              <h3 className="card-title">{template.title}</h3>
              <p className="card-highlight">{template.highlight}</p>
              <p className="card-meta">{template.meta}</p>
              <div className="quick-actions">
                {template.actions.map((action) => (
                  <button key={action} type="button" className="quick-btn">
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 전체 콘텐츠 관리 섹션 */}
      <section className="admin-section">
        <div className="section-header">
          <h2 className="section-title">전체 콘텐츠 관리</h2>
          <span className="section-meta">총 {allContents.length}개 · 필터링 결과 {filteredContents.length}개</span>
        </div>

        {/* 필터 영역 */}
        <div className="card" style={{ marginBottom: '24px', padding: '24px' }}>
          {/* 타입 필터 */}
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
              <Filter className="w-4 h-4" style={{ color: 'var(--admin-text-secondary)' }} />
              <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--admin-text)' }}>콘텐츠 타입</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
              {[
                { value: 'all', label: '전체', count: contentCounts.all, icon: '📋' },
                { value: '공지', label: '공지', count: contentCounts.공지, icon: '📢' },
                { value: '게시물', label: '게시물', count: contentCounts.게시물, icon: '📝' },
                { value: '배너', label: '배너', count: contentCounts.배너, icon: '🎨' },
              ].map(option => (
                <button
                  key={option.value}
                  onClick={() => setContentFilters({ ...contentFilters, type: option.value })}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    contentFilters.type === option.value
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span style={{ marginRight: '4px' }}>{option.icon}</span>
                  {option.label}
                  <span className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                    contentFilters.type === option.value
                      ? 'bg-white/20'
                      : 'bg-gray-200'
                  }`}>
                    {option.count}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 상태 및 검색 필터 */}
          <div style={{ display: 'grid', gridTemplateColumns: '200px 200px 1fr', gap: '12px' }}>
            {/* 상태 필터 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                상태
              </label>
              <select
                value={contentFilters.status}
                onChange={(e) => setContentFilters({ ...contentFilters, status: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">전체</option>
                <option value="게시됨">게시됨</option>
                <option value="검수 중">검수 중</option>
                <option value="초안">초안</option>
              </select>
            </div>

            {/* 정렬 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                정렬
              </label>
              <select
                value={contentFilters.sortBy}
                onChange={(e) => setContentFilters({ ...contentFilters, sortBy: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="newest">최신순</option>
                <option value="oldest">오래된순</option>
                <option value="views">조회순</option>
              </select>
            </div>

            {/* 검색 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                검색
              </label>
              <div style={{ position: 'relative' }}>
                <Search className="w-4 h-4" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--admin-text-secondary)' }} />
                <input
                  type="text"
                  placeholder="제목, 작성자, ID 검색..."
                  value={contentFilters.searchQuery}
                  onChange={(e) => setContentFilters({ ...contentFilters, searchQuery: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '8px 12px 8px 40px',
                    border: '1px solid var(--admin-border)',
                    borderRadius: '8px',
                    fontSize: '14px',
                    background: 'var(--admin-bg)',
                    color: 'var(--admin-text)',
                  }}
                />
              </div>
            </div>
          </div>

          {/* 필터 초기화 버튼 */}
          {(contentFilters.type !== 'all' || contentFilters.status !== 'all' || contentFilters.searchQuery) && (
            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setContentFilters({
                  type: 'all',
                  status: 'all',
                  searchQuery: '',
                  sortBy: 'newest'
                })}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm font-medium"
              >
                <X className="w-4 h-4 inline mr-1" />
                필터 초기화
              </button>
            </div>
          )}
        </div>

        {/* 콘텐츠 목록 테이블 */}
        <div className="card table-card">
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>타입</th>
                <th>제목</th>
                <th>작성자</th>
                <th>상태</th>
                <th>작성일</th>
                <th>조회수</th>
                <th>액션</th>
              </tr>
            </thead>
            <tbody>
              {filteredContents.length > 0 ? (
                filteredContents.map((content) => (
                  <tr
                    key={content.id}
                    className="hover:bg-gray-50"
                  >
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: '600', color: 'var(--admin-primary)' }}>
                        {content.id}
                      </span>
                    </td>
                    <td>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs font-medium">
                        {content.type}
                      </span>
                    </td>
                    <td style={{ fontWeight: '500' }}>{content.title}</td>
                    <td>{content.author}</td>
                    <td>
                      <span className={`status-pill ${
                        content.status === '게시됨' ? 'positive' :
                        content.status === '검수 중' ? 'warning' :
                        'neutral'
                      }`}>
                        {content.status}
                      </span>
                    </td>
                    <td>{content.createdAt}</td>
                    <td>
                      <div className="flex items-center gap-1">
                        <Eye className="w-4 h-4 text-gray-400" />
                        <span>{content.views || 0}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: '4px' }}>
                        <button
                          onClick={() => handleContentClick(content)}
                          className="p-1.5 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 transition-colors"
                          title="상세보기"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 bg-green-50 text-green-600 rounded hover:bg-green-100 transition-colors"
                          title="수정"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button
                          className="p-1.5 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors"
                          title="삭제"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '40px', color: 'var(--admin-text-secondary)' }}>
                    필터 조건에 맞는 콘텐츠가 없습니다.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
        </>
      )}

      {/* 콘텐츠 상세 모달 */}
      {isModalOpen && selectedContent && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            {/* 헤더 */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-5 flex justify-between items-start rounded-t-xl">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-6 h-6" />
                  <h2 className="text-2xl font-bold">콘텐츠 상세</h2>
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    selectedContent.status === '게시됨' ? 'bg-green-100 text-green-700' :
                    selectedContent.status === '검수 중' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {selectedContent.status}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-purple-100">
                  <span className="px-2 py-1 bg-white/20 rounded">{selectedContent.type}</span>
                  <span>ID: {selectedContent.id}</span>
                </div>
              </div>
              <button
                onClick={handleModalClose}
                className="text-white hover:bg-white/20 p-2 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* 본문 */}
            <div className="p-6 space-y-6">
              {/* 제목 */}
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">{selectedContent.title}</h3>
              </div>

              {/* 정보 */}
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-3">작성 정보</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">작성자</span>
                      <span className="font-medium text-gray-900">{selectedContent.author}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">작성일</span>
                      <span className="font-medium text-gray-900">{selectedContent.createdAt}</span>
                    </div>
                    {selectedContent.updatedAt && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">수정일</span>
                        <span className="font-medium text-gray-900">{selectedContent.updatedAt}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-semibold text-gray-900 mb-3">통계</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">조회수</span>
                      <span className="font-bold text-blue-600 text-lg">{selectedContent.views || 0}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">타입</span>
                      <span className="font-medium text-gray-900">{selectedContent.type}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">상태</span>
                      <span className="font-medium text-gray-900">{selectedContent.status}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 액션 버튼들 */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3">관리 액션</h4>
                <div className="flex flex-wrap gap-3">
                  <button className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm">
                    <CheckCircle className="w-4 h-4" />
                    승인 및 게시
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm">
                    <Edit2 className="w-4 h-4" />
                    수정
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium text-sm">
                    <Clock className="w-4 h-4" />
                    검수 대기
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm">
                    <Trash2 className="w-4 h-4" />
                    삭제
                  </button>
                </div>
              </div>
            </div>

            {/* 푸터 */}
            <div className="sticky bottom-0 bg-gray-50 border-t px-6 py-4 flex justify-end gap-3 rounded-b-xl">
              <button
                onClick={handleModalClose}
                className="px-5 py-2.5 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors font-medium"
              >
                닫기
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default ContentPage;

