import { useState, useRef } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { AnalysisResult } from "@/pages/Index";

interface AnalysisUploadProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (value: boolean) => void;
}

const AnalysisUpload = ({ onAnalysisComplete, isAnalyzing, setIsAnalyzing }: AnalysisUploadProps) => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }

      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyze = async () => {
    if (!selectedImage) {
      toast({
        title: "No image selected",
        description: "Please upload an image first",
        variant: "destructive",
      });
      return;
    }

    setIsAnalyzing(true);
    try {
      const authHeader = `Bearer ${(await supabase.auth.getSession()).data.session?.access_token}`;
      
      const { data, error } = await supabase.functions.invoke("analyze-style", {
        body: { image: selectedImage },
        headers: {
          Authorization: authHeader,
        },
      });

      if (error) throw error;

      onAnalysisComplete(data);
      toast({
        title: "Analysis complete!",
        description: "Your personalized style recommendations are ready",
      });
    } catch (error) {
      console.error("Analysis error:", error);
      toast({
        title: "Analysis failed",
        description: "Please try again with a different image",
        variant: "destructive",
      });
      setIsAnalyzing(false);
    }
  };

  return (
    <section className="px-4 sm:px-6 lg:px-8 pb-20">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-soft animate-slide-up">
          <div className="space-y-6">
            <div
              onClick={() => fileInputRef.current?.click()}
              className="relative border-2 border-dashed border-border rounded-lg p-12 text-center cursor-pointer transition-all hover:border-primary hover:bg-primary/5"
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageSelect}
                className="hidden"
              />

              {selectedImage ? (
                <div className="space-y-4">
                  <img
                    src={selectedImage}
                    alt="Selected"
                    className="max-h-64 mx-auto rounded-lg object-cover"
                  />
                  <p className="text-sm text-muted-foreground">
                    Click to change image
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10">
                    <Upload className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium text-foreground mb-1">
                      Upload your photo
                    </p>
                    <p className="text-sm text-muted-foreground">
                      For best results, use a well-lit photo showing your face and upper body
                    </p>
                  </div>
                </div>
              )}
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={!selectedImage || isAnalyzing}
              variant="hero"
              size="lg"
              className="w-full"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing...
                </>
              ) : (
                "Analyze My Style"
              )}
            </Button>
          </div>
        </Card>
      </div>
    </section>
  );
};

export default AnalysisUpload;
