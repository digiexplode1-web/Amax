import React, { useEffect, useState } from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { 
  Package, 
  FolderTree, 
  MessageSquare, 
  ShoppingCart,
  TrendingUp,
  Image as ImageIcon,
  MousePointerClick,
  Users
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Link } from 'react-router-dom';

export const Dashboard: React.FC = () => {
  const { allProducts: products, categories, isSeeding, seedInitialDataIfEmpty } = useShop();
  
  const [enquiriesCount, setEnquiriesCount] = useState(0);
  const [recentEnquiries, setRecentEnquiries] = useState<any[]>([]);
  
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'contacts'), (snap) => {
      setEnquiriesCount(snap.size);
    }, (err) => {
      console.warn("Contacts count listener warning:", err.message);
    });
    
    const q = query(collection(db, 'contacts'), orderBy('createdAt', 'desc'), limit(3));
    const unsubRecent = onSnapshot(q, (snap) => {
      setRecentEnquiries(snap.docs.map(d => d.data()));
    }, (err) => {
      console.warn("Recent contacts listener warning:", err.message);
    });
    
    return () => {
      unsub();
      unsubRecent();
    };
  }, []);


  const stats = [
    { label: 'Total Products', value: products.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100' },
    { label: 'Total Categories', value: categories.length, icon: FolderTree, color: 'text-purple-600', bg: 'bg-purple-100' },
    { label: 'New Enquiries', value: enquiriesCount, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-100' },
    { label: 'Pending Orders', value: 5, icon: ShoppingCart, color: 'text-green-600', bg: 'bg-green-100' },
    { label: 'Website Views', value: '2.4k', icon: TrendingUp, color: 'text-[#751C2F]', bg: 'bg-[#F4E3DD]' },
    { label: 'Media Assets', value: 145, icon: ImageIcon, color: 'text-gray-600', bg: 'bg-gray-100' },
  ];

  const quickActions = [
    { label: 'Add Product', icon: Package, href: '/admin/products?action=add' },
    { label: 'Add Category', icon: FolderTree, href: '/admin/categories?action=add' },
    { label: 'Edit Homepage', icon: MousePointerClick, href: '/admin/homepage' },
    { label: 'View Enquiries', icon: MessageSquare, href: '/admin/enquiries' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[#25201E]">Admin Dashboard</h1>
          <p className="text-[#756A64] text-sm mt-1">Welcome back. Here's what's happening today.</p>
        </div>
        
        {products.length === 0 && (
          <button
            onClick={seedInitialDataIfEmpty}
            disabled={isSeeding}
            className="px-4 py-2 bg-[#751C2F] text-white rounded-lg text-sm font-medium hover:bg-[#591423] transition-colors disabled:opacity-50 whitespace-nowrap"
          >
            {isSeeding ? 'Seeding Data...' : 'Seed Initial Data'}
          </button>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-[#F4E3DD] shadow-sm flex flex-col">
            <div className={`w-10 h-10 rounded-lg ${stat.bg} ${stat.color} flex items-center justify-center mb-3`}>
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-[#25201E] mb-1">{stat.value}</div>
            <div className="text-xs font-medium text-[#756A64] uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Actions & Recent Activity */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-xl border border-[#F4E3DD] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F4E3DD] bg-[#FFF9F0]/50">
              <h2 className="font-semibold text-[#25201E]">Quick Actions</h2>
            </div>
            <div className="p-2 grid grid-cols-2 gap-2">
              {quickActions.map((action, i) => (
                <Link
                  key={i}
                  to={action.href}
                  className="flex flex-col items-center justify-center p-4 rounded-lg hover:bg-[#FFF9F0] transition-colors text-center group border border-transparent hover:border-[#F4E3DD]"
                >
                  <action.icon className="w-6 h-6 text-[#751C2F] mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-xs font-medium text-[#25201E]">{action.label}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-[#F4E3DD] shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-[#F4E3DD] bg-[#FFF9F0]/50 flex justify-between items-center">
              <h2 className="font-semibold text-[#25201E]">Recent Enquiries</h2>
              <Link to="/admin/enquiries" className="text-xs text-[#751C2F] font-medium hover:underline">View All</Link>
            </div>
            <div className="divide-y divide-[#F4E3DD]">
              {[1, 2, 3].map((_, i) => (
                <div key={i} className="p-4 hover:bg-[#FFF9F0]/50 transition-colors">
                  <div className="flex justify-between items-start mb-1">
                    <span className="font-medium text-sm text-[#25201E]">Ayush G.</span>
                    <span className="text-xs text-[#756A64]">2h ago</span>
                  </div>
                  <p className="text-xs text-[#756A64] line-clamp-1">Custom CAD request for wedding gate design.</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Charts/Large Content Area */}
        <div className="lg:col-span-2 space-y-6">
           <div className="bg-white rounded-xl border border-[#F4E3DD] shadow-sm overflow-hidden h-full min-h-[400px] flex flex-col">
            <div className="px-5 py-4 border-b border-[#F4E3DD] bg-[#FFF9F0]/50">
              <h2 className="font-semibold text-[#25201E]">Enquiry Activity</h2>
            </div>
            <div className="flex-1 p-5 flex items-center justify-center">
              <div className="text-center">
                <TrendingUp className="w-12 h-12 text-[#C7953E]/40 mx-auto mb-3" />
                <p className="text-[#756A64] text-sm">Chart visualization will appear here.</p>
                <p className="text-xs text-[#756A64]/70 mt-1">Connects to live analytics data.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
