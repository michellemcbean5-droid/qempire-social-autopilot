import { generateSocialContent, analyzeWebsiteWithAI, checkHFAvailability } from '@/api/huggingface';

describe('HuggingFace API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  it('should generate social content successfully', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{ generated_text: '🚀 Exciting update from TestBrand! Our AI solutions are transforming businesses. #AI #Innovation' }]),
    });

    const result = await generateSocialContent(
      'TestBrand',
      'AI-powered business solutions',
      'professional',
      'Twitter'
    );

    expect(result).toContain('TestBrand');
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('api-inference.huggingface.co'),
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
      })
    );
  });

  it('should fallback to secondary model on primary failure', async () => {
    (global.fetch as jest.Mock)
      .mockRejectedValueOnce(new Error('Primary model unavailable'))
      .mockResolvedValueOnce({
        ok: true,
        status: 200,
        json: () => Promise.resolve([{ generated_text: 'Fallback content generated' }]),
      });

    const result = await generateSocialContent(
      'TestBrand',
      'AI solutions',
      'professional',
      'Twitter'
    );

    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(result).toBe('Fallback content generated');
  });

  it('should analyze website with AI', async () => {
    const mockJsonResponse = JSON.stringify({
      brandName: 'TestCorp',
      description: 'A test company',
      keywords: ['AI', 'Test'],
      tone: 'professional',
      productsServices: ['Service1'],
      targetAudience: 'Developers',
      contentThemes: ['tech'],
      colorScheme: ['#000000'],
    });

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      json: () => Promise.resolve([{ generated_text: mockJsonResponse }]),
    });

    const result = await analyzeWebsiteWithAI(
      'https://testcorp.com',
      'TestCorp is an AI company...'
    );

    expect(result.brandName).toBe('TestCorp');
    expect(result.keywords).toContain('AI');
  });

  it('should return fallback on AI analysis failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('API unavailable'));

    const result = await analyzeWebsiteWithAI(
      'https://testcorp.com',
      'Some content'
    );

    expect(result.brandName).toBe('Testcorp');
    expect(result.tone).toBe('professional');
  });

  it('should check HF availability', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
    });

    const available = await checkHFAvailability();
    expect(available).toBe(true);
  });

  it('should return false when HF is unavailable', async () => {
    (global.fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

    const available = await checkHFAvailability();
    expect(available).toBe(false);
  });
});

describe('Website Analyzer', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (global.fetch as jest.Mock).mockReset();
  });

  it('should extract text from HTML', async () => {
    const html = '<html><head><style>body{color:red}</style></head><body><h1>Test Brand</h1><p>We build AI solutions.</p><script>alert("x")</script></body></html>';
    
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      status: 200,
      text: () => Promise.resolve(html),
    });

    const { analyzeWebsite } = await import('@/api/websiteAnalyzer');
    const result = await analyzeWebsite('https://testbrand.com');

    expect(result.brandName).toBe('Testbrand');
    expect(result.description).toContain('Test Brand');
  });

  it('should validate URLs correctly', async () => {
    const { isValidURL } = await import('@/api/websiteAnalyzer');
    
    expect(isValidURL('https://example.com')).toBe(true);
    expect(isValidURL('example.com')).toBe(true);
    expect(isValidURL('not-a-url')).toBe(false);
    expect(isValidURL('')).toBe(false);
  });
});
