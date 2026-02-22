import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Modal,
  Dimensions,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Header from '../components/header';
import { PrimaryButton } from '../components/UIComponent';
import { Colors, Spacing, Typography, Radius, Shadow } from '../theme/theme';
const { width } = Dimensions.get('window');

const EVENTS = [
  {
    id: '1', title: 'Mega Networking Summit 2025', date: 'Mar 15, 2025', time: '10:00 AM - 6:00 PM',
    type: 'Offline', city: 'Mumbai', venue: 'Hotel Taj, BKC', seats: 23, price: 1500,
    emoji: '🏢', category: 'Networking', speakers: [
      { name: 'Harish Mehta', role: 'Serial Entrepreneur', avatar: 'HM' },
      { name: 'Ritu Shah', role: 'VC Partner', avatar: 'RS' },
    ],
    description: 'India\'s premier business networking event bringing together 500+ entrepreneurs, CXOs, and investors for a day of powerful connections.',
  },
  {
    id: '2', title: 'Digital Growth Masterclass', date: 'Mar 22, 2025', time: '2:00 PM - 5:00 PM',
    type: 'Online', city: 'Virtual', venue: 'Zoom Webinar', seats: 89, price: 0,
    emoji: '💻', category: 'Education', speakers: [
      { name: 'Aman Gupta', role: 'Growth Hacker', avatar: 'AG' },
    ],
    description: 'Learn proven digital marketing strategies that will 10x your business growth in 2025.',
  },
  {
    id: '3', title: 'Export Business Conclave', date: 'Apr 5, 2025', time: '9:00 AM - 5:00 PM',
    type: 'Offline', city: 'Ahmedabad', venue: 'Science City Auditorium', seats: 12, price: 2000,
    emoji: '🌐', category: 'Export', speakers: [
      { name: 'Neelam Patel', role: 'Export Consultant', avatar: 'NP' },
      { name: 'Raj Sharma', role: 'DGFT Official', avatar: 'RJS' },
    ],
    description: 'Connect with exporters, importers, and government officials to unlock international trade opportunities.',
  },
  {
    id: '4', title: 'Startup Funding Bootcamp', date: 'Apr 12, 2025', time: '11:00 AM - 4:00 PM',
    type: 'Online', city: 'Virtual', venue: 'Google Meet', seats: 156, price: 500,
    emoji: '🚀', category: 'Funding', speakers: [
      { name: 'Kavitha Reddy', role: 'Angel Investor', avatar: 'KR' },
    ],
    description: 'Everything you need to know about raising your first round — pitch decks, term sheets, and investor outreach.',
  },
  {
    id: '5', title: 'Women Entrepreneurs Conclave', date: 'Apr 25, 2025', time: '10:00 AM - 4:00 PM',
    type: 'Offline', city: 'Delhi', venue: 'India Habitat Centre', seats: 45, price: 1000,
    emoji: '💼', category: 'Networking', speakers: [
      { name: 'Priya Nair', role: 'Founder & CEO', avatar: 'PN' },
      { name: 'Sanya Kapoor', role: 'Brand Strategist', avatar: 'SK' },
    ],
    description: 'Empowering women entrepreneurs with knowledge, connections, and resources to scale their businesses.',
  },
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const EVENT_DAYS = ['Mar 15', 'Mar 22', 'Apr 5', 'Apr 12', 'Apr 25'];

const SpeakerBubble = ({ name, role, avatar }) => (
  <View style={styles.speakerBubble}>
    <LinearGradient
      colors={[Colors.bluePrimary, Colors.blueLight]}
      style={styles.speakerAvatar}
    >
      <Text style={styles.speakerAvatarText}>{avatar}</Text>
    </LinearGradient>
    <View>
      <Text style={styles.speakerName}>{name}</Text>
      <Text style={styles.speakerRole}>{role}</Text>
    </View>
  </View>
);

const EventsScreen = ({ navigation }) => {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [registered, setRegistered] = useState({});

  const filters = ['All', 'Online', 'Offline', 'Networking', 'Education', 'Funding', 'Export'];

  const filtered = EVENTS.filter(e => {
    if (activeFilter === 'All') return true;
    return e.type === activeFilter || e.category === activeFilter;
  });

  const handleRegister = (id) => {
    setRegistered(prev => ({ ...prev, [id]: true }));
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <Header title="Events" subtitle="Network & Learn" navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Banner ───────────────────────────────────── */}
        <LinearGradient
          colors={['#0D3E82', '#1565C0']}
          style={styles.banner}
        >
          <View style={styles.bannerLeft}>
            <Text style={styles.bannerTitle}>Upcoming{'\n'}Events</Text>
            <Text style={styles.bannerSub}>5 events this quarter</Text>
          </View>
          <View style={styles.bannerStats}>
            <View style={styles.bannerStatItem}>
              <Text style={styles.bannerStatNum}>3</Text>
              <Text style={styles.bannerStatLabel}>Offline</Text>
            </View>
            <View style={styles.bannerStatDivider} />
            <View style={styles.bannerStatItem}>
              <Text style={styles.bannerStatNum}>2</Text>
              <Text style={styles.bannerStatLabel}>Online</Text>
            </View>
          </View>
        </LinearGradient>

        {/* ── Mini Calendar Strip ───────────────────────── */}
        <View style={styles.calendarStrip}>
          <Text style={styles.calendarLabel}>March - April 2025</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.calendarScroll}>
            {Array.from({ length: 35 }, (_, i) => {
              const day = (i % 30) + 1;
              const monthIdx = i < 16 ? 2 : 3;
              const label = `${MONTHS[monthIdx]} ${day}`;
              const hasEvent = EVENT_DAYS.includes(label);
              const isToday = label === 'Mar 15';
              return (
                <View key={i} style={[styles.calDay, hasEvent && styles.calDayEvent, isToday && styles.calDayToday]}>
                  <Text style={[styles.calDayNum, hasEvent && styles.calDayNumEvent, isToday && styles.calDayNumToday]}>{day}</Text>
                  {hasEvent && <View style={styles.calEventDot} />}
                </View>
              );
            })}
          </ScrollView>
        </View>

        {/* ── Filter Chips ──────────────────────────────── */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {filters.map(f => (
            <TouchableOpacity
              key={f}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={activeFilter === f ? [Colors.orange, Colors.orangeLight] : ['#F0F4FF', '#F0F4FF']}
                style={styles.filterChip}
              >
                <Text style={[styles.filterText, activeFilter === f && styles.filterTextActive]}>
                  {f}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* ── Event Cards ───────────────────────────────── */}
        <View style={styles.eventList}>
          {filtered.map(event => (
            <TouchableOpacity
              key={event.id}
              onPress={() => { setSelectedEvent(event); setShowModal(true); }}
              activeOpacity={0.9}
            >
              <View style={[styles.eventCard, registered[event.id] && styles.eventCardRegistered]}>
                {/* Header */}
                <LinearGradient
                  colors={event.type === 'Online' ? ['#064E3B', '#065F46'] : ['#0D3E82', '#1565C0']}
                  style={styles.eventCardHeader}
                >
                  <View style={styles.eventEmojiBox}>
                    <Text style={{ fontSize: 28 }}>{event.emoji}</Text>
                  </View>
                  <View style={styles.eventCardHeaderInfo}>
                    <Text style={styles.eventCardTitle}>{event.title}</Text>
                    <View style={styles.eventTypePill}>
                      <Text style={styles.eventTypeText}>
                        {event.type === 'Online' ? '🌐' : '📍'} {event.type}
                      </Text>
                    </View>
                  </View>
                  {registered[event.id] && (
                    <View style={styles.registeredBadge}>
                      <Text style={styles.registeredText}>✓</Text>
                    </View>
                  )}
                </LinearGradient>

                {/* Body */}
                <View style={styles.eventCardBody}>
                  <View style={styles.eventDetailRow}>
                    <Text style={styles.eventDetailIcon}>📅</Text>
                    <Text style={styles.eventDetailText}>{event.date} • {event.time}</Text>
                  </View>
                  <View style={styles.eventDetailRow}>
                    <Text style={styles.eventDetailIcon}>📍</Text>
                    <Text style={styles.eventDetailText}>{event.venue}, {event.city}</Text>
                  </View>

                  <View style={styles.eventCardFooter}>
                    <View>
                      <Text style={styles.eventPrice}>
                        {event.price === 0 ? '🆓 FREE' : `₹${event.price.toLocaleString()}`}
                      </Text>
                      <Text style={styles.eventSeats}>{event.seats} seats left</Text>
                    </View>
                    <TouchableOpacity
                      onPress={() => handleRegister(event.id)}
                      activeOpacity={0.85}
                    >
                      <LinearGradient
                        colors={registered[event.id] ? ['#16A34A', '#15803D'] : [Colors.orange, Colors.orangeLight]}
                        style={styles.registerBtn}
                      >
                        <Text style={styles.registerBtnText}>
                          {registered[event.id] ? '✓ Registered' : 'Register'}
                        </Text>
                      </LinearGradient>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>

      {/* ── Event Detail Modal ─────────────────────────── */}
      <Modal visible={showModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <TouchableOpacity style={styles.modalClose} onPress={() => setShowModal(false)}>
              <Text style={styles.modalCloseText}>×</Text>
            </TouchableOpacity>

            {selectedEvent && (
              <ScrollView showsVerticalScrollIndicator={false}>
                <LinearGradient
                  colors={selectedEvent.type === 'Online' ? ['#064E3B', '#065F46'] : ['#0D3E82', '#1565C0']}
                  style={styles.modalHeader}
                >
                  <Text style={{ fontSize: 40 }}>{selectedEvent.emoji}</Text>
                  <Text style={styles.modalTitle}>{selectedEvent.title}</Text>
                  <View style={styles.eventTypePill}>
                    <Text style={styles.eventTypeText}>{selectedEvent.type} Event</Text>
                  </View>
                </LinearGradient>

                <View style={styles.modalBody}>
                  <Text style={styles.modalSectionLabel}>About this Event</Text>
                  <Text style={styles.modalDesc}>{selectedEvent.description}</Text>

                  <View style={styles.modalInfoGrid}>
                    {[
                      { icon: '📅', label: 'Date', value: selectedEvent.date },
                      { icon: '⏰', label: 'Time', value: selectedEvent.time },
                      { icon: '📍', label: 'Venue', value: `${selectedEvent.venue}, ${selectedEvent.city}` },
                      { icon: '🎫', label: 'Seats', value: `${selectedEvent.seats} remaining` },
                    ].map((info, i) => (
                      <View key={i} style={styles.modalInfoItem}>
                        <Text style={styles.modalInfoIcon}>{info.icon}</Text>
                        <View>
                          <Text style={styles.modalInfoLabel}>{info.label}</Text>
                          <Text style={styles.modalInfoValue}>{info.value}</Text>
                        </View>
                      </View>
                    ))}
                  </View>

                  <Text style={styles.modalSectionLabel}>Speakers</Text>
                  {selectedEvent.speakers.map((speaker, i) => (
                    <SpeakerBubble key={i} {...speaker} />
                  ))}

                  <View style={styles.modalPrice}>
                    <Text style={styles.modalPriceLabel}>Entry Fee</Text>
                    <Text style={styles.modalPriceValue}>
                      {selectedEvent.price === 0 ? 'FREE' : `₹${selectedEvent.price.toLocaleString()}`}
                    </Text>
                  </View>

                  <PrimaryButton
                    title={registered[selectedEvent.id] ? '✓ Already Registered' : 'Register Now →'}
                    onPress={() => handleRegister(selectedEvent.id)}
                  />

                  <TouchableOpacity style={styles.downloadBtn} activeOpacity={0.8}>
                    <Text style={styles.downloadBtnText}>📥 Download Brochure</Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.offWhite },

  // Banner
  banner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  bannerLeft: {},
  bannerTitle: { color: Colors.white, fontSize: Typography.xxl, fontWeight: '900', lineHeight: 36 },
  bannerSub: { color: 'rgba(255,255,255,0.7)', fontSize: Typography.sm, marginTop: 4 },
  bannerStats: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    gap: 16,
    alignItems: 'center',
  },
  bannerStatItem: { alignItems: 'center' },
  bannerStatNum: { color: Colors.orangeGlow, fontSize: Typography.xxl, fontWeight: '900' },
  bannerStatLabel: { color: 'rgba(255,255,255,0.7)', fontSize: Typography.xs },
  bannerStatDivider: { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.3)' },

  // Calendar
  calendarStrip: {
    backgroundColor: Colors.white,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginTop: -16,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
  },
  calendarLabel: {
    fontSize: Typography.sm,
    fontWeight: '700',
    color: Colors.grayDark,
    paddingHorizontal: Spacing.md,
    marginBottom: 8,
  },
  calendarScroll: { paddingHorizontal: Spacing.md, gap: 6 },
  calDay: {
    width: 36,
    height: 52,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surface,
  },
  calDayEvent: { backgroundColor: Colors.bluePale },
  calDayToday: { backgroundColor: Colors.bluePrimary },
  calDayNum: { fontSize: Typography.sm, color: Colors.gray, fontWeight: '500' },
  calDayNumEvent: { color: Colors.bluePrimary, fontWeight: '700' },
  calDayNumToday: { color: Colors.white, fontWeight: '800' },
  calEventDot: { width: 5, height: 5, borderRadius: 2.5, backgroundColor: Colors.orange, marginTop: 2 },

  // Filters
  filterScroll: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.md, gap: 8 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 9, borderRadius: Radius.full },
  filterText: { color: Colors.gray, fontSize: Typography.sm, fontWeight: '600' },
  filterTextActive: { color: Colors.white },

  // Event Cards
  eventList: { paddingHorizontal: Spacing.md, gap: 14 },
  eventCard: {
    backgroundColor: Colors.white,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    ...Shadow.card,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  eventCardRegistered: { borderColor: '#86EFAC', borderWidth: 2 },
  eventCardHeader: { flexDirection: 'row', padding: Spacing.md, alignItems: 'center', gap: 12 },
  eventEmojiBox: {
    width: 52,
    height: 52,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventCardHeaderInfo: { flex: 1 },
  eventCardTitle: { color: Colors.white, fontSize: Typography.base, fontWeight: '700' },
  eventTypePill: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  eventTypeText: { color: Colors.white, fontSize: 11, fontWeight: '600' },
  registeredBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.success,
    alignItems: 'center',
    justifyContent: 'center',
  },
  registeredText: { color: Colors.white, fontWeight: '800', fontSize: 14 },
  eventCardBody: { padding: Spacing.md },
  eventDetailRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 },
  eventDetailIcon: { fontSize: 14, width: 20 },
  eventDetailText: { fontSize: Typography.sm, color: Colors.grayDark },
  eventCardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10 },
  eventPrice: { fontSize: Typography.base, fontWeight: '700', color: Colors.dark },
  eventSeats: { fontSize: 11, color: Colors.orange, fontWeight: '600', marginTop: 2 },
  registerBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: Radius.md },
  registerBtnText: { color: Colors.white, fontSize: Typography.sm, fontWeight: '700' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
  modal: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    maxHeight: '90%',
    overflow: 'hidden',
  },
  modalClose: {
    position: 'absolute',
    top: 16,
    right: 16,
    zIndex: 10,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseText: { color: Colors.white, fontSize: 22, fontWeight: '300' },
  modalHeader: { padding: Spacing.xl, alignItems: 'center', gap: 10 },
  modalTitle: { color: Colors.white, fontSize: Typography.xl, fontWeight: '800', textAlign: 'center' },
  modalBody: { padding: Spacing.xl, gap: 14 },
  modalSectionLabel: {
    fontSize: Typography.sm,
    fontWeight: '700',
    color: Colors.gray,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 4,
  },
  modalDesc: { fontSize: Typography.base, color: Colors.grayDark, lineHeight: 24 },
  modalInfoGrid: { gap: 10 },
  modalInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.surface,
    padding: 12,
    borderRadius: Radius.md,
  },
  modalInfoIcon: { fontSize: 20 },
  modalInfoLabel: { fontSize: 11, color: Colors.gray, fontWeight: '600', textTransform: 'uppercase' },
  modalInfoValue: { fontSize: Typography.sm, color: Colors.dark, fontWeight: '600', marginTop: 1 },
  speakerBubble: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.bluePale,
    padding: Spacing.md,
    borderRadius: Radius.md,
    marginBottom: 8,
  },
  speakerAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  speakerAvatarText: { color: Colors.white, fontSize: 14, fontWeight: '800' },
  speakerName: { fontSize: Typography.base, fontWeight: '700', color: Colors.dark },
  speakerRole: { fontSize: Typography.sm, color: Colors.gray },
  modalPrice: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.orangePale,
    padding: Spacing.md,
    borderRadius: Radius.md,
  },
  modalPriceLabel: { fontSize: Typography.base, color: Colors.grayDark, fontWeight: '600' },
  modalPriceValue: { fontSize: Typography.xl, fontWeight: '900', color: Colors.orange },
  downloadBtn: {
    borderWidth: 2,
    borderColor: Colors.bluePrimary,
    paddingVertical: 13,
    borderRadius: Radius.lg,
    alignItems: 'center',
    marginTop: 8,
  },
  downloadBtnText: { color: Colors.bluePrimary, fontSize: Typography.base, fontWeight: '700' },
});

export default EventsScreen;
