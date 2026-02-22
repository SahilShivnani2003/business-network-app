import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/header';
import { PrimaryButton } from '../components/UIComponent';
import { Colors, Spacing, Typography, Radius, Shadow } from '../theme/theme';

const { width } = Dimensions.get('window');

const CATEGORIES = ['All', 'IT & Software', 'Export & Import', 'Construction', 'Fashion', 'Healthcare', 'Automotive', 'Education', 'Finance', 'Food & Beverage'];
const CITIES = ['All Cities', 'Mumbai', 'Delhi', 'Ahmedabad', 'Bangalore', 'Pune', 'Surat', 'Hyderabad', 'Chennai'];

const MEMBERS = [
  { id: '1', name: 'Rajesh Sharma', business: 'TechVision Solutions', city: 'Mumbai', category: 'IT & Software', verified: true, premium: true, avatar: 'RS', tagline: 'Custom Software & AI Solutions', connects: 142, joined: 'Jan 2023' },
  { id: '2', name: 'Priya Patel', business: 'GreenLeaf Exports', city: 'Ahmedabad', category: 'Export & Import', verified: true, premium: true, avatar: 'PP', tagline: 'Agricultural & Textile Exports', connects: 98, joined: 'Mar 2023' },
  { id: '3', name: 'Amit Kumar', business: 'BuildRight Infra', city: 'Delhi', category: 'Construction', verified: true, premium: false, avatar: 'AK', tagline: 'Commercial & Residential Projects', connects: 67, joined: 'Jun 2023' },
  { id: '4', name: 'Sneha Mehta', business: 'FashionForward', city: 'Surat', category: 'Fashion', verified: true, premium: true, avatar: 'SM', tagline: 'Designer Wear & Wholesale', connects: 215, joined: 'Feb 2023' },
  { id: '5', name: 'Vikram Joshi', business: 'AutoEdge Motors', city: 'Pune', category: 'Automotive', verified: false, premium: false, avatar: 'VJ', tagline: 'Pre-owned Luxury Cars', connects: 34, joined: 'Sep 2023' },
  { id: '6', name: 'Deepika Rao', business: 'HealthFirst Clinic', city: 'Bangalore', category: 'Healthcare', verified: true, premium: true, avatar: 'DR', tagline: 'Multi-speciality Diagnostics', connects: 189, joined: 'Apr 2023' },
  { id: '7', name: 'Suresh Nair', business: 'EduTech Hub', city: 'Hyderabad', category: 'Education', verified: true, premium: false, avatar: 'SN', tagline: 'Online Skill Training Platform', connects: 78, joined: 'Jul 2023' },
  { id: '8', name: 'Meera Singh', business: 'SpiceRoute Foods', city: 'Mumbai', category: 'Food & Beverage', verified: true, premium: true, avatar: 'MS', tagline: 'Authentic Indian Food Chain', connects: 163, joined: 'May 2023' },
];

const AvatarCircle = ({ initials, size = 56, premium }) => (
  <LinearGradient
    colors={premium ? [Colors.orange, Colors.orangeLight] : [Colors.bluePrimary, Colors.blueLight]}
    style={{ width: size, height: size, borderRadius: size / 2, alignItems: 'center', justifyContent: 'center' }}
  >
    <Text style={{ color: Colors.white, fontSize: size * 0.36, fontWeight: '800' }}>{initials}</Text>
  </LinearGradient>
);

