import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, deleteDoc, doc, query, orderBy } from 'firebase/firestore';

interface Notice {
  id: string;
  title: string;
  category: string;
  createdAt: any;
  pinned: boolean;
}

export default function NoticeManagementPage({ onBack }: { onBack: () => void }) {
  const [notices, setNotices] = useState<Notice[]>([]);

  useEffect(() => {
    const q = query(collection(db, "notices"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const list: Notice[] = [];
      snapshot.forEach((docSnap) => {
        list.push({ id: docSnap.id, ...docSnap.data() } as Notice);
      });
      setNotices(list);
    });
    return unsubscribe;
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("আপনি কি নিশ্চিত এই নোটিশটি ডিলিট করতে চান?")) {
      await deleteDoc(doc(db, "notices", id));
    }
  };

  return (
    <div className="p-6 pb-24">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={onBack} className="p-2 bg-gray-100 rounded-full">←</button>
        <h1 className="text-2xl font-bold">নোটিশ ম্যানেজমেন্ট</h1>
      </div>
      <div className="space-y-4">
        {notices.map((notice) => (
          <div key={notice.id} className="bg-white p-4 rounded-lg shadow border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="font-bold">{notice.title || "নোটিশ"}</h3>
              <p className="text-sm text-gray-500">{notice.category}</p>
            </div>
            <button 
              onClick={() => handleDelete(notice.id)}
              className="bg-red-500 text-white px-3 py-1 rounded text-sm"
            >
              ডিলিট
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
