# Q-Empire Social Autopilot — Monetization Strategy

> 4-tier subscription model, master codes, promo codes, and revenue projections. Updated: July 2025.

---

## Subscription Tiers

### Free Tier

| Feature | Limit |
|---------|-------|
| Connected Platforms | 3 |
| Posts Per Day | 5 |
| AI Generations Per Day | 10 |
| Analytics Retention | 7 days |
| Autopilot | ❌ |
| Team Members | 1 |
| API Access | ❌ |
| Priority Support | ❌ |
| Ads | ✅ Banner + Interstitial |

**Strategy:** Hook users with real functionality. No time limit. Convert to paid via feature gates and usage limits.

---

### Basic — $19.99/month

| Feature | Limit |
|---------|-------|
| Connected Platforms | 10 |
| Posts Per Day | 25 |
| AI Generations Per Day | 50 |
| Analytics Retention | 30 days |
| Autopilot | ✅ |
| Custom Schedules | ✅ |
| Team Members | 1 |
| API Access | ❌ |
| Priority Support | ❌ |
| Ads | ❌ |

**Target:** Solopreneurs, small businesses, side hustlers
**Conversion Trigger:** "You've reached your 5 post limit. Upgrade to Basic for unlimited autopilot."

---

### Pro — $49.99/month

| Feature | Limit |
|---------|-------|
| Connected Platforms | 25 |
| Posts Per Day | 100 |
| AI Generations Per Day | 200 |
| Analytics Retention | 90 days |
| Autopilot | ✅ Advanced |
| Custom Schedules | ✅ |
| Advanced Analytics | ✅ |
| API Access | ✅ |
| Team Members | 3 |
| Priority Support | ✅ Email |
| Ads | ❌ |

**Target:** Growing agencies, marketing teams, power users
**Conversion Trigger:** "Add team members and unlock API access with Pro."

---

### Elite — $199.99/month

| Feature | Limit |
|---------|-------|
| Connected Platforms | 25 |
| Posts Per Day | 500 |
| AI Generations Per Day | 1000 |
| Analytics Retention | 365 days |
| Autopilot | ✅ Full |
| Custom Schedules | ✅ |
| Advanced Analytics | ✅ Custom reports |
| API Access | ✅ Full + Webhooks |
| Team Members | 10 |
| Priority Support | ✅ Phone + Chat |
| Ads | ❌ |
| White-label | ✅ (coming Q3) |

**Target:** Large agencies, enterprises, white-label resellers
**Conversion Trigger:** "Manage 10 team members and get white-label options with Elite."

---

## Promo Code System

### Code Types

| Type | Format | Discount | Usage |
|------|--------|----------|-------|
| Launch Promo | `LAUNCH50` | 50% off first 3 months | App launch marketing |
| Referral | `REF-[username]` | 20% off + 20% to referrer | Viral growth |
| Influencer | `[influencer]-30` | 30% off first month | Influencer partnerships |
| Enterprise | `ENTERPRISE` | Custom pricing | Sales-led deals |
| Master Code | `MASTER-[agent]` | 100% off (internal) | Agent testing, demos |

### Master Codes (Internal Use Only)

> ⚠️ **Never commit real master codes to git. Use environment variables.**

```typescript
// mobile/src/constants/config.ts
const MASTER_CODES = [
  process.env.MASTER_CODE_1,
  process.env.MASTER_CODE_2,
].filter(Boolean);

// Validation
function isMasterCode(code: string): boolean {
  return MASTER_CODES.includes(code.toUpperCase());
}

// Master code grants Elite tier for 30 days
function applyMasterCode(code: string) {
  if (isMasterCode(code)) {
    return {
      tier: 'elite',
      duration: 30 * 24 * 60 * 60 * 1000, // 30 days
      expiresAt: Date.now() + 30 * 24 * 60 * 60 * 1000,
    };
  }
  return null;
}
```

### Promo Code UI Flow

1. User taps "Have a promo code?" on Subscription screen
2. Enters code (case-insensitive)
3. System validates against backend
4. Shows discount preview
5. Applies to next billing cycle
6. Stores code in user profile for analytics

---

## Revenue Projections

### Assumptions

| Metric | Value |
|--------|-------|
| Monthly Downloads | 10,000 |
| Signup Rate | 40% |
| Free-to-Paid Conversion | 5% |
| Basic : Pro : Elite Split | 60% : 30% : 10% |
| Monthly Churn | 8% |
| Annual Churn | 40% |

### Year 1 Projection

| Month | Users | Free | Basic | Pro | Elite | MRR | Cumulative |
|-------|-------|------|-------|-----|-------|-----|------------|
| 1 | 4,000 | 3,800 | 120 | 60 | 20 | $5,398 | $5,398 |
| 3 | 8,500 | 8,075 | 255 | 128 | 43 | $11,471 | $24,000 |
| 6 | 12,000 | 11,400 | 360 | 180 | 60 | $16,197 | $60,000 |
| 9 | 15,000 | 14,250 | 450 | 225 | 75 | $20,247 | $110,000 |
| 12 | 18,000 | 17,100 | 540 | 270 | 90 | $24,297 | $170,000 |

**Year 1 Total Revenue:** ~$170,000
**Year 2 Projected (3x growth):** ~$510,000

### Unit Economics

| Metric | Value |
|--------|-------|
| CAC (Customer Acquisition Cost) | $15 |
| LTV (Lifetime Value) | $287 |
| LTV:CAC Ratio | 19:1 ✅ |
| Payback Period | 1.2 months |
| Gross Margin | 85% |

### Cost Structure

| Cost | Monthly | Notes |
|------|---------|-------|
| HuggingFace API | $0 | Free tier (30 req/min) |
| Firebase / Backend | $50 | Hosting, Auth, DB |
| Expo EAS | $99 | Build credits |
| App Store / Play Fees | 15% | After $1M, 30% before |
| Ads (User Acquisition) | $3,000 | Facebook, Google, TikTok |
| Support | $500 | Part-time support agent |
| **Total Monthly Costs** | **~$3,650** | |

---

## Pricing Psychology

### Anchoring
- Elite at $199.99 makes Pro at $49.99 look like a "steal"
- Free tier makes any paid tier feel like an upgrade, not a penalty

### Decoy Effect
- Basic ($19.99) is the "decoy" — Pro ($49.99) offers 2.5x value for 2.5x price
- Most users skip Basic and go straight to Pro

### Loss Aversion
- "You're missing 20 platforms" instead of "Upgrade for 22 more"
- "Your analytics history is expiring" instead of "Upgrade for 90 days"

### Social Proof
- "Join 10,000+ businesses using Q-Empire"
- "Agencies save 15 hours/week with Pro"

---

## A/B Test Ideas

| Test | Variation A | Variation B | Metric |
|------|-------------|-------------|--------|
| Pricing display | $19.99/mo | $19.99/month — Save $60/year | Conversion |
| Free tier limit | 3 platforms | 5 platforms | Retention |
| Trial length | 7 days | 14 days | Conversion |
| Upgrade prompt | Modal popup | Inline banner | CTR |
| Social proof | User count | Time saved | Conversion |

---

*Document version: 1.0 | Last updated: July 2025*
