import React from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { UserCircle, ArrowRight, Shield, Zap, Users } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-blue">
      {/* Header with Logo */}
      <header className="flex items-center justify-between p-6">
        <div className="flex items-center space-x-3">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-white/10 rounded-full">
            <img 
              src="/lovable-uploads/1bf84a47-9c08-48e8-b0d1-d11e67d43217.png" 
              alt="AIVA Logo" 
              className="w-10 h-10 object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling!.classList.remove('hidden');
              }}
            />
            <UserCircle className="w-6 h-6 text-white hidden" />
          </div>
          <h1 className="text-2xl font-bold text-white">AIVA</h1>
        </div>
        
        <Button
          onClick={() => navigate("/login")}
          variant="outline"
          className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-smooth"
        >
          Login
        </Button>
      </header>

      {/* Main Content */}
      <div className="flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-4xl text-center">
          {/* Hero Section */}
          <div className="mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Welcome to <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">AIVA</span>
            </h2>
            <p className="text-xl text-white/80 mb-4 max-w-2xl mx-auto">
              Empowering teams and transforming client relationships through intelligent automation and seamless collaboration.
            </p>
            <p className="text-lg text-white/70 mb-8 max-w-3xl mx-auto">
              AIVA connects workers and clients in a unified ecosystem, streamlining workflows, enhancing productivity, and delivering exceptional experiences for businesses of all sizes.
            </p>
            
            <Button
              onClick={() => navigate("/login")}
              className="bg-gradient-primary hover:opacity-90 transition-smooth text-white font-medium px-8 py-4 text-lg h-auto"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Secure</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Enterprise-grade security with end-to-end encryption to protect both worker communications and client data.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Lightning-fast performance enabling real-time collaboration between teams and instant client responses.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0">
              <CardHeader className="pb-4">
                <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-xl">Collaborative</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  Connect workers and clients seamlessly with advanced collaboration tools, shared workspaces, and unified communication.
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* CTA Section */}
          <div className="text-center">
            <p className="text-white/80 mb-6 text-lg">
              Ready to transform your workflow?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                onClick={() => navigate("/login")}
                className="bg-gradient-primary hover:opacity-90 transition-smooth text-white font-medium px-6 py-3"
              >
                Sign In
              </Button>
              <Button
                onClick={() => navigate("/signup")}
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20 transition-smooth px-6 py-3"
              >
                Create Account
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center py-8">
        <p className="text-xs text-white/60">
          © 2024 AIVA. All rights reserved. | Terms of Service | Privacy Policy
        </p>
      </footer>
    </div>
  );
};

export default Home;