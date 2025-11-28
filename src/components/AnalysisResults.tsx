import { Palette, User, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { AnalysisResult } from "@/pages/Index";

interface AnalysisResultsProps {
  result: AnalysisResult;
  onReset: () => void;
}

const AnalysisResults = ({ result, onReset }: AnalysisResultsProps) => {
  return (
    <div className="min-h-screen px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <Button
          onClick={onReset}
          variant="ghost"
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Analyze Another Photo
        </Button>

        <div className="text-center mb-12 animate-fade-in">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Your Personalized Style Profile
          </h2>
          <p className="text-muted-foreground text-lg">
            Based on AI analysis of your unique features
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card className="p-8 shadow-soft animate-slide-up">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-primary/10">
                <Palette className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Color Analysis</h3>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Your Season</p>
                <p className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  {result.colorAnalysis.season}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-foreground leading-relaxed">
                  {result.colorAnalysis.description}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-3">Your Color Palette</p>
                <div className="flex flex-wrap gap-2">
                  {result.colorAnalysis.palette.map((color, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 rounded-lg shadow-md border-2 border-white"
                      style={{ backgroundColor: color }}
                      title={color}
                    />
                  ))}
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Recommendations</p>
                <ul className="space-y-2">
                  {result.colorAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-foreground">
                      <span className="text-primary mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>

          <Card className="p-8 shadow-soft animate-slide-up" style={{ animationDelay: "0.1s" }}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 rounded-lg bg-accent/10">
                <User className="w-6 h-6 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground">Body Shape Analysis</h3>
            </div>

            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Your Body Shape</p>
                <p className="text-3xl font-bold bg-gradient-hero bg-clip-text text-transparent">
                  {result.bodyShapeAnalysis.shape}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">Description</p>
                <p className="text-foreground leading-relaxed">
                  {result.bodyShapeAnalysis.description}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground mb-2">
                  Styling Recommendations
                </p>
                <ul className="space-y-2">
                  {result.bodyShapeAnalysis.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-foreground">
                      <span className="text-accent mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AnalysisResults;
