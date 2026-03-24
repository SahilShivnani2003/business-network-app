import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    Animated,
    RefreshControl,
} from 'react-native';
import { Colors, FontSize, BorderRadius, Shadow, Spacing } from '../../theme/colors';
import { communityAPI } from '../../service/apis/communityService';

type Props = { navigation: any };

type Community = {
    _id: string;
    name: string;
    description: string;
    type: string;
    createdBy: { _id: string; name: string; email: string };
    isActive: boolean;
    memberCount: number;
    members: { company: string; joinedAt: string; _id: string }[];
    createdAt: string;
    updatedAt: string;
};

const TYPE_ICONS: Record<string, string> = {
    Transportation: '🚚',
    Technology: '💻',
    Finance: '💰',
    Healthcare: '🏥',
    Education: '📚',
    Agriculture: '🌾',
    Manufacturing: '🏭',
    default: '🌐',
};

const CommunityCard: React.FC<{
    item: Community;
    onPress: () => void;
    showJoin?: boolean;
    onJoin?: () => void;
    joining?: boolean;
}> = ({ item, onPress, showJoin, onJoin, joining }) => {
    const icon = TYPE_ICONS[item.type] || TYPE_ICONS.default;
    return (
        <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
            <View style={styles.cardLeft}>
                <View style={styles.iconBubble}>
                    <Text style={styles.iconText}>{icon}</Text>
                </View>
            </View>
            <View style={styles.cardBody}>
                <View style={styles.cardTopRow}>
                    <Text style={styles.cardName} numberOfLines={1}>
                        {item.name}
                    </Text>
                    <View style={[styles.typeBadge, { backgroundColor: `${Colors.primary}18` }]}>
                        <Text style={styles.typeText}>{item.type}</Text>
                    </View>
                </View>
                <Text style={styles.cardDesc} numberOfLines={2}>
                    {item.description}
                </Text>
                <View style={styles.cardMeta}>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaIcon}>👥</Text>
                        <Text style={styles.metaText}>{item.memberCount} members</Text>
                    </View>
                    <View style={styles.metaItem}>
                        <Text style={styles.metaIcon}>👤</Text>
                        <Text style={styles.metaText}>{item.createdBy.name}</Text>
                    </View>
                </View>
            </View>
            {showJoin && (
                <TouchableOpacity
                    style={styles.joinBtn}
                    onPress={onJoin}
                    disabled={joining}
                    activeOpacity={0.8}
                >
                    {joining ? (
                        <ActivityIndicator size="small" color={Colors.white} />
                    ) : (
                        <Text style={styles.joinBtnText}>Join</Text>
                    )}
                </TouchableOpacity>
            )}
        </TouchableOpacity>
    );
};

const EmptyState: React.FC<{ tab: 'mine' | 'all' }> = ({ tab }) => (
    <View style={styles.emptyWrapper}>
        <Text style={styles.emptyEmoji}>{tab === 'mine' ? '🏘️' : '🌍'}</Text>
        <Text style={styles.emptyTitle}>
            {tab === 'mine' ? 'No communities yet' : 'No communities found'}
        </Text>
        <Text style={styles.emptySubtitle}>
            {tab === 'mine'
                ? 'Join or create a community to get started'
                : 'Check back later for new communities'}
        </Text>
    </View>
);

