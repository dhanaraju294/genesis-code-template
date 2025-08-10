import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">
            Your Blank Canvas
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Start building something amazing. This clean, modern foundation is ready for your ideas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="default" size="lg" className="shadow-elegant">
              Get Started
            </Button>
            <Button variant="outline" size="lg">
              Learn More
            </Button>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <div className="bg-card p-8 rounded-lg shadow-soft border border-border">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg mb-4"></div>
            <h3 className="text-xl font-semibold mb-3">Modern Design</h3>
            <p className="text-muted-foreground">
              Beautiful, responsive design system built with modern standards and best practices.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-lg shadow-soft border border-border">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg mb-4"></div>
            <h3 className="text-xl font-semibold mb-3">Developer Ready</h3>
            <p className="text-muted-foreground">
              TypeScript, React, and Tailwind CSS configured for optimal development experience.
            </p>
          </div>
          
          <div className="bg-card p-8 rounded-lg shadow-soft border border-border">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg mb-4"></div>
            <h3 className="text-xl font-semibold mb-3">Fully Customizable</h3>
            <p className="text-muted-foreground">
              Semantic design tokens and component variants make customization effortless.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;