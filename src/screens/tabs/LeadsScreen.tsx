import React, { useCallback, useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    Animated,
    Dimensions,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, FontSize, BorderRadius, Shadow } from '../../theme/colors';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { leadsAPI } from '../../service/apis/leadsService';

const { width } = Dimensions.get('window');

type Props = { navigation: any };
type TabKey = 'all' | 'my';

// ─── API Types ────────────────────────────────────────────────────────────────

interface LeadBudget {
    min: number;
    max: number;
    currency: string;
}
interface LeadLocation {
    city: string;
    state: string;
    country: string;
    isRemote: boolean;
}
interface LeadContact {
    preferredMethod: 'email' | 'phone' | 'whatsapp';
    email?: string;
    phone?: string;
}
interface LeadCompany {
    _id: string;
    email: string;
    companyName: string;
    category: string;
    verificationStatus: 'verified' | 'pending';
}

interface Lead {
    _id: string;
    id: string;
    title: string;
    description: string;
    category: string;
    leadType: 'service_required' | 'product_required' | 'partnership' | 'hiring';
    timeline: 'immediate' | 'within_week' | 'within_month' | 'flexible';
    requirements: string[];
    tags: string[];
    budget: LeadBudget;
    location: LeadLocation;
    contactInfo: LeadContact;
    companyId: LeadCompany;
    isPublic: boolean;
    isActive: boolean;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    views: number;
    responseCount: number;
    inquiryCount: number;
    commentCount: number;
    likeCount: number;
    daysRemaining: number;
    expiresAt: string;
    createdAt: string;
    updatedAt: string;
}

interface LeadsResponse {
    leads: Lead[];
    totalLeads: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatBudget = (b: LeadBudget): string => {
    const sym = b.currency === 'INR' ? '₹' : b.currency;
    const fmt = (n: number) =>
        n >= 100000
            ? `${(n / 100000).toFixed(1)}L`
            : n >= 1000
            ? `${(n / 1000).toFixed(0)}K`
            : String(n);
    return `${sym}${fmt(b.min)}–${sym}${fmt(b.max)}`;
};

const TIMELINE_MAP: Record<string, string> = {
    immediate: 'Immediate',
    within_week: 'This Week',
    within_month: 'This Month',
    flexible: 'Flexible',
};

const LEAD_TYPE_MAP: Record<string, string> = {
    service_required: 'Service Required',
    product_required: 'Product Required',
    partnership: 'Partnership',
    hiring: 'Hiring',
};

const PRIORITY_META: Record<string, { color: string; label: string }> = {
    urgent: { color: Colors.error, label: 'URGENT' },
    high: { color: Colors.accent, label: 'HIGH' },
    medium: { color: Colors.primary, label: 'MEDIUM' },
    low: { color: Colors.success, label: 'LOW' },
};

const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

// ─── Screen ───────────────────────────────────────────────────────────────────

const LeadsScreen: React.FC<Props> = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState<TabKey>('all');
    const [allLeads, setAllLeads] = useState<Lead[]>([]);
    const [myLeads, setMyLeads] = useState<Lead[]>([]);
    const [allMeta, setAllMeta] = useState<Omit<LeadsResponse, 'leads'> | null>(null);
    const [myMeta, setMyMeta] = useState<Omit<LeadsResponse, 'leads'> | null>(null);
    const [savedLeads, setSavedLeads] = useState<Set<string>>(new Set());
    const [loadingAll, setLoadingAll] = useState(true);
    const [loadingMy, setLoadingMy] = useState(true);
    const [refreshingAll, setRefreshingAll] = useState(false);
    const [refreshingMy, setRefreshingMy] = useState(false);

