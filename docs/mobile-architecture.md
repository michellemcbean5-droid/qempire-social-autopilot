# Q-Empire Social Autopilot — Mobile Architecture

> Technical architecture overview for the React Native / Expo mobile application. Updated: July 2025.

---

## Stack Overview

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | Expo SDK | 52 |
| Runtime | React Native | 0.76 |
| Language | TypeScript | 5.3+ |
| State Management | Zustand | 4.5+ |
| UI Library | React Native Paper | 5.12+ |
| Navigation | React Navigation v6 | Native Stack + Bottom Tabs |
| Charts | React Native Chart Kit | 6.12+ |
| Storage | AsyncStorage | 1.23+ |
| Notifications | Expo Notifications | 0.29+ |
| Deep Links | Expo Linking | 6.3+ |
| AI API | Hugging Face Inference | Free tier |
| Backend | FastAPI (Python) | 0.115+ |

---

## Project Structure

```
mobile/
├── App.tsx                 # Entry point — providers, error boundary, deep links
├── package.json            # Dependencies + scripts
├── tsconfig.json           # TypeScript config (strict mode, path aliases)
├── babel.config.js         # Module resolver for @/ aliases
├── app.json                # Expo config (name, scheme, plugins, EAS)
├── eas.json                # EAS build profiles (development, preview, production)
├── fastlane/
│   ├── Fastfile            # iOS/Android deployment automation
│   └── Appfile             # App identifiers
├── src/
│   ├── api/
│   │   ├── huggingface.ts      # AI content generation via Mistral-7B
│   │   └── websiteAnalyzer.ts  # Website scraping + AI brand extraction
│   ├── components/
│   │   ├── ErrorBoundary.tsx   # Global error catching + recovery UI
│   │   ├── SkeletonDashboard.tsx # Loading shimmer for dashboard
│   │   └── UpgradePrompt.tsx   # Subscription upsell modal
│   ├── constants/
│   │   ├── theme.ts            # Colors, spacing, typography, shadows
│   │   └── config.ts           # API URLs, tiers, platform registry, analytics events
│   ├── navigation/
│   │   └── index.tsx           # Stack + Tab navigator, 18 screen routes
│   ├── screens/
│   │   ├── DashboardScreen.tsx      # Main hub — stats, quick actions, content queue
│   │   ├── PlatformsScreen.tsx      # Connect/manage 25 social platforms
│   │   ├── ContentScreen.tsx        # Content queue — draft, scheduled, published
│   │   ├── AnalyticsScreen.tsx      # Performance charts + insights
│   │   ├── SettingsScreen.tsx       # Account, preferences, support
│   │   ├── OnboardingScreen.tsx     # 3-slide welcome + brand setup
│   │   ├── LoginScreen.tsx          # Email/password auth
│   │   ├── WebsiteAnalysisScreen.tsx # URL → AI brand profile extraction
│   │   ├── PlatformDetailScreen.tsx # Single platform stats + settings
│   │   ├── GenerateContentScreen.tsx # AI content generation for selected platforms
│   │   ├── PostEditorScreen.tsx     # Edit AI-generated posts before publishing
│   │   ├── AutopilotConfigScreen.tsx # Auto-scheduling rules + frequency
│   │   ├── NotificationScreen.tsx   # In-app notification center
│   │   ├── SubscriptionScreen.tsx   # 4-tier pricing + upgrade flow
│   │   ├── PromoCodeScreen.tsx      # Promo/master code entry + validation
│   │   ├── ReferralScreen.tsx       # Share code + referral tracking
│   │   ├── AIFeaturesScreen.tsx     # AI capabilities showcase + usage stats
│   │   └── SupportScreen.tsx        # Help center + contact options
│   ├── store/
│   │   ├── authStore.ts             # Auth state, login/logout, profile
│   │   ├── subscriptionStore.ts     # Tier, limits, promo codes, usage tracking
│   │   ├── platformStore.ts         # Connected platforms, followers, engagement
│   │   ├── contentStore.ts          # Posts queue, generation state, drafts
│   │   ├── notificationStore.ts     # In-app notifications, read/unread
│   │   └── brandStore.ts            # Brand profile, website analysis state
│   ├── utils/
│   │   ├── deepLinks.ts             # URL scheme handling, route parsing
│   │   └── notifications.ts         # Push notification setup, scheduling
│   └── __tests__/
│       ├── setup.ts                 # Jest mocks (AsyncStorage, Paper, Navigation, etc.)
│       ├── stores.test.ts           # Unit tests for all 6 Zustand stores
│       ├── navigation.test.ts       # Navigation structure validation
│       └── api.test.ts              # HuggingFace + WebsiteAnalyzer API tests
```

