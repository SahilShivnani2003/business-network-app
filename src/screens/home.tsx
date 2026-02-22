import React, { useRef, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Dimensions,
  FlatList,
  ImageBackground,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/header';
import { Card, PrimaryButton, StatCard, SectionHeader } from '../components/UIComponent';
import { Colors, Spacing, Radius, Typography, Shadow } from '../theme/theme';

const { width } = Dimensions.get('window');

const TESTIMONIALS = [
  {
    name: 'Rajesh Sharma',
    business: 'TechVision Solutions',
    city: 'Mumbai',
    text: 'iNext ETS helped me close 3 deals in just 2 months. The network is truly powerful!',
    avatar: 'RS',
    rating: 5,
  },
  {
    name: 'Priya Patel',
    business: 'GreenLeaf Exports',
    city: 'Ahmedabad',
    text: 'The events are world-class. I met my top business partner here.',
    avatar: 'PP',
    rating: 5,
  },
  {
    name: 'Vikram Joshi',
    business: 'AutoEdge Motors',
    city: 'Pune',
    text: 'Best investment I made for my business this year. Highly recommended!',
    avatar: 'VJ',
    rating: 5,
  },
];

const FEATURED_MEMBERS = [
  { name: 'Amit Kumar', biz: 'BuildRight Infra', city: 'Delhi', cat: 'Construction', avatar: 'AK', premium: true, verified: true },
  { name: 'Sneha Mehta', biz: 'FashionForward', city: 'Surat', cat: 'Fashion', avatar: 'SM', premium: true, verified: true },
  { name: 'Deepika Rao', biz: 'HealthFirst', city: 'Bangalore', cat: 'Healthcare', avatar: 'DR', premium: false, verified: true },
  { name: 'Ravi Gupta', biz: 'EduTech Hub', city: 'Hyderabad', cat: 'Education', avatar: 'RG', premium: true, verified: false },
];

const UPCOMING_EVENTS = [
  { title: 'Mega Networking Summit', date: 'Mar 15', type: 'Offline', city: 'Mumbai', emoji: '🏢', spots: 23 },
  { title: 'Digital Growth Masterclass', date: 'Mar 22', type: 'Online', city: 'Virtual', emoji: '💻', spots: 89 },
  { title: 'Export Business Conclave', date: 'Apr 5', type: 'Offline', city: 'Ahmedabad', emoji: '🌐', spots: 12 },
];

const AvatarCircle = ({ initials, size = 50, color = Colors.bluePrimary }) => (
  <LinearGradient
    colors={[color, Colors.blueLight]}
    style={[styles.avatarCircle, { width: size, height: size, borderRadius: size / 2 }]}
  >
    <Text style={[styles.avatarText, { fontSize: size * 0.36 }]}>{initials}</Text>
  </LinearGradient>
);

const TestimonialCard = ({ item }:any) => (
  <Card style={styles.testimonialCard}>
    <View style={styles.starsRow}>
      {Array(item.rating).fill(0).map((_, i) => (
        <Text key={i} style={styles.star}>★</Text>
      ))}
    </View>
    <Text style={styles.testimonialText}>"{item.text}"</Text>
    <View style={styles.testimonialAuthor}>
      <AvatarCircle initials={item.avatar} size={40} color={Colors.blueMid} />
      <View style={{ marginLeft: 10 }}>
        <Text style={styles.authorName}>{item.name}</Text>
        <Text style={styles.authorBiz}>{item.business} • {item.city}</Text>
      </View>
    </View>
  </Card>
);

const HomeScreen = ({ navigation }:any) => {
  const heroAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(40)).current;
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    Animated.parallel([
      Animated.timing(heroAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View style={styles.container}>
      <Header showLogo navigation={navigation} />
      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ── HERO SECTION ─────────────────────────────────────── */}
        <LinearGradient
          colors={['#0A2A5C', '#1565C0', '#1976D2']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          {/* Decorative circles */}
          <View style={styles.heroBubble1} />
          <View style={styles.heroBubble2} />

          <Animated.View
            style={[
              styles.heroContent,
              {
                opacity: heroAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <View style={styles.heroBadge}>
              <Text style={styles.heroBadgeText}>🌐 Business Network Platform</Text>
            </View>
            <Text style={styles.heroTitle}>One Community.{'\n'}Unlimited Business{'\n'}Growth.</Text>
            <Text style={styles.heroSubtitle}>
              Connect · Collaborate · Close Deals
            </Text>
            <View style={styles.heroStats}>
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatNum}>5,000+</Text>
                <Text style={styles.heroStatLabel}>Members</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatNum}>120+</Text>
                <Text style={styles.heroStatLabel}>Cities</Text>
              </View>
              <View style={styles.heroStatDivider} />
              <View style={styles.heroStatItem}>
                <Text style={styles.heroStatNum}>₹50Cr+</Text>
                <Text style={styles.heroStatLabel}>Deals Closed</Text>
              </View>
            </View>
            <View style={styles.heroCTA}>
              <PrimaryButton
                title="Join Now →"
                onPress={() => navigation.navigate('Apply')}
                style={{ flex: 1 }}
              />
              <TouchableOpacity
                style={styles.heroSecondaryBtn}
                onPress={() => navigation.navigate('Members')}
                activeOpacity={0.8}
              >
                <Text style={styles.heroSecondaryText}>Browse Members</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </LinearGradient>

        {/* ── STATS ROW ─────────────────────────────────────────── */}
        <View style={styles.statsRow}>
          <StatCard value="5K+" label="Members" icon="👥" color={Colors.bluePrimary} />
          <StatCard value="200+" label="Events" icon="🎪" color={Colors.orange} />
          <StatCard value="120+" label="Cities" icon="🌆" color="#7C3AED" />
          <StatCard value="98%" label="Satisfaction" icon="⭐" color={Colors.success} />
        </View>

        {/* ── FEATURED MEMBERS ──────────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader
            title="Featured Members"
            subtitle="Top verified businesses"
            actionLabel="View All"
            onAction={() => navigation.navigate('Members')}
          />
          <FlatList
            data={FEATURED_MEMBERS}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.membersList}
            keyExtractor={(item, i) => i.toString()}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.memberCard}
                activeOpacity={0.88}
                onPress={() => navigation.navigate('Members')}
              >
                <View style={styles.memberCardTop}>
                  <AvatarCircle initials={item.avatar} size={56} color={Colors.bluePrimary} />
                  {item.premium && (
                    <View style={styles.memberPremiumBadge}>
                      <Text style={styles.memberPremiumText}>★</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.memberName}>{item.name}</Text>
                <Text style={styles.memberBiz}>{item.biz}</Text>
                <View style={styles.memberMeta}>
                  <Text style={styles.memberCity}>📍 {item.city}</Text>
                </View>
                <View style={styles.memberCatBadge}>
                  <Text style={styles.memberCatText}>{item.cat}</Text>
                </View>
                {item.verified && (
                  <View style={styles.memberVerified}>
                    <Text style={styles.memberVerifiedText}>✓</Text>
                  </View>
                )}
              </TouchableOpacity>
            )}
          />
        </View>

        {/* ── UPCOMING EVENTS ───────────────────────────────────── */}
        <View style={[styles.section, styles.sectionBlue]}>
          <SectionHeader
            title="Upcoming Events"
            subtitle="Don't miss out"
            actionLabel="All Events"
            onAction={() => navigation.navigate('Events')}
          />
          {UPCOMING_EVENTS.map((event, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.eventCard}
              activeOpacity={0.88}
              onPress={() => navigation.navigate('Events')}
            >
              <View style={styles.eventEmoji}>
                <Text style={{ fontSize: 28 }}>{event.emoji}</Text>
              </View>
              <View style={styles.eventInfo}>
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventMeta}>📅 {event.date} • 📍 {event.city}</Text>
              </View>
              <View style={styles.eventRight}>
                <View
                  style={[
                    styles.eventTypeBadge,
                    { backgroundColor: event.type === 'Online' ? '#DCFCE7' : '#EFF6FF' },
                  ]}
                >
                  <Text
                    style={[
                      styles.eventTypeText,
                      { color: event.type === 'Online' ? Colors.success : Colors.bluePrimary },
                    ]}
                  >
                    {event.type}
                  </Text>
                </View>
                <Text style={styles.eventSpots}>{event.spots} left</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── TESTIMONIALS ──────────────────────────────────────── */}
        <View style={styles.section}>
          <SectionHeader title="What Members Say" subtitle="Real stories, real growth" />
          <FlatList
            data={TESTIMONIALS}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.testimonialList}
            keyExtractor={(item, i) => i.toString()}
            renderItem={({ item }) => <TestimonialCard item={item} />}
          />
        </View>

        {/* ── MEMBERSHIP CTA BANNER ─────────────────────────────── */}
        <LinearGradient
          colors={[Colors.orange, '#E65100']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.ctaBanner}
        >
          <Text style={styles.ctaTitle}>Ready to Grow?</Text>
          <Text style={styles.ctaSubtitle}>
            Join 5,000+ business leaders already in the network
          </Text>
          <TouchableOpacity
            style={styles.ctaBtn}
            onPress={() => navigation.navigate('Plans')}
            activeOpacity={0.85}
          >
            <Text style={styles.ctaBtnText}>View Membership Plans →</Text>
          </TouchableOpacity>
        </LinearGradient>

        <View style={{ height: 32 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },
  scroll: { flex: 1 },
  scrollContent: { paddingBottom: 20 },

  // Hero
  hero: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.xxl,
    overflow: 'hidden',
    position: 'relative',
  },
  heroBubble1: {
    position: 'absolute',
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -60,
    right: -40,
  },
  heroBubble2: {
    position: 'absolute',
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: 'rgba(255,255,255,0.04)',
    bottom: 20,
    left: -30,
  },
  heroContent: { gap: 16 },
  heroBadge: {
    backgroundColor: 'rgba(255,152,0,0.25)',
    alignSelf: 'flex-start',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: 'rgba(255,152,0,0.4)',
  },
  heroBadgeText: { color: Colors.orangeGlow, fontSize: Typography.sm, fontWeight: '600' },
  heroTitle: {
    color: Colors.white,
    fontSize: Typography.xxxl,
    fontWeight: '900',
    lineHeight: 46,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: Typography.md,
    fontWeight: '500',
    letterSpacing: 1,
  },
  heroStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  heroStatItem: { alignItems: 'center' },
  heroStatNum: { color: Colors.orangeGlow, fontSize: Typography.xl, fontWeight: '900' },
  heroStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: Typography.xs, marginTop: 2 },
  heroStatDivider: { width: 1, height: 36, backgroundColor: 'rgba(255,255,255,0.2)' },
  heroCTA: { flexDirection: 'row', gap: 12, alignItems: 'center' },
  heroSecondaryBtn: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: Radius.lg,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
    alignItems: 'center',
  },
  heroSecondaryText: { color: Colors.white, fontSize: Typography.base, fontWeight: '600' },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    marginTop: -20,
    marginBottom: Spacing.md,
  },

  // Sections
  section: { paddingVertical: Spacing.lg },
  sectionBlue: { backgroundColor: Colors.bluePale, paddingHorizontal: Spacing.md },

  // Members
  membersList: { paddingHorizontal: Spacing.md, gap: 12 },
  memberCard: {
    width: 148,
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
    ...Shadow.card,
  },
  memberCardTop: { position: 'relative', marginBottom: 8 },
  memberPremiumBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    backgroundColor: Colors.orange,
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  memberPremiumText: { color: Colors.white, fontSize: 10, fontWeight: '800' },
  memberName: { fontSize: Typography.sm, fontWeight: '700', color: Colors.dark, textAlign: 'center' },
  memberBiz: { fontSize: 11, color: Colors.gray, textAlign: 'center', marginTop: 2 },
  memberMeta: { marginTop: 4 },
  memberCity: { fontSize: 11, color: Colors.gray },
  memberCatBadge: {
    marginTop: 8,
    backgroundColor: Colors.bluePale,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radius.full,
  },
  memberCatText: { color: Colors.bluePrimary, fontSize: 10, fontWeight: '600' },
  memberVerified: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: Colors.verified,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  memberVerifiedText: { color: Colors.white, fontSize: 9, fontWeight: '800' },

  // Events
  eventCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: Radius.md,
    padding: Spacing.md,
    marginBottom: 10,
    alignItems: 'center',
    gap: 12,
    ...Shadow.card,
  },
  eventEmoji: {
    width: 56,
    height: 56,
    borderRadius: Radius.md,
    backgroundColor: Colors.bluePale,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventInfo: { flex: 1 },
  eventTitle: { fontSize: Typography.base, fontWeight: '700', color: Colors.dark },
  eventMeta: { fontSize: 12, color: Colors.gray, marginTop: 4 },
  eventRight: { alignItems: 'flex-end', gap: 4 },
  eventTypeBadge: { paddingHorizontal: 9, paddingVertical: 4, borderRadius: Radius.full },
  eventTypeText: { fontSize: 11, fontWeight: '600' },
  eventSpots: { fontSize: 11, color: Colors.orange, fontWeight: '600' },

  // Testimonials
  testimonialList: { paddingHorizontal: Spacing.md, gap: 12 },
  testimonialCard: { width: width * 0.78, marginBottom: 4 },
  starsRow: { flexDirection: 'row', gap: 2, marginBottom: 8 },
  star: { color: Colors.orange, fontSize: 14 },
  testimonialText: {
    fontSize: Typography.base,
    color: Colors.grayDark,
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 12,
  },
  testimonialAuthor: { flexDirection: 'row', alignItems: 'center' },
  authorName: { fontSize: Typography.sm, fontWeight: '700', color: Colors.dark },
  authorBiz: { fontSize: 11, color: Colors.gray },

  // Avatar
  avatarCircle: { alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.white, fontWeight: '800' },

  // CTA Banner
  ctaBanner: {
    marginHorizontal: Spacing.md,
    borderRadius: Radius.xl,
    padding: Spacing.xl,
    alignItems: 'center',
    gap: 10,
    ...Shadow.orange,
  },
  ctaTitle: { color: Colors.white, fontSize: Typography.xxl, fontWeight: '900' },
  ctaSubtitle: { color: 'rgba(255,255,255,0.85)', fontSize: Typography.base, textAlign: 'center' },
  ctaBtn: {
    backgroundColor: Colors.white,
    paddingVertical: 13,
    paddingHorizontal: Spacing.xl,
    borderRadius: Radius.lg,
    marginTop: 6,
  },
  ctaBtnText: { color: Colors.orange, fontSize: Typography.md, fontWeight: '800' },
});

export default HomeScreen;
