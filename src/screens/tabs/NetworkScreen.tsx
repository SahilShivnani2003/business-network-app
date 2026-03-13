import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { Colors, FontSize, BorderRadius, Shadow, Spacing } from '../../theme/colors';
import { MemberCard, Badge, Button } from '../components';
import { MOCK_MEMBERS } from '../../data/mockData';

type Props = { navigation: any };

const INDUSTRIES = ['All', 'IT', 'Real Estate', 'Marketing', 'Finance', 'Healthcare', 'Startup'];
const CITIES = ['All Cities', 'Mumbai', 'Delhi', 'Bangalore', 'Pune', 'Chennai', 'Ahmedabad'];

const NetworkScreen: React.FC<Props> = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('All');
  const [selectedCity, setSelectedCity] = useState('All Cities');

  const filtered = MOCK_MEMBERS.filter(m =>
    (search === '' || m.name.toLowerCase().includes(search.toLowerCase()) || m.company.toLowerCase().includes(search.toLowerCase())) &&
    (selectedIndustry === 'All' || m.industry.toLowerCase().includes(selectedIndustry.toLowerCase()))
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Business Network</Text>
        <Text style={styles.headerSub}>{MOCK_MEMBERS.length}+ verified members</Text>
      </View>

      {/* Search */}
      <View style={styles.searchWrapper}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search by name, company, skill..."
          placeholderTextColor={Colors.textMuted}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Text style={styles.clearSearch}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Industry filter */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {INDUSTRIES.map(ind => (
          <TouchableOpacity
            key={ind}
            style={[styles.filterChip, selectedIndustry === ind && styles.filterChipActive]}
            onPress={() => setSelectedIndustry(ind)}
          >
            <Text style={[styles.filterChipText, selectedIndustry === ind && styles.filterChipTextActive]}>{ind}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* City filter row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll} contentContainerStyle={styles.filterContent}>
        {CITIES.map(city => (
          <TouchableOpacity
            key={city}
            style={[styles.cityChip, selectedCity === city && styles.cityChipActive]}
            onPress={() => setSelectedCity(city)}
          >
            <Text style={[styles.cityChipText, selectedCity === city && styles.cityChipTextActive]}>{city === 'All Cities' ? '📍 ' + city : '📍 ' + city}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Results */}
      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.resultsHeader}>
            <Text style={styles.resultsCount}>{filtered.length} members found</Text>
            <TouchableOpacity style={styles.sortBtn}>
              <Text style={styles.sortText}>Sort: Trust Score ▼</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({ item }) => (
          <MemberCard
            member={item}
            onPress={() => navigation.navigate('MemberProfile', { memberId: item.id })}
            onConnect={() => {}}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🔍</Text>
            <Text style={styles.emptyTitle}>No members found</Text>
            <Text style={styles.emptyText}>Try adjusting your search or filters</Text>
          </View>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primaryDark, paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: `${Colors.white}70`, marginTop: 2 },
  searchWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, margin: 16, borderRadius: BorderRadius.lg, paddingHorizontal: 14, paddingVertical: 4, ...Shadow.card },
  searchIcon: { fontSize: 18, marginRight: 8 },
  searchInput: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, paddingVertical: 12 },
  clearSearch: { fontSize: 16, color: Colors.textMuted, padding: 4 },
  filterScroll: { maxHeight: 48 },
  filterContent: { paddingHorizontal: 16, gap: 8, alignItems: 'center' },
  filterChip: { paddingHorizontal: 16, paddingVertical: 7, borderRadius: BorderRadius.full, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  filterChipTextActive: { color: Colors.white },
  cityChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: BorderRadius.full, backgroundColor: Colors.surface, borderWidth: 1, borderColor: Colors.border, marginTop: 8 },
  cityChipActive: { backgroundColor: `${Colors.primary}15`, borderColor: Colors.primary },
  cityChipText: { fontSize: 12, color: Colors.textSecondary },
  cityChipTextActive: { color: Colors.primary, fontWeight: '700' },
  list: { paddingHorizontal: 16, paddingBottom: 100, paddingTop: 8 },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  resultsCount: { fontSize: FontSize.sm, color: Colors.textMuted },
  sortBtn: { backgroundColor: Colors.surface, borderRadius: BorderRadius.sm, paddingHorizontal: 10, paddingVertical: 6, borderWidth: 1, borderColor: Colors.border },
  sortText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary, marginBottom: 8 },
  emptyText: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center' },
});

export default NetworkScreen;
