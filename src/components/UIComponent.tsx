import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Colors, Shadow, Spacing, Radius, Typography } from '../theme/theme';
// ─── Primary Button ───────────────────────────────────────────
export const PrimaryButton = ({ title, onPress, loading, style, small }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.85} style={style}>
    <LinearGradient
      colors={[Colors.orange, Colors.orangeLight]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.primaryBtn, small && styles.primaryBtnSmall, Shadow.orange]}
    >
      {loading ? (
        <ActivityIndicator color={Colors.white} size="small" />
      ) : (
        <Text style={[styles.primaryBtnText, small && styles.primaryBtnTextSmall]}>
          {title}
        </Text>
      )}
    </LinearGradient>
  </TouchableOpacity>
);

// ─── Secondary Button ──────────────────────────────────────────
export const SecondaryButton = ({ title, onPress, style }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    style={[styles.secondaryBtn, style]}
  >
    <Text style={styles.secondaryBtnText}>{title}</Text>
  </TouchableOpacity>
);

// ─── Outline Button ────────────────────────────────────────────
export const OutlineButton = ({ title, onPress, style, color }) => (
  <TouchableOpacity
    onPress={onPress}
    activeOpacity={0.85}
    style={[
      styles.outlineBtn,
      { borderColor: color || Colors.bluePrimary },
      style,
    ]}
  >
    <Text style={[styles.outlineBtnText, { color: color || Colors.bluePrimary }]}>
      {title}
    </Text>
  </TouchableOpacity>
);

// ─── Badge ─────────────────────────────────────────────────────
export const Badge = ({ label, color, bgColor, small }) => (
  <View
    style={[
      styles.badge,
      { backgroundColor: bgColor || Colors.bluePale },
      small && styles.badgeSmall,
    ]}
  >
    <Text style={[styles.badgeText, { color: color || Colors.bluePrimary }, small && styles.badgeTextSmall]}>
      {label}
    </Text>
  </View>
);

// ─── Verified Badge ────────────────────────────────────────────
export const VerifiedBadge = () => (
  <View style={styles.verifiedBadge}>
    <Text style={styles.verifiedText}>✓ Verified</Text>
  </View>
);

// ─── Premium Badge ─────────────────────────────────────────────
export const PremiumBadge = () => (
  <LinearGradient
    colors={[Colors.orange, Colors.orangeLight]}
    start={{ x: 0, y: 0 }}
    end={{ x: 1, y: 0 }}
    style={styles.premiumBadge}
  >
    <Text style={styles.premiumText}>★ Premium</Text>
  </LinearGradient>
);

// ─── Card ──────────────────────────────────────────────────────
export const Card = ({ children, style, onPress }) => {
  const content = (
    <View style={[styles.card, Shadow.card, style]}>{children}</View>
  );
  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.92}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
};

// ─── Section Header ────────────────────────────────────────────
export const SectionHeader = ({ title, subtitle, actionLabel, onAction }) => (
  <View style={styles.sectionHeader}>
    <View style={styles.sectionHeaderLeft}>
      <View style={styles.sectionAccent} />
      <View>
        <Text style={styles.sectionTitle}>{title}</Text>
        {subtitle ? <Text style={styles.sectionSubtitle}>{subtitle}</Text> : null}
      </View>
    </View>
    {actionLabel ? (
      <TouchableOpacity onPress={onAction} activeOpacity={0.7}>
        <Text style={styles.sectionAction}>{actionLabel} →</Text>
      </TouchableOpacity>
    ) : null}
  </View>
);

// ─── Input Field ───────────────────────────────────────────────
export const InputField = ({
  label,
  placeholder,
  value,
  onChangeText,
  multiline,
  keyboardType,
  secureTextEntry,
  leftIcon,
  error,
}:any) => (
  <View style={styles.inputWrapper}>
    {label ? <Text style={styles.inputLabel}>{label}</Text> : null}
    <View style={[styles.inputContainer, error && styles.inputError]}>
      {leftIcon ? <Text style={styles.inputIcon}>{leftIcon}</Text> : null}
      <View
        style={[styles.input, leftIcon && styles.inputWithIcon]}
      >
        <Text style={styles.inputPlaceholder}>{placeholder}</Text>
      </View>
    </View>
    {error ? <Text style={styles.errorText}>{error}</Text> : null}
  </View>
);

