import React from 'react';

export default function PushNotificationPage({ onBack }: { onBack: () => void }) {
  const handleSendPush = () => {
    if (typeof (window as any).sendAllPushNotification === 'function') {
      (window as any).sendAllPushNotification();
    } else {
      alert("Push notification functionality not available.");
    }
  };

  return (
    <div className="p-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-full">←</button>
        <h1 className="text-2xl font-bold">পুশ নোটিফিকেশন</h1>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="font-bold mb-4">সকলকে নোটিফিকেশন পাঠান</h2>
        <button 
          onClick={handleSendPush}
          className="bg-orange-500 text-white px-4 py-2 rounded-lg font-bold"
        >
          নোটিফিকেশন পাঠান
        </button>
      </div>
    </div>
  );
}