const MemberCard = ({ item, onConnect }) => (
  <View style={[styles.memberCard, item.premium && styles.memberCardPremium]}>
    {item.premium && (
      <LinearGradient
        colors={[Colors.orange, Colors.orangeLight]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.premiumStripe}
      >
        <Text style={styles.premiumStripeText}>★ PREMIUM MEMBER</Text>
      </LinearGradient>
    )}
    <View style={styles.memberCardContent}>
      <View style={styles.memberLeft}>
        <View style={{ position: 'relative' }}>
          <AvatarCircle initials={item.avatar} size={60} premium={item.premium} />
          {item.verified && (
            <View style={styles.verifiedDot}>
              <Text style={{ color: Colors.white, fontSize: 9 }}>✓</Text>
            </View>
          )}
        </View>
        <View style={styles.memberInfo}>
          <View style={styles.memberNameRow}>
            <Text style={styles.memberName}>{item.name}</Text>
          </View>
          <Text style={styles.memberBiz}>{item.business}</Text>
          <Text style={styles.memberTagline}>{item.tagline}</Text>
          <View style={styles.memberMetaRow}>
            <Text style={styles.memberMetaItem}>📍 {item.city}</Text>
            <Text style={styles.memberMetaDot}>·</Text>
            <Text style={styles.memberMetaItem}>🤝 {item.connects}</Text>
          </View>
        </View>
      </View>
      <View style={styles.memberActions}>
        <View style={[styles.catBadge]}>
          <Text style={styles.catBadgeText}>{item.category.split(' ')[0]}</Text>
        </View>
        <TouchableOpacity
          style={styles.connectBtn}
          onPress={() => onConnect(item)}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[Colors.bluePrimary, Colors.blueLight]}
            style={styles.connectBtnGrad}
          >
            <Text style={styles.connectBtnText}>Connect</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  </View>
);

const FilterChip = ({ label, active, onPress }) => (
  <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
    <LinearGradient
      colors={active ? [Colors.bluePrimary, Colors.blueLight] : ['#F0F4FF', '#F0F4FF']}
      style={styles.filterChip}
    >
      <Text style={[styles.filterChipText, active && styles.filterChipTextActive]}>
        {label}
      </Text>
    </LinearGradient>
  </TouchableOpacity>
);

const MembersScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [activeCity, setActiveCity] = useState('All Cities');
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [showPremiumOnly, setShowPremiumOnly] = useState(false);
  const [showVerifiedOnly, setShowVerifiedOnly] = useState(false);

  const filtered = MEMBERS.filter(m => {
    const matchSearch = m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.business.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === 'All' || m.category === activeCategory;
    const matchCity = activeCity === 'All Cities' || m.city === activeCity;
    const matchPremium = !showPremiumOnly || m.premium;
    const matchVerified = !showVerifiedOnly || m.verified;
    return matchSearch && matchCat && matchCity && matchPremium && matchVerified;
  });

  // Sort: premium first
  const sorted = [...filtered].sort((a, b) => (b.premium ? 1 : 0) - (a.premium ? 1 : 0));

  const handleConnect = (member) => {
    setSelectedMember(member);
    setShowConnectModal(true);
  };

  return (
    <View style={styles.container}>
      <Header title="Member Directory" subtitle={`${sorted.length} businesses`} navigation={navigation} />

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <View style={styles.searchInput}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchText}
            placeholder="Search by name or business..."
            placeholderTextColor={Colors.gray}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <Text style={{ color: Colors.gray, fontSize: 18 }}>×</Text>
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setShowFilterModal(true)}
          activeOpacity={0.8}
        >
          <LinearGradient colors={[Colors.bluePrimary, Colors.blueLight]} style={styles.filterBtnGrad}>
            <Text style={{ color: Colors.white, fontSize: 18 }}>⚙</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Category Pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryScroll}
        style={styles.categoryScrollWrapper}
      >
        {CATEGORIES.map(cat => (
          <FilterChip
            key={cat}
            label={cat}
            active={activeCategory === cat}
            onPress={() => setActiveCategory(cat)}
          />
        ))}
      </ScrollView>

      {/* Quick Toggles */}
      <View style={styles.quickToggles}>
        <TouchableOpacity
          style={[styles.toggleChip, showPremiumOnly && styles.toggleChipActive]}
          onPress={() => setShowPremiumOnly(!showPremiumOnly)}
        >
          <Text style={[styles.toggleText, showPremiumOnly && styles.toggleTextActive]}>★ Premium Only</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.toggleChip, showVerifiedOnly && styles.toggleChipActiveVerified]}
          onPress={() => setShowVerifiedOnly(!showVerifiedOnly)}
        >
          <Text style={[styles.toggleText, showVerifiedOnly && styles.toggleTextActiveVerified]}>✓ Verified Only</Text>
        </TouchableOpacity>
      </View>

      {/* Results Count */}
      <View style={styles.resultsBar}>
        <Text style={styles.resultsText}>
          Showing <Text style={styles.resultsCount}>{sorted.length}</Text> businesses
        </Text>
      </View>

      {/* Member List */}
      <FlatList
        data={sorted}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <MemberCard item={item} onConnect={handleConnect} />
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No members found</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
          </View>
        }
      />

      {/* Filter Modal */}
      <Modal visible={showFilterModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.filterModal}>
            <View style={styles.filterModalHandle} />
            <Text style={styles.filterModalTitle}>Advanced Filters</Text>

            <Text style={styles.filterSectionLabel}>Filter by City</Text>
            <ScrollView style={{ maxHeight: 200 }}>
              {CITIES.map(city => (
                <TouchableOpacity
                  key={city}
                  style={[styles.filterOption, activeCity === city && styles.filterOptionActive]}
                  onPress={() => setActiveCity(city)}
                >
                  <Text style={[styles.filterOptionText, activeCity === city && styles.filterOptionTextActive]}>
                    {city}
                  </Text>
                  {activeCity === city && <Text style={{ color: Colors.bluePrimary }}>✓</Text>}
                </TouchableOpacity>
              ))}
            </ScrollView>

            <PrimaryButton
              title="Apply Filters"
              onPress={() => setShowFilterModal(false)}
              style={{ marginTop: Spacing.md }}
            />
            <TouchableOpacity
              style={styles.resetBtn}
              onPress={() => { setActiveCity('All Cities'); setActiveCategory('All'); setShowFilterModal(false); }}
            >
              <Text style={styles.resetBtnText}>Reset All</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Connect Modal */}
      <Modal visible={showConnectModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.connectModal}>
            <AvatarCircle initials={selectedMember?.avatar} size={72} premium={selectedMember?.premium} />
            <Text style={styles.connectModalTitle}>Connect with {selectedMember?.name}?</Text>
            <Text style={styles.connectModalSubtitle}>{selectedMember?.business}</Text>
            <Text style={styles.connectModalNote}>
              🔐 Login or create an account to connect with members
            </Text>
            <PrimaryButton title="Login to Connect" onPress={() => setShowConnectModal(false)} />
            <TouchableOpacity style={{ marginTop: 12 }} onPress={() => setShowConnectModal(false)}>
              <Text style={{ color: Colors.gray, fontSize: Typography.base, textAlign: 'center' }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },

  // Search
  searchBar: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
    gap: 10,
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    borderColor: Colors.border,
    gap: 8,
  },
  searchIcon: { fontSize: 16 },
  searchText: { flex: 1, fontSize: Typography.base, color: Colors.dark },
  filterBtn: { borderRadius: Radius.md, overflow: 'hidden' },
  filterBtnGrad: { width: 48, height: 48, alignItems: 'center', justifyContent: 'center', borderRadius: Radius.md },

  // Categories
  categoryScrollWrapper: { backgroundColor: Colors.white, borderBottomWidth: 1, borderBottomColor: Colors.border },
  categoryScroll: { paddingHorizontal: Spacing.md, paddingVertical: 10, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full },
  filterChipText: { color: Colors.gray, fontSize: Typography.sm, fontWeight: '600' },
  filterChipTextActive: { color: Colors.white },

  // Quick Toggles
  quickToggles: {
    flexDirection: 'row',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    gap: 10,
    backgroundColor: Colors.offWhite,
  },
  toggleChip: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.full,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  toggleChipActive: { borderColor: Colors.orange, backgroundColor: Colors.orangePale },
  toggleChipActiveVerified: { borderColor: Colors.verified, backgroundColor: '#EFF6FF' },
  toggleText: { color: Colors.gray, fontSize: Typography.sm, fontWeight: '600' },
  toggleTextActive: { color: Colors.orange },
  toggleTextActiveVerified: { color: Colors.verified },

  // Results
  resultsBar: { paddingHorizontal: Spacing.md, paddingVertical: 8 },
  resultsText: { color: Colors.gray, fontSize: Typography.sm },
  resultsCount: { color: Colors.bluePrimary, fontWeight: '700' },

  // Member Card
  listContent: { paddingHorizontal: Spacing.md, paddingBottom: 20 },
  memberCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.card,
  },
  memberCardPremium: {
    borderColor: Colors.orangeGlow,
  },
  premiumStripe: {
    paddingVertical: 5,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
  },
  premiumStripeText: {
    color: Colors.white,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 1,
  },
  memberCardContent: {
    flexDirection: 'row',
    padding: Spacing.md,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  memberLeft: { flexDirection: 'row', gap: 12, flex: 1 },
  verifiedDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.verified,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  memberInfo: { flex: 1 },
  memberNameRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  memberName: { fontSize: Typography.base, fontWeight: '700', color: Colors.dark },
  memberBiz: { fontSize: Typography.sm, color: Colors.bluePrimary, fontWeight: '600', marginTop: 2 },
  memberTagline: { fontSize: 12, color: Colors.gray, marginTop: 2 },
  memberMetaRow: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 6 },
  memberMetaItem: { fontSize: 12, color: Colors.gray },
  memberMetaDot: { color: Colors.grayLight, fontSize: 14 },
  memberActions: { alignItems: 'flex-end', gap: 8 },
  catBadge: {
    backgroundColor: Colors.bluePale,
    paddingHorizontal: 9,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  catBadgeText: { color: Colors.bluePrimary, fontSize: 10, fontWeight: '700' },
  connectBtn: { borderRadius: Radius.md, overflow: 'hidden' },
  connectBtnGrad: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: Radius.md },
  connectBtnText: { color: Colors.white, fontSize: Typography.sm, fontWeight: '700' },

  // Empty State
  emptyState: { alignItems: 'center', paddingVertical: Spacing.xxxl },
  emptyIcon: { fontSize: 52, marginBottom: Spacing.md },
  emptyTitle: { fontSize: Typography.xl, fontWeight: '700', color: Colors.dark },
  emptySubtitle: { fontSize: Typography.base, color: Colors.gray, marginTop: 6 },

  // Modals
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  filterModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  filterModalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.grayLight,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: Spacing.md,
  },
  filterModalTitle: { fontSize: Typography.xl, fontWeight: '800', color: Colors.dark, marginBottom: Spacing.lg },
  filterSectionLabel: { fontSize: Typography.sm, fontWeight: '700', color: Colors.gray, marginBottom: Spacing.sm, textTransform: 'uppercase', letterSpacing: 0.8 },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    marginBottom: 4,
  },
  filterOptionActive: { backgroundColor: Colors.bluePale },
  filterOptionText: { fontSize: Typography.base, color: Colors.grayDark },
  filterOptionTextActive: { color: Colors.bluePrimary, fontWeight: '600' },
  resetBtn: { marginTop: 10, alignItems: 'center' },
  resetBtnText: { color: Colors.gray, fontSize: Typography.base },

  connectModal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing.xl,
    paddingBottom: Spacing.xxxl,
    alignItems: 'center',
    gap: 10,
  },
  connectModalTitle: { fontSize: Typography.xl, fontWeight: '800', color: Colors.dark },
  connectModalSubtitle: { fontSize: Typography.base, color: Colors.gray },
  connectModalNote: {
    fontSize: Typography.sm,
    color: Colors.grayDark,
    textAlign: 'center',
    backgroundColor: Colors.bluePale,
    padding: Spacing.md,
    borderRadius: Radius.md,
    lineHeight: 20,
    width: '100%',
  },
});

export default MembersScreen;
