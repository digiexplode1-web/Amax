import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Package,
  FolderTree,
  Image as ImageIcon,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  X,
  Bell,
  Search,
  LogOut,
  ChevronDown,
  LayoutTemplate,
  MessageSquare,
  FileText,
  UserCheck
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out of the admin panel?')) {
      await logout();
      navigate('/', { replace: true });
    }
  };

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard, exact: true },
    { 
      name: 'Website Content', 
      icon: LayoutTemplate,
      children: [
        { name: 'Visual Page Editor', href: '/admin/editor' },
        { name: 'Homepage', href: '/admin/homepage' },
      ]
    },
    {
      name: 'Catalogue',
      icon: Package,
      children: [
        { name: 'Products', href: '/admin/products' },
        { name: 'Categories', href: '/admin/categories' },
      ]
    },
    { name: 'Media Library', href: '/admin/media', icon: ImageIcon },
    { 
      name: 'Sales', 
      icon: ShoppingCart,
      children: [
        { name: 'Orders', href: '/admin/orders' },
        { name: 'Enquiries', href: '/admin/enquiries' },
      ]
    },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex font-sans selection:bg-[#751C2F] selection:text-white">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-[#751C2F] text-white transition-transform duration-300 ease-in-out
        md:static md:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="h-16 flex items-center justify-between px-6 bg-[#591423]">
          <Link to="/admin" className="text-xl font-serif font-bold text-white">
            Amax Admin
          </Link>
          <button className="md:hidden text-white/80 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 overflow-y-auto h-[calc(100vh-4rem)]">
          <nav className="space-y-1">
            {navigation.map((item) => {
              if (item.children) {
                return (
                  <div key={item.name} className="py-2">
                    <div className="flex items-center px-3 py-2 text-xs font-bold text-white/60 uppercase tracking-wider">
                      <item.icon className="w-4 h-4 mr-3" />
                      {item.name}
                    </div>
                    <div className="mt-1 space-y-1 pl-10">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.href}
                          className={`block px-3 py-2 text-sm rounded-md transition-colors ${
                            pathname === child.href
                              ? 'bg-[#591423] text-white font-medium'
                              : 'text-white/80 hover:bg-[#591423] hover:text-white'
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                );
              }

              return (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center px-3 py-2 text-sm rounded-md transition-colors ${
                    (item.exact ? pathname === item.href : pathname.startsWith(item.href))
                      ? 'bg-[#591423] text-white font-medium'
                      : 'text-white/80 hover:bg-[#591423] hover:text-white'
                  }`}
                >
                  <item.icon className="w-4 h-4 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top header */}
        <header className="h-16 bg-white border-b border-[#F4E3DD] flex items-center justify-between px-4 sm:px-6 z-10">
          <div className="flex items-center flex-1">
            <button
              className="md:hidden mr-4 text-[#756A64] hover:text-[#751C2F]"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="max-w-md w-full hidden sm:block relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#756A64]" />
              <input 
                type="text" 
                placeholder="Search anything..." 
                className="w-full pl-9 pr-4 py-2 bg-[#FFF9F0] border border-[#F4E3DD] rounded-full text-sm focus:outline-none focus:border-[#C7953E] focus:ring-1 focus:ring-[#C7953E] transition-shadow text-[#25201E]"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-2 text-[#756A64] hover:text-[#751C2F] transition-colors rounded-full hover:bg-[#FFF9F0]">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-[#751C2F] rounded-full border border-white"></span>
            </button>
            
            <div className="h-8 w-px bg-[#F4E3DD]"></div>

            {/* Admin User Menu */}
            <div className="relative">
              <button 
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 cursor-pointer group text-[#756A64] hover:text-[#751C2F] transition-colors"
                title="Account Settings"
              >
                <div className="w-8 h-8 bg-[#751C2F] text-white rounded-full flex items-center justify-center font-bold text-sm group-hover:bg-[#5a1524]">
                  {user?.email ? user.email.charAt(0).toUpperCase() : 'A'}
                </div>
                <div className="text-left hidden sm:block">
                  <span className="text-xs font-bold text-[#25201E] block group-hover:text-[#751C2F]">
                    {user?.email || 'Admin'}
                  </span>
                  <span className="text-[10px] text-[#756A64] block font-medium">Administrator</span>
                </div>
                <ChevronDown className="w-4 h-4 text-[#756A64]" />
              </button>

              {userMenuOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-[#F4E3DD] py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150"
                  onClick={() => setUserMenuOpen(false)}
                >
                  <div className="px-4 py-2 border-b border-[#F4E3DD]">
                    <p className="text-xs font-bold text-[#25201E]">Logged in as</p>
                    <p className="text-xs text-[#756A64] truncate font-medium">{user?.email || 'Admin Account'}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto bg-[#FFF9F0] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
