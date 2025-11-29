import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Hero from "@/components/Hero";
import AnalysisUpload from "@/components/AnalysisUpload";
import AnalysisResults from "@/components/AnalysisResults";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

export interface AnalysisResult {
  colorAnalysis: {
    season: string;
    description: string;
    palette: string[];
    recommendations: string[];
  };
  bodyShapeAnalysis: {
    shape: string;
    description: string;
    recommendations: string[];
  };
}

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    // Check authentication status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate("/auth");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (!user) {
    return null; // Will redirect to auth page
  }

  return (
    <div className="min-h-screen bg-gradient-subtle">
      <div className="absolute top-4 right-4 z-10">
        <Button variant="outline" onClick={handleSignOut}>
          Sign Out
        </Button>
      </div>
      {!analysisResult ? (
        <>
          <Hero />
          <AnalysisUpload
            onAnalysisComplete={handleAnalysisComplete}
            isAnalyzing={isAnalyzing}
            setIsAnalyzing={setIsAnalyzing}
          />
        </>
      ) : (
        <AnalysisResults result={analysisResult} onReset={handleReset} />
      )}
    </div>
  );
};

export default Index;
