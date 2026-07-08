import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Linking,
  Share,
} from 'react-native';
import {
  Button,
  Text,
  Surface,
  Chip,
  Card,
  IconButton,
  Divider,
  List,
  TextInput,
  HelperText,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation';
import { useNotificationStore } from '@/store/notificationStore';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';
import { APP_CONFIG } from '@/constants/config';

const FAQS = [
  {
    question: 'How does the AI content generation work?',
    answer: 'Our AI uses Hugging Face transformer models (Mistral-7B) to analyze your brand and generate unique, platform-optimized content for each of your connected social media accounts.',
  },
  {
    question: 'Which platforms are supported?',
    answer: 'We support 25 platforms including Facebook, Instagram, X/Twitter, LinkedIn, TikTok, Pinterest, YouTube, Reddit, Threads, Tumblr, Medium, Mastodon, Discord, Telegram, WhatsApp, Snapchat, Bluesky, WordPress, Blogger, Mix, Quora, VK, Weibo, LINE, and KakaoTalk.',
  },
  {
    question: 'Is the AI free to use?',
    answer: 'Yes! We use the Hugging Face Inference API free tier (10,000 requests/month). No additional AI costs or API keys are required.',
  },
  {
    question: 'How does autopilot work?',
    answer: 'Once configured, autopilot automatically generates content on your schedule and publishes it to your connected platforms. You can set daily, twice-daily, weekly, or custom schedules.',
  },
  {
    question: 'Can I edit AI-generated content?',
    answer: 'Absolutely! All generated content goes to your queue where you can review, edit, and approve before publishing.',
  },
  {
    question: 'What happens when I reach my plan limits?',
    answer: 'You\'ll receive a notification when approaching limits. You can upgrade your plan anytime to unlock more features and higher quotas.',
  },
];

const SUPPORT_CHANNELS = [
  {
    id: 'email',
    name: 'Email Support',
    description: APP_CONFIG.supportEmail,
    icon: 'email',
    action: () => Linking.openURL(`mailto:${APP_CONFIG.supportEmail}`),
  },
  {
    id: 'phone',
    name: 'Phone Support',
    description: APP_CONFIG.supportPhone,
    icon: 'phone',
    action: () => Linking.openURL(`tel:${APP_CONFIG.supportPhone.replace(/[^\d]/g, '')}`),
  },
  {
    id: 'website',
    name: 'Help Center',
    description: APP_CONFIG.website,
    icon: 'web',
    action: () => Linking.openURL(APP_CONFIG.website),
  },
  {
    id: 'github',
    name: 'GitHub',
    description: 'Report issues and contribute',
    icon: 'github',
    action: () => Linking.openURL(APP_CONFIG.github),
  },
];

export default function SupportScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { addNotification } = useNotificationStore();
  
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitTicket = async () => {
    if (!subject.trim() || !message.trim()) {
      addNotification({
        type: 'warning',
        title: 'Missing Fields',
        message: 'Please fill in both subject and message.',
      });
      return;
    }

    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    addNotification({
      type: 'success',
      title: 'Ticket Submitted',
      message: 'We\'ve received your support request and will respond within 24 hours.',
    });
    
    setSubject('');
    setMessage('');
    setIsSubmitting(false);
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Check out Q-Empire Social Autopilot - the AI-powered social media marketing app! ${APP_CONFIG.website}`,
      });
    } catch (error) {
      console.error('Share error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.header}>
          <Text style={styles.headerTitle}>❓ Help & Support</Text>
          <Text style={styles.headerSubtitle}>
            Get help, find answers, and contact us
          </Text>
        </Surface>

        {/* Support Channels */}
        <Text style={styles.sectionTitle}>Contact Us</Text>
        
        <View style={styles.channelsList}>
          {SUPPORT_CHANNELS.map(channel => (
            <TouchableOpacity
              key={channel.id}
              style={styles.channelCard}
              onPress={channel.action}
            >
              <View style={styles.channelIcon}>
                <IconButton
                  icon={channel.icon}
                  size={24}
                  iconColor={colors.royalBlue}
                  style={styles.channelIconButton}
                />
              </View>
              <View style={styles.channelInfo}>
                <Text style={styles.channelName}>{channel.name}</Text>
                <Text style={styles.channelDescription}>{channel.description}</Text>
              </View>
              <IconButton
                icon="chevron-right"
                size={20}
                iconColor={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Submit Ticket */}
        <Text style={styles.sectionTitle}>Submit a Ticket</Text>
        
        <Card style={styles.ticketCard}>
          <Card.Content>
            <TextInput
              label="Subject"
              value={subject}
              onChangeText={setSubject}
              mode="outlined"
              style={styles.input}
              textColor={colors.softWhite}
              placeholder="Brief description of your issue"
            />
            
            <TextInput
              label="Message"
              value={message}
              onChangeText={setMessage}
              mode="outlined"
              multiline
              numberOfLines={4}
              style={[styles.input, styles.messageInput]}
              textColor={colors.softWhite}
              placeholder="Describe your issue in detail..."
            />
            
            <Button
              mode="contained"
              onPress={handleSubmitTicket}
              loading={isSubmitting}
              disabled={isSubmitting}
              style={styles.submitButton}
              buttonColor={colors.royalBlue}
              icon="send"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Ticket'}
            </Button>
          </Card.Content>
        </Card>

        {/* FAQs */}
        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        
        <View style={styles.faqList}>
          {FAQS.map((faq, index) => (
            <Card key={index} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqQuestion}
                onPress={() => setExpandedFaq(expandedFaq === index ? null : index)}
              >
                <Text style={styles.faqQuestionText}>{faq.question}</Text>
                <IconButton
                  icon={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  iconColor={colors.textSecondary}
                />
              </TouchableOpacity>
              
              {expandedFaq === index && (
                <Card.Content>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </Card.Content>
              )}
            </Card>
          ))}
        </View>

        {/* App Info */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>About Q-Empire Social Autopilot</Text>
            <Text style={styles.infoText}>
              Version {APP_CONFIG.version} ({APP_CONFIG.buildNumber})
            </Text>
            <Text style={styles.infoText}>
              Built with ❤️ by Q-Empire AI Automation Division
            </Text>
            
            <Button
              mode="outlined"
              onPress={handleShare}
              style={styles.shareButton}
              textColor={colors.royalBlue}
              icon="share-variant"
            >
              Share the App
            </Button>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.deepObsidian,
  },
  scrollContent: {
    padding: spacing.md,
  },
  header: {
    backgroundColor: colors.midnightNavy,
    padding: spacing.lg,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.md,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.softWhite,
    marginBottom: spacing.xs,
  },
  headerSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.softWhite,
    marginBottom: spacing.md,
    marginTop: spacing.md,
  },
  channelsList: {
    gap: spacing.sm,
  },
  channelCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    padding: spacing.md,
    ...shadows.sm,
  },
  channelIcon: {
    backgroundColor: colors.royalBlue + '20',
    borderRadius: borderRadius.md,
    marginRight: spacing.md,
  },
  channelIconButton: {
    margin: 0,
  },
  channelInfo: {
    flex: 1,
  },
  channelName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.softWhite,
    marginBottom: spacing.xs,
  },
  channelDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  ticketCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  input: {
    backgroundColor: colors.deepObsidian,
    marginBottom: spacing.md,
  },
  messageInput: {
    minHeight: 120,
  },
  submitButton: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
  },
  faqList: {
    gap: spacing.sm,
    marginBottom: spacing.md,
  },
  faqCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    ...shadows.sm,
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.md,
  },
  faqQuestionText: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: colors.softWhite,
    marginRight: spacing.sm,
  },
  faqAnswer: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    paddingTop: 0,
  },
  infoCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.xl,
    ...shadows.sm,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.softWhite,
    marginBottom: spacing.sm,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: spacing.xs,
  },
  shareButton: {
    marginTop: spacing.md,
    borderColor: colors.royalBlue,
    borderRadius: borderRadius.md,
  },
});