---

## State Architecture (Zustand)

All stores use `persist` middleware with AsyncStorage for offline-first experience.

```
┌─────────────────────────────────────────────────────────────┐
│                        App.tsx                               │
│  PaperProvider + QueryClient + Toast + ErrorBoundary        │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
   ┌─────────┐         ┌─────────────┐        ┌──────────┐
   │  Stack  │         │  BottomTab  │        │  Modal   │
   │Navigator│         │  Navigator  │        │  Screens │
   └─────────┘         └─────────────┘        └──────────┘
        │                     │
   ┌────┴────┐           ┌────┴────┐
   │ Screens │           │ Screens │
   │ (Auth)  │           │(Main)   │
   └────┬────┘           └────┬────┘
        │                     │
   ┌────┴─────────────────────┴────┐
   │         Zustand Stores         │
   ├────────────────────────────────┤
   │ authStore ──────┐              │
   │ subscriptionStore│              │
   │ platformStore ───┼──► Screens   │
   │ contentStore ────┤              │
   │ notificationStore│              │
   │ brandStore ──────┘              │
   └────────────────────────────────┘
        │
   ┌────┴────┐
   │AsyncStorage│ (persist)
   └─────────┘
```

### Store Interactions

| Store | Reads From | Writes To | Persisted |
|-------|-----------|-----------|-----------|
| `authStore` | — | `subscriptionStore` (on login) | ✅ |
| `subscriptionStore` | `authStore` | `contentStore`, `platformStore` (limits) | ✅ |
| `platformStore` | `subscriptionStore` (maxPlatforms) | `contentStore` (post platform) | ✅ |
| `contentStore` | `brandStore` (profile), `platformStore` | `notificationStore` | ✅ |
| `notificationStore` | All stores | — | ✅ |
| `brandStore` | — | `contentStore` (generation) | ✅ |

---

## Navigation Flow

```
App Launch
    │
    ├──► Onboarding (first launch)
    │       └──► Login
    │
    └──► Login (returning user, unauthenticated)
            │
            └──► MainTabs (authenticated)
                    │
                    ├──► Dashboard (default tab)
                    │       ├──► WebsiteAnalysis
                    │       ├──► GenerateContent
                    │       ├──► PostEditor
                    │       └──► AutopilotConfig
                    │
                    ├──► Platforms
                    │       └──► PlatformDetail
                    │
                    ├──► Content
                    │       └──► PostEditor
                    │
                    ├──► Analytics
                    │       └──► AIFeatures
                    │
                    └──► Settings
                            ├──► Subscription
                            ├──► PromoCode
                            ├──► Referral
                            ├──► Notifications
                            ├──► Support
                            └──► Login (logout)
```

---

## AI Integration Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  GenerateContent │────►│  huggingface.ts  │────►│  HF Inference   │
│     Screen       │     │                  │     │  Mistral-7B     │
└─────────────────┘     │  • Build prompt  │     │  (Free Tier)    │
                        │  • Call API      │     └─────────────────┘
┌─────────────────┐     │  • Retry/fallback│           │
│ WebsiteAnalysis  │────►│  • Parse response│           │
│     Screen       │     └──────────────────┘           │
└─────────────────┘              │                       │
                                 ▼                       ▼
                        ┌──────────────────┐     ┌─────────────────┐
                        │ websiteAnalyzer.ts│     │  Zephyr-7b      │
                        │                  │     │  (Fallback)     │
                        │  • Fetch HTML    │     └─────────────────┘
                        │  • Extract text  │
                        │  • Heuristic     │
                        │  • Merge AI      │
                        └──────────────────┘
