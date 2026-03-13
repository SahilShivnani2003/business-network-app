import React, { useCallback, useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, FontSize, BorderRadius, Shadow, Spacing } from '../../theme/colors';
import { Badge } from '../../components/ui/Badge';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { leadsAPI } from '../../service/apis/leadsService';

type Props = { navigation: any };

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
    const [leads, setLeads] = useState<Lead[]>([]);
    const [meta, setMeta] = useState<Omit<LeadsResponse, 'leads'> | null>(null);
    const [savedLeads, setSavedLeads] = useState<Set<string>>(new Set());
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchLeads = useCallback(async (isRefresh = false) => {
        try {
            isRefresh ? setRefreshing(true) : setLoading(true);
            const response = await leadsAPI.getMyLeads();
            if (response.data?.success) {
                const d: LeadsResponse = response.data.data;
                setLeads(d.leads);
                setMeta({
                    totalLeads: d.totalLeads,
                    totalPages: d.totalPages,
                    currentPage: d.currentPage,
                    hasNextPage: d.hasNextPage,
                    hasPrevPage: d.hasPrevPage,
                });
            }
        } catch (error: any) {
            console.error('Error fetching leads:', error?.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    }, []);

    useEffect(() => {
        fetchLeads();
    }, []);

    const toggleSave = (id: string) =>
        setSavedLeads(prev => {
            const n = new Set(prev);
            n.has(id) ? n.delete(id) : n.add(id);
            return n;
        });

    if (loading) {
        return (
            <View style={styles.centred}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading leads...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* ── Header ── */}
            <View style={styles.header}>
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

            {/* ── Premium banner ── */}
            <View style={styles.premiumBanner}>
                <View style={styles.premiumIconWrap}>
                    <Ionicons name="star" size={22} color={Colors.premium} />
                </View>
                <View style={{ flex: 1 }}>
                    <Text style={styles.premiumTitle}>Premium Leads Access</Text>
                    <Text style={styles.premiumSub}>Upgrade to contact all leads directly</Text>
                </View>
                <TouchableOpacity
                    style={styles.upgradeBtn}
                    onPress={() => navigation.navigate('Membership')}
                >
                    <Text style={styles.upgradeBtnText}>Upgrade</Text>
                </TouchableOpacity>
            </View>

            {/* ── List ── */}
            <FlatList
                data={leads}
                keyExtractor={item => item._id}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => fetchLeads(true)}
                        colors={[Colors.primary]}
                        tintColor={Colors.primary}
                    />
                }
                ListEmptyComponent={
                    <View style={styles.empty}>
                        <Ionicons name="briefcase-outline" size={52} color={Colors.textMuted} />
                        <Text style={styles.emptyTitle}>No leads found</Text>
                        <Text style={styles.emptyText}>Post your requirements to get started</Text>
                    </View>
                }
                renderItem={({ item }) => (
                    <LeadCard
                        lead={item}
                        isSaved={savedLeads.has(item._id)}
                        onSave={() => toggleSave(item._id)}
                        onContact={() => navigation.navigate('Membership')}
                    />
                )}
            />
        </View>
    );
};

// ─── Lead Card ────────────────────────────────────────────────────────────────

const LeadCard: React.FC<{
    lead: Lead;
    isSaved: boolean;
    onSave: () => void;
    onContact: () => void;
}> = ({ lead, isSaved, onSave, onContact }) => {
    const pMeta = PRIORITY_META[lead.priority] ?? PRIORITY_META.medium;
    const isExpiringSoon = lead.daysRemaining <= 7;
    const isHighPriority = lead.priority === 'urgent' || lead.priority === 'high';

    return (
        <Card style={styles.card}>
            {/* ── Header ── */}
            <View style={styles.cardHeader}>
                <View style={styles.cardIconBox}>
                    <Ionicons name="briefcase-outline" size={20} color={Colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                    <View style={styles.titleRow}>
                        <Text style={styles.leadTitle} numberOfLines={2}>
                            {lead.title}
                        </Text>
                    </View>
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

            {/* ── Engagement stats ── */}
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

    header: {
        backgroundColor: Colors.primaryDark,
        paddingTop: 52,
        paddingBottom: 20,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    headerTitle: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.white },
    headerSub: { fontSize: FontSize.sm, color: `${Colors.white}70`, marginTop: 2 },
    countPill: {
        backgroundColor: `${Colors.white}20`,
        borderRadius: BorderRadius.full,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    countText: { fontSize: FontSize.sm, color: Colors.white, fontWeight: '700' },

    premiumBanner: {
        margin: 16,
        backgroundColor: `${Colors.premium}12`,
        borderRadius: BorderRadius.lg,
        padding: 14,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        borderWidth: 1,
        borderColor: `${Colors.premium}25`,
    },
    premiumIconWrap: {
        width: 40,
        height: 40,
        borderRadius: 12,
        backgroundColor: `${Colors.premium}18`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    premiumTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.premium },
    premiumSub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
    upgradeBtn: {
        backgroundColor: Colors.premium,
        borderRadius: BorderRadius.md,
        paddingHorizontal: 14,
        paddingVertical: 9,
    },
    upgradeBtnText: { color: Colors.white, fontSize: FontSize.sm, fontWeight: '700' },

    list: { paddingHorizontal: 16, paddingBottom: 100 },
    empty: { alignItems: 'center', paddingVertical: 60, gap: 10 },
    emptyTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
    emptyText: { fontSize: FontSize.md, color: Colors.textMuted },

    // Card
    card: { marginBottom: 14 },

    cardHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, marginBottom: 10 },
    cardIconBox: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: `${Colors.primary}12`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    leadTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.textPrimary, flex: 1 },
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
