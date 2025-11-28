import { Sparkles } from "lucide-react";

const Hero = () => {
  return (
    <section className="relative overflow-hidden py-20 px-4 sm:px-6 lg:px-8">
      <div className="absolute inset-0 bg-gradient-hero opacity-5" />
      
      <div className="relative max-w-4xl mx-auto text-center animate-fade-in">
        <div className="inline-flex items-center justify-center p-2 bg-primary/10 rounded-full mb-6">
          <Sparkles className="w-6 h-6 text-primary mr-2" />
          <span className="text-sm font-medium text-primary">AI-Powered Analysis</span>
        </div>
        
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
          Discover Your
          <span className="block bg-gradient-hero bg-clip-text text-transparent">
            Perfect Style
          </span>
        </h1>
        
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
          Upload your photo and let our AI analyze your unique color palette and body shape.
          Get personalized styling recommendations in seconds.
        </p>
      </div>
    </section>
  );
};

export default Hero;
