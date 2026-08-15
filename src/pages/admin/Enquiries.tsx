import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { MessageSquare, Search, Filter, Trash2, MoreVertical } from 'lucide-react';

export const Enquiries: React.FC = () => {
  const [enquiries, setEnquiries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'));
    const unsub = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setEnquiries(data);
      setLoading(false);
    }, (error) => {
      console.warn("Enquiries listener warning:", error.message);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this enquiry?')) {
      await deleteDoc(doc(db, 'contacts', id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#25201E]">Enquiries</h1>
          <p className="text-[#756A64] text-sm mt-1">Manage customer messages and CAD requests.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#F4E3DD] shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-[#F4E3DD] flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#756A64]" />
            <input type="text" placeholder="Search enquiries..." className="w-full pl-9 pr-4 py-2 bg-[#FFF9F0] border border-[#F4E3DD] rounded-lg text-sm focus:outline-none focus:border-[#C7953E]" />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 border border-[#F4E3DD] rounded-lg text-sm font-medium text-[#756A64] hover:bg-[#FFF9F0] transition-colors">
              <Filter className="w-4 h-4" />
              Status
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-[#FFF9F0]/50 border-b border-[#F4E3DD]">
                <th className="p-4 font-semibold text-[#25201E]">Customer</th>
                <th className="p-4 font-semibold text-[#25201E]">Subject</th>
                <th className="p-4 font-semibold text-[#25201E]">Date</th>
                <th className="p-4 font-semibold text-[#25201E]">Status</th>
                <th className="p-4 font-semibold text-[#25201E] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#F4E3DD]">
              {/* Dummy data for now */}
              {[
                { name: 'Ayush G.', email: 'ayush@example.com', subject: 'Custom CAD Request', date: 'Just now', status: 'New' },
                { name: 'Sarah M.', email: 'sarah@example.com', subject: 'Bulk Order for Room Dividers', date: '2 hours ago', status: 'In Progress' },
                { name: 'Raj K.', email: 'raj@example.com', subject: 'Product Enquiry: Golden Gates', date: '1 day ago', status: 'Completed' },
              ].map((enquiry, i) => (
                <tr key={i} className="hover:bg-[#FFF9F0]/30 transition-colors group">
                  <td className="p-4">
                    <div className="font-medium text-[#25201E]">{enquiry.name}</div>
                    <div className="text-xs text-[#756A64] mt-0.5">{enquiry.email}</div>
                  </td>
                  <td className="p-4 text-[#25201E]">{enquiry.subject}</td>
                  <td className="p-4 text-[#756A64]">{enquiry.date}</td>
                  <td className="p-4">
                    <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-medium ${
                      enquiry.status === 'New' ? 'bg-orange-100 text-orange-700' :
                      enquiry.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                      {enquiry.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <button className="p-1.5 text-[#756A64] hover:text-[#751C2F] hover:bg-[#F4E3DD] rounded transition-colors" title="View Details">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