    const tabIndicator = useRef(new Animated.Value(0)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;

    const switchTab = (tab: TabKey) => {
        Animated.parallel([
            Animated.timing(tabIndicator, {
                toValue: tab === 'all' ? 0 : 1,
                duration: 220,
                useNativeDriver: false,
            }),
            Animated.sequence([
                Animated.timing(fadeAnim, { toValue: 0.4, duration: 80, useNativeDriver: true }),
                Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }),
            ]),
        ]).start();
        setActiveTab(tab);
    };

    const fetchAllLeads = useCallback(async (isRefresh = false) => {
        try {
            isRefresh ? setRefreshingAll(true) : setLoadingAll(true);
            const response = await leadsAPI.publicGetAll();
            if (response.data?.success) {
                const d: LeadsResponse = response.data.data;
                setAllLeads(d.leads);
                setAllMeta({
                    totalLeads: d.totalLeads,
                    totalPages: d.totalPages,
                    currentPage: d.currentPage,
                    hasNextPage: d.hasNextPage,
                    hasPrevPage: d.hasPrevPage,
                });
            }
        } catch (error: any) {
            console.error('Error fetching all leads:', error?.message);
        } finally {
            setLoadingAll(false);
            setRefreshingAll(false);
        }
    }, []);

    const fetchMyLeads = useCallback(async (isRefresh = false) => {
        try {
            isRefresh ? setRefreshingMy(true) : setLoadingMy(true);
            const response = await leadsAPI.getMyLeads();
            if (response.data?.success) {
                const d: LeadsResponse = response.data.data;
                setMyLeads(d.leads);
                setMyMeta({
                    totalLeads: d.totalLeads,
                    totalPages: d.totalPages,
                    currentPage: d.currentPage,
                    hasNextPage: d.hasNextPage,
                    hasPrevPage: d.hasPrevPage,
                });
            }
        } catch (error: any) {
            console.error('Error fetching my leads:', error?.message);
        } finally {
            setLoadingMy(false);
            setRefreshingMy(false);
        }
    }, []);

    useEffect(() => {
        fetchAllLeads();
        fetchMyLeads();
    }, []);

    const toggleSave = (id: string) =>
        setSavedLeads(prev => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });

    const isAll = activeTab === 'all';
    const leads = isAll ? allLeads : myLeads;
    const meta = isAll ? allMeta : myMeta;
    const loading = isAll ? loadingAll : loadingMy;
    const refreshing = isAll ? refreshingAll : refreshingMy;
    const onRefresh = () => (isAll ? fetchAllLeads(true) : fetchMyLeads(true));

    const tabSliderLeft = tabIndicator.interpolate({
        inputRange: [0, 1],
        outputRange: [4, (width - 32) / 2 + 4],
    });

    return (
        <View style={styles.container}>
            {/* ── Header ── */}
            <View style={styles.header}>
                <View style={styles.headerTop}>
                    <View>
                        <Text style={styles.headerTitle}>Business Leads</Text>
                        <Text style={styles.headerSub}>Verified client requirements</Text>
                    </View>
                    {meta && (
                        <View style={styles.countPill}>
                            <Text style={styles.countText}>{meta.totalLeads} leads</Text>
                        </View>
                    )}
                </View>

                {/* ── Tabs ── */}
                <View style={styles.tabsContainer}>
                    <Animated.View style={[styles.tabSlider, { left: tabSliderLeft }]} />

                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => switchTab('all')}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="globe-outline"
                            size={15}
                            color={isAll ? Colors.white : 'rgba(255,255,255,0.55)'}
                        />
                        <Text style={[styles.tabLabel, isAll && styles.tabLabelActive]}>
                            All Leads
                        </Text>
                        {allMeta && (
                            <View style={[styles.tabBadge, isAll && styles.tabBadgeActive]}>
                                <Text
                                    style={[
                                        styles.tabBadgeText,
                                        isAll && styles.tabBadgeTextActive,
                                    ]}
                                >
                                    {allMeta.totalLeads}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.tab}
                        onPress={() => switchTab('my')}
                        activeOpacity={0.8}
                    >
                        <Ionicons
                            name="person-outline"
                            size={15}
                            color={!isAll ? Colors.white : 'rgba(255,255,255,0.55)'}
                        />
                        <Text style={[styles.tabLabel, !isAll && styles.tabLabelActive]}>
                            My Leads
                        </Text>
                        {myMeta && (
                            <View style={[styles.tabBadge, !isAll && styles.tabBadgeActive]}>
                                <Text
                                    style={[
                                        styles.tabBadgeText,
                                        !isAll && styles.tabBadgeTextActive,
                                    ]}
                                >
                                    {myMeta.totalLeads}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── List ── */}
            {loading ? (
                <View style={styles.centred}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loadingText}>Loading leads...</Text>
                </View>
            ) : (
                <Animated.View style={[{ flex: 1 }, { opacity: fadeAnim }]}>
                    <FlatList
                        data={leads}
                        keyExtractor={item => item._id}
                        contentContainerStyle={styles.list}
                        showsVerticalScrollIndicator={false}
                        refreshControl={
                            <RefreshControl
                                refreshing={refreshing}
                                onRefresh={onRefresh}
                                colors={[Colors.primary]}
                                tintColor={Colors.primary}
                            />
                        }
                        ListHeaderComponent={
                            activeTab === 'my' && myLeads.length > 0 ? (
                                <TouchableOpacity
                                    style={styles.postLeadBtn}
                                    onPress={() => navigation.navigate('PostLead')}
                                    activeOpacity={0.85}
                                >
                                    <View style={styles.postLeadIcon}>
                                        <Ionicons name="add" size={18} color={Colors.white} />
                                    </View>
                                    <Text style={styles.postLeadText}>Post a New Lead</Text>
                                    <Ionicons
                                        name="chevron-forward"
                                        size={16}
                                        color={Colors.accent}
                                    />
                                </TouchableOpacity>
                            ) : null
                        }
                        ListEmptyComponent={
                            <View style={styles.empty}>
                                <View style={styles.emptyIconBox}>
                                    <Ionicons
                                        name={isAll ? 'briefcase-outline' : 'person-outline'}
                                        size={40}
                                        color={Colors.primary}
                                    />
                                </View>
                                <Text style={styles.emptyTitle}>
                                    {isAll ? 'No leads available' : 'No leads posted yet'}
                                </Text>
                                <Text style={styles.emptyText}>
                                    {isAll
                                        ? 'Check back later for new opportunities'
                                        : 'Post your first requirement to get started'}
                                </Text>
                                {!isAll && (
                                    <TouchableOpacity
                                        style={styles.emptyAction}
                                        onPress={() => navigation.navigate('PostLead')}
                                    >
                                        <Text style={styles.emptyActionText}>Post a Lead →</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        }
                        renderItem={({ item, index }) => (
                            <LeadCard
                                lead={item}
                                isSaved={savedLeads.has(item._id)}
                                onSave={() => toggleSave(item._id)}
                                onContact={() => navigation.navigate('Membership')}
                                index={index}
                            />
                        )}
                    />
                </Animated.View>
            )}
        </View>
    );
};

// ─── Lead Card ────────────────────────────────────────────────────────────────

const LeadCard: React.FC<{
    lead: Lead;
    isSaved: boolean;
    onSave: () => void;
    onContact: () => void;
    index: number;
}> = ({ lead, isSaved, onSave, onContact, index }) => {
    const pMeta = PRIORITY_META[lead.priority] ?? PRIORITY_META.medium;
    const isExpiringSoon = lead.daysRemaining <= 7;
    const isHighPriority = lead.priority === 'urgent' || lead.priority === 'high';

    return (
        <Card style={styles.card}>
            {/* Priority stripe */}
            {isHighPriority && (
                <View style={[styles.priorityStripe, { backgroundColor: pMeta.color }]} />
            )}

            {/* ── Header ── */}
            <View style={styles.cardHeader}>
                <View style={[styles.cardIconBox, { backgroundColor: `${Colors.primary}12` }]}>
                    <Ionicons name="briefcase-outline" size={20} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.leadTitle} numberOfLines={2}>
                        {lead.title}
                    </Text>
                    <View style={styles.companyRow}>
                        {lead.companyId?.verificationStatus === 'verified' && (
                            <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
                        )}
                        <Text style={styles.companyName} numberOfLines={1}>
                            {lead.companyId?.companyName}
                        </Text>
                        <Text style={styles.dot}>·</Text>
                        <Text style={styles.postedDate}>{formatDate(lead.createdAt)}</Text>
                    </View>
                </View>
                <View style={styles.cardActions}>
                    {isHighPriority && (
                        <View
                            style={[styles.priorityPill, { backgroundColor: `${pMeta.color}15` }]}
                        >
                            <Text style={[styles.priorityText, { color: pMeta.color }]}>
                                {pMeta.label}
                            </Text>
                        </View>
                    )}
                    <TouchableOpacity
                        onPress={onSave}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                        <Ionicons
                            name={isSaved ? 'bookmark' : 'bookmark-outline'}
                            size={20}
                            color={isSaved ? Colors.primary : Colors.textMuted}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* ── Description ── */}
            <Text style={styles.description} numberOfLines={3}>
                {lead.description}
            </Text>

            {/* ── Tags ── */}
            {[...lead.requirements, ...lead.tags].length > 0 && (
                <View style={styles.tagsRow}>
                    {[...lead.requirements, ...lead.tags].slice(0, 5).map((t, i) => (
                        <View key={i} style={styles.tag}>
                            <Text style={styles.tagText}>{t}</Text>
                        </View>
                    ))}
                </View>
            )}

            {/* ── Meta tiles ── */}
            <View style={styles.metaRow}>
                <MetaTile
                    icon="cash-outline"
                    label={formatBudget(lead.budget)}
                    color={Colors.success}
                />
                <MetaTile
                    icon="location-outline"
                    label={lead.location.isRemote ? 'Remote' : lead.location.city}
                    color={Colors.primary}
                />
                <MetaTile
                    icon="time-outline"
                    label={TIMELINE_MAP[lead.timeline] ?? lead.timeline}
                    color={Colors.accent}
                />
                <MetaTile icon="grid-outline" label={lead.category} color={Colors.premium} />
            </View>

            {/* ── Stats ── */}
            <View style={styles.statsRow}>
                <StatChip icon="eye-outline" value={lead.views} label="views" />
                <StatChip icon="chatbubble-outline" value={lead.responseCount} label="replies" />
                <StatChip icon="heart-outline" value={lead.likeCount} label="likes" />
                <View style={{ flex: 1 }} />
                <View
                    style={[
                        styles.expiryChip,
                        { backgroundColor: isExpiringSoon ? Colors.errorLight : Colors.background },
                    ]}
                >
                    <Ionicons
                        name="hourglass-outline"
                        size={11}
                        color={isExpiringSoon ? Colors.error : Colors.textMuted}
                    />
                    <Text
                        style={[
                            styles.expiryText,
                            { color: isExpiringSoon ? Colors.error : Colors.textMuted },
                        ]}
                    >
                        {lead.daysRemaining}d left
                    </Text>
                </View>
            </View>

            <View style={styles.divider} />

            {/* ── Footer ── */}
            <View style={styles.footer}>
                <View style={styles.leadTypeBadge}>
                    <Ionicons name="layers-outline" size={12} color={Colors.textSecondary} />
                    <Text style={styles.leadTypeText}>
                        {LEAD_TYPE_MAP[lead.leadType] ?? lead.leadType}
                    </Text>
                </View>
                <Button
                    label={isHighPriority ? 'Unlock Contact' : 'Contact Now'}
                    onPress={onContact}
                    variant={isHighPriority ? 'primary' : 'accent'}
                    size="sm"
                />
            </View>
        </Card>
    );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const MetaTile: React.FC<{ icon: string; label: string; color: string }> = ({
    icon,
    label,
    color,
}) => (
    <View style={[styles.metaTile, { backgroundColor: `${color}10` }]}>
        <Ionicons name={icon as any} size={12} color={color} />
        <Text style={[styles.metaTileText, { color }]} numberOfLines={1}>
            {label}
        </Text>
    </View>
);

