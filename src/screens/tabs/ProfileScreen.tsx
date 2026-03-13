import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Colors, FontSize, BorderRadius, Shadow, Spacing } from '../../theme/colors';
import { Avatar, Badge, Button, Card, TrustScore } from '../components';

type Props = { navigation: any };

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const user = { name: 'Rahul Mehta', company: 'TechVision Solutions', industry: 'Information Technology', city: 'Mumbai', email: 'rahul@techvision.in', mobile: '+91 98765 43210', plan: 'Premium', trustScore: 88, connections: 48, leads: 12, referrals: 7, joinedAt: 'Nov 2024' };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.headerBg}>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.settingsBtn} onPress={() => navigation.navigate('Settings')}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.profileTop}>
          <View style={styles.avatarContainer}>
            <Avatar name={user.name} size={80} />
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Text style={styles.editAvatarIcon}>📷</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.profileName}>{user.name}</Text>
          <Text style={styles.profileCompany}>{user.company}</Text>
          <View style={styles.profileBadges}>
            <Badge label="✓ Verified" color={Colors.primary} bgColor={`${Colors.primary}25`} />
            <Badge label={`👑 ${user.plan}`} color={Colors.accent} bgColor={`${Colors.accent}20`} />
            <TrustScore score={user.trustScore} size="sm" />
          </View>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        <StatItem value={String(user.connections)} label="Connections" />
        <View style={styles.statDivider} />
        <StatItem value={String(user.leads)} label="Leads" />
        <View style={styles.statDivider} />
        <StatItem value={String(user.referrals)} label="Referrals" />
        <View style={styles.statDivider} />
        <StatItem value={user.joinedAt} label="Joined" />
      </View>

      <View style={styles.body}>
        {/* Profile strength */}
        <Card>
          <View style={styles.strengthHeader}>
            <Text style={styles.sectionTitle}>Profile Strength</Text>
            <Text style={styles.strengthPct}>72%</Text>
          </View>
          <View style={styles.strengthBar}>
            <View style={[styles.strengthFill, { width: '72%' }]} />
          </View>
          <Text style={styles.strengthTip}>💡 Add website & social links to reach 90%</Text>
        </Card>

        {/* Business details */}
        <Card>
          <Text style={styles.sectionTitle}>Business Details</Text>
          {[
            { icon: '🏢', label: 'Company', value: user.company },
            { icon: '💼', label: 'Industry', value: user.industry },
            { icon: '📍', label: 'City', value: user.city },
            { icon: '📧', label: 'Email', value: user.email },
            { icon: '📱', label: 'Mobile', value: user.mobile },
          ].map(row => (
            <View key={row.label} style={styles.detailRow}>
              <Text style={styles.detailIcon}>{row.icon}</Text>
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{row.label}</Text>
                <Text style={styles.detailValue}>{row.value}</Text>
              </View>
            </View>
          ))}
          <Button label="✏️ Edit Profile" onPress={() => {}} variant="outline" fullWidth size="md" style={{ marginTop: 16 }} />
        </Card>

        {/* Membership */}
        <Card style={styles.membershipCard}>
          <View style={styles.membershipRow}>
            <View>
              <Text style={styles.membershipLabel}>Current Plan</Text>
              <Text style={styles.membershipPlan}>👑 Premium Member</Text>
            </View>
            <Button label="Upgrade to Elite" onPress={() => navigation.navigate('Membership')} variant="accent" size="sm" />
          </View>
        </Card>

        {/* Quick links */}
        <Card>
          <Text style={styles.sectionTitle}>Quick Access</Text>
          {[
            { icon: '🤖', label: 'AI Smart Match', screen: 'AIMatch' },
            { icon: '⭐', label: 'My Referrals', screen: 'Referrals' },
            { icon: '💬', label: 'WhatsApp Groups', screen: 'WhatsAppGroups' },
            { icon: '🌍', label: 'Community Help Board', screen: 'CommunityHelp' },
          ].map(item => (
            <TouchableOpacity key={item.label} style={styles.quickLink} onPress={() => navigation.navigate(item.screen)}>
              <Text style={styles.quickLinkIcon}>{item.icon}</Text>
              <Text style={styles.quickLinkLabel}>{item.label}</Text>
              <Text style={styles.quickLinkArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </Card>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={() => navigation.replace('Login')}>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  headerBg: { backgroundColor: Colors.primaryDark, paddingBottom: 28 },
  headerActions: { paddingTop: 52, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'flex-end' },
  settingsBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: `${Colors.white}20`, alignItems: 'center', justifyContent: 'center' },
  settingsIcon: { fontSize: 18 },
  profileTop: { alignItems: 'center', paddingTop: 8 },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: Colors.primaryDark },
  editAvatarIcon: { fontSize: 12 },
  profileName: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.white, marginBottom: 4 },
  profileCompany: { fontSize: FontSize.md, color: `${Colors.white}80`, marginBottom: 12 },
  profileBadges: { flexDirection: 'row', gap: 8, alignItems: 'center' },
  statsRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, marginHorizontal: 16, marginTop: -16, borderRadius: BorderRadius.lg, paddingVertical: 16, ...Shadow.card },
  statItem: { flex: 1, alignItems: 'center' },
  statValue: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.primary },
  statLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
  statDivider: { width: 1, height: 32, backgroundColor: Colors.border },
  body: { padding: 16 },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.textPrimary, marginBottom: 14 },
  strengthHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  strengthPct: { fontSize: FontSize.md, fontWeight: '900', color: Colors.primary },
  strengthBar: { height: 8, backgroundColor: Colors.background, borderRadius: 4, marginBottom: 10 },
  strengthFill: { height: 8, backgroundColor: Colors.primary, borderRadius: 4 },
  strengthTip: { fontSize: FontSize.sm, color: Colors.textSecondary },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: Colors.border },
  detailIcon: { fontSize: 18, width: 28 },
  detailContent: { flex: 1 },
  detailLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  detailValue: { fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: '500', marginTop: 1 },
  membershipCard: { backgroundColor: `${Colors.primary}10`, borderWidth: 1, borderColor: `${Colors.primary}20` },
  membershipRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  membershipLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 4 },
  membershipPlan: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.primary },
  quickLink: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: Colors.border },
  quickLinkIcon: { fontSize: 20, width: 36 },
  quickLinkLabel: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: '600' },
  quickLinkArrow: { color: Colors.textMuted, fontSize: 16 },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: Colors.errorLight, borderRadius: BorderRadius.lg, paddingVertical: 16, marginBottom: 40, borderWidth: 1, borderColor: `${Colors.error}20` },
  logoutIcon: { fontSize: 20 },
  logoutText: { fontSize: FontSize.md, color: Colors.error, fontWeight: '700' },
});

export default ProfileScreen;
