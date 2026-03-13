import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { MOCK_MEMBERS } from '../data/mockData';
import { BorderRadius, Colors, FontSize, Shadow } from '../theme/colors';

export const ReferralsScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Referrals</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            <View style={styles.referralStats}>
                <View style={styles.referralStat}>
                    <Text style={styles.referralStatVal}>7</Text>
                    <Text style={styles.referralStatLabel}>Given</Text>
                </View>
                <View style={styles.referralStat}>
                    <Text style={styles.referralStatVal}>3</Text>
                    <Text style={styles.referralStatLabel}>Received</Text>
                </View>
                <View style={styles.referralStat}>
                    <Text style={styles.referralStatVal}>2</Text>
                    <Text style={styles.referralStatLabel}>Converted</Text>
                </View>
            </View>
            <Text style={styles.sectionTitle}>Recent Referrals</Text>
            {MOCK_MEMBERS.slice(0, 4).map(m => (
                <Card key={m.id} style={styles.referralCard}>
                    <View style={styles.referralRow}>
                        <Avatar name={m.name} size={44} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <Text style={styles.referralName}>{m.name}</Text>
                            <Text style={styles.referralCompany}>{m.company}</Text>
                        </View>
                        <Badge label="✓ Given" color={Colors.success} size="sm" />
                    </View>
                </Card>
            ))}
        </ScrollView>
    </View>
);

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
    referralStats: {
        flexDirection: 'row',
        backgroundColor: Colors.surface,
        borderRadius: BorderRadius.xl,
        paddingVertical: 20,
        marginBottom: 20,
        ...Shadow.card,
    },
    referralStat: { flex: 1, alignItems: 'center' },
    referralStatVal: { fontSize: FontSize.xxxl, fontWeight: '900', color: Colors.primary },
    referralStatLabel: { fontSize: FontSize.sm, color: Colors.textMuted, marginTop: 2 },
    referralCard: { marginBottom: 12 },
    referralRow: { flexDirection: 'row', alignItems: 'center' },
    referralName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
    referralCompany: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2 },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 14,
    },
});
