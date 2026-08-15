const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/Dashboard.tsx', 'utf8');

const hookCode = `import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';`;

code = code.replace(/import React from 'react';/, hookCode);

const innerCode = `  const { products, categories, isSeeding, seedInitialDataIfEmpty } = useShop();
  
  const [enquiriesCount, setEnquiriesCount] = useState(0);
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'contacts'), (snap) => {
      setEnquiriesCount(snap.size);
    });
    
    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'), limit(3));
    const unsubRecent = onSnapshot(q, (snap) => {
      setRecentEnquiries(snap.docs.map(d => d.data()));
    });
    
    return () => {
      unsub();
      unsubRecent();
    };
  }, []);
`;

code = code.replace(/  const { products, categories, isSeeding, seedInitialDataIfEmpty } = useShop\(\);/, innerCode);

code = code.replace(/value: 12, icon: MessageSquare/, "value: enquiriesCount, icon: MessageSquare");

const recentEnqMapCode = `
              {recentEnquiries.length === 0 ? (
                <div className="p-4 text-sm text-gray-500 text-center">No recent enquiries</div>
              ) : recentEnquiries.map((enq, i) => (
                <div key={i} className="p-4 hover:bg-[#FFF9F0]/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm text-[#25201E]">{enq.name}</span>
                    <span className="text-xs text-[#756A64]">{(enq.createdAt ? new Date(enq.createdAt).toLocaleDateString() : '')}</span>
                  </div>
                  <p className="text-xs text-[#756A64] line-clamp-1">{enq.message}</p>
                </div>
              ))}
`;

code = code.replace(/              \{\[1, 2, 3\].map\(\(_, i\) => \([\s\S]*?<\/div>\)\n              \}\)/, recentEnqMapCode);

fs.writeFileSync('src/pages/admin/Dashboard.tsx', code);
