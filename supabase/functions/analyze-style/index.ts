import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: { Authorization: authHeader },
      },
    });

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      throw new Error('Unauthorized');
    }

    const { image } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Starting AI analysis...");

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: `You are an expert fashion stylist and color analyst. Analyze the person's photo and provide:
1. Color Analysis: Determine their seasonal color type (Spring, Summer, Autumn, Winter) based on skin tone, hair color, and eye color.
2. Body Shape Analysis: Identify their body shape (Hourglass, Pear, Apple, Rectangle, Inverted Triangle) based on visible proportions.

Respond ONLY with valid JSON in this exact format:
{
  "colorAnalysis": {
    "season": "Spring|Summer|Autumn|Winter",
    "description": "Brief description of their coloring and why this season suits them",
    "palette": ["#hexcode1", "#hexcode2", "#hexcode3", "#hexcode4", "#hexcode5"],
    "recommendations": ["recommendation 1", "recommendation 2", "recommendation 3"]
  },
  "bodyShapeAnalysis": {
    "shape": "Hourglass|Pear|Apple|Rectangle|Inverted Triangle",
    "description": "Brief description of their body proportions",
    "recommendations": ["styling tip 1", "styling tip 2", "styling tip 3", "styling tip 4"]
  }
}`,
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Please analyze this photo for color season and body shape.",
              },
              {
                type: "image_url",
                image_url: {
                  url: image,
                },
              },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI Gateway error:", response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response received");

    const content = data.choices?.[0]?.message?.content;
    if (!content) {
      throw new Error("No content in AI response");
    }

    // Parse the JSON response
    let analysisResult;
    try {
      // Try to extract JSON from the response (in case there's extra text)
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        analysisResult = JSON.parse(content);
      }
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      throw new Error("Failed to parse analysis results");
    }

    console.log("Analysis complete");

    // Save analysis results to user profile
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        body_shape: analysisResult.bodyShapeAnalysis.shape,
        skin_tone: analysisResult.colorAnalysis.season,
        color_season: analysisResult.colorAnalysis.season,
      })
      .eq('user_id', user.id);

    if (updateError) {
      console.error('Error updating profile:', updateError);
    }

    return new Response(JSON.stringify(analysisResult), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in analyze-style function:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Unknown error occurred",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
