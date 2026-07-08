# Q-Empire Social Autopilot — API Reference

> Mobile app API contracts: backend endpoints, HuggingFace integration, and data models. Updated: July 2025.

---

## Backend API (FastAPI)

Base URL: `https://api.qempireai.com/api` (production) / `http://localhost:8000/api` (dev)

### Authentication

All endpoints require Bearer token except `/auth/*`.

```
Authorization: Bearer <jwt_token>
```

### Endpoints

#### Auth

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/auth/register` | Create account | `{ email, password, name }` |
| POST | `/auth/login` | Get JWT token | `{ email, password }` |
| POST | `/auth/refresh` | Refresh token | `{ refresh_token }` |
| POST | `/auth/forgot-password` | Send reset email | `{ email }` |
| POST | `/auth/reset-password` | Reset with token | `{ token, new_password }` |

#### User

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/user/me` | Get current user profile |
| PUT | `/user/me` | Update profile |
| DELETE | `/user/me` | Delete account |
| GET | `/user/usage` | Get AI usage stats |

#### Onboarding

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/onboarding/analyze-website` | Analyze website URL | `{ url }` |
| POST | `/onboarding/brand-profile` | Save brand profile | `{ brand_profile }` |
| POST | `/onboarding/complete` | Mark onboarding done | — |

#### Content

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| POST | `/content/generate` | Generate AI content | `{ platforms[], theme?, tone? }` |
| GET | `/content/posts` | List user's posts | Query: `status`, `platform` |
| POST | `/content/posts` | Create post | `{ platform_id, content, scheduled_at? }` |
| PUT | `/content/posts/:id` | Update post | `{ content, status }` |
| DELETE | `/content/posts/:id` | Delete post | — |
| POST | `/content/posts/:id/publish` | Publish immediately | — |
| POST | `/content/posts/:id/schedule` | Schedule post | `{ scheduled_at }` |
| POST | `/content/batch` | Batch operations | `{ action, post_ids[] }` |

#### Platforms

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/platforms` | List available platforms |
| GET | `/platforms/connected` | List user's connected platforms |
| POST | `/platforms/:id/connect` | Connect OAuth platform |
| DELETE | `/platforms/:id/disconnect` | Disconnect platform |
| GET | `/platforms/:id/stats` | Get platform analytics |

#### Analytics

| Method | Endpoint | Description | Query |
|--------|----------|-------------|-------|
| GET | `/analytics/overview` | Dashboard summary | `days=7` |
| GET | `/analytics/platforms` | Per-platform stats | `days=30` |
| GET | `/analytics/posts` | Post performance | `limit=50` |
| GET | `/analytics/engagement` | Engagement trends | `days=90` |
| GET | `/analytics/export` | Export report | `format=pdf\|csv` |

#### Subscription

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/subscription/current` | Get current tier | — |
| POST | `/subscription/upgrade` | Upgrade tier | `{ tier, payment_method }` |
| POST | `/subscription/cancel` | Cancel subscription | — |
| POST | `/subscription/promo` | Apply promo code | `{ code }` |
| GET | `/subscription/invoices` | Billing history | — |

#### Autopilot

| Method | Endpoint | Description | Body |
|--------|----------|-------------|------|
| GET | `/autopilot/config` | Get autopilot settings | — |
| PUT | `/autopilot/config` | Update settings | `{ frequency, platforms[], rules }` |
| POST | `/autopilot/start` | Enable autopilot | — |
| POST | `/autopilot/stop` | Disable autopilot | — |
| GET | `/autopilot/log` | Autopilot activity log | `limit=50` |

#### Notifications

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/notifications` | List notifications |
| PUT | `/notifications/:id/read` | Mark as read |
| PUT | `/notifications/read-all` | Mark all read |
| DELETE | `/notifications/:id` | Delete notification |

#### Referral

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/referral/code` | Get user's referral code |
| GET | `/referral/stats` | Referral statistics |
| POST | `/referral/apply` | Apply referral code |

---

## HuggingFace Inference API

Base URL: `https://api-inference.huggingface.co`

### Models Used

| Model | Purpose | Fallback |
|-------|---------|----------|
| `mistralai/Mistral-7B-Instruct-v0.3` | Primary content generation | `HuggingFaceH4/zephyr-7b-beta` |
| `mistralai/Mistral-7B-Instruct-v0.3` | Website analysis (JSON) | `HuggingFaceH4/zephyr-7b-beta` |

### Rate Limits (Free Tier)

| Limit | Value |
|-------|-------|
| Requests per minute | 30 |
| Max input tokens | ~4,000 |
| Max output tokens | ~2,000 |
| Wait for model | Supported (cold start ~5-10s) |

### Authentication (Optional)

Free tier works without token. For higher limits, use HF token:

```
Authorization: Bearer <hf_token>
```

Set via environment: `EXPO_PUBLIC_HF_API_TOKEN`

### Request Format

```http
POST /models/mistralai/Mistral-7B-Instruct-v0.3
Content-Type: application/json

{
  "inputs": "<s>[INST] Write a tweet about AI automation... [/INST]",
  "parameters": {
    "max_new_tokens": 256,
    "temperature": 0.7,
    "top_p": 0.9,
    "do_sample": true,
    "return_full_text": false
  },
  "options": {
    "wait_for_model": true,
    "use_cache": true
  }
}
```

