import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useUser } from '@/contexts/UserContext';
import { useNavigate } from 'react-router-dom';

const OAuthLogin = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [showAdditionalProviders, setShowAdditionalProviders] = useState(false);

  // OAuth Configuration - Replace with your actual client IDs
  const oauthConfigs = {
    google: {
      clientId: 'YOUR_GOOGLE_CLIENT_ID',
      redirectUri: `${window.location.origin}/auth/callback`,
      scope: 'openid email profile',
      authUrl: 'https://accounts.google.com/o/oauth2/v2/auth'
    },
    microsoft: {
      clientId: 'YOUR_MICROSOFT_CLIENT_ID',
      redirectUri: `${window.location.origin}/auth/callback`,
      scope: 'openid email profile User.Read',
      authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
    },
    outlook: {
      clientId: 'YOUR_OUTLOOK_CLIENT_ID', // Same as Microsoft
      redirectUri: `${window.location.origin}/auth/callback`,
      scope: 'openid email profile',
      authUrl: 'https://login.live.com/oauth20_authorize.srf'
    },
    yahoo: {
      clientId: 'YOUR_YAHOO_CLIENT_ID',
      redirectUri: `${window.location.origin}/auth/callback`,
      scope: 'openid email profile',
      authUrl: 'https://api.login.yahoo.com/oauth2/request_auth'
    },
    hotmail: {
      clientId: 'YOUR_HOTMAIL_CLIENT_ID',
      redirectUri: `${window.location.origin}/auth/callback`,
      scope: 'openid email profile',
      authUrl: 'https://login.live.com/oauth20_authorize.srf'
    }
  };

  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const buildAuthUrl = (provider: keyof typeof oauthConfigs) => {
    const config = oauthConfigs[provider];
    const state = btoa(JSON.stringify({ provider, timestamp: Date.now() }));
    
    const params = new URLSearchParams({
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scope,
      response_type: 'code',
      state: state,
      ...(provider === 'microsoft' && { response_mode: 'query' }),
      ...(provider === 'google' && { access_type: 'offline', prompt: 'consent' })
    });

    return `${config.authUrl}?${params.toString()}`;
  };

  const handleOAuthLogin = (provider: keyof typeof oauthConfigs) => {
    // Store the current timestamp to validate the response later
    localStorage.setItem('oauth_state', JSON.stringify({ 
      provider, 
      timestamp: Date.now(),
      returnUrl: '/chat' 
    }));

    // Redirect to OAuth provider
    window.location.href = buildAuthUrl(provider);
  };

  // Check if we're returning from an OAuth callback
  React.useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    const state = urlParams.get('state');
    const error = urlParams.get('error');

    if (error) {
      console.error('OAuth Error:', error);
      alert('Authentication failed. Please try again.');
      return;
    }

    if (code && state) {
      handleOAuthCallback(code, state);
    }
  }, []);

  const handleOAuthCallback = async (code: string, state: string) => {
    try {
      const stateData = JSON.parse(atob(state));
      const storedState = JSON.parse(localStorage.getItem('oauth_state') || '{}');
      
      // Validate state to prevent CSRF attacks
      if (stateData.provider !== storedState.provider) {
        throw new Error('Invalid state parameter');
      }

      // For demo purposes, we'll simulate the token exchange and user data retrieval
      // In a real application, you'd exchange the code for a token on your backend
      
      const userData = await mockTokenExchange(code, stateData.provider);
      
      // Store user in localStorage and login
      const existingAccounts = JSON.parse(localStorage.getItem('alyasra_accounts') || '[]');
      const existingUser = existingAccounts.find((account: any) => account.email === userData.email);
      
      if (existingUser) {
        login(existingUser);
      } else {
        const newUser = {
          ...userData,
          id: generateRandomId()
        };
        const updatedAccounts = [newUser, ...existingAccounts.slice(0, 4)];
        localStorage.setItem('alyasra_accounts', JSON.stringify(updatedAccounts));
        login(newUser);
      }

      // Clean up and redirect
      localStorage.removeItem('oauth_state');
      navigate('/chat');
      
    } catch (error) {
      console.error('OAuth callback error:', error);
      alert('Authentication failed. Please try again.');
    }
  };

  // Mock token exchange - replace with actual API calls to your backend
  const mockTokenExchange = async (code: string, provider: string) => {
    // This is a simulation - in real implementation, you'd call your backend
    // which would exchange the code for tokens and fetch user data
    
    return new Promise<any>((resolve) => {
      setTimeout(() => {
        // Mock user data based on provider
        const mockData = {
          google: {
            email: 'user@gmail.com',
            username: 'googleuser',
            firstName: 'John',
            lastName: 'Doe',
            avatar: 'https://lh3.googleusercontent.com/a/default-user'
          },
          microsoft: {
            email: 'user@outlook.com',
            username: 'msuser',
            firstName: 'Jane',
            lastName: 'Smith',
            avatar: 'https://graph.microsoft.com/v1.0/me/photo/$value'
          },
          outlook: {
            email: 'user@hotmail.com',
            username: 'outlookuser',
            firstName: 'Mike',
            lastName: 'Johnson',
            avatar: null
          },
          yahoo: {
            email: 'user@yahoo.com',
            username: 'yahoouser',
            firstName: 'Sarah',
            lastName: 'Wilson',
            avatar: null
          },
          hotmail: {
            email: 'user@hotmail.com',
            username: 'hotmailuser',
            firstName: 'Alice',
            lastName: 'Brown',
            avatar: null
          }
        };

        resolve(mockData[provider as keyof typeof mockData] || mockData.google);
      }, 1000);
    });
  };

  // Primary providers (Google and Microsoft)
  const primaryProviders = [
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
    }
  ];

  // Additional providers (shown after Microsoft login)
  const additionalProviders = [
    {
      name: 'Outlook',
      key: 'outlook' as const,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="currentColor" d="M7.88 12.04q0 .45-.11.87-.1.41-.33.74-.22.33-.58.52-.37.2-.87.2t-.85-.2q-.35-.21-.57-.55-.22-.33-.33-.75-.1-.42-.1-.83 0-.41.1-.81.1-.4.32-.73.22-.32.57-.51.35-.19.87-.19t.86.19q.35.19.58.51.22.33.32.73.11.4.11.81zM9.99 23.64H4.37q-.69 0-1.18-.49-.49-.49-.49-1.18V1.99q0-.69.49-1.18Q3.68.32 4.37.32h5.62q2.49 0 4.32 1.83 1.83 1.83 1.83 4.32v10.84q0 2.49-1.83 4.32-1.83 1.83-4.32 1.83zM7.13 18.96q1.67 0 2.8-1.15 1.13-1.15 1.13-2.82V6.47q0-1.67-1.13-2.82Q8.8 2.5 7.13 2.5H4.37v16.46h2.76z"/>
        </svg>
      ),
      description: 'Continue with Outlook'
    },
    {
      name: 'Yahoo',
      key: 'yahoo' as const,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="currentColor" d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm5.5 17.9h-2.3l-3.2-5.9-3.2 5.9H6.5l4.5-8.1L6.8 6.1h2.3l2.9 5.3 2.9-5.3h2.3L13 9.8l4.5 8.1z"/>
        </svg>
      ),
      description: 'Continue with Yahoo'
    },
    {
      name: 'Hotmail',
      key: 'hotmail' as const,
      icon: (
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="currentColor" d="M24 4.5v15a3 3 0 0 1-3 3H3a3 3 0 0 1-3-3v-15a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3zM12.541 12.752L5.031 5.242H1.459v13.516h3.094V8.944l6.572 6.572a.75.75 0 0 0 1.06 0l6.572-6.572v9.814h3.094V5.242h-3.572l-7.51 7.51z"/>
        </svg>
      ),
      description: 'Continue with Hotmail'
    }
  ];

  const handleMicrosoftLogin = () => {
    setShowAdditionalProviders(true);
  };

  return (
    <div className="mt-6">
      <div className="relative">
        <Separator className="my-4" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="bg-white px-4 text-sm text-muted-foreground">Or continue with</span>
        </div>
      </div>

      {/* Primary Providers */}
      <div className="mt-6 space-y-3">
        {primaryProviders.map((provider) => (
          <Button
            key={provider.key}
            onClick={() => {
              if (provider.key === 'microsoft') {
                handleMicrosoftLogin();
              } else {
                handleOAuthLogin(provider.key);
              }
            }}
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

      {/* Additional Providers Panel */}
      {showAdditionalProviders && (
        <Card className="mt-4 bg-muted/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-center">More Email Providers</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {additionalProviders.map((provider) => (
              <Button
                key={provider.key}
                onClick={() => handleOAuthLogin(provider.key)}
                variant="outline"
                className="w-full h-10 bg-white hover:bg-secondary transition-smooth"
              >
                <div className="flex items-center justify-center space-x-3">
                  {provider.icon}
                  <span className="font-medium text-sm">{provider.description}</span>
                </div>
              </Button>
            ))}
            <Button
              onClick={() => setShowAdditionalProviders(false)}
              variant="ghost"
              className="w-full h-8 text-xs text-muted-foreground hover:text-foreground"
            >
              Hide options
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default OAuthLogin;