// src/components/common/Modal.tsx

import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string; // 모달 제목 (선택 사항)
  children: React.ReactNode; // 모달 내부에 들어갈 내용
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // isOpen이 false이면 아무것도 렌더링하지 않습니다.
  if (!isOpen) return null;

  // 모달 배경 클릭 시 닫기 (이벤트 버블링 방지)
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    // 모달 배경 (Overlay)
    <div
      className="fixed inset-0 z-50 bg-black bg-opacity-60 flex justify-center items-center p-4 animate-fadeIn"
      onClick={handleBackdropClick}
    >
      {/* 모달 컨텐츠 컨테이너 */}
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto animate-scaleUp">
        {/* 헤더: 제목과 닫기 버튼 */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          {title ? (
            <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          ) : (
            <div /> // 제목이 없을 때 공간을 차지하기 위한 빈 div
          )}
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl p-1 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="닫기"
          >
            &times;
          </button>
        </div>

        {/* 바디: 실제 컨텐츠가 들어갈 부분 */}
        <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;