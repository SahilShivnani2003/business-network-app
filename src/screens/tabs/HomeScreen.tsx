import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Dimensions,
    ActivityIndicator,
    RefreshControl,
    Animated,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Colors, FontSize, Spacing, BorderRadius, Shadow } from '../../theme/colors';
import { Avatar } from '../../components/ui/Avatar';
import { Button } from '../../components/ui/Button';
import { dashboardAPI } from '../../service/apis/dashboardService';

const { width } = Dimensions.get('window');
const CARD_W = (width - 48 - 12) / 2;

// ─── Types ────────────────────────────────────────────────────────────────────

interface RecentUser {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: 'user' | 'admin';
    createdAt: string;
}
interface RecentCompany {
    _id: string;
    email: string;
    companyName: string;
    verificationStatus: 'verified' | 'pending' | 'rejected';
    createdAt: string;
}

interface DashboardStats {
    totalUsers: number;
    newUsersToday: number;
    adminUsers: number;
    regularUsers: number;
    usersThisMonth: number;
    recentUsers: RecentUser[];
    totalCompanies: number;
    verifiedCompanies: number;
    pendingCompanies: number;
    companiesThisMonth: number;
    recentCompanies: RecentCompany[];
    totalLeads: number;
    activeLeads: number;
    leadsThisMonth: number;
    totalRequirements: number;
    activeRequirements: number;
    requirementsThisMonth: number;
    totalEvents: number;
    upcomingEvents: number;
    totalSubscriptions: number;
    activeSubscriptions: number;
    monthlyRevenue: number;
    activeSessions: number;
    issues: number;
}

interface DashboardUsers {
    users: RecentUser[];
    totalUsers: number;
    totalPages: number;
    currentPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

type Props = { navigation: any };

// ─── Quick actions ────────────────────────────────────────────────────────────

const QUICK = [
    {
        label: 'Find Clients',
        icon: 'search',
        color: Colors.primary,
        bg: `${Colors.primary}14`,
        screen: 'Network',
    },
    {
        label: 'Post Help',
        icon: 'megaphone',
        color: Colors.accent,
        bg: `${Colors.accent}14`,
        screen: 'CommunityHelp',
    },
    {
        label: 'Join Group',
        icon: 'chatbubbles',
        color: Colors.success,
        bg: `${Colors.success}14`,
        screen: 'WhatsAppGroups',
    },
    {
        label: 'Events',
        icon: 'calendar',
        color: Colors.premium,
        bg: `${Colors.premium}14`,
        screen: 'Events',
    },
] as const;

const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good Morning ☀️' : h < 17 ? 'Good Afternoon 🌤' : 'Good Evening 🌙';
};

