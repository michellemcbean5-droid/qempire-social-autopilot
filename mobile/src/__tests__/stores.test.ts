import { renderHook, act } from '@testing-library/react-native';
import { useAuthStore } from '@/store/authStore';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { usePlatformStore } from '@/store/platformStore';
import { useContentStore } from '@/store/contentStore';
import { useNotificationStore } from '@/store/notificationStore';
import { useBrandStore } from '@/store/brandStore';

describe('Auth Store', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useAuthStore());
    act(() => {
      result.current.logout();
    });
  });

  it('should initialize with unauthenticated state', () => {
    const { result } = renderHook(() => useAuthStore());
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should login successfully', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.login('test@example.com', 'password123');
    });

    expect(result.current.isAuthenticated).toBe(true);
    expect(result.current.user?.email).toBe('test@example.com');
    expect(result.current.user?.name).toBe('Test User');
  });

  it('should logout and clear state', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.login('test@example.com', 'password123');
    });
    expect(result.current.isAuthenticated).toBe(true);

    act(() => {
      result.current.logout();
    });
    expect(result.current.isAuthenticated).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('should update user profile', () => {
    const { result } = renderHook(() => useAuthStore());
    
    act(() => {
      result.current.login('test@example.com', 'password123');
      result.current.updateProfile({ name: 'Updated Name' });
    });

    expect(result.current.user?.name).toBe('Updated Name');
  });
});

describe('Subscription Store', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useSubscriptionStore());
    act(() => {
      result.current.resetToFree();
    });
  });

  it('should default to free tier', () => {
    const { result } = renderHook(() => useSubscriptionStore());
    expect(result.current.currentTier).toBe('free');
  });

  it('should upgrade to basic tier', () => {
    const { result } = renderHook(() => useSubscriptionStore());
    
    act(() => {
      result.current.upgradeTier('basic');
    });

    expect(result.current.currentTier).toBe('basic');
    expect(result.current.getLimits().maxPlatforms).toBe(10);
  });

  it('should upgrade to pro tier', () => {
    const { result } = renderHook(() => useSubscriptionStore());
    
    act(() => {
      result.current.upgradeTier('pro');
    });

    expect(result.current.currentTier).toBe('pro');
    expect(result.current.getLimits().maxPlatforms).toBe(25);
    expect(result.current.getLimits().teamMembers).toBe(3);
  });

  it('should upgrade to elite tier', () => {
    const { result } = renderHook(() => useSubscriptionStore());
    
    act(() => {
      result.current.upgradeTier('elite');
    });

    expect(result.current.currentTier).toBe('elite');
    expect(result.current.getLimits().maxPlatforms).toBe(25);
    expect(result.current.getLimits().teamMembers).toBe(10);
  });

  it('should check feature availability', () => {
    const { result } = renderHook(() => useSubscriptionStore());
    
    expect(result.current.canUseFeature('autopilot')).toBe(false);
    expect(result.current.canUseFeature('advancedAnalytics')).toBe(false);

    act(() => {
      result.current.upgradeTier('pro');
    });

    expect(result.current.canUseFeature('autopilot')).toBe(true);
    expect(result.current.canUseFeature('advancedAnalytics')).toBe(true);
  });

  it('should apply promo code', () => {
    const { result } = renderHook(() => useSubscriptionStore());
    
    act(() => {
      result.current.applyPromoCode('QEMPIRE50');
    });

    expect(result.current.promoCode).toBe('QEMPIRE50');
    expect(result.current.discountPercent).toBe(50);
  });

  it('should track AI usage', () => {
    const { result } = renderHook(() => useSubscriptionStore());
    
    act(() => {
      result.current.incrementAIGenerationCount();
    });

    expect(result.current.aiGenerationCount).toBe(1);
  });
});

