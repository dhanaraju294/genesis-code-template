import React from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const OAuthLogin = () => {
  const handleOAuthLogin = (provider: 'google' | 'microsoft' | 'yahoo') => {
    const redirectUri = `${window.location.origin}/auth/callback`;
    let authUrl = '';

    switch (provider) {
      case 'google':
        authUrl = `https://accounts.google.com/oauth/authorize?client_id=YOUR_GOOGLE_CLIENT_ID&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20email&response_type=code&state=${provider}`;
        break;
      case 'microsoft':
        authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=YOUR_MICROSOFT_CLIENT_ID&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&scope=openid%20profile%20email&state=${provider}`;
        break;
      case 'yahoo':
        authUrl = `https://api.login.yahoo.com/oauth2/request_auth?client_id=YOUR_YAHOO_CLIENT_ID&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=openid%20profile%20email&state=${provider}`;
        break;
    }

    window.location.href = authUrl;
  };

  const providers = [
    {
      name: 'Google',
      key: 'google' as const,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
          <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
      ),
      description: 'Continue with Google'
    },
    {
      name: 'Microsoft',
      key: 'microsoft' as const,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="currentColor" d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"/>
        </svg>
      ),
      description: 'Continue with Microsoft'
    },
    {
      name: 'Yahoo',
      key: 'yahoo' as const,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="currentColor" d="M12.5 2c-.67 0-1.21.54-1.21 1.21v3.17L8.12 3.21A1.21 1.21 0 0 0 6.26 4.36l3.17 3.17H6.26a1.21 1.21 0 0 0 0 2.42h3.17l-3.17 3.17A1.21 1.21 0 0 0 8.12 14.37l3.17-3.17v3.17c0 .67.54 1.21 1.21 1.21s1.21-.54 1.21-1.21v-3.17l3.17 3.17a1.21 1.21 0 0 0 1.86-1.15l-3.17-3.17h3.17a1.21 1.21 0 0 0 0-2.42h-3.17l3.17-3.17A1.21 1.21 0 0 0 15.74 4.36l-3.17 3.17V3.21c0-.67-.54-1.21-1.21-1.21Z"/>
        </svg>
      ),
      description: 'Continue with Yahoo'
    }
  ];

  return (
    <div className="mt-6">
      <div className="relative">
        <Separator className="my-4" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white px-4 text-sm text-muted-foreground">Or continue with</span>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {providers.map((provider) => (
          <Button
            key={provider.key}
            onClick={() => handleOAuthLogin(provider.key)}
            variant="outline"
            className="w-full h-11 bg-primary text-primary-foreground border-0 hover:bg-primary-glow transition-smooth transform hover:scale-[1.02]"
          >
            <div className="flex items-center justify-center space-x-3">
              {provider.icon}
              <span className="font-medium">{provider.description}</span>
            </div>
          </Button>
        ))}
      </div>
    </div>
  );
};

export default OAuthLogin;