// ─── Screen ───────────────────────────────────────────────────────────────────

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [users, setUsers] = useState<DashboardUsers | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;

    const fetchData = useCallback(async (isRefresh = false) => {
        try {
            isRefresh ? setRefreshing(true) : setLoading(true);
            const [dStats, dUsers] = await Promise.all([
                dashboardAPI.stats(),
                dashboardAPI.users(),
            ]);
            if (dStats.data?.success) setStats(dStats.data.data as DashboardStats);
            if (dUsers.data?.success) setUsers(dUsers.data.data as DashboardUsers);
        } catch (e: any) {
            console.error('Dashboard error:', e?.message);
        } finally {
            setLoading(false);
            setRefreshing(false);
            Animated.parallel([
                Animated.timing(fadeAnim, { toValue: 1, duration: 480, useNativeDriver: true }),
                Animated.timing(slideAnim, { toValue: 0, duration: 420, useNativeDriver: true }),
            ]).start();
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loader}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loaderText}>Loading dashboard…</Text>
            </View>
        );
    }

    return (
        <ScrollView
            style={styles.root}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => fetchData(true)}
                    colors={[Colors.primary]}
                    tintColor={Colors.primary}
                />
            }
        >
            <StatusBar barStyle="light-content" backgroundColor={Colors.primaryDark} />

            {/* ═══════════════════════════════════════
                HERO
            ═══════════════════════════════════════ */}
            <View style={styles.hero}>
                {/* Top bar */}
                <View style={styles.heroBar}>
                    <View>
                        <Text style={styles.greetingText}>{greeting()}</Text>
                        <Text style={styles.heroTitle}>iNEXT Dashboard</Text>
                    </View>
                    <View style={styles.heroBarRight}>
                        <TouchableOpacity
                            style={styles.iconBtn}
                            onPress={() => navigation.navigate('Notifications')}
                        >
                            <Ionicons name="notifications-outline" size={22} color={Colors.white} />
                            {(stats?.issues ?? 0) > 0 && (
                                <View style={styles.badge}>
                                    <Text style={styles.badgeText}>{stats!.issues}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
                            <View style={styles.avatarRing}>
                                <Avatar name="User" size={36} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Sessions pill */}
                {stats && (
                    <View style={styles.sessionPill}>
                        <View style={styles.pulse} />
                        <Text style={styles.sessionLabel}>
                            {stats.activeSessions} active sessions
                        </Text>
                    </View>
                )}

                {/* ── 4 hero stat cards ── */}
                <Animated.View
                    style={[
                        styles.heroCards,
                        { opacity: fadeAnim, transform: [{ translateY: slideAnim }] },
                    ]}
                >
                    <HeroStat
                        label="Active Leads"
                        value={stats?.activeLeads ?? 0}
                        icon="trending-up"
                        color={Colors.accent}
                    />
                    <HeroStat
                        label="Companies"
                        value={stats?.verifiedCompanies ?? 0}
                        icon="business"
                        color={Colors.white}
                    />
                    <HeroStat
                        label="Events"
                        value={stats?.upcomingEvents ?? 0}
                        icon="calendar"
                        color={Colors.success}
                    />
                    <HeroStat
                        label="Members"
                        value={stats?.regularUsers ?? 0}
                        icon="people"
                        color={Colors.premium}
                    />
                </Animated.View>
            </View>

            {/* ═══════════════════════════════════════
                BODY
            ═══════════════════════════════════════ */}
            <Animated.View style={[styles.body, { opacity: fadeAnim }]}>
                {/* ── Secondary strip ── */}
                {stats && (
                    <View style={styles.secStrip}>
                        <SecItem
                            icon="person-add-outline"
                            label="New Today"
                            value={stats.newUsersToday}
                            color={Colors.success}
                        />
                        <View style={styles.stripDiv} />
                        <SecItem
                            icon="checkmark-circle-outline"
                            label="Verified"
                            value={stats.verifiedCompanies}
                            color={Colors.primary}
                        />
                        <View style={styles.stripDiv} />
                        <SecItem
                            icon="time-outline"
                            label="Pending"
                            value={stats.pendingCompanies}
                            color={Colors.warning}
                        />
                        <View style={styles.stripDiv} />
                        <SecItem
                            icon="flash-outline"
                            label="This Month"
                            value={stats.usersThisMonth}
                            color={Colors.accent}
                        />
                    </View>
                )}

                {/* ── Quick Actions ── */}
                <Section title="Quick Actions">
                    <View style={styles.quickGrid}>
                        {QUICK.map(a => (
                            <TouchableOpacity
                                key={a.label}
                                style={[styles.quickTile, { backgroundColor: a.bg }]}
                                onPress={() => navigation.navigate(a.screen)}
                                activeOpacity={0.78}
                            >
                                <View
                                    style={[
                                        styles.quickCircle,
                                        { backgroundColor: `${a.color}22` },
                                    ]}
                                >
                                    <Ionicons name={a.icon as any} size={24} color={a.color} />
                                </View>
                                <Text style={[styles.quickLabel, { color: a.color }]}>
                                    {a.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </Section>

                {/* ── Leads Banner ── */}
                {stats && (
                    <View style={styles.leadsBanner}>
                        <View style={styles.leadsBannerLeft}>
                            <View style={styles.leadsBadge}>
                                <Ionicons name="flash" size={11} color={Colors.accent} />
                                <Text style={styles.leadsBadgeText}>ACTIVE LEADS</Text>
                            </View>
                            <Text style={styles.leadsBannerNum}>{stats.activeLeads}</Text>
                            <Text style={styles.leadsBannerLabel}>leads this month</Text>
                            <Text style={styles.leadsBannerSub}>
                                {stats.leadsThisMonth} new added recently
                            </Text>
                            <TouchableOpacity
                                style={styles.leadsBtn}
                                onPress={() => navigation.navigate('Leads')}
                            >
                                <Text style={styles.leadsBtnText}>View Leads</Text>
                                <Ionicons name="arrow-forward" size={14} color={Colors.white} />
                            </TouchableOpacity>
                        </View>
                        <View style={styles.leadsBannerRight}>
                            <Ionicons name="trending-up" size={64} color={`${Colors.accent}30`} />
                        </View>
                    </View>
                )}

                {/* ── Recent Members ── */}
                {(users?.users?.length ?? 0) > 0 && (
                    <Section
                        title="Recent Members"
                        actionLabel="View All"
                        onAction={() => navigation.navigate('Network')}
                    >
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingRight: 4 }}
                        >
                            {users!.users.map(u => (
                                <MemberPill key={u._id} user={u} />
                            ))}
                        </ScrollView>
                    </Section>
                )}

                {/* ── Recent Companies ── */}
                {(stats?.recentCompanies?.length ?? 0) > 0 && (
                    <Section
                        title="Recent Companies"
                        actionLabel="View All"
                        onAction={() => navigation.navigate('Network')}
                    >
                        {stats!.recentCompanies.map((c, i) => (
                            <CompanyRow
                                key={c._id}
                                company={c}
                                isLast={i === stats!.recentCompanies.length - 1}
                            />
                        ))}
                    </Section>
                )}

                {/* ── Platform Overview ── */}
                {stats && (
                    <Section title="Platform Overview">
                        <View style={styles.overGrid}>
                            <OverTile
                                icon="people"
                                label="Total Users"
                                value={stats.totalUsers}
                                color={Colors.primary}
                            />
                            <OverTile
                                icon="business"
                                label="Companies"
                                value={stats.totalCompanies}
                                color={Colors.accent}
                            />
                            <OverTile
                                icon="star"
                                label="Subscriptions"
                                value={stats.totalSubscriptions}
                                color={Colors.premium}
                            />
                            <OverTile
                                icon="calendar"
                                label="Events"
                                value={stats.totalEvents}
                                color={Colors.success}
                            />
                            <OverTile
                                icon="cube"
                                label="Requirements"
                                value={stats.totalRequirements}
                                color={Colors.warning}
                            />
                            <OverTile
                                icon="cash"
                                label="Revenue"
                                value={`₹${stats.monthlyRevenue}`}
                                color={Colors.success}
                                isStr
                            />
                        </View>
                    </Section>
                )}

                {/* ── Community ── */}
                <TouchableOpacity
                    style={styles.community}
                    onPress={() => navigation.navigate('CommunityHelp')}
                    activeOpacity={0.85}
                >
                    <View style={styles.communityIcon}>
                        <Ionicons name="earth" size={26} color={Colors.primary} />
                    </View>
                    <View style={{ flex: 1 }}>
                        <Text style={styles.communityTitle}>Community Help Board</Text>
                        <Text style={styles.communitySub}>
                            Post your business needs · Get community support
                        </Text>
                    </View>
                    <View style={styles.communityArrow}>
                        <Ionicons name="chevron-forward" size={18} color={Colors.primary} />
                    </View>
                </TouchableOpacity>

                <View style={{ height: 100 }} />
            </Animated.View>
        </ScrollView>
    );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

/** Hero stat — inside blue header */
const HeroStat: React.FC<{ label: string; value: number; icon: string; color: string }> = ({
    label,
    value,
    icon,
    color,
}) => (
    <View style={hStyles.wrap}>
        <View style={[hStyles.iconBox, { backgroundColor: `${color}25` }]}>
            <Ionicons name={icon as any} size={18} color={color} />
        </View>
        <Text style={hStyles.value}>{value}</Text>
        <Text style={hStyles.label}>{label}</Text>
    </View>
);

const hStyles = StyleSheet.create({
    wrap: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: `${Colors.white}12`,
        borderRadius: BorderRadius.lg,
        paddingVertical: 14,
        marginHorizontal: 4,
    },
    iconBox: {
        width: 36,
        height: 36,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 8,
    },
    value: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.white, lineHeight: 28 },
    label: {
        fontSize: 10,
        color: `${Colors.white}80`,
        fontWeight: '600',
        marginTop: 3,
        textAlign: 'center',
    },
});