```

### Prompt Engineering Strategy

1. **Content Generation**: Uses `<s>[INST] ... [/INST]` format for Mistral-7B-Instruct
2. **Website Analysis**: Structured JSON output with strict schema validation
3. **Fallback**: Template-based generation if AI API fails or is unavailable
4. **Rate Limiting**: Respects HF free tier (30 req/min) with client-side throttling

---

## Data Flow

### Content Generation Flow

```
User selects platforms + theme
        │
        ▼
┌───────────────┐
│  Validate     │──► Check subscription limits (maxPlatforms, aiGenerations)
│  Limits       │
└───────────────┘
        │
        ▼
┌───────────────┐
│  Build Prompt │──► Include brand profile, tone, platform constraints
│  (per platform)│
└───────────────┘
        │
        ▼
┌───────────────┐
│  Call HF API  │──► Parallel requests for each platform
│  (parallel)   │    Fallback to template on failure
└───────────────┘
        │
        ▼
┌───────────────┐
│  Parse & Clean│──► Extract hashtags, trim to maxChars, format
└───────────────┘
        │
        ▼
┌───────────────┐
│  Save to Store│──► contentStore.addPosts()
│  + Notify     │    notificationStore.addNotification()
└───────────────┘
```

### Website Analysis Flow

```
User enters URL
        │
        ▼
┌───────────────┐
│  Validate URL │──► Regex + URL constructor
└───────────────┘
        │
        ▼
┌───────────────┐
│  Fetch HTML   │──► Direct fetch → CORS proxy fallback
└───────────────┘
        │
        ▼
┌───────────────┐
│  Extract Text │──► Remove scripts/styles/tags, limit 8KB
└───────────────┘
        │
        ▼
┌───────────────┐     ┌───────────────┐
│  AI Analysis  │────►│  HF API       │──► Structured JSON
│  (if available)│     │  (Mistral-7B) │
└───────────────┘     └───────────────┘
        │
        ▼
┌───────────────┐
│  Heuristic    │──► Fallback if AI fails/unavailable
│  Extraction   │
└───────────────┘
        │
        ▼
┌───────────────┐
│  Merge Results│──► AI result preferred, heuristic fallback
│  + Save       │    brandStore.setProfile()
└───────────────┘
```

---

## Subscription & Monetization Flow

```
App Launch
    │
    └──► Check subscriptionStore.currentTier
            │
            ├──► FREE ──► Show ads, limit features, gate AI
            │
            ├──► BASIC ──► No ads, autopilot, 10 platforms
            │
            ├──► PRO ──► API access, team (3), advanced analytics
            │
            └──► ELITE ──► Unlimited, team (10), priority support

Feature Access Check (per action):
    │
    └──► subscriptionStore.canUseFeature(featureName)
            │
            ├──► Allowed ──► Execute action
            │
            └──► Blocked ──► Show UpgradePrompt modal
                                  │
                                  └──► Navigate to SubscriptionScreen
```

---

## Performance Considerations

| Concern | Strategy |
|---------|----------|
| Bundle Size | Tree-shake unused Paper components, lazy-load screens |
| AI Latency | Show progress bar, background generation, timeout 15s |
| Offline Support | AsyncStorage persistence, queue actions for sync |
| Image Loading | Use expo-image, cache aggressively |
| Re-renders | Zustand selectors, React.memo on list items |
| Memory | FlatList for long content queues, limit stored posts to 100 |

---

## Security

| Layer | Implementation |
|-------|---------------|
| API Keys | `process.env.EXPO_PUBLIC_*` — never hardcoded |
| Auth Tokens | SecureStore (encrypted) |
| HTTPS | All API calls force TLS |
| Input Validation | URL regex, char limits, XSS prevention |
| Subscription | Server-side validation (receipt verification) |

---

## Testing Strategy

| Level | Tool | Coverage |
|-------|------|----------|
| Unit | Jest + RNTL | Stores, utilities, API clients |
| Integration | Jest + RNTL | Screen rendering, navigation |
| E2E | Detox (planned) | Full user journeys |
| API | Jest + fetch mock | HuggingFace, backend endpoints |

---

*Document version: 1.0 | Last updated: July 2025*
