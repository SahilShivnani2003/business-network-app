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
import { dashboardAPI } from '../../service/apis/dashboardService';
import { useAuthStore } from '../../store/authStore';

const { width } = Dimensions.get('window');

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

// ─── Data ─────────────────────────────────────────────────────────────────────

const QUICK = [
    { label: 'Find\nClients', icon: 'search', color: Colors.primary, screen: 'Network' },
    { label: 'Post\nHelp', icon: 'megaphone', color: Colors.accent, screen: 'CommunityHelp' },
    { label: 'Join\nGroup', icon: 'chatbubbles', color: Colors.success, screen: 'WhatsAppGroups' },
    { label: 'Upcoming\nEvents', icon: 'calendar', color: Colors.premium, screen: 'Events' },
] as const;

const greeting = () => {
    const h = new Date().getHours();
    return h < 12 ? 'Good Morning' : h < 17 ? 'Good Afternoon' : 'Good Evening';
};
const greetingEmoji = () => {
    const h = new Date().getHours();
    return h < 12 ? '☀️' : h < 17 ? '🌤️' : '🌙';
};

// ─── Screen ───────────────────────────────────────────────────────────────────

const HomeScreen: React.FC<Props> = ({ navigation }) => {
    const { company } = useAuthStore();
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [users, setUsers] = useState<DashboardUsers | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const riseAnim = useRef(new Animated.Value(30)).current;

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
                Animated.timing(fadeAnim, { toValue: 1, duration: 560, useNativeDriver: true }),
                Animated.spring(riseAnim, {
                    toValue: 0,
                    friction: 9,
                    tension: 60,
                    useNativeDriver: true,
                }),
            ]).start();
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, []);

    if (loading) {
        return (
            <View style={styles.loader}>
                <View style={styles.loaderDot} />
                <ActivityIndicator size="large" color={Colors.primary} style={{ marginTop: 24 }} />
                <Text style={styles.loaderLabel}>Fetching your dashboard</Text>
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
                    tintColor={Colors.white}
                />
            }
        >
            {/* ═══════════════════════════════
                HERO — dark navy canvas
            ═══════════════════════════════ */}
            <View style={styles.hero}>
                {/* Decorative circles */}
                <View style={[styles.dec, styles.dec1]} />
                <View style={[styles.dec, styles.dec2]} />
                <View style={[styles.dec, styles.dec3]} />

                {/* Nav */}
                <View style={styles.nav}>
                    <View>
                        <Text style={styles.navGreeting}>
                            {greeting()} {greetingEmoji()}
                        </Text>
                        <Text style={styles.navTitle}>{company.companyName}</Text>
                    </View>
                    <View style={styles.navRight}>
                        <TouchableOpacity
                            style={styles.navBtn}
                            onPress={() => navigation.navigate('Notifications')}
                        >
                            <Ionicons name="notifications-outline" size={20} color={Colors.white} />
                            {(stats?.issues ?? 0) > 0 && (
                                <View style={styles.navBadge}>
                                    <Text style={styles.navBadgeText}>{stats!.issues}</Text>
                                </View>
                            )}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.navAvatar}
                            onPress={() => navigation.navigate('Profile')}
                        >
                            <Avatar name={company.companyName} size={36} />
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Live pill */}
                {stats && (
                    <View style={styles.livePill}>
                        <View style={styles.liveBlip} />
                        <Text style={styles.liveText}>{stats.activeSessions} live sessions</Text>
                    </View>
                )}

                {/* Big number */}
                <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: riseAnim }] }}>
                    <Text style={styles.heroEyebrow}>Active Leads</Text>
                    <Text style={styles.heroNumber}>{stats?.activeLeads ?? '—'}</Text>
                    <Text style={styles.heroSub}>
                        {stats?.leadsThisMonth ?? 0} new this month · {stats?.totalLeads ?? 0} total
                    </Text>
                </Animated.View>

                {/* 3-stat strip */}
                <Animated.View style={[styles.heroStrip, { opacity: fadeAnim }]}>
                    <HeroChip
                        label="Companies"
                        value={stats?.totalCompanies ?? 0}
                        tint={Colors.primaryLight}
                    />
                    <View style={styles.heroStripDiv} />
                    <HeroChip
                        label="Events"
                        value={stats?.upcomingEvents ?? 0}
                        tint={Colors.accent}
                    />
                    <View style={styles.heroStripDiv} />
                    <HeroChip
                        label="Members"
                        value={stats?.regularUsers ?? 0}
                        tint={Colors.premium}
                    />
                </Animated.View>
            </View>

            {/* ═══════════════════════════════
                FLOAT ROW — overlaps hero
            ═══════════════════════════════ */}
            <Animated.View
                style={[
                    styles.floatRow,
                    { opacity: fadeAnim, transform: [{ translateY: riseAnim }] },
                ]}
            >
                <FloatStat
                    icon="person-add-outline"
                    label="New Today"
                    value={stats?.newUsersToday ?? 0}
                    color={Colors.success}
                />
                <FloatStat
                    icon="checkmark-circle-outline"
                    label="Verified"
                    value={stats?.verifiedCompanies ?? 0}
                    color={Colors.primary}
                />
                <FloatStat
                    icon="time-outline"
                    label="Pending"
                    value={stats?.pendingCompanies ?? 0}
                    color={Colors.warning}
                />
                <FloatStat
                    icon="flash-outline"
                    label="This Month"
                    value={stats?.usersThisMonth ?? 0}
                    color={Colors.accent}
                />
            </Animated.View>

            {/* ═══════════════════════════════
                BODY
            ═══════════════════════════════ */}
            <Animated.View style={[styles.body, { opacity: fadeAnim }]}>
                {/* ── Quick Actions ── */}
                <Label text="Quick Actions" />
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.quickScroll}
                >
                    {QUICK.map(a => (
                        <TouchableOpacity
                            key={a.screen}
                            style={styles.quickCard}
                            onPress={() => navigation.navigate(a.screen)}
                            activeOpacity={0.78}
                        >
                            <View
                                style={[styles.quickIconWrap, { backgroundColor: `${a.color}15` }]}
                            >
                                <Ionicons name={a.icon as any} size={26} color={a.color} />
                            </View>
                            <Text style={styles.quickCardLabel}>{a.label}</Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* ── Leads Card ── */}
                {stats && (
                    <View style={styles.leadsCard}>
                        <View style={[styles.leadsAccentBar, { backgroundColor: Colors.accent }]} />
                        <View style={styles.leadsInner}>
                            <View style={styles.leadsTop}>
                                <View style={{ flex: 1 }}>
                                    <View style={styles.leadsTag}>
                                        <Ionicons name="flash" size={9} color={Colors.accent} />
                                        <Text style={styles.leadsTagText}>LEADS PIPELINE</Text>
                                    </View>
                                    <Text style={styles.leadsNum}>{stats.activeLeads}</Text>
                                    <Text style={styles.leadsDesc}>
                                        active · {stats.leadsThisMonth} added this month
                                    </Text>
                                </View>
                                <View style={styles.leadsCircle}>
                                    <Ionicons name="trending-up" size={28} color={Colors.accent} />
                                </View>
                            </View>
                            <View style={styles.leadsFooter}>
                                <View style={styles.leadsFooterStat}>
                                    <Text style={styles.leadsFooterVal}>
                                        {stats.activeRequirements}
                                    </Text>
                                    <Text style={styles.leadsFooterLabel}>Active Requirements</Text>
                                </View>
                                <View style={styles.leadsFooterDivider} />
                                <View style={styles.leadsFooterStat}>
                                    <Text style={styles.leadsFooterVal}>
                                        {stats.requirementsThisMonth}
                                    </Text>
                                    <Text style={styles.leadsFooterLabel}>New This Month</Text>
                                </View>
                                <TouchableOpacity
                                    style={styles.leadsBtn}
                                    onPress={() => navigation.navigate('Leads')}
                                >
                                    <Text style={styles.leadsBtnText}>View</Text>
                                    <Ionicons name="arrow-forward" size={12} color={Colors.white} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* ── Recent Members ── */}
                {(users?.users?.length ?? 0) > 0 && (
                    <View>
                        <RowHeader
                            title="Recent Members"
                            action="See All"
                            onAction={() => navigation.navigate('Network')}
                        />
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingRight: 4 }}
                        >
                            {users!.users.map(u => (
                                <MemberCard key={u._id} user={u} />
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* ── Recent Companies ── */}
                {(stats?.recentCompanies?.length ?? 0) > 0 && (
                    <View>
                        <RowHeader
                            title="Recent Companies"
                            action="See All"
                            onAction={() => navigation.navigate('Network')}
                        />
                        <View style={styles.companiesCard}>
                            {stats!.recentCompanies.map((c, i) => (
                                <CompanyRow
                                    key={c._id}
                                    company={c}
                                    isLast={i === stats!.recentCompanies.length - 1}
                                />
                            ))}
                        </View>
                    </View>
                )}

                {/* ── Platform Overview ── */}
                {stats && (
                    <View>
                        <RowHeader title="Platform Overview" />
                        <View style={styles.overGrid}>
                            <OverCard
                                icon="people"
                                label="Users"
                                value={stats.totalUsers}
                                color={Colors.primary}
                            />
                            <OverCard
                                icon="business"
                                label="Companies"
                                value={stats.totalCompanies}
                                color={Colors.accent}
                            />
                            <OverCard
                                icon="star"
                                label="Subscriptions"
                                value={stats.totalSubscriptions}
                                color={Colors.premium}
                            />
                            <OverCard
                                icon="calendar"
                                label="Events"
                                value={stats.totalEvents}
                                color={Colors.success}
                            />
                            <OverCard
                                icon="cube"
                                label="Requirements"
                                value={stats.totalRequirements}
                                color={Colors.warning}
                            />
                            <OverCard
                                icon="cash"
                                label="Revenue"
                                value={`₹${stats.monthlyRevenue}`}
                                color={Colors.success}
                                isStr
                            />
                        </View>
                    </View>
                )}

                {/* ── Community ── */}
                <TouchableOpacity
                    style={styles.communityCard}
                    onPress={() => navigation.navigate('CommunityHelp')}
                    activeOpacity={0.82}
                >
                    <View style={styles.communityLeft}>
                        <Text style={styles.communityEye}>COMMUNITY</Text>
                        <Text style={styles.communityTitle}>Help Board</Text>
                        <Text style={styles.communitySub}>Post needs · Get answers</Text>
                    </View>
                    <View>
                        <View style={styles.communityGlobe}>
                            <Ionicons name="earth" size={44} color={`${Colors.white}20`} />
                        </View>
                        <View style={styles.communityArrowBtn}>
                            <Ionicons name="arrow-forward" size={16} color={Colors.white} />
                        </View>
                    </View>
                </TouchableOpacity>

                <View style={{ height: 110 }} />
            </Animated.View>
        </ScrollView>
    );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const HeroChip: React.FC<{ label: string; value: number; tint: string }> = ({
    label,
    value,
    tint,
}) => (
    <View style={heroChipS.wrap}>
        <Text style={[heroChipS.val, { color: tint }]}>{value}</Text>
        <Text style={heroChipS.label}>{label}</Text>
    </View>
);
const heroChipS = StyleSheet.create({
    wrap: { flex: 1, alignItems: 'center', gap: 3 },
    val: { fontSize: FontSize.xl, fontWeight: '900', letterSpacing: -0.5 },
    label: { fontSize: FontSize.xs, color: `${Colors.white}60`, fontWeight: '600' },
});

const FloatStat: React.FC<{ icon: string; label: string; value: number; color: string }> = ({
    icon,
    label,
    value,
    color,
}) => (
    <View style={floatStatS.wrap}>
        <View style={[floatStatS.icon, { backgroundColor: `${color}12` }]}>
            <Ionicons name={icon as any} size={16} color={color} />
        </View>
        <Text style={[floatStatS.val, { color }]}>{value}</Text>
        <Text style={floatStatS.label}>{label}</Text>
    </View>
);
const floatStatS = StyleSheet.create({
    wrap: { flex: 1, alignItems: 'center', gap: 5 },
    icon: {
        width: 36,
        height: 36,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    val: { fontSize: FontSize.lg, fontWeight: '900' },
    label: { fontSize: 10, color: Colors.textMuted, fontWeight: '600', textAlign: 'center' },
});

const Label: React.FC<{ text: string }> = ({ text }) => <Text style={labelS.text}>{text}</Text>;
const labelS = StyleSheet.create({
    text: {
        fontSize: FontSize.md,
        fontWeight: '800',
        color: Colors.textPrimary,
        letterSpacing: -0.3,
        marginBottom: Spacing.sm,
    },
});

const RowHeader: React.FC<{ title: string; action?: string; onAction?: () => void }> = ({
    title,
    action,
    onAction,
}) => (
    <View style={rowHeaderS.row}>
        <Text style={rowHeaderS.title}>{title}</Text>
        {action && (
            <TouchableOpacity style={rowHeaderS.btn} onPress={onAction}>
                <Text style={rowHeaderS.btnText}>{action}</Text>
                <Ionicons name="chevron-forward" size={11} color={Colors.primary} />
            </TouchableOpacity>
        )}
    </View>
);
const rowHeaderS = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: Spacing.sm,
        marginTop: Spacing.lg,
    },
    title: {
        fontSize: FontSize.md,
        fontWeight: '800',
        color: Colors.textPrimary,
        letterSpacing: -0.3,
    },
    btn: { flexDirection: 'row', alignItems: 'center', gap: 1 },
    btnText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '700' },
});

const MemberCard: React.FC<{ user: RecentUser }> = ({ user }) => (
    <View style={memberCardS.wrap}>
        <View>
            <Avatar name={user.name} size={50} />
            {user.role === 'admin' && (
                <View style={memberCardS.adminBadge}>
                    <Ionicons name="shield-checkmark" size={8} color={Colors.white} />
                </View>
            )}
        </View>
        <Text style={memberCardS.name} numberOfLines={1}>
            {user.name.split(' ')[0]}
        </Text>
        <Text style={memberCardS.role}>{user.role}</Text>
        <View style={memberCardS.actions}>
            <TouchableOpacity style={[memberCardS.btn, { backgroundColor: Colors.primary }]}>
                <Ionicons name="person-add-outline" size={11} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity style={[memberCardS.btn, { backgroundColor: Colors.border }]}>
                <Ionicons name="chatbubble-outline" size={11} color={Colors.textSecondary} />
            </TouchableOpacity>
        </View>
    </View>
);
const memberCardS = StyleSheet.create({
    wrap: {
        width: 88,
        alignItems: 'center',
        marginRight: 10,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        padding: 12,
        ...Shadow.card,
    },
    adminBadge: {
        position: 'absolute',
        bottom: -1,
        right: -1,
        width: 16,
        height: 16,
        borderRadius: 8,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.surface,
    },
    name: {
        fontSize: 12,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginTop: 8,
        textAlign: 'center',
    },
    role: { fontSize: 10, color: Colors.textMuted, marginTop: 2, textTransform: 'capitalize' },
    actions: { flexDirection: 'row', gap: 5, marginTop: 8 },
    btn: {
        width: 26,
        height: 26,
        borderRadius: 13,
        alignItems: 'center',
        justifyContent: 'center',
    },
});

const CompanyRow: React.FC<{ company: RecentCompany; isLast: boolean }> = ({ company, isLast }) => {
    const verified = company.verificationStatus === 'verified';
    return (
        <View style={[companyRowS.row, !isLast && companyRowS.border]}>
            <View style={companyRowS.initial}>
                <Text style={companyRowS.initialText}>{company.companyName[0].toUpperCase()}</Text>
            </View>
            <View style={{ flex: 1 }}>
                <Text style={companyRowS.name}>{company.companyName}</Text>
                <Text style={companyRowS.email} numberOfLines={1}>
                    {company.email}
                </Text>
            </View>
            <View
                style={[
                    companyRowS.dot,
                    { backgroundColor: verified ? Colors.success : Colors.warning },
                ]}
            />
        </View>
    );
};
const companyRowS = StyleSheet.create({
    row: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 12 },
    border: { borderBottomWidth: 1, borderBottomColor: Colors.border },
    initial: {
        width: 42,
        height: 42,
        borderRadius: BorderRadius.md,
        backgroundColor: `${Colors.primary}12`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    initialText: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.primary },
    name: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textPrimary },
    email: { fontSize: FontSize.xs, color: Colors.textMuted, marginTop: 1 },
    dot: { width: 9, height: 9, borderRadius: 5 },
});

