import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  StatusBar, Dimensions,
} from 'react-native';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../theme/colors';
import { Avatar, Badge, Button, Card, SectionHeader, StatCard, MemberCard } from '../components';
import { MOCK_MEMBERS, MOCK_EVENTS } from '../../data/mockData';

const { width } = Dimensions.get('window');

type Props = { navigation: any };

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

      {/* Header / Hero */}
      <View style={styles.hero}>
        <View style={styles.heroTop}>
          <View>
            <Text style={styles.greeting}>Good Morning 👋</Text>
            <Text style={styles.userName}>Rahul Mehta</Text>
          </View>
          <View style={styles.heroRight}>
            <TouchableOpacity style={styles.notifBtn} onPress={() => navigation.navigate('Notifications')}>
              <Text style={styles.notifIcon}>🔔</Text>
              <View style={styles.notifBadge}><Text style={styles.notifBadgeText}>3</Text></View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
              <Avatar name="Rahul Mehta" size={42} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile strength */}
        <View style={styles.profileStrength}>
          <View style={styles.profileStrengthTop}>
            <Text style={styles.profileStrengthLabel}>Profile Strength</Text>
            <Text style={styles.profileStrengthPct}>72%</Text>
          </View>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: '72%' }]} />
          </View>
          <Text style={styles.profileStrengthTip}>Add your website to reach 85% 🎯</Text>
        </View>
      </View>

      <View style={styles.body}>
        {/* Stats row */}
        <View style={styles.statsRow}>
          <StatCard value="12" label="Leads" icon="🎯" color={Colors.accent} />
          <StatCard value="48" label="Connections" icon="🤝" color={Colors.primary} />
          <StatCard value="5" label="Events" icon="📅" color={Colors.success} />
          <StatCard value="3" label="Referrals" icon="⭐" color={Colors.premium} />
        </View>

        {/* Quick Actions */}
        <SectionHeader title="Quick Actions" />
        <View style={styles.quickGrid}>
          {QUICK_ACTIONS.map((action) => (
            <TouchableOpacity
              key={action.label}
              style={[styles.quickAction, { backgroundColor: `${action.color}12`, borderColor: `${action.color}25` }]}
              onPress={() => navigation.navigate(action.screen)}
              activeOpacity={0.8}
            >
              <Text style={styles.quickActionIcon}>{action.icon}</Text>
              <Text style={[styles.quickActionLabel, { color: action.color }]}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Leads Summary */}
        <Card style={styles.leadsBanner}>
          <View style={styles.leadsBannerContent}>
            <View style={{ flex: 1 }}>
              <Badge label="PREMIUM LEADS" color={Colors.accent} size="sm" />
              <Text style={styles.leadsBannerTitle}>3 new leads{'\n'}in your industry</Text>
              <Button label="View Leads →" onPress={() => navigation.navigate('Leads')} variant="accent" size="sm" style={{ marginTop: 12, alignSelf: 'flex-start' }} />
            </View>
            <Text style={{ fontSize: 64 }}>🎯</Text>
          </View>
        </Card>

        {/* Connection Requests */}
        <SectionHeader title="New Requests" actionLabel="View All" onAction={() => navigation.navigate('Network')} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.horizontalScroll}>
          {MOCK_MEMBERS.slice(0, 4).map(member => (
            <View key={member.id} style={styles.requestCard}>
              <Avatar name={member.name} size={52} />
              {member.isVerified && <View style={styles.verifiedDot} />}
              <Text style={styles.requestName} numberOfLines={1}>{member.name.split(' ')[0]}</Text>
              <Text style={styles.requestCompany} numberOfLines={1}>{member.company.split(' ')[0]}</Text>
              <View style={styles.requestActions}>
                <TouchableOpacity style={[styles.requestBtn, { backgroundColor: Colors.primary }]}>
                  <Text style={styles.requestBtnText}>✓</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.requestBtn, { backgroundColor: Colors.border }]}>
                  <Text style={[styles.requestBtnText, { color: Colors.textSecondary }]}>✕</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Upcoming Events */}
        <SectionHeader title="Upcoming Events" actionLabel="View All" onAction={() => navigation.navigate('Events')} />
        {MOCK_EVENTS.slice(0, 2).map(event => (
          <Card key={event.id} style={styles.eventCard} onPress={() => {}}>
            <View style={styles.eventTypeRow}>
              <Badge label={event.type === 'online' ? '🌐 Online' : '📍 Offline'} color={event.type === 'online' ? Colors.primary : Colors.accent} size="sm" />
              <Text style={styles.eventDate}>{event.date}</Text>
            </View>
            <Text style={styles.eventTitle}>{event.title}</Text>
            <View style={styles.eventMeta}>
              <Text style={styles.eventMetaText}>🕐 {event.time}</Text>
              <Text style={styles.eventMetaText}>📍 {event.location}</Text>
              <Text style={styles.eventMetaText}>👥 {event.attendees} going</Text>
            </View>
            <Button label="Register →" onPress={() => {}} variant="outline" size="sm" style={{ alignSelf: 'flex-start', marginTop: 10 }} />
          </Card>
        ))}

        {/* AI Recommended */}
        <SectionHeader title="🤖 AI Recommended" actionLabel="See All" onAction={() => navigation.navigate('AIMatch')} />
        <Text style={styles.aiSubtitle}>Based on your industry and activity</Text>
        {MOCK_MEMBERS.slice(0, 3).map(member => (
          <MemberCard key={member.id} member={member} onPress={() => navigation.navigate('MemberProfile', { memberId: member.id })} onConnect={() => {}} />
        ))}

        {/* Community Help */}
        <Card style={styles.communityBanner} onPress={() => navigation.navigate('CommunityHelp')}>
          <Text style={styles.communityIcon}>🌍</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.communityTitle}>Community Help Board</Text>
            <Text style={styles.communitySub}>Post your business needs • Get community support</Text>
          </View>
          <Text style={styles.communityArrow}>→</Text>
        </Card>
      </View>
    </ScrollView>
  );
};

