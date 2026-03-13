import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import { Avatar } from '../components/ui/avatar';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { MOCK_MEMBERS } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Colors, FontSize } from '../theme/colors';

export const AIMatchScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>AI Smart Match</Text>
        </View>
        <ScrollView
            contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 8, paddingBottom: 40 }}
        >
            <Card style={styles.aiBannerCard}>
                <Text style={{ fontSize: 40, textAlign: 'center', marginBottom: 12 }}>🤖</Text>
                <Text style={styles.aiTitle}>Your AI Business Matchmaker</Text>
                <Text style={styles.aiDesc}>
                    Our AI analyzes your profile, industry, and activity to suggest the most
                    relevant connections, clients, and business partners.
                </Text>
            </Card>
            <Text style={styles.sectionTitle}>Potential Clients</Text>
            {MOCK_MEMBERS.slice(0, 2).map(m => (
                <Card key={m.id} style={styles.matchCard}>
                    <View style={styles.matchRow}>
                        <Avatar name={m.name} size={50} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <View style={styles.matchMeta}>
                                <Text style={styles.matchName}>{m.name}</Text>
                                <Badge label="92% Match" color={Colors.success} size="sm" />
                            </View>
                            <Text style={styles.matchCompany}>{m.company}</Text>
                            <Badge label={m.industry} size="sm" />
                        </View>
                    </View>
                    <View style={styles.actionRow}>
                        <Button
                            label="Connect"
                            onPress={() => {}}
                            variant="primary"
                            size="sm"
                            style={{ flex: 1 }}
                        />
                        <Button
                            label="View Profile"
                            onPress={() => navigation.navigate('MemberProfile', { memberId: m.id })}
                            variant="outline"
                            size="sm"
                            style={{ flex: 1 }}
                        />
                    </View>
                </Card>
            ))}
            <Text style={styles.sectionTitle}>Potential Partners</Text>
            {MOCK_MEMBERS.slice(2, 4).map(m => (
                <Card key={m.id} style={styles.matchCard}>
                    <View style={styles.matchRow}>
                        <Avatar name={m.name} size={50} />
                        <View style={{ flex: 1, marginLeft: 12 }}>
                            <View style={styles.matchMeta}>
                                <Text style={styles.matchName}>{m.name}</Text>
                                <Badge label="85% Match" color={Colors.primary} size="sm" />
                            </View>
                            <Text style={styles.matchCompany}>{m.company}</Text>
                            <Badge label={m.industry} size="sm" />
                        </View>
                    </View>
                    <View style={styles.actionRow}>
                        <Button
                            label="Connect"
                            onPress={() => {}}
                            variant="primary"
                            size="sm"
                            style={{ flex: 1 }}
                        />
                        <Button
                            label="View Profile"
                            onPress={() => navigation.navigate('MemberProfile', { memberId: m.id })}
                            variant="outline"
                            size="sm"
                            style={{ flex: 1 }}
                        />
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
    aiBannerCard: {
        backgroundColor: `${Colors.primary}08`,
        borderWidth: 1,
        borderColor: `${Colors.primary}20`,
        marginBottom: 20,
    },
    aiTitle: {
        fontSize: FontSize.xl,
        fontWeight: '900',
        color: Colors.textPrimary,
        textAlign: 'center',
        marginBottom: 8,
    },
    aiDesc: {
        fontSize: FontSize.md,
        color: Colors.textSecondary,
        textAlign: 'center',
        lineHeight: 24,
    },
    matchCard: { marginBottom: 14 },
    matchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    matchMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
    matchName: { fontSize: FontSize.md, fontWeight: '800', color: Colors.textPrimary },
    matchCompany: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: 6 },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 14,
    },
    actionRow: { flexDirection: 'row', gap: 12, marginHorizontal: 16, marginTop: 12 },
});