const CommunityScreen: React.FC<Props> = ({ navigation }) => {
    const [activeTab, setActiveTab] = useState<'mine' | 'all'>('mine');
    const [search, setSearch] = useState('');
    const [allCommunities, setAllCommunities] = useState<Community[]>([]);
    const [myCommunities, setMyCommunities] = useState<Community[]>([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [joiningId, setJoiningId] = useState<string | null>(null);

    const tabIndicator = useRef(new Animated.Value(0)).current;

    const switchTab = (tab: 'mine' | 'all') => {
        setActiveTab(tab);
        Animated.spring(tabIndicator, {
            toValue: tab === 'mine' ? 0 : 1,
            useNativeDriver: false,
            tension: 60,
            friction: 10,
        }).start();
    };

    const fetchAllCommunities = async () => {
        try {
            const response = await communityAPI.getAll();
            if (response.data?.success) setAllCommunities(response.data.data);
        } catch (error) {
            console.error('FETCH ALL COMMUNITIES ERROR:', error);
        }
    };

    const fetchMyCommunities = async () => {
        try {
            const response = await communityAPI.myCommunities();
            if (response.data?.success) setMyCommunities(response.data.data);
        } catch (error) {
            console.error('FETCH MY COMMUNITIES ERROR:', error);
        }
    };

    const loadData = async (isRefresh = false) => {
        if (isRefresh) setRefreshing(true);
        else setLoading(true);
        await Promise.all([fetchAllCommunities(), fetchMyCommunities()]);
        if (isRefresh) setRefreshing(false);
        else setLoading(false);
    };

    useEffect(() => {
        loadData();
    }, []);

    const handleJoin = async (communityId: string) => {
        try {
            setJoiningId(communityId);
            await communityAPI.join(communityId);
            await loadData();
        } catch (error) {
            console.error('JOIN ERROR:', error);
        } finally {
            setJoiningId(null);
        }
    };

    const myIds = new Set(myCommunities.map(c => c._id));

    const filteredMine = myCommunities.filter(
        c => search === '' || c.name.toLowerCase().includes(search.toLowerCase()),
    );
    const filteredAll = allCommunities.filter(
        c => search === '' || c.name.toLowerCase().includes(search.toLowerCase()),
    );

    const currentData = activeTab === 'mine' ? filteredMine : filteredAll;

    const indicatorLeft = tabIndicator.interpolate({
        inputRange: [0, 1],
        outputRange: ['2%', '52%'],
    });

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.headerLabel}>NETWORK</Text>
                    <Text style={styles.headerTitle}>Communities</Text>
                </View>
                <TouchableOpacity
                    style={styles.createBtn}
                    onPress={() => navigation.navigate('CreateCommunity')}
                    activeOpacity={0.85}
                >
                    <Text style={styles.createBtnIcon}>＋</Text>
                    <Text style={styles.createBtnText}>New</Text>
                </TouchableOpacity>
            </View>

            {/* Search */}
            <View style={styles.searchWrapper}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={styles.searchInput}
                    value={search}
                    onChangeText={setSearch}
                    placeholder="Search communities..."
                    placeholderTextColor={Colors.textMuted}
                />
                {search !== '' && (
                    <TouchableOpacity onPress={() => setSearch('')} style={styles.clearBtn}>
                        <Text style={styles.clearIcon}>✕</Text>
                    </TouchableOpacity>
                )}
            </View>

            {/* Tab Bar */}
            <View style={styles.tabBarWrapper}>
                <View style={styles.tabBar}>
                    <Animated.View style={[styles.tabIndicator, { left: indicatorLeft }]} />
                    <TouchableOpacity
                        style={styles.tabBtn}
                        onPress={() => switchTab('mine')}
                        activeOpacity={0.8}
                    >
                        <Text
                            style={[styles.tabText, activeTab === 'mine' && styles.tabTextActive]}
                        >
                            My Communities
                        </Text>
                        {myCommunities.length > 0 && (
                            <View
                                style={[
                                    styles.tabCount,
                                    activeTab === 'mine' && styles.tabCountActive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.tabCountText,
                                        activeTab === 'mine' && styles.tabCountTextActive,
                                    ]}
                                >
                                    {myCommunities.length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.tabBtn}
                        onPress={() => switchTab('all')}
                        activeOpacity={0.8}
                    >
                        <Text style={[styles.tabText, activeTab === 'all' && styles.tabTextActive]}>
                            All Communities
                        </Text>
                        {allCommunities.length > 0 && (
                            <View
                                style={[
                                    styles.tabCount,
                                    activeTab === 'all' && styles.tabCountActive,
                                ]}
                            >
                                <Text
                                    style={[
                                        styles.tabCountText,
                                        activeTab === 'all' && styles.tabCountTextActive,
                                    ]}
                                >
                                    {allCommunities.length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* List */}
            {loading ? (
                <View style={styles.loaderWrapper}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loaderText}>Loading communities...</Text>
                </View>
            ) : (
                <FlatList
                    data={currentData}
                    keyExtractor={item => item._id}
                    contentContainerStyle={[
                        styles.list,
                        currentData.length === 0 && styles.listEmpty,
                    ]}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => loadData(true)}
                            colors={[Colors.primary]}
                            tintColor={Colors.primary}
                        />
                    }
                    ListEmptyComponent={<EmptyState tab={activeTab} />}
                    renderItem={({ item }) => (
                        <CommunityCard
                            item={item}
                            onPress={() =>
                                navigation.navigate('CommunityChatScreen', {
                                    communityId: item._id,
                                    communityName: item.name,
                                    memberCount: item.memberCount,
                                    type: item.type,
                                })
                            }
                            showJoin={activeTab === 'all' && !myIds.has(item._id)}
                            onJoin={() => handleJoin(item._id)}
                            joining={joiningId === item._id}
                        />
                    )}
                    ItemSeparatorComponent={() => <View style={styles.separator} />}
                />
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },

    /* Header */
    header: {
        backgroundColor: Colors.primaryDark,
        paddingTop: 28,
        paddingBottom: 22,
        paddingHorizontal: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
    },
    headerLabel: {
        fontSize: 11,
        fontWeight: '700',
        letterSpacing: 2,
        color: `${Colors.white}70`,
        marginBottom: 2,
    },
    headerTitle: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.white },
    createBtn: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.accent,
        paddingHorizontal: 14,
        paddingVertical: 9,
        borderRadius: BorderRadius.full,
        gap: 4,
        ...Shadow.button,
    },
    createBtnIcon: { fontSize: 16, color: Colors.white, fontWeight: '700' },
    createBtnText: { fontSize: FontSize.sm, fontWeight: '800', color: Colors.white },

    /* Search */
    searchWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 4,
        borderRadius: BorderRadius.lg,
        paddingHorizontal: 14,
        ...Shadow.card,
    },
    searchIcon: { fontSize: 16, marginRight: 8 },
    searchInput: {
        flex: 1,
        fontSize: FontSize.md,
        color: Colors.textPrimary,
        paddingVertical: 13,
    },
    clearBtn: { padding: 4 },
    clearIcon: { fontSize: 13, color: Colors.textMuted, fontWeight: '700' },

    /* Tab Bar */
    tabBarWrapper: { paddingHorizontal: 16, paddingVertical: 12 },
    tabBar: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: 4,
        position: 'relative',
        ...Shadow.card,
    },
    tabIndicator: {
        position: 'absolute',
        top: 4,
        width: '46%',
        height: '100%',
        backgroundColor: Colors.primary,
        borderRadius: BorderRadius.md,
        zIndex: 0,
    },
    tabBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
        borderRadius: BorderRadius.md,
        zIndex: 1,
        gap: 6,
    },
    tabText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textMuted },
    tabTextActive: { color: Colors.white },
    tabCount: {
        backgroundColor: `${Colors.primary}20`,
        paddingHorizontal: 6,
        paddingVertical: 1,
        borderRadius: BorderRadius.full,
        minWidth: 20,
        alignItems: 'center',
    },
    tabCountActive: { backgroundColor: `${Colors.white}30` },
    tabCountText: { fontSize: 10, fontWeight: '800', color: Colors.primary },
    tabCountTextActive: { color: Colors.white },

    /* List */
    list: { paddingHorizontal: 16, paddingBottom: 100 },
    listEmpty: { flex: 1 },
    separator: { height: 10 },

    /* Card */
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.lg,
        padding: 14,
        gap: 12,
        ...Shadow.card,
    },
    cardLeft: { alignItems: 'center', justifyContent: 'flex-start' },
    iconBubble: {
        width: 52,
        height: 52,
        borderRadius: 16,
        backgroundColor: `${Colors.primary}12`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconText: { fontSize: 24 },
    cardBody: { flex: 1 },
    cardTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4,
        gap: 8,
    },
    cardName: {
        fontSize: FontSize.md,
        fontWeight: '800',
        color: Colors.textPrimary,
        flex: 1,
    },
    typeBadge: {
        paddingHorizontal: 8,
        paddingVertical: 3,
        borderRadius: BorderRadius.full,
    },
    typeText: { fontSize: 10, fontWeight: '700', color: Colors.primary },
    cardDesc: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        lineHeight: 18,
        marginBottom: 8,
    },
    cardMeta: { flexDirection: 'row', gap: 12 },
    metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    metaIcon: { fontSize: 12 },
    metaText: { fontSize: 11, color: Colors.textMuted, fontWeight: '600' },

    /* Join Button */
    joinBtn: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: BorderRadius.full,
        minWidth: 52,
        alignItems: 'center',
        ...Shadow.button,
    },
    joinBtnText: { color: Colors.white, fontSize: FontSize.sm, fontWeight: '800' },

    /* Loader */
    loaderWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    loaderText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },

    /* Empty */
    emptyWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 60,
        gap: 10,
    },
    emptyEmoji: { fontSize: 52, marginBottom: 8 },
    emptyTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
    emptySubtitle: {
        fontSize: FontSize.sm,
        color: Colors.textMuted,
        textAlign: 'center',
        paddingHorizontal: 32,
        lineHeight: 20,
    },
});

export default CommunityScreen;
