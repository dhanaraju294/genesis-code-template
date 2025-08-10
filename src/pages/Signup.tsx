import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, UserCircle, User, Mail, Lock } from "lucide-react";
import { useUser } from "@/contexts/UserContext";

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useUser();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const generateRandomId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const generateUsername = (firstName: string, lastName: string) => {
    if (firstName && lastName) {
      return `${firstName.toLowerCase()}_${lastName.toLowerCase()}`;
    } else if (firstName) {
      return firstName.toLowerCase();
    } else {
      return `user_${generateRandomId()}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Basic validation
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords don't match!");
      setIsLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long!");
      setIsLoading(false);
      return;
    }

    // Check if user already exists in local storage
    const existingAccounts = JSON.parse(localStorage.getItem('aiva_accounts') || '[]');
    const existingUser = existingAccounts.find((account: any) => account.email === formData.email);
    
    if (existingUser) {
      alert("An account with this email already exists. Please sign in instead.");
      setIsLoading(false);
      return;
    }

    // Simulate signup process
    setTimeout(() => {
      const userData = {
        id: generateRandomId(),
        email: formData.email,
        username: generateUsername(formData.firstName, formData.lastName),
        firstName: formData.firstName || "Unknown",
        lastName: formData.lastName || "User",
      };

      // Store in local storage (max 5 accounts)
      const updatedAccounts = [userData, ...existingAccounts.slice(0, 4)];
      localStorage.setItem('aiva_accounts', JSON.stringify(updatedAccounts));

      login(userData);
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
          <p className="text-white/80">Create your account to get started.</p>
        </div>

        <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-semibold text-center">Sign Up</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Fill in your details to create an account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName" className="text-sm font-medium">
                    First Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      placeholder="John"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="h-11 pl-10 transition-smooth focus:ring-primary"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName" className="text-sm font-medium">
                    Last Name
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      placeholder="Doe"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="h-11 pl-10 transition-smooth focus:ring-primary"
                    />
                  </div>
                </div>
              </div>


              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email Address *
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="h-11 pl-10 transition-smooth focus:ring-primary"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleInputChange}
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

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium">
                  Confirm Password *
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="h-11 pl-10 pr-10 transition-smooth focus:ring-primary"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading || !formData.email || !formData.password}
                className="w-full h-11 bg-gradient-primary hover:opacity-90 transition-smooth text-white font-medium"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Creating account...</span>
                  </div>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <button 
                  onClick={() => navigate("/")}
                  className="text-primary hover:text-primary-glow transition-colors font-medium"
                >
                  Sign in
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-xs text-white/60">
            By creating an account, you agree to our Terms of Service and Privacy Policy
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;