const TILE_W = (width - Spacing.lg * 3 - 10) / 3;
const OverCard: React.FC<{
    icon: string;
    label: string;
    value: number | string;
    color: string;
    isStr?: boolean;
}> = ({ icon, label, value, color }) => (
    <View style={overCardS.wrap}>
        <View style={[overCardS.topBar, { backgroundColor: color }]} />
        <View style={overCardS.inner}>
            <View style={[overCardS.icon, { backgroundColor: `${color}12` }]}>
                <Ionicons name={icon as any} size={17} color={color} />
            </View>
            <Text style={[overCardS.val, { color }]}>{value}</Text>
            <Text style={overCardS.label}>{label}</Text>
        </View>
    </View>
);
const overCardS = StyleSheet.create({
    wrap: {
        width: TILE_W,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        overflow: 'hidden',
        ...Shadow.card,
    },
    topBar: { height: 3 },
    inner: { padding: 12, alignItems: 'center', gap: 5 },
    icon: {
        width: 38,
        height: 38,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    val: { fontSize: FontSize.xl, fontWeight: '900' },
    label: { fontSize: 10, color: Colors.textMuted, fontWeight: '600', textAlign: 'center' },
});

// ─── Root Styles ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    root: { flex: 1, backgroundColor: Colors.background },

    loader: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.background,
    },
    loaderDot: { width: 12, height: 12, borderRadius: 6, backgroundColor: Colors.primary },
    loaderLabel: {
        fontSize: FontSize.sm,
        color: Colors.textMuted,
        marginTop: 12,
        fontWeight: '600',
    },

    // ── Hero ──
    hero: {
        backgroundColor: Colors.primaryDark,
        paddingHorizontal: Spacing.lg,
        paddingTop: 26,
        paddingBottom: 56,
        overflow: 'hidden',
    },
    dec: { position: 'absolute', borderRadius: 999, backgroundColor: Colors.white, opacity: 0.06 },
    dec1: { width: 220, height: 220, top: -70, right: -70 },
    dec2: { width: 130, height: 130, top: 30, right: 80 },
    dec3: { width: 90, height: 90, bottom: 10, left: -24 },

    nav: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
    },
    navGreeting: {
        fontSize: FontSize.xs,
        color: `${Colors.white}60`,
        fontWeight: '600',
        marginBottom: 2,
    },
    navTitle: {
        fontSize: FontSize.xxl,
        fontWeight: '900',
        color: Colors.white,
        letterSpacing: -0.5,
    },
    navRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    navBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: `${Colors.white}12`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    navBadge: {
        position: 'absolute',
        top: 5,
        right: 5,
        width: 14,
        height: 14,
        borderRadius: 7,
        backgroundColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1.5,
        borderColor: Colors.primaryDark,
    },
    navBadgeText: { color: Colors.white, fontSize: 8, fontWeight: '900' },
    navAvatar: { borderWidth: 2, borderColor: `${Colors.white}25`, borderRadius: 22, padding: 1 },

    livePill: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 7,
        backgroundColor: `${Colors.white}10`,
        borderRadius: BorderRadius.full,
        alignSelf: 'flex-start',
        paddingHorizontal: 12,
        paddingVertical: 5,
        marginBottom: Spacing.lg,
    },
    liveBlip: { width: 7, height: 7, borderRadius: 4, backgroundColor: Colors.success },
    liveText: { fontSize: 11, color: `${Colors.white}80`, fontWeight: '600' },

    heroEyebrow: {
        fontSize: FontSize.sm,
        color: `${Colors.white}55`,
        fontWeight: '700',
        letterSpacing: 0.5,
        marginBottom: 4,
    },
    heroNumber: {
        fontSize: 64,
        fontWeight: '900',
        color: Colors.white,
        lineHeight: 68,
        letterSpacing: -2,
    },
    heroSub: {
        fontSize: FontSize.sm,
        color: `${Colors.white}60`,
        marginBottom: Spacing.lg,
        marginTop: 2,
    },

    heroStrip: {
        flexDirection: 'row',
        backgroundColor: `${Colors.white}08`,
        borderRadius: BorderRadius.lg,
        paddingVertical: 14,
    },
    heroStripDiv: { width: 1, backgroundColor: `${Colors.white}15` },

    // ── Float row ──
    floatRow: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        paddingVertical: Spacing.md,
        paddingHorizontal: Spacing.sm,
        marginHorizontal: Spacing.lg,
        marginTop: -28,
        ...Shadow.card,
        shadowOpacity: 0.14,
        elevation: 8,
    },

    // ── Body ──
    body: { paddingHorizontal: Spacing.lg, paddingTop: Spacing.lg },

    // Quick actions
    quickScroll: { paddingRight: Spacing.lg, gap: 10 },
    quickCard: {
        width: 90,
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        paddingVertical: Spacing.md,
        alignItems: 'center',
        gap: 10,
        ...Shadow.card,
    },
    quickIconWrap: {
        width: 52,
        height: 52,
        borderRadius: BorderRadius.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },
    quickCardLabel: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 15,
    },

    // Leads card
    leadsCard: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        flexDirection: 'row',
        overflow: 'hidden',
        marginTop: Spacing.lg,
        ...Shadow.card,
    },
    leadsAccentBar: { width: 4 },
    leadsInner: { flex: 1, padding: Spacing.md },
    leadsTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: Spacing.md,
    },
    leadsTag: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        backgroundColor: `${Colors.accent}12`,
        borderRadius: BorderRadius.full,
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        marginBottom: 6,
    },
    leadsTagText: { fontSize: 10, fontWeight: '800', color: Colors.accent, letterSpacing: 0.6 },
    leadsNum: {
        fontSize: 48,
        fontWeight: '900',
        color: Colors.textPrimary,
        lineHeight: 52,
        letterSpacing: -1.5,
    },
    leadsDesc: { fontSize: FontSize.sm, color: Colors.textMuted },
    leadsCircle: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: `${Colors.accent}10`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    leadsFooter: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.lg,
        padding: 12,
        gap: 12,
    },
    leadsFooterStat: { flex: 1 },
    leadsFooterVal: { fontSize: FontSize.lg, fontWeight: '900', color: Colors.textPrimary },
    leadsFooterLabel: { fontSize: 10, color: Colors.textMuted, fontWeight: '600', marginTop: 1 },
    leadsFooterDivider: { width: 1, height: 32, backgroundColor: Colors.border },
    leadsBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        backgroundColor: Colors.accent,
        borderRadius: BorderRadius.full,
        paddingHorizontal: 14,
        paddingVertical: 8,
        ...Shadow.button,
    },
    leadsBtnText: { fontSize: 12, fontWeight: '700', color: Colors.white },

    // Companies
    companiesCard: {
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        paddingHorizontal: Spacing.md,
        ...Shadow.card,
    },

    // Overview
    overGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },

    // Community
    communityCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.primaryDark,
        borderRadius: BorderRadius.xl,
        padding: Spacing.md,
        marginTop: Spacing.lg,
        overflow: 'hidden',
        ...Shadow.button,
    },
    communityLeft: { flex: 1, gap: 3 },
    communityEye: { fontSize: 10, fontWeight: '800', color: `${Colors.white}45`, letterSpacing: 1 },
    communityTitle: {
        fontSize: FontSize.xl,
        fontWeight: '900',
        color: Colors.white,
        letterSpacing: -0.5,
    },
    communitySub: { fontSize: FontSize.sm, color: `${Colors.white}55` },
    communityGlobe: { position: 'absolute', right: -8, bottom: -24 },
    communityArrowBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadow.button,
    },
});

export default HomeScreen;
