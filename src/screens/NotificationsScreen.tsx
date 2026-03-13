import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import { MOCK_NOTIFICATIONS } from '../data/mockData';
import { BorderRadius, Colors, FontSize } from '../theme/colors';

export const NotificationsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const icons: Record<string, string> = {
        lead: '🎯',
        message: '💬',
        event: '📅',
        connection: '🤝',
        referral: '⭐',
    };
    const colors: Record<string, string> = {
        lead: Colors.accent,
        message: Colors.primary,
        event: Colors.success,
        connection: Colors.primaryLight,
        referral: Colors.premium,
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Notifications</Text>
            </View>
            <ScrollView
                contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 }}
            >
                {MOCK_NOTIFICATIONS.map(notif => (
                    <View
                        key={notif.id}
                        style={[styles.notifItem, !notif.isRead && styles.notifUnread]}
                    >
                        <View
                            style={[
                                styles.notifIconBox,
                                { backgroundColor: `${colors[notif.type]}15` },
                            ]}
                        >
                            <Text style={{ fontSize: 22 }}>{icons[notif.type]}</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.notifTitle}>{notif.title}</Text>
                            <Text style={styles.notifBody}>{notif.body}</Text>
                            <Text style={styles.notifTime}>{notif.timestamp}</Text>
                        </View>
                        {!notif.isRead && <View style={styles.unreadDot} />}
                    </View>
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: Colors.background },
    header: {
        backgroundColor: Colors.primaryDark,
        paddingTop: 52,
        paddingBottom: 18,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 14,
    },
    backBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: `${Colors.white}20`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    backText: { color: Colors.white, fontSize: FontSize.xl, fontWeight: '700' },
    headerTitle: { fontSize: FontSize.xl, fontWeight: '900', color: Colors.white },
    notifItem: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        gap: 14,
        paddingVertical: 14,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    notifUnread: { backgroundColor: `${Colors.primary}06` },
    notifIconBox: {
        width: 44,
        height: 44,
        borderRadius: BorderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
    },
    notifTitle: {
        fontSize: FontSize.md,
        fontWeight: '700',
        color: Colors.textPrimary,
        marginBottom: 3,
    },
    notifBody: {
        fontSize: FontSize.sm,
        color: Colors.textSecondary,
        lineHeight: 20,
        marginBottom: 5,
    },
    notifTime: { fontSize: 11, color: Colors.textMuted },
    unreadDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: Colors.primary,
        marginTop: 6,
    },
});
