import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Animated,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/header';
import { PrimaryButton } from '../components/UIComponent';
import { Colors, Spacing, Typography, Radius, Shadow } from '../theme/theme';

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    subtitle: 'Begin your journey',
    monthlyPrice: 999,
    yearlyPrice: 9990,
    color: Colors.gray,
    gradients: ['#475569', '#64748B'],
    emoji: '🌱',
    popular: false,
    features: [
      { label: 'Business Profile', included: true },
      { label: 'Directory Listing', included: true },
      { label: '2 Events per Year', included: true },
      { label: 'Newsletter Access', included: true },
      { label: 'Community Forum', included: true },
      { label: 'Verified Badge', included: false },
      { label: 'Lead Generation', included: false },
      { label: 'WhatsApp Group', included: false },
      { label: 'Priority Listing', included: false },
      { label: 'Mentorship', included: false },
    ],
  },
  {
    id: 'growth',
    name: 'Growth',
    subtitle: 'Scale with confidence',
    monthlyPrice: 2499,
    yearlyPrice: 24990,
    color: Colors.bluePrimary,
    gradients: ['#0D3E82', '#1976D2'],
    emoji: '📈',
    popular: false,
    features: [
      { label: 'Business Profile', included: true },
      { label: 'Directory Listing', included: true },
      { label: '5 Events per Year', included: true },
      { label: 'Newsletter Access', included: true },
      { label: 'Community Forum', included: true },
      { label: 'Verified Badge', included: true },
      { label: 'Lead Generation', included: false },
      { label: 'WhatsApp Group', included: true },
      { label: 'Priority Listing', included: false },
      { label: 'Mentorship', included: false },
    ],
  },
  {
    id: 'scale',
    name: 'Scale',
    subtitle: 'For serious networkers',
    monthlyPrice: 4999,
    yearlyPrice: 49990,
    color: Colors.orange,
    gradients: ['#E65100', '#F57C00'],
    emoji: '🚀',
    popular: true,
    features: [
      { label: 'Business Profile', included: true },
      { label: 'Directory Listing', included: true },
      { label: 'Unlimited Events', included: true },
      { label: 'Newsletter Access', included: true },
      { label: 'Community Forum', included: true },
      { label: 'Verified Badge', included: true },
      { label: 'Lead Generation', included: true },
      { label: 'WhatsApp Group', included: true },
      { label: 'Priority Listing', included: true },
      { label: 'Mentorship', included: false },
    ],
  },
  {
    id: 'elite',
    name: 'Elite',
    subtitle: 'Top tier access',
    monthlyPrice: 9999,
    yearlyPrice: 99990,
    color: '#7C3AED',
    gradients: ['#4C1D95', '#7C3AED'],
    emoji: '👑',
    popular: false,
    features: [
      { label: 'Business Profile', included: true },
      { label: 'Directory Listing', included: true },
      { label: 'Unlimited Events', included: true },
      { label: 'Newsletter Access', included: true },
      { label: 'Community Forum', included: true },
      { label: 'Verified Badge', included: true },
      { label: 'Lead Generation', included: true },
      { label: 'WhatsApp Group', included: true },
      { label: 'Priority Listing', included: true },
      { label: 'Mentorship', included: true },
    ],
  },
  {
    id: 'lifetime',
    name: 'Lifetime',
    subtitle: 'Own it forever',
    monthlyPrice: 49999,
    yearlyPrice: 49999,
    color: '#DC2626',
    gradients: ['#7F1D1D', '#DC2626'],
    emoji: '♾️',
    popular: false,
    isLifetime: true,
    features: [
      { label: 'Everything in Elite', included: true },
      { label: 'Lifetime Access', included: true },
      { label: 'Founding Member Badge', included: true },
      { label: 'Revenue Share Program', included: true },
      { label: 'Board Advisory', included: true },
      { label: 'Legacy Recognition', included: true },
      { label: 'Custom Mentorship', included: true },
      { label: 'Priority Support 24/7', included: true },
      { label: 'Event Speaking Slot', included: true },
      { label: 'Homepage Feature', included: true },
    ],
  },
];

const COMPARE_FEATURES = ['Events', 'Lead Gen', 'Verified Badge', 'WhatsApp', 'Priority List', 'Mentorship'];
const PLAN_FEATURE_MAP = {
  starter: ['2/yr', '✗', '✗', '✗', '✗', '✗'],
  growth: ['5/yr', '✗', '✓', '✓', '✗', '✗'],
  scale: ['∞', '✓', '✓', '✓', '✓', '✗'],
  elite: ['∞', '✓', '✓', '✓', '✓', '✓'],
  lifetime: ['∞', '✓', '✓', '✓', '✓', '✓'],
};

