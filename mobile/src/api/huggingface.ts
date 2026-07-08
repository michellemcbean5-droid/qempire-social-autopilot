/**
 * Hugging Face Inference API Integration
 * Free tier: 30 requests/minute, no API key required for public models
 * Uses Mistral-7B-Instruct-v0.3 with Zephyr-7b-beta fallback
 */

import { HF_API_BASE, HF_MODEL_ID, HF_FALLBACK_MODEL } from '@/constants/config';

const HF_API_TOKEN = process.env.EXPO_PUBLIC_HF_API_TOKEN || '';

interface HFGenerationParams {
  max_new_tokens?: number;
  temperature?: number;
  top_p?: number;
  do_sample?: boolean;
  return_full_text?: boolean;
}

const DEFAULT_PARAMS: HFGenerationParams = {
  max_new_tokens: 512,
  temperature: 0.7,
  top_p: 0.9,
  do_sample: true,
  return_full_text: false,
};

/**
 * Build a social media content generation prompt
 */
function buildContentPrompt(
  brandName: string,
  description: string,
  tone: string,
  platform: string,
  theme?: string,
  maxChars: number = 280
): string {
  const themeText = theme ? ` about "${theme}"` : '';
  return `<s>[INST] You are a professional social media content creator. Write a single, engaging ${platform} post for "${brandName}"${themeText}.

Brand description: ${description}
Tone: ${tone}
Max length: ${maxChars} characters

Requirements:
- Hook the reader in the first 10 words
- Include 3-5 relevant hashtags
- End with a clear call-to-action
- Match the brand tone perfectly
- Do NOT include any meta commentary, explanations, or markdown formatting
- Return ONLY the post content

Post:[/INST]`;
}

/**
 * Build a website analysis prompt
 */
function buildAnalysisPrompt(url: string, pageText: string): string {
  return `<s>[INST] Analyze this website content and extract a structured brand profile.

URL: ${url}
Content excerpt: ${pageText.substring(0, 3000)}

Extract and return ONLY a JSON object with this exact structure:
{
  "brandName": "extracted brand name",
  "description": "2-3 sentence brand description",
  "keywords": ["up to 5 relevant keywords"],
  "tone": "one of: professional, casual, playful, authoritative, friendly, luxury, edgy",
  "productsServices": ["up to 5 products or services"],
  "targetAudience": "primary target audience description",
  "contentThemes": ["up to 5 content theme categories"],
  "colorScheme": ["up to 3 hex color codes if detectable"]
}

Return ONLY valid JSON. No markdown, no explanations.[/INST]`;
}

/**
 * Call Hugging Face Inference API with retry and fallback
 */
async function callHFAPI(
  prompt: string,
  model: string = HF_MODEL_ID,
  params: HFGenerationParams = {}
): Promise<string> {
  const mergedParams = { ...DEFAULT_PARAMS, ...params };
  
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (HF_API_TOKEN) {
    headers['Authorization'] = `Bearer ${HF_API_TOKEN}`;
  }

  const body = {
    inputs: prompt,
    parameters: mergedParams,
    options: {
      wait_for_model: true,
      use_cache: true,
    },
  };

  const response = await fetch(`${HF_API_BASE}/models/${model}`, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => 'Unknown error');
    throw new Error(`HF API error (${response.status}): ${errorText}`);
  }

  const result = await response.json();
  
  // HF returns array of [{ generated_text: string }]
  if (Array.isArray(result) && result[0]?.generated_text) {
    return result[0].generated_text as string;
  }
  
  if (result.generated_text) {
    return result.generated_text as string;
  }

  throw new Error('Unexpected response format from HF API');
}

/**
 * Generate social media content using AI
 */
export async function generateSocialContent(
  brandName: string,
  description: string,
  tone: string,
  platform: string,
  theme?: string,
  maxChars: number = 280
): Promise<string> {
  const prompt = buildContentPrompt(brandName, description, tone, platform, theme, maxChars);
  
  try {
    return await callHFAPI(prompt, HF_MODEL_ID, {
      max_new_tokens: Math.min(maxChars / 3, 512),
      temperature: 0.75,
    });
  } catch (error) {
    console.warn('Primary model failed, trying fallback:', error);
    return await callHFAPI(prompt, HF_FALLBACK_MODEL, {
      max_new_tokens: Math.min(maxChars / 3, 512),
      temperature: 0.75,
    });
  }
}

/**
 * Generate multiple posts for different platforms
 */
