import React, { useState } from 'react';
import { Link, Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { handleGoogleLogin, handleMicrosoftLogin, handleYahooLogin, createOAuthPopup } from '../utils/auth';

interface LoginPageProps {
  onBack: () => void;
  onLoginSuccess: (user: any) => void;
  onNavigateToSignUp: () => void;
  onNavigateToHome:() => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onLoginSuccess, onNavigateToSignUp, onNavigateToHome }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [socialLoginError, setSocialLoginError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate successful login
    const userData = {
      name: document.querySelector<HTMLInputElement>('#email')?.value || 'User',
      email: email,
      avatar: 'SU'
    };
    onLoginSuccess(userData);
  };

  const handleSocialLogin = async (provider: 'google' | 'microsoft' | 'yahoo') => {
    setIsLoading(provider);
    setSocialLoginError(null); // Clear any existing error messages
    
    // Create popup synchronously with user click
    const popup = createOAuthPopup(`${provider}-login`);
    if (!popup) {
      setIsLoading(null);
      setSocialLoginError('Please allow pop-ups for this site and try again. Check your browser\'s address bar for a pop-up blocker icon.');
      return;
    }
    
    try {
      let user;
      switch (provider) {
        case 'google':
          user = await handleGoogleLogin(popup);
          break;
        case 'microsoft':
          user = await handleMicrosoftLogin(popup);
          break;
        case 'yahoo':
          user = await handleYahooLogin(popup);
          break;
      }
      console.log(`${provider} login successful:`, user);
      // Navigate to dashboard on successful OAuth login
      const userData = {
        name: user?.name || 'Sodadasiswaroop User',
        email: user?.email || 'user@example.com',
        avatar: 'SU'
      };
      onLoginSuccess(userData);
    } catch (error) {
      console.error(`${provider} login failed:`, error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      if (errorMessage.includes('Popup blocked')) {
        setSocialLoginError('Please allow pop-ups for this site and try again. Check your browser\'s address bar for a pop-up blocker icon.');
      } else {
        setSocialLoginError(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login failed. Please try again.`);
      }
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo and Header */}
        <div className="text-center mb-8">
         <div onClick={onNavigateToHome} className="cursor-pointer mb-4">
          <div className="flex items-center justify-center mb-4">
            <img src="/alyasra-logo.png" alt="Alyasra Logo" className="w-12 h-12" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AIVA</h1>
          </div>
          <p className="text-slate-300">Welcome back! Please sign in to continue.</p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-2xl p-8 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Sign In</h2>
            <p className="text-gray-600">Enter your credentials to access your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Remember Me and Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                />
                <span className="ml-2 text-sm text-gray-600">Remember me</span>
              </label>
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
              >
                Forgot password?
              </button>
            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>

            {/* Sign Up Link */}
            <div className="text-center">
              <span className="text-gray-600">Don't have an account? </span>
              <button
                type="button"
                onClick={onNavigateToSignUp}
                className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
              >
                Sign up
              </button>
            </div>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with</span>
              </div>
            </div>

            {/* Social Login Error */}
            {socialLoginError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <span className="text-red-400 text-lg">⚠️</span>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{socialLoginError}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Social Login Buttons */}
            <div className="space-y-3">
              <button
                type="button"
                onClick={() => handleSocialLogin('google')}
                disabled={isLoading !== null}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isLoading === 'google' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="text-lg font-bold">G</span>
                    <span>Continue with Google</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => handleSocialLogin('microsoft')}
                disabled={isLoading !== null}
                className="w-full bg-blue-700 hover:bg-blue-800 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isLoading === 'microsoft' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="text-lg font-bold">⊞</span>
                    <span>Continue with Microsoft</span>
                  </>
                )}
              </button>
              
              <button
                type="button"
                onClick={() => handleSocialLogin('yahoo')}
                disabled={isLoading !== null}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:transform-none flex items-center justify-center space-x-2"
              >
                {isLoading === 'yahoo' ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span className="text-lg font-bold">Y!</span>
                    <span>Continue with Yahoo</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Terms and Privacy */}
        <div className="text-center mt-6">
          <p className="text-sm text-slate-400">
            By signing in, you agree to our{' '}
            <button className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
              Terms of Service
            </button>{' '}
            and{' '}
            <button className="text-blue-400 hover:text-blue-300 transition-colors duration-200">
              Privacy Policy
            </button>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <button
            onClick={onBack}
            className="text-slate-400 hover:text-slate-300 transition-colors duration-200 text-sm"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;