const StatChip: React.FC<{ icon: string; value: number; label: string }> = ({
    icon,
    value,
    label,
}) => (
    <View style={styles.statChip}>
        <Ionicons name={icon as any} size={12} color={Colors.textMuted} />
        <Text style={styles.statChipText}>
            {value} {label}
        </Text>
    </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    centred: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 10 },
    loadingText: { fontSize: FontSize.md, color: Colors.textMuted },

    // Header
    header: {
        backgroundColor: Colors.primaryDark,
        paddingTop: 26,
        paddingBottom: 0,
        paddingHorizontal: 16,
    },
    headerTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 20,
    },
    headerTitle: {
        fontSize: FontSize.xxl,
        fontWeight: '900',
        color: Colors.white,
        letterSpacing: -0.5,
    },
    headerSub: { fontSize: FontSize.sm, color: 'rgba(255,255,255,0.6)', marginTop: 3 },
    countPill: {
        backgroundColor: 'rgba(255,255,255,0.15)',
        borderRadius: BorderRadius.full,
        paddingHorizontal: 12,
        paddingVertical: 5,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    countText: { fontSize: FontSize.sm, color: Colors.white, fontWeight: '700' },

    // Tabs
    tabsContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 14,
        padding: 4,
        marginBottom: 16,
        position: 'relative',
    },
    tabSlider: {
        position: 'absolute',
        top: 4,
        width: (width - 32 - 8) / 2,
        bottom: 4,
        backgroundColor: Colors.primary,
        borderRadius: 10,
        ...Shadow.button,
    },
    tab: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 11,
        gap: 7,
        zIndex: 2,
    },
    tabLabel: {
        fontSize: FontSize.sm,
        fontWeight: '700',
        color: 'rgba(255,255,255,0.55)',
    },
    tabLabelActive: { color: Colors.white },
    tabBadge: {
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: BorderRadius.full,
        paddingHorizontal: 7,
        paddingVertical: 1,
        minWidth: 22,
        alignItems: 'center',
    },
    tabBadgeActive: { backgroundColor: 'rgba(255,255,255,0.25)' },
    tabBadgeText: { fontSize: 10, fontWeight: '800', color: 'rgba(255,255,255,0.6)' },
    tabBadgeTextActive: { color: Colors.white },

    // List
    list: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 100 },

    // Post lead prompt
    postLeadBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: 14,
        marginBottom: 14,
        borderWidth: 1.5,
        borderColor: `${Colors.accent}30`,
        borderStyle: 'dashed',
    },
    postLeadIcon: {
        width: 32,
        height: 32,
        borderRadius: 10,
        backgroundColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
    },
    postLeadText: { flex: 1, fontSize: FontSize.md, fontWeight: '700', color: Colors.accent },

    // Empty
    empty: { alignItems: 'center', paddingVertical: 60, gap: 12 },
    emptyIconBox: {
        width: 80,
        height: 80,
        borderRadius: 24,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,
    },
    emptyTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
    emptyText: {
        fontSize: FontSize.md,
        color: Colors.textMuted,
        textAlign: 'center',
        paddingHorizontal: 32,
    },
    emptyAction: {
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        paddingHorizontal: 24,
        paddingVertical: 12,
        marginTop: 4,
    },
    emptyActionText: { color: Colors.white, fontSize: FontSize.md, fontWeight: '800' },

    // Card
    card: { marginBottom: 14, overflow: 'hidden' },
    priorityStripe: { height: 3, marginHorizontal: -16, marginTop: -16, marginBottom: 14 },

    cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
    cardIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    leadTitle: {
        fontSize: FontSize.md,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 4,
    },
    companyRow: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    companyName: { fontSize: 12, color: Colors.textSecondary, fontWeight: '600' },
    dot: { color: Colors.textMuted },
    postedDate: { fontSize: 11, color: Colors.textMuted },
    cardActions: { alignItems: 'flex-end', gap: 6 },
    priorityPill: { borderRadius: BorderRadius.full, paddingHorizontal: 8, paddingVertical: 3 },
    priorityText: { fontSize: 10, fontWeight: '800' },

    description: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        lineHeight: 20,
        marginBottom: 12,
    },

    tagsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
    tag: {
        backgroundColor: `${Colors.primary}10`,
        borderRadius: BorderRadius.full,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderWidth: 1,
        borderColor: `${Colors.primary}20`,
    },
    tagText: { fontSize: 11, color: Colors.primary, fontWeight: '600' },

    metaRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
    metaTile: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        borderRadius: BorderRadius.full,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    metaTileText: { fontSize: 11, fontWeight: '700' },

    statsRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
    statChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    statChipText: { fontSize: 11, color: Colors.textMuted },
    expiryChip: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderRadius: BorderRadius.full,
        paddingHorizontal: 8,
        paddingVertical: 4,
    },
    expiryText: { fontSize: 11, fontWeight: '700' },

    divider: { height: 1, backgroundColor: Colors.border, marginBottom: 12 },

    footer: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    leadTypeBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.full,
        paddingHorizontal: 10,
        paddingVertical: 5,
    },
    leadTypeText: { fontSize: 11, color: Colors.textSecondary, fontWeight: '600' },
});

export default LeadsScreen;