describe('Platform Store', () => {
  beforeEach(() => {
    const { result } = renderHook(() => usePlatformStore());
    act(() => {
      result.current.resetPlatforms();
    });
  });

  it('should initialize with empty platforms', () => {
    const { result } = renderHook(() => usePlatformStore());
    expect(result.current.platforms).toEqual([]);
  });

  it('should add a platform', () => {
    const { result } = renderHook(() => usePlatformStore());
    
    act(() => {
      result.current.addPlatform({
        id: 'twitter',
        name: 'X/Twitter',
        connected: false,
        followers: 0,
        engagement: 0,
      });
    });

    expect(result.current.platforms).toHaveLength(1);
    expect(result.current.platforms[0].id).toBe('twitter');
  });

  it('should toggle platform connection', () => {
    const { result } = renderHook(() => usePlatformStore());
    
    act(() => {
      result.current.addPlatform({
        id: 'twitter',
        name: 'X/Twitter',
        connected: false,
        followers: 0,
        engagement: 0,
      });
      result.current.toggleConnection('twitter');
    });

    expect(result.current.platforms[0].connected).toBe(true);
  });

  it('should remove a platform', () => {
    const { result } = renderHook(() => usePlatformStore());
    
    act(() => {
      result.current.addPlatform({
        id: 'twitter',
        name: 'X/Twitter',
        connected: false,
        followers: 0,
        engagement: 0,
      });
      result.current.removePlatform('twitter');
    });

    expect(result.current.platforms).toHaveLength(0);
  });
});

describe('Content Store', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useContentStore());
    act(() => {
      result.current.clearPosts();
    });
  });

  it('should add posts', () => {
    const { result } = renderHook(() => useContentStore());
    
    const posts = [
      {
        id: '1',
        platformId: 'twitter',
        content: 'Test post',
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    act(() => {
      result.current.addPosts(posts);
    });

    expect(result.current.posts).toHaveLength(1);
    expect(result.current.posts[0].content).toBe('Test post');
  });

  it('should update post status', () => {
    const { result } = renderHook(() => useContentStore());
    
    act(() => {
      result.current.addPosts([{
        id: '1',
        platformId: 'twitter',
        content: 'Test post',
        status: 'draft' as const,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }]);
      result.current.updatePostStatus('1', 'scheduled');
    });

    expect(result.current.posts[0].status).toBe('scheduled');
  });

  it('should set generating state', () => {
    const { result } = renderHook(() => useContentStore());
    
    act(() => {
      result.current.setGenerating(true, 0.5);
    });

    expect(result.current.isGenerating).toBe(true);
    expect(result.current.generationProgress).toBe(0.5);
  });
});

describe('Notification Store', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useNotificationStore());
    act(() => {
      result.current.clearAll();
    });
  });

  it('should add notification', () => {
    const { result } = renderHook(() => useNotificationStore());
    
    act(() => {
      result.current.addNotification({
        type: 'success',
        title: 'Test',
        message: 'Test message',
      });
    });

    expect(result.current.notifications).toHaveLength(1);
    expect(result.current.notifications[0].title).toBe('Test');
  });

  it('should mark notification as read', () => {
    const { result } = renderHook(() => useNotificationStore());
    
    act(() => {
      result.current.addNotification({
        type: 'success',
        title: 'Test',
        message: 'Test message',
      });
      result.current.markAsRead(result.current.notifications[0].id);
    });

    expect(result.current.notifications[0].read).toBe(true);
  });

  it('should count unread notifications', () => {
    const { result } = renderHook(() => useNotificationStore());
    
    act(() => {
      result.current.addNotification({ type: 'success', title: '1', message: 'm' });
      result.current.addNotification({ type: 'warning', title: '2', message: 'm' });
    });

    expect(result.current.unreadCount).toBe(2);
  });
});

describe('Brand Store', () => {
  beforeEach(() => {
    const { result } = renderHook(() => useBrandStore());
    act(() => {
      result.current.clearProfile();
    });
  });

  it('should set profile', () => {
    const { result } = renderHook(() => useBrandStore());
    
    const profile = {
      brandName: 'Test Brand',
      description: 'Test description',
      keywords: ['test'],
      tone: 'professional',
      productsServices: ['service1'],
      targetAudience: 'testers',
      contentThemes: ['testing'],
      colorScheme: ['#000000'],
    };

    act(() => {
      result.current.setProfile(profile);
    });

    expect(result.current.profile?.brandName).toBe('Test Brand');
  });

  it('should set analyzing state', () => {
    const { result } = renderHook(() => useBrandStore());
    
    act(() => {
      result.current.setAnalyzing(true);
    });

    expect(result.current.isAnalyzing).toBe(true);
  });

  it('should set error', () => {
    const { result } = renderHook(() => useBrandStore());
    
    act(() => {
      result.current.setError('Analysis failed');
    });

    expect(result.current.analysisError).toBe('Analysis failed');
  });
});
