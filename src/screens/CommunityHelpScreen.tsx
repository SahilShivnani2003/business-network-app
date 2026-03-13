import { View, TouchableOpacity, Text, ScrollView, StyleSheet } from 'react-native';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { HELP_REQUESTS } from '../data/mockData';
import { Button } from '../components/ui/Button';
import { Colors, FontSize } from '../theme/colors';

export const CommunityHelpScreen: React.FC<{ navigation: any }> = ({ navigation }) => (
    <View style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
                <Text style={styles.backText}>←</Text>
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Community Help</Text>
        </View>
        <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
            <Button
                label="+ Post Your Need"
                onPress={() => {}}
                variant="primary"
                fullWidth
                size="lg"
                style={{ marginBottom: 20 }}
            />
            {HELP_REQUESTS.map(req => (
                <Card key={req.id}>
                    <View style={styles.helpHeader}>
                        <Avatar name={req.author.name} size={40} />
                        <View style={{ flex: 1, marginLeft: 10 }}>
                            <Text style={styles.helpAuthor}>{req.author.name}</Text>
                            <Text style={styles.helpTime}>{req.postedAt}</Text>
                        </View>
                        <Badge label={req.category} size="sm" color={Colors.accent} />
                    </View>
                    <Text style={styles.helpRequest}>{req.request}</Text>
                    <View style={styles.helpFooter}>
                        <Text style={styles.helpResponses}>💬 {req.responses} responses</Text>
                        <Button label="Help →" onPress={() => {}} variant="ghost" size="sm" />
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
    helpHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
    helpAuthor: { fontSize: FontSize.md, fontWeight: '700', color: Colors.textPrimary },
    helpTime: { fontSize: 11, color: Colors.textMuted, marginTop: 1 },
    helpRequest: {
        fontSize: FontSize.md,
        color: Colors.textPrimary,
        lineHeight: 24,
        marginBottom: 14,
    },
    helpFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    helpResponses: { fontSize: FontSize.sm, color: Colors.textSecondary },
});
