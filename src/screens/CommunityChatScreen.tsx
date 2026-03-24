import React, { useEffect, useState, useRef, useCallback } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform,
    Animated,
    RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, FontSize, BorderRadius, Shadow } from '../theme/colors';
import { communityAPI } from '../service/apis/communityService';
import { Avatar } from '../components/ui/Avatar';

// ─── Types ────────────────────────────────────────────────────────────────────

type Props = {
    navigation: any;
    route: {
        params: {
            communityId: string;
            communityName: string;
            memberCount: number;
            type: string;
        };
    };
};

/** Shape returned by GET /communities/:id/messages */
type ApiMessage = {
    _id: string;
    community: string;
    sender: {
        _id: string;
        email: string;
        companyName: string;
    };
    message: string; // ← "message", NOT "content"
    messageType: string;
    isEdited: boolean;
    createdAt: string;
    updatedAt: string;
};

/** Optimistic message (same shape + private flag) */
type OptimisticMessage = ApiMessage & { _isOptimistic?: boolean };

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

const formatTime = (dateStr: string) =>
    new Date(dateStr).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

const formatDateDivider = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
};

const isSameDay = (d1: string, d2: string) =>
    new Date(d1).toDateString() === new Date(d2).toDateString();

// ─── Component ────────────────────────────────────────────────────────────────

