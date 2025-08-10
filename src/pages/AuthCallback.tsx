import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';

const AuthCallback = () => {
  const navigate = useNavigate();
  const { login } = useUser();

  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  useEffect(() => {
    const handleAuthCallback = () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const code = urlParams.get('code');
        const state = urlParams.get('state'); // provider type
        const error = urlParams.get('error');

        if (error) {
          console.error('OAuth error:', error);
          navigate('/?error=auth_failed');
          return;
        }

        if (code && state) {
          // Mock user data extraction - in real app you'd exchange code for user info
          const mockUserData = {
            id: generateRandomId(),
            email: `user@${state}.com`,
            username: `${state}_user`,
            firstName: 'OAuth',
            lastName: 'User',
            avatar: `https://ui-avatars.com/api/?name=OAuth+User&background=random`
          };

          // Store user data in localStorage
          const existingAccounts = JSON.parse(localStorage.getItem('aiva_accounts') || '[]');
          const existingUser = existingAccounts.find((account: any) => account.email === mockUserData.email);
          
          if (!existingUser) {
            const updatedAccounts = [mockUserData, ...existingAccounts.slice(0, 4)];
            localStorage.setItem('aiva_accounts', JSON.stringify(updatedAccounts));
          }

          login(mockUserData);
          navigate('/chat');
        } else {
          navigate('/?error=no_code');
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error);
        navigate('/?error=unexpected');
      }
    };

    handleAuthCallback();
  }, [navigate, login]);

  return (
    <div className="min-h-screen bg-gradient-blue flex items-center justify-center p-4">
      <div className="text-center text-white">
        <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p>Completing authentication...</p>
      </div>
    </div>
  );
};

export default AuthCallback;