const PlansScreen = ({ navigation }) => {
  const [isYearly, setIsYearly] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getPrice = (plan) => {
    if (plan.isLifetime) return plan.monthlyPrice;
    return isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  };

  const getSavings = (plan) => {
    if (plan.isLifetime) return null;
    const yearly = plan.yearlyPrice;
    const monthly12 = plan.monthlyPrice * 12;
    return Math.round(((monthly12 - yearly) / monthly12) * 100);
  };

  return (
    <View style={styles.container}>
      <Header title="Plans & Pricing" subtitle="Choose your growth path" navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Header Banner ──────────────────────────────── */}
        <LinearGradient colors={['#0A2A5C', '#1565C0']} style={styles.banner}>
          <Text style={styles.bannerTitle}>Invest in Your{'\n'}Business Growth</Text>
          <Text style={styles.bannerSub}>All plans include GST invoice & cancellation policy</Text>
        </LinearGradient>

        {/* ── Toggle ─────────────────────────────────────── */}
        <View style={styles.toggleWrapper}>
          <View style={styles.toggle}>
            <TouchableOpacity
              style={[styles.toggleOption, !isYearly && styles.toggleOptionActive]}
              onPress={() => setIsYearly(false)}
            >
              <Text style={[styles.toggleText, !isYearly && styles.toggleTextActive]}>Monthly</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.toggleOption, isYearly && styles.toggleOptionActiveYearly]}
              onPress={() => setIsYearly(true)}
            >
              <Text style={[styles.toggleText, isYearly && styles.toggleTextActiveYearly]}>
                Yearly
              </Text>
              {isYearly ? null : (
                <View style={styles.saveBadge}>
                  <Text style={styles.saveBadgeText}>Save 17%</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>

        {/* ── Plan Cards ─────────────────────────────────── */}
        <View style={styles.plansGrid}>
          {PLANS.map(plan => (
            <TouchableOpacity
              key={plan.id}
              onPress={() => { setSelectedPlan(plan); setShowModal(true); }}
              activeOpacity={0.9}
            >
              <View style={[styles.planCard, plan.popular && styles.planCardPopular]}>
                {plan.popular && (
                  <LinearGradient colors={[Colors.orange, Colors.orangeLight]} style={styles.popularBanner}>
                    <Text style={styles.popularText}>🔥 MOST POPULAR</Text>
                  </LinearGradient>
                )}

                <LinearGradient colors={plan.gradients} style={styles.planHeader}>
                  <Text style={styles.planEmoji}>{plan.emoji}</Text>
                  <View>
                    <Text style={styles.planName}>{plan.name}</Text>
                    <Text style={styles.planSubtitle}>{plan.subtitle}</Text>
                  </View>
                  {isYearly && !plan.isLifetime && getSavings(plan) > 0 && (
                    <View style={styles.planSaveBadge}>
                      <Text style={styles.planSaveBadgeText}>-{getSavings(plan)}%</Text>
                    </View>
                  )}
                </LinearGradient>

                <View style={styles.planBody}>
                  <View style={styles.priceRow}>
                    <Text style={styles.currency}>₹</Text>
                    <Text style={[styles.price, { color: plan.color }]}>
                      {getPrice(plan).toLocaleString()}
                    </Text>
                    <Text style={styles.period}>
                      {plan.isLifetime ? ' one-time' : isYearly ? '/yr' : '/mo'}
                    </Text>
                  </View>

                  {isYearly && !plan.isLifetime && (
                    <Text style={styles.perMonthNote}>
                      ₹{Math.round(plan.yearlyPrice / 12).toLocaleString()}/mo billed yearly
                    </Text>
                  )}

                  <View style={styles.featureList}>
                    {plan.features.slice(0, 6).map((feat, i) => (
                      <View key={i} style={styles.featureItem}>
                        <View style={[styles.featureIcon, !feat.included && styles.featureIconNo]}>
                          <Text style={styles.featureIconText}>
                            {feat.included ? '✓' : '✗'}
                          </Text>
                        </View>
                        <Text style={[styles.featureText, !feat.included && styles.featureTextNo]}>
                          {feat.label}
                        </Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity
                    onPress={() => { setSelectedPlan(plan); setShowModal(true); }}
                    activeOpacity={0.85}
                  >
                    <LinearGradient
                      colors={plan.gradients}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 0 }}
                      style={styles.planBtn}
                    >
                      <Text style={styles.planBtnText}>Choose {plan.name} →</Text>
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Compare Table ──────────────────────────────── */}
        <View style={styles.compareSection}>
          <Text style={styles.compareSectionTitle}>Feature Comparison</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View>
              {/* Header row */}
              <View style={styles.compareHeaderRow}>
                <View style={styles.compareFeatureCol}><Text style={styles.compareHeaderText}>Feature</Text></View>
                {PLANS.slice(0, 4).map(p => (
                  <View key={p.id} style={styles.comparePlanCol}>
                    <LinearGradient colors={p.gradients} style={styles.comparePlanBadge}>
                      <Text style={styles.comparePlanName}>{p.name}</Text>
                    </LinearGradient>
                  </View>
                ))}
              </View>

              {COMPARE_FEATURES.map((feat, i) => (
                <View key={i} style={[styles.compareRow, i % 2 === 0 && styles.compareRowAlt]}>
                  <View style={styles.compareFeatureCol}>
                    <Text style={styles.compareFeatureText}>{feat}</Text>
                  </View>
                  {Object.values(PLAN_FEATURE_MAP).slice(0, 4).map((vals, j) => (
                    <View key={j} style={styles.comparePlanCol}>
                      <Text style={[
                        styles.compareValue,
                        vals[i] === '✓' && styles.compareValueYes,
                        vals[i] === '✗' && styles.compareValueNo,
                      ]}>
                        {vals[i]}
                      </Text>
                    </View>
                  ))}
                </View>
              ))}
            </View>
          </ScrollView>
        </View>

        {/* ── GST Note ───────────────────────────────────── */}
        <View style={styles.gstNote}>
          <Text style={styles.gstNoteText}>
            🧾 GST invoice will be generated automatically upon payment. All prices exclusive of GST (18%).
          </Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      {/* ── Plan Detail Modal ──────────────────────────── */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <View style={styles.modalHandle} />
            {selectedPlan && (
              <>
                <LinearGradient colors={selectedPlan.gradients} style={styles.modalHeader}>
                  <Text style={{ fontSize: 36 }}>{selectedPlan.emoji}</Text>
                  <View>
                    <Text style={styles.modalTitle}>{selectedPlan.name} Plan</Text>
                    <Text style={styles.modalSubtitle}>{selectedPlan.subtitle}</Text>
                  </View>
                </LinearGradient>

                <ScrollView style={{ maxHeight: 360 }}>
                  <View style={styles.modalBody}>
                    <View style={styles.modalPriceRow}>
                      <Text style={styles.modalPrice}>
                        ₹{getPrice(selectedPlan).toLocaleString()}
                        <Text style={styles.modalPeriod}>
                          {selectedPlan.isLifetime ? ' one-time' : isYearly ? '/yr' : '/mo'}
                        </Text>
                      </Text>
                      <Text style={styles.modalPriceNote}>+ 18% GST</Text>
                    </View>

                    <Text style={styles.modalFeaturesTitle}>All Features Included:</Text>
                    {selectedPlan.features.map((feat, i) => (
                      <View key={i} style={styles.modalFeatureItem}>
                        <View style={[styles.featureIcon, !feat.included && styles.featureIconNo]}>
                          <Text style={styles.featureIconText}>{feat.included ? '✓' : '✗'}</Text>
                        </View>
                        <Text style={[styles.modalFeatureText, !feat.included && styles.featureTextNo]}>
                          {feat.label}
                        </Text>
                      </View>
                    ))}
                  </View>
                </ScrollView>

                <View style={styles.modalFooter}>
                  <PrimaryButton
                    title={`Apply for ${selectedPlan.name} →`}
                    onPress={() => { setShowModal(false); navigation.navigate('Apply'); }}
                  />
                  <TouchableOpacity style={{ marginTop: 10 }} onPress={() => setShowModal(false)}>
                    <Text style={styles.cancelText}>Maybe Later</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },

  banner: { padding: Spacing.xl, paddingBottom: Spacing.xxl },
  bannerTitle: { color: Colors.white, fontSize: Typography.xxl, fontWeight: '900', lineHeight: 38 },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: Typography.sm, marginTop: 8 },

  // Toggle
  toggleWrapper: {
    paddingHorizontal: Spacing.md,
    marginTop: -16,
    marginBottom: Spacing.md,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.full,
    padding: 4,
    ...Shadow.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  toggleOption: {
    flex: 1,
    paddingVertical: 11,
    alignItems: 'center',
    borderRadius: Radius.full,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  toggleOptionActive: { backgroundColor: Colors.bluePrimary },
  toggleOptionActiveYearly: { backgroundColor: Colors.orange },
  toggleText: { color: Colors.gray, fontSize: Typography.base, fontWeight: '600' },
  toggleTextActive: { color: Colors.white },
  toggleTextActiveYearly: { color: Colors.white },
  saveBadge: { backgroundColor: '#DCFCE7', paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.full },
  saveBadgeText: { color: Colors.success, fontSize: 10, fontWeight: '700' },

  // Plan Cards
  plansGrid: { paddingHorizontal: Spacing.md, gap: 16 },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  planCardPopular: {
    borderWidth: 2,
    borderColor: Colors.orange,
    ...Shadow.orange,
  },
  popularBanner: { paddingVertical: 8, alignItems: 'center' },
  popularText: { color: Colors.white, fontSize: Typography.sm, fontWeight: '800', letterSpacing: 0.5 },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    padding: Spacing.lg,
    position: 'relative',
  },
  planEmoji: { fontSize: 32 },
  planName: { color: Colors.white, fontSize: Typography.lg, fontWeight: '900' },
  planSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: Typography.sm },
  planSaveBadge: {
    position: 'absolute',
    right: Spacing.md,
    top: Spacing.md,
    backgroundColor: '#DCFCE7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  planSaveBadgeText: { color: Colors.success, fontSize: 11, fontWeight: '700' },
  planBody: { padding: Spacing.lg },
  priceRow: { flexDirection: 'row', alignItems: 'flex-end', marginBottom: 4 },
  currency: { fontSize: Typography.lg, color: Colors.dark, fontWeight: '700', marginBottom: 4 },
  price: { fontSize: 38, fontWeight: '900', lineHeight: 44 },
  period: { fontSize: Typography.sm, color: Colors.gray, marginBottom: 6 },
  perMonthNote: { fontSize: 12, color: Colors.gray, marginBottom: Spacing.md },
  featureList: { gap: 8, marginBottom: Spacing.md, marginTop: Spacing.sm },
  featureItem: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  featureIcon: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.bluePrimary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureIconNo: { backgroundColor: '#FEE2E2' },
  featureIconText: { color: Colors.white, fontSize: 10, fontWeight: '800' },
  featureText: { fontSize: Typography.sm, color: Colors.grayDark, fontWeight: '500' },
  featureTextNo: { color: Colors.gray },
  planBtn: { paddingVertical: 14, borderRadius: Radius.lg, alignItems: 'center' },
  planBtnText: { color: Colors.white, fontSize: Typography.base, fontWeight: '700' },

  // Compare Table
  compareSection: {
    marginTop: Spacing.lg,
    marginHorizontal: Spacing.md,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadow.card,
  },
  compareSectionTitle: {
    fontSize: Typography.lg,
    fontWeight: '800',
    color: Colors.dark,
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  compareHeaderRow: { flexDirection: 'row', borderBottomWidth: 2, borderBottomColor: Colors.border },
  compareHeaderText: { fontSize: Typography.sm, fontWeight: '700', color: Colors.gray, padding: 12 },
  compareRow: { flexDirection: 'row' },
  compareRowAlt: { backgroundColor: Colors.surface },
  compareFeatureCol: { width: 100, padding: 12, justifyContent: 'center' },
  comparePlanCol: { width: 72, padding: 10, alignItems: 'center', justifyContent: 'center' },
  comparePlanBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: Radius.full },
  comparePlanName: { color: Colors.white, fontSize: 10, fontWeight: '700' },
  compareFeatureText: { fontSize: 12, color: Colors.grayDark, fontWeight: '500' },
  compareValue: { fontSize: Typography.base, fontWeight: '700', color: Colors.gray },
  compareValueYes: { color: Colors.success },
  compareValueNo: { color: '#FCA5A5' },

  // GST Note
  gstNote: {
    margin: Spacing.md,
    backgroundColor: Colors.bluePale,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderLeftWidth: 3,
    borderLeftColor: Colors.bluePrimary,
  },
  gstNoteText: { fontSize: Typography.sm, color: Colors.grayDark, lineHeight: 20 },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    overflow: 'hidden',
    maxHeight: '85%',
  },
  modalHandle: {
    width: 40, height: 4, backgroundColor: Colors.grayLight,
    borderRadius: 2, alignSelf: 'center', marginTop: 12,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    padding: Spacing.xl,
  },
  modalTitle: { color: Colors.white, fontSize: Typography.xl, fontWeight: '800' },
  modalSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: Typography.sm },
  modalBody: { padding: Spacing.xl },
  modalPriceRow: { marginBottom: Spacing.md },
  modalPrice: { fontSize: 36, fontWeight: '900', color: Colors.dark },
  modalPeriod: { fontSize: Typography.base, fontWeight: '400', color: Colors.gray },
  modalPriceNote: { fontSize: Typography.sm, color: Colors.gray },
  modalFeaturesTitle: {
    fontSize: Typography.base,
    fontWeight: '700',
    color: Colors.grayDark,
    marginBottom: Spacing.md,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  modalFeatureItem: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 10 },
  modalFeatureText: { fontSize: Typography.base, color: Colors.grayDark },
  modalFooter: { padding: Spacing.xl, paddingTop: 0 },
  cancelText: { color: Colors.gray, fontSize: Typography.base, textAlign: 'center' },
});

export default PlansScreen;