/** Secondary strip item */
const SecItem: React.FC<{ icon: string; label: string; value: number; color: string }> = ({
    icon,
    label,
    value,
    color,
}) => (
    <View style={secStyles.wrap}>
        <View style={[secStyles.iconCircle, { backgroundColor: `${color}14` }]}>
            <Ionicons name={icon as any} size={14} color={color} />
        </View>
        <Text style={[secStyles.value, { color }]}>{value}</Text>
        <Text style={secStyles.label}>{label}</Text>
    </View>
);

const secStyles = StyleSheet.create({
    wrap: { flex: 1, alignItems: 'center', gap: 4 },
    iconCircle: {
        width: 30,
        height: 30,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: { fontSize: FontSize.lg, fontWeight: '900' },
    label: { fontSize: 10, color: Colors.textMuted, fontWeight: '600' },
});

/** Reusable section wrapper */
const Section: React.FC<{
    title: string;
    actionLabel?: string;
    onAction?: () => void;
    children: React.ReactNode;
}> = ({ title, actionLabel, onAction, children }) => (
    <View style={secWrapStyles.wrap}>
        <View style={secWrapStyles.header}>
            <Text style={secWrapStyles.title}>{title}</Text>
            {actionLabel && (
                <TouchableOpacity onPress={onAction}>
                    <Text style={secWrapStyles.action}>{actionLabel}</Text>
                </TouchableOpacity>
            )}
        </View>
        {children}
    </View>
);

const secWrapStyles = StyleSheet.create({
    wrap: { marginBottom: Spacing.lg },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 14,
    },
    title: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
    action: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '700' },
});

