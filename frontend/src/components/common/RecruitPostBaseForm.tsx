// src/components/common/RecruitPostBaseForm.tsx

import React from 'react';

// 이 컴포넌트가 받을 props의 타입을 정의합니다.
interface BaseFormProps {
  formData: {
    title: string;
    content: string;
  };
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

const RecruitPostBaseForm: React.FC<BaseFormProps> = ({ formData, handleInputChange }) => {
  return (
    <>
      {/* 제목 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">제목 <span className="text-red-500">*</span></label>
        <input 
          id="title" 
          name="title" 
          type="text" 
          required 
          value={formData.title} 
          onChange={handleInputChange} 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
        />
      </div>

      {/* 상세 내용 */}
      <div>
        <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">상세 내용 <span className="text-red-500">*</span></label>
        <textarea 
          id="content" 
          name="content" 
          rows={5} 
          required 
          value={formData.content} 
          onChange={handleInputChange} 
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
        />
      </div>
    </>
  );
};

export default RecruitPostBaseForm;