# OAuth Setup Guide for ALYASRA

This guide will help you register your application with various OAuth providers and configure the authentication system.

## 🔧 Configuration Steps

### 1. Update OAuth Configuration

Open `src/components/OAuthLogin.tsx` and replace the placeholder client IDs:

```javascript
const oauthConfigs = {
  google: {
    clientId: 'YOUR_ACTUAL_GOOGLE_CLIENT_ID',
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'openid email profile',
    authUrl: 'https://accounts.google.com/o/oauth2/v2/auth'
  },
  microsoft: {
    clientId: 'YOUR_ACTUAL_MICROSOFT_CLIENT_ID',
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'openid email profile User.Read',
    authUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize'
  },
  outlook: {
    clientId: 'YOUR_ACTUAL_OUTLOOK_CLIENT_ID', // Same as Microsoft
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'openid email profile',
    authUrl: 'https://login.live.com/oauth20_authorize.srf'
  },
  yahoo: {
    clientId: 'YOUR_ACTUAL_YAHOO_CLIENT_ID',
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'openid email profile',
    authUrl: 'https://api.login.yahoo.com/oauth2/request_auth'
  },
  github: {
    clientId: 'YOUR_ACTUAL_GITHUB_CLIENT_ID',
    redirectUri: `${window.location.origin}/auth/callback`,
    scope: 'user:email',
    authUrl: 'https://github.com/login/oauth/authorize'
  }
};
```

---

## 📋 Provider Registration Instructions

### 🔵 1. Google OAuth Setup

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select existing one
3. **Enable Google+ API**:
   - Navigate to "APIs & Services" > "Library"
   - Search for "Google+ API" and enable it
4. **Create OAuth 2.0 credentials**:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth 2.0 Client IDs"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:5173/auth/callback` (for development)
     - `https://yourdomain.com/auth/callback` (for production)
5. **Copy the Client ID** and paste it in your configuration

**Required Scopes**: `openid email profile`

---

### 🔷 2. Microsoft/Azure OAuth Setup

1. **Go to Azure Portal**: https://portal.azure.com/
2. **Navigate to Azure Active Directory** > "App registrations"
3. **Register a new application**:
   - Name: "ALYASRA App"
   - Supported account types: "Accounts in any organizational directory and personal Microsoft accounts"
   - Redirect URI: `http://localhost:5173/auth/callback`
4. **Configure API permissions**:
   - Add "Microsoft Graph" permissions
   - Add `User.Read`, `openid`, `email`, `profile`
5. **Copy Application (client) ID** from the Overview page

**Required Scopes**: `openid email profile User.Read`

---

### 🔶 3. Outlook/Hotmail OAuth Setup

1. **Go to Microsoft Application Registration Portal**: https://apps.dev.microsoft.com/
2. **Register your application**:
   - Application Name: "ALYASRA"
   - Contact Email: your email
3. **Add Platform** > "Web"
   - Redirect URLs: `http://localhost:5173/auth/callback`
4. **Generate Application Secret** (optional for frontend-only)
5. **Copy Application ID**

**Required Scopes**: `openid email profile`

---

### 🟣 4. Yahoo OAuth Setup

1. **Go to Yahoo Developer Network**: https://developer.yahoo.com/apps/
2. **Create a new app**:
   - Application Name: "ALYASRA"
   - Application Type: "Web Application"
   - Home Page URL: `http://localhost:5173`
   - Callback Domain: `localhost:5173`
3. **Enable required APIs**:
   - Yahoo Identity API
4. **Copy Client ID** from app details

**Required Scopes**: `openid email profile`

---

### ⚫ 5. GitHub OAuth Setup

1. **Go to GitHub Settings**: https://github.com/settings/developers
2. **OAuth Apps** > "New OAuth App"
3. **Fill application details**:
   - Application name: "ALYASRA"
   - Homepage URL: `http://localhost:5173`
   - Authorization callback URL: `http://localhost:5173/auth/callback`
4. **Register application**
5. **Copy Client ID** from the app page

**Required Scopes**: `user:email`

---

## 🚀 Development Setup

### Running Locally

1. Update the redirect URIs in your OAuth configurations to include:
   ```
   http://localhost:5173/auth/callback
   ```

2. Start your development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

3. Test OAuth login by clicking the provider buttons

---

## 🌐 Production Deployment

### Before deploying to production:

1. **Update all OAuth app configurations** with your production domain:
   ```
   https://yourdomain.com/auth/callback
   ```

2. **Update the redirect URI in OAuthLogin.tsx**:
   ```javascript
   redirectUri: `${window.location.origin}/auth/callback`
   ```

3. **Add your production domain** to all OAuth provider settings

---

## 🔒 Security Considerations

### Important Security Notes:

1. **Client IDs are public** - they can be visible in your frontend code
2. **Never expose client secrets** in frontend code
3. **Use HTTPS in production** - required by most OAuth providers
4. **Validate state parameter** - prevents CSRF attacks (already implemented)
5. **Store sensitive data securely** - use proper backend for tokens

### Current Implementation:

- ✅ State parameter validation
- ✅ CSRF protection
- ✅ Secure redirect URI validation
- ⚠️ Frontend-only (limited functionality)

---

## 🔧 Backend Integration (Recommended)

For production applications, consider implementing a backend that:

1. **Exchanges authorization codes for tokens**
2. **Stores refresh tokens securely**
3. **Validates tokens server-side**
4. **Manages user sessions**

Current implementation is frontend-only for simplicity but has limitations.

---

## 📝 Testing Checklist

Before going live, test:

- [ ] All OAuth providers redirect correctly
- [ ] User data is extracted properly
- [ ] Login/logout flow works
- [ ] State validation prevents CSRF
- [ ] Redirect URIs match OAuth app settings
- [ ] Error handling works for failed authentications

---

## 🎯 Next Steps

1. Register with all desired OAuth providers
2. Update client IDs in the configuration
3. Test each provider thoroughly
4. Consider backend implementation for production
5. Add proper error handling and user feedback

---

## 📧 Support

If you encounter issues:

1. Check browser console for errors
2. Verify OAuth app settings match your configuration
3. Ensure redirect URIs are exactly matching
4. Test with different browsers
5. Check provider-specific documentation

---

**Note**: This implementation provides a foundation for OAuth integration. For production use, consider implementing proper backend authentication services.
