import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Users, Target, Award, Globe } from "lucide-react";

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-blue p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8">
          <Button
            onClick={() => navigate("/chat")}
            variant="outline"
            size="icon"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-4xl font-bold text-white">About AIVA</h1>
        </div>

        <div className="grid gap-6">
          <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Target className="h-6 w-6 text-primary" />
                Our Mission
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-muted-foreground">
                AIVA empowers organizations by creating seamless connections between workers and clients through intelligent automation, 
                real-time collaboration, and data-driven insights. We believe in transforming how teams work and how businesses serve their clients.
              </p>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  For Workers
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Streamlined workflow management</li>
                  <li>• Real-time team collaboration</li>
                  <li>• Advanced project tracking</li>
                  <li>• Automated task distribution</li>
                  <li>• Performance analytics</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0">
              <CardHeader>
                <CardTitle className="text-xl flex items-center gap-3">
                  <Globe className="h-5 w-5 text-primary" />
                  For Clients
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• 24/7 support availability</li>
                  <li>• Transparent project visibility</li>
                  <li>• Instant communication channels</li>
                  <li>• Real-time progress updates</li>
                  <li>• Comprehensive reporting</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-white/95 backdrop-blur-sm shadow-elegant border-0">
            <CardHeader>
              <CardTitle className="text-2xl flex items-center gap-3">
                <Award className="h-6 w-6 text-primary" />
                Why Choose AIVA?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <h3 className="font-semibold mb-2">Enterprise Security</h3>
                  <p className="text-sm text-muted-foreground">
                    Bank-level encryption and compliance with industry standards ensure your data and communications remain secure.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Scalable Solutions</h3>
                  <p className="text-sm text-muted-foreground">
                    From small teams to enterprise organizations, AIVA scales with your business needs and growth.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">AI-Powered Insights</h3>
                  <p className="text-sm text-muted-foreground">
                    Leverage artificial intelligence to gain actionable insights and automate routine tasks.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-primary text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ready to Transform Your Workflow?</h2>
              <p className="mb-6 text-white/90">
                Join thousands of teams who have already revolutionized their work processes with AIVA.
              </p>
              <Button
                onClick={() => navigate("/chat")}
                variant="outline"
                className="bg-white/10 text-white border-white/20 hover:bg-white/20"
              >
                Get Started Today
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default About;