import { useLocation, useNavigate } from "react-router-dom";
import { X } from "lucide-react";
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

const ContentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const filterState = location.state as { filter?: string; date?: string; description?: string } | null;

  const clearFilter = () => {
    navigate('/admin/content', { replace: true, state: {} });
  };

  const isFilterActive = filterState?.filter === 'today-posts';

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
                  <tr key={post.id}>
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
                <tr key={item.id}>
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
        </>
      )}
    </AdminLayout>
  );
};

export default ContentPage;

