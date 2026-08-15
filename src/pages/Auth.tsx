import React, { useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { User, Lock, Mail, Phone, CheckCircle2 } from 'lucide-react';

export const Auth: React.FC = () => {
  const { pathname } = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);

  const isRegister = pathname === '/register';
  const isForgotPassword = pathname === '/forgot-password';
  const isAccount = pathname === '/account';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoggedIn(true);
  };

  if (isAccount || loggedIn) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-[#F4E3DD] text-center space-y-4 shadow-sm">
          <div className="w-16 h-16 bg-[#F4E3DD] text-[#751C2F] rounded-full flex items-center justify-center mx-auto">
            <User className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#751C2F]">
            Customer Profile & Account
          </h1>
          <p className="text-xs text-[#756A64]">
            Signed in as <strong className="text-[#25201E]">{email || 'customer@amaxcraft.com'}</strong>
          </p>

          <div className="pt-4 flex justify-center gap-3">
            <Link to="/orders" className="px-5 py-2 bg-[#751C2F] text-white text-xs font-bold rounded-lg">
              My Orders
            </Link>
            <button onClick={() => setLoggedIn(false)} className="px-5 py-2 bg-gray-100 text-[#25201E] text-xs font-bold rounded-lg hover:bg-gray-200">
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-6">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold text-[#C7953E] uppercase tracking-wider block">
          Amax Craft Member Access
        </span>
        <h1 className="font-serif text-2xl font-bold text-[#751C2F]">
          {isRegister ? 'Create Account' : isForgotPassword ? 'Recover Password' : 'Sign In'}
        </h1>
      </div>

      <div className="bg-white p-6 rounded-2xl border border-[#F4E3DD] shadow-sm space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {isRegister && (
            <div>
              <label className="font-bold text-[#25201E] block mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Kumar"
                className="w-full bg-[#FFF9F0] border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E]"
              />
            </div>
          )}

          <div>
            <label className="font-bold text-[#25201E] block mb-1">Email Address</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="customer@example.com"
              className="w-full bg-[#FFF9F0] border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E]"
            />
          </div>

          {!isForgotPassword && (
            <div>
              <label className="font-bold text-[#25201E] block mb-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-[#FFF9F0] border border-[#F4E3DD] rounded-lg p-2.5 outline-none focus:border-[#C7953E]"
              />
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 bg-[#751C2F] text-white font-bold rounded-xl hover:bg-[#591423]"
          >
            {isRegister ? 'Register' : isForgotPassword ? 'Send Reset Link' : 'Sign In'}
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-[#756A64] space-x-2">
          {isRegister ? (
            <Link to="/login" className="text-[#751C2F] font-bold hover:underline">
              Already have an account? Sign In
            </Link>
          ) : (
            <>
              <Link to="/register" className="text-[#751C2F] font-bold hover:underline">
                Register New Account
              </Link>
              <span>•</span>
              <Link to="/forgot-password" className="text-[#C7953E] font-semibold hover:underline">
                Forgot Password?
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