const CommunityChatScreen: React.FC<Props> = ({ navigation, route }) => {
    const { communityId, communityName, memberCount, type } = route.params;

    const [messages, setMessages] = useState<OptimisticMessage[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [inputText, setInputText] = useState('');
    const [sending, setSending] = useState(false);
    const [showInfo, setShowInfo] = useState(false);
    const [myId, setMyId] = useState<string | null>(null);

    const flatListRef = useRef<FlatList>(null);
    const inputRef = useRef<TextInput>(null);
    const infoAnim = useRef(new Animated.Value(0)).current;
    const sendScale = useRef(new Animated.Value(1)).current;

    const icon = TYPE_ICONS[type] ?? TYPE_ICONS.default;

    // ── Load current user ID from storage ──────────────────────────────────
    // Change 'userId' to whatever key your auth stores the logged-in company _id
    useEffect(() => {
        AsyncStorage.getItem('userId').then(id => {
            if (id) setMyId(id);
        });
    }, []);

    // ── Fetch messages ──────────────────────────────────────────────────────
    const fetchMessages = useCallback(
        async (isRefresh = false) => {
            try {
                if (isRefresh) setRefreshing(true);
                const response = await communityAPI.getMessages(communityId);
                if (response.data?.success) {
                    setMessages(response.data.data as ApiMessage[]);
                }
            } catch (error) {
                console.error('FETCH MESSAGES ERROR:', error);
            } finally {
                setLoading(false);
                setRefreshing(false);
            }
        },
        [communityId],
    );

    useEffect(() => {
        fetchMessages();
    }, [fetchMessages]);

    // Auto-scroll to bottom whenever new messages arrive
    useEffect(() => {
        if (messages.length > 0) {
            setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 120);
        }
    }, [messages.length]);

    // ── Info banner toggle ──────────────────────────────────────────────────
    const toggleInfo = () => {
        const toValue = showInfo ? 0 : 1;
        setShowInfo(!showInfo);
        Animated.spring(infoAnim, {
            toValue,
            useNativeDriver: true,
            tension: 60,
            friction: 12,
        }).start();
    };

    // ── Send message ────────────────────────────────────────────────────────
    const animateSend = () => {
        Animated.sequence([
            Animated.timing(sendScale, { toValue: 0.82, duration: 80, useNativeDriver: true }),
            Animated.spring(sendScale, { toValue: 1, useNativeDriver: true, tension: 80 }),
        ]).start();
    };

    const handleSend = async () => {
        const text = inputText.trim();
        if (!text || sending) return;

        animateSend();
        setInputText('');
        setSending(true);

        // Optimistic message — mirrors real API shape exactly
        const optimistic: OptimisticMessage = {
            _id: `temp_${Date.now()}`,
            community: communityId,
            sender: {
                _id: myId ?? 'me',
                email: '',
                companyName: 'You',
            },
            message: text, // ← correct field
            messageType: 'text',
            isEdited: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            _isOptimistic: true,
        };

        setMessages(prev => [...prev, optimistic]);

        try {
            // API body key is "message"
            await communityAPI.createMessage(communityId, { message: text });
            await fetchMessages(); // replace optimistic with server data
        } catch (error) {
            console.error('SEND MESSAGE ERROR:', error);
            setMessages(prev => prev.filter(m => m._id !== optimistic._id));
            setInputText(text);
        } finally {
            setSending(false);
        }
    };

    // ── Render single message row ───────────────────────────────────────────
    const renderItem = ({ item, index }: { item: OptimisticMessage; index: number }) => {
        // Own = sender._id matches logged-in user
        const isOwn = !!myId && item.sender._id === myId;

        const prevMsg = messages[index - 1];
        const showDivider = !prevMsg || !isSameDay(item.createdAt, prevMsg.createdAt);
        const showAvatar =
            !isOwn && (!prevMsg || prevMsg.sender._id !== item.sender._id || showDivider);

        const displayName = item.sender.companyName || item.sender.email || '?';

        return (
            <>
                {showDivider && (
                    <View style={styles.dividerRow}>
                        <View style={styles.dividerLine} />
                        <Text style={styles.dividerText}>{formatDateDivider(item.createdAt)}</Text>
                        <View style={styles.dividerLine} />
                    </View>
                )}

                <View style={[styles.msgRow, isOwn ? styles.msgRowOwn : styles.msgRowOther]}>
                    {/* Avatar — other messages only */}
                    {!isOwn && (
                        <View style={styles.avatarCol}>
                            {showAvatar ? (
                                <Avatar name={displayName} size={34} />
                            ) : (
                                <View style={{ width: 34 }} />
                            )}
                        </View>
                    )}

                    <View
                        style={[styles.msgGroup, isOwn ? styles.msgGroupOwn : styles.msgGroupOther]}
                    >
                        {/* Company / sender name, first bubble in a run */}
                        {showAvatar && !isOwn && (
                            <Text style={styles.senderName}>{displayName}</Text>
                        )}

                        {/* Bubble */}
                        <View
                            style={[
                                styles.bubble,
                                isOwn ? styles.bubbleOwn : styles.bubbleOther,
                                item._isOptimistic && styles.bubbleOptimistic,
                            ]}
                        >
                            <Text
                                style={[
                                    styles.bubbleText,
                                    isOwn ? styles.bubbleTextOwn : styles.bubbleTextOther,
                                ]}
                            >
                                {item.message}
                            </Text>
                        </View>

                        {/* Meta row: edited tag + time + tick */}
                        <View
                            style={[
                                styles.metaRow,
                                isOwn ? styles.metaRowOwn : styles.metaRowOther,
                            ]}
                        >
                            {item.isEdited && <Text style={styles.editedTag}>edited</Text>}
                            <Text style={styles.msgTime}>{formatTime(item.createdAt)}</Text>
                            {isOwn && (
                                <Text style={styles.msgCheck}>
                                    {item._isOptimistic ? ' 🕐' : ' ✓✓'}
                                </Text>
                            )}
                        </View>
                    </View>
                </View>
            </>
        );
    };

    const infoTranslateY = infoAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [-14, 0],
    });

    // ── Render ──────────────────────────────────────────────────────────────
    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            keyboardVerticalOffset={0}
        >
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.headerCenter}
                    onPress={toggleInfo}
                    activeOpacity={0.8}
                >
                    <View style={styles.headerIconBubble}>
                        <Text style={styles.headerIconText}>{icon}</Text>
                    </View>
                    <View style={styles.headerTextBlock}>
                        <Text style={styles.headerName} numberOfLines={1}>
                            {communityName}
                        </Text>
                        <Text style={styles.headerSub}>
                            👥 {memberCount} members · {type}
                        </Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.headerAction}
                    onPress={() => fetchMessages(true)}
                    activeOpacity={0.7}
                >
                    <Text style={styles.headerActionIcon}>⟳</Text>
                </TouchableOpacity>
            </View>

            {/* Collapsible Info Banner */}
            {showInfo && (
                <Animated.View
                    style={[
                        styles.infoBanner,
                        { transform: [{ translateY: infoTranslateY }], opacity: infoAnim },
                    ]}
                >
                    <Text style={styles.infoText}>
                        {icon} <Text style={{ fontWeight: '800' }}>{communityName}</Text>
                        {` — ${type} community with ${memberCount} members.`}
                    </Text>
                </Animated.View>
            )}

            {/* Messages */}
            {loading ? (
                <View style={styles.loaderWrapper}>
                    <ActivityIndicator size="large" color={Colors.primary} />
                    <Text style={styles.loaderText}>Loading messages…</Text>
                </View>
            ) : (
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    keyExtractor={item => item._id}
                    contentContainerStyle={[
                        styles.msgList,
                        messages.length === 0 && styles.msgListEmpty,
                    ]}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={() => fetchMessages(true)}
                            colors={[Colors.primary]}
                            tintColor={Colors.primary}
                        />
                    }
                    ListEmptyComponent={
                        <View style={styles.emptyWrapper}>
                            <Text style={styles.emptyEmoji}>💬</Text>
                            <Text style={styles.emptyTitle}>No messages yet</Text>
                            <Text style={styles.emptySubtitle}>Be the first to say something!</Text>
                        </View>
                    }
                    renderItem={renderItem}
                    onContentSizeChange={() =>
                        flatListRef.current?.scrollToEnd({ animated: false })
                    }
                />
            )}

            {/* Input Bar */}
            <View style={styles.inputBar}>
                <TouchableOpacity style={styles.attachBtn} activeOpacity={0.7}>
                    <Text style={styles.attachIcon}>📎</Text>
                </TouchableOpacity>

                <TextInput
                    ref={inputRef}
                    style={styles.input}
                    value={inputText}
                    onChangeText={setInputText}
                    placeholder="Type a message..."
                    placeholderTextColor={Colors.textMuted}
                    multiline
                    maxLength={1000}
                    returnKeyType="send"
                    blurOnSubmit={false}
                    onSubmitEditing={handleSend}
                />

                <Animated.View style={{ transform: [{ scale: sendScale }] }}>
                    <TouchableOpacity
                        style={[
                            styles.sendBtn,
                            (!inputText.trim() || sending) && styles.sendBtnDisabled,
                        ]}
                        onPress={handleSend}
                        disabled={!inputText.trim() || sending}
                        activeOpacity={0.85}
                    >
                        {sending ? (
                            <ActivityIndicator size="small" color={Colors.white} />
                        ) : (
                            <Text style={styles.sendIcon}>➤</Text>
                        )}
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </KeyboardAvoidingView>
    );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },

    /* Header */
    header: {
        backgroundColor: Colors.primaryDark,
        paddingTop: 26,
        paddingBottom: 14,
        paddingHorizontal: 12,
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: 8,
    },
    backBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: `${Colors.white}18`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backIcon: { fontSize: 20, color: Colors.white, fontWeight: '700' },
    headerCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
    },
    headerIconBubble: {
        width: 42,
        height: 42,
        borderRadius: 13,
        backgroundColor: `${Colors.white}20`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerIconText: { fontSize: 20 },
    headerTextBlock: { flex: 1 },
    headerName: {
        fontSize: FontSize.md,
        fontWeight: '800',
        color: Colors.white,
        marginBottom: 2,
    },
    headerSub: { fontSize: 11, color: `${Colors.white}80`, fontWeight: '500' },
    headerAction: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: `${Colors.white}18`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    headerActionIcon: { fontSize: 18, color: Colors.white, fontWeight: '700' },

    /* Info Banner */
    infoBanner: {
        backgroundColor: `${Colors.primary}12`,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
        paddingHorizontal: 16,
        paddingVertical: 10,
    },
    infoText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 18 },

    /* Loader */
    loaderWrapper: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
    loaderText: { fontSize: FontSize.sm, color: Colors.textMuted, fontWeight: '600' },

    /* Messages */
    msgList: { paddingHorizontal: 12, paddingTop: 12, paddingBottom: 16 },
    msgListEmpty: { flex: 1 },

    msgRow: { flexDirection: 'row', marginVertical: 2, alignItems: 'flex-end' },
    msgRowOwn: { justifyContent: 'flex-end' },
    msgRowOther: { justifyContent: 'flex-start' },

    avatarCol: { marginRight: 8, marginBottom: 4 },

    msgGroup: { maxWidth: '72%' },
    msgGroupOwn: { alignItems: 'flex-end' },
    msgGroupOther: { alignItems: 'flex-start' },

    senderName: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.primary,
        marginBottom: 3,
        marginLeft: 4,
    },

    bubble: {
        paddingHorizontal: 14,
        paddingVertical: 10,
        borderRadius: 18,
    },
    bubbleOwn: {
        backgroundColor: Colors.primary,
        borderBottomRightRadius: 4,
    },
    bubbleOther: {
        backgroundColor: Colors.surface,
        borderBottomLeftRadius: 4,
        ...Shadow.card,
    },
    bubbleOptimistic: { opacity: 0.6 },
    bubbleText: { fontSize: FontSize.sm, lineHeight: 20 },
    bubbleTextOwn: { color: Colors.white },
    bubbleTextOther: { color: Colors.textPrimary },

    /* Meta row */
    metaRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 3,
        gap: 4,
        marginHorizontal: 4,
    },
    metaRowOwn: { justifyContent: 'flex-end' },
    metaRowOther: { justifyContent: 'flex-start' },
    editedTag: { fontSize: 9, color: Colors.textMuted, fontStyle: 'italic' },
    msgTime: { fontSize: 10, color: Colors.textMuted },
    msgTimeOwn: { textAlign: 'right' },
    msgTimeOther: { textAlign: 'left' },
    msgCheck: { fontSize: 10, color: `${Colors.primary}80` },

    /* Date divider */
    dividerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 14,
        gap: 10,
    },
    dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
    dividerText: {
        fontSize: 11,
        fontWeight: '700',
        color: Colors.textMuted,
        letterSpacing: 0.5,
    },

    /* Empty */
    emptyWrapper: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 80,
        gap: 10,
    },
    emptyEmoji: { fontSize: 52, marginBottom: 8 },
    emptyTitle: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.textPrimary },
    emptySubtitle: { fontSize: FontSize.sm, color: Colors.textMuted, textAlign: 'center' },

    /* Input Bar */
    inputBar: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        backgroundColor: Colors.surface,
        paddingHorizontal: 12,
        paddingVertical: 10,
        paddingBottom: Platform.OS === 'ios' ? 28 : 14,
        borderTopWidth: 1,
        borderTopColor: Colors.border,
        gap: 8,
        ...Shadow.card,
    },
    attachBtn: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: Colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    attachIcon: { fontSize: 18 },
    input: {
        flex: 1,
        backgroundColor: Colors.background,
        borderRadius: BorderRadius.lg,
        paddingHorizontal: 14,
        paddingVertical: 10,
        fontSize: FontSize.sm,
        color: Colors.textPrimary,
        maxHeight: 120,
        lineHeight: 20,
    },
    sendBtn: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: Colors.primary,
        alignItems: 'center',
        justifyContent: 'center',
        ...Shadow.button,
    },
    sendBtnDisabled: { backgroundColor: `${Colors.primary}40` },
    sendIcon: { fontSize: 16, color: Colors.white, marginLeft: 2 },
});

export default CommunityChatScreen;
