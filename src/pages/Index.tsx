import { useState } from "react";
import Hero from "@/components/Hero";
import AnalysisUpload from "@/components/AnalysisUpload";
import AnalysisResults from "@/components/AnalysisResults";

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
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalysisComplete = (result: AnalysisResult) => {
    setAnalysisResult(result);
    setIsAnalyzing(false);
  };

  const handleReset = () => {
    setAnalysisResult(null);
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
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
