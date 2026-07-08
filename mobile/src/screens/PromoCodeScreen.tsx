import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import {
  Button,
  Text,
  TextInput,
  Surface,
  Chip,
  Card,
  IconButton,
  HelperText,
} from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { RootStackParamList } from '@/navigation';
import { useSubscriptionStore } from '@/store/subscriptionStore';
import { useNotificationStore } from '@/store/notificationStore';
import { colors, spacing, borderRadius, shadows } from '@/constants/theme';

const PROMO_CODES = [
  { code: 'WELCOME50', tier: 'basic', discount: '50% off', duration: '30 days' },
  { code: 'PROTRIAL', tier: 'pro', discount: 'Free trial', duration: '14 days' },
  { code: 'ELITE2024', tier: 'elite', discount: '25% off', duration: '7 days' },
  { code: 'LAUNCH', tier: 'pro', discount: '30% off', duration: '30 days' },
  { code: 'FRIEND', tier: 'basic', discount: '20% off', duration: '30 days' },
];

export default function PromoCodeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { applyPromoCode, currentTier } = useSubscriptionStore();
  const { addNotification } = useNotificationStore();
  
  const [code, setCode] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleApply = () => {
    if (!code.trim()) {
      setResult({ success: false, message: 'Please enter a promo code' });
      return;
    }

    setIsApplying(true);
    
    // Simulate API call
    setTimeout(() => {
      const result = applyPromoCode(code.trim());
      setResult(result);
      setIsApplying(false);

      if (result.success) {
        addNotification({
          type: 'success',
          title: 'Promo Code Applied',
          message: result.message,
        });
      }
    }, 1500);
  };

  const handleSelectCode = (promoCode: string) => {
    setCode(promoCode);
    setResult(null);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Surface style={styles.header}>
          <Text style={styles.headerTitle}>🏷️ Promo Code</Text>
          <Text style={styles.headerSubtitle}>
            Enter a promo code to unlock discounts and free trials
          </Text>
        </Surface>

        {/* Input Section */}
        <Card style={styles.inputCard}>
          <Card.Content>
            <TextInput
              label="Promo Code"
              value={code}
              onChangeText={(text) => { setCode(text); setResult(null); }}
              mode="outlined"
              autoCapitalize="characters"
              style={styles.input}
              textColor={colors.softWhite}
              placeholder="Enter code (e.g., WELCOME50)"
              placeholderTextColor={colors.textMuted}
              left={<TextInput.Icon icon="tag" color={colors.textSecondary} />}
              disabled={isApplying}
            />

            {result && (
              <HelperText
                type={result.success ? 'info' : 'error'}
                visible={true}
                style={[
                  styles.resultText,
                  { color: result.success ? colors.success : colors.error }
                ]}
              >
                {result.message}
              </HelperText>
            )}

            <Button
              mode="contained"
              onPress={handleApply}
              loading={isApplying}
              disabled={isApplying || !code.trim()}
              style={styles.applyButton}
              buttonColor={colors.royalBlue}
              icon="check-circle"
            >
              {isApplying ? 'Applying...' : 'Apply Code'}
            </Button>
          </Card.Content>
        </Card>

        {/* Available Codes */}
        <Text style={styles.sectionTitle}>Available Promo Codes</Text>
        
        <View style={styles.codesList}>
          {PROMO_CODES.map((promo) => (
            <TouchableOpacity
              key={promo.code}
              style={[
                styles.codeCard,
                code === promo.code && styles.codeCardSelected,
              ]}
              onPress={() => handleSelectCode(promo.code)}
            >
              <View style={styles.codeHeader}>
                <Text style={styles.codeName}>{promo.code}</Text>
                <Chip 
                  style={[styles.tierChip, { backgroundColor: colors[promo.tier === 'elite' ? 'tierElite' : promo.tier === 'pro' ? 'tierPro' : 'tierBasic'] + '20' }]}
                  textStyle={{ color: colors[promo.tier === 'elite' ? 'tierElite' : promo.tier === 'pro' ? 'tierPro' : 'tierBasic'] }}
                >
                  {promo.tier.toUpperCase()}
                </Chip>
              </View>
              
              <View style={styles.codeDetails}>
                <View style={styles.codeDetail}>
                  <IconButton icon="percent" size={16} iconColor={colors.success} style={styles.detailIcon} />
                  <Text style={styles.detailText}>{promo.discount}</Text>
                </View>
                <View style={styles.codeDetail}>
                  <IconButton icon="clock" size={16} iconColor={colors.royalBlue} style={styles.detailIcon} />
                  <Text style={styles.detailText}>{promo.duration}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Info Card */}
        <Card style={styles.infoCard}>
          <Card.Content>
            <Text style={styles.infoTitle}>💡 How Promo Codes Work</Text>
            <Text style={styles.infoText}>
              • Promo codes unlock temporary access to higher tiers{'\n'}
              • Discounts apply to your first billing cycle{'\n'}
              • Codes can only be used once per account{'\n'}
              • Refer friends to earn more promo codes
            </Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </KeyboardAvoidingView>
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
  inputCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  input: {
    backgroundColor: colors.deepObsidian,
    marginBottom: spacing.sm,
  },
  resultText: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: spacing.sm,
  },
  applyButton: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.sm,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.softWhite,
    marginBottom: spacing.md,
  },
  codesList: {
    gap: spacing.md,
    marginBottom: spacing.md,
  },
  codeCard: {
    backgroundColor: colors.midnightNavy,
    borderRadius: borderRadius.lg,
    padding: spacing.lg,
    borderWidth: 1,
    borderColor: colors.border,
    ...shadows.sm,
  },
  codeCardSelected: {
    borderColor: colors.royalBlue,
    backgroundColor: colors.royalBlue + '10',
  },
  codeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.sm,
  },
  codeName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.softWhite,
    letterSpacing: 1,
  },
  tierChip: {
    borderRadius: borderRadius.full,
  },
  codeDetails: {
    flexDirection: 'row',
    gap: spacing.lg,
  },
  codeDetail: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailIcon: {
    margin: 0,
    marginRight: spacing.xs,
  },
  detailText: {
    fontSize: 14,
    color: colors.textSecondary,
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
    lineHeight: 22,
  },
});
