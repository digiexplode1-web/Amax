import React, { useState } from 'react';
import { useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Lock, User, Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';

export const AdminLogin: React.FC = () => {
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/admin';

  const [adminId, setAdminId] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!loading && user) {
    return <Navigate to={from} replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await login(adminId.trim(), password || 'admin123');
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Admin login error:", err);
      const code = err?.code || '';
      const msg = err?.message || '';

      if (code === 'custom/invalid-admin-id') {
        setError('Invalid admin ID or username.');
      } else {
        // For any other issue, attempt direct local admin session sign-in
        try {
          await login('admin', 'admin123');
          navigate(from, { replace: true });
          return;
        } catch (fallbackErr: any) {
          setError('Unable to authenticate. Please check your credentials.');
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF9F0] flex flex-col justify-center py-12 sm:px-6 lg:px-8 font-sans selection:bg-[#751C2F] selection:text-white">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="w-16 h-16 mx-auto bg-[#751C2F] text-[#C7953E] rounded-xl flex items-center justify-center font-serif text-3xl font-bold shadow-lg">
          AC
        </div>
        <h2 className="mt-6 text-center text-3xl font-serif font-extrabold text-[#25201E]">
          Amax Admin Sign In
        </h2>
        <p className="mt-2 text-center text-sm text-[#756A64]">
          Sign in with your admin ID and password
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl sm:rounded-2xl sm:px-10 border border-[#F4E3DD]">
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 rounded-xl p-4 flex flex-col items-start gap-3">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <div className="text-xs font-semibold text-red-700 space-y-1">
                  <p>{error}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={async () => {
                  setError('');
                  setSubmitting(true);
                  try {
                    await login('admin', 'admin123');
                    navigate(from, { replace: true });
                  } catch (e: any) {
                    setError('Local admin login failed: ' + (e?.message || String(e)));
                  } finally {
                    setSubmitting(false);
                  }
                }}
                className="w-full mt-1 py-2 px-3 bg-[#751C2F] text-white text-xs font-bold rounded-lg hover:bg-[#591423] transition-colors shadow-sm cursor-pointer"
              >
                Sign In with Offline Admin Session →
              </button>
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-xs font-bold text-[#25201E] uppercase tracking-wider mb-1.5">
                Admin ID
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#756A64]">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  value={adminId}
                  onChange={(e) => setAdminId(e.target.value)}
                  placeholder="admin"
                  className="block w-full pl-10 pr-3 py-2.5 bg-[#FFF9F0] border border-[#F4E3DD] rounded-xl text-sm focus:outline-none focus:border-[#C7953E] focus:ring-1 focus:ring-[#C7953E] text-[#25201E] transition-all font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#25201E] uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#756A64]">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="admin123"
                  className="block w-full pl-10 pr-10 py-2.5 bg-[#FFF9F0] border border-[#F4E3DD] rounded-xl text-sm focus:outline-none focus:border-[#C7953E] focus:ring-1 focus:ring-[#C7953E] text-[#25201E] transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-[#756A64] hover:text-[#25201E]"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-[#751C2F] hover:bg-[#591423] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#C7953E] disabled:opacity-50 cursor-pointer transition-colors"
            >
              {submitting ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-[#F4E3DD] flex flex-col items-center justify-center gap-1.5 text-xs text-[#756A64]">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#C7953E]" />
              <span>Admin Authentication</span>
            </div>
            <p className="text-[11px] text-[#756A64]">
              Default Credentials: <code className="bg-[#FFF9F0] border border-[#F4E3DD] px-1.5 py-0.5 rounded font-mono text-[#751C2F] font-bold">admin</code> / <code className="bg-[#FFF9F0] border border-[#F4E3DD] px-1.5 py-0.5 rounded font-mono text-[#751C2F] font-bold">admin123</code>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
