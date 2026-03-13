import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    ActivityIndicator,
    RefreshControl,
    
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Avatar } from '../../components/ui/Avatar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../theme/colors';

type Props = { navigation: any };

// ─── API Types ────────────────────────────────────────────────────────────────

interface ProfileAddress {
    street: string;
    city: string;
    state: string;
    country: string;
    pincode: string;
}

interface ProfileData {
    _id: string;
    email: string;
    companyName: string;
    category: string;
    businessDescription: string;
    phone: string;
    website: string;
    servicesOffered: string[];
    averageRating: number;
    totalRatings: number;
    createdAt: string;
    address: ProfileAddress;
    // optional — may arrive in future API versions
    contactName?: string;
    industry?: string;
    companyType?: string;
    plan?: string;
}

interface ApiResponse {
    success: boolean;
    data: ProfileData;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (iso: string): string => {
    const d = new Date(iso);
    return d.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' });
};

const calcStrength = (d: ProfileData): number => {
    const checks = [
        !!d.email,
        !!d.phone,
        !!d.companyName,
        !!d.category,
        !!d.businessDescription,
        !!d.website,
        !!d.address?.city,
        !!d.address?.state,
        (d.servicesOffered?.length ?? 0) > 0,
        !!d.contactName,
    ];
    return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

const strengthMeta = (pct: number) => ({
    label: pct >= 80 ? 'Excellent' : pct >= 60 ? 'Good' : pct >= 40 ? 'Fair' : 'Weak',
    color:
        pct >= 80
            ? Colors.success
            : pct >= 60
            ? Colors.primary
            : pct >= 40
            ? Colors.warning
            : Colors.error,
});

// ─── Screen ───────────────────────────────────────────────────────────────────

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
    const [profile, setProfile] = useState<ProfileData | null>(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [fetchError, setFetchError] = useState<string | null>(null);

    const fetchProfile = async (isRefresh = false) => {
        try {
            isRefresh ? setRefreshing(true) : setLoading(true);
            setFetchError(null);

            // ── Replace URL and add your auth header ──────────────────────
            const res = await fetch('https://your-api.com/api/profile', {
                headers: {
                    'Content-Type': 'application/json',
                    // Authorization: `Bearer ${token}`,
                },
            });
            const json: ApiResponse = await res.json();

            if (json.success && json.data) {
                setProfile(json.data);
            } else {
                setFetchError('Could not load profile data.');
            }
        } catch {
            // Dev fallback — mirrors the exact API response provided
            setProfile({
                _id: '69b275ab00d02609d0896f81',
                email: 'test@company.com',
                companyName: 'Test',
                category: 'Technology',
                businessDescription: 'Testing purpose',
                phone: '9876543210',
                website: '',
                servicesOffered: [],
                averageRating: 0,
                totalRatings: 0,
                createdAt: '2026-03-12T08:13:31.621Z',
                address: {
                    street: 'Bhopal',
                    city: 'Bhopal',
                    state: 'Madhya Pradesh',
                    country: 'India',
                    pincode: '400001',
                },
            });
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProfile();
    }, []);

    // ── States ────────────────────────────────────────────────────────────────
    if (loading) {
        return (
            <View style={styles.centred}>
                <ActivityIndicator size="large" color={Colors.primary} />
                <Text style={styles.loadingText}>Loading profile...</Text>
            </View>
        );
    }

    if (fetchError && !profile) {
        return (
            <View style={styles.centred}>
                <Ionicons name="cloud-offline-outline" size={48} color={Colors.textMuted} />
                <Text style={styles.errorMsg}>{fetchError}</Text>
                <Button label="Retry" onPress={() => fetchProfile()} variant="primary" size="md" />
            </View>
        );
    }

    if (!profile) return null;

    // ── Derived values ────────────────────────────────────────────────────────
    const strength = calcStrength(profile);
    const { label: sLabel, color: sColor } = strengthMeta(strength);
    const joinedLabel = formatDate(profile.createdAt);
    const location = [profile.address?.city, profile.address?.state].filter(Boolean).join(', ');
    const fullAddress = [
        profile.address?.street,
        profile.address?.city,
        profile.address?.state,
        profile.address?.pincode,
        profile.address?.country,
    ]
        .filter(Boolean)
        .join(', ');

    return (
        <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={() => fetchProfile(true)}
                    colors={[Colors.primary]}
                    tintColor={Colors.primary}
                />
            }
        >
            {/* ── Header Banner ── */}
            <View style={styles.headerBg}>
                <View style={styles.headerActions}>
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => navigation.navigate('Notifications')}
                    >
                        <Ionicons name="notifications-outline" size={20} color={Colors.white} />
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconBtn}
                        onPress={() => navigation.navigate('Settings')}
                    >
                        <Ionicons name="settings-outline" size={20} color={Colors.white} />
                    </TouchableOpacity>
                </View>

