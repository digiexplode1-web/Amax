const fs = require('fs');
let code = fs.readFileSync('src/pages/admin/Enquiries.tsx', 'utf8');

const fetchCode = `import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { MessageSquare, Search, Filter, Trash2 } from 'lucide-react';

export const Enquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEnquiries(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this enquiry?')) {
      await deleteDoc(doc(db, 'contacts', id));
    }
  };
`;

code = code.replace(/import React from 'react';\nimport { MessageSquare, Search, Filter, MoreVertical } from 'lucide-react';\n\nexport const Enquiries: React\.FC = \(\) => {/, fetchCode);

const tableBodyCode = `
            <tbody>
              {loading ? (
                 <tr><td colSpan={5} className="p-8 text-center text-gray-500">Loading enquiries...</td></tr>
              ) : enquiries.length === 0 ? (
                 <tr><td colSpan={5} className="p-8 text-center text-gray-500">No enquiries found.</td></tr>
              ) : enquiries.map((enq) => (
                <tr key={enq.id} className="border-b border-[#F4E3DD] hover:bg-[#FFF9F0]/30 transition-colors">
                  <td className="p-4 font-medium">{enq.name}</td>
                  <td className="p-4">{enq.email}<br/><span className="text-xs text-gray-500">{enq.phone}</span></td>
                  <td className="p-4 text-xs text-gray-600 max-w-xs truncate">{enq.message}</td>
                  <td className="p-4 text-xs text-gray-400">{enq.createdAt ? new Date(enq.createdAt).toLocaleString() : ''}</td>
                  <td className="p-4 text-right">
                    <button onClick={() => handleDelete(enq.id)} className="text-red-500 hover:bg-red-50 p-2 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
`;

code = code.replace(/            <tbody>[\s\S]*?<\/tbody>/, tableBodyCode);

fs.writeFileSync('src/pages/admin/Enquiries.tsx', code);