/** Member pill card */
const MemberPill: React.FC<{ user: RecentUser }> = ({ user }) => (
    <View style={mpStyles.wrap}>
        <View style={{ position: 'relative' }}>
            <Avatar name={user.name} size={52} />
            {user.role === 'admin' && (
                <View style={mpStyles.adminDot}>
                    <Ionicons name="shield-checkmark" size={8} color={Colors.white} />
                </View>
            )}
        </View>
        <Text style={mpStyles.name} numberOfLines={1}>
            {user.name.split(' ')[0]}
        </Text>
        <Text style={mpStyles.role}>{user.role}</Text>
        <View style={mpStyles.actions}>
            <TouchableOpacity style={[mpStyles.btn, { backgroundColor: Colors.primary }]}>
                <Ionicons name="person-add-outline" size={12} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={[mpStyles.btn, { backgroundColor: Colors.background }]}>
                <Ionicons name="chatbubble-outline" size={12} color={Colors.textSecondary} />
            </TouchableOpacity>
        </View>
    </View>
);

const mpStyles = StyleSheet.create({
    wrap: {
        width: 96,
        alignItems: 'center',
        marginRight: 12,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: 14,
        ...Shadow.card,
    },
    adminDot: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.white,
    },
    name: {
        fontSize: FontSize.sm,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginTop: 8,
        textAlign: 'center',
    },
    role: { fontSize: 10, color: Colors.textMuted, marginTop: 2, textTransform: 'capitalize' },
    actions: { flexDirection: 'row', gap: 6, marginTop: 10 },
    btn: {
        width: 28,
        height: 28,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

/** Company row */
const CompanyRow: React.FC<{ company: RecentCompany; isLast: boolean }> = ({ company, isLast }) => {
    const verified = company.verificationStatus === 'verified';
    return (
        <View style={[crStyles.row, !isLast && crStyles.rowBorder]}>
            <View style={crStyles.avatar}>
                <Text style={crStyles.initial}>{company.companyName[0].toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={crStyles.name}>{company.companyName}</Text>
                <Text style={crStyles.email} numberOfLines={1}>
                    {company.email}
                </Text>
            </View>
            <View
                style={[
                    crStyles.badge,
                    { backgroundColor: verified ? Colors.successLight : Colors.warningLight },
                ]}
            >
                <Ionicons
                    name={verified ? 'checkmark-circle' : 'time-outline'}
                    size={12}
                    color={verified ? Colors.success : Colors.warning}
                />
                <Text
                    style={[
                        crStyles.badgeText,
                        { color: verified ? Colors.success : Colors.warning },
                    ]}
                >
                    {company.verificationStatus}
                </Text>
            </View>
        </View>
    );
};

const crStyles = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
    rowBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 12,
        backgroundColor: `${Colors.primary}14`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    initial: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.primary },
    name: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
    email: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 1 },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderRadius: BorderRadius.full,
        paddingHorizontal: 9,
        paddingVertical: 4,
    },
    badgeText: { fontSize: 11, fontWeight: '700', textTransform: 'capitalize' },
});

/** Overview tile */
const OverTile: React.FC<{
    icon: string;
    label: string;
    value: number | string;
    color: string;
    isStr?: boolean;
}> = ({ icon, label, value, color }) => (
    <View style={otStyles.wrap}>
        <View style={[otStyles.icon, { backgroundColor: `${color}12` }]}>
            <Ionicons name={icon as any} size={20} color={color} />
        </View>
        <Text style={[otStyles.value, { color }]}>{value}</Text>
        <Text style={otStyles.label}>{label}</Text>
    </View>
);

