import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Card } from '../components/ui/Card';
import { BorderRadius, Colors, FontSize } from '../theme/colors';

export const SettingsScreen: React.FC<{ navigation: any }> = ({ navigation }) => {
    const settings = [
        { icon: '👤', label: 'Edit Profile', action: () => {} },
        { icon: '🔑', label: 'Change Password', action: () => {} },
        { icon: '🔔', label: 'Notification Settings', action: () => {} },
        { icon: '🔒', label: 'Privacy Settings', action: () => {} },
        {
            icon: '💳',
            label: 'Membership & Billing',
            action: () => navigation.navigate('Membership'),
        },
        { icon: '🆘', label: 'Help & Support', action: () => {} },
        { icon: '📋', label: 'Terms & Privacy Policy', action: () => {} },
    ];

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Settings</Text>
            </View>
            <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
                <Card>
                    {settings.map((s, i) => (
                        <TouchableOpacity
                            key={s.label}
                            style={[
                                styles.settingRow,
                                i < settings.length - 1 && styles.settingBorder,
                            ]}
                            onPress={s.action}
                        >
                            <Text style={styles.settingIcon}>{s.icon}</Text>
                            <Text style={styles.settingLabel}>{s.label}</Text>
                            <Text style={styles.settingArrow}>→</Text>
                        </TouchableOpacity>
                    ))}
                </Card>
                <TouchableOpacity
                    style={styles.logoutBtnSettings}
                    onPress={() => navigation.replace('Login')}
                >
                    <Text style={styles.logoutIcon}>🚪</Text>
                    <Text style={styles.logoutText}>Logout</Text>
                </TouchableOpacity>
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
    settingRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14 },
    settingBorder: { borderBottomWidth: 1, borderBottomColor: Colors.border },
    settingIcon: { fontSize: 22, width: 36 },
    settingLabel: { flex: 1, fontSize: FontSize.md, color: Colors.textPrimary, fontWeight: '500' },
    settingArrow: { color: Colors.textMuted, fontSize: 16 },
    logoutBtnSettings: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        backgroundColor: Colors.errorLight,
        borderRadius: BorderRadius.lg,
        paddingVertical: 16,
        marginTop: 16,
        borderWidth: 1,
        borderColor: `${Colors.error}20`,
    },
    logoutIcon: { fontSize: 20 },
    logoutText: { fontSize: FontSize.md, color: Colors.error, fontWeight: '700' },
});