### Response Format

```json
[
  {
    "generated_text": "🚀 AI automation is transforming how businesses operate..."
  }
]
```

### Error Handling

| Status | Meaning | Action |
|--------|---------|--------|
| 200 | Success | Parse generated_text |
| 503 | Model loading | Retry with wait_for_model=true |
| 429 | Rate limited | Wait 60s, retry |
| 400 | Bad request | Check prompt format |
| 500 | Server error | Fallback to template |

---

## Data Models

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  updatedAt: string;
  onboardingComplete: boolean;
}
```

### BrandProfile

```typescript
interface BrandProfile {
  url: string;
  brandName: string;
  description: string;
  keywords: string[];
  tone: 'professional' | 'casual' | 'playful' | 'authoritative' | 'friendly' | 'luxury' | 'edgy';
  productsServices: string[];
  targetAudience: string;
  contentThemes: string[];
  colorScheme: string[];
  socialLinks: Array<{ platform: string; url: string }>;
  lastAnalyzed: string;
}
```

### Post

```typescript
interface Post {
  id: string;
  batchId?: string;
  platformId: string;
  platformName: string;
  content: string;
  hashtags: string[];
  characterCount: number;
  engagementScore: number;
  status: 'draft' | 'scheduled' | 'published' | 'failed';
  scheduledAt?: string;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
}
```

### Platform

```typescript
interface Platform {
  id: string;
  name: string;
  connected: boolean;
  followers: number;
  engagement: number;
  lastSynced?: string;
  avatar?: string;
}
```

### Subscription

```typescript
interface Subscription {
  tier: 'free' | 'basic' | 'pro' | 'elite';
  expiresAt?: string;
  promoCode?: string;
  discountPercent: number;
  aiGenerationCount: number;
  postCount: number;
  lastReset: string;
}
```

### Notification

```typescript
interface Notification {
  id: string;
  type: 'success' | 'warning' | 'error' | 'info';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  actionUrl?: string;
}
```

---

## Error Codes

| Code | HTTP | Meaning | Client Action |
|------|------|---------|---------------|
| `AUTH_001` | 401 | Invalid token | Refresh or re-login |
| `AUTH_002` | 403 | Insufficient permissions | Show upgrade prompt |
| `SUB_001` | 402 | Subscription required | Navigate to subscription |
| `SUB_002` | 429 | Usage limit exceeded | Show limit warning |
| `AI_001` | 503 | AI service unavailable | Use fallback generation |
| `AI_002` | 429 | AI rate limited | Queue for retry |
| `PLAT_001` | 400 | Platform auth failed | Reconnect platform |
| `PLAT_002` | 404 | Platform not found | Check platform ID |
| `CONT_001` | 400 | Invalid content | Show validation error |
| `CONT_002` | 409 | Duplicate post | Warn user |

---

## Webhooks (Pro/Elite)

### Event Types

| Event | Payload | Trigger |
|-------|---------|---------|
| `post.published` | `{ post_id, platform, url, published_at }` | Post goes live |
| `post.failed` | `{ post_id, platform, error, retry_count }` | Post fails |
| `autopilot.complete` | `{ batch_id, posts_count, platforms[] }` | Autopilot batch done |
| `subscription.changed` | `{ tier, previous_tier, changed_at }` | Tier upgrade/downgrade |
| `usage.threshold` | `{ feature, current, limit, percent }` | 80% of limit reached |

### Webhook Signature

```
X-Webhook-Signature: sha256=<hmac_sha256(payload, webhook_secret)>
```

Verify on receipt to ensure authenticity.

---

## SDK Starter (TypeScript)

```typescript
// Quick reference for API consumers

class QEmpireAPI {
  private baseURL: string;
  private token: string;

  constructor(baseURL = 'https://api.qempireai.com/api') {
    this.baseURL = baseURL;
  }

  setToken(token: string) {
    this.token = token;
  }

  private async request<T>(
    method: string,
    endpoint: string,
    body?: object
  ): Promise<T> {
    const response = await fetch(`${this.baseURL}${endpoint}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.token}`,
      },
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || `HTTP ${response.status}`);
    }

    return response.json();
  }

  // Auth
  login = (email: string, password: string) =>
    this.request<{ token: string; user: User }>('POST', '/auth/login', { email, password });

  // Content
  generateContent = (platforms: string[], theme?: string) =>
    this.request<{ posts: Post[] }>('POST', '/content/generate', { platforms, theme });

  getPosts = (status?: string) =>
    this.request<{ posts: Post[] }>('GET', `/content/posts${status ? `?status=${status}` : ''}`);

  // Analytics
  getOverview = (days = 7) =>
    this.request('GET', `/analytics/overview?days=${days}`);

  // Subscription
  getSubscription = () =>
    this.request<{ subscription: Subscription }>('GET', '/subscription/current');

  applyPromoCode = (code: string) =>
    this.request('POST', '/subscription/promo', { code });
}
```

---

*Document version: 1.0 | Last updated: July 2025*
