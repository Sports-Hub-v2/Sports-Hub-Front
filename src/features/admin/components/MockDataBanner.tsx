// src/features/admin/components/MockDataBanner.tsx

interface MockDataBannerProps {
  style?: React.CSSProperties;
}

const MockDataBanner: React.FC<MockDataBannerProps> = ({ style }) => {
  return (
    <div
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '12px 20px',
        borderRadius: '8px',
        marginBottom: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)',
        ...style
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span style={{ fontSize: '24px' }}>🎨</span>
        <div>
          <div style={{ fontWeight: '600', fontSize: '14px' }}>
            프론트엔드 목업 데이터
          </div>
          <div style={{ fontSize: '12px', opacity: 0.9 }}>
            현재 표시되는 데이터는 설계/참고용 샘플 데이터입니다
          </div>
        </div>
      </div>
      <div
        style={{
          background: 'rgba(255, 255, 255, 0.2)',
          padding: '6px 12px',
          borderRadius: '6px',
          fontSize: '11px',
          fontWeight: '600',
          textTransform: 'uppercase',
          letterSpacing: '0.5px'
        }}
      >
        Mock Data
      </div>
    </div>
  );
};

export default MockDataBanner;