export async function generateBatchContent(
  brandName: string,
  description: string,
  tone: string,
  platforms: Array<{ id: string; name: string; maxChars: number }>,
  theme?: string
): Promise<Array<{ platformId: string; content: string; hashtags: string[] }>> {
  const results = await Promise.all(
    platforms.map(async (platform) => {
      try {
        const content = await generateSocialContent(
          brandName,
          description,
          tone,
          platform.name,
          theme,
          platform.maxChars
        );
        
        // Extract hashtags from generated content
        const hashtagRegex = /#[\w]+/g;
        const hashtags = content.match(hashtagRegex) || [];
        
        // Clean content (remove extra whitespace, ensure it fits)
        const cleanContent = content
          .replace(/\n{3,}/g, '\n\n')
          .trim()
          .substring(0, platform.maxChars);

        return {
          platformId: platform.id,
          content: cleanContent,
          hashtags: hashtags.slice(0, 5),
        };
      } catch (error) {
        console.error(`Failed to generate for ${platform.name}:`, error);
        // Return fallback content
        return {
          platformId: platform.id,
          content: `🚀 ${brandName} is transforming the way businesses grow! Discover AI-powered solutions that work while you sleep. #AI #BusinessGrowth #Automation`,
          hashtags: ['#AI', '#BusinessGrowth', '#Automation'],
        };
      }
    })
  );

  return results;
}

/**
 * Analyze website content and extract brand profile
 */
export async function analyzeWebsiteWithAI(
  url: string,
  pageText: string
): Promise<{
  brandName: string;
  description: string;
  keywords: string[];
  tone: string;
  productsServices: string[];
  targetAudience: string;
  contentThemes: string[];
  colorScheme: string[];
}> {
  const prompt = buildAnalysisPrompt(url, pageText);
  
  try {
    const rawResponse = await callHFAPI(prompt, HF_MODEL_ID, {
      max_new_tokens: 1024,
      temperature: 0.3,
    });
    
    // Extract JSON from response (model may wrap in markdown)
    const jsonMatch = rawResponse.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('No JSON found in response');
    }
    
    const parsed = JSON.parse(jsonMatch[0]);
    
    return {
      brandName: parsed.brandName || 'Unknown Brand',
      description: parsed.description || 'AI-powered business solutions',
      keywords: Array.isArray(parsed.keywords) ? parsed.keywords.slice(0, 5) : ['AI', 'Automation'],
      tone: ['professional', 'casual', 'playful', 'authoritative', 'friendly', 'luxury', 'edgy'].includes(parsed.tone)
        ? parsed.tone
        : 'professional',
      productsServices: Array.isArray(parsed.productsServices) ? parsed.productsServices.slice(0, 5) : ['AI Solutions'],
      targetAudience: parsed.targetAudience || 'Business owners',
      contentThemes: Array.isArray(parsed.contentThemes) ? parsed.contentThemes.slice(0, 5) : ['technology'],
      colorScheme: Array.isArray(parsed.colorScheme) ? parsed.colorScheme.slice(0, 3) : ['#4169E1'],
    };
  } catch (error) {
    console.warn('AI analysis failed, using fallback:', error);
    
    // Fallback: extract domain name and generate basic profile
    const domain = new URL(url).hostname.replace('www.', '').split('.')[0];
    const brandName = domain.charAt(0).toUpperCase() + domain.slice(1);
    
    return {
      brandName,
      description: `${brandName} delivers innovative solutions for modern businesses.`,
      keywords: ['AI', 'Automation', 'Business Growth', 'Digital', 'Innovation'],
      tone: 'professional',
      productsServices: ['AI Solutions', 'Automation Tools', 'Business Services'],
      targetAudience: 'Small to medium business owners',
      contentThemes: ['technology', 'business_growth', 'innovation'],
      colorScheme: ['#4169E1', '#BF00FF', '#00FFFF'],
    };
  }
}

/**
 * Generate content variations (A/B test versions)
 */
export async function generateContentVariations(
  baseContent: string,
  count: number = 2
): Promise<string[]> {
  const prompt = `<s>[INST] Generate ${count} alternative versions of this social media post. Each should be different in tone or angle but equally engaging.

Original: "${baseContent}"

Return ONLY the alternatives, one per line, no numbering, no explanations.[/INST]`;

  try {
    const response = await callHFAPI(prompt, HF_MODEL_ID, {
      max_new_tokens: 1024,
      temperature: 0.9,
    });
    
    return response
      .split('\n')
      .map(line => line.trim())
      .filter(line => line.length > 20 && !line.startsWith('[') && !line.startsWith('</'));
  } catch (error) {
    console.error('Variation generation failed:', error);
    return [baseContent];
  }
}

/**
 * Check if Hugging Face API is available (health check)
 */
export async function checkHFAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${HF_API_BASE}/models/${HF_MODEL_ID}`, {
      method: 'HEAD',
      headers: HF_API_TOKEN ? { 'Authorization': `Bearer ${HF_API_TOKEN}` } : {},
    });
    return response.ok;
  } catch {
    return false;
  }
}

export { HF_MODEL_ID, HF_FALLBACK_MODEL };
