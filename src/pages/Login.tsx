import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserCircle, Mail, Lock } from "lucide-react";
import { useUser } from "@/contexts/UserContext";
import OAuthLogin from "@/components/OAuthLogin";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Check if user exists in local storage
    const existingAccounts = JSON.parse(localStorage.getItem('aiva_accounts') || '[]');
    const existingUser = existingAccounts.find((account: any) => account.email === email);
    
    // Simulate login process
    setTimeout(() => {
      if (existingUser) {
        // Use existing user data
        login(existingUser);
      } else {
        // Create new user (fallback for existing behavior)
        const username = email.split('@')[0] || `user_${generateRandomId()}`;
        const userData = {
          id: generateRandomId(),
          email: email,
          username: username,
          firstName: username.charAt(0).toUpperCase() + username.slice(1),
          lastName: "User",
        };
        login(userData);
      }
      setIsLoading(false);
      navigate("/chat");
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-blue flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4 cursor-pointer transition-transform duration-300 hover:scale-110" onClick={() => navigate("/")}>
            <img 
              src="/lovable-uploads/1000088648-removebg-preview.png" 
              alt="AIVA Logo" 
              className="w-12 h-12 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling!.classList.remove('hidden');
              }}
            />
            <UserCircle className="w-8 h-8 text-white hidden" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-2 cursor-pointer" onClick={() => navigate("/")}>AIVA</h1>
          <p className="text-white/80">Welcome back! Please sign in to continue.</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">Sign In</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Enter your credentials to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 pl-10 transition-smooth focus:ring-primary"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="h-11 pl-10 pr-10 transition-smooth focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-input bg-background ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  />
                  <span className="text-muted-foreground">Remember me</span>
                </label>
                <button
                  type="button"
                  className="text-primary hover:text-primary-glow transition-colors font-medium"
                >
                  Forgot password?
                </button>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !email || !password}
                className="w-full h-11 bg-gradient-primary hover:opacity-90 transition-smooth text-white font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Signing in...</span>
                  </div>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <button 
                  onClick={() => navigate("/signup")}
                  className="text-primary hover:text-primary-glow transition-colors font-medium"
                >
                  Sign up
                </button>
              </p>
            </div>

            {/* OAuth Login Section */}
            <OAuthLogin />
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-white/60">
            By signing in, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;