// ─── Divider ───────────────────────────────────────────────────
export const Divider = ({ style }) => <View style={[styles.divider, style]} />;

// ─── Stats Card ────────────────────────────────────────────────
export const StatCard = ({ value, label, icon, color }) => (
  <View style={[styles.statCard, { borderTopColor: color || Colors.orange }]}>
    <Text style={styles.statIcon}>{icon}</Text>
    <Text style={[styles.statValue, { color: color || Colors.bluePrimary }]}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ─── Empty State ───────────────────────────────────────────────
export const EmptyState = ({ icon, title, subtitle, action }) => (
  <View style={styles.emptyState}>
    <Text style={styles.emptyIcon}>{icon}</Text>
    <Text style={styles.emptyTitle}>{title}</Text>
    <Text style={styles.emptySubtitle}>{subtitle}</Text>
    {action}
  </View>
);

const styles = StyleSheet.create({
  // Buttons
  primaryBtn: {
    paddingVertical: 15,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnSmall: {
    paddingVertical: 9,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.md,
  },
  primaryBtnText: {
    color: Colors.white,
    fontSize: Typography.md,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  primaryBtnTextSmall: {
    fontSize: Typography.sm,
  },
  secondaryBtn: {
    backgroundColor: Colors.bluePrimary,
    paddingVertical: 15,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  secondaryBtnText: {
    color: Colors.white,
    fontSize: Typography.md,
    fontWeight: '700',
  },
  outlineBtn: {
    borderWidth: 2,
    paddingVertical: 13,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  outlineBtnText: {
    fontSize: Typography.md,
    fontWeight: '600',
  },

  // Badges
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  badgeSmall: {
    paddingHorizontal: 7,
    paddingVertical: 2,
  },
  badgeText: {
    fontSize: Typography.sm,
    fontWeight: '600',
  },
  badgeTextSmall: {
    fontSize: 10,
  },
  verifiedBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.verified,
  },
  verifiedText: {
    color: Colors.verified,
    fontSize: 11,
    fontWeight: '600',
  },
  premiumBadge: {
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  premiumText: {
    color: Colors.white,
    fontSize: 11,
    fontWeight: '700',
  },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },

  // Section Header
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
    paddingHorizontal: Spacing.md,
  },
  sectionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  sectionAccent: {
    width: 4,
    height: 24,
    backgroundColor: Colors.orange,
    borderRadius: Radius.full,
  },
  sectionTitle: {
    fontSize: Typography.lg,
    fontWeight: '800',
    color: Colors.dark,
    letterSpacing: 0.2,
  },
  sectionSubtitle: {
    fontSize: Typography.xs,
    color: Colors.gray,
    marginTop: 1,
  },
  sectionAction: {
    color: Colors.bluePrimary,
    fontSize: Typography.sm,
    fontWeight: '600',
  },

  // Input
  inputWrapper: {
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: Typography.sm,
    fontWeight: '600',
    color: Colors.grayDark,
    marginBottom: 6,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    backgroundColor: Colors.offWhite,
    paddingHorizontal: Spacing.md,
    minHeight: 52,
  },
  inputError: {
    borderColor: Colors.error,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: Typography.base,
    color: Colors.grayDark,
  },
  inputWithIcon: {},
  inputPlaceholder: {
    color: Colors.gray,
    fontSize: Typography.base,
  },
  errorText: {
    color: Colors.error,
    fontSize: Typography.xs,
    marginTop: 4,
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: Colors.grayLight,
    marginVertical: Spacing.md,
  },

  // Stat Card
  statCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 4,
    borderTopWidth: 3,
    ...Shadow.card,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  statValue: {
    fontSize: Typography.xl,
    fontWeight: '800',
  },
  statLabel: {
    fontSize: Typography.xs,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 2,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: Spacing.xxxl,
    paddingHorizontal: Spacing.xl,
  },
  emptyIcon: {
    fontSize: 60,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: Typography.xl,
    fontWeight: '700',
    color: Colors.dark,
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: Typography.base,
    color: Colors.gray,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
});
