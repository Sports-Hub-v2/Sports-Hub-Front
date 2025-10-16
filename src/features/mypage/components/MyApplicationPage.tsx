// src/features/myPage/pages/MyApplicationPage.tsx
import React, { useState } from 'react';
import MySentApplications from '../components/MySentApplications';
import MyReceivedApplications from '../components/MyReceivedApplications';

type Tab = 'sent' | 'received';

const MyApplicationPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('sent');

  const getTabClass = (tabName: Tab) => {
    return `px-4 py-2 font-semibold rounded-t-lg ${activeTab === tabName ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'}`;
  };

  return (
    <div className="w-full">
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-4" aria-label="Tabs">
          <button onClick={() => setActiveTab('sent')} className={getTabClass('sent')}>보낸 신청</button>
          <button onClick={() => setActiveTab('received')} className={getTabClass('received')}>받은 신청</button>
        </nav>
      </div>
      <div className="mt-6">
        {activeTab === 'sent' && <MySentApplications />}
        {activeTab === 'received' && <MyReceivedApplications />}
      </div>
    </div>
  );
};

export default MyApplicationPage;

