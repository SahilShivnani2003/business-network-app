import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    Image,
    ActivityIndicator,
} from 'react-native';
import { Colors, FontSize, BorderRadius, Shadow } from '../../theme/colors';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { eventsAPI } from '../../service/apis/eventService';

// ── Types aligned with API response ────────────────────────────────────────────

interface ApiEvent {
    _id: string;
    title: string;
    description: string;
    shortDescription: string;
    eventType: string;
    category: string;
    startDate: string;
    endDate: string;
    startTime: string;
    endTime: string;
    venue: {
        name: string;
        isOnline: boolean;
        onlineLink?: string;
        address: {
            street: string;
            city: string;
            state: string;
            country: string;
            zipCode: string;
        };
    };
    organizer: {
        name: string;
        email: string;
        phone?: string;
        company?: string;
    };
    registration: {
        isRequired: boolean;
        fee: {
            amount: number;
            currency: string;
        };
    };
    featuredImage?: {
        url: string;
        publicId: string;
    };
    images?: { url: string; publicId: string; _id: string }[];
    status: string;
    isActive: boolean;
    isFeatured: boolean;
    registrations: string[];
    views: number;
    tags: string[];
    agenda: any[];
    speakers: any[];
    likes: string[];
    createdAt: string;
    updatedAt: string;
}

type FilterType = 'all' | 'online' | 'offline';

// ── Helpers ────────────────────────────────────────────────────────────────────

const formatDate = (iso: string): string => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' });
};

const formatDateRange = (start: string, end: string): string => {
    const s = new Date(start);
    const e = new Date(end);
    if (s.toDateString() === e.toDateString()) return formatDate(start);
    return `${formatDate(start)} – ${formatDate(end)}`;
};

const formatTime = (time: string): string => {
    const [h, m] = time.split(':').map(Number);
    const ampm = h >= 12 ? 'PM' : 'AM';
    const hour = h % 12 || 12;
    return `${hour}:${m.toString().padStart(2, '0')} ${ampm}`;
};