                <View style={styles.profileTop}>
                    <View style={styles.avatarWrap}>
                        <Avatar name={profile.companyName} size={84} />
                        <TouchableOpacity style={styles.cameraBtn}>
                            <Ionicons name="camera" size={13} color={Colors.white} />
                        </TouchableOpacity>
                    </View>

                    <Text style={styles.profileName}>{profile.companyName}</Text>

                    {location ? (
                        <View style={styles.locationRow}>
                            <Ionicons
                                name="location-outline"
                                size={13}
                                color={`${Colors.white}90`}
                            />
                            <Text style={styles.locationText}>{location}</Text>
                        </View>
                    ) : null}

                    <View style={styles.badgeRow}>
                        <View style={styles.categoryBadge}>
                            <Text style={styles.categoryBadgeText}>{profile.category}</Text>
                        </View>
                        {profile.averageRating > 0 && (
                            <View style={styles.ratingBadge}>
                                <Ionicons name="star" size={11} color={Colors.accent} />
                                <Text style={styles.ratingBadgeText}>
                                    {profile.averageRating.toFixed(1)}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            </View>

            {/* ── Stats card (floated) ── */}
            <View style={styles.statsCard}>
                <StatItem value={profile.totalRatings.toString()} label="Ratings" />
                <View style={styles.statDivider} />
                <StatItem
                    value={profile.averageRating > 0 ? profile.averageRating.toFixed(1) : '—'}
                    label="Avg Score"
                />
                <View style={styles.statDivider} />
                <StatItem
                    value={(profile.servicesOffered?.length ?? 0).toString()}
                    label="Services"
                />
                <View style={styles.statDivider} />
                <StatItem value={joinedLabel} label="Joined" />
            </View>

            <View style={styles.body}>
                {/* ── Profile Strength ── */}
                <Card>
                    <View style={styles.strengthRow}>
                        <Text style={styles.sectionTitle}>Profile Strength</Text>
                        <Text style={[styles.strengthPct, { color: sColor }]}>
                            {strength}% · {sLabel}
                        </Text>
                    </View>
                    <View style={styles.strengthTrack}>
                        <View
                            style={[
                                styles.strengthFill,
                                { width: `${strength}%`, backgroundColor: sColor },
                            ]}
                        />
                    </View>
                    {!profile.website && (
                        <Tip text="Add your website to increase profile strength" />
                    )}
                    {(profile.servicesOffered?.length ?? 0) === 0 && (
                        <Tip text="Add services offered to attract more leads" />
                    )}
                </Card>

                {/* ── Business Details ── */}
                <Card>
                    <Text style={styles.sectionTitle}>Business Details</Text>
                    <DetailRow
                        icon="business-outline"
                        label="Company"
                        value={profile.companyName}
                    />
                    <DetailRow icon="grid-outline" label="Category" value={profile.category} />
                    {profile.industry && (
                        <DetailRow
                            icon="layers-outline"
                            label="Industry"
                            value={profile.industry}
                        />
                    )}
                    <DetailRow icon="mail-outline" label="Email" value={profile.email} />
                    <DetailRow icon="call-outline" label="Phone" value={`+91 ${profile.phone}`} />
                    <DetailRow
                        icon="globe-outline"
                        label="Website"
                        value={profile.website || 'Not added'}
                        muted={!profile.website}
                    />
                    {profile.businessDescription ? (
                        <DetailRow
                            icon="document-text-outline"
                            label="About"
                            value={profile.businessDescription}
                        />
                    ) : null}

                    <Button
                        label="Edit Profile"
                        onPress={() => {}}
                        variant="outline"
                        fullWidth
                        size="md"
                        style={{ marginTop: 16 }}
                    />
                </Card>

                {/* ── Address ── */}
                <Card>
                    <Text style={styles.sectionTitle}>Address</Text>
                    <DetailRow
                        icon="location-outline"
                        label="Full Address"
                        value={fullAddress || 'Not added'}
                        muted={!fullAddress}
                    />
                    {profile.address?.pincode ? (
                        <DetailRow
                            icon="pin-outline"
                            label="Pincode"
                            value={profile.address.pincode}
                        />
                    ) : null}
                </Card>

                {/* ── Services Offered ── */}
                <Card>
                    <View style={styles.servicesHeader}>
                        <Text style={styles.sectionTitle}>Services Offered</Text>
                        <TouchableOpacity style={styles.addBtn}>
                            <Ionicons name="add" size={16} color={Colors.primary} />
                            <Text style={styles.addBtnText}>Add</Text>
                        </TouchableOpacity>
                    </View>

                    {(profile.servicesOffered?.length ?? 0) > 0 ? (
                        <View style={styles.chips}>
                            {profile.servicesOffered.map((s, i) => (
                                <View key={i} style={styles.chip}>
                                    <Text style={styles.chipText}>{s}</Text>
                                </View>
                            ))}
                        </View>
                    ) : (
                        <View style={styles.emptyBox}>
                            <Ionicons name="construct-outline" size={30} color={Colors.textMuted} />
                            <Text style={styles.emptyText}>No services added yet</Text>
                            <TouchableOpacity style={styles.emptyAddBtn}>
                                <Text style={styles.emptyAddText}>+ Add Services</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </Card>

                {/* ── Ratings ── */}
                <Card>
                    <Text style={styles.sectionTitle}>Ratings & Reviews</Text>
                    <View style={styles.ratingDisplay}>
                        <Text style={styles.ratingBigNum}>
                            {profile.averageRating > 0 ? profile.averageRating.toFixed(1) : '—'}
                        </Text>
                        <View>
                            <View style={styles.stars}>
                                {[1, 2, 3, 4, 5].map(s => (
                                    <Ionicons
                                        key={s}
                                        name={
                                            s <= Math.round(profile.averageRating)
                                                ? 'star'
                                                : 'star-outline'
                                        }
                                        size={16}
                                        color={Colors.accent}
                                    />
                                ))}
                            </View>
                            <Text style={styles.ratingCount}>
                                {profile.totalRatings} total ratings
                            </Text>
                        </View>
                    </View>
                </Card>

                {/* ── Quick Access ── */}
                <Card>
                    <Text style={styles.sectionTitle}>Quick Access</Text>
                    {(
                        [
                            {
                                icon: 'sparkles-outline',
                                label: 'AI Smart Match',
                                screen: 'AIMatch',
                            },
                            {
                                icon: 'git-network-outline',
                                label: 'My Referrals',
                                screen: 'Referrals',
                            },
                            {
                                icon: 'logo-whatsapp',
                                label: 'WhatsApp Groups',
                                screen: 'WhatsAppGroups',
                            },
                            {
                                icon: 'people-outline',
                                label: 'Community Help Board',
                                screen: 'CommunityHelp',
                            },
                            { icon: 'card-outline', label: 'Membership', screen: 'Membership' },
                        ] as const
                    ).map(item => (
                        <TouchableOpacity
                            key={item.label}
                            style={styles.quickRow}
                            onPress={() => navigation.navigate(item.screen)}
                        >
                            <View style={styles.quickIcon}>
                                <Ionicons
                                    name={item.icon as any}
                                    size={18}
                                    color={Colors.primary}
                                />
                            </View>
                            <Text style={styles.quickLabel}>{item.label}</Text>
                            <Ionicons name="chevron-forward" size={16} color={Colors.textMuted} />
                        </TouchableOpacity>
                    ))}
                </Card>

                {/* ── Logout ── */}
                <TouchableOpacity
                    style={styles.logoutBtn}
                    onPress={() => navigation.replace('Login')}
                    activeOpacity={0.85}
                >
                    <Ionicons name="log-out-outline" size={20} color={Colors.error} />
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const StatItem: React.FC<{ value: string; label: string }> = ({ value, label }) => (
    <View style={styles.statItem}>
        <Text style={styles.statValue}>{value}</Text>
        <Text style={styles.statLabel}>{label}</Text>
    </View>
);

const DetailRow: React.FC<{ icon: string; label: string; value: string; muted?: boolean }> = ({
    icon,
    label,
    value,
    muted,
}) => (
    <View style={styles.detailRow}>
        <View style={styles.detailIconWrap}>
            <Ionicons name={icon as any} size={16} color={Colors.primary} />
        </View>
        <View style={styles.detailContent}>
            <Text style={styles.detailLabel}>{label}</Text>
            <Text style={[styles.detailValue, muted && styles.detailMuted]}>{value}</Text>
        </View>
    </View>
);

const Tip: React.FC<{ text: string }> = ({ text }) => (
    <View style={styles.tipRow}>
        <Ionicons name="bulb-outline" size={13} color={Colors.warning} />
        <Text style={styles.tipText}>{text}</Text>
    </View>
);

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    centred: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
        padding: Spacing.xl,
    },
    loadingText: { fontSize: FontSize.md, color: Colors.textMuted, marginTop: 8 },
    errorMsg: {
        fontSize: FontSize.md,
        color: Colors.error,
        textAlign: 'center',
        marginVertical: 8,
    },

    headerBg: { backgroundColor: Colors.primaryDark, paddingBottom: 36 },
    headerActions: {
        paddingTop: 52,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        gap: 10,
    },
    iconBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: `${Colors.white}20`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    profileTop: { alignItems: 'center', paddingTop: 8 },
    avatarWrap: { position: 'relative', marginBottom: 12 },
    cameraBtn: {
        position: 'absolute',
        bottom: 0,
        right: 0,
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: Colors.accent,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 2,
        borderColor: Colors.primaryDark,
    },
    profileName: {
        fontSize: FontSize.xxl,
        fontWeight: '900',
        color: Colors.white,
        marginBottom: 4,
    },
    locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 10 },
    locationText: { fontSize: FontSize.sm, color: `${Colors.white}90` },
    badgeRow: { flexDirection: 'row', gap: 8, alignItems: 'center' },
    categoryBadge: {
        borderRadius: BorderRadius.full,
        backgroundColor: `${Colors.white}20`,
        paddingHorizontal: 12,
        paddingVertical: 4,
    },
    categoryBadgeText: { fontSize: FontSize.sm, color: Colors.white, fontWeight: '700' },
    ratingBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderRadius: BorderRadius.full,
        backgroundColor: `${Colors.accent}25`,
        paddingHorizontal: 10,
        paddingVertical: 4,
    },
    ratingBadgeText: { fontSize: FontSize.sm, color: Colors.accent, fontWeight: '700' },

    statsCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        marginHorizontal: 16,
        marginTop: -20,
        borderRadius: BorderRadius.lg,
        paddingVertical: 16,
        ...Shadow.card,
    },
    statItem: { flex: 1, alignItems: 'center' },
    statValue: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.primary },
    statLabel: { fontSize: 11, color: Colors.textMuted, marginTop: 2 },
    statDivider: { width: 1, height: 32, backgroundColor: Colors.border },

    body: { padding: 16, gap: 12 },

    sectionTitle: {
        fontSize: FontSize.md,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 14,
    },

    strengthRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 10,
    },
    strengthPct: { fontSize: FontSize.sm, fontWeight: '800' },
    strengthTrack: {
        height: 8,
        backgroundColor: Colors.background,
        borderRadius: 4,
        marginBottom: 10,
        overflow: 'hidden',
    },
    strengthFill: { height: 8, borderRadius: 4 },
    tipRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
    tipText: { fontSize: FontSize.sm, color: Colors.textSecondary },

    detailRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 12,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    detailIconWrap: {
        width: 32,
        height: 32,
        borderRadius: 8,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 2,
    },
    detailContent: { flex: 1 },
    detailLabel: { fontSize: 11, color: Colors.textMuted, fontWeight: '600', marginBottom: 2 },
    detailValue: { fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: '500' },
    detailMuted: { color: Colors.textMuted, fontStyle: 'italic' },

    servicesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    addBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        borderRadius: BorderRadius.full,
        borderWidth: 1.5,
        borderColor: Colors.primary,
        paddingHorizontal: 12,
        paddingVertical: 5,
    },
    addBtnText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '700' },
    chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
    chip: {
        backgroundColor: `${Colors.primary}12`,
        borderRadius: BorderRadius.full,
        paddingHorizontal: 14,
        paddingVertical: 6,
        borderWidth: 1,
        borderColor: `${Colors.primary}25`,
    },
    chipText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600' },
    emptyBox: { alignItems: 'center', paddingVertical: 20, gap: 8 },
    emptyText: { fontSize: FontSize.sm, color: Colors.textMuted },
    emptyAddBtn: {
        borderRadius: BorderRadius.full,
        borderWidth: 1.5,
        borderColor: Colors.primary,
        paddingHorizontal: 20,
        paddingVertical: 8,
    },
    emptyAddText: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '700' },

    ratingDisplay: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    ratingBigNum: { fontSize: 44, fontWeight: '900', color: Colors.textPrimary },
    stars: { flexDirection: 'row', gap: 2, marginBottom: 4 },
    ratingCount: { fontSize: FontSize.sm, color: Colors.textMuted },

    quickRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    quickIcon: {
        width: 34,
        height: 34,
        borderRadius: 10,
        backgroundColor: `${Colors.primary}10`,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    quickLabel: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: '600' },

    logoutBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Colors.errorLight,
        borderRadius: BorderRadius.lg,
        paddingVertical: 16,
        marginBottom: 40,
        borderWidth: 1,
        borderColor: `${Colors.error}20`,
    },
    logoutText: { fontSize: FontSize.md, color: Colors.error, fontWeight: '700' },
});

export default ProfileScreen;