const QUICK_ACTIONS = [
  { label: 'Find Clients', icon: '🔍', color: Colors.primary, screen: 'Network' },
  { label: 'Post Help', icon: '📢', color: Colors.accent, screen: 'CommunityHelp' },
  { label: 'Join Group', icon: '💬', color: Colors.success, screen: 'WhatsAppGroups' },
  { label: 'Events', icon: '🎪', color: Colors.premium, screen: 'Events' },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  hero: { backgroundColor: Colors.primaryDark, paddingHorizontal: 20, paddingTop: 52, paddingBottom: 28 },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  greeting: { fontSize: FontSize.md, color: `${Colors.white}80` },
  userName: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.white },
  heroRight: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  notifBtn: { position: 'relative' },
  notifIcon: { fontSize: 24 },
  notifBadge: { position: 'absolute', top: -4, right: -4, backgroundColor: Colors.accent, width: 16, height: 16, borderRadius: 8, alignItems: 'center', justifyContent: 'center' },
  notifBadgeText: { color: Colors.white, fontSize: 9, fontWeight: '800' },
  profileStrength: { backgroundColor: `${Colors.white}12`, borderRadius: BorderRadius.md, padding: 14 },
  profileStrengthTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  profileStrengthLabel: { color: `${Colors.white}80`, fontSize: FontSize.sm },
  profileStrengthPct: { color: Colors.accent, fontSize: FontSize.sm, fontWeight: '800' },
  progressBar: { height: 6, backgroundColor: `${Colors.white}20`, borderRadius: 3, marginBottom: 8 },
  progressFill: { height: 6, backgroundColor: Colors.accent, borderRadius: 3 },
  profileStrengthTip: { color: `${Colors.white}60`, fontSize: 11 },
  body: { padding: 16 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 4 },
  quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 },
  quickAction: { width: (width - 56) / 2, borderRadius: BorderRadius.lg, paddingVertical: 16, alignItems: 'center', borderWidth: 1 },
  quickActionIcon: { fontSize: 28, marginBottom: 6 },
  quickActionLabel: { fontSize: FontSize.sm, fontWeight: '700' },
  leadsBanner: { backgroundColor: Colors.surface, overflow: 'hidden', marginBottom: 8 },
  leadsBannerContent: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  leadsBannerTitle: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.textPrimary, marginTop: 6, lineHeight: 28 },
  horizontalScroll: { marginLeft: -4, marginBottom: Spacing.md },
  requestCard: { width: 100, alignItems: 'center', marginRight: 12, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: 12, ...Shadow.card, position: 'relative' },
  verifiedDot: { position: 'absolute', top: 12, right: 12, width: 10, height: 10, borderRadius: 5, backgroundColor: Colors.primary, borderWidth: 1.5, borderColor: Colors.white },
  requestName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary, marginTop: 8, textAlign: 'center' },
  requestCompany: { fontSize: 10, color: Colors.textMuted, marginTop: 2, textAlign: 'center' },
  requestActions: { flexDirection: 'row', gap: 6, marginTop: 10 },
  requestBtn: { width: 28, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  requestBtnText: { color: Colors.white, fontSize: 12, fontWeight: '900' },
  eventCard: { marginBottom: 12 },
  eventTypeRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  eventDate: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  eventTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary, marginBottom: 10 },
  eventMeta: { gap: 4 },
  eventMetaText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  aiSubtitle: { fontSize: FontSize.sm, color: Colors.textMuted, marginBottom: 12, marginTop: -8 },
  communityBanner: { flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: `${Colors.primary}08`, borderWidth: 1, borderColor: `${Colors.primary}20` },
  communityIcon: { fontSize: 32 },
  communityTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.textPrimary },
  communitySub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  communityArrow: { fontSize: 20, color: Colors.primary },
});

export default HomeScreen;
