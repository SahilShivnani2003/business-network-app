import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { Colors, FontSize, BorderRadius, Shadow, Spacing } from '../../theme/colors';
import { Badge, Button, Card } from '../components';
import { MOCK_LEADS } from '../../data/mockData';
import { Lead } from '../../types';

type Props = { navigation: any };

const LeadsScreen: React.FC<Props> = ({ navigation }) => {
  const [savedLeads, setSavedLeads] = useState<string[]>([]);

  const toggleSave = (id: string) => {
    setSavedLeads(prev => prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Business Leads</Text>
        <Text style={styles.headerSub}>Verified client requirements</Text>
      </View>

      {/* Premium Banner */}
      <View style={styles.premiumBanner}>
        <View style={styles.premiumLeft}>
          <Text style={styles.premiumIcon}>👑</Text>
          <View>
            <Text style={styles.premiumTitle}>Premium Leads Access</Text>
            <Text style={styles.premiumSub}>Upgrade to contact all leads</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.upgradeBtnSmall} onPress={() => navigation.navigate('Membership')}>
          <Text style={styles.upgradeText}>Upgrade</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_LEADS}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <LeadCard
            lead={item}
            isSaved={savedLeads.includes(item.id)}
            onSave={() => toggleSave(item.id)}
            onContact={() => navigation.navigate('Membership')}
          />
        )}
      />
    </View>
  );
};

const LeadCard: React.FC<{ lead: Lead; isSaved: boolean; onSave: () => void; onContact: () => void }> = ({ lead, isSaved, onSave, onContact }) => (
  <Card style={styles.leadCard}>
    <View style={styles.leadHeader}>
      <View style={styles.leadIconBox}>
        <Text style={styles.leadIcon}>💼</Text>
      </View>
      <View style={styles.leadHeaderInfo}>
        <View style={styles.leadTitleRow}>
          <Text style={styles.leadClient}>{lead.clientName}</Text>
          {lead.isPremium && <Badge label="PREMIUM" color={Colors.premium} size="sm" />}
        </View>
        <Text style={styles.leadPosted}>{lead.postedAt}</Text>
      </View>
      <TouchableOpacity onPress={onSave} style={styles.saveBtn}>
        <Text style={[styles.saveIcon, isSaved && styles.savedIcon]}>{isSaved ? '🔖' : '🏷️'}</Text>
      </TouchableOpacity>
    </View>

    <Text style={styles.leadRequirement}>{lead.requirement}</Text>

    <View style={styles.leadMeta}>
      <MetaTag icon="💰" label={lead.budget} />
      <MetaTag icon="🏢" label={lead.industry} />
      <MetaTag icon="📍" label={lead.city} />
    </View>

    <View style={styles.leadActions}>
      {lead.isPremium ? (
        <Button label="🔒 Unlock to Contact" onPress={onContact} variant="primary" fullWidth size="md" />
      ) : (
        <Button label="📞 Contact Client" onPress={() => {}} variant="accent" fullWidth size="md" />
      )}
    </View>
  </Card>
);

const MetaTag: React.FC<{ icon: string; label: string }> = ({ icon, label }) => (
  <View style={styles.metaTag}>
    <Text style={styles.metaIcon}>{icon}</Text>
    <Text style={styles.metaLabel}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primaryDark, paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: `${Colors.white}70`, marginTop: 2 },
  premiumBanner: { margin: 16, backgroundColor: `${Colors.premium}15`, borderRadius: BorderRadius.lg, padding: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderWidth: 1, borderColor: `${Colors.premium}30` },
  premiumLeft: { flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 },
  premiumIcon: { fontSize: 28 },
  premiumTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.premium },
  premiumSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
  upgradeBtnSmall: { backgroundColor: Colors.premium, borderRadius: BorderRadius.md, paddingHorizontal: 16, paddingVertical: 9 },
  upgradeText: { color: Colors.white, fontSize: FontSize.sm, fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  leadCard: { marginBottom: 14 },
  leadHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 12 },
  leadIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: `${Colors.primary}12`, alignItems: 'center', justifyContent: 'center' },
  leadIcon: { fontSize: 22 },
  leadHeaderInfo: { flex: 1 },
  leadTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 3 },
  leadClient: { fontSize: FontSize.md, fontWeight: '800', color: Colors.textPrimary },
  leadPosted: { fontSize: 11, color: Colors.textMuted },
  saveBtn: { padding: 4 },
  saveIcon: { fontSize: 20, opacity: 0.5 },
  savedIcon: { opacity: 1 },
  leadRequirement: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 22, marginBottom: 14 },
  leadMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  metaTag: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: Colors.background, borderRadius: BorderRadius.full, paddingHorizontal: 10, paddingVertical: 5 },
  metaIcon: { fontSize: 13 },
  metaLabel: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  leadActions: {},
});

export default LeadsScreen;
