import { ScrollView, View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { TrustScore } from '../components/ui/TrustScore';
import { MOCK_MEMBERS } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { BorderRadius, Colors, FontSize, Shadow } from '../theme/colors';

export const MemberProfileScreen: React.FC<{ route: any; navigation: any }> = ({
    route,
    navigation,
}) => {
    const member = MOCK_MEMBERS.find(m => m.id === route.params?.memberId) || MOCK_MEMBERS[0];

    return (
        <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                    <Text style={styles.backText}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Member Profile</Text>
            </View>
            <View style={styles.profileCard}>
                <Avatar name={member.name} size={80} />
                <View style={styles.profileBadge}>
                    {member.isVerified && <Text style={styles.verifiedBadge}>✓ Verified</Text>}
                </View>
                <Text style={styles.name}>{member.name}</Text>
                <Text style={styles.company}>{member.company}</Text>
                <View style={styles.badgeRow}>
                    <Badge label={member.industry} />
                    <Badge
                        label={`📍 ${member.city}`}
                        color={Colors.textSecondary}
                        bgColor={Colors.background}
                    />
                    <TrustScore score={member.trustScore} />
                </View>
            </View>

            <View style={styles.actionRow}>
                <Button
                    label="🤝 Connect"
                    onPress={() => {}}
                    variant="primary"
                    size="md"
                    style={{ flex: 1 }}
                />
                <Button
                    label="💬 Message"
                    onPress={() => navigation.navigate('Messages')}
                    variant="outline"
                    size="md"
                    style={{ flex: 1 }}
                />
            </View>
            <View style={styles.actionRow}>
                <Button
                    label="📅 Request Meeting"
                    onPress={() => {}}
                    variant="ghost"
                    size="md"
                    style={{ flex: 1 }}
                />
                <Button
                    label="⭐ Refer Client"
                    onPress={() => {}}
                    variant="ghost"
                    size="md"
                    style={{ flex: 1 }}
                />
            </View>

            <Card style={styles.aboutCard}>
                <Text style={styles.sectionTitle}>About & Services</Text>
                {(member.services || []).map(s => (
                    <View key={s} style={styles.serviceTag}>
                        <Text style={styles.serviceTagText}>• {s}</Text>
                    </View>
                ))}
            </Card>
        </ScrollView>
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
    profileCard: {
        alignItems: 'center',
        paddingVertical: 24,
        backgroundColor: Colors.surface,
        marginHorizontal: 16,
        marginTop: 16,
        borderRadius: BorderRadius.xl,
        ...Shadow.card,
    },
    profileBadge: { marginBottom: 8 },
    verifiedBadge: {
        backgroundColor: `${Colors.primary}15`,
        color: Colors.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: BorderRadius.full,
        fontSize: FontSize.sm,
        fontWeight: '700',
    },
    name: { fontSize: FontSize.xxl, fontWeight: '900', color: Colors.textPrimary },
    company: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: 12 },
    badgeRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, justifyContent: 'center' },
    sectionTitle: {
        fontSize: FontSize.lg,
        fontWeight: '800',
        color: Colors.textPrimary,
        marginBottom: 14,
    },
    actionRow: { flexDirection: 'row', gap: 12, marginHorizontal: 16, marginTop: 12 },
    aboutCard: { margin: 16 },

    serviceTag: { paddingVertical: 6, borderBottomWidth: 1, borderBottomColor: Colors.border },
    serviceTagText: { fontSize: FontSize.md, color: Colors.textSecondary },
});
