import { Mail } from 'lucide-react';
import { useState } from "react";
import { Link } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { supabase } from '../supabase';

export default function ForgetPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleForgetPassword = async (): Promise<void> => {
    setLoading(true)
    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    alert('If an account with that email exists in our database, a password reset link will be sent to your email in the next 5 minutes.');
    setLoading(false)
    navigate('/');
  };

  return (
    <div className="w-full">
      <div className="max-w-lg mx-auto px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl text-slate-900 font-semibold mb-3">Reset Your Password</h2>
          <p className="text-slate-600">Enter your email to receive a password reset link</p>
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
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && email) {
                      handleForgetPassword();
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-400 focus:border-transparent transition-shadow"
                />
              </div>
            </div>

            {/* Send Reset Link Button */}
            <Button
              onClick={handleForgetPassword}
              disabled={!email || loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Sending Reset Link...</span>
                </div>
              ) : (
                'Send Reset Link'
              )}
            </Button>
          </div>
        </Card>

        {/* Sign In Link */}
        <p className="text-center mt-6 text-slate-600">
          Remember your password?{' '}
          <Link to="/" className="text-blue-600 hover:text-blue-700 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}