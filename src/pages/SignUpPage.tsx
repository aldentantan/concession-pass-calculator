import { Eye, EyeOff, Lock, Mail } from 'lucide-react';
import { useState } from "react";
import { Link } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabase';

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [signupLoading, setSignupLoading] = useState(false);

  const { session, loading } = useAuth();
  const navigate = useNavigate();

  const handleSignUp = async (): Promise<void> => {
    setSignupLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: password,
      options: {
        emailRedirectTo: window.location.origin,
      }
    })
    if (error) {
      alert(error.message);
    } else {
      navigate('/signup-success');
    }
    setSignupLoading(false);
  };

  // Show verification state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="p-8 text-center max-w-md">
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Authentication</h1>
          <p className="text-slate-600 mb-2">Confirming your sign up...</p>
          <div className="flex justify-center mt-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
          </div>
        </Card>
      </div>
    );
  }

  // If user is logged in, return to log in page
  if (session) {
    navigate('/');
  }

  return (
    <div className="w-full">
      <div className="max-w-lg mx-auto px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl text-slate-900 font-semibold mb-3">Concession Pass Calculator</h2>
        </div>

        <Card className="p-8 bg-white border-slate-200">
          <div className="space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  placeholder="johndoe@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value.toLowerCase())}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-shadow"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="********"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && email && password && confirmPassword) {
                      handleSignUp();
                    }
                  }}
                  onCut={(e) => { e.preventDefault() }}
                  onCopy={(e) => { e.preventDefault() }}
                  onPaste={(e) => { e.preventDefault() }}
                  className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="********"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && email && password && confirmPassword) {
                      handleSignUp();
                    }
                  }}
                  onCut={(e) => { e.preventDefault() }}
                  onCopy={(e) => { e.preventDefault() }}
                  onPaste={(e) => { e.preventDefault() }}
                  className="w-full pl-10 pr-12 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-shadow"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                  ) : (
                    <Eye className="w-5 h-5 text-slate-400 hover:text-slate-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Password Match Validation */}
            {confirmPassword !== "" && password !== confirmPassword && (
              <p className="text-sm text-red-600">
                Passwords do not match.
              </p>
            )}

            {/* Sign Up Button */}
            <Button
              onClick={handleSignUp}
              disabled={!email || !password || !confirmPassword || (password !== confirmPassword) || signupLoading}
              className="w-full"
              size="lg"
            >
              {signupLoading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Signing Up...</span>
                </div>
              ) : (
                'Sign Up'
              )}
            </Button>
          </div>
        </Card>

        {/* Sign In Link */}
        <p className="text-center mt-6 text-slate-600">
          Already have an account?{' '}
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}