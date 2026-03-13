import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Colors, FontSize, BorderRadius, Shadow } from '../../theme/colors';
import { Badge, Button, Card } from '../components';
import { MOCK_EVENTS } from '../../data/mockData';
import { Event } from '../../types';

type Props = { navigation: any };

const EventsScreen: React.FC<Props> = ({ navigation }) => {
  const [filter, setFilter] = useState<'all' | 'online' | 'offline'>('all');
  const [registered, setRegistered] = useState<string[]>([]);

  const filtered = MOCK_EVENTS.filter(e => filter === 'all' || e.type === filter);

  const toggleRegister = (id: string) => {
    setRegistered(prev => prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Events</Text>
        <Text style={styles.headerSub}>Grow through networking & learning</Text>
      </View>

      {/* Filter tabs */}
      <View style={styles.tabs}>
        {[['all', 'All Events'], ['online', '🌐 Online'], ['offline', '📍 Offline']].map(([key, label]) => (
          <TouchableOpacity
            key={key}
            style={[styles.tab, filter === key && styles.tabActive]}
            onPress={() => setFilter(key as any)}
          >
            <Text style={[styles.tabText, filter === key && styles.tabTextActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <EventCard
            event={item}
            isRegistered={registered.includes(item.id)}
            onRegister={() => toggleRegister(item.id)}
          />
        )}
      />
    </View>
  );
};

const EventCard: React.FC<{ event: Event; isRegistered: boolean; onRegister: () => void }> = ({ event, isRegistered, onRegister }) => (
  <Card style={styles.eventCard}>
    {/* Type banner */}
    <View style={[styles.eventBanner, { backgroundColor: event.type === 'online' ? `${Colors.primary}12` : `${Colors.accent}12` }]}>
      <Badge
        label={event.type === 'online' ? '🌐 Online Webinar' : '📍 Offline Event'}
        color={event.type === 'online' ? Colors.primary : Colors.accent}
        size="sm"
      />
      <Text style={styles.attendeeCount}>👥 {event.attendees} attending</Text>
    </View>

    <Text style={styles.eventTitle}>{event.title}</Text>
    <Text style={styles.eventDesc}>{event.description}</Text>

    <View style={styles.detailsGrid}>
      <DetailRow icon="📅" label="Date" value={event.date} />
      <DetailRow icon="🕐" label="Time" value={event.time} />
      <DetailRow icon="📍" label="Location" value={event.location} />
    </View>

    <View style={styles.eventActions}>
      {isRegistered ? (
        <View style={styles.registeredBadge}>
          <Text style={styles.registeredText}>✓ You are registered!</Text>
        </View>
      ) : (
        <Button label="Register Now →" onPress={onRegister} variant="primary" fullWidth size="md" />
      )}
      <Button label="+ Calendar" onPress={() => {}} variant="outline" size="md" style={{ marginTop: 10 }} fullWidth />
    </View>
  </Card>
);

const DetailRow: React.FC<{ icon: string; label: string; value: string }> = ({ icon, label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailIcon}>{icon}</Text>
    <View>
      <Text style={styles.detailLabel}>{label}</Text>
      <Text style={styles.detailValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.primaryDark, paddingTop: 52, paddingBottom: 20, paddingHorizontal: 20 },
  headerTitle: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.white },
  headerSub: { fontSize: FontSize.sm, color: `${Colors.white}70`, marginTop: 2 },
  tabs: { flexDirection: 'row', margin: 16, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: 4, ...Shadow.card },
  tab: { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.md, alignItems: 'center' },
  tabActive: { backgroundColor: Colors.primary },
  tabText: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  tabTextActive: { color: Colors.white },
  list: { paddingHorizontal: 16, paddingBottom: 100 },
  eventCard: { marginBottom: 16 },
  eventBanner: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 10, borderRadius: BorderRadius.sm, marginBottom: 14 },
  attendeeCount: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
  eventTitle: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.textPrimary, marginBottom: 8 },
  eventDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22, marginBottom: 16 },
  detailsGrid: { gap: 10, marginBottom: 16 },
  detailRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  detailIcon: { fontSize: 18, width: 28 },
  detailLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
  detailValue: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '600' },
  eventActions: {},
  registeredBadge: { backgroundColor: Colors.successLight, borderRadius: BorderRadius.md, paddingVertical: 12, alignItems: 'center', borderWidth: 1, borderColor: `${Colors.success}30` },
  registeredText: { color: Colors.success, fontWeight: '700', fontSize: FontSize.md },
});

export default EventsScreen;
