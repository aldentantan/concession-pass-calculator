import { CheckCircle, Mail } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';

export default function SignUpSuccessPage() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <div className="max-w-2xl mx-auto px-8 py-16">
        {/* Header Section */}
        <div className="text-center mb-8">
          <h2 className="text-3xl text-slate-900 font-semibold mb-3">Concession Pass Calculator</h2>
        </div>

        <Card className="p-10 bg-white border-slate-200">
          <div className="flex flex-col items-center space-y-6">
            {/* Success Icon */}
            <div className="p-4 bg-green-100 rounded-full">
              <CheckCircle className="w-16 h-16 text-green-600" />
            </div>

            {/* Success Heading */}
            <h1 className="text-2xl font-semibold text-slate-900">Sign Up Successful!</h1>

            {/* Instructions */}
            <div className="text-center space-y-2">
              <p className="text-slate-700">We've sent a confirmation email to your email address.</p>
              <p className="text-slate-700">Please click the link in the email to verify your account before logging in.</p>
            </div>

            {/* Info Box */}
            <Card className="w-full p-4 bg-blue-50 border-blue-200">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <h3 className="font-semibold text-blue-900">Didn't receive the email?</h3>
                  <p className="text-sm text-blue-700">
                    Please check your spam or junk folder and wait up to 5 minutes for the email to be sent.
                  </p>
                </div>
              </div>
            </Card>

            {/* Back to Login Button */}
            <Button
              onClick={() => navigate('/')}
              className="w-full"
              size="lg"
            >
              Back to Login
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}