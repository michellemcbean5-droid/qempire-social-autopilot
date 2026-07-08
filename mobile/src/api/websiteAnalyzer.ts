/**
 * Website Analysis API
 * Fetches website content and extracts brand profile using AI
 * Falls back to heuristic extraction if AI is unavailable
 */

import { analyzeWebsiteWithAI, checkHFAvailability } from './huggingface';

interface WebsiteAnalysisResult {
  url: string;
  brandName: string;
  description: string;
  keywords: string[];
  tone: string;
  productsServices: string[];
  targetAudience: string;
  contentThemes: string[];
  colorScheme: string[];
  socialLinks: Array<{ platform: string; url: string }>;
  lastAnalyzed: string;
}

/**
 * Fetch raw website content via CORS proxy or direct fetch
 */
async function fetchWebsiteContent(url: string): Promise<string> {
  // Try direct fetch first (works for CORS-enabled sites)
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Accept': 'text/html',
        'User-Agent': 'Q-Empire-WebsiteAnalyzer/1.0',
      },
    });
    
    if (response.ok) {
      const html = await response.text();
      return extractTextFromHTML(html);
    }
  } catch (error) {
    console.warn('Direct fetch failed, trying alternatives:', error);
  }

  // Fallback: Use a CORS proxy (allorigins or similar free service)
  const corsProxies = [
    `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
    `https://corsproxy.io/?${encodeURIComponent(url)}`,
  ];

  for (const proxyUrl of corsProxies) {
    try {
      const response = await fetch(proxyUrl, { timeout: 15000 } as any);
      if (response.ok) {
        const html = await response.text();
        return extractTextFromHTML(html);
      }
    } catch (error) {
      console.warn(`Proxy failed: ${proxyUrl}`, error);
    }
  }

  // Last resort: return empty and let AI work with URL only
  return '';
}

/**
 * Extract readable text from HTML
 */
function extractTextFromHTML(html: string): string {
  // Remove scripts, styles, and tags
  const clean = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<[^>]+>/g, ' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
  
  return clean.substring(0, 8000); // Limit to 8KB for API limits
}

/**
 * Extract social links from HTML
 */
function extractSocialLinks(html: string, baseUrl: string): Array<{ platform: string; url: string }> {
  const socialPatterns = [
    { platform: 'facebook', regex: /facebook\.com\/[\w.-]+/i },
    { platform: 'twitter', regex: /twitter\.com\/[\w_]+/i },
    { platform: 'instagram', regex: /instagram\.com\/[\w.]+/i },
    { platform: 'linkedin', regex: /linkedin\.com\/(company|in)\/[\w-]+/i },
    { platform: 'youtube', regex: /youtube\.com\/(channel|c|user)\/[\w-]+/i },
    { platform: 'tiktok', regex: /tiktok\.com\/@?[\w.]+/i },
    { platform: 'pinterest', regex: /pinterest\.com\/[\w/]+/i },
  ];

  const links: Array<{ platform: string; url: string }> = [];
  const seen = new Set<string>();

  for (const { platform, regex } of socialPatterns) {
    const matches = html.match(regex);
    if (matches && !seen.has(platform)) {
      seen.add(platform);
      links.push({
        platform,
        url: `https://${matches[0]}`,
      });
    }
  }

  return links;
}

/**
 * Heuristic brand extraction (no AI needed)
 */
function heuristicExtract(url: string, pageText: string): WebsiteAnalysisResult {
  const domain = new URL(url).hostname.replace('www.', '').split('.')[0];
  const brandName = domain.charAt(0).toUpperCase() + domain.slice(1);
  
  // Extract title from first sentence or domain
  const sentences = pageText.split(/[.!?]+/).filter(s => s.trim().length > 10);
  const description = sentences[0]?.trim() || `${brandName} provides innovative solutions for modern businesses.`;
  
  // Extract keywords from most frequent meaningful words
  const words = pageText.toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(w => w.length > 4 && !['about', 'contact', 'privacy', 'terms', 'cookie', 'login', 'register'].includes(w));
  
  const wordFreq = new Map<string, number>();
  for (const word of words) {
    wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
  }
  
  const keywords = Array.from(wordFreq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([word]) => word.charAt(0).toUpperCase() + word.slice(1));

  return {
    url,
    brandName,
    description: description.length > 200 ? description.substring(0, 200) + '...' : description,
    keywords: keywords.length > 0 ? keywords : ['AI', 'Automation', 'Business', 'Digital', 'Innovation'],
    tone: 'professional',
    productsServices: ['AI Solutions', 'Automation Tools', 'Business Services', 'Digital Marketing', 'Analytics'],
    targetAudience: 'Small to medium business owners',
    contentThemes: ['technology', 'business_growth', 'innovation', 'digital_marketing', 'ai_automation'],
    colorScheme: ['#4169E1', '#BF00FF', '#00FFFF'],
    socialLinks: [],
    lastAnalyzed: new Date().toISOString(),
  };
}

/**
 * Main website analysis function
 * Uses AI when available, falls back to heuristic extraction
 */
export async function analyzeWebsite(url: string): Promise<WebsiteAnalysisResult> {
  const normalizedUrl = url.startsWith('http') ? url : `https://${url}`;
  
  // Fetch website content
  const pageText = await fetchWebsiteContent(normalizedUrl);
  
  // Check if AI is available
  const aiAvailable = await checkHFAvailability();
  
  let aiResult: Partial<WebsiteAnalysisResult> | null = null;
  
  if (aiAvailable && pageText.length > 100) {
    try {
      aiResult = await analyzeWebsiteWithAI(normalizedUrl, pageText);
    } catch (error) {
      console.warn('AI analysis failed, using heuristic:', error);
    }
  }
  
  // Get heuristic result as baseline
  const heuristic = heuristicExtract(normalizedUrl, pageText);
  
  // Merge AI results with heuristic fallback
  const result: WebsiteAnalysisResult = {
    url: normalizedUrl,
    brandName: aiResult?.brandName || heuristic.brandName,
    description: aiResult?.description || heuristic.description,
    keywords: aiResult?.keywords || heuristic.keywords,
    tone: aiResult?.tone || heuristic.tone,
    productsServices: aiResult?.productsServices || heuristic.productsServices,
    targetAudience: aiResult?.targetAudience || heuristic.targetAudience,
    contentThemes: aiResult?.contentThemes || heuristic.contentThemes,
    colorScheme: aiResult?.colorScheme || heuristic.colorScheme,
    socialLinks: extractSocialLinks(pageText, normalizedUrl),
    lastAnalyzed: new Date().toISOString(),
  };

  return result;
}

/**
 * Quick URL validation
 */
export function isValidURL(url: string): boolean {
  try {
    const normalized = url.startsWith('http') ? url : `https://${url}`;
    new URL(normalized);
    return true;
  } catch {
    return false;
  }
}

export type { WebsiteAnalysisResult };