const getLocation = (venue: ApiEvent['venue']): string => {
    if (venue.isOnline) return 'Online';
    const { city, state, country } = venue.address;
    return [venue.name, city, state, country].filter(Boolean).join(', ') || venue.name || 'TBD';
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ── Screen ─────────────────────────────────────────────────────────────────────

type Props = { navigation: any };

const EventsScreen: React.FC<Props> = ({ navigation }) => {
    const [filter, setFilter] = useState<FilterType>('all');
    const [registered, setRegistered] = useState<string[]>([]);
    const [events, setEvents] = useState<ApiEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await eventsAPI.getAll();
            if (response.data?.success) {
                setEvents(response.data.data.events);
            } else {
                setError('Failed to load events.');
            }
        } catch (err: any) {
            console.error('Error fetching events:', err?.message);
            setError('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const filtered = events.filter(e => {
        if (filter === 'all') return true;
        if (filter === 'online') return e.venue.isOnline;
        return !e.venue.isOnline;
    });

    const toggleRegister = (id: string) => {
        setRegistered(prev => (prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]));
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Events</Text>
                <Text style={styles.headerSub}>Grow through networking & learning</Text>
            </View>

            {/* Filter tabs */}
            <View style={styles.tabs}>
                {(
                    [
                        ['all', 'All Events'],
                        ['online', '🌐 Online'],
                        ['offline', '📍 Offline'],
                    ] as [FilterType, string][]
                ).map(([key, label]) => (
                    <TouchableOpacity
                        key={key}
                        style={[styles.tab, filter === key && styles.tabActive]}
                        onPress={() => setFilter(key)}
                    >
                        <Text style={[styles.tabText, filter === key && styles.tabTextActive]}>
                            {label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {loading ? (
                <View style={styles.centered}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading events…</Text>
                </View>
            ) : error ? (
                <View style={styles.centered}>
                    <Text style={styles.errorText}>{error}</Text>
                    <Button label="Retry" onPress={fetchEvents} variant="primary" size="md" />
                </View>
            ) : filtered.length === 0 ? (
                <View style={styles.centered}>
                    <Text style={styles.emptyText}>No events found.</Text>
                </View>
            ) : (
                <FlatList
                    data={filtered}
                    keyExtractor={item => item._id}
                    contentContainerStyle={styles.list}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                        <EventCard
                            event={item}
                            isRegistered={registered.includes(item._id)}
                            onRegister={() => toggleRegister(item._id)}
                        />
                    )}
                />
            )}
        </View>
    );
};

// ── EventCard ──────────────────────────────────────────────────────────────────

const EventCard: React.FC<{
    event: ApiEvent;
    isRegistered: boolean;
    onRegister: () => void;
}> = ({ event, isRegistered, onRegister }) => {
    const isOnline = event.venue.isOnline;
    const bannerBg = isOnline ? `${Colors.primary}12` : `${Colors.accent}12`;
    const badgeColor = isOnline ? Colors.primary : Colors.accent;
    const badgeLabel = isOnline ? '🌐 Online' : '📍 Offline';
    const isFree = event.registration.fee.amount === 0;

    return (
        <Card style={styles.eventCard}>
            {/* Featured image */}
            {event.featuredImage?.url ? (
                <Image
                    source={{ uri: event.featuredImage.url }}
                    style={styles.eventImage}
                    resizeMode="cover"
                />
            ) : null}

            {/* Type banner */}
            <View style={[styles.eventBanner, { backgroundColor: bannerBg }]}>
                <View style={styles.bannerLeft}>
                    <Badge label={badgeLabel} color={badgeColor} size="sm" />
                    <Badge
                        label={capitalize(event.eventType)}
                        color={Colors.premium}
                        size="sm"
                    />
                </View>
                <View style={styles.bannerRight}>
                    <Text style={styles.feeLabel}>
                        {isFree
                            ? '🎟️ Free'
                            : `💰 ${event.registration.fee.currency} ${event.registration.fee.amount}`}
                    </Text>
                </View>
            </View>

            {/* Title & description */}
            <Text style={styles.eventTitle}>{event.title}</Text>
            <Text style={styles.eventDesc}>{event.shortDescription || event.description}</Text>

            {/* Details */}
            <View style={styles.detailsGrid}>
                <DetailRow
                    icon="📅"
                    label="Date"
                    value={formatDateRange(event.startDate, event.endDate)}
                />
                <DetailRow
                    icon="🕐"
                    label="Time"
                    value={`${formatTime(event.startTime)} – ${formatTime(event.endTime)}`}
                />
                <DetailRow icon="📍" label="Location" value={getLocation(event.venue)} />
                <DetailRow icon="🏢" label="Organiser" value={event.organizer.name} />
                {event.registrations.length > 0 && (
                    <DetailRow
                        icon="👥"
                        label="Registered"
                        value={`${event.registrations.length} attending`}
                    />
                )}
            </View>

            {/* Tags */}
            {event.tags.length > 0 && (
                <View style={styles.tagsRow}>
                    {event.tags.map(tag => (
                        <View key={tag} style={styles.tag}>
                            <Text style={styles.tagText}>#{tag}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* Actions */}
            <View style={styles.eventActions}>
                {isRegistered ? (
                    <View style={styles.registeredBadge}>
                        <Text style={styles.registeredText}>✓ You are registered!</Text>
                    </View>
                ) : event.registration.isRequired ? (
                    <Button
                        label="Register Now →"
                        onPress={onRegister}
                        variant="primary"
                        fullWidth
                        size="md"
                    />
                ) : (
                    <Button
                        label="Join Event →"
                        onPress={onRegister}
                        variant="primary"
                        fullWidth
                        size="md"
                    />
                )}
                <Button
                    label="+ Add to Calendar"
                    onPress={() => {}}
                    variant="outline"
                    size="md"
                    style={{ marginTop: 10 }}
                    fullWidth
                />
            </View>
        </Card>
    );
};

// ── DetailRow ──────────────────────────────────────────────────────────────────

const DetailRow: React.FC<{ icon: string; label: string; value: string }> = ({
    icon,
    label,
    value,
}) => (
    <View style={styles.detailRow}>
        <Text style={styles.detailIcon}>{icon}</Text>
        <View style={styles.detailText}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={styles.detailValue}>{value}</Text>
        </View>
    </View>
);

// ── Styles ─────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },

    header: {
        backgroundColor: Colors.primaryDark,
        paddingTop: 52,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    headerTitle: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.white },
    headerSub: { fontSize: FontSize.sm, color: `${Colors.white}70`, marginTop: 2 },

    tabs: {
        flexDirection: 'row',
        margin: 16,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: 4,
        ...Shadow.card,
    },
    tab: { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.md, alignItems: 'center' },
    tabActive: { backgroundColor: Colors.primary },
    tabText: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '600' },
    tabTextActive: { color: Colors.white },

    list: { paddingHorizontal: 16, paddingBottom: 100 },

    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32, gap: 12 },
    loadingText: { color: Colors.textSecondary, fontSize: FontSize.sm, marginTop: 8 },
    errorText: {
        color: Colors.error,
        fontSize: FontSize.sm,
        textAlign: 'center',
        marginBottom: 12,
    },
    emptyText: { color: Colors.textMuted, fontSize: FontSize.md },

    eventCard: { marginBottom: 16 },

    eventImage: {
        width: '100%',
        height: 160,
        borderRadius: BorderRadius.md,
        marginBottom: 12,
    },

    eventBanner: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 10,
        borderRadius: BorderRadius.sm,
        marginBottom: 14,
    },
    bannerLeft: { flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
    bannerRight: {},
    feeLabel: { fontSize: FontSize.xs, color: Colors.textSecondary, fontWeight: '700' },

    eventTitle: {
        fontSize: FontSize.xl,
        fontWeight: '900',
        color: Colors.textPrimary,
        marginBottom: 8,
    },
    eventDesc: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        lineHeight: 22,
        marginBottom: 16,
    },

    detailsGrid: { gap: 10, marginBottom: 16 },
    detailRow: { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
    detailIcon: { fontSize: 18, width: 28, marginTop: 1 },
    detailText: { flex: 1 },
    detailLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },
    detailValue: { fontSize: FontSize.sm, color: Colors.textPrimary, fontWeight: '600' },

    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
    tag: {
        backgroundColor: `${Colors.primary}10`,
        borderRadius: BorderRadius.full,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    tagText: { fontSize: FontSize.xs, color: Colors.primary, fontWeight: '600' },

    eventActions: {},
    registeredBadge: {
        backgroundColor: Colors.successLight,
        borderRadius: BorderRadius.md,
        paddingVertical: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: `${Colors.success}30`,
    },
    registeredText: { color: Colors.success, fontWeight: '700', fontSize: FontSize.md },
});

export default EventsScreen;