const otStyles = StyleSheet.create({
    wrap: {
        width: (width - 64) / 3,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.lg,
        padding: 14,
        alignItems: 'center',
        gap: 6,
    },
    icon: {
        width: 42,
        height: 42,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
    value: { fontSize: FontSize.xl, fontWeight: '900' },
    label: { fontSize: 10, color: Colors.textMuted, textAlign: 'center', fontWeight: '600' },
});

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.background },
    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        backgroundColor: Colors.background,
    },
    loaderText: { fontSize: FontSize.md, color: Colors.textMuted },

    // ── Hero ──
    hero: {
        backgroundColor: Colors.primaryDark,
        paddingHorizontal: 20,
        paddingTop: 52,
        paddingBottom: 28,
    },
    heroBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 16,
    },

    greetingText: { fontSize: FontSize.sm, color: `${Colors.white}75`, marginBottom: 3 },
    heroTitle: {
        fontSize: FontSize.xxl,
        fontWeight: '900',
        color: Colors.white,
        letterSpacing: -0.5,
    },

    heroBarRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    iconBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: `${Colors.white}15`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badge: {
        position: 'absolute',
        top: 2,
        right: 2,
        width: 17,
        height: 17,
        borderRadius: 9,
        backgroundColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.primaryDark,
    },
    badgeText: { color: Colors.white, fontSize: 9, fontWeight: '900' },
    avatarRing: { borderWidth: 2, borderColor: `${Colors.white}40`, borderRadius: 22, padding: 1 },

    sessionPill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        backgroundColor: `${Colors.white}12`,
        borderRadius: BorderRadius.full,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 6,
        marginBottom: 18,
    },
    pulse: { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.success },

    sessionLabel: { fontSize: 12, color: `${Colors.white}90`, fontWeight: '600' },
    heroCards: { flexDirection: 'row', marginHorizontal: -4 },

    // ── Body ──
    body: { padding: 20 },

    // Secondary strip
    secStrip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        paddingVertical: 18,
        paddingHorizontal: 8,
        marginBottom: Spacing.lg,
        ...Shadow.card,
    },
    stripDiv: { width: 1, height: 40, backgroundColor: Colors.border },

    // Quick actions
    quickGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
    quickTile: {
        width: CARD_W,
        borderRadius: BorderRadius.xl,
        paddingVertical: 20,
        paddingHorizontal: 16,
        alignItems: 'center',
        gap: 10,
    },
    quickCircle: {
        width: 50,
        height: 50,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickLabel: { fontSize: FontSize.sm, fontWeight: '700', textAlign: 'center' },

    // Leads banner
    leadsBanner: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        padding: 22,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Spacing.lg,
        borderLeftWidth: 4,
        borderLeftColor: Colors.accent,
        ...Shadow.card,
    },
    leadsBannerLeft: { flex: 1, gap: 4 },
    leadsBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: `${Colors.accent}14`,
        alignSelf: 'flex-start',
        borderRadius: BorderRadius.full,
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginBottom: 4,
    },
    leadsBadgeText: { fontSize: 10, fontWeight: '800', color: Colors.accent, letterSpacing: 0.5 },
    leadsBannerNum: {
        fontSize: FontSize.display,
        fontWeight: '900',
        color: Colors.textPrimary,
        lineHeight: 42,
    },
    leadsBannerLabel: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.textPrimary },
    leadsBannerSub: { fontSize: FontSize.sm, color: Colors.textMuted },
    leadsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: Colors.accent,
        borderRadius: BorderRadius.full,
        alignSelf: 'flex-start',
        paddingHorizontal: 18,
        paddingVertical: 10,
        marginTop: 14,
    },
    leadsBtnText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.white },
    leadsBannerRight: { width: 80, alignItems: 'center', justifyContent: 'center' },

    // Overview grid
    overGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

    // Company card wrapper
    companyCard: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        paddingHorizontal: 16,
        ...Shadow.card,
    },

    // Community
    community: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        padding: 18,
        borderWidth: 1.5,
        borderColor: `${Colors.primary}20`,
        ...Shadow.card,
    },
    communityIcon: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    communityTitle: { fontSize: FontSize.md, fontWeight: '800', color: Colors.textPrimary },
    communitySub: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 3 },
    communityArrow: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default HomeScreen;
