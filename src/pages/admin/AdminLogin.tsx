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
  const [password, setPassword] = useState('');
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
      await login(adminId.trim(), password);
      navigate(from, { replace: true });
    } catch (err: any) {
      console.error("Admin login error:", err);
      const code = err?.code || '';
      const msg = err?.message || '';

      if (msg.includes('are-blocked') || msg.includes('identitytoolkit') || code === 'auth/api-key-not-valid' || code === 'auth/invalid-api-key') {
        setError('Firebase Authentication is currently blocked by the project API configuration.');
      } else if (code === 'auth/operation-not-allowed' || code === 'auth/password-login-disabled' || msg.includes('PASSWORD_LOGIN_DISABLED') || msg.includes('OPERATION_NOT_ALLOWED')) {
        setError('Email/Password sign-in is disabled in Firebase Authentication. Please enable Email/Password provider in Firebase Console → Authentication → Sign-in method.');
      } else if (code === 'custom/invalid-admin-id' || code === 'auth/invalid-credential' || code === 'auth/wrong-password' || code === 'auth/invalid-email') {
        setError('Invalid admin ID or password.');
      } else if (code === 'auth/user-not-found') {
        setError('Admin account has not been created in Firebase Authentication. Please create "admin@amaxcrafts.com" with password "admin123" in Firebase Console → Authentication → Users.');
      } else if (code === 'auth/user-disabled') {
        setError('This admin account has been disabled.');
      } else if (code === 'auth/network-request-failed') {
        setError('Unable to connect. Please check your internet connection.');
      } else if (code === 'auth/too-many-requests') {
        setError('Too many login attempts. Please try again later.');
      } else {
        setError(msg || 'Invalid admin ID or password.');
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

          <div className="mt-6 pt-6 border-t border-[#F4E3DD] flex items-center justify-center gap-2 text-xs text-[#756A64]">
            <ShieldCheck className="w-4 h-4 text-[#C7953E]" />
            <span>Secure Firebase Admin Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};
