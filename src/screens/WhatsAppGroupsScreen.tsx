import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/Button';
import { WHATSAPP_GROUPS } from '../data/mockData';
import { Colors, FontSize } from '../theme/colors';

export const WhatsAppGroupsScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>WhatsApp Groups</Text>
        </View>
        <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 }}
        >
            <Text style={styles.plansSubtitle}>Connect with industry peers on WhatsApp</Text>
            {WHATSAPP_GROUPS.map(group => (
                <Card key={group.id}>
                    <View style={styles.groupRow}>
                        <View style={styles.groupIcon}>
                            <Text style={{ fontSize: 26 }}>💬</Text>
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.groupName}>{group.name}</Text>
                            <Badge label={group.industry} size="sm" />
                            <Text style={styles.groupDesc}>{group.description}</Text>
                            <Text style={styles.groupMembers}>👥 {group.members} members</Text>
                        </View>
                    </View>
                    <Button
                        label="Join WhatsApp Group →"
                        onPress={() => {}}
                        variant="accent"
                        fullWidth
                        size="md"
                        style={{ marginTop: 12 }}
                    />
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
    groupRow: { flexDirection: 'row', gap: 14, marginBottom: 4 },
    groupIcon: {
        width: 50,
        height: 50,
        borderRadius: 12,
        backgroundColor: `${Colors.success}15`,
        alignItems: 'center',
        justifyContent: 'center',
    },
    groupName: {
        fontSize: FontSize.md,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 6,
    },
    groupDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 6, lineHeight: 20 },
    groupMembers: { fontSize: 12, color: Colors.textMuted, marginTop: 4 },
    plansSubtitle: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 4,
    },
});
