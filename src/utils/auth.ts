// OAuth configuration and utilities
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your-google-client-id';
export const MICROSOFT_CLIENT_ID = import.meta.env.VITE_MICROSOFT_CLIENT_ID || 'your-microsoft-client-id';
export const YAHOO_CLIENT_ID = import.meta.env.VITE_YAHOO_CLIENT_ID || 'your-yahoo-client-id';

// Google OAuth configuration
export const googleAuthConfig = {
  client_id: GOOGLE_CLIENT_ID,
  redirect_uri: `${window.location.origin}/auth/google/callback`,
  scope: 'openid email profile',
  response_type: 'code',
  access_type: 'offline',
  prompt: 'consent'
};

// Microsoft OAuth configuration
export const microsoftAuthConfig = {
  client_id: MICROSOFT_CLIENT_ID,
  redirect_uri: `${window.location.origin}/auth/microsoft/callback`,
  scope: 'openid email profile',
  response_type: 'code',
  response_mode: 'query'
};

// Generate Google OAuth URL
export const getGoogleAuthUrl = (): string => {
  const baseUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
  const params = new URLSearchParams({
    client_id: googleAuthConfig.client_id,
    redirect_uri: googleAuthConfig.redirect_uri,
    scope: googleAuthConfig.scope,
    response_type: googleAuthConfig.response_type,
    access_type: googleAuthConfig.access_type,
    prompt: googleAuthConfig.prompt
  });
  
  return `${baseUrl}?${params.toString()}`;
};

// Generate Microsoft OAuth URL
export const getMicrosoftAuthUrl = (): string => {
  const baseUrl = 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize';
  const params = new URLSearchParams({
    client_id: microsoftAuthConfig.client_id,
    redirect_uri: microsoftAuthConfig.redirect_uri,
    scope: microsoftAuthConfig.scope,
    response_type: microsoftAuthConfig.response_type,
    response_mode: microsoftAuthConfig.response_mode
  });
  
  return `${baseUrl}?${params.toString()}`;
};

// Generate Yahoo OAuth URL
export const getYahooAuthUrl = (): string => {
  const baseUrl = 'https://api.login.yahoo.com/oauth2/request_auth';
  const params = new URLSearchParams({
    client_id: YAHOO_CLIENT_ID,
    redirect_uri: `${window.location.origin}/auth/yahoo/callback`,
    response_type: 'code',
    scope: 'openid email profile'
  });
  
  return `${baseUrl}?${params.toString()}`;
};

// Create OAuth popup window synchronously
export const createOAuthPopup = (name: string): Window | null => {
  return window.open(
    'about:blank',
    name,
    'width=500,height=600,scrollbars=yes,resizable=yes'
  );
};

// Handle OAuth popup messages
export const handleOAuthPopupMessages = (popup: Window, url: string): Promise<any> => {
  return new Promise((resolve, reject) => {
    if (!popup) {
      reject(new Error('Popup blocked'));
      return;
    }

    // Navigate to the OAuth URL
    popup.location.href = url;

    // Check if popup is closed
    const checkClosed = setInterval(() => {
      if (popup.closed) {
        clearInterval(checkClosed);
        reject(new Error('Authentication cancelled'));
      }
    }, 1000);

    // Listen for messages from popup
    const messageListener = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      
      if (event.data.type === 'OAUTH_SUCCESS') {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        popup.close();
        resolve(event.data.user);
      } else if (event.data.type === 'OAUTH_ERROR') {
        clearInterval(checkClosed);
        window.removeEventListener('message', messageListener);
        popup.close();
        reject(new Error(event.data.error));
      }
    };

    window.addEventListener('message', messageListener);
  });
};

// Handle Google login
export const handleGoogleLogin = async (popup?: Window): Promise<any> => {
  try {
    const authUrl = getGoogleAuthUrl();
    const popupWindow = popup || createOAuthPopup('google-login');
    if (!popupWindow) {
      throw new Error('Popup blocked');
    }
    const user = await handleOAuthPopupMessages(popupWindow, authUrl);
    return user;
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
};

// Handle Microsoft login
export const handleMicrosoftLogin = async (popup?: Window): Promise<any> => {
  try {
    const authUrl = getMicrosoftAuthUrl();
    const popupWindow = popup || createOAuthPopup('microsoft-login');
    if (!popupWindow) {
      throw new Error('Popup blocked');
    }
    const user = await handleOAuthPopupMessages(popupWindow, authUrl);
    return user;
  } catch (error) {
    console.error('Microsoft login error:', error);
    throw error;
  }
};

// Yahoo OAuth (using OpenID Connect)
export const handleYahooLogin = async (popup?: Window): Promise<any> => {
  try {
    const authUrl = getYahooAuthUrl();
    const popupWindow = popup || createOAuthPopup('yahoo-login');
    if (!popupWindow) {
      throw new Error('Popup blocked');
    }
    const user = await handleOAuthPopupMessages(popupWindow, authUrl);
    return user;
  } catch (error) {
    console.error('Yahoo login error:', error);
    throw error;
  }
};